import React, { useState, useRef } from 'react';

interface AIImageAnalysisResult {
  image_analyzed: boolean;
  ai_likelihood_percentage: number;
  ai_reasoning: string;
  ai_confidence: string;
  is_ai_generated: boolean;
  detected_artifacts: string[];
  image_quality_score: number;
  authenticity_score: number;
  model_used: string;
  analysis_type: string;
  timestamp: string;
}

const AIImageDetector: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AIImageAnalysisResult | null>(null);
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
      const response = await fetch('https://nocap-be.onrender.com/api/ai-image-detection/analyze_ai/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_base64: imageBase64 }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AIImageAnalysisResult = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
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

  const getScoreColor = (score: number) => {
    if (score >= 70) return '#22c55e';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="page-container">
      <div className="tab-content">
        <div className="content-header">
          <h2>AI Image Detector</h2>
          <p>Upload an image to check if it was generated by AI</p>
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
                <h3>AI Image Analysis Results</h3>
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
                    {result.is_ai_generated ? '🤖 Likely AI-Generated' : '📸 Likely Authentic'}
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
                
                <div className="result-card quality-card">
                  <div className="card-header">
                    <h4>Image Quality</h4>
                  </div>
                  <p className="authenticity-info">
                    Authenticity Score: <span 
                      className="score-value"
                      style={{ color: getScoreColor(result.authenticity_score) }}
                    >
                      {result.authenticity_score}/100
                    </span>
                  </p>
                  <p className="model-info">
                    Model: <span className="model-name">{result.model_used}</span>
                  </p>
                </div>
              </div>
              
              {result.detected_artifacts && result.detected_artifacts.length > 0 && (
                <div className="artifacts-section">
                  <h4>Detected Artifacts</h4>
                  <div className="artifacts-list">
                    {result.detected_artifacts.map((artifact, index) => (
                      <span key={index} className="artifact-tag">
                        {artifact}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="reasoning-sections">
                <div className="reasoning-section">
                  <h4>Analysis Reasoning</h4>
                  <p className="reasoning-text">{result.ai_reasoning}</p>
                </div>
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

export default AIImageDetector;
