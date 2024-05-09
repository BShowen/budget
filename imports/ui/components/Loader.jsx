import React, { useEffect } from "react";
import { motion } from "framer-motion";

// Components
import { squircle } from "ldrs";

export function Loader() {
  squircle.register();

  useEffect(() => {
    document.body.classList.add("prevent-scroll");
    return () => document.body.classList.remove("prevent-scroll");
  }, []);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0 }}
      className="w-full height-full flex flex-col justify-center items-center z-[51] relative gap-1"
    >
      <l-squircle
        size="60"
        speed="1.0"
        color="#0169FE"
        stroke-length="0.20"
        bg-opacity="0.1"
      ></l-squircle>
    </motion.div>
  );
}
