import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase.js";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// Define translations object
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
    viewMarketTrends: "View Market Trends",
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
    send: "Send",
    cancel: "Cancel",
    messagePlaceholder: "Type your message here...",
    feedbackPlaceholder: "Type your feedback here...",
    guideConfirmed: "View your confirmed orders here.",
    guideCancelled: "See cancelled orders in this section.",
    guideDispatched: "Track dispatched orders here.",
    guideTotalEarnings: "Check your total earnings from all orders.",
    guideCurrentOrders: "Monitor your ongoing orders here.",
    guidePreviousOrders: "View your past completed orders.",
    guideSellSurplus: "View market trends here.",
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
    viewMarketTrends: "சந்தை போக்குகளைப் பார்",
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
    send: "அனுப்பு",
    cancel: "ரத்து",
    messagePlaceholder: "உங்கள் செய்தியை இங்கே தட்டச்சு செய்யவும்...",
    feedbackPlaceholder: "உங்கள் கருத்தை இங்கே தட்டச்சு செய்யவும்...",
    guideConfirmed: "இங்கே உங்கள் உறுதிப்படுத்தப்பட்ட ஆர்டர்களைப் பார்க்கவும்。",
    guideCancelled: "இந்த பகுதியில் ரத்து செய்யப்பட்ட ஆர்டர்களைப் பார்க்கவும்。",
    guideDispatched: "இங்கே அனுப்பப்பட்ட ஆர்டர்களைக் கண்காணிக்கவும்。",
    guideTotalEarnings: "அனைத்து ஆர்டர்களிலிருந்து உங்கள் மொத்த வருவாயை சரிபார்க்கவும்。",
    guideCurrentOrders: "இங்கே உங்கள் தற்போதைய ஆர்டர்களைக் கண்காணிக்கவும்。",
    guidePreviousOrders: "உங்கள் முந்தைய முடிந்த ஆர்டர்களைப் பார்க்கவும்。",
    guideSellSurplus: "இங்கே சந்தை போக்குகளைப் பார்க்கவும்。",
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
    viewMarketTrends: "बाजार रुझान देखें",
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
    send: "भेजें",
    cancel: "रद्द करें",
    messagePlaceholder: "अपना संदेश यहाँ टाइप करें...",
    feedbackPlaceholder: "अपनी प्रतिक्रिया यहाँ टाइप करें...",
    guideConfirmed: "यहाँ अपने पुष्टि किए गए ऑर्डर देखें।",
    guideCancelled: "इस खंड में रद्द किए गए ऑर्डर देखें।",
    guideDispatched: "यहाँ भेजे गए ऑर्डर ट्रैक करें।",
    guideTotalEarnings: "सभी ऑर्डर से अपनी कुल आय जांचें।",
    guideCurrentOrders: "यहाँ अपने चल रहे ऑर्डर की निगरानी करें।",
    guidePreviousOrders: "अपने पिछले पूर्ण किए गए ऑर्डर देखें।",
    guideSellSurplus: "यहाँ बाजार रुझान देखें।",
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
    viewMarketTrends: "View Market Trends",
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
    send: "Send",
    cancel: "Cancel",
    messagePlaceholder: "Type your message here...",
    feedbackPlaceholder: "Type your feedback here...",
    guideConfirmed: "View your confirmed orders here.",
    guideCancelled: "See canceled orders in this section.",
    guideDispatched: "Track dispatched orders here.",
    guideTotalEarnings: "Check your total earnings from all orders.",
    guideCurrentOrders: "Monitor your ongoing orders here.",
    guidePreviousOrders: "View your past completed orders.",
    guideSellSurplus: "View market trends here.",
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
  const totalDuration = durations[language] || 52; // Default to 52 if language not found
  const stepCount = 16;
  const stepDuration = totalDuration / stepCount;

  return [
    { id: "confirmed", target: ".confirmed", start: 0, end: stepDuration, textKey: "guideConfirmed" },
    { id: "cancelled", target: ".cancelled", start: stepDuration * 1, end: stepDuration * 2, textKey: "guideCancelled" },
    { id: "dispatched", target: ".dispatched", start: stepDuration * 2, end: stepDuration * 3, textKey: "guideDispatched" },
    { id: "totalEarnings", target: ".total-earnings", start: stepDuration * 3, end: stepDuration * 4, textKey: "guideTotalEarnings" },
    { id: "currentOrders", target: ".current-orders", start: stepDuration * 4, end: stepDuration * 5, textKey: "guideCurrentOrders" },
    { id: "previousOrders", target: ".previous-orders", start: stepDuration * 5, end: stepDuration * 6, textKey: "guidePreviousOrders" },
    { id: "viewMarketTrends", target: ".view-market-trends", start: stepDuration * 6, end: stepDuration * 7, textKey: "guideSellSurplus" },
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

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center text-red-600">
          <h1>Something went wrong.</h1>
          <p>{this.state.error?.message || "Unknown error"}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [farmerName, setFarmerName] = useState("");
  const [farmerId, setFarmerId] = useState("");
  const [profilePic, setProfilePic] = useState("https://via.placeholder.com/150");
  const [showSettings, setShowSettings] = useState(false);
  const [language, setLanguage] = useState("en-IN");
  const [earnings, setEarnings] = useState(0);
  const [showGuide, setShowGuide] = useState(false);
  const [guideStep, setGuideStep] = useState(0);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const audioRef = useRef(null);

  const navigate = useNavigate();
  const db = getDatabase();
  const guideSteps = getGuideSteps(language);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        setError("Please log in.");
        setLoading(false);
        navigate("/login");
        return;
      }

      setLoading(true);
      setError(null);
      setFarmerId(user.uid);

      const userRef = ref(db, `users/${user.uid}`);
      onValue(
        userRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setFarmerName(userData.name || user.displayName || "Farmer");
            setProfilePic(userData.photoURL || user.photoURL || "https://via.placeholder.com/150");
          } else {
            setFarmerName(user.displayName || "Farmer");
            setProfilePic(user.photoURL || "https://via.placeholder.com/150");
          }
        },
        (err) => {
          console.error("User fetch error:", err);
          setError("Failed to fetch user data.");
        }
      );

      const productsRef = ref(db, "products");
      onValue(
        productsRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const productsData = snapshot.val();
            const farmerProducts = Object.entries(productsData)
              .filter(([_, product]) => product.farmerId === `farmer_${user.uid}`)
              .map(([id, product]) => ({
                id,
                name: product.name,
                price: product.price,
                stock: product.quantity,
                image: product.image || "https://via.placeholder.com/150",
              }));
            setProducts(farmerProducts);
          } else {
            setProducts([]);
          }
        },
        (err) => {
          console.error("Products fetch error:", err);
          setError("Failed to fetch products.");
        }
      );

      const ordersRef = ref(db, "orders");
      onValue(
        ordersRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const ordersData = snapshot.val();
            const farmerOrders = Object.entries(ordersData)
              .filter(([_, order]) => order.products.some((p) => p.farmerId === `farmer_${user.uid}`))
              .map(([id, order]) => {
                const farmerProducts = order.products.filter((p) => p.farmerId === `farmer_${user.uid}`);
                const farmerTotal = farmerProducts.reduce((sum, p) => sum + p.totalPrice, 0);
                return {
                  id: order.orderId || id,
                  status: order.status,
                  totalAmount: farmerTotal,
                  date: order.orderDateTime,
                  products: farmerProducts,
                  customerName: order.customerName,
                };
              });
            console.log("Fetched farmer orders:", farmerOrders);
            setOrders(farmerOrders);

            const totalEarnings = farmerOrders
              .filter((order) => order.status === "Completed")
              .reduce((sum, order) => sum + order.totalAmount, 0);
            setEarnings(totalEarnings);
          } else {
            setOrders([]);
            setEarnings(0);
          }
          setLoading(false);
        },
        (err) => {
          console.error("Orders fetch error:", err);
          setError("Failed to fetch orders.");
          setLoading(false);
        }
      );

      const fetchWeather = async (lat, lon) => {
        const apiKey = "ccd8b058961d7fefa87f1c29421d8bdf";
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const response = await fetch(url);
        const data = await response.json();
        setWeather({
          main: { temp: data.main.temp, humidity: data.main.humidity },
          weather: [{ description: data.weather[0].description }],
          name: data.name,
          country: data.sys.country,
        });
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => fetchWeather(position.coords.latitude, position.coords.longitude),
          (err) => {
            console.error("Geolocation error:", err);
            setWeather({
              main: { temp: 34.81, humidity: 24 },
              weather: [{ description: "broken clouds" }],
              name: "Sulur",
              country: "IN",
            });
          }
        );
      }
    });

    return () => unsubscribe();
  }, [navigate, db]);

  const ordersByMonth = orders.reduce((acc, order) => {
    if (order.status === "Completed" && order.date) {
      const month = new Date(order.date).toLocaleString("default", { month: "short" });
      acc[month] = (acc[month] || 0) + order.totalAmount;
    }
    return acc;
  }, {});

  const ordersData = {
    labels: Object.keys(ordersByMonth).length ? Object.keys(ordersByMonth) : ["No Data"],
    datasets: [
      {
        label: translations[language]?.ordersGraph || "Orders Graph", // Fallback
        data: Object.keys(ordersByMonth).length ? Object.values(ordersByMonth) : [0],
        backgroundColor: "rgba(34, 197, 94, 0.6)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { color: darkMode ? "#e5e7eb" : "#000000", font: { size: 10 } } },
      title: {
        display: true,
        text: translations[language]?.ordersGraph || "Orders Graph", // Fallback
        color: darkMode ? "#e5e7eb" : "#000000",
        font: { size: 14 },
      },
    },
    scales: {
      x: { ticks: { color: darkMode ? "#e5e7eb" : "#000000", font: { size: 8 } } },
      y: { ticks: { color: darkMode ? "#e5e7eb" : "#000000", font: { size: 8 } } },
    },
  };

  useEffect(() => {
    if (showGuide) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      const audio = new Audio(audioFiles[language]);
      audioRef.current = audio;
      audio.currentTime = guideSteps[guideStep].start;
      audio.play().catch((error) => console.error("Audio playback failed:", error));
      const duration = (guideSteps[guideStep].end - guideSteps[guideStep].start) * 1000;
      const timer = setTimeout(() => {
        if (guideStep < guideSteps.length - 1) {
          setGuideStep((prev) => prev + 1);
        } else {
          audio.pause();
          setShowGuide(false);
        }
      }, duration);
      return () => {
        clearTimeout(timer);
        if (audioRef.current) audioRef.current.pause();
      };
    }
  }, [showGuide, guideStep, language]);

  useEffect(() => {
    if (showGuide) {
      const targetElement = document.querySelector(guideSteps[guideStep].target);
      if (targetElement) targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [guideStep, showGuide]);

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
    };
    return weatherMap[description?.toLowerCase()] || "🌤️";
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userDetails");
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err.message);
      setError("Failed to log out.");
    }
  };

  const withdrawProduct = async (productId) => {
    try {
      const productRef = ref(db, `products/${productId}`);
      await remove(productRef);
      setProducts(products.filter((product) => product.id !== productId));
      setShowWithdrawModal(false);
      setSelectedProduct(null);
      alert("Product withdrawn successfully!");
    } catch (err) {
      console.error("Error withdrawing product:", err);
      setError("Failed to withdraw product.");
    }
  };

  const handleWithdrawClick = (product) => {
    setSelectedProduct(product);
    setShowWithdrawModal(true);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      alert(`Message sent: ${message}`);
      setMessage("");
      setShowMessageModal(false);
    }
  };

  const handleSubmitFeedback = () => {
    if (feedback.trim()) {
      alert(`Feedback submitted: ${feedback}`);
      setFeedback("");
      setShowFeedbackModal(false);
    }
  };

  const pageVariants = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };
  const glossyHover = { scale: 1.02, boxShadow: darkMode ? "0 0 10px rgba(255, 255, 255, 0.2)" : "0 0 10px rgba(0, 0, 0, 0.1)", transition: { duration: 0.2 } };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;

  return (
    <motion.div
      className={`min-h-screen p-6 font-sans ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-800"} ${showGuide ? "backdrop-blur-md" : ""}`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start mb-8 space-y-6 lg:space-y-0 lg:space-x-9">
        <motion.div className="flex items-center space-x-6">
          <img
            src={profilePic}
            alt="Farmer Profile"
            className="w-20 h-20 rounded-full bg-gray-200 object-cover"
            onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
          />
          <div>
            <h2 className="text-3xl font-bold text-green-600">{translations[language].helloFarmer.replace("Farmer", farmerName)}</h2>
            <motion.button
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
              onClick={() => setShowSettings(!showSettings)}
              whileHover={{ scale: 1.05 }}
            >
              {translations[language].settings}
            </motion.button>
            {showSettings && (
              <motion.div
                className={`absolute left-28 top-20 mt-2 w-56 ${darkMode ? "bg-gray-800 text-gray-200 border-gray-700" : "bg-white text-gray-800 border-gray-200"} rounded-xl shadow-lg border p-4 z-10`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
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
                  <option value="en-IN" className="text-gray-800">English (India)</option>
                  <option value="ta-IN" className="text-gray-800">தமிழ் (Tamil)</option>
                  <option value="hi-IN" className="text-gray-800">हिन्दी (Hindi)</option>
                  <option value="en-US" className="text-gray-800">English (US)</option>
                </select>
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  {translations[language].help}
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  onClick={handleLogout}
                >
                  {translations[language].logout}
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full lg:w-2/3">
          {["confirmed", "dispatched", "cancelled"].map((status) => (
            <motion.div
              key={status}
              className={`p-6 rounded-xl shadow-lg border ${status} ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
              whileHover={glossyHover}
            >
              <h3 className={`font-semibold text-xl ${status === "confirmed" ? "text-green-600" : status === "dispatched" ? "text-yellow-600" : "text-red-600"}`}>
                {translations[language][status]}
              </h3>
              {orders.filter((o) => o.status.toLowerCase() === status).slice(0, 2).map((order, idx) => (
                <p key={idx} className={`mt-3 text-base ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Order #{order.id.split("_")[2]} - ₹{order.totalAmount} (To: {order.customerName})
                </p>
              ))}
              {orders.filter((o) => o.status.toLowerCase() === status).length === 0 && (
                <p className={`mt-3 text-base ${darkMode ? "text-gray-300" : "text-gray-700"}`}>No {status} orders</p>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          className={`p-6 rounded-xl shadow-lg border weather ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} w-full lg:w-80`}
          whileHover={glossyHover}
        >
          <h3 className="font-semibold text-xl text-blue-600">{translations[language].weather}</h3>
          {weather ? (
            weather.error ? (
              <p className={`mt-4 text-base ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{weather.error}</p>
            ) : (
              <div className="mt-4 text-center">
                <span className="text-5xl">{getWeatherEmoji(weather.weather[0].description)}</span>
                <p className={`text-base font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mt-2 capitalize`}>{weather.weather[0].description}</p>
                <p className="text-3xl font-bold text-blue-600">{weather.main.temp}°C</p>
                <p className={`text-base ${darkMode ? "text-gray-300" : "text-gray-700"} mt-2`}>{weather.name}, {weather.country}</p>
              </div>
            )
          ) : (
            <p className={`mt-4 text-base ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Fetching weather...</p>
          )}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <motion.div className={`p-6 rounded-xl shadow-lg border total-earnings ${darkMode ? "bg-gray-800" : "bg-white"}`} whileHover={glossyHover}>
            <h3 className="font-semibold text-xl text-green-600">{translations[language].totalEarnings}</h3>
            <p className={`mt-4 text-4xl font-bold ${darkMode ? "text-gray-100" : "text-gray-800"}`}>₹{earnings.toFixed(2)}</p>
          </motion.div>

          <motion.div className={`p-6 rounded-xl shadow-lg border current-orders ${darkMode ? "bg-gray-800" : "bg-white"}`} whileHover={glossyHover}>
            <h3 className="font-semibold text-xl text-green-600">{translations[language].currentOrders}</h3>
            {orders.filter((o) => ["Pending", "Confirmed", "Processing", "Dispatched"].includes(o.status)).slice(0, 2).map((order, idx) => (
              <p key={idx} className={`mt-3 text-base ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Order #{order.id.split("_")[2]} - ₹{order.totalAmount} ({order.status})
              </p>
            ))}
            {orders.filter((o) => ["Pending", "Confirmed", "Processing", "Dispatched"].includes(o.status)).length === 0 && (
              <p className={`mt-3 text-base ${darkMode ? "text-gray-300" : "text-gray-700"}`}>No current orders</p>
            )}
          </motion.div>

          <motion.div className={`p-6 rounded-xl shadow-lg border previous-orders ${darkMode ? "bg-gray-800" : "bg-white"}`} whileHover={glossyHover}>
            <h3 className="font-semibold text-xl text-yellow-600">{translations[language].previousOrders}</h3>
            {orders.filter((o) => ["Completed", "Cancelled"].includes(o.status)).slice(0, 2).map((order, idx) => (
              <p key={idx} className={`mt-3 text-base ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Order #{order.id.split("_")[2]} - ₹{order.totalAmount} ({order.status})
              </p>
            ))}
            {orders.filter((o) => ["Completed", "Cancelled"].includes(o.status)).length === 0 && (
              <p className={`mt-3 text-base ${darkMode ? "text-gray-300" : "text-gray-700"}`}>No previous orders</p>
            )}
          </motion.div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <motion.div className={`p-6 rounded-xl shadow-lg border view-market-trends ${darkMode ? "bg-gray-800" : "bg-white"}`} whileHover={glossyHover}>
            <h3 className="font-semibold text-xl text-blue-600">{translations[language].viewMarketTrends}</h3>
            <Link to="/market-trends">
              <motion.button
                className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 text-sm font-medium"
                whileHover={{ scale: 1.05 }}
              >
                {translations[language].viewMarketTrends}
              </motion.button>
            </Link>
          </motion.div>

          <motion.div className={`p-6 rounded-xl shadow-lg border crop-recommendation ${darkMode ? "bg-gray-800" : "bg-white"}`} whileHover={glossyHover}>
            <h3 className="font-semibold text-xl text-orange-600">{translations[language].cropRecommendation}</h3>
            <p className={`mt-4 text-base ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Recommended Crop: Onions</p>
          </motion.div>

          <motion.div className={`p-6 rounded-xl shadow-lg border farming-news ${darkMode ? "bg-gray-800" : "bg-white"}`} whileHover={glossyHover}>
            <h3 className="font-semibold text-xl text-green-600">{translations[language].farmingNews}</h3>
            <p className={`mt-4 text-base ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Latest updates on farming techniques...</p>
          </motion.div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <motion.div className={`p-6 rounded-xl shadow-lg border orders-graph ${darkMode ? "bg-gray-800" : "bg-white"} h-96`} whileHover={glossyHover}>
            <h3 className="font-semibold text-xl text-red-600">{translations[language].ordersGraph}</h3>
            <div className="mt-4 h-72">
              <Bar data={ordersData} options={chartOptions} />
            </div>
          </motion.div>

          <motion.div className={`p-6 rounded-xl shadow-lg border your-products ${darkMode ? "bg-gray-800" : "bg-white"}`} whileHover={glossyHover}>
            <h3 className="font-semibold text-xl text-teal-600">{translations[language].yourProducts}</h3>
            {products.length === 0 ? (
              <p className="mt-4 text-base text-gray-500">
                No products available. <Link to="/addproducts" className="text-teal-600 font-medium">{translations[language].addProduct}</Link>
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {products.map((product) => (
                  <motion.div key={product.id} whileHover={{ scale: 1.05 }} className="p-3 rounded-lg bg-teal-50">
                    <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-lg mx-auto" />
                    <p className="text-base font-medium mt-2">{product.name}</p>
                    <p className="text-sm text-gray-600">₹{product.price}/kg</p>
                    <p className="text-sm text-gray-500">{product.stock} kg available</p>
                    <button
                      className="mt-2 px-3 py-1 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600"
                      onClick={() => handleWithdrawClick(product)}
                    >
                      {translations[language].withdrawProduct}
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        <div className="lg:col-span-3 space-y-6 flex flex-col items-center">
          <motion.button
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 text-base font-medium new-message"
            onClick={() => setShowMessageModal(true)}
            whileHover={{ scale: 1.05 }}
          >
            {translations[language].newMessage}
          </motion.button>
          <motion.button
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 text-base font-medium feedback"
            onClick={() => setShowFeedbackModal(true)}
            whileHover={{ scale: 1.05 }}
          >
            {translations[language].feedback}
          </motion.button>
          <Link to="/addproducts" className="w-full">
            <motion.button
              className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 text-base font-medium add-product"
              whileHover={{ scale: 1.05 }}
            >
              {translations[language].addProduct}
            </motion.button>
          </Link>
        </div>
      </div>

      {showWithdrawModal && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className={`${darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"} p-6 rounded-xl shadow-lg`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <h3 className="text-xl font-semibold mb-4">
              {translations[language].withdrawProduct}: {selectedProduct?.name}
            </h3>
            <p className="mb-4">Are you sure you want to withdraw this product?</p>
            <div className="flex space-x-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                onClick={() => withdrawProduct(selectedProduct.id)}
              >
                Yes
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                onClick={() => setShowWithdrawModal(false)}
              >
                No
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showMessageModal && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className={`${darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"} p-6 rounded-xl shadow-lg w-96`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <h3 className="text-xl font-semibold mb-4">{translations[language].newMessage}</h3>
            <textarea
              className={`w-full p-2 border rounded-lg ${darkMode ? "bg-gray-700 text-gray-200 border-gray-600" : "bg-white text-gray-800 border-gray-300"}`}
              rows="4"
              placeholder={translations[language].messagePlaceholder}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex space-x-4 mt-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={handleSendMessage}
              >
                {translations[language].send}
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                onClick={() => setShowMessageModal(false)}
              >
                {translations[language].cancel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showFeedbackModal && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className={`${darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"} p-6 rounded-xl shadow-lg w-96`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <h3 className="text-xl font-semibold mb-4">{translations[language].feedback}</h3>
            <textarea
              className={`w-full p-2 border rounded-lg ${darkMode ? "bg-gray-700 text-gray-200 border-gray-600" : "bg-white text-gray-800 border-gray-300"}`}
              rows="4"
              placeholder={translations[language].feedbackPlaceholder}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <div className="flex space-x-4 mt-4">
              <button
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                onClick={handleSubmitFeedback}
              >
                {translations[language].send}
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                onClick={() => setShowFeedbackModal(false)}
              >
                {translations[language].cancel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {!showGuide && (
        <motion.div className={`fixed bottom-6 right-6 p-4 ${darkMode ? "bg-gray-800 text-gray-200 border-gray-700" : "bg-white text-gray-800 border-gray-200"} rounded-xl shadow-lg border`}>
          <p className="text-base font-medium">{translations[language].newToDashboard}</p>
          <div className="flex space-x-3 mt-3">
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium" onClick={() => setShowGuide(true)}>
              {translations[language].yes}
            </button>
            <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm font-medium" onClick={() => setShowGuide(false)}>
              {translations[language].no}
            </button>
          </div>
        </motion.div>
      )}

      {showGuide && (
        <motion.div className="fixed inset-0 z-20 pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="relative pointer-events-auto">
            <motion.div
              className={`absolute p-4 ${darkMode ? "bg-gray-800 text-gray-200 border-gray-700" : "bg-white text-gray-800 border-gray-200"} rounded-xl shadow-lg border z-40`}
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
    </motion.div>
  );
};

// Wrap Dashboard with ErrorBoundary for export
const DashboardWithErrorBoundary = () => (
  <ErrorBoundary>
    <Dashboard />
  </ErrorBoundary>
);

export default DashboardWithErrorBoundary;