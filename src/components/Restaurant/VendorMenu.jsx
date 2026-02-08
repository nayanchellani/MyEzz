// src/components/VendorMenu.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import MenuItem from "./MenuItem";

function VendorMenu({ vendor, closeMenu, addToCart, cart, removeFromCart }) {
  const [activeCategory, setActiveCategory] = useState(
    vendor.categories[0]?.name || ""
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyCategory, setShowOnlyCategory] = useState(false);
  const menuRef = useRef(null);
  const categoryRefs = useRef({});

  // Initialize category refs
  useEffect(() => {
    vendor.categories.forEach((category) => {
      categoryRefs.current[category.name] =
        categoryRefs.current[category.name] || React.createRef();
    });
  }, [vendor.categories]);

  // Scroll to category when active category changes
  useEffect(() => {
    if (activeCategory && categoryRefs.current[activeCategory]?.current && !showOnlyCategory) {
      categoryRefs.current[activeCategory].current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [activeCategory, showOnlyCategory]);

  const handleScroll = () => {
    if (!menuRef.current) return;

    const scrollPosition = menuRef.current.scrollTop;
    let currentCategory = activeCategory;

    for (const [name, ref] of Object.entries(categoryRefs.current)) {
      if (!ref.current) continue;

      const element = ref.current;
      const elementTop = element.offsetTop;
      const elementBottom = elementTop + element.offsetHeight;

      if (
        elementTop <= scrollPosition + 100 &&
        elementBottom > scrollPosition
      ) {
        currentCategory = name;
        break;
      }
    }

    if (currentCategory !== activeCategory) {
      setActiveCategory(currentCategory);
    }
  };

  // --- Improved search: match item.name, item.description or category.name ---
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredCategories = vendor.categories
    .map((category) => {
      const items = (category.items || []).filter((item) => {
        if (!normalizedQuery) return true;
        const nameMatch = (item.name || "").toLowerCase().includes(normalizedQuery);
        const descMatch = (item.description || "").toLowerCase().includes(normalizedQuery);
        const catMatch = (category.name || "").toLowerCase().includes(normalizedQuery);
        return nameMatch || descMatch || catMatch;
      });
      return { ...category, items };
    })
    .filter((category) => category.items.length > 0);

  // If user requested "only this category", limit to just that one
  const categoriesToRender = showOnlyCategory && activeCategory
    ? filteredCategories.filter((c) => c.name === activeCategory)
    : filteredCategories;

  return (
    <motion.div
      // raise z-index above header (header was z-50 in your code)
      className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-transparent backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={closeMenu}
    >
      <motion.div
        className="vendor-menu bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] w-full max-w-4xl max-h-screen rounded-xl overflow-hidden shadow-2xl flex flex-col"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-sky-500 to-sky-700 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{vendor.name}</h2>
              <p className="text-sky-100 italic mt-1">{vendor.tagline}</p>
            </div>

            {/* Close button: make sure it's above header and visible */}
            <motion.button
              className="p-3 rounded-full bg-white-500 hover:bg-red-600 transition-colors flex items-center justify-center ml-4 text-white font-bold shadow-lg border-2 border-white"
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={closeMenu}
              style={{ zIndex: 70 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>
          </div>

          {/* Search */}
          <div className="mt-4 relative">
            <input
              type="text"
              placeholder="Search menu items or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-full bg-white bg-opacity-20 text-black dark:text-white placeholder-gray-500 border border-white border-opacity-20 focus:outline-none focus:bg-opacity-30"
            />
            <div className="absolute right-3 top-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500 dark:text-gray-400 opacity-70"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] border-b border-gray-200 sticky top-0 z-50 shadow-md">
          <div className="flex space-x-1 p-2 min-w-max">
            {vendor.categories.map((category) => (
              <motion.button
                key={category.name}
                onClick={() => {
                  if (activeCategory === category.name) {
                    // toggle: clicking same category again toggles "show only"
                    setShowOnlyCategory((s) => !s);
                  } else {
                    setActiveCategory(category.name);
                    setShowOnlyCategory(true); // show only when selecting a category
                  }
                }}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all text-base ${activeCategory === category.name
                  ? "bg-sky-100 text-sky-800 dark:text-sky-200 font-medium"
                  : "text-sky-600 dark:text-sky-300 hover:bg-sky-50"
                  }`}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                {category.name}
              </motion.button>
            ))}

            {/* Clear "show only" / clear search */}
            <div className="ml-2 flex items-center space-x-2">
              <button
                onClick={() => {
                  setShowOnlyCategory(false);
                  setActiveCategory(vendor.categories[0]?.name || "");
                }}
                className="text-sm px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
              >
                Show all
              </button>
              <button
                onClick={() => setSearchQuery("")}
                className="text-sm px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
              >
                Clear search
              </button>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div
          className="flex-1 overflow-y-auto p-4"
          ref={menuRef}
          onScroll={handleScroll}
        >
          {searchQuery && categoriesToRender.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No items found matching "{searchQuery}"
              </p>
              <button
                className="mt-2 text-sky-600 dark:text-sky-300 hover:underline"
                onClick={() => setSearchQuery("")}
              >
                Clear search
              </button>
            </div>
          ) : (
            categoriesToRender.map((category) => (
              <div
                key={category.name}
                ref={(el) => (categoryRefs.current[category.name] = { current: el })}
                className="mb-8"
              >
                <h3 className="text-lg font-bold text-sky-800 dark:text-sky-200 mb-4 sticky -top-5 bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] shadow-md py-3 z-50 border-b border-gray-300">
                  {category.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.items.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      vendor={vendor.name}
                      addToCart={addToCart}
                      cart={cart}
                      removeFromCart={removeFromCart}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default VendorMenu;
