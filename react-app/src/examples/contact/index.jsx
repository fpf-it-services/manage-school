import React from 'react'

const Contact = () => {
    return (
        <section id="contact" className="contact section light-background">
            <div className="container section-title" data-aos="fade-up">
                <h2>Contactez-nous</h2>
                <p>Vous avez des questions ou souhaitez plus d'informations sur notre plateforme ? N'hésitez pas à nous écrire.</p>
            </div>

            <div className="container" data-aos="fade-up" data-aos-delay="100">

                <div className="row g-4 g-lg-5">
                    <div className="col-lg-5">
                        <div className="info-box" data-aos="fade-up" data-aos-delay="200">
                            <h3>Informations de contact</h3>
                            <p>Pour toute assistance ou demande, voici nos coordonnées :</p>

                            <div className="info-item" data-aos="fade-up" data-aos-delay="300">
                                <div className="icon-box">
                                    <i className="bi bi-geo-alt"></i>
                                </div>
                                <div className="content">
                                    <h4>Adresse</h4>
                                    <p>XXXXXXXX</p>
                                </div>
                            </div>

                            <div className="info-item" data-aos="fade-up" data-aos-delay="400">
                                <div className="icon-box">
                                    <i className="bi bi-telephone"></i>
                                </div>
                                <div className="content">
                                    <h4>Téléphone</h4>
                                    <p>XXXXXXXXX</p>
                                </div>
                            </div>

                            <div className="info-item" data-aos="fade-up" data-aos-delay="500">
                                <div className="icon-box">
                                    <i className="bi bi-envelope"></i>
                                </div>
                                <div className="content">
                                    <h4>Email</h4>
                                    <p>support@schoolmanager.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-7">
                        <div className="contact-form" data-aos="fade-up" data-aos-delay="300">
                            <h3>Écrivez-nous</h3>
                            <p>Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.</p>

                            <form action="forms/contact.php" method="post" className="php-email-form" data-aos="fade-up" data-aos-delay="200">
                                <div className="row gy-4">

                                    <div className="col-md-6">
                                        <input type="text" name="name" className="form-control" placeholder="Votre nom" required=""/>
                                    </div>

                                    <div className="col-md-6">
                                        <input type="email" className="form-control" name="email" placeholder="Votre email" required=""/>
                                    </div>

                                    <div className="col-12">
                                        <input type="text" className="form-control" name="subject" placeholder="Objet" required=""/>
                                    </div>

                                    <div className="col-12">
                                        <textarea className="form-control" name="message" rows="6" placeholder="Votre message" required=""></textarea>
                                    </div>

                                    <div className="col-12 text-center">
                                        <div className="loading">Envoi en cours...</div>
                                        <div className="error-message"></div>
                                        <div className="sent-message">Votre message a bien été envoyé. Merci !</div>

                                        <button type="submit" className="btn">Envoyer</button>
                                    </div>

                                </div>
                            </form>

                        </div>
                    </div>

                </div>

            </div>

        </section>
    )
}

export default Contact