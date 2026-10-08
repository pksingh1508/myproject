// Shared easing curves so every reveal in the product feels like one system.
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;
export const SPRING_SNAPPY = {
  type: "spring",
  stiffness: 420,
  damping: 32,
  mass: 0.6,
} as const;
export const SPRING_SOFT = {
  type: "spring",
  stiffness: 160,
  damping: 22,
  mass: 0.5,
} as const;
