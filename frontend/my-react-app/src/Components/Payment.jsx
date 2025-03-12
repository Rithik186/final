import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard } from "lucide-react";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { billList = [], totalAmount = 0 } = location.state || {};

  // State for address form
  const [address, setAddress] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
  });

  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input change for address form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Validate address form
  const validateForm = () => {
    const requiredFields = ["fullName", "addressLine1", "city", "state", "postalCode", "phone"];
    for (let field of requiredFields) {
      if (!address[field].trim()) {
        setFormError(`Please fill in the ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`);
        return false;
      }
    }
    setFormError("");
    return true;
  };

  // Razorpay Payment Integration
  const handlePayment = async () => {
    if (!validateForm()) return;

    setLoading(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      const options = {
        key: "YOUR_RAZORPAY_KEY_ID", // Replace with your Razorpay Key ID
        amount: totalAmount * 100, // Amount in paise
        currency: "INR",
        name: "Farmer's Market",
        description: "Product Purchase",
        image: "https://i.pinimg.com/736x/a8/f4/6a/a8f46ad882c293af8c3fe011ce13bbb0.jpg",
        handler: (response) => {
          setLoading(false);
          alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
          navigate("/order-confirmation", {
            state: { billList, totalAmount, address, paymentId: response.razorpay_payment_id },
          });
        },
        prefill: { name: address.fullName, contact: address.phone },
        theme: { color: "#14b8a6" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", (response) => {
        setLoading(false);
        alert("Payment Failed: " + response.error.description);
      });
      paymentObject.open();
    };
    script.onerror = () => {
      setLoading(false);
      alert("Failed to load Razorpay SDK. Please try again.");
    };
    document.body.appendChild(script);
  };

  // Animation Variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-teal-100 via-emerald-100 to-cyan-100 p-6 font-sans"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg"
          variants={itemVariants}
        >
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-teal-700 hover:bg-teal-100 rounded-full transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-teal-900">Checkout</h1>
          </div>
          <img
            src="https://i.pinimg.com/736x/a8/f4/6a/a8f46ad882c293af8c3fe011ce13bbb0.jpg"
            alt="Logo"
            className="w-10 h-10 rounded-full border-2 border-teal-200"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Cart Summary */}
          <motion.div
            className="lg:col-span-2 bg-white/95 p-6 rounded-xl shadow-lg border border-teal-200"
            variants={itemVariants}
          >
            <h2 className="text-xl font-semibold text-teal-900 mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" /> Cart Summary
            </h2>
            {billList.length === 0 ? (
              <p className="text-gray-500 italic">Your cart is empty. Please add items to proceed.</p>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {billList.map((item) => (
                  <motion.div
                    key={item.id}
                    className="flex items-center justify-between py-3 border-b border-teal-100"
                    variants={itemVariants}
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-md object-cover shadow-sm"
                      />
                      <div>
                        <p className="font-medium text-teal-800">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          {item.qty} x ₹{item.price}
                        </p>
                      </div>
                    </div>
                    <p className="text-teal-700 font-semibold">₹{item.finalPrice}</p>
                  </motion.div>
                ))}
              </div>
            )}
            <div className="mt-6 pt-4 border-t border-teal-200">
              <div className="flex justify-between text-lg font-semibold text-teal-900">
                <span>Total Amount</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>

          {/* Address Form & Payment */}
          <motion.div
            className="lg:col-span-3 bg-white/95 p-6 rounded-xl shadow-lg border border-teal-200"
            variants={itemVariants}
          >
            <h2 className="text-xl font-semibold text-teal-900 mb-6">Shipping & Payment Details</h2>

            {/* Address Form */}
            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={address.fullName}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-teal-300 bg-teal-50 focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                <input
                  type="text"
                  name="addressLine1"
                  value={address.addressLine1}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-teal-300 bg-teal-50 focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
                  placeholder="123 Main St"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  name="addressLine2"
                  value={address.addressLine2}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-teal-300 bg-teal-50 focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
                  placeholder="Apartment, Suite, etc."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-teal-300 bg-teal-50 focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
                    placeholder="Mumbai"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-teal-300 bg-teal-50 focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
                    placeholder="Maharashtra"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={address.postalCode}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-teal-300 bg-teal-50 focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
                    placeholder="400001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={address.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-teal-300 bg-teal-50 focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>
              {formError && (
                <motion.p
                  className="text-red-600 text-sm mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {formError}
                </motion.p>
              )}
            </div>

            {/* Payment Button */}
            <motion.button
              onClick={handlePayment}
              disabled={loading || billList.length === 0}
              className={`w-full mt-8 py-3 px-6 rounded-lg text-white font-semibold shadow-lg flex items-center justify-center space-x-2 transition-all ${
                loading || billList.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800"
              }`}
              whileHover={{ scale: billList.length > 0 && !loading ? 1.05 : 1 }}
              whileTap={{ scale: billList.length > 0 && !loading ? 0.95 : 1 }}
            >
              <CreditCard className="w-5 h-5" />
              <span>{loading ? "Processing..." : "Pay Now with Razorpay"}</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Payment;