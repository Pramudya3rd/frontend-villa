import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import MostViewed from "../components/MostViewed";
import WhyChooseUs from "../components/WhyChooseUs";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <MostViewed />
      <WhyChooseUs />
      <Contact />
      <Footer />
    </>
  );
}
