import joblib


# ==========================================
# LOAD MODEL + VECTORIZER
# ==========================================

MODEL_PATH = "models/phishing_tfidf_model.pkl"
VECTORIZER_PATH = "models/url_tfidf_vectorizer.pkl"

model = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)

print("Model and vectorizer loaded successfully!")


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
# TEST
# ==========================================

for url in test_urls:

    X = vectorizer.transform([url])

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