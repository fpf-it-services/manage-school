import React from 'react'

const Services = () => {
    return (
        <section id="services" className="services section light-background">
            <div className="container section-title" data-aos="fade-up">
                <h2>Découvrez Nos Services</h2>
                <p>Avec <span className="accent-text">School Manager</span>, simplifiez la gestion de votre établissement grâce à des outils innovants et adaptés à vos besoins.</p>
            </div>
            <div className="container" data-aos="fade-up" data-aos-delay="100">
                <div className="row g-4">
                    <div className="col-lg-6" data-aos="fade-up" data-aos-delay="100">
                        <div className="service-card d-flex">
                            <div className="icon flex-shrink-0">
                                <i className="bi bi-person-check"></i>
                            </div>
                            <div>
                                <h3>Gestion Simplifiée des Inscriptions</h3>
                                <p>Automatisez les inscriptions et centralisez les données des élèves pour un suivi efficace et précis.</p>
                                <a href="#" className="read-more">En savoir plus <i className="bi bi-arrow-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6" data-aos="fade-up" data-aos-delay="200">
                        <div className="service-card d-flex">
                            <div className="icon flex-shrink-0">
                                <i className="bi bi-wallet"></i>
                            </div>
                            <div>
                                <h3>Gestion Intelligente des Paiements</h3>
                                <p>Suivez et gérez les paiements en toute simplicité. Accédez à des rapports détaillés et envoyez des rappels automatisés.</p>
                                <a href="#" className="read-more">En savoir plus <i className="bi bi-arrow-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6" data-aos="fade-up" data-aos-delay="300">
                        <div className="service-card d-flex">
                            <div className="icon flex-shrink-0">
                                <i className="bi bi-graph-up"></i>
                            </div>
                            <div>
                                <h3>Analyse des Performances</h3>
                                <p>Obtenez des statistiques détaillées pour optimiser la performance des élèves et des enseignants.</p>
                                <a href="#" className="read-more">En savoir plus <i className="bi bi-arrow-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6" data-aos="fade-up" data-aos-delay="400">
                        <div className="service-card d-flex">
                            <div className="icon flex-shrink-0">
                                <i className="bi bi-calendar-event"></i>
                            </div>
                            <div>
                                <h3>Gestion des Emplois du Temps</h3>
                                <p>Créez et gérez facilement les emplois du temps des enseignants et des élèves pour une organisation optimale.</p>
                                <a href="#" className="read-more">En savoir plus <i className="bi bi-arrow-right"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Services
