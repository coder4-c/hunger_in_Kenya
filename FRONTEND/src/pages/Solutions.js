import React from 'react';
import { Helmet } from 'react-helmet';

const Solutions = () => {
  return (
    <>
      <Helmet>
        <title>Our Solutions - Hunger in Kenya</title>
      </Helmet>
      
      <div style={{ padding: '120px 20px 60px', minHeight: '100vh' }}>
        <div className="container">
          <h1>Our Solutions</h1>
          <p>Discover our comprehensive approach to ending hunger in Kenya.</p>
          <div style={{ 
            background: '#f9fafb', 
            padding: '2rem', 
            borderRadius: '12px', 
            marginTop: '2rem' 
          }}>
            <h2>Coming Soon</h2>
            <p>This page is under construction. Check back soon for detailed information about our solutions.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Solutions;