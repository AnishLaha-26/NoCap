import React, { useState } from 'react';

interface FactCheckResult {
  credibility_score: number;
  fake_news_likelihood_percentage: number;
  fact_check_reasoning: string;
  confidence: string;
  key_claims: string[];
  red_flags: string[];
  recommendation: string;
}

interface AnalysisResponse {
  url: string;
  extracted_text: string;
  fact_check_result: FactCheckResult;
  status: string;
}



const FakeNews: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Base URL for the backend API
  const API_BASE_URL = 'https://nocap-be.onrender.com';

  const analyzeNews = async () => {
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/fake-news-detection/analyze/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze the article');
      }

      if (data.status === 'success') {
        setResult(data);
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setUrl('');
    setResult(null);
    setError(null);
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'trustworthy': return '#4CAF50';
      case 'verify_sources': return '#FF9800';
      case 'suspicious': return '#F44336';
      default: return '#757575';
    }
  };

  const getRecommendationText = (recommendation: string) => {
    switch (recommendation) {
      case 'trustworthy': return 'Trustworthy';
      case 'verify_sources': return 'Verify Sources';
      case 'suspicious': return 'Suspicious';
      default: return recommendation;
    }
  };

  return (
    <div className="page-container">
      <div className="tab-content">
        <div className="content-header">
          <h2>Fake News Detector</h2>
          <p>Enter a news article URL to verify its authenticity</p>
        </div>
        <div className="news-detector-interface">
          <div className="input-options">
            <button className="input-type-button active">URL Input</button>
          </div>
          <input
            type="url"
            placeholder="https://example.com/news-article"
            className="text-input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
          />

          <div className="detector-controls">
            <button 
              className="analyze-button" 
              onClick={analyzeNews}
              disabled={loading || !url.trim()}
            >
              {loading ? 'Analyzing...' : 'Verify News'}
            </button>
            <button className="clear-button" onClick={clearResults}>Clear</button>
          </div>

          {error && (
            <div className="error-message">
              <p style={{ color: '#F44336', marginTop: '1rem' }}>{error}</p>
            </div>
          )}

          {result && (
            <div className="analysis-results">
              <div className="result-header">
                <h3>Analysis Results</h3>
                <div className="credibility-score">
                  <span className="score-label">Credibility Score:</span>
                  <span className="score-value" style={{ color: result.fact_check_result.credibility_score >= 70 ? '#4CAF50' : result.fact_check_result.credibility_score >= 50 ? '#FF9800' : '#F44336' }}>
                    {result.fact_check_result.credibility_score}/100
                  </span>
                </div>
              </div>

              <div className="result-section">
                <h4>Recommendation</h4>
                <div className="recommendation" style={{ color: getRecommendationColor(result.fact_check_result.recommendation) }}>
                  <strong>{getRecommendationText(result.fact_check_result.recommendation)}</strong>
                  <span className="likelihood">({result.fact_check_result.fake_news_likelihood_percentage}% likelihood of being fake)</span>
                </div>
              </div>

              <div className="result-section">
                <h4>Analysis Reasoning</h4>
                <p>{result.fact_check_result.fact_check_reasoning}</p>
              </div>

              <div className="result-section">
                <h4>Key Claims Identified</h4>
                <ul>
                  {result.fact_check_result.key_claims.map((claim, index) => (
                    <li key={index}>{claim}</li>
                  ))}
                </ul>
              </div>

              {result.fact_check_result.red_flags.length > 0 && (
                <div className="result-section">
                  <h4>Red Flags</h4>
                  <ul className="red-flags">
                    {result.fact_check_result.red_flags.map((flag, index) => (
                      <li key={index} style={{ color: '#F44336' }}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="result-section">
                <h4>Article Preview</h4>
                <p className="extracted-text">{result.extracted_text}</p>
              </div>

              <div className="result-section">
                <h4>Analysis Details</h4>
                <p><strong>Confidence Level:</strong> {result.fact_check_result.confidence}</p>
                <p><strong>Source URL:</strong> <a href={result.url} target="_blank" rel="noopener noreferrer">{result.url}</a></p>
              </div>
            </div>
          )}

          {!result && !error && !loading && (
            <div className="result-placeholder">
              <p>Verification results will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FakeNews;

 

