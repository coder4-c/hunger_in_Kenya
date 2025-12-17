import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import NewsletterForm from '../components/NewsletterForm';

const Home = ({ donationData, impactStats, loading }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Hunger in Kenya - Together We Can End Hunger</title>
      </Helmet>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        
        <div className="hero-content">
          <div className="container">
            <div className="hero-text">
              <h1 className="hero-title">
                Together We Can <span className="highlight">End Hunger</span> in Kenya
              </h1>
              <p className="hero-subtitle">
                Join us in our mission to create lasting change. Every donation, every volunteer hour, 
                and every shared story brings us closer to a Kenya where no child goes to bed hungry.
              </p>
              <div className="hero-buttons">
                <Link to="/donation" className="btn btn-primary">
                  <i className="fas fa-heart"></i>
                  Donate Now
                </Link>
                <a href="#statistics" className="btn btn-secondary">
                  <i className="fas fa-info-circle"></i>
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <a href="#statistics">
            <i className="fas fa-chevron-down"></i>
          </a>
        </div>
      </section>

      {/* Real-time Donation Tracker */}
      <section className="donation-tracker">
        <div className="container">
          <div className="tracker-content">
            <h3>Current Impact</h3>
            <div className="tracker-stats">
              <div className="stat-item">
                <div className="stat-number" id="people-fed">
                  {formatNumber(donationData.peopleFed || 24567)}
                </div>
                <div className="stat-label">People Fed Today</div>
              </div>
              <div className="stat-item">
                <div className="stat-number" id="donation-amount">
                  {formatCurrency(donationData.donationAmount || 47832)}
                </div>
                <div className="stat-label">Raised This Month</div>
              </div>
              <div className="stat-item">
                <div className="stat-number" id="active-programs">
                  {donationData.activePrograms || 12}
                </div>
                <div className="stat-label">Active Programs</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="statistics" className="statistics">
        <div className="container">
          <div className="section-header">
            <h2>The Reality of Hunger in Kenya</h2>
            <p>Understanding the scope of food insecurity helps us create targeted solutions</p>
          </div>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-number">3.4M</div>
              <div className="stat-description">People face acute food insecurity</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-child"></i>
              </div>
              <div className="stat-number">1.2M</div>
              <div className="stat-description">Children under 5 affected by malnutrition</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div className="stat-number">23</div>
              <div className="stat-description">Counties declared drought disaster zones</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="stat-number">6-12</div>
              <div className="stat-description">Months until next harvest in worst-affected areas</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="mission">
        <div className="container">
          <div className="mission-content">
            <div className="mission-text">
              <h2>Our Mission & Vision</h2>
              <div className="mission-item">
                <h3><i className="fas fa-bullseye"></i> Mission</h3>
                <p>To eliminate hunger in Kenya by providing emergency relief while building 
                sustainable food systems that empower communities to become self-sufficient.</p>
              </div>
              
              <div className="mission-item">
                <h3><i className="fas fa-eye"></i> Vision</h3>
                <p>A Kenya where every person has access to nutritious food, where communities 
                are resilient against climate shocks, and where food security is a reality for all.</p>
              </div>
            </div>
            
            <div className="mission-visual">
              <div className="impact-circles">
                <div className="circle circle-1">
                  <span>Relief</span>
                </div>
                <div className="circle circle-2">
                  <span>Sustainability</span>
                </div>
                <div className="circle circle-3">
                  <span>Empowerment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Solutions Overview */}
      <section className="solutions-preview">
        <div className="container">
          <div className="section-header">
            <h2>How We're Making a Difference</h2>
            <p>Our comprehensive approach addresses immediate needs while building long-term solutions</p>
          </div>
          
          <div className="solutions-grid">
            <div className="solution-card">
              <div className="solution-icon">
                <i className="fas fa-utensils"></i>
              </div>
              <h3>Emergency Food Distribution</h3>
              <p>Providing immediate nutrition to families in crisis situations across drought-affected regions.</p>
            </div>
            
            <div className="solution-card">
              <div className="solution-icon">
                <i className="fas fa-seedling"></i>
              </div>
              <h3>Sustainable Farming</h3>
              <p>Training farmers in climate-resilient agricultural techniques and providing drought-resistant seeds.</p>
            </div>
            
            <div className="solution-card">
              <div className="solution-icon">
                <i className="fas fa-school"></i>
              </div>
              <h3>School Feeding Programs</h3>
              <p>Ensuring children receive nutritious meals at school, improving attendance and learning outcomes.</p>
            </div>
            
            <div className="solution-card">
              <div className="solution-icon">
                <i className="fas fa-hands-helping"></i>
              </div>
              <h3>Community Empowerment</h3>
              <p>Building local capacity through training, microfinance, and cooperative development programs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Preview */}
      <section className="map-preview">
        <div className="container">
          <div className="section-header">
            <h2>Our Impact Across Kenya</h2>
            <p>See where we're making a difference and where help is needed most</p>
          </div>
          
          <div className="map-container">
            <div className="map-placeholder">
              <i className="fas fa-map-marked-alt"></i>
              <p>Interactive Map Coming Soon</p>
              <Link to="/interactive-map" className="btn btn-outline">View Full Map</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="newsletter">
        <div className="container">
          <div className="newsletter-content">
            <h2>Stay Connected</h2>
            <p>Get updates on our programs, success stories, and ways to get involved</p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;