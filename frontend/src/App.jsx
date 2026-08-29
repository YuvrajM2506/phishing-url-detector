import { useState } from "react";

import {
  ShieldCheck,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Brain,
  Zap,
  Info,
  History,
  Home,
  Link,
} from "lucide-react";

import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checkURL = async () => {
    if (!url.trim()) {
      setError("Please enter a URL to analyze.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/predict",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            url: url.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to analyze URL");
      }

      const data = await response.json();

      console.log("Backend response:", data);

      setResult(data);
    } catch (error) {
      console.error(error);

      setError(
        "Unable to connect to the backend. Make sure your FastAPI server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const getResultType = () => {
    if (!result) return "safe";

    if (result.risk_level === "HIGH") {
      return "danger";
    }

    if (result.risk_level === "MEDIUM") {
      return "warning";
    }

    return "safe";
  };

  const resultType = getResultType();

  const phishingPercentage =
    result ? (result.phishing_probability * 100).toFixed(2) : 0;

  const legitimatePercentage =
    result ? (result.legitimate_probability * 100).toFixed(2) : 0;

  return (
    <div className="app">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <div className="brand">

          <div className="brand-icon">
            <ShieldCheck size={30} />
          </div>

          <div>
            <h1>PhishGuard</h1>
            <span>AI-Powered URL Security</span>
          </div>

        </div>


        <div className="nav-links">

          <button className="nav-link active">
            <Home size={18} />
            Home
          </button>

          <button className="nav-link">
            <History size={18} />
            History
          </button>

          <button className="nav-link">
            <Info size={18} />
            About
          </button>

        </div>

      </nav>


      {/* ================= MAIN ================= */}

      <main className="main-content">


        {/* HERO */}

        <section className="hero">

          <div className="hero-icon">
            <ShieldCheck size={58} />
          </div>

          <h2>
            Check a <span>URL</span> Before You Click
          </h2>

          <p>
            Analyze a URL using machine learning and detect potential
            phishing threats before you visit it.
          </p>

        </section>


        {/* ================= URL CHECKER ================= */}

        <section className="checker-card">

          <div className="input-title">
            <Link size={22} />

            <label htmlFor="url">
              Enter a URL
            </label>
          </div>


          <div className="input-wrapper">

            <Search size={23} />

            <input
              id="url"
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  checkURL();
                }
              }}
            />

          </div>


          <button
            className="check-button"
            onClick={checkURL}
            disabled={loading}
          >

            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Analyzing URL...
              </>
            ) : (
              <>
                <ShieldCheck size={22} />
                Check URL
              </>
            )}

          </button>


          {error && (
            <div className="error-message">
              <AlertTriangle size={18} />
              {error}
            </div>
          )}

        </section>


        {/* ================= RESULT ================= */}

        {result && (

          <section className={`result-card ${resultType}`}>


            {/* RESULT HEADER */}

            <div className="result-header">

              <div className="result-main">

                <div className="result-icon">

                  {resultType === "danger" ? (
                    <XCircle size={48} />
                  ) : resultType === "warning" ? (
                    <AlertTriangle size={48} />
                  ) : (
                    <CheckCircle size={48} />
                  )}

                </div>


                <div>

                  <h3>

                    {resultType === "danger"
                      ? "PHISHING DETECTED"
                      : resultType === "warning"
                      ? "SUSPICIOUS URL"
                      : "LEGITIMATE"}

                  </h3>

                  <p>
                    Analysis completed
                  </p>

                </div>

              </div>


              <div className="status-badge">

                <ShieldCheck size={18} />

                {resultType === "danger"
                  ? "Unsafe"
                  : resultType === "warning"
                  ? "Use Caution"
                  : "Safe to Visit"}

              </div>

            </div>


            {/* RESULT STATISTICS */}

            <div className="result-grid">


              {/* RISK LEVEL */}

              <div className="stat-card">

                <ShieldCheck size={28} />

                <span>
                  Risk Level
                </span>

                <strong>
                  {result.risk_level}
                </strong>

                <small>
                  {result.risk_level === "LOW"
                    ? "Minimal Risk"
                    : result.risk_level === "MEDIUM"
                    ? "Moderate Risk"
                    : "High Risk"}
                </small>

              </div>


              {/* RISK SCORE */}

              <div className="stat-card">

                <div className="stat-icon-blue">
                  <Info size={28} />
                </div>

                <span>
                  Risk Score
                </span>

                <strong>
                  {Number(result.risk_score).toFixed(2)}%
                </strong>


                <div className="progress-bar">

                  <div
                    className="progress-fill risk-progress"
                    style={{
                      width: `${Math.min(
                        result.risk_score,
                        100
                      )}%`,
                    }}
                  ></div>

                </div>


                <small>
                  {result.risk_level === "LOW"
                    ? "Very Low Risk"
                    : result.risk_level === "MEDIUM"
                    ? "Moderate Risk"
                    : "High Risk"}
                </small>

              </div>


              {/* PHISHING PROBABILITY */}

              <div className="stat-card">

                <AlertTriangle size={28} />

                <span>
                  Phishing Probability
                </span>

                <strong>
                  {phishingPercentage}%
                </strong>


                <div className="progress-bar">

                  <div
                    className="progress-fill phishing-progress"
                    style={{
                      width: `${phishingPercentage}%`,
                    }}
                  ></div>

                </div>


                <small>
                  {phishingPercentage < 25
                    ? "Very Low"
                    : phishingPercentage < 60
                    ? "Moderate"
                    : "Very High"}
                </small>

              </div>


              {/* LEGITIMATE PROBABILITY */}

              <div className="stat-card">

                <CheckCircle size={28} />

                <span>
                  Legitimate Probability
                </span>

                <strong>
                  {legitimatePercentage}%
                </strong>


                <div className="progress-bar">

                  <div
                    className="progress-fill legitimate-progress"
                    style={{
                      width: `${legitimatePercentage}%`,
                    }}
                  ></div>

                </div>


                <small>
                  {legitimatePercentage > 75
                    ? "Very High"
                    : legitimatePercentage > 40
                    ? "Moderate"
                    : "Low"}
                </small>

              </div>

            </div>


            {/* REASONS */}

            {result.reasons && result.reasons.length > 0 && (

              <div className="reasons">

                <h4>
                  Why this result?
                </h4>


                <ul>

                  {result.reasons.map(
                    (reason, index) => (

                      <li key={index}>
                        {reason}
                      </li>

                    )
                  )}

                </ul>

              </div>

            )}

          </section>

        )}


        {/* ================= FEATURES ================= */}

        <section className="features">


          <div className="feature-card">

            <div className="feature-icon blue">
              <Brain size={27} />
            </div>

            <div>

              <h3>
                Machine Learning Detection
              </h3>

              <p>
                Analyze URLs using a trained machine
                learning model built for phishing detection.
              </p>

            </div>

          </div>


          <div className="feature-card">

            <div className="feature-icon purple">
              <ShieldCheck size={27} />
            </div>

            <div>

              <h3>
                Risk Assessment
              </h3>

              <p>
                Get a clear risk level, score and
                probability breakdown for every URL.
              </p>

            </div>

          </div>


          <div className="feature-card">

            <div className="feature-icon yellow">
              <Zap size={27} />
            </div>

            <div>

              <h3>
                Instant Results
              </h3>

              <p>
                Receive real-time analysis and insights
                to stay safer online.
              </p>

            </div>

          </div>


        </section>


      </main>


      {/* ================= FOOTER ================= */}

      <footer>

        <div>
          <ShieldCheck size={18} />
          <strong>PhishGuard</strong>
          <span>• AI-Based Phishing URL Detection</span>
        </div>

        <p>
          Stay safe. <span>Think before you click.</span>
        </p>

      </footer>

    </div>
  );
}

export default App;