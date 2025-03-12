import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase.js"; // Ensure this is correctly configured
import { getDatabase, ref, onValue, get } from "firebase/database";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const translations = {
  "en-IN": {
    helloFarmer: "Hello, Farmer!",
    settings: "Settings",
    help: "Help",
    weather: "Weather",
    confirmed: "Confirmed",
    dispatched: "Dispatched",
    cancelled: "Cancelled",
    previousOrders: "Previous Orders",
    currentOrders: "Current Orders",
    totalEarnings: "Total Earnings",
    marketPrices: "Market Prices",
    sellSurplus: "Sell Surplus Product",
    addProduct: "Add Product",
    cropRecommendation: "Crop Recommendation",
    ordersGraph: "Orders Graph",
    yourProducts: "Your Products",
    logout: "Logout",
    withdrawProduct: "Withdraw Product",
    feedback: "Feedback",
    newMessage: "New Message",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    farmingNews: "Farming News",
    newToDashboard: "New to this dashboard?",
    yes: "Yes",
    no: "No",
    next: "Next",
    finish: "Finish",
    guideConfirmed: "View your confirmed orders here.",
    guideCancelled: "See cancelled orders in this section.",
    guideDispatched: "Track dispatched orders here.",
    guideTotalEarnings: "Check your total earnings from all orders.",
    guideCurrentOrders: "Monitor your ongoing orders here.",
    guidePreviousOrders: "View your past completed orders.",
    guideSellSurplus: "List your excess produce for sale here.",
    guideCropRecommendation: "Get crop suggestions based on market trends.",
    guideFarmingNews: "Stay updated with the latest farming news.",
    guideOrdersGraph: "Analyze your order trends with this graph.",
    guideYourProducts: "See all your listed products here.",
    guideWeather: "Check real-time weather updates for your area.",
    guideNewMessage: "Send or view messages and notifications.",
    guideFeedback: "Submit your feedback about the platform.",
    guideWithdrawProduct: "Remove products from your listings here.",
    guideAddProduct: "Add new products to sell in this section.",
  },
  "ta-IN": {
    helloFarmer: "வணக்கம், விவசாயி!",
    settings: "அமைப்புகள்",
    help: "உதவி",
    weather: "வானிலை",
    confirmed: "உறுதிப்படுத்தப்பட்டது",
    dispatched: "அனுப்பப்பட்டது",
    cancelled: "ரத்து செய்யப்பட்டது",
    previousOrders: "முந்தைய ஆர்டர்கள்",
    currentOrders: "தற்போதைய ஆர்டர்கள்",
    totalEarnings: "மொத்த வருவாய்",
    marketPrices: "சந்தை விலைகள்",
    sellSurplus: "உபரி பொருளை விற்கவும்",
    addProduct: "பொருளை சேர்",
    cropRecommendation: "பயிர் பரிந்துரை",
    ordersGraph: "ஆர்டர் வரைபடம்",
    yourProducts: "உங்கள் பொருட்கள்",
    logout: "வெளியேறு",
    withdrawProduct: "பொருளை திரும்பப் பெறு",
    feedback: "கருத்து",
    newMessage: "புதிய செய்தி",
    lightMode: "லைட் மோட்",
    darkMode: "டார்க் மோட்",
    farmingNews: "விவசாய செய்திகள்",
    newToDashboard: "இந்த டாஷ்போர்டுக்கு புதியவரா?",
    yes: "ஆம்",
    no: "இல்லை",
    next: "அடுத்து",
    finish: "முடி",
    guideConfirmed: "இங்கே உங்கள் உறுதிப்படுத்தப்பட்ட ஆர்டர்களைப் பார்க்கவும்。",
    guideCancelled: "இந்த பகுதியில் ரத்து செய்யப்பட்ட ஆர்டர்களைப் பார்க்கவும்。",
    guideDispatched: "இங்கே அனுப்பப்பட்ட ஆர்டர்களைக் கண்காணிக்கவும்。",
    guideTotalEarnings: "அனைத்து ஆர்டர்களிலிருந்து உங்கள் மொத்த வருவாயை சரிபார்க்கவும்。",
    guideCurrentOrders: "இங்கே உங்கள் தற்போதைய ஆர்டர்களைக் கண்காணிக்கவும்。",
    guidePreviousOrders: "உங்கள் முந்தைய முடிந்த ஆர்டர்களைப் பார்க்கவும்。",
    guideSellSurplus: "இங்கே உங்கள் உபரி பொருட்களை விற்பனைக்கு பட்டியலிடவும்。",
    guideCropRecommendation: "சந்தை போக்குகளின் அடிப்படையில் பயிர் பரிந்துரைகளைப் பெறவும்。",
    guideFarmingNews: "சமீபத்திய விவசாய செய்திகளுடன் புதுப்பித்த நிலையில் இருக்கவும்。",
    guideOrdersGraph: "இந்த வரைபடத்துடன் உங்கள் ஆர்டர் போக்குகளை பகுப்பாய்வு செய்யவும்。",
    guideYourProducts: "இங்கே உங்கள் பட்டியலிடப்பட்ட அனைத்து பொருட்களையும் பார்க்கவும்。",
    guideWeather: "உங்கள் பகுதிக்கான நிகழ்நேர வானிலை புதுப்பிப்புகளை சரிபார்க்கவும்。",
    guideNewMessage: "செய்திகளை அனுப்பவும் அல்லது பார்க்கவும் மற்றும் அறிவிப்புகளைப் பார்க்கவும்。",
    guideFeedback: "பிளாட்ஃபார்ம் பற்றிய உங்கள் கருத்தை சமர்ப்பிக்கவும்。",
    guideWithdrawProduct: "இங்கே உங்கள் பட்டியல்களிலிருந்து பொருட்களை அகற்றவும்。",
    guideAddProduct: "இந்த பகுதியில் புதிய பொருட்களை விற்க சேர்க்கவும்。",
  },
  "hi-IN": {
    helloFarmer: "नमस्ते, किसान!",
    settings: "सेटिंग्स",
    help: "सहायता",
    weather: "मौसम",
    confirmed: "पुष्टि की गई",
    dispatched: "भेजा गया",
    cancelled: "रद्द कर दिया गया",
    previousOrders: "पिछले ऑर्डर",
    currentOrders: "वर्तमान ऑर्डर",
    totalEarnings: "कुल आय",
    marketPrices: "बाजार मूल्य",
    sellSurplus: "अधिक उत्पाद बेचें",
    addProduct: "उत्पाद जोड़ें",
    cropRecommendation: "फसल सिफारिश",
    ordersGraph: "ऑर्डर ग्राफ",
    yourProducts: "आपके उत्पाद",
    logout: "लॉगआउट",
    withdrawProduct: "उत्पाद वापस लें",
    feedback: "प्रतिक्रिया",
    newMessage: "नया संदेश",
    lightMode: "लाइट मोड",
    darkMode: "डार्क मोड",
    farmingNews: "कृषि समाचार",
    newToDashboard: "क्या आप इस डैशबोर्ड में नए हैं?",
    yes: "हाँ",
    no: "नहीं",
    next: "अगला",
    finish: "समाप्त",
    guideConfirmed: "यहाँ अपने पुष्टि किए गए ऑर्डर देखें।",
    guideCancelled: "इस खंड में रद्द किए गए ऑर्डर देखें।",
    guideDispatched: "यहाँ भेजे गए ऑर्डर ट्रैक करें।",
    guideTotalEarnings: "सभी ऑर्डर से अपनी कुल आय जांचें।",
    guideCurrentOrders: "यहाँ अपने चल रहे ऑर्डर की निगरानी करें।",
    guidePreviousOrders: "अपने पिछले पूर्ण किए गए ऑर्डर देखें।",
    guideSellSurplus: "यहाँ अपने अतिरिक्त उत्पाद को बिक्री के लिए सूचीबद्ध करें।",
    guideCropRecommendation: "बाजार के रुझानों के आधार पर फसल सुझाव प्राप्त करें।",
    guideFarmingNews: "नवीनतम कृषि समाचारों के साथ अपडेट रहें।",
    guideOrdersGraph: "इस ग्राफ के साथ अपने ऑर्डर रुझानों का विश्लेषण करें।",
    guideYourProducts: "यहाँ अपने सभी सूचीबद्ध उत्पाद देखें।",
    guideWeather: "अपने क्षेत्र के लिए वास्तविक समय मौसम अपडेट जांचें।",
    guideNewMessage: "संदेश भेजें या देखें और सूचनाएँ देखें।",
    guideFeedback: "प्लेटफॉर्म के बारे में अपनी प्रतिक्रिया सबमिट करें।",
    guideWithdrawProduct: "यहाँ अपनी लिस्टिंग से उत्पाद हटाएँ।",
    guideAddProduct: "इस खंड में बिक्री के लिए नए उत्पाद जोड़ें।",
  },
  "en-US": {
    helloFarmer: "Hello, Farmer!",
    settings: "Settings",
    help: "Help",
    weather: "Weather",
    confirmed: "Confirmed",
    dispatched: "Dispatched",
    cancelled: "Canceled",
    previousOrders: "Previous Orders",
    currentOrders: "Current Orders",
    totalEarnings: "Total Earnings",
    marketPrices: "Market Prices",
    sellSurplus: "Sell Surplus Product",
    addProduct: "Add Product",
    cropRecommendation: "Crop Recommendation",
    ordersGraph: "Orders Graph",
    yourProducts: "Your Products",
    logout: "Logout",
    withdrawProduct: "Withdraw Product",
    feedback: "Feedback",
    newMessage: "New Message",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    farmingNews: "Farming News",
    newToDashboard: "New to this dashboard?",
    yes: "Yes",
    no: "No",
    next: "Next",
    finish: "Finish",
    guideConfirmed: "View your confirmed orders here.",
    guideCancelled: "See canceled orders in this section.",
    guideDispatched: "Track dispatched orders here.",
    guideTotalEarnings: "Check your total earnings from all orders.",
    guideCurrentOrders: "Monitor your ongoing orders here.",
    guidePreviousOrders: "View your past completed orders.",
    guideSellSurplus: "List your excess produce for sale here.",
    guideCropRecommendation: "Get crop suggestions based on market trends.",
    guideFarmingNews: "Stay updated with the latest farming news.",
    guideOrdersGraph: "Analyze your order trends with this graph.",
    guideYourProducts: "See all your listed products here.",
    guideWeather: "Check real-time weather updates for your area.",
    guideNewMessage: "Send or view messages and notifications.",
    guideFeedback: "Submit your feedback about the platform.",
    guideWithdrawProduct: "Remove products from your listings here.",
    guideAddProduct: "Add new products to sell in this section.",
  },
};

