import React, { useState } from 'react';

const DeepfakeAnalyzer: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!videoUrl.trim()) {
      setError('Please enter a valid video URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(videoUrl);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      // Placeholder for actual deepfake analysis API call
      // Replace this with your actual backend endpoint
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate API call
      
      // Mock result - replace with actual API response
      const mockResult = Math.random() > 0.5 ? 'Real Video' : 'Deepfake Detected';
      setResult(mockResult);
    } catch (err) {
      setError('Failed to analyze video. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setVideoUrl('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="page-container">
      <div className="tab-content">
        <div className="content-header">
          <h2>Deepfake Video Analyzer</h2>
          <p>Enter a video URL to analyze whether the content contains deepfake manipulation</p>
        </div>
        <div className="video-detector-interface">
          <div className="url-input-section">
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://example.com/video.mp4"
              className="text-input"
              disabled={isAnalyzing}
            />
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
          </div>
          <div className="detector-controls">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !videoUrl.trim()}
              className="analyze-button"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Video'}
            </button>
            <button onClick={handleReset} className="clear-button">
              Clear
            </button>
          </div>
          
          {isAnalyzing && (
            <div className="result-placeholder">
              <p>Analyzing video for deepfake content...</p>
              <p>This may take a few moments</p>
            </div>
          )}

          {result && !isAnalyzing && (
            <div className="result-placeholder">
              <div className="analysis-result">
                <h3>Analysis Result: {result}</h3>
                <p>
                  {result.includes('Deepfake') 
                    ? 'Our analysis detected signs of artificial manipulation in this video.'
                    : 'Our analysis suggests this video appears to be authentic.'
                  }
                </p>
              </div>
            </div>
          )}

          {!result && !isAnalyzing && (
            <div className="result-placeholder">
              <p>Enter a video URL above to see analysis results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeepfakeAnalyzer;
