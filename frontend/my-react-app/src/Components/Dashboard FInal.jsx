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
    confirmed: "Confirmed Orders",
    dispatched: "Dispatched Orders",
    cancelled: "Cancelled Orders",
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
};

// Updated audio files for each container
const audioFiles = {
  "en-IN": {
    confirmed: "/Audio/en-IN/confirmed.mp3",
    cancelled: "/Audio/en-IN/cancelled.mp3",
    dispatched: "/Audio/en-IN/dispatched.mp3",
    totalEarnings: "/Audio/en-IN/totalEarnings.mp3",
    currentOrders: "/Audio/en-IN/currentOrders.mp3",
    previousOrders: "/Audio/en-IN/previousOrders.mp3",
    viewMarketTrends: "/Audio/en-IN/viewMarketTrends.mp3",
    cropRecommendation: "/Audio/en-IN/cropRecommendation.mp3",
    farmingNews: "/Audio/en-IN/farmingNews.mp3",
    ordersGraph: "/Audio/en-IN/ordersGraph.mp3",
    yourProducts: "/Audio/en-IN/yourProducts.mp3",
    weather: "/Audio/en-IN/weather.mp3",
    newMessage: "/Audio/en-IN/newMessage.mp3",
    feedback: "/Audio/en-IN/feedback.mp3",
    withdrawProduct: "/Audio/en-IN/withdrawProduct.mp3",
    addProduct: "/Audio/en-IN/addProduct.mp3",
  },
  "ta-IN": {
    confirmed: "/Audio/ta-IN/confirmed.mp3",
    cancelled: "/Audio/ta-IN/cancelled.mp3",
    dispatched: "/Audio/ta-IN/dispatched.mp3",
    totalEarnings: "/Audio/ta-IN/totalEarnings.mp3",
    currentOrders: "/Audio/ta-IN/currentOrders.mp3",
    previousOrders: "/Audio/ta-IN/previousOrders.mp3",
    viewMarketTrends: "/Audio/ta-IN/viewMarketTrends.mp3",
    cropRecommendation: "/Audio/ta-IN/cropRecommendation.mp3",
    farmingNews: "/Audio/ta-IN/farmingNews.mp3",
    ordersGraph: "/Audio/ta-IN/ordersGraph.mp3",
    yourProducts: "/Audio/ta-IN/yourProducts.mp3",
    weather: "/Audio/ta-IN/weather.mp3",
    newMessage: "/Audio/ta-IN/newMessage.mp3",
    feedback: "/Audio/ta-IN/feedback.mp3",
    withdrawProduct: "/Audio/ta-IN/withdrawProduct.mp3",
    addProduct: "/Audio/ta-IN/addProduct.mp3",
  },
  "hi-IN": {
    confirmed: "/Audio/hi-IN/confirmed.mp3",
    cancelled: "/Audio/hi-IN/cancelled.mp3",
    dispatched: "/Audio/hi-IN/dispatched.mp3",
    totalEarnings: "/Audio/hi-IN/totalEarnings.mp3",
    currentOrders: "/Audio/hi-IN/currentOrders.mp3",
    previousOrders: "/Audio/hi-IN/previousOrders.mp3",
    viewMarketTrends: "/Audio/hi-IN/viewMarketTrends.mp3",
    cropRecommendation: "/Audio/hi-IN/cropRecommendation.mp3",
    farmingNews: "/Audio/hi-IN/farmingNews.mp3",
    ordersGraph: "/Audio/hi-IN/ordersGraph.mp3",
    yourProducts: "/Audio/hi-IN/yourProducts.mp3",
    weather: "/Audio/hi-IN/weather.mp3",
    newMessage: "/Audio/hi-IN/newMessage.mp3",
    feedback: "/Audio/hi-IN/feedback.mp3",
    withdrawProduct: "/Audio/hi-IN/withdrawProduct.mp3",
    addProduct: "/Audio/hi-IN/addProduct.mp3",
  },
  "en-US": {
    confirmed: "/Audio/en-US/confirmed.mp3",
    cancelled: "/Audio/en-US/cancelled.mp3",
    dispatched: "/Audio/en-US/dispatched.mp3",
    totalEarnings: "/Audio/en-US/totalEarnings.mp3",
    currentOrders: "/Audio/en-US/currentOrders.mp3",
    previousOrders: "/Audio/en-US/previousOrders.mp3",
    viewMarketTrends: "/Audio/en-US/viewMarketTrends.mp3",
    cropRecommendation: "/Audio/en-US/cropRecommendation.mp3",
    farmingNews: "/Audio/en-US/farmingNews.mp3",
    ordersGraph: "/Audio/en-US/ordersGraph.mp3",
    yourProducts: "/Audio/en-US/yourProducts.mp3",
    weather: "/Audio/en-US/weather.mp3",
    newMessage: "/Audio/en-US/newMessage.mp3",
    feedback: "/Audio/en-US/feedback.mp3",
    withdrawProduct: "/Audio/en-US/withdrawProduct.mp3",
    addProduct: "/Audio/en-US/addProduct.mp3",
  },
};

