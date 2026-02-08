import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function OrderForm({ cart, onCancel, isSubmitting }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [phoneStatus, setPhoneStatus] = useState({ isValid: false, message: "" });

  // Indian phone number validation
  const validateIndianPhone = (phone) => {
    // Remove all non-digits
    const cleanPhone = phone.replace(/\D/g, "");

    // Check if it's a valid Indian mobile number
    const mobileRegex = /^[6-9]\d{9}$/;
    const landlineRegex = /^[2-9]\d{9}$/;

    if (cleanPhone.length === 0) {
      return { isValid: false, message: "Phone number is required" };
    }

    if (cleanPhone.length < 10) {
      return { isValid: false, message: "Phone number must be at least 10 digits" };
    }

    if (cleanPhone.length > 10) {
      return { isValid: false, message: "Phone number should be exactly 10 digits" };
    }

    // Check if it's a valid mobile number (starts with 6, 7, 8, or 9)
    if (mobileRegex.test(cleanPhone)) {
      return { isValid: true, message: "✅ Valid mobile number" };
    }

    // Check if it's a valid landline number (starts with 2-9)
    if (landlineRegex.test(cleanPhone)) {
      return { isValid: true, message: "✅ Valid landline number" };
    }

    return { isValid: false, message: "❌ Invalid phone number format" };
  };

  // Format phone number as user types
  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const cleanValue = value.replace(/\D/g, "");

    // Format as XXX-XXX-XXXX
    if (cleanValue.length <= 3) {
      return cleanValue;
    } else if (cleanValue.length <= 6) {
      return `${cleanValue.slice(0, 3)}-${cleanValue.slice(3)}`;
    } else {
      return `${cleanValue.slice(0, 3)}-${cleanValue.slice(3, 6)}-${cleanValue.slice(6, 10)}`;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Format phone number as user types
      const formattedPhone = formatPhoneNumber(value);
      setFormData({ ...formData, [name]: formattedPhone });

      // Validate phone number in real-time
      const validation = validateIndianPhone(formattedPhone);
      setPhoneStatus(validation);

      // Clear error if phone becomes valid
      if (validation.isValid && errors.phone) {
        setErrors({ ...errors, phone: "" });
      }
    } else {
      setFormData({ ...formData, [name]: value });

      // Clear error for other fields
      if (errors[name]) {
        setErrors({ ...errors, [name]: "" });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    // Phone validation
    const phoneValidation = validateIndianPhone(formData.phone);
    if (!phoneValidation.isValid) {
      newErrors.phone = phoneValidation.message;
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    } else if (formData.address.trim().length < 10) {
      newErrors.address = "Address must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Clean phone number before sending (remove formatting)
      const cleanPhone = formData.phone.replace(/\D/g, "");
      const cleanFormData = { ...formData, phone: cleanPhone };

      // ✅ Redirect to /payment with formData and cart
      navigate("/payment", {
        state: {
          customerInfo: cleanFormData,
          cart: cart
        }
      });
    }
  };

  return (
    <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-lg p-6 shadow-md">
      <h2 className="text-xl font-bold text-sky-800 dark:text-sky-200 mb-4">Delivery Information</h2>

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 dark:text-gray-200 font-medium mb-1">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500`}
            placeholder="Enter your full name"
            maxLength="50"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 dark:text-gray-200 font-medium mb-1">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500`}
            placeholder="your.email@example.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label htmlFor="phone" className="block text-gray-700 dark:text-gray-200 font-medium mb-1">Phone Number *</label>
          <div className="relative">
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.phone ? "border-red-500" : phoneStatus.isValid ? "border-green-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500`}
              placeholder="XXX-XXX-XXXX"
              maxLength="12"
            />
            {phoneStatus.isValid && (
              <div className="absolute right-3 top-2 text-green-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          {phoneStatus.message && !errors.phone && (
            <p className={`text-sm mt-1 ${phoneStatus.isValid ? 'text-green-600' : 'text-gray-500 dark:text-gray-400'}`}>
              {phoneStatus.message}
            </p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Enter a valid 10-digit Indian mobile or landline number
          </p>
        </div>

        {/* Address */}
        <div className="mb-6">
          <label htmlFor="address" className="block text-gray-700 dark:text-gray-200 font-medium mb-1">Delivery Address *</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
            className={`w-full px-3 py-2 border ${errors.address ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500`}
            placeholder="Enter your complete delivery address including landmarks, street name, city, and PIN code"
            maxLength="200"
          ></textarea>
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Please provide your complete address for accurate delivery
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <motion.button
            type="submit"
            className="bg-sky-600 hover:bg-sky-700 text-white py-2 px-6 rounded-lg font-medium flex-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Place Order"}
          </motion.button>

          <motion.button
            type="button"
            className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] hover:bg-gray-100 border border-gray-300 py-2 px-4 rounded-lg font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </motion.button>
        </div>
      </form>
    </div>
  );
}

export default OrderForm;
