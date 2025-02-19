import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import {
  fetchAllTestimonials,
  selectAllTestimonials,
  selectTestimonialLoading,
  selectTestimonialError,
} from "../../redux/slices/testimonialSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Autoplay } from "swiper/modules";
import styles from "./Testimonials.module.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Testimonials: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const testimonials = useSelector(selectAllTestimonials) || [];
  const loading = useSelector(selectTestimonialLoading);
  const error = useSelector(selectTestimonialError);

  const titleRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    dispatch(fetchAllTestimonials());
  }, [dispatch]);

  useEffect(() => {
    if (titleRef.current) {
      // Анимация заголовка с использованием ScrollTrigger
      gsap.fromTo(
        titleRef.current,
        {
          opacity: 0,
          x: "100%", // Начальное положение справа (на 100% ширины)
        },
        {
          opacity: 1, // Конечная прозрачность
          x: "0%", // Конечная позиция - центр экрана
          duration: 1,
          ease: "power3.out", // Плавное движение
          scrollTrigger: {
            trigger: titleRef.current, // Указываем реф для ScrollTrigger
            start: "top 80%", // Когда верх элемента будет на 80% экрана
            end: "bottom top", // Когда элемент выйдет из экрана
            scrub: true, // Для плавной синхронизации с прокруткой
          },
        }
      );
    }
  }, []);

  return (
    <div className={styles.testimonialsSection}>
      <h2 ref={titleRef} className={`${styles.title} title`}>
        What Our Clients Say
      </h2>
      {loading && <p className={styles.loadingText}>Loading testimonials...</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}
      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        pagination={{ clickable: true }}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        className={styles.swiperContainer}
      >
        {testimonials.length > 0 ? (
          testimonials.map((t) => (
            <SwiperSlide key={t.id} className={styles.testimonialItem}>
              <div className={styles.testimonialCard}>
                <p>"{t.content}"</p>
                <p className={styles.authorName}>{t.name}</p>
              </div>
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <p className={styles.noTestimonials}>
              No testimonials available at the moment.
            </p>
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  );
};

export default Testimonials;
