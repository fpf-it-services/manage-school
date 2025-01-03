import React from 'react';

import features_illustration_1 from 'assets/img/features-illustration-1.webp';
import features_illustration_2 from 'assets/img/features-illustration-2.webp';
import features_illustration_3 from 'assets/img/features-illustration-3.webp';

const Features = () => {
    return (
        <section id="features" className="features section">
            <div className="container section-title" data-aos="fade-up">
                <h2>Fonctionnalités clés</h2>
                <p>
                    Découvrez comment School Manager simplifie la gestion scolaire avec des outils
                    innovants et sécurisés, conçus pour répondre aux besoins des administrateurs, des
                    enseignants et des familles.
                </p>
            </div>

            <div className="container">
                <div className="d-flex justify-content-center">
                    <ul className="nav nav-tabs" data-aos="fade-up" data-aos-delay="100">
                        <li className="nav-item">
                            <a className="nav-link active show" data-bs-toggle="tab" data-bs-target="#features-tab-1">
                                <h4>Gestion des élèves</h4>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" data-bs-toggle="tab" data-bs-target="#features-tab-2">
                                <h4>Gestion des finances</h4>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" data-bs-toggle="tab" data-bs-target="#features-tab-3">
                                <h4>Intégration des paiements</h4>
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="tab-content" data-aos="fade-up" data-aos-delay="200">
                    <div className="tab-pane fade active show" id="features-tab-1">
                        <div className="row">
                            <div className="col-lg-6 order-2 order-lg-1 mt-3 mt-lg-0 d-flex flex-column justify-content-center">
                                <h3>Des outils complets pour une gestion efficace des élèves</h3>
                                <p className="fst-italic">
                                    Centralisez toutes les informations importantes des élèves dans un
                                    espace sécurisé et facile à utiliser.
                                </p>
                                <ul>
                                    <li><i className="bi bi-check2-all"></i> Créez et mettez à jour les dossiers des élèves</li>
                                    <li><i className="bi bi-check2-all"></i> Analysez les performances académiques et le suivi</li>
                                    <li><i className="bi bi-check2-all"></i> Accédez à des rapports détaillés pour une meilleure prise de décision</li>
                                </ul>
                            </div>
                            <div className="col-lg-6 order-1 order-lg-2 text-center">
                                <img src={features_illustration_1} alt="Illustration Gestion des élèves" className="img-fluid" />
                            </div>
                        </div>
                    </div>

                    <div className="tab-pane fade" id="features-tab-2">
                        <div className="row">
                            <div className="col-lg-6 order-2 order-lg-1 mt-3 mt-lg-0 d-flex flex-column justify-content-center">
                                <h3>Une gestion financière optimisée</h3>
                                <p className="fst-italic">
                                    Simplifiez la gestion financière de votre établissement grâce à des outils puissants
                                    et intuitifs.
                                </p>
                                <ul>
                                    <li><i className="bi bi-check2-all"></i> Suivez les budgets et dépenses en temps réel</li>
                                    <li><i className="bi bi-check2-all"></i> Automatisez les factures et les paiements</li>
                                    <li><i className="bi bi-check2-all"></i> Générez des rapports financiers clairs et précis</li>
                                </ul>
                            </div>
                            <div className="col-lg-6 order-1 order-lg-2 text-center">
                                <img src={features_illustration_2} alt="Illustration Gestion des finances" className="img-fluid" />
                            </div>
                        </div>
                    </div>

                    <div className="tab-pane fade" id="features-tab-3">
                        <div className="row">
                            <div className="col-lg-6 order-2 order-lg-1 mt-3 mt-lg-0 d-flex flex-column justify-content-center">
                                <h3>Une solution de paiement sécurisée et intégrée</h3>
                                <p className="fst-italic">
                                    Gérez les paiements en toute simplicité avec des options adaptées à tous les besoins.
                                </p>
                                <ul>
                                    <li><i className="bi bi-check2-all"></i> Acceptez des paiements via des plateformes modernes</li>
                                    <li><i className="bi bi-check2-all"></i> Recevez des notifications en temps réel</li>
                                    <li><i className="bi bi-check2-all"></i> Assurez un suivi précis des transactions</li>
                                </ul>
                            </div>
                            <div className="col-lg-6 order-1 order-lg-2 text-center">
                                <img src={features_illustration_3} alt="Illustration Intégration des paiements" className="img-fluid" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
