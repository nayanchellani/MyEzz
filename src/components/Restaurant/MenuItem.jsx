
// src/components/MenuItem.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

function MenuItem({ item, vendor, addToCart, cart, removeFromCart }) {
  const priceKeys = typeof item.price === "object" ? Object.keys(item.price) : [];
  const [selectedPortion, setSelectedPortion] = useState(priceKeys[0] || "");

  // Find if this item is already in cart
  const itemId = `${item.id}-${selectedPortion}`;
  const cartItem = cart?.find(i => i.id === itemId && i.vendor === vendor);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    const selectedItem = {
      id: itemId,
      name: item.name,
      price: typeof item.price === "object" ? item.price[selectedPortion] : item.price,
      vendor,
      jain: !!item.jain,
      portion: selectedPortion,
      description: item.description || "",
      quantity: 1,
    };
    addToCart(selectedItem);
  };

  const handleIncrement = () => {
    handleAdd();
  };

  const handleDecrement = () => {
    if (cartItem) {
      removeFromCart(cartItem);
    }
  };

  return (
    <motion.div
      className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md flex justify-between items-start gap-4"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex-1">
        <div className="flex items-start gap-3">
          <div className="w-16 h-16 rounded-md bg-gray-100 grid place-items-center text-gray-600 font-semibold">
            {item.name.split(" ").slice(0,2).map(n=>n[0]).join("")}
          </div>
          <div>
            <h5 className="font-medium text-gray-800">{item.name}</h5>
            {item.description && <p className="text-sm text-gray-500 mt-1">{item.description}</p>}
            <div className="mt-2 text-sky-700 font-bold">
              {typeof item.price === "object"
                ? Object.entries(item.price).map(([k, v]) => `${k}: ₹${v}`).join(" / ")
                : `₹${item.price}`}
            </div>
          </div>
        </div>

        {priceKeys.length > 0 && (
          <div className="mt-3 flex gap-2 items-center">
            <label className="text-sm text-gray-600">Portion</label>
            <select className="border rounded px-2 py-1 text-sm" value={selectedPortion} onChange={(e) => setSelectedPortion(e.target.value)}>
              {priceKeys.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-3">
        {quantity === 0 ? (
          <button
            onClick={handleAdd}
            className="bg-gradient-to-b from-[#ff7a1a] to-[#ff5c00] hover:from-[#ff8a2a] hover:to-[#ff6a10] text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 shadow-[0_4px_12px_rgba(255,106,0,0.3)] hover:shadow-[0_6px_16px_rgba(255,106,0,0.4)] hover:scale-[1.02] active:scale-[0.98]"
          >
            ADD
          </button>
        ) : (
          <div className="flex items-center gap-1">
            <button
              onClick={handleDecrement}
              className="border-2 border-orange-500 text-orange-600 hover:text-white hover:bg-orange-500 w-8 h-8 rounded-md transition-all duration-200 font-bold text-xl flex items-center justify-center active:scale-90"
            >
              −
            </button>
            <span className="text-orange-600 font-bold px-3 min-w-[2.5rem] text-center">
              {quantity}
            </span>
            <button
              onClick={handleIncrement}
              className="border-2 border-orange-500 text-orange-600 hover:text-white hover:bg-orange-500 w-8 h-8 rounded-md transition-all duration-200 font-bold text-xl flex items-center justify-center active:scale-90"
            >
              +
            </button>
          </div>
        )}
        <div className="text-xs text-gray-500">{item.jain ? "Jain" : ""}</div>
      </div>
    </motion.div>
  );
}

export default MenuItem;
