import React, { useState } from 'react';

interface AnalysisResult {
  text: string;
  // AI Detection Results
  ai_likelihood_percentage: number;
  ai_reasoning: string;
  ai_confidence: string;
  is_ai_generated: boolean;
  // Fake News Detection Results
  fake_news_likelihood_percentage: number;
  fake_news_reasoning: string;
  fake_news_confidence: string;
  is_fake_news: boolean;
  credibility_score: number;
  // Metadata
  model_used: string;
  timestamp: string;
}

const Detector: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeText = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('https://nocap-be.onrender.com/text-ai-detection/analyze/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearText = () => {
    setInputText('');
    setResult(null);
    setError(null);
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence.toLowerCase()) {
      case 'high': return '#22c55e';
      case 'medium': return '#f59e0b';
      case 'low': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getLikelihoodColor = (percentage: number) => {
    if (percentage >= 70) return '#ef4444';
    if (percentage >= 40) return '#f59e0b';
    return '#22c55e';
  };

  return (
    <div className="page-container">
      <div className="tab-content">
        <div className="content-header">
          <h2>AI Text Detector and Fact Checker</h2>
          <p>Paste your text below to check if it was generated by AI</p>
        </div>
        <div className="detector-interface">
          <textarea 
            className="text-input"
            placeholder="Paste your text here to analyze..."
            rows={10}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isAnalyzing}
          />
          <div className="detector-controls">
            <button 
              className="analyze-button" 
              onClick={analyzeText}
              disabled={isAnalyzing || !inputText.trim()}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Text'}
            </button>
            <button className="clear-button" onClick={clearText}>Clear</button>
          </div>
          
          {error && (
            <div className="error-message">
              <p>❌ {error}</p>
            </div>
          )}
          
          {result && (
            <div className="analysis-results">
              <div className="result-header">
                <h3>Analysis Results</h3>
              </div>
              
              <div className="result-cards">
                <div className="result-card likelihood-card">
                  <div className="card-header">
                    <h4>AI Detection</h4>
                    <div 
                      className="percentage-badge"
                      style={{ backgroundColor: getLikelihoodColor(result.ai_likelihood_percentage) }}
                    >
                      {result.ai_likelihood_percentage}%
                    </div>
                  </div>
                  <p className="verdict">
                    {result.is_ai_generated ? '🤖 Likely AI-Generated' : '👤 Likely Human-Written'}
                  </p>
                  <p className="confidence-info">
                    Confidence: <span 
                      className="confidence-badge"
                      style={{ color: getConfidenceColor(result.ai_confidence) }}
                    >
                      {result.ai_confidence.toUpperCase()}
                    </span>
                  </p>
                </div>
                
                <div className="result-card fake-news-card">
                  <div className="card-header">
                    <h4>Fake News Detection</h4>
                    <div 
                      className="percentage-badge"
                      style={{ backgroundColor: getLikelihoodColor(result.fake_news_likelihood_percentage) }}
                    >
                      {result.fake_news_likelihood_percentage}%
                    </div>
                  </div>
                  <p className="verdict">
                    {result.is_fake_news ? '⚠️ Likely Fake News' : '✅ Appears Credible'}
                  </p>
                  <p className="confidence-info">
                    Confidence: <span 
                      className="confidence-badge"
                      style={{ color: getConfidenceColor(result.fake_news_confidence) }}
                    >
                      {result.fake_news_confidence.toUpperCase()}
                    </span>
                  </p>
                  <p className="credibility-score">
                    Credibility Score: <span className="score-value">{result.credibility_score}/100</span>
                  </p>
                </div>
                
              
              </div>
              
              <div className="reasoning-sections">
                <div className="reasoning-section">
                  <h4>AI Detection Analysis</h4>
                  <p className="reasoning-text">{result.ai_reasoning}</p>
                </div>
                
                <div className="reasoning-section">
                  <h4>Fact-Checking Analysis</h4>
                  <p className="reasoning-text">{result.fake_news_reasoning}</p>
                </div>
              </div>
            </div>
          )}
          
          {!result && !error && !isAnalyzing && (
            <div className="result-placeholder">
              <p>Results will appear here after analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Detector;

