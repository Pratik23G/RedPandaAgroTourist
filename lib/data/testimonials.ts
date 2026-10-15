export interface TestimonialData {
  authorName: string;
  country: string;
  quote: string;
  rating: number;
  featured: boolean;
  /** Package or experience the guest took, e.g. "Red panda tracking, 3 days". */
  trip?: string;
  /** True while this is a stand-in written by us. Shows an "Example review" tag. Remove the flag when a real guest quote replaces it. */
  sample?: boolean;
}

// Add real guest reviews to the top of this list. The carousel on the home page picks them all up and
// lets visitors swipe/scroll between them. Delete the `sample` entry once you have at least one real quote.
export const testimonials: TestimonialData[] = [
  {
    authorName: "Hannah Whitlock",
    country: "Bristol, United Kingdom",
    trip: "Red panda tracking, 3 days",
    quote:
      "Two mornings on the ridge and nothing. Then on the third, our guide stopped mid-step and pointed up: a red panda, curled in the moss, barely ten metres away. The homestay dinners and Kanchenjunga at sunrise made the whole trip.",
    rating: 5,
    featured: true,
    sample: true,
  },
];
