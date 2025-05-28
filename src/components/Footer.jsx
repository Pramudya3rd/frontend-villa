import React from 'react';

const Footer = () => (
  <footer className="text-md-start">
    <div className="row">
      <div className="col-md-4 mb-4 text-center">
        <h5>LOGO</h5>
        <p>Your trusted partner for luxury stays in Bali's best villas.</p>
        <div className="footer-social">
          <a href="#"><i className="fab fa-facebook-f"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
          <a href="#"><i className="fab fa-twitter"></i></a>
          <a href="#"><i className="fab fa-youtube"></i></a>
        </div>
      </div>
      <div className="col-md-4 text-center">
        <h5>About</h5>
        {['About', 'Villa', 'FAQ', 'Contact'].map((link, idx) => (
          <p key={idx}><a href="#">{link}</a></p>
        ))}
      </div>
      <div className="col-md-4 text-center">
        <h5>Resources</h5>
        {['Help', 'Terms', 'Privacy'].map((link, idx) => (
          <p key={idx}><a href="#">{link}</a></p>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
