"""Educational Random Forest using MySQL registrations, local use only.
With small cohorts results are unstable; do not use to judge students.
"""
import os
from pathlib import Path
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import mysql.connector
from dotenv import load_dotenv
from sklearn.ensemble import RandomForestRegressor
from sklearn.dummy import DummyRegressor
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import train_test_split

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")
OUT = ROOT / "python" / "output"
OUT.mkdir(parents=True, exist_ok=True)

def run():
    db = mysql.connector.connect(
        host=os.getenv("DB_HOST", "127.0.0.1"),
        port=int(os.getenv("DB_PORT", "3306")),
        user=os.getenv("DB_USER", "student_app"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME", "student_demographics")
    )
    try:
        cursor = db.cursor()
        cursor.execute("SELECT COUNT(*) FROM students")
        total = int(cursor.fetchone()[0])
        if total < 11:
            print(f"At least 11 registrations required; found {total}.")
            return
        # Aggregate-level features constructed from the existing rows.
        # Age is the illustrative outcome; categorical fields are not suitable
        # for deployment or student decisions without ethical review.
        cursor.execute("SELECT age, education_level, country FROM students")
        rows = cursor.fetchall()
    finally:
        cursor.close()
        db.close()

    df = pd.DataFrame(rows, columns=["age", "education_level", "country"])
    if len(df) < 20:
        print(f"Only {len(df)} students: skip train/test Random Forest evaluation.")
        print("At this size, any predictive score would be too unstable to interpret.")
        print("Use the synthetic teaching demonstration below instead.")
        rng = np.random.default_rng(42)
        n = 200
        x = rng.uniform(0, 10, n)
        y = 2 + .7*x + 2*np.sin(x) + rng.normal(0, .6, n)
        demo = pd.DataFrame({"synthetic_numeric_predictor": x})
        X, y = demo, y
        source = "SYNTHETIC data (not students)"
    else:
        X = pd.get_dummies(df[["education_level", "country"]], dtype=float)
        y = pd.to_numeric(df["age"]).to_numpy()
        source = "Local student records — exploratory only"
        if y.std() == 0 or X.shape[1] == 0:
            print("Insufficient target variation / feature information.")
            return

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=.25, random_state=42)
    forest = RandomForestRegressor(n_estimators=120, min_samples_leaf=3, random_state=42)
    baseline = DummyRegressor(strategy="mean")
    forest.fit(X_train, y_train)
    baseline.fit(X_train, y_train)
    print(source)
    print(f"Random Forest MAE: {mean_absolute_error(y_test, forest.predict(X_test)):.3f}")
    print(f"Baseline MAE: {mean_absolute_error(y_test, baseline.predict(X_test)):.3f}")
    print("This comparison is a learning exercise, not a validated prediction.")

    importance = pd.Series(forest.feature_importances_, index=X.columns).sort_values(ascending=False).head(8)
    fig, ax = plt.subplots(figsize=(8, 5))
    importance.sort_values().plot(kind="barh", ax=ax)
    ax.set(xlabel="Impurity-based feature importance (illustrative)", title=f"Random Forest — {source}")
    fig.tight_layout()
    fig.savefig(OUT / "random_forest_importance.png", dpi=150)
    plt.close(fig)
    print("Saved plot:", OUT / "random_forest_importance.png")

if __name__ == "__main__":
    run()
