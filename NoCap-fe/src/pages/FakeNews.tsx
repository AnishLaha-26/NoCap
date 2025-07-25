import React from 'react';

const FakeNews: React.FC = () => {
  return (
    <div className="page-container">
      <div className="tab-content">
        <div className="content-header">
          <h2>Fake News Detector</h2>
          <p>Enter a news article or URL to verify its authenticity</p>
        </div>
        <div className="news-detector-interface">
          <div className="input-options">
            <button className="input-type-button active">Text Input</button>
            <button className="input-type-button">URL Input</button>
          </div>
          <textarea 
            className="text-input"
            placeholder="Paste the news article text here..."
            rows={8}
          />
          <div className="detector-controls">
            <button className="analyze-button">Verify News</button>
            <button className="clear-button">Clear</button>
          </div>
          <div className="result-placeholder">
            <p>Verification results will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FakeNews;
