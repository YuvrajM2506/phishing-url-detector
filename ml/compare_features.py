import sys
import pandas as pd

sys.path.append("../backend")

from services.feature_extractor import (
    extract_features,
    FEATURE_COLUMNS
)

# Load dataset
df = pd.read_csv("data/dataset.csv")

# Select first URL
row = df.iloc[0]

url = row["URL"]

print("URL:")
print(url)

print("\nActual label:")
print(row["label"])

# Extract features using our backend extractor
our_features = extract_features(url)

print("\n========== FEATURE COMPARISON ==========")

for feature in FEATURE_COLUMNS:
    dataset_value = row[feature]
    our_value = our_features[feature]

    print(
        f"{feature:<30} "
        f"Dataset: {dataset_value:<15} "
        f"Our: {our_value}"
    )