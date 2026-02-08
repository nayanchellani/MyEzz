

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MenuItem from "./MenuItem";

function MenuSection({ vendor, addToCart }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <motion.div
      className="mb-6 border border-sky-100 rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
    >
      <motion.div
        className="bg-sky-50 p-4 cursor-pointer"
        onClick={toggleOpen}
        whileHover={{ backgroundColor: "#e0f2fe" }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-sky-800">{vendor.name}</h3>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-sky-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </motion.div>
        </div>
        <p className="text-sky-600 italic mt-1">{vendor.tagline}</p>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-white">
              {vendor.categories.map((category) => (
                <div key={category.name} className="mb-6">
                  <h4 className="text-lg font-bold text-sky-700 mb-3">
                    {category.name}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.items.map((item) => (
                      <MenuItem
                        key={item.id}
                        item={item}
                        vendor={vendor.name}
                        addToCart={addToCart}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default MenuSection;
