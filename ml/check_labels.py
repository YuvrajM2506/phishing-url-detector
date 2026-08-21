import pandas as pd

DATASET_PATH = "data/dataset.csv"

df = pd.read_csv(DATASET_PATH)

print("Label counts:")
print(df["label"].value_counts())

print("\nLabel percentages:")
print(df["label"].value_counts(normalize=True) * 100)