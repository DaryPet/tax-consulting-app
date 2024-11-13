import React, { useEffect } from "react";
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

const Testimonials: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const testimonials = useSelector(selectAllTestimonials) || [];
  const loading = useSelector(selectTestimonialLoading);
  const error = useSelector(selectTestimonialError);

  useEffect(() => {
    dispatch(fetchAllTestimonials());
  }, [dispatch]);

  return (
    <div className={styles.testimonialsSection}>
      <h2>What Our Clients Say</h2>
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
