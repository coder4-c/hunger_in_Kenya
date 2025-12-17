import React from 'react';
import { Helmet } from 'react-helmet';

const ImpactStories = () => {
  return (
    <>
      <Helmet>
        <title>Impact Stories - Hunger in Kenya</title>
      </Helmet>
      
      <div style={{ padding: '120px 20px 60px', minHeight: '100vh' }}>
        <div className="container">
          <h1>Impact Stories</h1>
          <p>Read inspiring stories of hope and transformation from communities we've helped.</p>
          <div style={{ 
            background: '#f9fafb', 
            padding: '2rem', 
            borderRadius: '12px', 
            marginTop: '2rem' 
          }}>
            <h2>Coming Soon</h2>
            <p>This page is under construction. Check back soon for inspiring impact stories.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImpactStories;