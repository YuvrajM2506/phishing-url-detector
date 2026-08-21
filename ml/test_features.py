import sys

sys.path.append("../backend")

from services.feature_extractor import (
    extract_features,
    features_as_list,
    FEATURE_COLUMNS
)


test_url = "https://www.google.com/search?q=test"

print("Testing URL:")
print(test_url)

print("\n========== FEATURES ==========")

features = extract_features(test_url)

for name, value in features.items():
    print(f"{name}: {value}")

print("\n========== FEATURE LIST ==========")

values = features_as_list(test_url)

print(values)

print("\nNumber of features:", len(values))
print("Expected features:", len(FEATURE_COLUMNS))