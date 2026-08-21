from pathlib import Path
from urllib.parse import urlparse
import ipaddress
import re

import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


# ==========================================
# PATHS
# ==========================================

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR.parent / "ml" / "models"

MODEL_PATH = MODEL_DIR / "phishing_tfidf_model.pkl"
VECTORIZER_PATH = MODEL_DIR / "url_tfidf_vectorizer.pkl"


# ==========================================
# LOAD MODEL
# ==========================================

print("Loading phishing detection model...")

model = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)

print("Model loaded successfully!")


# ==========================================
# FASTAPI APP
# ==========================================

app = FastAPI(
    title="Phishing URL Detector API",
    description="ML-powered phishing URL detection API",
    version="1.0.0"
)


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# REQUEST MODEL
# ==========================================

class URLRequest(BaseModel):
    url: str


# ==========================================
# EXPLANATION FUNCTION
# ==========================================

def generate_reasons(url: str, phishing_probability: float):

    reasons = []

    normalized_url = url.strip()

    if not normalized_url.startswith(("http://", "https://")):
        parsed = urlparse("http://" + normalized_url)
    else:
        parsed = urlparse(normalized_url)

    hostname = parsed.hostname or ""
    url_lower = normalized_url.lower()

    # HTTPS
    if parsed.scheme.lower() != "https":
        reasons.append(
            "Website does not use HTTPS"
        )

    # IP address
    try:
        ipaddress.ip_address(hostname)

        reasons.append(
            "URL uses an IP address instead of a domain name"
        )

    except ValueError:
        pass

    # Suspicious keywords
    suspicious_keywords = [
        "login",
        "signin",
        "verify",
        "verification",
        "account",
        "update",
        "secure",
        "password",
        "bank",
        "billing",
        "payment",
        "wallet",
        "confirm",
    ]

    found_keywords = [
        keyword
        for keyword in suspicious_keywords
        if keyword in url_lower
    ]

    if found_keywords:
        reasons.append(
            "Contains suspicious keyword(s): "
            + ", ".join(found_keywords)
        )

    # @ symbol
    if "@" in normalized_url:
        reasons.append(
            "Contains '@' symbol, which can hide the actual destination"
        )

    # URL length
    if len(normalized_url) > 100:
        reasons.append(
            "URL is unusually long"
        )

    # Many subdomains
    if len(hostname.split(".")) > 4:
        reasons.append(
            "Contains an unusually deep subdomain structure"
        )

    # URL encoding
    if re.search(
        r"%[0-9a-fA-F]{2}",
        normalized_url
    ):
        reasons.append(
            "Contains encoded characters"
        )

    # Hyphens
    if normalized_url.count("-") >= 3:
        reasons.append(
            "Contains multiple hyphens"
        )

    # Query parameters
    if normalized_url.count("?") > 0:

        if normalized_url.count("=") >= 3:
            reasons.append(
                "Contains many URL parameters"
            )

    # No suspicious patterns
    if not reasons:

        if phishing_probability < 0.30:
            reasons.append(
                "No major suspicious URL patterns detected"
            )
        else:
            reasons.append(
                "Model detected patterns associated with phishing URLs"
            )

    return reasons


# ==========================================
# ROOT ENDPOINT
# ==========================================

@app.get("/")
def home():

    return {
        "message": "Phishing URL Detector API is running",
        "version": "1.0.0"
    }


# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/health")
def health():

    return {
        "status": "healthy",
        "model_loaded": True
    }


# ==========================================
# PREDICTION ENDPOINT
# ==========================================

@app.post("/predict")
def predict(request: URLRequest):

    url = request.url.strip()

    # Validate URL
    if not url:

        raise HTTPException(
            status_code=400,
            detail="URL cannot be empty"
        )

    if len(url) > 5000:

        raise HTTPException(
            status_code=400,
            detail="URL is too long"
        )

    # Convert URL to TF-IDF
    X = vectorizer.transform([url])

    # Prediction
    prediction = model.predict(X)[0]

    probabilities = model.predict_proba(X)[0]

    phishing_probability = float(
        probabilities[0]
    )

    legitimate_probability = float(
        probabilities[1]
    )

    # Risk score
    risk_score = round(
        phishing_probability * 100,
        2
    )

    # Risk level
    if risk_score < 30:

        risk_level = "LOW"

    elif risk_score < 70:

        risk_level = "MEDIUM"

    else:

        risk_level = "HIGH"

    # Classification
    if prediction == 0:

        classification = "PHISHING"

    else:

        classification = "LEGITIMATE"

    # Generate explanations
    reasons = generate_reasons(
        url,
        phishing_probability
    )

    # Response
    return {
        "url": url,
        "classification": classification,
        "phishing_probability": round(
            phishing_probability,
            4
        ),
        "legitimate_probability": round(
            legitimate_probability,
            4
        ),
        "risk_score": risk_score,
        "risk_level": risk_level,
        "reasons": reasons
    }