// Guide steps for highlighting containers
const getGuideSteps = (language) => {
  return [
    { id: "confirmed", target: ".confirmed", textKey: "guideConfirmed" },
    { id: "cancelled", target: ".cancelled", textKey: "guideCancelled" },
    { id: "dispatched", target: ".dispatched", textKey: "guideDispatched" },
    { id: "totalEarnings", target: ".total-earnings", textKey: "guideTotalEarnings" },
    { id: "currentOrders", target: ".current-orders", textKey: "guideCurrentOrders" },
    { id: "previousOrders", target: ".previous-orders", textKey: "guidePreviousOrders" },
    { id: "viewMarketTrends", target: ".view-market-trends", textKey: "guideSellSurplus" },
    { id: "cropRecommendation", target: ".crop-recommendation", textKey: "guideCropRecommendation" },
    { id: "farmingNews", target: ".farming-news", textKey: "guideFarmingNews" },
    { id: "ordersGraph", target: ".orders-graph", textKey: "guideOrdersGraph" },
    { id: "yourProducts", target: ".your-products", textKey: "guideYourProducts" },
    { id: "weather", target: ".weather", textKey: "guideWeather" },
    { id: "newMessage", target: ".new-message", textKey: "guideNewMessage" },
    { id: "feedback", target: ".feedback", textKey: "guideFeedback" },
    { id: "withdrawProduct", target: ".withdraw-product", textKey: "guideWithdrawProduct" },
    { id: "addProduct", target: ".add-product", textKey: "guideAddProduct" },
  ];
};

