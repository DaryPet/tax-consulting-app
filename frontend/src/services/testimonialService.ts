import { TESTIMONIALS_URL, TESTIMONIALS_MY_URL } from "../config/apiConfig";

export const addTestimonialApi = async (
  testimonial: string,
  token: string
): Promise<void> => {
  const response = await fetch(TESTIMONIALS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content: testimonial }),
  });

  if (!response.ok) {
    throw new Error("Failed to add testimonial");
  }
};

export const fetchAllTestimonialsApi = async (): Promise<any> => {
  try {
    const response = await fetch(TESTIMONIALS_URL, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch testimonials. Status: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Fetched data is not an array as expected.");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchUserTestimonialsApi = async (token: string): Promise<any> => {
  const response = await fetch(TESTIMONIALS_MY_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user testimonials");
  }

  return await response.json();
};

export const deleteTestimonialApi = async (
  testimonialId: string,
  token: string
): Promise<void> => {
  const response = await fetch(`${TESTIMONIALS_URL}${testimonialId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete testimonial");
  }
};
