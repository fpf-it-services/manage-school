import React from 'react'
import logo from "assets/img/logo.png"

const Header = () => {
  return (
    <header id="header" className="header d-flex align-items-center fixed-top">
    <div className="header-container container-fluid container-xl position-relative d-flex align-items-center justify-content-between">

      <a href="index.html" className="logo d-flex align-items-center me-auto me-xl-0">
        <img src={logo} alt=""/> 
        <h1 className="sitename">SchoolManager</h1>
      </a>

      <nav id="navmenu" className="navmenu">
        <ul>
          <li><a href="#hero" className="active">Accueil</a></li>
          <li><a href="#about">A propos</a></li>
          <li><a href="#features">Fonctionnalités</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
      </nav>

      <a className="btn-getstarted" href="/auth/login">Se connecter</a>

    </div>
  </header>
  )
  
}

export default Header

