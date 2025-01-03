import React from 'react';

import avatar_1 from 'assets/img/avatar-1.webp';
import avatar_2 from 'assets/img/avatar-2.webp';
import avatar_3 from 'assets/img/avatar-3.webp';
import avatar_4 from 'assets/img/avatar-4.webp';
import avatar_5 from 'assets/img/avatar-5.webp';

import illustration_1 from 'assets/img/illustration-1.webp';

const HeroSection = () => {
  return (
    <section id="hero" className="hero section">
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="hero-content" data-aos="fade-up" data-aos-delay="200">
              <div className="company-badge mb-4">
                <i className="bi bi-gear-fill me-2"></i>
                Transformez la gestion scolaire avec efficacité
              </div>

              <h1 className="mb-4">
                Une plateforme complète pour
                <br />
                <span className="accent-text">simplifier la gestion éducative</span>
              </h1>

              <p className="mb-4 mb-md-5">
                School Manager offre une solution intégrée pour gérer les élèves, les finances, et les tâches administratives avec précision et simplicité. Maximisez l'efficacité de votre établissement grâce à des outils intelligents et innovants.
              </p>

              <div className="hero-buttons">
                <a href="/auth/login" className="btn btn-primary me-0 me-sm-2 mx-1">
                  Commencer maintenant
                </a>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="hero-image" data-aos="zoom-out" data-aos-delay="300">
              <img src={illustration_1} alt="School Manager Interface" className="img-fluid" />

              <div className="customers-badge">
                <div className="customer-avatars">
                  <img src={avatar_1} alt="École 1" className="avatar" />
                  <img src={avatar_2} alt="École 2" className="avatar" />
                  <img src={avatar_3} alt="École 3" className="avatar" />
                  <img src={avatar_4} alt="École 4" className="avatar" />
                  <img src={avatar_5} alt="École 5" className="avatar" />
                  <span className="avatar more">12+</span>
                </div>
                <p className="mb-0 mt-2">
                  Plus de 12 000 établissements nous font confiance pour optimiser leur gestion quotidienne.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="row stats-row gy-4 mt-5" data-aos="fade-up" data-aos-delay="500">
          <div className="col-lg-3 col-md-6">
            <div className="stat-item">
              <div className="stat-icon">
                <i className="bi bi-trophy"></i>
              </div>
              <div className="stat-content">
                <h4>3 prix internationaux</h4>
                <p className="mb-0">Récompensé pour l'innovation dans l'éducation numérique</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="stat-item">
              <div className="stat-icon">
                <i className="bi bi-briefcase"></i>
              </div>
              <div className="stat-content">
                <h4>6 500+ écoles</h4>
                <p className="mb-0">Des institutions utilisent notre solution pour une gestion optimale</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="stat-item">
              <div className="stat-icon">
                <i className="bi bi-graph-up"></i>
              </div>
              <div className="stat-content">
                <h4>80 000+ rapports générés</h4>
                <p className="mb-0">Suivi des performances académiques facilité</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="stat-item">
              <div className="stat-icon">
                <i className="bi bi-award"></i>
              </div>
              <div className="stat-content">
                <h4>6x plus d'efficacité</h4>
                <p className="mb-0">Simplifiez et automatisez les tâches administratives</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
