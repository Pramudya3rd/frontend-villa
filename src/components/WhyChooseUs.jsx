import React from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const WhyChooseUs = () => (
  <section className="container mt-5">
    <h2 className="section-title mb-4">WHY CHOOSE US?</h2>
    <div className="accordion" id="whyChooseUs">
      {/* Item 1 */}
      <div className="accordion-item rounded-3">
        <h2 className="accordion-header" id="headingOne">
          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
            Trusted Experience & Excellent Hospitality
          </button>
        </h2>
        <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#whyChooseUs">
          <div className="accordion-body">
            We have years of experience providing top-class services for all guests with personalized packages.
          </div>
        </div>
      </div>

      {/* Item 2 */}
      <div className="accordion-item rounded-3">
        <h2 className="accordion-header" id="headingTwo">
          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
            Beautiful Locations & Luxurious Villas
          </button>
        </h2>
        <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#whyChooseUs">
          <div className="accordion-body">
            Our villas are located in the heart of Bali’s most scenic areas, with infinity pools, full-service kitchens, and premium facilities.
          </div>
        </div>
      </div>

      {/* Item 3 */}
      <div className="accordion-item rounded-3">
        <h2 className="accordion-header" id="headingThree">
          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
            24/7 Customer Support
          </button>
        </h2>
        <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#whyChooseUs">
          <div className="accordion-body">
            Our team is always ready to help you anytime, from booking assistance to local travel tips.
          </div>
        </div>
      </div>

      {/* Item 4 */}
      <div className="accordion-item rounded-3">
        <h2 className="accordion-header" id="headingFour">
          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
            Clean, Safe & Secure Environment
          </button>
        </h2>
        <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#whyChooseUs">
          <div className="accordion-body">
            Each property is maintained to the highest standards with regular sanitation and security protocols.
          </div>
        </div>
      </div>

      {/* Item 5 */}
      <div className="accordion-item rounded-3">
        <h2 className="accordion-header" id="headingFive">
          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
            Customizable Packages for Every Guest
          </button>
        </h2>
        <div id="collapseFive" className="accordion-collapse collapse" aria-labelledby="headingFive" data-bs-parent="#whyChooseUs">
          <div className="accordion-body">
            Whether you're a couple, family, or large group, we offer flexible packages to meet your needs.
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
