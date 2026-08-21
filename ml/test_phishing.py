import pandas as pd
import joblib


MODEL_PATH = "models/phishing_tfidf_model.pkl"
VECTORIZER_PATH = "models/url_tfidf_vectorizer.pkl"

model = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)

df = pd.read_csv("data/dataset.csv")

# Get phishing URLs
phishing = df[df["label"] == 0].sample(
    20,
    random_state=42
)

print("Testing 20 phishing URLs...\n")

correct = 0

for _, row in phishing.iterrows():

    url = row["URL"]

    X = vectorizer.transform([url])

    prediction = model.predict(X)[0]

    probability = model.predict_proba(X)[0]

    phishing_probability = probability[0]

    result = "LEGITIMATE" if prediction == 1 else "PHISHING"

    if prediction == 0:
        correct += 1

    print("=" * 70)
    print("URL:", url)
    print("Actual: PHISHING")
    print("Predicted:", result)
    print(
        f"Phishing probability: "
        f"{phishing_probability:.2%}"
    )

print("\n" + "=" * 70)
print(f"Correct: {correct}/20")
print(f"Accuracy: {correct / 20:.2%}")
