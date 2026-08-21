import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)


# ==========================================
# 1. LOAD DATASET
# ==========================================

DATASET_PATH = "data/dataset.csv"

print("Loading dataset...")

df = pd.read_csv(DATASET_PATH)

print(f"Dataset loaded: {df.shape}")


# ==========================================
# 2. PREPARE URL TEXT
# ==========================================

urls = df["URL"].astype(str)

y = df["label"]


# ==========================================
# 3. TRAIN / TEST SPLIT
# ==========================================

print("\nSplitting dataset...")

X_train, X_test, y_train, y_test = train_test_split(
    urls,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print(f"Training samples: {len(X_train):,}")
print(f"Testing samples: {len(X_test):,}")


# ==========================================
# 4. TF-IDF
# ==========================================

print("\nCreating character-level TF-IDF...")

vectorizer = TfidfVectorizer(
    analyzer="char",
    ngram_range=(3, 5),
    min_df=2,
    max_features=100000,
    lowercase=True
)

X_train_tfidf = vectorizer.fit_transform(X_train)

X_test_tfidf = vectorizer.transform(X_test)

print(
    f"TF-IDF training matrix: "
    f"{X_train_tfidf.shape}"
)


# ==========================================
# 5. LOGISTIC REGRESSION
# ==========================================

print("\nCreating Logistic Regression model...")

model = LogisticRegression(
    max_iter=1000,
    class_weight="balanced",
    random_state=42
)


# ==========================================
# 6. TRAIN
# ==========================================

print("Training model...")

model.fit(
    X_train_tfidf,
    y_train
)

print("Training completed!")


# ==========================================
# 7. PREDICT
# ==========================================

print("\nMaking predictions...")

y_pred = model.predict(
    X_test_tfidf
)


# ==========================================
# 8. EVALUATE
# ==========================================

accuracy = accuracy_score(
    y_test,
    y_pred
)

print("\n========================================")
print("MODEL V2 RESULTS")
print("========================================")

print(f"\nAccuracy: {accuracy:.4f}")

print("\nClassification Report:")

print(
    classification_report(
        y_test,
        y_pred,
        target_names=[
            "Phishing",
            "Legitimate"
        ]
    )
)

print("\nConfusion Matrix:")

print(
    confusion_matrix(
        y_test,
        y_pred
    )
)


# ==========================================
# 9. SAVE MODEL
# ==========================================

MODEL_PATH = "models/phishing_tfidf_model.pkl"

joblib.dump(
    model,
    MODEL_PATH
)

joblib.dump(
    vectorizer,
    "models/url_tfidf_vectorizer.pkl"
)

print("\nModels saved:")

print(
    f"Classifier: {MODEL_PATH}"
)

print(
    "Vectorizer: "
    "models/url_tfidf_vectorizer.pkl"
)