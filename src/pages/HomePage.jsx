import React from 'react';
import NavbarProfile from '../components/NavbarProfile';
import Hero from '../components/Hero';
import About from '../components/About';
import MostViewed from '../components/MostViewed';
import WhyChooseUs from '../components/WhyChooseUs';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <>
      <NavbarProfile />
      <Hero />
      <About />
      <MostViewed />
      <WhyChooseUs />
      <Contact />
      <Footer />
    </>
  );
}
