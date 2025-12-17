import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './App.css';

// Components
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Solutions from './pages/Solutions';
import HowToHelp from './pages/HowToHelp';
import ImpactStories from './pages/ImpactStories';
import GetInvolved from './pages/GetInvolved';
import Donation from './pages/Donation';
import InteractiveMap from './pages/InteractiveMap';
import Contact from './pages/Contact';

// Services
import apiService from './services/apiService';

function App() {
  const [donationData, setDonationData] = useState({
    peopleFed: 0,
    donationAmount: 0,
    activePrograms: 0,
    lastUpdated: null
  });
  const [impactStats, setImpactStats] = useState({
    totalPeopleServed: 0,
    farmersTrained: 0,
    childrenFedDaily: 0,
    communitiesTransformed: 0,
    countiesWithPrograms: 0,
    activeProjects: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [donationResponse, impactResponse] = await Promise.all([
        apiService.getCurrentDonations(),
        apiService.getImpactStatistics()
      ]);

      setDonationData(donationResponse);
      setImpactStats(impactResponse);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <Helmet>
        <title>Hunger in Kenya - Together We Can End Hunger</title>
        <meta name="description" content="Join us in addressing the hunger crisis in Kenya. Together, we can create lasting change through sustainable solutions, emergency relief, and community empowerment." />
      </Helmet>
      
      <Navigation />
      
      <main>
        <Routes>
          <Route path="/" element={<Home donationData={donationData} impactStats={impactStats} loading={loading} />} />
          <Route path="/about-crisis" element={<About />} />
          <Route path="/our-solutions" element={<Solutions />} />
          <Route path="/how-to-help" element={<HowToHelp />} />
          <Route path="/impact-stories" element={<ImpactStories />} />
          <Route path="/get-involved" element={<GetInvolved />} />
          <Route path="/donation" element={<Donation />} />
          <Route path="/interactive-map" element={<InteractiveMap />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;