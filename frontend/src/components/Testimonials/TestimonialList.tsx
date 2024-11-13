import React from "react";
import styles from "./TestimonialList.module.css";
import TestimonialCard from "./TestimonialCard";
import testimonialsData from "../../data/testimonialsData";

const TestimonialsList: React.FC = () => {
  return (
    <div className={styles.testimonialsContainer}>
      {testimonialsData.map((testimonial, index) => (
        <TestimonialCard
          key={index}
          client={testimonial.client}
          text={testimonial.text}
        />
      ))}
    </div>
  );
};

export default TestimonialsList;
// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchTestimonials } from "../../redux/slices/testimonialSlice";
// import { RootState, AppDispatch } from "../../redux/store";
// import styles from "./TestimonialList.module.css";

// const TestimonialsList: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { testimonials, loading, error } = useSelector(
//     (state: RootState) => state.testimonials
//   );

//   useEffect(() => {
//     dispatch(fetchTestimonials());
//   }, [dispatch]);

//   if (loading) {
//     return <div>Loading testimonials...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div className={styles.testimonialsContainer}>
//       {testimonials.map((testimonial) => (
//         <div key={testimonial.id} className={styles.testimonialCard}>
//           <h3>{testimonial.name}</h3>
//           <h4>{testimonial.title}</h4>
//           <p>{testimonial.content}</p>
//           <p className={styles.date}>
//             {new Date(testimonial.createdAt).toLocaleDateString()}
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default TestimonialsList;
