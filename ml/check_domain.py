import pandas as pd

df = pd.read_csv("data/dataset.csv")

# Find URLs containing github
matches = df[
    df["URL"]
    .astype(str)
    .str.lower()
    .str.contains("github", na=False)
]

print("Number of GitHub-related URLs:", len(matches))

print("\n========== MATCHES ==========")

if len(matches) > 0:
    print(
        matches[
            ["URL", "label"]
        ].to_string(index=False)
    )

    print("\n========== LABEL DISTRIBUTION ==========")

    print(
        matches["label"].value_counts()
    )
else:
    print("No GitHub URLs found.")