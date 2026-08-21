import sys
import os
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

# Allow importing from backend
sys.path.append("../backend")

from services.feature_extractor import (
    extract_features,
    FEATURE_COLUMNS
)


# ==========================================
# 1. LOAD DATASET
# ==========================================

DATASET_PATH = "data/dataset.csv"

print("Loading dataset...")

df = pd.read_csv(DATASET_PATH)

print(f"Dataset loaded: {df.shape}")


# ==========================================
# 2. EXTRACT URL FEATURES
# ==========================================

print("\nExtracting URL features...")

X = []

for index, url in enumerate(df["URL"]):

    features = extract_features(url)

    X.append([
        features[column]
        for column in FEATURE_COLUMNS
    ])

    # Progress every 10,000 URLs
    if (index + 1) % 10000 == 0:
        print(
            f"Processed {index + 1:,} / "
            f"{len(df):,} URLs"
        )


X = pd.DataFrame(
    X,
    columns=FEATURE_COLUMNS
)

y = df["label"]


print("\nFeature extraction completed!")

print(f"Feature matrix shape: {X.shape}")


# ==========================================
# 3. TRAIN / TEST SPLIT
# ==========================================

print("\nSplitting dataset...")

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print(f"Training samples: {len(X_train):,}")
print(f"Testing samples: {len(X_test):,}")


# ==========================================
# 4. CREATE RANDOM FOREST
# ==========================================

print("\nCreating Random Forest model...")

model = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
    n_jobs=-1,
    class_weight="balanced"
)


# ==========================================
# 5. TRAIN MODEL
# ==========================================

print("Training model...")

model.fit(X_train, y_train)

print("Training completed!")


# ==========================================
# 6. PREDICTIONS
# ==========================================

print("\nMaking predictions...")

y_pred = model.predict(X_test)


# ==========================================
# 7. EVALUATION
# ==========================================

accuracy = accuracy_score(
    y_test,
    y_pred
)

print("\n========================================")
print("MODEL RESULTS")
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
# 8. FEATURE IMPORTANCE
# ==========================================

print("\nFeature Importance:")

importance = pd.Series(
    model.feature_importances_,
    index=FEATURE_COLUMNS
).sort_values(
    ascending=False
)

print(importance)


# ==========================================
# 9. SAVE MODEL
# ==========================================

MODEL_PATH = "models/phishing_model.pkl"

os.makedirs(
    "models",
    exist_ok=True
)

joblib.dump(
    model,
    MODEL_PATH
)

print(
    f"\nModel saved to: {MODEL_PATH}"
)