"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";

interface ArmaPcLogoProps {
  className?: string;
  fill?: string;
  animated?: boolean;
}

const letterBlock: Variants = {
  initial: { y: 120, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

export function ArmaPcLogo({
  className = "h-4 sm:h-[18px] w-auto",
  fill = "currentColor",
  animated = false,
}: ArmaPcLogoProps) {
  if (animated) {
    return (
      <motion.svg
        viewBox="0 0 1040 100"
        fill={fill}
        initial="initial"
        animate="animate"
        variants={{
          initial: { scale: 1.02 },
          animate: {
            scale: 1,
            transition: { staggerChildren: 0.04, delayChildren: 0.05 },
          },
        }}
        className={`${className} transition-transform duration-300 group-hover:opacity-90 drop-shadow-[0_2px_12px_rgba(255,255,255,0.15)]`}
        aria-label="ARMAPC"
      >
        {/* LETTER A */}
        <g transform="translate(35, 0)">
          <motion.polygon variants={letterBlock} points="0,20 22,20 22,100 0,100" />
          <motion.polygon variants={letterBlock} points="0,0 130,0 130,20 0,20" />
          <motion.polygon variants={letterBlock} points="108,20 130,20 130,100 108,100" />
          <motion.polygon variants={letterBlock} points="22,46 108,46 108,66 22,66" />
        </g>

        {/* LETTER R */}
        <g transform="translate(195, 0)">
          <motion.polygon variants={letterBlock} points="0,0 22,0 22,100 0,100" />
          <motion.polygon variants={letterBlock} points="22,0 130,0 130,20 22,20" />
          <motion.polygon variants={letterBlock} points="108,20 130,20 130,54 108,54" />
          <motion.polygon variants={letterBlock} points="22,40 120,40 120,58 22,58" />
          <motion.polygon variants={letterBlock} points="60,56 82,56 130,100 106,100" />
        </g>

        {/* LETTER M */}
        <g transform="translate(355, 0)">
          <motion.polygon variants={letterBlock} points="0,0 22,0 22,100 0,100" />
          <motion.polygon variants={letterBlock} points="128,0 150,0 150,100 128,100" />
          <motion.polygon variants={letterBlock} points="22,0 44,0 82,62 64,62" />
          <motion.polygon variants={letterBlock} points="106,0 128,0 86,62 68,62" />
        </g>

        {/* LETTER A */}
        <g transform="translate(535, 0)">
          <motion.polygon variants={letterBlock} points="0,20 22,20 22,100 0,100" />
          <motion.polygon variants={letterBlock} points="0,0 130,0 130,20 0,20" />
          <motion.polygon variants={letterBlock} points="108,20 130,20 130,100 108,100" />
          <motion.polygon variants={letterBlock} points="22,46 108,46 108,66 22,66" />
        </g>

        {/* LETTER P */}
        <g transform="translate(710, 0)">
          <motion.polygon variants={letterBlock} points="0,0 22,0 22,100 0,100" />
          <motion.polygon variants={letterBlock} points="22,0 130,0 130,20 22,20" />
          <motion.polygon variants={letterBlock} points="108,20 130,20 130,58 108,58" />
          <motion.polygon variants={letterBlock} points="22,42 120,42 120,60 22,60" />
        </g>

        {/* LETTER C */}
        <g transform="translate(870, 0)">
          <motion.polygon variants={letterBlock} points="0,0 22,0 22,100 0,100" />
          <motion.polygon variants={letterBlock} points="22,0 130,0 130,20 22,20" />
          <motion.polygon variants={letterBlock} points="22,80 130,80 130,100 22,100" />
          <motion.polygon variants={letterBlock} points="108,20 130,20 130,36 108,36" />
          <motion.polygon variants={letterBlock} points="108,64 130,64 130,80 108,80" />
        </g>
      </motion.svg>
    );
  }

  return (
    <svg
      viewBox="0 0 1040 100"
      fill={fill}
      className={`${className} transition-opacity duration-300 group-hover:opacity-80 drop-shadow-[0_2px_12px_rgba(255,255,255,0.15)]`}
      aria-label="ARMAPC"
    >
      {/* LETTER A */}
      <g transform="translate(35, 0)">
        <polygon points="0,20 22,20 22,100 0,100" />
        <polygon points="0,0 130,0 130,20 0,20" />
        <polygon points="108,20 130,20 130,100 108,100" />
        <polygon points="22,46 108,46 108,66 22,66" />
      </g>

      {/* LETTER R */}
      <g transform="translate(195, 0)">
        <polygon points="0,0 22,0 22,100 0,100" />
        <polygon points="22,0 130,0 130,20 22,20" />
        <polygon points="108,20 130,20 130,54 108,54" />
        <polygon points="22,40 120,40 120,58 22,58" />
        <polygon points="60,56 82,56 130,100 106,100" />
      </g>

      {/* LETTER M */}
      <g transform="translate(355, 0)">
        <polygon points="0,0 22,0 22,100 0,100" />
        <polygon points="128,0 150,0 150,100 128,100" />
        <polygon points="22,0 44,0 82,62 64,62" />
        <polygon points="106,0 128,0 86,62 68,62" />
      </g>

      {/* LETTER A */}
      <g transform="translate(535, 0)">
        <polygon points="0,20 22,20 22,100 0,100" />
        <polygon points="0,0 130,0 130,20 0,20" />
        <polygon points="108,20 130,20 130,100 108,100" />
        <polygon points="22,46 108,46 108,66 22,66" />
      </g>

      {/* LETTER P */}
      <g transform="translate(710, 0)">
        <polygon points="0,0 22,0 22,100 0,100" />
        <polygon points="22,0 130,0 130,20 22,20" />
        <polygon points="108,20 130,20 130,58 108,58" />
        <polygon points="22,42 120,42 120,60 22,60" />
      </g>

      {/* LETTER C */}
      <g transform="translate(870, 0)">
        <polygon points="0,0 22,0 22,100 0,100" />
        <polygon points="22,0 130,0 130,20 22,20" />
        <polygon points="22,80 130,80 130,100 22,100" />
        <polygon points="108,20 130,20 130,36 108,36" />
        <polygon points="108,64 130,64 130,80 108,80" />
      </g>
    </svg>
  );
}
