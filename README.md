# 🛡️ Phishing URL Detector

An ML-powered web application that analyzes URLs and predicts whether they are **legitimate or potentially phishing**.

The project combines a **character-level TF-IDF machine learning model**, **Logistic Regression**, and a **FastAPI backend** to provide real-time URL risk analysis.

---

## 🚀 Features

- 🔍 Detect potentially phishing URLs
- 🤖 Machine Learning-based URL classification
- 📊 Phishing and legitimate probability scores
- ⚠️ Risk score and risk level
- 💡 Human-readable explanations for suspicious URL patterns
- ⚡ FastAPI REST API
- 🌐 Frontend integration through REST API
- 📚 Interactive Swagger API documentation
- 🔄 CORS enabled for frontend communication

---

## 🧠 Machine Learning

The project uses a **character-level TF-IDF representation of URLs** combined with **Logistic Regression**.

### Model Pipeline

```text
URL
 │
 ▼
Character-level TF-IDF
 │
 ▼
Logistic Regression
 │
 ▼
Phishing Probability
 │
 ├── Classification
 ├── Risk Score
 └── Risk Level