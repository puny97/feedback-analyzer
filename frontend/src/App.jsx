import { useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;
const exampleReview =
  "The food arrived quickly and tasted great. I would definitely order again!";

function App() {
  const [review, setReview] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const text = review.trim();

    if (!text) {
      setError("Write a review before starting the analysis.");
      setAnalysis(null);
      return;
    }

    setError("");
    setAnalysis(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        let detail = "";
        try {
          const body = await response.json();
          detail = typeof body.detail === "string" ? body.detail : "";
        } catch {
          // Keep the HTTP status message when the server does not return JSON.
        }
        throw new Error(
          detail || `The analysis request failed (${response.status}).`,
        );
      }

      const result = await response.json();
      if (
        !result ||
        typeof result.label !== "string" ||
        typeof result.theme !== "string" ||
        !Number.isFinite(result.score)
      ) {
        throw new Error("The server returned an unexpected analysis result.");
      }

      setAnalysis(result);
    } catch (requestError) {
      setError(
        requestError instanceof TypeError
          ? "Could not reach the analysis server. Make sure the backend is running, then try again."
          : requestError.message || "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleReviewChange(event) {
    setReview(event.target.value);
    setAnalysis(null);
    setError("");
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Reviewly home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M5 5.75A2.75 2.75 0 0 1 7.75 3h8.5A2.75 2.75 0 0 1 19 5.75v7.5A2.75 2.75 0 0 1 16.25 16H11l-4.5 4v-4.2A2.75 2.75 0 0 1 5 13.25v-7.5Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <path
                d="m9 9.5 2 2 4-4"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span>reviewly</span>
        </a>
        <span className="topbar-note">
          <span className="status-dot" />
          AI-powered review insights
        </span>
      </header>

      <section className="hero">
        <div className="eyebrow">
          <span className="eyebrow-sparkle" aria-hidden="true">
            ✳
          </span>
          CUSTOMER FEEDBACK, MADE CLEAR
        </div>
        <h1>
          Every review has
          <br />
          <span>a story to tell.</span>
        </h1>
        <p className="hero-copy">
          Find the feeling behind the feedback. Paste a customer review and get
          a clear read on its sentiment, score, and main topic.
        </p>
      </section>

      <section className="workspace" aria-label="Review analysis">
        <form className="review-card" onSubmit={handleSubmit}>
          <div className="card-heading">
            <div>
              <span className="step-label">YOUR REVIEW</span>
              <h2>What did your customer say?</h2>
            </div>
            <span className="input-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 3.75h7l5 5v11.5H7a2 2 0 0 1-2-2v-12.5a2 2 0 0 1 2-2Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 4v5h5M8.5 13h7M8.5 16.5h7"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>

          <label className="visually-hidden" htmlFor="review">
            Customer review
          </label>
          <textarea
            id="review"
            value={review}
            onChange={handleReviewChange}
            placeholder="“The delivery was right on time, and everything tasted amazing...”"
            rows={6}
            disabled={isLoading}
          />

          <div className="input-footer">
            <button
              className="example-button"
              type="button"
              onClick={() => {
                setReview(exampleReview);
                setAnalysis(null);
                setError("");
              }}
              disabled={isLoading}
            >
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M10 2.5v15M2.5 10h15"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
              Try an example
            </button>
            <span className="character-count">
              {review.length} {review.length === 1 ? "character" : "characters"}
            </span>
          </div>

          {error && (
            <p className="error-message" role="alert">
              <span aria-hidden="true">!</span>
              {error}
            </p>
          )}

          <button className="analyze-button" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Reading your review…
              </>
            ) : (
              <>
                Analyze review
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path
                    d="M4 10h12m-5-5 5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </>
            )}
          </button>
        </form>

        <aside className={`result-card${analysis ? " has-result" : ""}`}>
          <div className="result-header">
            <span className="step-label">THE READOUT</span>
            <span className="result-sparkle" aria-hidden="true">
              ✳
            </span>
          </div>

          {analysis ? (
            <div className="analysis-result" aria-live="polite">
              <span
                className={`sentiment-badge ${analysis.label.toLowerCase()}`}
              >
                <span className="sentiment-dot" />
                {analysis.label}
              </span>
              <h2 className="result-title">Here&apos;s the big picture.</h2>
              <div className="score-panel">
                <div>
                  <span className="result-caption">OVERALL SCORE</span>
                  <div className="score-value">
                    {analysis.score}
                    <span>/ 5</span>
                  </div>
                </div>
                <div
                  className="score-stars"
                  aria-label={`${analysis.score} out of 5`}
                >
                  {Array.from({ length: 5 }, (_, index) => (
                    <span
                      className={
                        index < analysis.score ? "star filled" : "star"
                      }
                      key={index}
                      aria-hidden="true"
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <div className="theme-panel">
                <span className="theme-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 19.5h16M6.5 16V9m5 7V4.5m5 11.5v-4"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span>
                  <span className="result-caption">MAIN THEME</span>
                  <strong>{analysis.theme}</strong>
                </span>
              </div>
              <p className="result-footnote">
                A quick snapshot of what matters most in this review.
              </p>
            </div>
          ) : (
            <div className="empty-result" aria-live="polite">
              <div className="empty-illustration" aria-hidden="true">
                <span className="orbit orbit-one" />
                <span className="orbit orbit-two" />
                <span className="orbit orbit-three" />
                <span className="illustration-card">
                  <span className="illustration-line line-long" />
                  <span className="illustration-line" />
                  <span className="illustration-line line-short" />
                  <span className="illustration-star">✳</span>
                </span>
              </div>
              <h2>Your insights will land here.</h2>
              <p>
                Add a review and hit analyze. We&apos;ll uncover the sentiment,
                score, and topic in seconds.
              </p>
              <div className="insight-tags" aria-label="Analysis includes">
                <span>Sentiment</span>
                <span>Score</span>
                <span>Theme</span>
              </div>
            </div>
          )}
        </aside>
      </section>

      <footer className="page-footer">
        <span>One review at a time. A little more understood.</span>
        <span className="footer-note">
          Made for better listening <span aria-hidden="true">♡</span>
        </span>
      </footer>
    </main>
  );
}

export default App;
