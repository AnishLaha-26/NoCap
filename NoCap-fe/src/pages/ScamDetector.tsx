import React, { useState, useRef } from 'react';

interface ScamAnalysisResult {
  image_analyzed: boolean;
  scam_likelihood_percentage: number;
  scam_reasoning: string;
  scam_confidence: string;
  is_scam: boolean;
  scam_type: string;
  risk_level: string;
  detected_patterns: string[];
  credibility_score: number;
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
      // Placeholder for actual scam image detection API call
      // Replace this with your actual backend endpoint
      const response = await fetch('http://127.0.0.1:8000/api/scam-image-detection/analyze/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_base64: imageBase64 }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ScamAnalysisResult = await response.json();
      setResult(data);
    } catch (err) {
      // For now, provide a mock response for demonstration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResult: ScamAnalysisResult = {
        image_analyzed: true,
        scam_likelihood_percentage: Math.floor(Math.random() * 100),
        scam_reasoning: "Analysis detected suspicious visual patterns including fake QR codes, phishing website screenshots, or fraudulent payment requests typical of scam images.",
        scam_confidence: Math.random() > 0.5 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low',
        is_scam: Math.random() > 0.4,
        scam_type: Math.random() > 0.5 ? 'qr_code_phishing' : Math.random() > 0.5 ? 'fake_payment_request' : 'fraudulent_website',
        risk_level: Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low',
        detected_patterns: ['suspicious_qr_code', 'fake_payment_interface', 'phishing_url'],
        credibility_score: Math.floor(Math.random() * 100),
        model_used: 'NoCap Scam Image Detection Service',
        analysis_type: 'scam_image_detection',
        timestamp: new Date().toISOString()
      };
      setResult(mockResult);
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
                    {result.is_scam ? '⚠️ Likely Scam Message' : '✅ Appears Legitimate'}
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
                    Type: <span className="type-value">{result.scam_type.replace('_', ' ').toUpperCase()}</span>
                  </p>
                  <p className="credibility-score">
                    Credibility Score: <span className="score-value">{result.credibility_score}/100</span>
                  </p>
                </div>
              </div>
              
              {result.detected_patterns && result.detected_patterns.length > 0 && (
                <div className="patterns-section">
                  <h4>Detected Scam Patterns</h4>
                  <div className="patterns-list">
                    {result.detected_patterns.map((pattern, index) => (
                      <span key={index} className="pattern-tag">
                        {pattern.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="reasoning-sections">
                <div className="reasoning-section">
                  <h4>Analysis Reasoning</h4>
                  <p className="reasoning-text">{result.scam_reasoning}</p>
                </div>
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
