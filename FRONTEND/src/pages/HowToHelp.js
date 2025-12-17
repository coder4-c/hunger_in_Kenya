import React from 'react';
import { Helmet } from 'react-helmet';

const HowToHelp = () => {
  return (
    <>
      <Helmet>
        <title>How to Help - Hunger in Kenya</title>
      </Helmet>
      
      <div style={{ padding: '120px 20px 60px', minHeight: '100vh' }}>
        <div className="container">
          <h1>How to Help</h1>
          <p>Learn about the many ways you can contribute to ending hunger in Kenya.</p>
          <div style={{ 
            background: '#f9fafb', 
            padding: '2rem', 
            borderRadius: '12px', 
            marginTop: '2rem' 
          }}>
            <h2>Coming Soon</h2>
            <p>This page is under construction. Check back soon for detailed information on how you can help.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HowToHelp;