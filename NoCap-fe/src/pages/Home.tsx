import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to NoCap
          </h1>
          <p className="hero-description">
            Use the navigation to switch between the AI vs Human Text
            Detector, AI Image Detector, Fake News Detector, Scam Image Detector, and learn more About Us.
          </p>
          
          {/* Feature Cards */}
          <div className="feature-cards">
            <div className="feature-card" onClick={() => navigate('/detector')}>
              <div className="feature-icon">🤖</div>
              <h3>AI Text Detection</h3>
              <p>Detect AI-generated content with advanced algorithms</p>
            </div>
            
            <div className="feature-card" onClick={() => navigate('/ai-image')}>
              <div className="feature-icon">🖼️</div>
              <h3>Image Analysis</h3>
              <p>Identify manipulated or AI-generated images</p>
            </div>
            
            <div className="feature-card" onClick={() => navigate('/fake-news')}>
              <div className="feature-icon">📰</div>
              <h3>Fake News Detection</h3>
              <p>Verify news articles and detect misinformation</p>
            </div>
            
            <div className="feature-card" onClick={() => navigate('/scam-detector')}>
              <div className="feature-icon">🚨</div>
              <h3>Scam Detector</h3>
              <p>Analyze images for scam and fraudulent content</p>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="cta-buttons">
            <button 
              className="cta-button primary"
              onClick={() => navigate('/detector')}
            >
              Start Detection
            </button>
            <button 
              className="cta-button secondary"
              onClick={() => navigate('/about')}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;