// Crop recommendations array
const cropRecommendations = [
  { name: "Onions", image: "https://images.unsplash.com/photo-1618512496248-a07fe4613e8e?q=80&w=1000&auto=format&fit=crop" },
  { name: "Tomatoes", image: "https://images.unsplash.com/photo-1599819810277-2320b4e1e3ed?q=80&w=1000&auto=format&fit=crop" },
  { name: "Potatoes", image: "https://images.unsplash.com/photo-1518977829002-6a9d13e7a1e5?q=80&w=1000&auto=format&fit=crop" },
  { name: "Wheat", image: "https://images.unsplash.com/photo-1600005994501-2f3e2b67a60f?q=80&w=1000&auto=format&fit=crop" },
  { name: "Rice", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop" },
];

// Predefined farming news videos for fallback
const fallbackFarmingNews = [
  {
    id: "1",
    title: "Innovative Farming Techniques 2025",
    thumbnail: "https://via.placeholder.com/150?text=Video1",
    url: "https://www.youtube.com/watch?v=example1",
  },
  {
    id: "2",
    title: "Sustainable Agriculture Trends",
    thumbnail: "https://via.placeholder.com/150?text=Video2",
    url: "https://www.youtube.com/watch?v=example2",
  },
  {
    id: "3",
    title: "Modern Irrigation Systems",
    thumbnail: "https://via.placeholder.com/150?text=Video3",
    url: "https://www.youtube.com/watch?v=example3",
  },
];

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center text-red-400 bg-gray-900">
          <h1 className="text-2xl font-semibold">Something went wrong.</h1>
          <p className="mt-2">{this.state.error?.message || "Unknown error"}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(true);
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
  const [farmingNews, setFarmingNews] = useState(null);
  const [marketTrends, setMarketTrends] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(null);
  const [recommendedCrop, setRecommendedCrop] = useState(null);
  const audioRef = useRef(null);

  const navigate = useNavigate();
  const db = getDatabase();
  const guideSteps = getGuideSteps(language);

  useEffect(() => {
    // Select a random crop recommendation on mount
    const randomCrop = cropRecommendations[Math.floor(Math.random() * cropRecommendations.length)];
    setRecommendedCrop(randomCrop);
  }, []);

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

      const farmerProductRef = ref(db, `products/farmer_${user.uid}`);
      onValue(
        farmerProductRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const productsData = snapshot.val();
            const farmerProducts = Object.entries(productsData).map(([id, product]) => ({
              id,
              name: product.name || "Unknown Product",
              price: product.price || 0,
              stock: product.quantity || product.stock || 0,
              image: product.image || "https://via.placeholder.com/150",
            }));
            setProducts(farmerProducts);
          } else {
            setProducts([]);
          }
          setLoading(false);
        },
        (err) => {
          console.error("Products fetch error:", err);
          setError("Failed to fetch products.");
          setLoading(false);
        }
      );

      const ordersRef = ref(db, "orders");
      onValue(
        ordersRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const ordersData = snapshot.val();
            console.log("Raw Orders Data:", ordersData); // Log raw data

            const farmerOrders = Object.entries(ordersData)
              .filter(([_, order]) => {
                const hasFarmerProduct = order.products && 
                  Array.isArray(order.products) && 
                  order.products.some((p) => p.farmerId === `farmer_${user.uid}`);
                console.log(`Order Filter Check: ${hasFarmerProduct}`); // Log filter result
                return hasFarmerProduct;
              })
              .map(([id, order]) => {
                const farmerProducts = order.products.filter((p) => p.farmerId === `farmer_${user.uid}`);
                const farmerTotal = farmerProducts.reduce((sum, p) => {
                  const total = parseFloat(p.totalPrice) || 0;
                  console.log(`Product Total: ${total}`); // Log each product total
                  return sum + total;
                }, 0);
                const status = order.status === "Confirmed" ? "Dispatched" : order.status || "Unknown";
                console.log(`Order ${id}: Status=${status}, Total=${farmerTotal}`); // Log order details
                
                return {
                  id: order.orderId || id,
                  status: status,
                  totalAmount: farmerTotal,
                  date: order.orderDateTime || order.date || new Date().toISOString(),
                  products: farmerProducts,
                  customerName: order.customerName || "Unknown Customer",
                };
              });

            console.log("Processed Farmer Orders:", farmerOrders); // Log processed orders

            setOrders(farmerOrders);
            
            // More robust earnings calculation
            const completedOrders = farmerOrders.filter(order => {
              const isCompleted = order.status === "Dispatched";
              console.log(`Order ${order.id} Completed Check: ${isCompleted}`);
              return isCompleted;
            });
            
            const totalEarnings = completedOrders.reduce((sum, order) => {
              const amount = parseFloat(order.totalAmount) || 0;
              console.log(`Adding to Earnings - Order ${order.id}: ${amount}`);
              return sum + amount;
            }, 0);

            console.log("Calculated Total Earnings:", totalEarnings);
            setEarnings(totalEarnings);
          } else {
            console.log("No orders exist in the database");
            // Optional: Add mock data for testing
            /*
            const mockOrders = [
              {
                id: "test1",
                status: "Completed",
                totalAmount: 500,
                date: new Date().toISOString(),
                products: [{ farmerId: `farmer_${user.uid}`, totalPrice: "500" }],
                customerName: "Test Customer"
              }
            ];
            setOrders(mockOrders);
            setEarnings(500);
            */
            setOrders([]);
            setEarnings(0);
          }
        },
        (err) => {
          console.error("Orders fetch error:", err);
          setError("Failed to fetch orders.");
          setOrders([]);
          setEarnings(0);
        }
      );

      const fetchWeather = async (lat, lon) => {
        const apiKey = "ccd8b058961d7fefa87f1c29421d8bdf";
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          if (data.cod === 200) {
            setWeather({
              main: { temp: data.main.temp, humidity: data.main.humidity },
              weather: [{ description: data.weather[0].description }],
              name: data.name,
              country: data.sys.country,
            });
          } else {
            throw new Error(data.message || "Failed to fetch weather data");
          }
        } catch (err) {
          console.error("Weather fetch error:", err);
          setWeather({
            main: { temp: 34.81, humidity: 24 },
            weather: [{ description: "broken clouds" }],
            name: "Sulur",
            country: "IN",
          });
        }
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
      } else {
        setWeather({
          main: { temp: 34.81, humidity: 24 },
          weather: [{ description: "broken clouds" }],
          name: "Sulur",
          country: "IN",
        });
      }

      const fetchFarmingNews = async () => {
        const apiKey = "AIzaSyAzBNj20JCE39AUvRXWoV5VlgNaiL-o_94";
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=farming+technology+news&type=video&maxResults=5&key=${apiKey}`;
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          if (data.items && data.items.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.items.length);
            const item = data.items[randomIndex];
            setFarmingNews({
              id: item.id.videoId,
              title: item.snippet.title,
              thumbnail: item.snippet.thumbnails.medium.url,
              url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            });
          } else {
            console.warn("No videos found from API, using fallback.");
            const randomFallback = fallbackFarmingNews[Math.floor(Math.random() * fallbackFarmingNews.length)];
            setFarmingNews(randomFallback);
          }
        } catch (err) {
          console.error("YouTube fetch error:", err.message);
          const randomFallback = fallbackFarmingNews[Math.floor(Math.random() * fallbackFarmingNews.length)];
          setFarmingNews(randomFallback);
        }
      };

      fetchFarmingNews();
      const interval = setInterval(fetchFarmingNews, 300000); // Refresh every 5 minutes

      const fetchMarketTrends = async () => {
        try {
          const response = await fetch("https://api.agromonitoring.com/agro/1.0/market/prices?appid=YOUR_AGRO_API_KEY");
          const data = await response.json();
          if (data && data.length > 0) {
            setMarketTrends(data.slice(0, 5));
          } else {
            throw new Error("No market trends data available");
          }
        } catch (err) {
          console.error("Market trends fetch error:", err);
          setMarketTrends([
            { id: 1, crop: "Wheat", price: 300, description: "High demand this season" },
            { id: 2, crop: "Rice", price: 250, description: "Stable prices" },
            { id: 3, crop: "Corn", price: 200, description: "Rising demand" },
            { id: 4, crop: "Tomato", price: 150, description: "Seasonal surplus" },
            { id: 5, crop: "Potato", price: 180, description: "Moderate demand" },
          ]);
        }
      };

      fetchMarketTrends();

      return () => {
        unsubscribe();
        clearInterval(interval);
      };
    });
  }, [navigate, db]);

  // Orders graph data
  const ordersByMonth = orders.reduce((acc, order) => {
    if (order.status === "Dispatched" && order.date) {
      const date = new Date(order.date);
      if (!isNaN(date.getTime())) { // Ensure date is valid
        const month = date.toLocaleString("default", { month: "short", year: "numeric" });
        acc[month] = (acc[month] || 0) + (parseFloat(order.totalAmount) || 0);
      }
    }
    return acc;
  }, {});

  const ordersData = {
    labels: Object.keys(ordersByMonth).length ? Object.keys(ordersByMonth) : ["No Data"],
    datasets: [
      {
        label: translations[language]?.ordersGraph || "Orders Graph",
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
      legend: { position: "top", labels: { color: "#e5e7eb", font: { size: 14 } } },
      title: {
        display: true,
        text: translations[language]?.ordersGraph || "Orders Graph",
        color: "#e5e7eb",
        font: { size: 18, family: "'Poppins', sans-serif" },
      },
    },
    scales: {
      x: { ticks: { color: "#e5e7eb", font: { size: 12, family: "'Poppins', sans-serif" } } },
      y: {
        ticks: {
          color: "#e5e7eb",
          font: { size: 12, family: "'Poppins', sans-serif" },
          callback: (value) => `₹${value}`, // Format y-axis as currency
        },
        beginAtZero: true,
      },
    },
  };

  useEffect(() => {
    if (showGuide) {
      const currentStep = guideSteps[guideStep];
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      const audio = new Audio(audioFiles[language][currentStep.id]);
      audioRef.current = audio;
      audio.play().catch((error) => console.error("Audio playback failed:", error));

      audio.onended = () => {
        if (guideStep < guideSteps.length - 1) {
          setGuideStep((prev) => prev + 1);
        } else {
          setShowGuide(false);
        }
      };

      return () => {
        if (audioRef.current) audioRef.current.pause();
        audio.onended = null;
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
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err.message);
      setError("Failed to log out.");
    }
  };

  const handleWithdrawClick = (product) => {
    setSelectedProduct(product);
    setShowWithdrawModal(true);
  };

  const withdrawProduct = async (productId) => {
    try {
      const productRef = ref(db, `products/farmer_${farmerId}/${productId}`);
      await remove(productRef);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setShowWithdrawModal(false);
      setSelectedProduct(null);
      alert("Product withdrawn successfully!");
    } catch (err) {
      console.error("Error withdrawing product:", err);
      setError("Failed to withdraw product.");
    }
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

  const handleViewMarketTrends = () => {
    fetchMarketTrends();
  };

  const toggleOrderDetails = (orderId) => {
    setDetailsOpen(detailsOpen === orderId ? null : orderId);
  };

  const pageVariants = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };
  const glossyHover = { scale: 1.03, boxShadow: "0 4px 12px rgba(255, 255, 255, 0.15)", transition: { duration: 0.3 } };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-300 font-poppins">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-400 font-poppins">{error}</div>;

  return (
    <motion.div
      className={`min-h-screen p-6 font-poppins bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 ${showGuide ? "backdrop-blur-sm" : ""}`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start mb-10 space-y-8 lg:space-y-0 lg:space-x-10">
        <motion.div className="flex items-center space-x-6">
          <img
            src={profilePic}
            alt="Farmer Profile"
            className="w-20 h-20 rounded-full bg-gray-700 object-cover border-4 border-gray-600 shadow-lg"
            onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
          />
          <div>
            <h2 className="text-3xl font-bold text-green-400 tracking-tight">{translations[language].helloFarmer.replace("Farmer", farmerName)}</h2>
            <motion.button
              className="mt-4 px-5 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-600 text-sm font-medium shadow-lg transition-all duration-300"
              onClick={() => setShowSettings(!showSettings)}
              whileHover={{ scale: 1.05 }}
            >
              {translations[language].settings}
            </motion.button>
            {showSettings && (
              <motion.div
                className="absolute left-6 top-28 mt-2 w-56 bg-gray-800 text-gray-200 border border-gray-700 rounded-xl shadow-xl p-4 z-20 backdrop-blur-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 rounded-lg transition-colors"
                  onClick={() => setDarkMode(!darkMode)}
                >
                  {darkMode ? translations[language].lightMode : translations[language].darkMode}
                </button>
                <select
                  className="w-full text-left px-4 py-2 text-sm bg-transparent hover:bg-gray-700 rounded-lg transition-colors"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="en-IN" className="text-gray-800">English (India)</option>
                  <option value="ta-IN" className="text-gray-800">தமிழ் (Tamil)</option>
                  <option value="hi-IN" className="text-gray-800">हिन्दी (Hindi)</option>
                  <option value="en-US" className="text-gray-800">English (US)</option>
                </select>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 rounded-lg transition-colors">
                  {translations[language].help}
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                  onClick={handleLogout}
                >
                  {translations[language].logout}
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full lg:w-2/3">
          {["confirmed", "dispatched", "cancelled"].map((status) => (
            <motion.div
              key={status}
              className={`p-6 rounded-xl shadow-xl border ${status} bg-gray-800 border-gray-700 backdrop-blur-lg hover:shadow-2xl transition-all duration-300`}
              whileHover={glossyHover}
            >
              <h3 className={`font-semibold text-xl ${status === "confirmed" ? "text-green-400" : status === "dispatched" ? "text-yellow-400" : "text-red-400"} tracking-wide`}>
                {translations[language][status]}
              </h3>
              {orders
                .filter((o) => o.status.toLowerCase() === status.toLowerCase())
                .slice(0, 2)
                .map((order, idx) => (
                  <p key={idx} className="mt-3 text-sm text-gray-300">
                    Order #{order.id.split("_")[1] || order.id} - ₹{order.totalAmount.toFixed(2)} (To: {order.customerName})
                  </p>
                ))}
              {orders.filter((o) => o.status.toLowerCase() === status.toLowerCase()).length === 0 && (
                <p className="mt-3 text-sm text-gray-400">No {status} orders</p>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          className="p-6 rounded-xl shadow-xl border weather bg-gray-800 border-gray-700 backdrop-blur-lg hover:shadow-2xl transition-all duration-300 w-full lg:w-80"
          whileHover={glossyHover}
        >
          <h3 className="font-semibold text-xl text-blue-400 tracking-wide">{translations[language].weather}</h3>
          {weather ? (
            <div className="mt-4 text-center">
              <span className="text-5xl">{getWeatherEmoji(weather.weather[0].description)}</span>
              <p className="text-base font-medium text-gray-300 mt-2 capitalize">{weather.weather[0].description}</p>
              <p className="text-3xl font-bold text-blue-400">{weather.main.temp}°C</p>
              <p className="text-base text-gray-300 mt-2">{weather.name}, {weather.country}</p>
            </div>
          ) : (
            <p className="mt-4 text-base text-gray-300">Fetching weather...</p>
          )}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <motion.div className="p-6 rounded-xl shadow-xl border total-earnings bg-gray-800 backdrop-blur-lg hover:shadow-2xl transition-all duration-300" whileHover={glossyHover}>
            <h3 className="font-semibold text-xl text-green-400 tracking-wide">{translations[language].totalEarnings}</h3>
            <p className="mt-4 text-4xl font-bold text-gray-100">₹{earnings.toFixed(2)}</p>
          </motion.div>

          <motion.div className="p-6 rounded-xl shadow-xl border current-orders bg-gray-800 backdrop-blur-lg hover:shadow-2xl transition-all duration-300" whileHover={glossyHover}>
            <h3 className="font-semibold text-xl text-green-400 tracking-wide">{translations[language].currentOrders}</h3>
            {orders
              .filter((o) => ["Pending", "Confirmed", "Processing", "Dispatched"].includes(o.status))
              .slice(0, 2)
              .map((order, idx) => (
                <p key={idx} className="mt-3 text-sm text-gray-300">
                  Order #{order.id.split("_")[1] || order.id} - ₹{order.totalAmount.toFixed(2)} ({order.status})
                </p>
              ))}
            {orders.filter((o) => ["Pending", "Confirmed", "Processing", "Dispatched"].includes(o.status)).length === 0 && (
              <p className="mt-3 text-sm text-gray-400">No current orders</p>
            )}
          </motion.div>

          <motion.div className="p-6 rounded-xl shadow-xl border previous-orders bg-gray-800 backdrop-blur-lg hover:shadow-2xl transition-all duration-300" whileHover={glossyHover}>
            <h3 className="font-semibold text-xl text-yellow-400 tracking-wide">{translations[language].previousOrders}</h3>
            {orders.filter((o) => ["Completed", "Cancelled"].includes(o.status)).length === 0 ? (
              <p className="mt-3 text-sm text-gray-400">No previous orders</p>
            ) : (
              <div className="mt-4 space-y-3">
                {orders
                  .filter((o) => ["Completed", "Cancelled"].includes(o.status))
                  .map((order) => (
                    <motion.div
                      key={order.id}
                      className="bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition-colors"
                      onClick={() => toggleOrderDetails(order.id)}
                      initial={{ height: "auto" }}
                      animate={{ height: detailsOpen === order.id ? "auto" : "auto" }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-300">
                          Order #{order.id.split("_")[1] || order.id} - ₹{order.totalAmount.toFixed(2)} ({order.status})
                        </p>
                        <span className="text-gray-400">{detailsOpen === order.id ? "▲" : "▼"}</span>
                      </div>
                      {detailsOpen === order.id && (
                        <motion.div
                          className="mt-2 text-gray-400 text-xs"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <p>Customer: {order.customerName}</p>
                          <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                          <p className="mt-2 font-semibold text-gray-300">Products:</p>
                          {order.products.map((product, idx) => (
                            <div key={idx} className="ml-2">
                              <p>- {product.productName || product.name}</p>
                              <p className="ml-4">Price: ₹{product.price || "N/A"}/kg</p>
                              <p className="ml-4">Quantity: {product.quantity || "N/A"} kg</p>
                              <p className="ml-4">Total: ₹{product.totalPrice || "N/A"}</p>
                            </div>
                          ))}
                          <p className="mt-2 font-semibold">Total Amount: ₹{order.totalAmount.toFixed(2)}</p>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
              </div>
            )}
          </motion.div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <motion.div className="p-6 rounded-xl shadow-xl border view-market-trends bg-gray-800 backdrop-blur-lg hover:shadow-2xl transition-all duration-300" whileHover={glossyHover}>
            <h3 className="font-semibold text-xl text-blue-400 tracking-wide">{translations[language].viewMarketTrends}</h3>
            <motion.button
              className="mt-4 px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 text-sm font-medium shadow-lg transition-all duration-300"
              onClick={handleViewMarketTrends}
              whileHover={{ scale: 1.05 }}
            >
              {translations[language].viewMarketTrends}
            </motion.button>
            {marketTrends && (
              <div className="mt-4 space-y-2">
                {marketTrends.map((trend) => (
                  <p key={trend.id} className="text-sm text-gray-300">
                    {trend.crop}: ₹{trend.price}/kg - {trend.description}
                  </p>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div className="p-6 rounded-xl shadow-xl border crop-recommendation bg-gray-800 backdrop-blur-lg hover:shadow-2xl transition-all duration-300" whileHover={glossyHover}>
            <h3 className="font-semibold text-xl text-orange-400 tracking-wide">{translations[language].cropRecommendation}</h3>
            {recommendedCrop ? (
              <div className="mt-4 flex items-center space-x-4">
                <img
                  src={recommendedCrop.image}
                  alt={recommendedCrop.name}
                  className="w-16 h-16 object-cover rounded-lg"
                  onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                />
                <p className="text-sm text-gray-300">Recommended Crop: {recommendedCrop.name}</p>
              </div>
            ) : (
              <p className="mt-4 text-sm text-gray-300">Loading recommendation...</p>
            )}
          </motion.div>

          <motion.div className="p-6 rounded-xl shadow-xl border farming-news bg-gray-800 backdrop-blur-lg hover:shadow-2xl transition-all duration-300" whileHover={glossyHover}>
            <h3 className="font-semibold text-xl text-green-400 tracking-wide">{translations[language].farmingNews}</h3>
            <div className="mt-4">
              {farmingNews ? (
                <a href={farmingNews.url} target="_blank" rel="noopener noreferrer" className="block">
                  <motion.div
                    className="p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    key={farmingNews.id}
                  >
                    <img
                      src={farmingNews.thumbnail}
                      alt={farmingNews.title}
                      className="w-full h-32 object-cover rounded-lg mb-2"
                      onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                    />
                    <p className="text-sm text-gray-200 font-medium">{farmingNews.title}</p>
                  </motion.div>
                </a>
              ) : (
                <p className="text-sm text-gray-400">Fetching farming news...</p>
              )}
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <motion.div className="p-6 rounded-xl shadow-xl border orders-graph bg-gray-800 backdrop-blur-lg hover:shadow-2xl transition-all duration-300 h-96" whileHover={glossyHover}>
            <h3 className="font-semibold text-xl text-red-400 tracking-wide">{translations[language].ordersGraph}</h3>
            <div className="mt-4 h-72">
              <Bar data={ordersData} options={chartOptions} />
            </div>
          </motion.div>

          <motion.div className="p-6 rounded-xl shadow-xl border your-products bg-gray-800 backdrop-blur-lg hover:shadow-2xl transition-all duration-300" whileHover={glossyHover}>
            <h3 className="font-semibold text-xl text-teal-400 tracking-wide">{translations[language].yourProducts}</h3>
            {products.length === 0 ? (
              <p className="mt-4 text-sm text-gray-400">
                No products available.{" "}
                <Link to="/addproducts" className="text-teal-400 font-medium">
                  {translations[language].addProduct}
                </Link>
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    whileHover={{ scale: 1.05 }}
                    className="p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg mx-auto"
                      onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                    />
                    <p className="text-sm font-medium mt-2 text-center text-gray-200">{product.name}</p>
                    <p className="text-xs text-gray-400 text-center">₹{product.price}/kg</p>
                    <p className="text-xs text-gray-500 text-center">{product.stock} kg available</p>
                    <button
                      className="mt-2 w-full px-3 py-1 bg-orange-500 text-white rounded-lg text-xs hover:bg-orange-600 shadow-lg transition-all duration-300"
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
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 text-base font-medium new-message shadow-lg transition-all duration-300"
            onClick={() => setShowMessageModal(true)}
            whileHover={{ scale: 1.05 }}
          >
            {translations[language].newMessage}
          </motion.button>
          <motion.button
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 text-base font-medium feedback shadow-lg transition-all duration-300"
            onClick={() => setShowFeedbackModal(true)}
            whileHover={{ scale: 1.05 }}
          >
            {translations[language].feedback}
          </motion.button>
          <Link to="/addproducts" className="w-full">
            <motion.button
              className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 text-base font-medium add-product shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
            >
              {translations[language].addProduct}
            </motion.button>
          </Link>
        </div>
      </div>

      {showWithdrawModal && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-gray-800 text-gray-200 p-6 rounded-xl shadow-2xl backdrop-blur-lg"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <h3 className="text-xl font-semibold mb-4">
              {translations[language].withdrawProduct}: {selectedProduct?.name}
            </h3>
            <p className="mb-4 text-sm">Are you sure you want to withdraw this product?</p>
            <div className="flex space-x-4">
              <button
                className="px-5 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 shadow-lg text-sm transition-all duration-300"
                onClick={() => withdrawProduct(selectedProduct.id)}
              >
                Yes
              </button>
              <button
                className="px-5 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 shadow-lg text-sm transition-all duration-300"
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
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-gray-800 text-gray-200 p-6 rounded-xl shadow-2xl w-96 backdrop-blur-lg"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <h3 className="text-xl font-semibold mb-4">{translations[language].newMessage}</h3>
            <textarea
              className="w-full p-3 border rounded-lg bg-gray-700 text-gray-200 border-gray-600 text-sm focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder={translations[language].messagePlaceholder}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex space-x-4 mt-4">
              <button
                className="px-5 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 shadow-lg text-sm transition-all duration-300"
                onClick={handleSendMessage}
              >
                {translations[language].send}
              </button>
              <button
                className="px-5 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 shadow-lg text-sm transition-all duration-300"
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
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-gray-800 text-gray-200 p-6 rounded-xl shadow-2xl w-96 backdrop-blur-lg"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <h3 className="text-xl font-semibold mb-4">{translations[language].feedback}</h3>
            <textarea
              className="w-full p-3 border rounded-lg bg-gray-700 text-gray-200 border-gray-600 text-sm focus:ring-2 focus:ring-purple-500"
              rows="4"
              placeholder={translations[language].feedbackPlaceholder}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <div className="flex space-x-4 mt-4">
              <button
                className="px-5 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 shadow-lg text-sm transition-all duration-300"
                onClick={handleSubmitFeedback}
              >
                {translations[language].send}
              </button>
              <button
                className="px-5 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 shadow-lg text-sm transition-all duration-300"
                onClick={() => setShowFeedbackModal(false)}
              >
                {translations[language].cancel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {!showGuide && (
        <motion.div
          className="fixed bottom-6 right-6 p-4 bg-gray-800 text-gray-200 border-gray-700 rounded-xl shadow-xl border backdrop-blur-lg"
        >
          <p className="text-base font-medium">{translations[language].newToDashboard}</p>
          <div className="flex space-x-3 mt-3">
            <button
              className="px-5 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 text-sm font-medium shadow-lg transition-all duration-300"
              onClick={() => setShowGuide(true)}
            >
              {translations[language].yes}
            </button>
            <button
              className="px-5 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 text-sm font-medium shadow-lg transition-all duration-300"
              onClick={() => setShowGuide(false)}
            >
              {translations[language].no}
            </button>
          </div>
        </motion.div>
      )}

      {showGuide && (
        <motion.div className="fixed inset-0 z-20 pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="relative pointer-events-auto">
            <motion.div
              className="absolute p-4 bg-gray-800 text-gray-200 border-gray-700 rounded-xl shadow-xl border z-40 backdrop-blur-lg"
              style={{
                top: (document.querySelector(guideSteps[guideStep].target)?.getBoundingClientRect().top || 0) - 140 + window.scrollY,
                left: "50%",
                transform: "translateX(-50%)",
                width: "320px",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="text-base mb-3">{translations[language][guideSteps[guideStep].textKey]}</p>
              <div className="flex space-x-3">
                <button
                  className="px-5 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 text-sm font-medium shadow-lg transition-all duration-300"
                  onClick={() => (guideStep < guideSteps.length - 1 ? setGuideStep((prev) => prev + 1) : setShowGuide(false))}
                >
                  {guideStep < guideSteps.length - 1 ? translations[language].next : translations[language].finish}
                </button>
                {guideStep > 0 && (
                  <button
                    className="px-5 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 text-sm font-medium shadow-lg transition-all duration-300"
                    onClick={() => setGuideStep((prev) => prev - 1)}
                  >
                    Back
                  </button>
                )}
                <button
                  className="px-5 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 text-sm font-medium shadow-lg transition-all duration-300"
                  onClick={() => setShowGuide(false)}
                >
                  Close
                </button>
              </div>
            </motion.div>
            <motion.div
              className="absolute border-4 border-green-500 rounded-xl shadow-lg pointer-events-none z-20"
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

const DashboardWithErrorBoundary = () => (
  <ErrorBoundary>
    <Dashboard />
  </ErrorBoundary>
);

export default DashboardWithErrorBoundary;