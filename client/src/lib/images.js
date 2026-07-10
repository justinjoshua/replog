// Curated Unsplash training photos (all verified reachable). Used for exercise
// card covers (by muscle) and the dashboard hero / scrolling gallery.
const U = (id, w, h, q = 70) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=${q}`;

const MUSCLE = {
  Chest: "1571019613454-1cb2f99b2d8b",
  Back: "1534438327276-14e5300c3a48",
  Shoulders: "1541534741688-6078c6bfb5c5",
  Biceps: "1581009146145-b5ef050c2e1e",
  Triceps: "1584466977773-e625c37cdd50",
  Legs: "1517963879433-6ad2b056d712",
  Glutes: "1550345332-09e3ac987658",
  Core: "1532029837206-abbe2b7620e3",
  Cardio: "1526506118085-60ce8714f8c5",
  "Full Body": "1517836357463-d25dfeac3438",
  Other: "1583454110551-21f2fa2afe61",
};

export const muscleImage = (m) => U(MUSCLE[m] || MUSCLE.Other, 600, 360);

export const HERO_IMG = U("1605296867304-46d5465a13f1", 1500, 760, 78);

// Landing page + login backdrop
export const LOGIN_BG = U("1583454110551-21f2fa2afe61", 1400, 1800, 76);
export const LANDING_HERO = U("1605296867304-46d5465a13f1", 1700, 1000, 80);
export const LANDING_SHOTS = [
  U("1534438327276-14e5300c3a48", 900, 1120, 74),
  U("1581009146145-b5ef050c2e1e", 900, 1120, 74),
  U("1517963879433-6ad2b056d712", 900, 1120, 74),
  U("1594737625785-a6cbdabd333c", 900, 1120, 74),
  U("1532029837206-abbe2b7620e3", 900, 1120, 74),
  U("1541534741688-6078c6bfb5c5", 900, 1120, 74),
];

export const GALLERY = [
  "1571019613454-1cb2f99b2d8b",
  "1534438327276-14e5300c3a48",
  "1518611012118-696072aa579a",
  "1540497077202-7c8a3999166f",
  "1517344884509-a0c97ec11bcc",
  "1607962837359-5e7e89f86776",
  "1546483875-ad9014c88eba",
  "1594737625785-a6cbdabd333c",
].map((id) => U(id, 420, 300, 66));
