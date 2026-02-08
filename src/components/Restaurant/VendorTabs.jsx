// src/components/VendorTabs.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MenuCategory from "./MenuCategory";

function VendorTabs({ vendors = [], activeVendor, setActiveVendor, addToCart }) {
  const [activeCategory, setActiveCategory] = useState(
    vendors.find((v) => v.name === activeVendor)?.categories?.[0]?.name || ""
  );

  useEffect(() => {
    const v = vendors.find(v => v.name === activeVendor);
    setActiveCategory(v?.categories?.[0]?.name || "");
  }, [activeVendor, vendors]);

  const activeVendorData = vendors.find((v) => v.name === activeVendor);

  return (
    <div>
      {/* vendor horizontal tabs */}
      <div className="overflow-x-auto">
        <div className="flex space-x-3 p-4">
          {vendors.map(vendor => (
            <motion.button
              key={vendor.name}
              onClick={() => setActiveVendor(vendor.name)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                activeVendor === vendor.name ? "bg-sky-600 text-white shadow" : "bg-sky-50 text-sky-800 hover:bg-sky-100"
              }`}
              whileHover={{ scale: 1.02 }}
            >
              {vendor.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* active vendor header */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeVendor}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="px-6 py-4 border-b border-sky-100"
        >
          <h2 className="text-2xl font-bold text-sky-800">{activeVendorData?.name}</h2>
          <p className="text-sky-600 italic">{activeVendorData?.tagline}</p>
        </motion.div>
      </AnimatePresence>

      {/* categories pills */}
      {activeVendorData?.categories?.length > 0 && (
        <div className="px-6 pt-4 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            {activeVendorData.categories.map(cat => (
              <motion.button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-3 py-1.5 rounded-t-lg transition ${
                  activeCategory === cat.name ? "bg-sky-100 text-sky-800 font-medium" : "text-sky-600 hover:bg-sky-50"
                }`}
                whileHover={{ y: -2 }}
              >
                {cat.name}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* menu content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeVendorData?.categories?.map(category => (
            <div key={category.name} style={{ display: activeCategory === category.name ? "block" : "none" }}>
              <MenuCategory category={category} vendor={activeVendorData.name} addToCart={addToCart} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default VendorTabs;
