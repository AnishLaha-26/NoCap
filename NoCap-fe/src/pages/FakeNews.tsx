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
  const [textInput, setTextInput] = useState('');
  const [isUrlInput, setIsUrlInput] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<React.ReactNode>(null);

  // Base URL for the backend API
  const API_BASE_URL = 'https://nocap-be.onrender.com';

  const analyzeNews = async () => {
    const inputToAnalyze = isUrlInput ? url.trim() : textInput.trim();
    
    if (!inputToAnalyze) {
      setError(isUrlInput ? 'Please enter a valid URL' : 'Please enter some text to analyze');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const requestBody = isUrlInput 
        ? { url: inputToAnalyze }
        : { text: inputToAnalyze };

      const response = await fetch(`${API_BASE_URL}/api/fake-news-detection/analyze/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
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
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      
      // Check for 403 Forbidden or blocked access
      if (errorMessage.includes('403') || errorMessage.toLowerCase().includes('forbidden') || 
          errorMessage.toLowerCase().includes('blocked') || errorMessage.toLowerCase().includes('access denied')) {
        try {
          const domain = new URL(url).hostname.replace('www.', '');
          setError(
            <div style={{
              padding: '1rem',
              borderRadius: '8px',
              backgroundColor: '#2d1a1a',
              border: '1px solid #5c2b2b',
              color: '#ffcdd2',
              margin: '1rem 0'
            }}>
              <h3 style={{
                color: '#ff8a80',
                marginTop: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>🔒</span> Access to {domain} Blocked
              </h3>
              <p>We couldn't access this URL because the website has security measures that prevent automated access.</p>
              
              <div style={{
                backgroundColor: '#3a2525',
                padding: '1rem',
                borderRadius: '6px',
                margin: '1rem 0'
              }}>
                <p style={{ fontWeight: 'bold', marginTop: 0 }}>Here's what you can do:</p>
                <ol style={{ paddingLeft: '1.5rem', margin: '0.5rem 0' }}>
                  <li>Switch to <strong>Text Input</strong> mode using the toggle above</li>
                  <li>Manually copy the article text from the website</li>
                  <li>Paste it into the text area below</li>
                  <li>Click "Analyze" to check the content</li>
                </ol>
              </div>
              
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(url);
                  // Optional: Add a toast notification here
                }}
                style={{
                  backgroundColor: '#5c2b2b',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  margin: '0.5rem 0'
                }}
              >
                📋 Copy URL to Clipboard
              </button>
              
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem',
                backgroundColor: '#3a2525',
                borderRadius: '6px',
                fontSize: '0.9em',
                fontStyle: 'italic'
              }}>
                <p style={{ margin: '0.5rem 0' }}>ℹ️ <strong>Why this happens:</strong> Many websites implement security measures to prevent automated access, which is why we can't directly analyze their content.</p>
              </div>
            </div>
          );
        } catch (e) {
          // If URL parsing fails, fall back to generic error
          setError('This website cannot be accessed automatically. Please try copying and pasting the text instead.');
        }
      } 
      // Check for Reddit's protection message
      else if (url.toLowerCase().includes('reddit.com')) {
        setError(
          <div style={{
            padding: '1rem',
            borderRadius: '8px',
            backgroundColor: '#2d1a1a',
            border: '1px solid #5c2b2b',
            color: '#ffcdd2',
            margin: '1rem 0'
          }}>
            <h3 style={{
              color: '#ff8a80',
              marginTop: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>🔒</span> Reddit Access Restricted
            </h3>
            <p>Reddit has protection against automated access. Please copy and paste the text you want to analyze instead of using the URL.</p>
            <button 
              onClick={() => setIsUrlInput(false)}
              style={{
                backgroundColor: '#5c2b2b',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              ✏️ Switch to Text Input
            </button>
          </div>
        );
      } 
      else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setUrl('');
    setTextInput('');
    setResult(null);
    setError(null);
  };

  const toggleInputType = () => {
    setIsUrlInput(!isUrlInput);
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

  // Error display component
  const renderError = (error: React.ReactNode) => {
    if (typeof error === 'string') {
      return <div className="error-message">{error}</div>;
    }
    return error;
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
            <div className="toggle-container" style={{ marginBottom: '1rem' }}>
              <button 
                onClick={toggleInputType}
                className={`toggle-btn ${isUrlInput ? 'active' : ''}`}
                style={{
                  padding: '8px 16px',
                  marginRight: '8px',
                  backgroundColor: isUrlInput ? '#1a73e8' : '#2d3748',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                URL
              </button>
              <button 
                onClick={toggleInputType}
                className={`toggle-btn ${!isUrlInput ? 'active' : ''}`}
                style={{
                  padding: '8px 16px',
                  backgroundColor: !isUrlInput ? '#1a73e8' : '#2d3748',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Text
              </button>
            </div>
            {isUrlInput ? (
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter news article URL"
                className="url-input"
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '1rem',
                  borderRadius: '4px',
                  border: '1px solid #2d3748',
                  backgroundColor: '#2d3748',
                  color: 'white',
                }}
              />
            ) : (
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste article text here..."
                className="text-input"
                rows={6}
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '1rem',
                  borderRadius: '4px',
                  border: '1px solid #2d3748',
                  backgroundColor: '#2d3748',
                  color: 'white',
                  resize: 'vertical',
                  minHeight: '120px',
                }}
              />
            )}
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

          {error && renderError(error)}

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

 

