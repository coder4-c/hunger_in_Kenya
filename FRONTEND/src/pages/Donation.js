import React from 'react';
import { Helmet } from 'react-helmet';

const Donation = () => {
  return (
    <>
      <Helmet>
        <title>Donate - Hunger in Kenya</title>
      </Helmet>
      
      <div style={{ padding: '120px 20px 60px', minHeight: '100vh' }}>
        <div className="container">
          <h1>Make a Donation</h1>
          <p>Your contribution can make a real difference in the lives of families in Kenya.</p>
          <div style={{ 
            background: '#f9fafb', 
            padding: '2rem', 
            borderRadius: '12px', 
            marginTop: '2rem' 
          }}>
            <h2>Coming Soon</h2>
            <p>This page is under construction. Check back soon for our secure donation platform.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Donation;