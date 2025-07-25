import React from 'react';

const About: React.FC = () => {
  return (
    <div className="page-container">
      <div className="tab-content">
        <div className="about-content">
          <h2>About NoCapBot</h2>
          <div className="about-sections">
            <div className="about-section">
              <h3>🎯 Our Mission</h3>
              <p>
                NoCapBot is dedicated to combating misinformation and AI-generated content 
                by providing powerful detection tools that help users identify fake news, 
                AI-generated text, and manipulated images.
              </p>
            </div>
            
            <div className="about-section">
              <h3>🔬 How It Works</h3>
              <p>
                Our advanced AI algorithms analyze patterns, linguistic markers, and 
                visual artifacts to determine the authenticity of content. We use 
                state-of-the-art machine learning models trained on vast datasets.
              </p>
            </div>
            
            <div className="about-section">
              <h3>🛡️ Why It Matters</h3>
              <p>
                In an era of increasing misinformation and AI-generated content, 
                having reliable detection tools is crucial for maintaining trust 
                and authenticity in digital communications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
