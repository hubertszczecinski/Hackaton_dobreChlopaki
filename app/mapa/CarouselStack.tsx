"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

interface BeforeAfterPhoto {
  id: number;
  projectTitle: string;
  before: string;
  after: string;
  likes: number;
  comments: number;
}

interface CarouselStackProps {
  photos: BeforeAfterPhoto[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

// Animation settings
const settings = {
  springDuration: 0.3,
  springBounce: 0.3,
  xSpringDuration: 0.5,
  xSpringBounce: 0.1,
  zIndexDelay: 0.05,
};

// Card variants for animation - exactly like Simple Card Stack
const createCardVariants = () => ({
  visible: (i: number) => ({
    opacity: 1,
    zIndex: [4, 3][i] || 1,
    scale: [1, 0.9][i] || 0.8, // Scale depending on position
    y: [0, -12][i] || 0, // Vertical position depending on index
    rotate: [0, 2][i] || 4, // Different tilt for each card
    x: [0, 32][i] || 48, // Horizontal offset
    perspective: 400,
    transition: {
      zIndex: { delay: settings.zIndexDelay }, // Delay zIndex to avoid visual stacking issues
      scale: {
        type: "spring",
        duration: settings.springDuration,
        bounce: settings.springBounce,
      },
      y: {
        type: "spring",
        duration: settings.springDuration,
        bounce: settings.springBounce,
      },
      x: {
        type: "spring",
        duration: settings.xSpringDuration,
        bounce: settings.xSpringBounce,
      },
    },
  }),
  exit: { opacity: 0, scale: 0.5, y: 50 },
});

export default function CarouselStack({
  photos,
  currentIndex,
  onIndexChange,
}: CarouselStackProps) {
  const [indices, setIndices] = useState([0, 1]);

  // Get current photo
  const currentPhoto = photos[currentIndex];

  // Create two cards: "before" (index 0) and "after" (index 1)
  const cardData = [
    { type: "before", image: currentPhoto.before, label: "Przed" },
    { type: "after", image: currentPhoto.after, label: "Po" },
  ];

  // Reset indices when currentIndex changes
  useEffect(() => {
    setIndices([0, 1]);
  }, [currentIndex]);

  const handleCardClick = () => {
    // Rotate indices to create stack effect on click
    setIndices((prevIndices) => [prevIndices[1], prevIndices[0]]);
  };

  const cardVariants = createCardVariants();

  // Determine which card is on top (active)
  const activeCardIndex = indices[0];
  const activeLabel = cardData[activeCardIndex].label;

  return (
    <div className="relative w-full">
      {/* Animated Label Above Cards */}
      <div className="relative h-12 mb-4 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeLabel}-${currentIndex}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="absolute"
          >
            <h3 className="text-2xl font-bold text-primary uppercase">
              {activeLabel}
            </h3>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Card Stack Container - wider and shorter */}
      <div
        className="relative mx-auto"
        style={{
          width: "600px",
          height: "300px",
          maxWidth: "100%",
        }}
      >
        <AnimatePresence initial={false}>
          {indices.map((cardIndex, i) => {
            const card = cardData[cardIndex];
            return (
              <motion.div
                key={`${card.type}-${currentIndex}-${i}`}
                custom={i}
                variants={cardVariants}
                initial="exit"
                animate="visible"
                exit="exit"
                onClick={i === 0 ? handleCardClick : undefined} // Only top card is clickable
                className={`absolute bg-white rounded-3xl overflow-hidden shadow-lg ${
                  i === 0 ? "cursor-pointer hover:scale-[1.02] transition-transform" : ""
                }`}
                style={{
                  width: "580px",
                  height: "300px",
                  maxWidth: "calc(100% - 20px)",
                  boxShadow:
                    "0px 35px 14px rgba(0, 0, 0, 0.01), 0px 20px 12px rgba(0, 0, 0, 0.05), 0px 9px 9px rgba(0, 0, 0, 0.09), 0px 2px 5px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={card.image}
                    alt={card.label}
                    fill
                    className="object-cover rounded-3xl"
                    priority={i === 0}
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

