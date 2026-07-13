export interface TestimonialData {
  authorName: string;
  country: string;
  quote: string;
  rating: number;
  featured: boolean;
}

// Placeholder testimonials until the owner supplies real customer quotes —
// do not present these as real reviews in production copy.
export const testimonials: TestimonialData[] = [
  {
    authorName: "Sample Traveler",
    country: "United Kingdom",
    quote: "Placeholder quote — replace with a real guest testimonial before launch.",
    rating: 5,
    featured: true,
  },
  {
    authorName: "Sample Traveler",
    country: "India",
    quote: "Placeholder quote — replace with a real guest testimonial before launch.",
    rating: 5,
    featured: true,
  },
];
