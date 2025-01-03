import About from 'examples/about'
import Clients from 'examples/clients'
import Contact from 'examples/contact'
import Faq from 'examples/faq'
import Features from 'examples/features'
import HeroSection from 'examples/hero-section'
import Services from 'examples/services'
import Stats from 'examples/stats'
import React, { useEffect } from 'react'
import AOS from 'aos';
import 'aos/dist/aos.css';

import './homepage.css'
import Footer from 'examples/footer-homepage'
import Header from 'examples/header'

const Homepage = () => {
  // Initialize AOS on component mount
  useEffect(() => {
    AOS.init();
  }, [])

  return (
    <>
        <Header />
        <main className='main'>
            <HeroSection />
            <About />
            <Features />
            <Clients />
            <Stats />
            <Services />
            <Faq />
            <Contact />
        </main>
        <Footer />
    </>
  )
}

export default Homepage
