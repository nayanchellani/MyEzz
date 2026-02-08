// src/components/VendorGrid.jsx
import React from "react";
import { getRestaurantDistance } from '../utils/distance';

const isVendorOpen = (vendor) => {
  if (!vendor.availableAfter) return true;
  const [vendorHour, vendorMinute] = vendor.availableAfter.split(":").map(Number);
  const vendorMinutes = vendorHour * 60 + vendorMinute;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return currentMinutes >= vendorMinutes;
};

const vendorInitials = (name) => {
  if (!name) return "V";
  const parts = name.split(" ");
  return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
};

function VendorGrid({ vendors = [], setSelectedVendor, showOnlyJain, userLocation }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {vendors
        .filter((vendor) => (showOnlyJain ? vendor.jain : true))
        .map((vendor, idx) => {
          const open = isVendorOpen(vendor);
          const itemsCount = vendor.categories?.reduce(
            (sum, c) => sum + (c.items?.length || 0),
            0
          );
          return (
            <article
              key={idx}
              className={`relative cursor-pointer border rounded-lg p-4 shadow-sm hover:shadow-lg transition-transform duration-200 bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] flex flex-col justify-between ${!open ? "opacity-60" : "hover:-translate-y-1"
                }`}
              onClick={() => open && setSelectedVendor(vendor)}
              aria-disabled={!open}
            >
              <div className="flex items-start gap-4">
                {/* Avatar / hero */}
                <div className="w-16 h-16 rounded-lg flex items-center justify-center text-xl font-bold text-white"
                  style={{
                    background: "linear-gradient(135deg,#06b6d4,#3b82f6)"
                  }}>
                  {vendorInitials(vendor.name)}
                </div>

                {/* Name & tagline */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{vendor.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{vendor.tagline}</p>

                  <div className="flex items-center gap-3 mt-3">
                    <span className={`text-sm font-medium ${vendor.jain ? "text-green-600" : "text-red-600"}`}>
                      {vendor.jain ? "Jain" : "Non-Jain"}
                    </span>

                    <span className={`text-xs px-2 py-1 rounded-full ${open ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                      {open ? "Open" : "Closed"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer: items count, optional rating, CTA */}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {itemsCount} items • {vendor.estimatedTime || "20-35 min"}
                  {userLocation && (() => {
                    const distance = getRestaurantDistance(userLocation, vendor);
                    return distance !== null ? ` • ${distance} km` : '';
                  })()}
                </div>

                <div className="flex items-center gap-2">
                  {/* Rating placeholder (if vendor.rating exists, show it) */}
                  {vendor.rating ? (
                    <div className="flex items-center text-sm text-yellow-600 font-semibold">
                      <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.974c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.784.57-1.84-.197-1.54-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.047 9.4c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.974z" /></svg>
                      {vendor.rating}
                    </div>
                  ) : null}

                  <button
                    className={`px-3 py-1 rounded-full text-sm font-medium ${open ? "bg-sky-600 text-white" : "bg-gray-200 text-gray-600 dark:text-gray-300"} `}
                    onClick={(e) => { e.stopPropagation(); open && setSelectedVendor(vendor); }}
                  >
                    {open ? "View Menu" : "Closed"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
    </div>
  );
}

export default VendorGrid;
