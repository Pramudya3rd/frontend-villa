import React from 'react';

const Contact = () => (
  <section className="container mt-5 mb-5">
    <h2 className="section-title">CONTACT US</h2>
    <div className="row">
      <div className="col-md-4">
        <p><strong>LOCATION</strong><br />Jl. Sunset Road No. 99, Bali</p>
        <p><strong>CALL US</strong><br />+62 123 456 789</p>
        <p><strong>EMAIL</strong><br />info@villaexample.com</p>
      </div>
      <div className="col-md-8">
        <form className="contact-form">
          <div className="row g-3">
            <div className="col-md-6">
              <input type="text" className="form-control" placeholder="FULL NAME" />
            </div>
            <div className="col-md-6">
              <input type="email" className="form-control" placeholder="EMAIL" />
            </div>
            <div className="col-md-6">
              <input type="text" className="form-control" placeholder="PERSONS" />
            </div>
            <div className="col-md-6">
              <input type="text" className="form-control" placeholder="MM/DD/YY" />
            </div>
            <div className="col-12">
              <textarea className="form-control" rows="3" placeholder="MESSAGE"></textarea>
            </div>
            <div className="col-12 text-end">
              <button type="submit" className="btn btn-primary px-4">Send</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>
);

export default Contact;
