import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AIAdvisor from './components/AIAdvisor';
import Footer from './components/Footer';



const Home = () => {
  return (
    <>
      <Header />
      <Footer />
      <Hero />
      <AIAdvisor />
      {/* Footer coming soon */}
    </>
  );
};

export default Home;
