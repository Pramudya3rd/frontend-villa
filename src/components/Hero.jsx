import React from 'react';
import heroImg from '../assets/hero.png'; // pastikan path ini sesuai struktur foldermu

const Hero = () => (
  <section className="hero">
    <img
      src={heroImg}
      alt="Hero"
    />
    <div className="filter-buttons">
      {['Location', 'Price', 'Rating'].map((btn, idx) => (
        <button key={idx}>{btn}</button>
      ))}
    </div>
    <div className="hero-text">
      <p>Welcome to Company</p>
      <h1>Find Your Dream Villa</h1>
      <p>Enjoy luxury stays in tropical paradise with premium facilities.</p>
    </div>
  </section>
);

export default Hero;
