import React from 'react';

import about_5 from 'assets/img/about-5.webp';
import about_2 from 'assets/img/about-2.webp';

const About = () => {
    return (
        <section id="about" className="about section">
            <div className="container" data-aos="fade-up" data-aos-delay="100">
                <div className="row gy-4 align-items-center justify-content-between">
                    <div className="col-xl-5" data-aos="fade-up" data-aos-delay="200">
                        <span className="about-meta">DÉCOUVREZ NOS SOLUTIONS</span>
                        <h2 className="about-title">Une Application Complète pour Gérer Votre École</h2>
                        <p className="about-description">
                            Notre application de gestion d’écoles est conçue pour répondre aux besoins administratifs, pédagogiques et financiers des établissements scolaires. Que vous soyez un administrateur général, une école ou un parent, notre plateforme offre une interface intuitive et des outils puissants pour une gestion simplifiée.
                        </p>
                        <div className="row feature-list-wrapper">
                            <div className="col-md-6">
                                <ul className="feature-list">
                                    <li><i className="bi bi-check-circle-fill"></i> Centralisation des informations des élèves</li>
                                    <li><i className="bi bi-check-circle-fill"></i> Communication transparente entre parents et école</li>
                                    <li><i className="bi bi-check-circle-fill"></i> Gestion simplifiée des inscriptions</li>
                                </ul>
                            </div>
                            <div className="col-md-6">
                                <ul className="feature-list">
                                    <li><i className="bi bi-check-circle-fill"></i> Paiements et frais sécurisés</li>
                                    <li><i className="bi bi-check-circle-fill"></i> Rapports financiers automatisés</li>
                                    <li><i className="bi bi-check-circle-fill"></i> Interface intuitive et accessible</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-6" data-aos="fade-up" data-aos-delay="300">
                        <div className="image-wrapper">
                            <div className="images position-relative" data-aos="zoom-out" data-aos-delay="400">
                                <img src={about_5} alt="Réunion d'équipe" className="img-fluid main-image rounded-4" />
                                <img src={about_2} alt="Collaboration en équipe" className="img-fluid small-image rounded-4" />
                            </div>
                            <div className="experience-badge floating">
                                <h3>15+ <span>Années</span></h3>
                                <p>D'expérience dans la gestion des écoles</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
