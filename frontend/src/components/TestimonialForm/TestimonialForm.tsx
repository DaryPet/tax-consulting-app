import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import {
  addTestimonial,
  fetchUserTestimonials,
  deleteTestimonial,
  selectUserTestimonials,
  selectTestimonialLoading,
  selectTestimonialError,
  selectTestimonialSuccess,
  clearMessages,
} from "../../redux/slices/testimonialSlice";
import { selectAuthToken } from "../../redux/slices/authSlice";
import styles from "./TestimonialsForm.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TestimonialForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector(selectAuthToken);
  const testimonials = useSelector(selectUserTestimonials) || [];
  const loading = useSelector(selectTestimonialLoading);
  const error = useSelector(selectTestimonialError);
  const successMessage = useSelector(selectTestimonialSuccess);

  const [testimonial, setTestimonial] = useState<string>("");

  useEffect(() => {
    if (token) {
      dispatch(fetchUserTestimonials(token));
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      setTestimonial("");
      dispatch(clearMessages());
    }

    if (error) {
      toast.error(error);
      dispatch(clearMessages());
    }
  }, [successMessage, error, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!testimonial) {
      toast.error("Testimonial cannot be empty");
      return;
    }

    if (token) {
      dispatch(addTestimonial({ testimonial, token }));
    } else {
      toast.error("You must be logged in to submit a testimonial");
    }
  };

  const handleDelete = (testimonialId: string) => {
    if (token) {
      dispatch(deleteTestimonial({ testimonialId, token }));
    }
  };

  return (
    <div className={styles.testimonialFormSection}>
      <ToastContainer />

      <h2>Submit Your Testimonial</h2>

      <form onSubmit={handleSubmit} className={styles.testimonialForm}>
        <textarea
          value={testimonial}
          onChange={(e) => setTestimonial(e.target.value)}
          placeholder="Write your testimonial here..."
          className={styles.textarea}
          required
        ></textarea>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      <div className={styles.testimonialsList}>
        <h3>Your Testimonials:</h3>
        {testimonials.length > 0 ? (
          testimonials.map((t) => (
            <div key={t.id} className={styles.testimonialItem}>
              <p>{t.content}</p>
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(t.id.toString())}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No testimonials found</p>
        )}
      </div>
    </div>
  );
};

export default TestimonialForm;
