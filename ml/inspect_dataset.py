import pandas as pd

DATASET_PATH = "data/dataset.csv"

print("Loading dataset...")
df = pd.read_csv(DATASET_PATH)

print("\n========== DATASET SHAPE ==========")
print(df.shape)

print("\n========== COLUMNS ==========")
for i, column in enumerate(df.columns):
    print(f"{i}: {column}")

print("\n========== FIRST 5 ROWS ==========")
print(df.head())

print("\n========== DATA TYPES ==========")
print(df.dtypes)

print("\n========== MISSING VALUES ==========")
print(df.isnull().sum())

print("\n========== POSSIBLE LABEL COLUMNS ==========")
for column in df.columns:
    if df[column].nunique() <= 10:
        print(
            f"{column}: "
            f"unique={df[column].nunique()}, "
            f"values={df[column].unique()}"
        )