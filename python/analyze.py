"""Local-only exploratory analysis; run after at least 11 consenting students."""
import os
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from dotenv import load_dotenv
import mysql.connector
from scipy.stats import normaltest, norm, shapiro
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")
OUT = ROOT / "python" / "output"
OUT.mkdir(parents=True, exist_ok=True)

def main():
    connection = mysql.connector.connect(
        host=os.getenv("DB_HOST", "127.0.0.1"),
        port=int(os.getenv("DB_PORT", "3306")),
        user=os.getenv("DB_USER", "student_app"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME", "student_demographics"),
    )
    try:
        cursor = connection.cursor()
        cursor.execute("SELECT COUNT(*) FROM students")
        total = int(cursor.fetchone()[0])
        if total < 11:
            print(f"Only {total} registrations. At least 11 are required.")
            return
        # For a locally authorized analyst only; do not expose individual records
        # to the public dashboard or commit exports to GitHub.
        cursor.execute("SELECT age, gender, education_level, registered_at FROM students ORDER BY registered_at, id")
        data = pd.DataFrame(cursor.fetchall(), columns=["age", "gender", "education_level", "registered_at"])
    finally:
        cursor.close()
        connection.close()

    ages = pd.to_numeric(data["age"]).to_numpy(dtype=float)
    print(f"Students: {len(ages)}; mean age: {ages.mean():.2f}; standard deviation: {ages.std(ddof=1):.2f}")
    print("Note: normality tests have low power with small samples; interpret with plots.")
    if len(ages) >= 8:
        if len(ages) <= 5000:
            stat, p = shapiro(ages)
            print(f"Shapiro-Wilk normality p-value: {p:.4g}")
        else:
            stat, p = normaltest(ages)
            print(f"D'Agostino-Pearson normality p-value: {p:.4g}")
    else:
        print("Too few observations for normality testing.")
    # Choose broader bins to reduce small-cell disclosure risk.
    low = int(np.floor(min(ages) / 10) * 10)
    high = int(np.ceil((max(ages) + 1) / 10) * 10)
    bins = np.arange(low, high + 10, 10)
    counts, edges = np.histogram(ages, bins=bins)
    fig, ax = plt.subplots(figsize=(8, 5))
    for i, count in enumerate(counts):
        if count >= 5:
            ax.bar(edges[i] + 0.5, count, width=9, align="edge", edgecolor="black")
    ax.set(xlabel="Age (10-year bands; groups under 5 hidden)", ylabel="Number of students", title="Age distribution")
    fig.tight_layout()
    fig.savefig(OUT / "age_histogram.png", dpi=150)
    plt.close(fig)

    fig, ax = plt.subplots(figsize=(8, 5))
    mu, sd = ages.mean(), ages.std(ddof=1)
    if sd > 0:
        # Normal reference curve is not proof ages follow a normal distribution.
        x = np.linspace(mu - 3 * sd, mu + 3 * sd, 250)
        ax.plot(x, norm.pdf(x, mu, sd), label="Fitted normal reference")
        ax.legend()
    else:
        ax.text(.5, .5, "No variation in recorded ages", ha="center", transform=ax.transAxes)
    ax.set(xlabel="Age", ylabel="Probability density", title="Normal distribution reference (illustrative)")
    fig.tight_layout()
    fig.savefig(OUT / "normal_reference.png", dpi=150)
    plt.close(fig)

    # Demonstration ONLY: registration index is not a scientifically causal predictor.
    # Fitting a regression to it does not establish meaningful predictive relationships.
    x = np.arange(len(ages)).reshape(-1, 1)
    model = LinearRegression().fit(x, ages)
    prediction = model.predict(x)
    fig, ax = plt.subplots(figsize=(8, 5))
    ax.plot(x[:, 0] + 1, prediction, label="Fitted regression line")
    ax.set(xlabel="Registration order", ylabel="Predicted age", title="Exploratory linear regression (no individual dots)")
    ax.legend()
    fig.tight_layout()
    fig.savefig(OUT / "linear_regression.png", dpi=150)
    plt.close(fig)
    print(f"Linear regression (age vs registration order) slope: {model.coef_[0]:.4f}; R²: {r2_score(ages, prediction):.4f}")
    print("Warning: this illustrative predictor is not meaningful for causal or forecasting claims.")

    # Hide categorical groups with fewer than five rows.
    for col in ["gender", "education_level"]:
        values = data[col].value_counts()
        values = values[values >= 5]
        if values.empty:
            continue
        fig, ax = plt.subplots(figsize=(8, 5))
        values.plot(kind="bar", ax=ax)
        ax.set(xlabel=col.replace("_", " ").title(), ylabel="Students", title=f"Students by {col.replace('_',' ')} (groups >= 5)")
        fig.tight_layout()
        fig.savefig(OUT / f"{col}_counts.png", dpi=150)
        plt.close(fig)
    print(f"Saved charts locally to {OUT} (excluded from Git).")

if __name__ == "__main__":
    main()
