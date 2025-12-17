import React from 'react';
import { Helmet } from 'react-helmet';

const GetInvolved = () => {
  return (
    <>
      <Helmet>
        <title>Get Involved - Hunger in Kenya</title>
      </Helmet>
      
      <div style={{ padding: '120px 20px 60px', minHeight: '100vh' }}>
        <div className="container">
          <h1>Get Involved</h1>
          <p>Join our community of volunteers and make a direct impact in Kenya.</p>
          <div style={{ 
            background: '#f9fafb', 
            padding: '2rem', 
            borderRadius: '12px', 
            marginTop: '2rem' 
          }}>
            <h2>Coming Soon</h2>
            <p>This page is under construction. Check back soon for volunteer opportunities and ways to get involved.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default GetInvolved;