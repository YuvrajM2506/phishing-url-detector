import sys
import joblib
import pandas as pd

sys.path.append("../backend")

from services.feature_extractor import (
    extract_features,
    FEATURE_COLUMNS
)


# ==========================================
# LOAD MODEL
# ==========================================

MODEL_PATH = "models/phishing_model.pkl"

model = joblib.load(MODEL_PATH)

print("Model loaded successfully!")


# ==========================================
# TEST URL
# ==========================================

url = "https://www.google.com/search?q=test"

print("\nTesting URL:")
print(url)


# ==========================================
# EXTRACT FEATURES
# ==========================================

features = extract_features(url)

X = pd.DataFrame(
    [[features[column] for column in FEATURE_COLUMNS]],
    columns=FEATURE_COLUMNS
)

print("\nFeature DataFrame:")
print(X.to_string(index=False))


# ==========================================
# PREDICT
# ==========================================

prediction = model.predict(X)[0]

probabilities = model.predict_proba(X)[0]


# ==========================================
# RESULT
# ==========================================

print("\n========== PREDICTION ==========")

if prediction == 1:
    print("Classification: LEGITIMATE")
else:
    print("Classification: PHISHING")

print(f"Phishing probability: {probabilities[0]:.4f}")
print(f"Legitimate probability: {probabilities[1]:.4f}")