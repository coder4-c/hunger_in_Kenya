import React from 'react';
import { Helmet } from 'react-helmet';

const About = () => {
  return (
    <>
      <Helmet>
        <title>About the Crisis - Hunger in Kenya</title>
      </Helmet>
      
      <div style={{ padding: '120px 20px 60px', minHeight: '100vh' }}>
        <div className="container">
          <h1>About the Crisis</h1>
          <p>Learn about the hunger crisis in Kenya and how it's affecting millions of families.</p>
          <div style={{ 
            background: '#f9fafb', 
            padding: '2rem', 
            borderRadius: '12px', 
            marginTop: '2rem' 
          }}>
            <h2>Coming Soon</h2>
            <p>This page is under construction. Check back soon for detailed information about the hunger crisis in Kenya.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;