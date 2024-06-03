import React from "react";

import { AnimatePresence, motion } from "framer-motion";

export function ActionMenu({ isOpen, transactionList, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key={1}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "100%", opacity: 1 }}
          transition={{ ease: "easeOut", duration: 0.1 }}
          exit={{ height: 0, opacity: 0 }}
          className="flex flex-col justify-start items-center gap-3 bg-inherit overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
