import React from 'react'

const Stats = () => {
    return (
        <section id="stats" className="stats section">
            <div className="container" data-aos="fade-up" data-aos-delay="100">
                <div className="row gy-4">
                    <div className="col-lg-3 col-md-6">
                        <div className="stats-item text-center w-100 h-100">
                            <span data-purecounter-start="0" data-purecounter-end="50" data-purecounter-duration="1" className="purecounter"></span>
                            <p>Écoles inscrites</p>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <div className="stats-item text-center w-100 h-100">
                            <span data-purecounter-start="0" data-purecounter-end="12000" data-purecounter-duration="1" className="purecounter"></span>
                            <p>Élèves inscrits</p>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <div className="stats-item text-center w-100 h-100">
                            <span data-purecounter-start="0" data-purecounter-end="3500" data-purecounter-duration="1" className="purecounter"></span>
                            <p>Cours créés</p>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <div className="stats-item text-center w-100 h-100">
                            <span data-purecounter-start="0" data-purecounter-end="450" data-purecounter-duration="1" className="purecounter"></span>
                            <p>Enseignants actifs</p>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    )
}

export default Stats
