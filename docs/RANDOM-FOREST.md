# Random Forest learning module

Random Forest is an ensemble of decision trees. For regression it averages the predictions from many trees; for classification it combines their votes or probabilities. It can learn nonlinear patterns, unlike a simple straight-line regression.

## Run with the existing database

From the repository root, after Node.js/MySQL and Python dependencies are configured:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r python/requirements.txt
python python/random_forest_demo.py
```

The script connects to the **same MySQL database** as Node.js, checks the existing count, then:
- With **11–19** students, uses a clearly labeled *synthetic* teaching dataset; it does not pretend 11 real students support a meaningful trained model.
- With **20+** records, offers a local *exploratory only* example modeling age from education-level and country categories.
- Uses a random train/test split, compares Random Forest mean absolute error against a mean-only baseline, and saves `python/output/random_forest_importance.png`.

This is not a validated scientific model. Twenty students are still far too few for many reliable modeling tasks. The sample has no established causal research question. Do not use predictions about individual students, publish row-level data, claim fairness or generalizability, or expose model outputs as public analytics. Even aggregate charts or feature names can reveal small groups; review privacy and consent before working with real student data.

## Future work
1. Define a meaningful outcome and an ethically justified set of predictors.
2. Gather a sufficiently large, consented dataset.
3. Create training, validation, and untouched test data; use cross-validation.
4. Compare against simple baselines and measure uncertainty.
5. Inspect leakage, overfitting, category imbalance, fairness and privacy.
6. Only publish reviewed aggregate results.
