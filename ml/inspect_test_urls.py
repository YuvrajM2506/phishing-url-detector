import sys

sys.path.append("../backend")

from services.feature_extractor import extract_features


test_urls = [
    "https://www.google.com",
    "https://github.com",
    "https://www.microsoft.com",
    "https://www.wikipedia.org",
]


for url in test_urls:

    print("\n" + "=" * 70)
    print("URL:", url)

    features = extract_features(url)

    for name, value in features.items():
        print(f"{name:<30}: {value}")