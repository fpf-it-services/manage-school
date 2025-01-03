import React from 'react'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import client_1 from 'assets/img/clients/client-1.png'
import client_2 from 'assets/img/clients/client-2.png'
import client_3 from 'assets/img/clients/client-3.png'
import client_4 from 'assets/img/clients/client-4.png'
import client_5 from 'assets/img/clients/client-5.png'
import client_6 from 'assets/img/clients/client-6.png'
import client_7 from 'assets/img/clients/client-7.png'
import client_8 from 'assets/img/clients/client-8.png'

const Clients = () => {
  return (
    <section id="clients" className="clients section">

      <div className="container" data-aos="fade-up" data-aos-delay="100">

        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          className='swiper-wrapper align-items-center bg-light px-5'
          loop={true}
          speed={600}
          autoplay={{ 
            delay: 5000
           }}
          breakpoints={{
            320: {
                  slidesPerView: 2,
                  spaceBetween: 40
                },
                480: {
                  slidesPerView: 3,
                  spaceBetween: 60
                },
                640: {
                  slidesPerView: 4,
                  spaceBetween: 80
                },
                992: {
                  slidesPerView: 6,
                  spaceBetween: 100
                }
          }}
          pagination={{ clickable: true, type: "bullets", hideOnClick: false  }}
          
          onSwiper={(swiper) => console.log(swiper)}
        >
          <SwiperSlide className='swiper-slide'><img src={client_1} className="img-fluid" alt=""/></SwiperSlide>
          <SwiperSlide className='swiper-slide'><img src={client_2} className="img-fluid" alt=""/></SwiperSlide>
          <SwiperSlide className='swiper-slide'><img src={client_3} className="img-fluid" alt=""/></SwiperSlide>
          <SwiperSlide className='swiper-slide'><img src={client_4} className="img-fluid" alt=""/></SwiperSlide>
          <SwiperSlide className='swiper-slide'><img src={client_5} className="img-fluid" alt=""/></SwiperSlide>
          <SwiperSlide className='swiper-slide'><img src={client_6} className="img-fluid" alt=""/></SwiperSlide>
          <SwiperSlide className='swiper-slide'><img src={client_7} className="img-fluid" alt=""/></SwiperSlide>
          <SwiperSlide className='swiper-slide'><img src={client_8} className="img-fluid" alt=""/></SwiperSlide>
        </Swiper>





        {/* <div className="swiper init-swiper">

          <div className="swiper-wrapper ">
            <div className="swiper-slide"></div>
            <div className="swiper-slide"><img src={client_2} className="img-fluid" alt=""/></div>
            <div className="swiper-slide"><img src={client_3} className="img-fluid" alt=""/></div>
            <div className="swiper-slide"><img src={client_4} className="img-fluid" alt=""/></div>
            <div className="swiper-slide"><img src={client_5} className="img-fluid" alt=""/></div>
            <div className="swiper-slide"><img src={client_6} className="img-fluid" alt=""/></div>
            <div className="swiper-slide"><img src={client_7} className="img-fluid" alt=""/></div>
            <div className="swiper-slide"><img src={client_8} className="img-fluid" alt=""/></div>
          </div>
          
        </div> */}

      </div>

    </section>
  )
}

export default Clients
