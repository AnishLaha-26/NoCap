import React, { useState, useRef } from 'react';

interface ScamAnalysisResult {
  screenshot_analyzed: boolean;
  scam_likelihood_percentage: number;
  scam_confidence: string;
  scam_type: string;
  is_likely_scam: boolean;
  red_flags: string[];
  legitimate_indicators: string[];
  risk_level: string;
  recommended_action: string;
  analysis_summary: string;
  model_used: string;
  analysis_type: string;
  timestamp: string;
}

const ScamDetector: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ScamAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setResult(null);
      setError(null);
      
      // Create preview URL
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      
      // Convert to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        setImageBase64(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!imageBase64) {
      setError('Please upload an image first');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      // Extract base64 data without the data URL prefix if present
      const base64Data = imageBase64.split(',')[1] || imageBase64;
      
      const response = await fetch('https://nocap-be.onrender.com/scam-detection/analyze/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_base64: base64Data
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Map the API response to our ScamAnalysisResult interface
      const result: ScamAnalysisResult = {
        screenshot_analyzed: data.screenshot_analyzed || false,
        scam_likelihood_percentage: data.scam_likelihood_percentage || 0,
        scam_confidence: data.scam_confidence?.toLowerCase() || 'unknown',
        scam_type: data.scam_type || 'unknown',
        is_likely_scam: data.is_likely_scam || false,
        red_flags: data.red_flags || [],
        legitimate_indicators: data.legitimate_indicators || [],
        risk_level: data.risk_level?.toLowerCase() || 'unknown',
        recommended_action: data.recommended_action || 'No specific recommendation available',
        analysis_summary: data.analysis_summary || 'No analysis available',
        model_used: data.model_used || 'OpenAI GPT-4o',
        analysis_type: data.analysis_type || 'scam_detection',
        timestamp: data.timestamp || new Date().toISOString()
      };
      
      setResult(result);
    } catch (err) {
      console.error('Error analyzing scam image:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setResult(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImageBase64(null);
    setFileName('');
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const event = {
          target: { files: [file] }
        } as any;
        handleImageUpload(event);
      }
    }
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

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  return (
    <div className="page-container">
      <div className="tab-content">
        <div className="content-header">
          <h2>Scam Detector</h2>
          <p>Upload a screenshot to check if it contains scam or fraudulent content</p>
        </div>
        <div className="image-detector-interface">
          <div 
            className="upload-area"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
            {selectedImage ? (
              <div className="image-preview">
                <img src={selectedImage} alt="Uploaded" style={{ maxWidth: '300px', maxHeight: '300px', objectFit: 'contain' }} />
                <p>File: {fileName}</p>
                <div className="image-controls">
                  <button 
                    className="analyze-button" 
                    onClick={analyzeImage}
                    disabled={isAnalyzing || !imageBase64}
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
                  </button>
                  <button className="clear-button" onClick={clearImage}>Clear</button>
                </div>
              </div>
            ) : (
              <>
                <div className="upload-icon">📁</div>
                <p>Drag and drop an image here or click to browse</p>
                <button className="upload-button" onClick={handleButtonClick}>Choose Image</button>
              </>
            )}
          </div>
          
          {error && (
            <div className="error-message">
              <p>❌ {error}</p>
            </div>
          )}
          
          {result && (
            <div className="analysis-results">
              <div className="result-header">
                <h3>Scam Image Analysis Results</h3>
              </div>
              
              <div className="result-cards">
                <div className="result-card likelihood-card">
                  <div className="card-header">
                    <h4>Scam Detection</h4>
                    <div 
                      className="percentage-badge"
                      style={{ backgroundColor: getLikelihoodColor(result.scam_likelihood_percentage) }}
                    >
                      {result.scam_likelihood_percentage}%
                    </div>
                  </div>
                  <p className="verdict">
                    {result.is_likely_scam ? '⚠️ Likely Scam Message' : '✅ Appears Legitimate'}
                  </p>
                  <p className="confidence-info">
                    Confidence: <span 
                      className="confidence-badge"
                      style={{ color: getConfidenceColor(result.scam_confidence) }}
                    >
                      {result.scam_confidence.toUpperCase()}
                    </span>
                  </p>
                </div>
                
                <div className="result-card risk-card">
                  <div className="card-header">
                    <h4>Risk Assessment</h4>
                    <div 
                      className="percentage-badge"
                      style={{ backgroundColor: getRiskColor(result.risk_level) }}
                    >
                      {result.risk_level.toUpperCase()}
                    </div>
                  </div>
                  <p className="scam-type">
                    Type: <span className="type-value">{result.scam_type.toUpperCase()}</span>
                  </p>
                </div>
              </div>
              
              <div className="analysis-summary">
                <h4>Analysis Summary</h4>
                <p className="summary-text">{result.analysis_summary}</p>
              </div>
              
              {result.red_flags && result.red_flags.length > 0 && (
                <div className="red-flags-section">
                  <h4>🚩 Red Flags Detected</h4>
                  <ul className="red-flags-list">
                    {result.red_flags.map((flag, index) => (
                      <li key={index} className="red-flag-item">
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {result.legitimate_indicators && result.legitimate_indicators.length > 0 && (
                <div className="legitimate-indicators-section">
                  <h4>✅ Legitimate Indicators</h4>
                  <ul className="legitimate-indicators-list">
                    {result.legitimate_indicators.map((indicator, index) => (
                      <li key={index} className="legitimate-indicator-item">
                        {indicator}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="recommendation-section">
                <h4>Recommended Action</h4>
                <p className="recommendation-text">{result.recommended_action}</p>
              </div>
              
              <div className="metadata-section">
                <p className="timestamp">Analysis completed: {new Date(result.timestamp).toLocaleString()}</p>
              </div>
            </div>
          )}
          
          {!result && !error && !isAnalyzing && (
            <div className="result-placeholder">
              <p>Upload an image and click "Analyze Image" to see results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScamDetector;
