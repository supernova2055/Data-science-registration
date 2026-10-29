# Python Data Science Extension

This is a **local exploratory analysis starter**, not a validated statistical study or a public student-level analytics service.

## Install and run
From the repository root after the Node.js/MySQL setup:
```bash
python -m venv .venv
# macOS/Linux: source .venv/bin/activate
# Windows PowerShell: .venv\\Scripts\\Activate.ps1
python -m pip install -r python/requirements.txt
python python/analyze.py
```

The script uses the same local `.env` MySQL credentials as Node.js; it does not need a separate database. It blocks all analysis until **11** records are present. It saves PNG charts under `python/output/` (gitignored).

## Implemented methods
- Pandas descriptive age statistics and demographics.
- A 10-year-band age histogram, with displayed bins restricted to counts at least 5.
- A fitted normal reference curve and Shapiro-Wilk test (or D'Agostino-Pearson for >5000 records).
- Simple sklearn linear regression of **age vs registration order** for teaching purposes; slope and R² printed, fitted line saved.
- Gender and education-level bar charts with categories below 5 omitted.

## Interpretation limits
- **Normal distribution**: a reference bell curve is not evidence the population is normal. Small samples and discrete ages make test interpretation difficult.
- **Regression**: registration order is an arbitrary example numeric variable, **not an explanatory or causal feature**. Do not claim it predicts age or that an R² indicates a meaningful relationship. For useful regression, first define a real, ethically approved numeric research question and collect appropriate consenting data.
- **Privacy**: the script queries row-level values on the analyst's local computer. Never publish row-level datasets, screenshots showing individuals, hidden small groups, or database credentials. Suppression of small groups alone does not guarantee anonymity.
- **Minimum N**: the `>10` requirement is a project workflow gate, **not** a guarantee of statistical validity or privacy.

## Future tasks
1. Add a documented research question and meaningful numeric predictor (only with informed consent).
2. Add train/test evaluation, residual diagnostics and confidence intervals as appropriate.
3. Build a published dashboard from reviewed, access-controlled aggregate outputs only.
4. Create tests with **synthetic** fixtures for the 10-vs-11 boundary and chart generation.

## Random Forest learning extension

Run `python python/random_forest_demo.py` after installing `python/requirements.txt`. Read [Random Forest guide](../docs/RANDOM-FOREST.md). The script uses the existing MySQL registrations to check eligibility. With just 11 students it uses synthetic data for teaching rather than reporting misleading student predictions. Graph: `python/output/random_forest_importance.png`.