const audioFiles = {
  "en-IN": "/Audio/English India.mp3",
  "ta-IN": "/Audio/Tamil India.mp3",
  "hi-IN": "/Audio/Hindhi India.mp3",
  "en-US": "/Audio/English USA.mp3",
};
const getGuideSteps = (language) => {
  const durations = { "en-US": 46, "en-IN": 52, "hi-IN": 51, "ta-IN": 56 };
  const totalDuration = durations[language];
  const stepCount = 16;
  const stepDuration = totalDuration / stepCount;

  return [
    { id: "confirmed", target: ".confirmed", start: 0, end: stepDuration, textKey: "guideConfirmed" },
    { id: "cancelled", target: ".cancelled", start: stepDuration * 1, end: stepDuration * 2, textKey: "guideCancelled" },
    { id: "dispatched", target: ".dispatched", start: stepDuration * 2, end: stepDuration * 3, textKey: "guideDispatched" },
    { id: "totalEarnings", target: ".total-earnings", start: stepDuration * 3, end: stepDuration * 4, textKey: "guideTotalEarnings" },
    { id: "currentOrders", target: ".current-orders", start: stepDuration * 4, end: stepDuration * 5, textKey: "guideCurrentOrders" },
    { id: "previousOrders", target: ".previous-orders", start: stepDuration * 5, end: stepDuration * 6, textKey: "guidePreviousOrders" },
    { id: "sellSurplus", target: ".sell-surplus", start: stepDuration * 6, end: stepDuration * 7, textKey: "guideSellSurplus" },
    { id: "cropRecommendation", target: ".crop-recommendation", start: stepDuration * 7, end: stepDuration * 8, textKey: "guideCropRecommendation" },
    { id: "farmingNews", target: ".farming-news", start: stepDuration * 8, end: stepDuration * 9, textKey: "guideFarmingNews" },
    { id: "ordersGraph", target: ".orders-graph", start: stepDuration * 9, end: stepDuration * 10, textKey: "guideOrdersGraph" },
    { id: "yourProducts", target: ".your-products", start: stepDuration * 10, end: stepDuration * 11, textKey: "guideYourProducts" },
    { id: "weather", target: ".weather", start: stepDuration * 11, end: stepDuration * 12, textKey: "guideWeather" },
    { id: "newMessage", target: ".new-message", start: stepDuration * 12, end: stepDuration * 13, textKey: "guideNewMessage" },
    { id: "feedback", target: ".feedback", start: stepDuration * 13, end: stepDuration * 14, textKey: "guideFeedback" },
    { id: "withdrawProduct", target: ".withdraw-product", start: stepDuration * 14, end: stepDuration * 15, textKey: "guideWithdrawProduct" },
    { id: "addProduct", target: ".add-product", start: stepDuration * 15, end: totalDuration, textKey: "guideAddProduct" },
  ];
};


