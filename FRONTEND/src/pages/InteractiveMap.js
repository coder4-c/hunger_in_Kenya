import React from 'react';
import { Helmet } from 'react-helmet';

const InteractiveMap = () => {
  return (
    <>
      <Helmet>
        <title>Interactive Map - Hunger in Kenya</title>
      </Helmet>
      
      <div style={{ padding: '120px 20px 60px', minHeight: '100vh' }}>
        <div className="container">
          <h1>Interactive Map</h1>
          <p>Explore our programs and impact across Kenya.</p>
          <div style={{ 
            background: '#f9fafb', 
            padding: '2rem', 
            borderRadius: '12px', 
            marginTop: '2rem' 
          }}>
            <h2>Coming Soon</h2>
            <p>This page is under construction. Check back soon for our interactive map of programs and impact areas.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default InteractiveMap;