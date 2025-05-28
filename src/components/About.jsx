import React from 'react';
import aboutImage from '../assets/about.png';  // Sesuaikan pathnya sesuai struktur folder kamu

const About = () => (
  <section className="container about-section">
    <div className="col-md-6 text-center">
      <img src={aboutImage} alt="About" />
    </div>
    <div className="col-md-6">
      <h2 className="section-title text-start">ABOUT US</h2>
      <p className="text-muted">
        We are dedicated to providing the best villa experience in Bali. Explore peaceful surroundings, luxurious amenities, and breathtaking views with us.
      </p>
    </div>
  </section>
);

export default About;
