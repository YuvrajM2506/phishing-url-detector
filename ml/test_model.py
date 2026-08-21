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
# TEST URLS
# ==========================================

test_urls = [

    # Legitimate examples
    "https://www.google.com",
    "https://github.com",
    "https://www.microsoft.com",
    "https://www.wikipedia.org",

    # Suspicious-looking examples
    "http://paypal-login-verify.com/account",
    "http://secure-bank-login.com/verify",
    "http://192.168.1.100/login",
    "http://account-verification-login.com/update",

]


# ==========================================
# TEST EACH URL
# ==========================================

for url in test_urls:

    features = extract_features(url)

    X = pd.DataFrame(
        [[features[column] for column in FEATURE_COLUMNS]],
        columns=FEATURE_COLUMNS
    )

    prediction = model.predict(X)[0]

    probabilities = model.predict_proba(X)[0]

    phishing_probability = probabilities[0]

    legitimate_probability = probabilities[1]

    if prediction == 1:
        classification = "LEGITIMATE"
    else:
        classification = "PHISHING"

    print("\n" + "=" * 70)

    print(f"URL: {url}")

    print(f"Classification: {classification}")

    print(
        f"Phishing probability: "
        f"{phishing_probability:.2%}"
    )

    print(
        f"Legitimate probability: "
        f"{legitimate_probability:.2%}"
    )