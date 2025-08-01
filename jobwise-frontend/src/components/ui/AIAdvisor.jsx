import React from 'react';
import './AIAdvisor.css';

const AIAdvisor = () => {
  return (
    <section id="ai-advisor" className="ai-advisor">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">AI-Powered Career Advisor</h2>
          <p className="section-subtitle">
            Experience the future of job searching with our intelligent career advisor that learns about you to find perfect job matches.
          </p>
        </div>

        <div className="ai-demo">
          <div className="chat-interface">
            <div className="chat-header">
              <div className="ai-avatar">AI</div>
              <div>
                <h4>Career Advisor</h4>
                <small>Online • Ready to help</small>
              </div>
            </div>

            <div className="chat-messages">
              <div className="message ai">
                <p>Hi there! I'm your AI Career Advisor. I'm here to help you discover job opportunities that align perfectly with your skills, interests, and career goals. Let's start with a simple question:</p>
                <p><strong>What type of work environment makes you most productive?</strong></p>
                <div className="chat-options">
                  <button className="btn btn-outline">Remote work</button>
                  <button className="btn btn-outline">Office environment</button>
                  <button className="btn btn-outline">Hybrid arrangement</button>
                </div>
              </div>
            </div>

            <div className="chat-input">
              <input type="text" placeholder="Type your response..." />
              <button>Send</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIAdvisor;