const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [farmerName, setFarmerName] = useState("");
  const [farmerId, setFarmerId] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [language, setLanguage] = useState("en-IN");
  const [earnings, setEarnings] = useState(0);
  const [showGuide, setShowGuide] = useState(false);
  const [guideStep, setGuideStep] = useState(0);
  const [userPhoto, setUserPhoto] = useState(null);
  const audioRef = useRef(null);

  const navigate = useNavigate();
  const db = getDatabase();
  const guideSteps = getGuideSteps(language);

  const generateOrdersGraphData = (orders) => {
    const monthlyData = Array(12).fill(0);
    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const month = orderDate.getMonth();
      if (order.status === "Completed") {
        monthlyData[month] += order.totalAmount;
      }
    });
    return {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [{
        label: translations[language].ordersGraph,
        data: monthlyData,
        backgroundColor: "rgba(34, 197, 94, 0.6)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
      }],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { color: darkMode ? "#e5e7eb" : "#000000", font: { size: 10 } } },
      title: { display: true, text: translations[language].ordersGraph, color: darkMode ? "#e5e7eb" : "#000000", font: { size: 14 } },
    },
    scales: {
      x: { ticks: { color: darkMode ? "#e5e7eb" : "#000000", font: { size: 8 } } },
      y: { ticks: { color: darkMode ? "#e5e7eb" : "#000000", font: { size: 8 } } },
    },
  };

  useEffect(() => {
    console.log("useEffect triggered");
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        console.log("No user logged in, redirecting to login");
        setError("Please log in.");
        setLoading(false);
        navigate("/login");
        return;
      }

      console.log("User logged in:", user.uid);
      setFarmerId(user.uid);
      setUserPhoto(user.photoURL || null);
      setLoading(true);

      try {
        // Fetch farmer details
        const userRef = ref(db, `users/${user.uid}`);
        const userSnapshot = await get(userRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.val();
          setFarmerName(userData.name || user.displayName || "Farmer");
          console.log("Farmer name set:", userData.name || user.displayName);
        } else {
          console.log("No user data found, using default name");
          setFarmerName(user.displayName || "Farmer");
        }

        // Fetch products
        const productsRef = ref(db, `products/${user.uid}`);
        onValue(productsRef, (snapshot) => {
          const productsData = snapshot.val();
          console.log("Products data:", productsData);
          const farmerProducts = productsData 
            ? Object.entries(productsData).map(([id, product]) => ({
                id,
                name: product.name,
                price: product.price,
                originalQuantity: product.quantity,
                image: product.image || "https://via.placeholder.com/150",
              }))
            : [];
          setProducts(farmerProducts);
        }, (error) => {
          console.error("Error fetching products:", error);
          setError("Failed to fetch products.");
        });

        // Fetch orders
        const ordersRef = ref(db, "customerOrders");
        onValue(ordersRef, (snapshot) => {
          const ordersData = snapshot.val();
          console.log("Orders data:", ordersData);
          if (ordersData) {
            const farmerOrders = [];
            const productQuantities = {};

            Object.values(ordersData).forEach(customerOrders => {
              Object.entries(customerOrders).forEach(([orderId, order]) => {
                const farmerProducts = order.products?.filter(
                  product => product.farmerId === user.uid
                ) || [];
                
                if (farmerProducts.length > 0) {
                  const orderTotalForFarmer = farmerProducts.reduce(
                    (sum, product) => sum + (product.price * product.quantity), 
                    0
                  );
                  
                  farmerOrders.push({
                    id: orderId,
                    status: order.status,
                    totalAmount: orderTotalForFarmer,
                    createdAt: order.createdAt || Date.now(),
                    products: farmerProducts,
                  });

                  farmerProducts.forEach(product => {
                    productQuantities[product.productId] = 
                      (productQuantities[product.productId] || 0) + product.quantity;
                  });
                }
              });
            });

            console.log("Farmer orders:", farmerOrders);
            setOrders(farmerOrders);

            const updatedProducts = products.map(product => ({
              ...product,
              stock: product.originalQuantity - (productQuantities[product.id] || 0)
            }));
            setProducts(updatedProducts);

            const totalEarnings = farmerOrders
              .filter(order => order.status === "Completed")
              .reduce((sum, order) => sum + order.totalAmount, 0);
            setEarnings(totalEarnings);
            console.log("Total earnings:", totalEarnings);
          } else {
            console.log("No orders data found");
            setOrders([]);
          }
        }, (error) => {
          console.error("Error fetching orders:", error);
          setError("Failed to fetch orders.");
        });

        // Fetch weather
        const fetchWeather = async (lat, lon) => {
          try {
            const apiKey = "ccd8b058961d7fefa87f1c29421d8bdf";
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Weather API error: ${response.status}`);
            const data = await response.json();
            setWeather({
              main: { temp: data.main.temp, humidity: data.main.humidity },
              weather: [{ description: data.weather[0].description, icon: data.weather[0].icon }],
              name: data.name,
              country: data.sys.country,
              dt: data.dt,
            });
            console.log("Weather data:", data);
          } catch (weatherError) {
            console.error("Weather fetch error:", weatherError);
            setWeather({
              error: "Unable to fetch weather data",
              main: { temp: 25, humidity: 50 },
              weather: [{ description: "unknown" }],
              name: "Unknown Location",
              country: "N/A",
            });
          }
        };

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => fetchWeather(position.coords.latitude, position.coords.longitude),
            (geoError) => {
              console.error("Geolocation error:", geoError);
              setWeather({
                error: "Location access denied",
                main: { temp: 25, humidity: 50 },
                weather: [{ description: "unknown" }],
                name: "Unknown Location",
                country: "N/A",
              });
            }
          );
        } else {
          console.log("Geolocation not supported");
          setWeather({
            error: "Geolocation not supported",
            main: { temp: 25, humidity: 50 },
            weather: [{ description: "unknown" }],
            name: "Unknown Location",
            country: "N/A",
          });
        }
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Failed to load dashboard data: " + err.message);
      } finally {
        setLoading(false);
        console.log("Loading complete");
      }
    });

    return () => {
      console.log("Unsubscribing from auth state changes");
      unsubscribe();
    };
  }, [navigate, db]);

  const getWeatherEmoji = (description) => {
    const weatherMap = {
      "clear sky": "☀️",
      "few clouds": "⛅",
      "scattered clouds": "🌥️",
      "broken clouds": "🌦️",
      "shower rain": "🌧️",
      "rain": "🌧️",
      "thunderstorm": "⛈️",
      "snow": "❄️",
      "mist": "🌫️",
      "overcast clouds": "☁️",
    };
    return weatherMap[description?.toLowerCase()] || "🌤️";
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.clear();
      navigate("/login");
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      setError("Failed to log out: " + error.message);
    }
  };

  const pageVariants = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };
  const glossyHover = { scale: 1.02, boxShadow: darkMode ? "0 0 10px rgba(255, 255, 255, 0.2)" : "0 0 10px rgba(0, 0, 0, 0.1)", transition: { duration: 0.2 } };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;

  return (
    <motion.div
      className={`min-h-screen p-6 font-sans ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-800"}`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
          <motion.div className="flex items-center gap-6">
            <img 
              src={userPhoto || "https://via.placeholder.com/80"} 
              alt="Farmer Profile" 
              className="w-20 h-20 rounded-full object-cover border-2 border-green-500"
              onError={(e) => e.target.src = "https://via.placeholder.com/80"}
            />
            <div>
              <h2 className="text-3xl font-bold text-green-600">
                {translations[language].helloFarmer.replace("Farmer", farmerName)}
              </h2>
              <motion.button
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
                onClick={() => setShowSettings(!showSettings)}
                whileHover={{ scale: 1.05 }}
              >
                {translations[language].settings}
              </motion.button>
              {showSettings && (
                <motion.div
                  className={`absolute mt-2 w-56 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl shadow-lg border p-4 z-10`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    onClick={() => setDarkMode(!darkMode)}
                  >
                    {darkMode ? translations[language].lightMode : translations[language].darkMode}
                  </button>
                  <select
                    className="w-full text-left px-3 py-2 text-sm bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="en-IN">English (India)</option>
                    <option value="ta-IN">தமிழ் (Tamil)</option>
                    <option value="hi-IN">हिन्दी (Hindi)</option>
                    <option value="en-US">English (US)</option>
                  </select>
                  <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" onClick={handleLogout}>
                    {translations[language].logout}
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Order Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full md:w-auto">
            {["confirmed", "dispatched", "cancelled"].map((status) => (
              <motion.div
                key={status}
                className={`p-6 rounded-xl shadow-lg border ${darkMode ? "bg-gray-800" : "bg-white"} ${status}`}
                whileHover={glossyHover}
              >
                <h3 className={`font-semibold text-xl ${status === "confirmed" ? "text-green-600" : status === "dispatched" ? "text-yellow-600" : "text-red-600"}`}>
                  {translations[language][status]}
                </h3>
                {orders.filter(o => o.status.toLowerCase() === status).length === 0 ? (
                  <p className="mt-3 text-base text-gray-500">No {status} orders</p>
                ) : (
                  orders.filter(o => o.status.toLowerCase() === status).slice(0, 2).map((order, idx) => (
                    <p key={idx} className="mt-3 text-base text-gray-600">
                      Order #{order.id} - ₹{order.totalAmount.toFixed(2)}
                    </p>
                  ))
                )}
              </motion.div>
            ))}
          </div>

          {/* Weather Card */}
          <motion.div
            className={`p-6 rounded-xl shadow-lg border ${darkMode ? "bg-gray-800" : "bg-white"} w-full md:w-80 weather`}
            whileHover={glossyHover}
          >
            <h3 className="font-semibold text-xl text-blue-600">{translations[language].weather}</h3>
            {weather && (
              <div className="mt-4 text-center">
                <span className="text-5xl">{getWeatherEmoji(weather.weather[0].description)}</span>
                <p className="text-base font-medium mt-2 capitalize">{weather.weather[0].description}</p>
                <p className="text-3xl font-bold text-blue-600">{weather.main.temp}°C</p>
                <p className="text-base mt-2">Humidity: {weather.main.humidity}%</p>
                <p className="text-base">{weather.name}, {weather.country}</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <motion.div className={`p-6 rounded-xl shadow-lg border ${darkMode ? "bg-gray-800" : "bg-white"} total-earnings`} whileHover={glossyHover}>
              <h3 className="font-semibold text-xl text-green-600">{translations[language].totalEarnings}</h3>
              <p className="mt-4 text-4xl font-bold">₹{earnings.toFixed(2)}</p>
            </motion.div>

            <motion.div className={`p-6 rounded-xl shadow-lg border ${darkMode ? "bg-gray-800" : "bg-white"} current-orders`} whileHover={glossyHover}>
              <h3 className="font-semibold text-xl text-green-600">{translations[language].currentOrders}</h3>
              {orders.filter(o => o.status === "Successful").length === 0 ? (
                <p className="mt-3 text-base text-gray-500">No current orders</p>
              ) : (
                orders.filter(o => o.status === "Successful").slice(0, 2).map((order, idx) => (
                  <p key={idx} className="mt-3 text-base text-gray-600">
                    Order #{order.id} - ₹{order.totalAmount.toFixed(2)} ({order.status})
                  </p>
                ))
              )}
            </motion.div>

            <motion.div className={`p-6 rounded-xl shadow-lg border ${darkMode ? "bg-gray-800" : "bg-white"} previous-orders`} whileHover={glossyHover}>
              <h3 className="font-semibold text-xl text-yellow-600">{translations[language].previousOrders}</h3>
              {orders.filter(o => o.status === "Completed").length === 0 ? (
                <p className="mt-3 text-base text-gray-500">No previous orders</p>
              ) : (
                orders.filter(o => o.status === "Completed").slice(0, 2).map((order, idx) => (
                  <p key={idx} className="mt-3 text-base text-gray-600">
                    Order #{order.id} - ₹{order.totalAmount.toFixed(2)}
                  </p>
                ))
              )}
            </motion.div>
          </div>

          {/* Second Column */}
          <div className="space-y-6">
            <motion.div className={`p-6 rounded-xl shadow-lg border ${darkMode ? "bg-gray-800" : "bg-white"} sell-surplus`} whileHover={glossyHover}>
              <h3 className="font-semibold text-xl text-blue-600">{translations[language].sellSurplus}</h3>
              <motion.button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium"
                whileHover={{ scale: 1.05 }}
              >
                {translations[language].sellSurplus}
              </motion.button>
            </motion.div>

            <motion.div className={`p-6 rounded-xl shadow-lg border ${darkMode ? "bg-gray-800" : "bg-white"} crop-recommendation`} whileHover={glossyHover}>
              <h3 className="font-semibold text-xl text-orange-600">{translations[language].cropRecommendation}</h3>
              <p className="mt-4 text-base text-gray-600">Recommended Crop: Onions</p>
            </motion.div>

            <motion.div className={`p-6 rounded-xl shadow-lg border ${darkMode ? "bg-gray-800" : "bg-white"} farming-news`} whileHover={glossyHover}>
              <h3 className="font-semibold text-xl text-green-600">{translations[language].farmingNews}</h3>
              <p className="mt-4 text-base text-gray-600">Latest updates on farming techniques...</p>
            </motion.div>
          </div>

          {/* Third Column */}
          <div className="space-y-6">
            <motion.div className={`p-6 rounded-xl shadow-lg border ${darkMode ? "bg-gray-800" : "bg-white"} h-96 orders-graph`} whileHover={glossyHover}>
              <h3 className="font-semibold text-xl text-red-600">{translations[language].ordersGraph}</h3>
              <div className="mt-4 h-72">
                <Bar data={generateOrdersGraphData(orders)} options={chartOptions} />
              </div>
            </motion.div>

            <motion.div className={`p-6 rounded-xl shadow-lg border ${darkMode ? "bg-gray-800" : "bg-white"} your-products`} whileHover={glossyHover}>
              <h3 className="font-semibold text-xl text-teal-600">{translations[language].yourProducts}</h3>
              {products.length === 0 ? (
                <p className="mt-4 text-base text-gray-500">
                  No products available. <Link to="/addproducts" className="text-teal-600">{translations[language].addProduct}</Link>
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {products.map((product) => (
                    <motion.div key={product.id} whileHover={{ scale: 1.05 }} className="p-3 rounded-lg bg-teal-50">
                      <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-lg mx-auto" />
                      <p className="text-base font-medium mt-2">{product.name}</p>
                      <p className="text-sm text-gray-600">₹{product.price}/kg</p>
                      <p className="text-sm text-gray-500">{product.stock} kg available</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <motion.button
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-base font-medium new-message"
              onClick={() => alert(translations[language].newMessage)}
              whileHover={{ scale: 1.05 }}
            >
              {translations[language].newMessage}
            </motion.button>
            <motion.button
              className="w-full py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-base font-medium feedback"
              onClick={() => alert(translations[language].feedback)}
              whileHover={{ scale: 1.05 }}
            >
              {translations[language].feedback}
            </motion.button>
            <motion.button
              className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-base font-medium withdraw-product"
              onClick={() => alert(translations[language].withdrawProduct)}
              whileHover={{ scale: 1.05 }}
            >
              {translations[language].withdrawProduct}
            </motion.button>
            <Link to="/addproducts" className="w-full block">
              <motion.button
                className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 text-base font-medium add-product"
                whileHover={{ scale: 1.05 }}
              >
                {translations[language].addProduct}
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Guide Popup */}
        {!showGuide && (
          <motion.div className={`fixed bottom-6 right-6 p-4 ${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-lg border`}>
            <p className="text-base font-medium">{translations[language].newToDashboard}</p>
            <div className="flex space-x-3 mt-3">
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600" onClick={() => setShowGuide(true)}>
                {translations[language].yes}
              </button>
              <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600" onClick={() => setShowGuide(false)}>
                {translations[language].no}
              </button>
            </div>
          </motion.div>
        )}

        {showGuide && (
          <motion.div className="fixed inset-0 z-20 pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="relative pointer-events-auto">
              <motion.div
                className={`absolute p-4 ${darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"} rounded-xl shadow-lg border z-40`}
                style={{ top: (document.querySelector(guideSteps[guideStep].target)?.getBoundingClientRect().top || 0) - 140 + window.scrollY, left: "50%", transform: "translateX(-50%)", width: "320px" }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <p className="text-base mb-3">{translations[language][guideSteps[guideStep].textKey]}</p>
                <div className="flex space-x-3">
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium"
                    onClick={() => guideStep < guideSteps.length - 1 ? setGuideStep((prev) => prev + 1) : setShowGuide(false)}
                  >
                    {guideStep < guideSteps.length - 1 ? translations[language].next : translations[language].finish}
                  </button>
                  {guideStep > 0 && (
                    <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm font-medium" onClick={() => setGuideStep((prev) => prev - 1)}>
                      Back
                    </button>
                  )}
                  <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium" onClick={() => setShowGuide(false)}>
                    Close
                  </button>
                </div>
              </motion.div>
              <motion.div
                className="absolute border-4 border-green-500 rounded-lg shadow-lg pointer-events-none z-20"
                style={{
                  top: (document.querySelector(guideSteps[guideStep].target)?.getBoundingClientRect().top || 0) - 8 + window.scrollY,
                  left: (document.querySelector(guideSteps[guideStep].target)?.getBoundingClientRect().left || 0) - 8,
                  width: (document.querySelector(guideSteps[guideStep].target)?.offsetWidth || 0) + 16,
                  height: (document.querySelector(guideSteps[guideStep].target)?.offsetHeight || 0) + 16,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;