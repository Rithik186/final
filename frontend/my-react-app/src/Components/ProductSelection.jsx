import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mic, User, Settings, LogOut } from "lucide-react";
import { auth } from "../firebase.js";
import { getDatabase, ref, push, set } from "firebase/database";

// Cleaned and standardized product data
const products = [
  { id: 1, name: "Fresh Carrots", tamilName: "கேரட்", hindiName: "गाजर", category: "Vegetables", weight: "1kg", image: "https://www.bigbasket.com/media/uploads/p/xxl/10000070_16-fresho-carrot-orange.jpg" },
  { id: 2, name: "Organic Tomatoes", tamilName: "தக்காளி", hindiName: "टमाटर", category: "Vegetables", weight: "1kg", image: "https://www.bbassets.com/media/uploads/p/l/40130385_8-fresho-tomato-local-organically-grown.jpg" },
  { id: 3, name: "Green Apples", tamilName: "பச்சை ஆப்பிள்கள்", hindiName: "हरे सेब", category: "Fruits", weight: "1kg", image: "https://www.bbassets.com/media/uploads/p/l/20000964_11-fresho-green-apple.jpg" },
  { id: 4, name: "Bananas", tamilName: "வாழைப்பழம்", hindiName: "केला", category: "Fruits", weight: "1kg", image: "https://www.bbassets.com/media/uploads/p/l/10000025_32-fresho-banana-robusta.jpg" },
  { id: 5, name: "Almond Seeds", tamilName: "பாதாம் விதைகள்", hindiName: "बादाम के बीज", category: "Seeds", weight: "1kg", image: "https://cbx-prod.b-cdn.net/COLOURBOX47480356.jpg?width=800&height=800&quality=70" },
  { id: 6, name: "Fresh Milk", tamilName: "பால்", hindiName: "ताजा दूध", category: "Dairy Products", weight: "1kg", image: "https://img.freepik.com/free-photo/fresh-milk-bottle-glass_1150-17631.jpg" },
  { id: 7, name: "Cheese", tamilName: "சீஸ்", hindiName: "पनीर", category: "Dairy Products", weight: "1kg", image: "https://www.allrecipes.com/thmb/PwgOsAXFGvpolr0hUiB7pVlS75k=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Yellow-vs-White-Cheddar-Cheese-4x3-de76c824c4814aa8a5d52569d572713d.png" },
  { id: 8, name: "Organic Fertilizer", tamilName: "ஆர்கானிக் உரம்", hindiName: "जैविक उर्वरक", category: "Fertilizers", weight: "1kg", image: "https://www.bbassets.com/media/uploads/p/l/40008672_5-natures-plus-organic-fertiliser.jpg" },
  { id: 9, name: "Strawberries", tamilName: "ஸ்ட்ராபெர்ரி", hindiName: "स्ट्रॉबेरी", category: "Fruits", weight: "1kg", image: "https://www.bbassets.com/media/uploads/p/l/10000263_14-fresho-strawberry.jpg" },
  { id: 10, name: "Cabbage", tamilName: "முட்டைக்கோஸ்", hindiName: "पत्तागोभी", category: "Vegetables", weight: "1kg", image: "https://www.bbassets.com/media/uploads/p/l/40023473_6-fresho-cabbage-organically-grown.jpg" },
  { id: 11, name: "Sunflower Seeds", tamilName: "சூரியகாந்தி விதைகள்", hindiName: "सूरजमुखी के बीज", category: "Seeds", weight: "1kg", image: "https://m.media-amazon.com/images/I/71yz2Pi2SBL._AC_UF1000,1000_QL80_.jpg" },
  { id: 12, name: "Butter", tamilName: "வெண்ணெய்", hindiName: "मक्खन", category: "Dairy Products", weight: "1kg", image: "https://5.imimg.com/data5/FN/OM/MY-23458232/fresh-butter-500x500.jpg" },
  { id: 13, name: "Black Grapes", tamilName: "கருப்பு திராட்சை", hindiName: "काले अंगूर", category: "Fruits", weight: "1kg", image: "https://www.bbassets.com/media/uploads/p/l/40229414_5-fresho-grapes-black-imported.jpg" },
  { id: 14, name: "Walnut Seeds", tamilName: "வால்நட் விதைகள்", hindiName: "अखरोट के बीज", category: "Seeds", weight: "1kg", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl1uFxggfeCevz0KDDxI0yRFtimetZlW8gBg&s" },
  { id: 15, name: "Whole Wheat Bread", tamilName: "முழு கோதுமை ரொட்டி", hindiName: "साबुत गेहूं की रोटी", category: "Dairy Products", weight: "1kg", image: "https://www.bbassets.com/media/uploads/p/l/40232043_5-tasties-whole-wheat-bread.jpg" },
  { id: 16, name: "Broccoli", tamilName: "ப்ரோக்கோலி", hindiName: "ब्रोकली", category: "Vegetables", weight: "1kg", image: "https://www.bbassets.com/media/uploads/p/l/10000063_21-fresho-broccoli.jpg" },
  { id: 17, name: "Cashew Nuts", tamilName: "முந்திரி", hindiName: "काजू", category: "Seeds", weight: "1kg", image: "https://www.bigbasket.com/media/uploads/p/l/40210969_2-super-saver-cashews.jpg" },
  { id: 18, name: "Soy Milk", tamilName: "சோயா பால்", hindiName: "सोया दूध", category: "Dairy Products", weight: "1kg", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5WhsVF0dPYb_uCLSQBM9h5YV28R6rx1BUgQ&s" },
  { id: 19, name: "Paneer", tamilName: "பன்னீர்", hindiName: "पनीर", category: "Dairy Products", weight: "1kg", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE0FvAhZ2WHLHm2ct5sSG4qWz3zDnFZb68Dg&s" },
  { id: 20, name: "Oranges", tamilName: "ஆரஞ்சு", hindiName: "संतरा", category: "Fruits", weight: "1kg", image: "https://www.bbassets.com/media/uploads/p/l/10000384_11-fresho-orange-kinnow.jpg" },
  { id: 21, name: "Peanut Butter", tamilName: "வேர்க்கடலை வெண்ணெய்", hindiName: "मूंगफली का मक्खन", category: "Dairy Products", weight: "1kg", image: "https://www.inspiredtaste.net/wp-content/uploads/2020/06/Homemade-Almond-Butter-Recipe-1200.jpg" },
  { id: 22, name: "Chia Seeds", tamilName: "சியா விதைகள்", hindiName: "चिया बीज", category: "Seeds", weight: "1kg", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvZjGXEwMOZGqAA8Hci-B0z7bAoUyH-DiABg&s" },
  { id: 23, name: "Pistachios", tamilName: "பிஸ்தா", hindiName: "पिस्ता", category: "Seeds", weight: "1kg", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRllzjvljJNOZtXHWCf4e0Pcc9Lgh0vEq30cA&s" },
  { id: 24, name: "Pumpkin Seeds", tamilName: "பூசணி விதைகள்", hindiName: "कद्दू के बीज", category: "Seeds", weight: "1kg", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf2eV4W2kvtv0U0eKWRUak0R35oTbMrsI0OQ&s" },
  { id: 25, name: "Brown Rice", tamilName: "பழுப்பு அரிசி", hindiName: "भूरा चावल", category: "Seeds", weight: "1kg", image: "https://images.onlymyhealth.com/imported/images/2024/June/26_Jun_2024/mn-brown-rice.jpg" },
  { id: 26, name: "Quinoa", tamilName: "குயினோவா", hindiName: "क्विनोआ", category: "Seeds", weight: "1kg", image: "https://imgs.littleextralove.com/wp-content/uploads/2022/11/quinoa-for-hair-feat.jpg" },
  { id: 27, name: "Avocado", tamilName: "வெண்ணெய் பழம்", hindiName: "एवोकाडो", category: "Fruits", weight: "1kg", image: "https://www.bbassets.com/media/uploads/p/l/10000312_21-fresho-avocado.jpg" },
  { id: 28, name: "Mushrooms", tamilName: "காளான்", hindiName: "मशरूम", category: "Vegetables", weight: "1kg", image: "https://www.bbassets.com/media/uploads/p/l/10000273_17-fresho-mushrooms-button.jpg" },
  { id: 29, name: "Spinach", tamilName: "கீரை", hindiName: "पालक", category: "Vegetables", weight: "1kg", image: "https://www.bigbasket.com/media/uploads/p/l/40217496_3-fresho-spinach-hydroponically-grown.jpg" },
  { id: 30, name: "Blueberries", tamilName: "ப்ளூபெர்ரி", hindiName: "ब्लूबेरी", category: "Fruits", weight: "1kg", image: "https://www.bbassets.com/media/uploads/p/l/30009286_12-fresho-blueberry.jpg" },
  { id: 31, name: "Raspberries", tamilName: "ராஸ்பெர்ரி", hindiName: "रसभरी", category: "Fruits", weight: "1kg", image: "https://www.bigbasket.com/media/uploads/p/l/40099570_2-fresho-raspberry.jpg" },
  { id: 32, name: "Coconut Oil", tamilName: "தேங்காய் எண்ணெய்", hindiName: "नारियल तेल", category: "Herbs", weight: "1kg", image: "https://kumarmetal.com/wp-content/uploads/2021/08/setting-up-virgin-coconut-oil-plant.jpg" },
  { id: 33, name: "Olive Oil", tamilName: "ஆலிவ் எண்ணெய்", hindiName: "जैतून का तेल", category: "Herbs", weight: "1kg", image: "https://www.tatasimplybetter.com/cdn/shop/files/DSC09606_2048x2048.jpg?v=1734608321" },
  { id: 34, name: "Flaxseeds", tamilName: "ஆளி விதைகள்", hindiName: "अलसी के बीज", category: "Seeds", weight: "1kg", image: "https://domf5oio6qrcr.cloudfront.net/medialibrary/5961/cba8bd1b-be70-4f55-8818-9caf1b3df3de.jpg" },
  { id: 35, name: "Honey", tamilName: "தேன்", hindiName: "शहद", category: "Herbs", weight: "1kg", image: "https://5.imimg.com/data5/UD/MB/MY-42635865/natural-honey-500x500.jpg" },
  { id: 36, name: "Almond Butter", tamilName: "பாதாம் வெண்ணெய்", hindiName: "बादाम मक्खन", category: "Dairy Products", weight: "1kg", image: "https://www.inspiredtaste.net/wp-content/uploads/2020/06/Homemade-Almond-Butter-Recipe-1200.jpg" },
  { id: 37, name: "Zucchini", tamilName: "சீமை சுரைக்காய்", hindiName: "ज़ुक्किनी", category: "Vegetables", weight: "1kg", image: "https://www.bbassets.com/media/uploads/p/l/40211817_3-fresho-zucchini-green.jpg" },
  { id: 38, name: "Mangoes", tamilName: "மாங்காய்", hindiName: "आम", category: "Fruits", weight: "1kg", image: "https://www.bigbasket.com/media/uploads/p/l/40324153_2-fresho-mango-badami.jpg" },
  { id: 39, name: "Lettuce", tamilName: "லெட்டூஸ்", hindiName: "सलाद पत्ता", category: "Vegetables", weight: "1kg", image: "https://www.bbassets.com/media/uploads/p/l/10000318_14-fresho-lettuce-green.jpg" },
  { id: 40, name: "Eggs", tamilName: "முட்டை", hindiName: "अंडे", category: "Dairy Products", weight: "1kg", image: "https://www.bbassets.com/media/uploads/p/l/150502_6-fresho-farm-eggs-table-tray-medium-antibiotic-residue-free.jpg" },
  { id: 41, name: "Cinnamon", tamilName: "இலவங்கப்பட்டை", hindiName: "दालचीनी", category: "Herbs", weight: "1kg", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsqlvKSkdy63JB_1zan4kFnkQkTYU0zQed2w&s" },
  { id: 42, name: "Black Pepper", tamilName: "கருப்பு மிளகு", hindiName: "काली मिर्च", category: "Herbs", weight: "1kg", image: "https://ashokchakranursery.com/wp-content/uploads/2024/12/blackky.webp" },
  { id: 43, name: "Turmeric", tamilName: "மஞ்சள்", hindiName: "हल्दी", category: "Herbs", weight: "1kg", image: "https://www.bigbasket.com/media/uploads/p/l/40020040_11-fresho-turmeric-fresh.jpg" },
  { id: 44, name: "Cloves", tamilName: "கிராம்பு", hindiName: "लौंग", category: "Herbs", weight: "1kg", image: "https://rukminim2.flixcart.com/image/850/1000/xif0q/plant-seed/q/o/1/50-rxi-16-cloves-lavanga-seeds-50-seeds-vibex-original-imaggnksk72yapmb.jpeg?q=20&crop=false" },
  { id: 45, name: "Cardamom", tamilName: "ஏலக்காய்", hindiName: "इलायची", category: "Herbs", weight: "1kg", image: "https://mangalorespice.com/cdn/shop/products/SP_08-02.jpg?v=1734783515&width=1445" },
  { id: 46, name: "Bay Leaves", tamilName: "வளைகுடா இலைகள்", hindiName: "तेजपत्ता", category: "Herbs", weight: "1kg", image: "https://www.bbassets.com/media/uploads/p/l/40288349_2-super-saver-bb-super-saver-bay-leaf-50g.jpg" },
  { id: 47, name: "Coriander Powder", tamilName: "கொத்தமல்லி பொடி", hindiName: "धनिया पाउडर", category: "Herbs", weight: "1kg", image: "https://c.ndtvimg.com/2023-03/p4igk5po_dry-coriander-leaves_625x300_10_March_23.jpg?im=FaceCrop,algorithm=dnn,width=1200,height=675" },
  { id: 48, name: "Fenugreek Seeds", tamilName: "வெந்தய விதைகள்", hindiName: "मेथी दाना", category: "Seeds", weight: "1kg", image: "https://encrypted-tbn0.gstatic.com/images?q=tbngcRIxYjphT6AhMLmiUV85nNx_0urQI4VvNO9iw&s" },
  { id: 49, name: "Basil", tamilName: "துளசி", hindiName: "तुलसी", category: "Herbs", weight: "1kg", image: "https://www.bigbasket.com/media/uploads/p/l/10000314_14-fresho-basil-italian.jpg" },
  { id: 50, name: "Rosemary", tamilName: "ரோஸ்மேரி", hindiName: "रोज़मेरी", category: "Herbs", weight: "1kg", image: "https://www.bbassets.com/media/uploads/p/l/30006429_1-fresho-rosemary.jpg" },
  { id: 51, name: "Thyme", tamilName: "தைம்", hindiName: "अजवायन के फूल", category: "Herbs", weight: "1kg", image: "https://www.bigbasket.com/media/uploads/p/l/40026327_3-fresho-thyme.jpg" },
  { id: 52, name: "Parsley", tamilName: "வோக்கோசு", hindiName: "अजमोद", category: "Herbs", weight: "1kg", image: "https://www.bbassets.com/media/uploads/p/l/40101325_1-fresho-kale-curled-american.jpg" },
  { id: 53, name: "Papaya", tamilName: "பப்பாளி", hindiName: "पपीता", category: "Fruits", weight: "1kg", image: "https://www.bigbasket.com/media/uploads/p/l/40329344_1-fresho-papaya-medium.jpg" },
  { id: 54, name: "Cucumber", tamilName: "வெள்ளரிக்காய்", hindiName: "खीरा", category: "Vegetables", weight: "1kg", image: "https://www.bbassets.com/media/uploads/p/l/50000491_7-fresho-cucumber-organically-grown.jpg" },
  { id: 55, name: "Watermelon", tamilName: "தர்பூசணி", hindiName: "तरबूज", category: "Fruits", weight: "1kg", image: "https://www.bbassets.com/media/uploads/p/l/10000297_23-fresho-watermelon-striped-large.jpg" },
  { id: 56, name: "Dragon Fruit", tamilName: "டிராகன் பழம்", hindiName: "ड्रैगन फल", category: "Fruits", weight: "1kg", image: "https://www.bbassets.com/media/uploads/p/l/40008982_16-fresho-dragon-fruit.jpg" },
  { id: 57, name: "Pineapple", tamilName: "அன்னாசிப்பழம்", hindiName: "अनानास", category: "Fruits", weight: "1kg", image: "https://www.bigbasket.com/media/uploads/p/l/10000156_30-fresho-pineapple.jpg" },
  { id: 58, name: "Ginger", tamilName: "இஞ்சி", hindiName: "अदरक", category: "Herbs", weight: "1kg", image: "https://www.bbassets.com/media/uploads/p/l/10000338_15-fresho-ginger.jpg" },
  { id: 59, name: "Garlic", tamilName: "பூண்டு", hindiName: "लहसुन", category: "Herbs", weight: "1kg", image: "https://www.bbassets.com/media/uploads/p/l/10000114_18-fresho-garlic.jpg" },
  { id: 60, name: "Beetroot", tamilName: "பீட்ரூட்", hindiName: "चुकंदर", category: "Vegetables", weight: "1kg", image: "https://www.bigbasket.com/media/uploads/p/l/10000045_19-fresho-beetroot.jpg" },
  { id: 61, name: "Celery", tamilName: "செலரி", hindiName: "अजवाइन", category: "Herbs", weight: "1kg", image: "https://cdn.britannica.com/68/143768-050-108B71EC/Celery.jpg" },
  { id: 62, name: "Brussels Sprouts", tamilName: "புருசெல்ஸ் முளைகள்", hindiName: "ब्रसेल्स स्प्राउट्स", category: "Vegetables", weight: "1kg", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3RPU-SU7J8vgl7dSEkLGCRCjMXTH0312AjQ&s" },
  { id: 63, name: "Potatoes", tamilName: "உருளைக்கிழங்கு", hindiName: "आलू", category: "Vegetables", weight: "1kg", image: "https://www.bigbasket.com/media/uploads/p/l/10000159_25-fresho-potato.jpg" },
  { id: 64, name: "Onions", tamilName: "வெங்காயம்", hindiName: "प्याज", category: "Vegetables", weight: "1kg", image: "https://www.bigbasket.com/media/uploads/p/l/10000148_22-fresho-onion.jpg" },
].filter(Boolean); // Remove any null entries

const ProductSelection = () => {
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [billList, setBillList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [language, setLanguage] = useState("English");
  const [isListening, setIsListening] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [farmerInfo, setFarmerInfo] = useState({ name: "John Doe", email: "john@example.com" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const db = getDatabase();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setFarmerInfo({
        name: user.displayName || "Farmer",
        email: user.email || "No email",
      });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === "English" ? "en-US" : "ta-IN";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      const product = products.find((p) =>
        p.name.toLowerCase().includes(transcript) ||
        (language === "Tamil" && p.tamilName.toLowerCase().includes(transcript))
      );
      if (product) toggleSelection(product);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    if (isListening) recognition.start();
    return () => recognition.stop();
  }, [isListening, language]);

  const toggleSelection = (product) => {
    setSelectedProducts((prev) =>
      prev.some((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
    );
  };

  const addToBill = () => {
    setBillList((prev) => {
      let updatedBill = [...prev];
      selectedProducts.forEach((product) => {
        const existingIndex = updatedBill.findIndex((item) => item.id === product.id);
        if (existingIndex !== -1) {
          updatedBill[existingIndex].qty += 1;
          updatedBill[existingIndex].finalPrice = updatedBill[existingIndex].qty * (Number(updatedBill[existingIndex].customPrice) || 0);
        } else {
          updatedBill.push({ ...product, qty: 1, customPrice: "", finalPrice: 0 });
        }
      });
      return updatedBill;
    });
    setSelectedProducts([]);
  };

  const updateQuantity = (id, newQty) => {
    setBillList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, newQty), finalPrice: Math.max(1, newQty) * (Number(item.customPrice) || 0) }
          : item
      )
    );
  };

  const updateCustomPrice = (id, newPrice) => {
    setBillList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, customPrice: newPrice, finalPrice: item.qty * (Number(newPrice) || 0) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setBillList((prev) => prev.filter((item) => item.id !== id));
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
          quantity: item.qty,
          price,
          category: item.category,
          image: item.image,
          farmerId: user.uid,
          farmerName: farmerInfo.name,
          createdAt: new Date().toISOString(),
        };
      });

      const productsRef = ref(db, `products`);
      for (const product of productsToSave) {
        const newProductRef = push(productsRef);
        await set(newProductRef, product);
      }

      setBillList([]);
      alert("Products saved successfully!");
    } catch (err) {
      console.error("Error saving products:", err.message);
      setError(err.message || "Failed to save products.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    language === "English"
      ? product.name.toLowerCase().includes(searchTerm.toLowerCase())
      : product.tamilName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categorizedBill = {
    Vegetables: billList.filter((item) => item.category === "Vegetables"),
    Fruits: billList.filter((item) => item.category === "Fruits"),
    Seeds: billList.filter((item) => item.category === "Seeds"),
    "Dairy Products": billList.filter((item) => item.category === "Dairy Products"),
    Herbs: billList.filter((item) => item.category === "Herbs"),
    Fertilizers: billList.filter((item) => item.category === "Fertilizers"),
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

  return (
    <motion.div
      className={`min-h-screen p-6 font-sans ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900"}`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <motion.header
        className="flex justify-between items-center mb-8 bg-gradient-to-r from-green-500 to-teal-500 p-4 rounded-2xl shadow-lg"
        variants={containerVariants}
      >
        <div className="flex items-center space-x-4">
          <motion.img
            src="https://i.pinimg.com/736x/a8/f4/6a/a8f46ad882c293af8c3fe011ce13bbb0.jpg"
            alt="Logo"
            className="w-12 h-12 rounded-full border-2 border-white"
            whileHover={{ scale: 1.1, rotate: 360 }}
          />
          <h1 className="text-2xl font-bold text-white">
            {language === "English" ? "Farmer's Market" : "விவசாய சந்தை"}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-white rounded-full hover:bg-gray-100"
            whileHover={{ scale: 1.1 }}
          >
            <Settings className="w-6 h-6 text-teal-600" />
          </motion.button>
          <motion.button className="p-2 bg-white rounded-full hover:bg-gray-100" whileHover={{ scale: 1.1 }}>
            <User className="w-6 h-6 text-green-600" />
          </motion.button>
          <motion.button
            onClick={() => navigate("/dashboard")}
            className="p-2 bg-white rounded-full hover:bg-gray-100"
            whileHover={{ scale: 1.1 }}
          >
            <LogOut className="w-6 h-6 text-red-600" />
          </motion.button>
        </div>
      </motion.header>

      {showSettings && (
        <motion.div
          className="absolute top-20 right-6 p-4 bg-white rounded-2xl shadow-xl z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-gray-800">{farmerInfo.name}</p>
              <p className="text-sm text-gray-600">{farmerInfo.email}</p>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-400"
            >
              <option value="English">English</option>
              <option value="Tamil">தமிழ்</option>
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
            placeholder={language === "English" ? "Search products..." : "தயாரிப்புகளைத் தேடு..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-teal-400 focus:outline-none"
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

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8" variants={containerVariants}>
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              onClick={() => toggleSelection(product)}
              className={`p-4 bg-white rounded-2xl shadow-md hover:shadow-xl cursor-pointer border-2 ${
                selectedProducts.some((p) => p.id === product.id) ? "border-teal-500" : "border-transparent"
              }`}
            >
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-3" />
              <h3 className="text-lg font-semibold text-teal-800">
                {language === "English" ? product.name : product.tamilName}
              </h3>
              <p className="text-sm text-gray-600">{product.weight}</p>
            </motion.div>
          ))}
        </motion.div>

        {selectedProducts.length > 0 && (
          <motion.button
            onClick={addToBill}
            className="w-full max-w-xs mx-auto block p-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 shadow-md"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {language === "English" ? "Add Products" : "பில் சேர்"}
          </motion.button>
        )}

        {billList.length > 0 && (
          <motion.div className="mt-8 p-6 bg-white rounded-2xl shadow-lg" variants={containerVariants}>
            <h2 className="text-2xl font-bold text-teal-800 mb-4">
              {language === "English" ? "Your Bill" : "உங்கள் பில்"}
            </h2>
            {Object.keys(categorizedBill).map((category) =>
              categorizedBill[category].length > 0 && (
                <div key={category} className="mb-6">
                  <h3 className="text-xl font-semibold text-teal-700">
                    {language === "English"
                      ? category
                      : {
                          Vegetables: "காய்கறிகள்",
                          Fruits: "பழங்கள்",
                          Seeds: "விதைகள்",
                          "Dairy Products": "பால் பொருட்கள்",
                          Herbs: "மூலிகைகள்",
                          Fertilizers: "உரங்கள்",
                        }[category]}
                  </h3>
                  {categorizedBill[category].map((item) => (
                    <motion.div
                      key={item.id}
                      className="flex items-center justify-between p-4 border-b border-gray-100"
                      variants={itemVariants}
                    >
                      <div className="flex items-center space-x-4">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                        <div>
                          <p className="font-medium text-teal-800">
                            {language === "English" ? item.name : item.tamilName}
                          </p>
                          <p className="text-sm text-gray-600">{item.weight}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          className="w-16 p-2 rounded-lg border border-gray-300 text-center"
                          min="1"
                        />
                        <input
                          type="number"
                          placeholder="Set Price"
                          value={item.customPrice}
                          onChange={(e) => updateCustomPrice(item.id, e.target.value)}
                          className="w-20 p-2 rounded-lg border border-gray-300 text-center"
                          min="0"
                        />
                        <p className="text-teal-700 font-medium">₹{item.finalPrice.toFixed(2)}</p>
                        <button onClick={() => removeItem(item.id)} className="text-red-600 hover:text-red-800">
                          ✕
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  <p className="text-right font-semibold text-teal-800 mt-2">
                    {language === "English" ? "Subtotal" : "துணை மொத்தம்"}: ₹{categorizedBill[category]
                      .reduce((sum, item) => sum + Number(item.finalPrice), 0)
                      .toFixed(2)}
                  </p>
                </div>
              )
            )}
            <p className="text-2xl font-bold text-teal-800 text-right">
              {language === "English" ? "Total" : "மொத்தம்"}: ₹{totalAmount.toFixed(2)}
            </p>
            <motion.button
              onClick={handleSaveProducts}
              disabled={loading}
              className={`mt-4 w-full py-3 ${loading ? "bg-gray-400" : "bg-teal-600"} text-white rounded-lg hover:bg-teal-700 shadow-md`}
              variants={itemVariants}
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
            >
              {loading
                ? (language === "English" ? "Saving..." : "சேமிக்கிறது...")
                : (language === "English" ? "Save to Products" : "தயாரிப்புகளாக சேமி")}
            </motion.button>
            {error && (
              <motion.p className="text-red-600 mt-2 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {error}
              </motion.p>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ProductSelection;