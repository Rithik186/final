import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mic, Settings, LogOut, Plus } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "../firebase.js"; // Firebase Auth
import { getDatabase, ref, onValue, push, set } from "firebase/database"; // Firebase Realtime Database

const ProductSelection = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]); // All products from Goods
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [billList, setBillList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [disputes, setDisputes] = useState([]);
  const [newDispute, setNewDispute] = useState("");
  const [language, setLanguage] = useState("English");
  const [isListening, setIsListening] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [farmerInfo, setFarmerInfo] = useState({ name: "John Doe", email: "john@example.com", id: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const db = getDatabase();

  const translations = {
    English: {
      farmersMarket: "Farmer's Market",
      searchProducts: "Search products...",
      addToBill: "Add to Bill",
      yourBill: "Your Bill",
      subtotal: "Subtotal",
      total: "Total",
      saveToProducts: "Save to Products",
      saving: "Saving...",
      disputeSection: "Dispute Section",
      replyToQuery: "Reply to query...",
      submit: "Submit",
      addSelectedProducts: "Add Selected Products",
      vegetables: "Vegetables",
      fruits: "Fruits",
      seeds: "Seeds",
      dairyProducts: "Dairy Products",
      fertilizers: "Fertilizers",
      herbs: "Herbs",
    },
    தமிழ்: {
      farmersMarket: "விவசாய சந்தை",
      searchProducts: "தயாரிப்புகளைத் தேடு...",
      addToBill: "பில் சேர்",
      yourBill: "உங்கள் பில்",
      subtotal: "துணை மொத்தம்",
      total: "மொத்தம்",
      saveToProducts: "தயாரிப்புகளாக சேமி",
      saving: "சேமிக்கிறது...",
      disputeSection: "புகார் பிரிவு",
      replyToQuery: "வாடிக்கையாளர்களின் கேள்விக்கு பதில்...",
      submit: "சமர்ப்பி",
      addSelectedProducts: "தேர்ந்தெடுத்த பொருட்களை சேர்",
      vegetables: "காய்கறிகள்",
      fruits: "பழங்கள்",
      seeds: "விதைகள்",
      dairyProducts: "பால் பொருட்கள்",
      fertilizers: "உரங்கள்",
      herbs: "மூலிகைகள்",
    },
    हिन्दी: {
      farmersMarket: "किसान बाजार",
      searchProducts: "उत्पाद खोजें...",
      addToBill: "बिल में जोड़ें",
      yourBill: "आपका बिल",
      subtotal: "उप-योग",
      total: "कुल",
      saveToProducts: "उत्पादों में सहेजें",
      saving: "सहेजा जा रहा है...",
      disputeSection: "विवाद अनुभाग",
      replyToQuery: "प्रश्न का जवाब दें...",
      submit: "जमा करें",
      addSelectedProducts: "चयनित उत्पाद जोड़ें",
      vegetables: "सब्जियाँ",
      fruits: "फल",
      seeds: "बीज",
      dairyProducts: "डेयरी उत्पाद",
      fertilizers: "उर्वरक",
      herbs: "जड़ी-बूटियाँ",
    },
  };

  // Fetch farmer info
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setFarmerInfo({
        name: user.displayName || "Farmer",
        email: user.email || "No email",
        id: user.uid,
      });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch products from Goods node
  useEffect(() => {
    setLoading(true);
    const goodsRef = ref(db, "goods");
    const unsubscribe = onValue(
      goodsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const productsArray = Object.entries(data).map(([key, value]) => ({
            id: key,
            name: value.name || "Unnamed Product",
            tamilName: value.tamilName || value.name,
            hindiName: value.hindiName || value.name,
            weight: value.weight || "N/A",
            category: value.category || "Uncategorized",
            image: value.image || "https://via.placeholder.com/150",
          }));
          setAllProducts(productsArray);
        } else {
          setAllProducts([]);
          toast.warn("No products found in Goods", { position: "top-right", autoClose: 3000 });
        }
        setLoading(false);
      },
      (error) => {
        setError(`Failed to load products: ${error.message}`);
        toast.error("Failed to load products", { position: "top-right", autoClose: 3000 });
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [db]);

  // Voice recognition setup
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.warn("Speech recognition is not supported in your browser", { position: "top-right", autoClose: 3000 });
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === "English" ? "en-US" : language === "தமிழ்" ? "ta-IN" : "hi-IN";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      const product = allProducts.find((p) =>
        language === "English"
          ? p.name.toLowerCase().includes(transcript)
          : language === "தமிழ்"
          ? p.tamilName?.toLowerCase().includes(transcript)
          : p.hindiName?.toLowerCase().includes(transcript)
      );
      if (product) {
        toggleSelection(product);
        toast.success(`Selected: ${language === "English" ? product.name : language === "தமிழ்" ? product.tamilName : product.hindiName}`, {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        toast.info(`No product found for "${transcript}"`, { position: "top-right", autoClose: 2000 });
      }
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error("Speech recognition error", { position: "top-right", autoClose: 2000 });
    };
    recognition.onend = () => setIsListening(false);

    if (isListening) recognition.start();
    return () => recognition.stop();
  }, [isListening, language, allProducts]);

  const toggleSelection = (product) => {
    setSelectedProducts((prev) =>
      prev.some((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, { ...product, qty: "", customPrice: "", finalPrice: 0 }]
    );
  };

  const addToBill = () => {
    if (selectedProducts.length === 0) {
      toast.warn("Please select at least one product", { position: "top-right", autoClose: 2000 });
      return;
    }
    setBillList((prev) => {
      let updatedBill = [...prev];
      selectedProducts.forEach((product) => {
        const existingIndex = updatedBill.findIndex((item) => item.id === product.id);
        const qty = Number(product.qty) || 1;
        const price = Number(product.customPrice) || 0;
        if (existingIndex !== -1) {
          updatedBill[existingIndex].qty = qty;
          updatedBill[existingIndex].customPrice = price;
          updatedBill[existingIndex].finalPrice = qty * price;
        } else {
          updatedBill.push({ ...product, qty, customPrice: price, finalPrice: qty * price });
        }
      });
      return updatedBill;
    });
    setSelectedProducts([]);
    toast.success("Products added to bill", { position: "top-right", autoClose: 2000 });
  };

  const updateQuantity = (id, newQty) => {
    setBillList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: newQty === "" ? "" : Math.max(0, Number(newQty)), finalPrice: (newQty === "" ? 0 : Math.max(0, Number(newQty))) * (Number(item.customPrice) || 0) }
          : item
      )
    );
  };

  const updateCustomPrice = (id, newPrice) => {
    setBillList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, customPrice: newPrice === "" ? "" : Math.max(0, Number(newPrice)), finalPrice: item.qty * (newPrice === "" ? 0 : Math.max(0, Number(newPrice))) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setBillList((prev) => prev.filter((item) => item.id !== id));
    toast.info("Item removed from bill", { position: "top-right", autoClose: 2000 });
  };

  const handleSaveProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const user = auth.currentUser;
      if (!user) {
        setError("Please log in to save products");
        navigate("/login");
        return;
      }

      const productsToSave = billList.map((item) => {
        const price = Number(item.customPrice);
        if (isNaN(price) || price <= 0) {
          throw new Error("All products must have a valid price greater than 0.");
        }
        return {
          name: item.name,
          tamilName: item.tamilName,
          hindiName: item.hindiName || item.name,
          quantity: item.qty,
          price,
          category: item.category,
          image: item.image,
          farmerId: user.uid,
          farmerName: farmerInfo.name,
          createdAt: new Date().toISOString(),
        };
      });

      const productsRef = ref(db, `products/farmer_${user.uid}`);
      for (const product of productsToSave) {
        const newProductRef = push(productsRef);
        await set(newProductRef, product);
      }

      setBillList([]);
      toast.success("Products saved successfully!", { position: "top-right", autoClose: 2000 });
    } catch (err) {
      console.error("Error saving products:", err.message);
      setError(err.message || "Failed to save products.");
      toast.error(err.message || "Failed to save products", { position: "top-right", autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  const addDispute = () => {
    if (newDispute.trim()) {
      setDisputes((prev) => [...prev, newDispute]);
      setNewDispute("");
      toast.success(translations[language].submit, { position: "top-right", autoClose: 2000 });
    } else {
      toast.warn("Please enter a dispute before submitting", { position: "top-right", autoClose: 2000 });
    }
  };

  const categorizedBill = {
    Vegetables: billList.filter((item) => item.category === "Vegetables"),
    Fruits: billList.filter((item) => item.category === "Fruits"),
    Seeds: billList.filter((item) => item.category === "Seeds"),
    Fertilizers: billList.filter((item) => item.category === "Fertilizers"),
    Herbs: billList.filter((item) => item.category === "Herbs"),
    "Dairy Products": billList.filter((item) => item.category === "Dairy Products"),
  };

  const totalAmount = billList.reduce((sum, item) => sum + Number(item.finalPrice), 0);

  const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.1 } },
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", when: "beforeChildren", staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  if (loading && !allProducts.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-teal-800 text-xl">Loading...</p>
      </div>
    );
  }

  if (error && !allProducts.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      className={`min-h-screen p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-gray-50 to-teal-50 text-gray-900"}`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <ToastContainer />
      <motion.header
        className="flex justify-between items-center mb-8 bg-gradient-to-r from-teal-500 to-green-500 p-4 rounded-xl shadow-lg"
        variants={containerVariants}
      >
        <div className="flex items-center space-x-4">
          <motion.img
            src="https://i.pinimg.com/736x/a8/f4/6a/a8f46ad882c293af8c3fe011ce13bbb0.jpg"
            alt="Logo"
            className="w-12 h-12 rounded-full border-2 border-white"
            whileHover={{ scale: 1.1, rotate: 360 }}
          />
          <h1 className="text-2xl font-bold text-white">{translations[language].farmersMarket}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-white/10 rounded-full hover:bg-white/20"
            whileHover={{ scale: 1.1 }}
          >
            <Settings className="w-6 h-6 text-white" />
          </motion.button>
          <motion.button
            onClick={() => navigate("/dashboard")}
            className="p-2 bg-white/10 rounded-full hover:bg-white/20"
            whileHover={{ scale: 1.1 }}
          >
            <LogOut className="w-6 h-6 text-white" />
          </motion.button>
        </div>
      </motion.header>

      {showSettings && (
        <motion.div
          className="absolute top-20 right-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-teal-800 dark:text-teal-200">{farmerInfo.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{farmerInfo.email}</p>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2 rounded-lg border border-teal-200 dark:border-teal-600 bg-white dark:bg-gray-700 text-black dark:text-white"
            >
              <option value="English">English</option>
              <option value="தமிழ்">தமிழ் (Tamil)</option>
              <option value="हिन्दी">हिन्दी (Hindi)</option>
            </select>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-full p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </motion.div>
      )}

      <motion.div className="max-w-7xl mx-auto" variants={containerVariants}>
        <div className="flex items-center space-x-4 mb-6">
          <input
            type="text"
            placeholder={translations[language].searchProducts}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-3 rounded-lg border border-teal-300 dark:border-teal-600 bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-teal-400 focus:outline-none"
          />
          <motion.button
            onClick={() => setIsListening(!isListening)}
            className={`p-3 rounded-full ${isListening ? "bg-red-500" : "bg-teal-500"} text-white`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mic className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Display all products directly */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8" variants={containerVariants}>
          {allProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              onClick={() => toggleSelection(product)}
              className={`p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer border-2 ${
                selectedProducts.some((p) => p.id === product.id) ? "border-teal-500" : "border-transparent"
              }`}
            >
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-3" />
              <h3 className="text-lg font-semibold text-teal-800 dark:text-teal-200">
                {language === "English" ? product.name : language === "தமிழ்" ? product.tamilName : product.hindiName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{product.weight}</p>
            </motion.div>
          ))}
        </motion.div>

        {selectedProducts.length > 0 && (
          <motion.button
            onClick={addToBill}
            className="fixed bottom-10 right-10 p-4 bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-700 z-20 flex items-center space-x-2"
            variants={itemVariants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-6 h-6" />
            <span>{translations[language].addSelectedProducts}</span>
          </motion.button>
        )}

        {billList.length > 0 && (
          <motion.div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg" variants={containerVariants}>
            <h2 className="text-2xl font-bold text-teal-800 dark:text-teal-200 mb-4">{translations[language].yourBill}</h2>
            {["Vegetables", "Fruits", "Seeds", "Dairy Products", "Herbs", "Fertilizers"].map((category) =>
              categorizedBill[category].length > 0 && (
                <div key={category} className="mb-6">
                  <h3 className="text-xl font-semibold text-teal-700 dark:text-teal-300">{translations[language][category.toLowerCase()]}</h3>
                  {categorizedBill[category].map((item) => (
                    <motion.div
                      key={item.id}
                      className="flex items-center justify-between p-4 border-b border-teal-100 dark:border-teal-700"
                      variants={itemVariants}
                    >
                      <div className="flex items-center space-x-4">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg" />
                        <div>
                          <p className="font-medium text-teal-800 dark:text-teal-200">
                            {language === "English" ? item.name : language === "தமிழ்" ? item.tamilName : item.hindiName}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{item.weight}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) => updateQuantity(item.id, e.target.value)}
                          className="w-16 p-2 rounded-lg border border-teal-300 dark:border-teal-600 bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-teal-400 focus:outline-none"
                          min="0"
                          placeholder="Qty"
                        />
                        <input
                          type="number"
                          value={item.customPrice}
                          onChange={(e) => updateCustomPrice(item.id, e.target.value)}
                          className="w-20 p-2 rounded-lg border border-teal-300 dark:border-teal-600 bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-teal-400 focus:outline-none"
                          min="0"
                          placeholder="Price"
                        />
                        <p className="text-teal-700 dark:text-teal-300 font-medium">₹{item.finalPrice.toFixed(2)}</p>
                        <button onClick={() => removeItem(item.id)} className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                          ✕
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  <p className="text-right font-semibold text-teal-800 dark:text-teal-200 mt-2">
                    {translations[language].subtotal}: ₹{categorizedBill[category].reduce((sum, item) => sum + Number(item.finalPrice), 0).toFixed(2)}
                  </p>
                </div>
              )
            )}
            <p className="text-2xl font-bold text-teal-800 dark:text-teal-200 text-right">
              {translations[language].total}: ₹{totalAmount.toFixed(2)}
            </p>
            <motion.button
              onClick={handleSaveProducts}
              disabled={loading}
              className={`mt-4 w-full py-3 ${loading ? "bg-gray-400" : "bg-teal-600"} text-white rounded-lg hover:bg-teal-700 shadow-md`}
              variants={itemVariants}
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
            >
              {loading ? translations[language].saving : translations[language].saveToProducts}
            </motion.button>
            {error && (
              <motion.p className="text-red-600 dark:text-red-400 mt-2 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {error}
              </motion.p>
            )}
          </motion.div>
        )}

        <motion.div className="mt-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg" variants={containerVariants}>
          <h2 className="text-xl font-bold text-teal-800 dark:text-teal-200 mb-4">{translations[language].disputeSection}</h2>
          <input
            type="text"
            value={newDispute}
            onChange={(e) => setNewDispute(e.target.value)}
            placeholder={translations[language].replyToQuery}
            className="w-full p-3 rounded-lg border border-teal-300 dark:border-teal-600 bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-teal-400 focus:outline-none"
          />
          <button
            onClick={addDispute}
            className="w-full p-3 mt-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 shadow-md"
          >
            {translations[language].submit}
          </button>
          {disputes.map((dispute, index) => (
            <p key={index} className="mt-2 text-teal-700 dark:text-teal-300">{dispute}</p>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProductSelection;