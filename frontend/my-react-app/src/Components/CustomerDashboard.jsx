import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaHome, FaShoppingCart, FaList, FaHeart, FaMapMarkerAlt, FaCreditCard, FaSignOutAlt, FaSearch, FaPlus, FaTrash, FaBars, FaMicrophone, FaStar } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db, auth } from '../firebase'; // Ensure this points to your initialized Firebase config
import { ref, onValue, set, remove, update, push } from 'firebase/database'; // Firebase Realtime Database methods

const CustomerDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');
  const [currentPage, setCurrentPage] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({ type: '', details: '' });
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [newPayment, setNewPayment] = useState({ type: '', value: '' });
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [filterBy, setFilterBy] = useState('all');
  const [isListening, setIsListening] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [customer, setCustomer] = useState({ name: 'Guest', email: '', phone: '', joined: '', address: 'Not set', photo: 'https://via.placeholder.com/150' });
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orderDetails, setOrderDetails] = useState({ address: '', paymentMethod: '' });

  const translations = {
    English: { home: 'Home', profile: 'Profile', orders: 'Orders', wishlist: 'Wishlist', address: 'Address', payment: 'Payment Methods', logout: 'Logout', addToCart: 'Add to Cart', placeOrder: 'Place Order', search: 'Search products...', saveToWishlist: 'Save to Wishlist', confirmOrder: 'Confirm Purchase' },
    Tamil: { home: 'முகப்பு', profile: 'சுயவிவரம்', orders: 'ஆர்டர்கள்', wishlist: 'விருப்பப்பட்டியல்', address: 'முகவரி', payment: 'பணம் செலுத்தும் முறைகள்', logout: 'வெளியேறு', addToCart: 'கார்ட்டில் சேர்', placeOrder: 'ஆர்டர் செய்', search: 'பொருட்களைத் தேடு...', saveToWishlist: 'விருப்பப்பட்டியலில் சேமி', confirmOrder: 'வாங்குதலை உறுதிப்படுத்து' },
    Hindi: { home: 'होम', profile: 'प्रोफाइल', orders: 'ऑर्डर', wishlist: 'विशलिस्ट', address: 'पता', payment: 'भुगतान के तरीके', logout: 'लॉगआउट', addToCart: 'कार्ट में जोड़ें', placeOrder: 'ऑर्डर करें', search: 'उत्पाद खोजें...', saveToWishlist: 'विशलिस्ट में सहेजें', confirmOrder: 'खरीद की पुष्टि करें' },
  };

  // Fetch data from Firebase
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      toast.error('Please log in to access the dashboard.');
      return;
    }

    const uid = user.uid;

    const customerRef = ref(db, `customerDetails/${uid}/profile`);
    onValue(customerRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCustomer({
          name: data.name || 'Guest',
          email: data.email || user.email,
          phone: data.phone || '+91 98765-43210',
          joined: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'Not available',
          address: data.address || 'Not set',
          photo: data.photo || 'https://via.placeholder.com/150',
        });
      } else {
        const defaultProfile = {
          name: user.displayName || 'Guest',
          email: user.email,
          phone: '+91 98765-43210',
          createdAt: new Date().toISOString(),
          address: 'Not set',
          photo: user.photoURL || 'https://via.placeholder.com/150',
        };
        set(customerRef, defaultProfile).then(() => setCustomer(defaultProfile));
      }
    }, (error) => {
      console.error('Error fetching customer profile:', error);
      toast.error('Failed to fetch profile.');
    });

    const productsRef = ref(db, 'products');
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const productsArray = [];
        Object.keys(data).forEach((farmerId) => {
          const farmerProducts = data[farmerId];
          Object.keys(farmerProducts).forEach((productId) => {
            const product = farmerProducts[productId];
            productsArray.push({
              id: productId,
              farmerId,
              name: product.name || 'Unnamed Product',
              tamilName: product.tamilName || product.name,
              hindiName: product.hindiName || product.name,
              price: parseFloat(product.price) || 0,
              quantity: product.quantity || 0,
              category: product.category || 'Uncategorized',
              image: product.image || 'https://via.placeholder.com/150',
              farmerName: product.farmerName || 'Unknown Farmer',
              createdAt: product.createdAt || new Date().toISOString(),
              rating: product.rating || 4,
              images: [product.image || 'https://via.placeholder.com/150'],
            });
          });
        });
        setProducts(productsArray);
      } else {
        console.warn('No products found in the database.');
        toast.warn('No products available.');
        setProducts([]);
      }
    }, (error) => {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products.');
    });

    const wishlistRef = ref(db, `customerDetails/${uid}/wishlist`);
    onValue(wishlistRef, (snapshot) => {
      const data = snapshot.val();
      setWishlist(data ? Object.values(data) : []);
    }, (error) => {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to fetch wishlist.');
    });

    const addressesRef = ref(db, `customerDetails/${uid}/addresses`);
    onValue(addressesRef, (snapshot) => {
      const data = snapshot.val();
      setAddresses(data ? Object.values(data) : []);
    }, (error) => {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to fetch addresses.');
    });

    const paymentMethodsRef = ref(db, `customerDetails/${uid}/paymentMethods`);
    onValue(paymentMethodsRef, (snapshot) => {
      const data = snapshot.val();
      setPaymentMethods(data ? Object.values(data) : []);
    }, (error) => {
      console.error('Error fetching payment methods:', error);
      toast.error('Failed to fetch payment methods.');
    });

    const ordersRef = ref(db, `orders`);
    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userOrders = Object.entries(data)
          .filter(([key]) => key.startsWith(`order_${uid}_`))
          .map(([_, order]) => order);
        setOrders(userOrders);
      } else {
        setOrders([]);
      }
    }, (error) => {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders.');
    });

    const cartRef = ref(db, `customerDetails/${uid}/cart`);
    onValue(cartRef, (snapshot) => {
      const data = snapshot.val();
      setCart(data ? Object.entries(data).map(([key, value]) => ({ ...value, cartId: key })) : []);
    }, (error) => {
      console.error('Error fetching cart:', error);
      toast.error('Failed to fetch cart.');
    });
  }, []);

  // Voice recognition setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = language === 'English' ? 'en-US' : language === 'Tamil' ? 'ta-IN' : 'hi-IN';

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase().trim();
      if (command.includes('home')) setCurrentPage('home');
      else if (command.includes('profile')) setCurrentPage('profile');
      else if (command.includes('orders')) setCurrentPage('orders');
      else if (command.includes('wishlist')) setCurrentPage('wishlist');
      else if (command.includes('address')) setCurrentPage('address');
      else if (command.includes('payment')) setCurrentPage('payment');
      else if (command.includes('cart')) setCurrentPage('cart');
      else if (command.includes('logout')) toast.info('Logged out');
      else {
        const matchedProduct = products.find((product) =>
          [product.name, product.tamilName].some((name) => name.toLowerCase().includes(command))
        );
        if (matchedProduct) {
          setSelectedProduct(matchedProduct);
          setCurrentPage('productDetails');
          toast.success(`Viewing "${matchedProduct.name}" via voice!`);
        } else {
          setSearchQuery(command);
          setCurrentPage('home');
          toast.info(`Searching for: "${command}"`);
        }
      }
      setIsListening(false);
    };
    recognition.onerror = () => {
      toast.error('Voice recognition failed.');
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);

    const voiceButton = document.querySelector('.voice-btn');
    const handleVoiceButtonClick = () => recognition.start();
    if (voiceButton) voiceButton.addEventListener('click', handleVoiceButtonClick);

    return () => {
      if (voiceButton) voiceButton.removeEventListener('click', handleVoiceButtonClick);
    };
  }, [language, products]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleNav = () => setIsNavOpen(!isNavOpen);

  const toggleSelection = (product) => {
    setSelectedProducts((prev) => {
      const isSelected = prev.some((p) => p.id === product.id);
      return isSelected ? prev.filter((p) => p.id !== product.id) : [...prev, { ...product, qty: 1 }];
    });
  };

  const addToCart = (product, qty = 1) => {
    const uid = auth.currentUser?.uid;
    console.log("Adding to cart. UID:", uid, "Product:", product.name);
    if (!uid) {
      toast.error("Please log in to add items to cart.");
      return;
    }

    const cartRef = ref(db, `customerDetails/${uid}/cart`);
    const newCartItemRef = push(cartRef); // Generate a unique push ID
    const cartItem = { ...product, qty, cartId: newCartItemRef.key };
    set(newCartItemRef, cartItem)
      .then(() => toast.success(`${product.name} added to cart!`))
      .catch((error) => toast.error('Failed to add to cart: ' + error.message));
  };

  const updateCartItem = (cartId, qty) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const cartRef = ref(db, `customerDetails/${uid}/cart/${cartId}`);
    update(cartRef, { qty: Math.max(1, qty) })
      .catch((error) => toast.error('Failed to update cart: ' + error.message));
  };

  const removeCartItem = (cartId) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const cartRef = ref(db, `customerDetails/${uid}/cart/${cartId}`);
    remove(cartRef)
      .then(() => toast.info('Item removed from cart.'))
      .catch((error) => toast.error('Failed to remove from cart: ' + error.message));
  };

  const addAddress = () => {
    const uid = auth.currentUser?.uid;
    if (!uid || !newAddress.type || !newAddress.details) {
      toast.warn('Please fill in all address fields');
      return;
    }

    const addressId = Date.now();
    const addressRef = ref(db, `customerDetails/${uid}/addresses/${addressId}`);
    const newAddr = { id: addressId, ...newAddress };
    set(addressRef, newAddr)
      .then(() => {
        setNewAddress({ type: '', details: '' });
        toast.success('Address added');
      })
      .catch((error) => toast.error('Failed to add address: ' + error.message));
  };

  const removeAddress = (id) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const addressRef = ref(db, `customerDetails/${uid}/addresses/${id}`);
    remove(addressRef)
      .catch((error) => toast.error('Failed to remove address: ' + error.message));
  };

  const addPaymentMethod = () => {
    const uid = auth.currentUser?.uid;
    if (!uid || !newPayment.type || !newPayment.value) {
      toast.warn('Please fill in all payment fields');
      return;
    }

    const paymentId = Date.now();
    const paymentRef = ref(db, `customerDetails/${uid}/paymentMethods/${paymentId}`);
    const newPM = { id: paymentId, ...newPayment };
    set(paymentRef, newPM)
      .then(() => {
        setNewPayment({ type: '', value: '' });
        toast.success('Payment method added');
      })
      .catch((error) => toast.error('Failed to add payment method: ' + error.message));
  };

  const removePaymentMethod = (id) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const paymentRef = ref(db, `customerDetails/${uid}/paymentMethods/${id}`);
    remove(paymentRef)
      .catch((error) => toast.error('Failed to remove payment method: ' + error.message));
  };

  const addToWishlist = (product) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const wishlistRef = ref(db, `customerDetails/${uid}/wishlist/${product.id}`);
    set(wishlistRef, product)
      .then(() => toast.success(`${product.name} saved to wishlist!`))
      .catch((error) => toast.error('Failed to add to wishlist: ' + error.message));
  };

  const removeFromWishlist = (id) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const wishlistRef = ref(db, `customerDetails/${uid}/wishlist/${id}`);
    remove(wishlistRef)
      .then(() => toast.info('Item removed from wishlist.'))
      .catch((error) => toast.error('Failed to remove from wishlist: ' + error.message));
  };

  const placeOrder = () => {
    if (cart.length === 0) {
      toast.warn('Your cart is empty.');
      return;
    }
    setCurrentPage('orderConfirmation');
  };

  const confirmOrder = () => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      toast.error('User not authenticated. Please log in.');
      return;
    }
    if (!orderDetails.address || !orderDetails.paymentMethod) {
      toast.warn('Please select an address and payment method.');
      return;
    }

    const orderId = Date.now();
    const orderDate = new Date().toISOString();
    const ordersRef = ref(db, `orders/order_${uid}_${orderId}`);

    const selectedAddress = addresses.find((addr) => addr.id === parseInt(orderDetails.address));
    const selectedPaymentMethod = paymentMethods.find((pm) => pm.id === parseInt(orderDetails.paymentMethod));

    if (!selectedAddress || !selectedPaymentMethod) {
      toast.error('Invalid address or payment method selected.');
      return;
    }

    const order = {
      orderId: `order_${uid}_${orderId}`,
      orderDateTime: orderDate,
      customerId: uid,
      customerName: customer.name,
      products: cart.map((item) => ({
        productName: item.name,
        productId: item.id,
        farmerId: item.farmerId,
        quantity: item.qty,
        price: item.price,
        totalPrice: item.qty * item.price,
      })),
      totalAmount: totalAmount,
      paymentMethod: {
        type: selectedPaymentMethod.type,
        value: selectedPaymentMethod.value,
      },
      address: {
        type: selectedAddress.type,
        details: selectedAddress.details,
      },
      status: 'Pending', // Initial status
    };

    set(ordersRef, order)
      .then(() => {
        const cartRef = ref(db, `customerDetails/${uid}/cart`);
        return remove(cartRef); // Clear the cart in Firebase
      })
      .then(() => {
        setCart([]); // Clear local cart state
        setOrderDetails({ address: '', paymentMethod: '' }); // Reset order details
        setCurrentPage('orders'); // Switch to orders page
        toast.success('Order placed successfully!');
      })
      .catch((error) => {
        console.error('Error placing order:', error);
        toast.error('Failed toэ place order: ' + error.message);
      });
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  const sortedAndFilteredProducts = () => {
    let filteredProducts = [...products];
    if (filterBy !== 'all') filteredProducts = filteredProducts.filter((product) => product.category === filterBy);
    switch (sortBy) {
      case 'lowToHigh': return filteredProducts.sort((a, b) => a.price - b.price);
      case 'highToLow': return filteredProducts.sort((a, b) => b.price - a.price);
      case 'featured': return filteredProducts.sort(() => Math.random() - 0.5);
      case 'rating': return filteredProducts.sort((a, b) => b.rating - a.rating);
      default: return filteredProducts;
    }
  };

  const ProductDetails = ({ product }) => {
    const [selectedImage, setSelectedImage] = useState(product.images[0]);
    const [quantity, setQuantity] = useState(1);

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="p-4 sm:p-6 md:p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl mx-auto"
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center">
            <img src={selectedImage} alt={product.name} className="w-64 h-64 object-cover rounded-lg mb-4" />
            <div className="flex space-x-2">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  className={`w-16 h-16 object-cover rounded-md cursor-pointer ${selectedImage === img ? 'border-2 border-teal-400' : ''}`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-teal-300">{language === 'English' ? product.name : language === 'Tamil' ? product.tamilName : product.hindiName}</h1>
            <p className="text-xl text-teal-600 dark:text-teal-400 mt-2">₹{product.price.toFixed(2)}</p>
            <p className="text-gray-600 dark:text-gray-400">Sold by: {product.farmerName} (ID: {product.farmerId})</p>
            <div className="flex items-center mt-2">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'} />
              ))}
              <span className="ml-2 text-gray-600 dark:text-gray-400">({product.rating}/5)</span>
            </div>
            <div className="mt-4">
              <p className="text-gray-800 dark:text-gray-200 font-semibold">Quantity:</p>
              <div className="flex space-x-2 mt-2">
                {[1, 2, 3].map((kg) => (
                  <button
                    key={kg}
                    onClick={() => setQuantity(kg)}
                    className={`p-2 rounded-lg ${quantity === kg ? 'bg-teal-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'} hover:bg-teal-400 transition-colors`}
                  >
                    {kg} kg
                  </button>
                ))}
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-center bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                />
              </div>
            </div>
            <div className="mt-6 flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addToCart(product, quantity)}
                className="p-3 bg-gradient-to-r from-teal-500 to-indigo-500 text-white rounded-lg shadow-lg"
              >
                {translations[language].addToCart}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addToWishlist(product)}
                className="p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg shadow-lg"
              >
                {translations[language].saveToWishlist}
              </motion.button>
            </div>
          </div>
        </div>
        <div className="mt-8 space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-teal-300">About the Product</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Freshly harvested {product.name} by {product.farmerName}.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-teal-300">Farmer Details</h2>
            <ul className="text-gray-600 dark:text-gray-400 mt-2 space-y-1">
              <li><strong>Name:</strong> {product.farmerName}</li>
              <li><strong>Farmer ID:</strong> {product.farmerId}</li>
              <li><strong>Added On:</strong> {new Date(product.createdAt).toLocaleString()}</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-teal-300">Ratings and Reviews</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Average Rating: {product.rating}/5</p>
            <button className="mt-2 text-teal-600 dark:text-teal-400 hover:underline">Write a Review</button>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-teal-300">Similar Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {sortedAndFilteredProducts()
                .filter((p) => p.category === product.category && p.id !== product.id)
                .slice(0, 3)
                .map((similarProduct) => (
                  <div
                    key={similarProduct.id}
                    onClick={() => setSelectedProduct(similarProduct)}
                    className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg cursor-pointer hover:border-teal-400 border-2 border-transparent transition-all"
                  >
                    <img src={similarProduct.image} alt={similarProduct.name} className="w-full h-24 object-cover rounded-md mb-2" />
                    <p className="text-gray-800 dark:text-teal-300">{similarProduct.name}</p>
                    <p className="text-teal-600 dark:text-teal-400">₹{similarProduct.price.toFixed(2)}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const OrderConfirmation = () => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl bg-white dark:bg-gray-900 w-full max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-teal-500 dark:from-indigo-400 dark:to-teal-300">
        Order Confirmation
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-teal-300">Items in Cart</h3>
          {cart.map((item) => (
            <div key={item.cartId} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-4">
              <div className="flex items-center space-x-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md" />
                <div>
                  <p className="text-gray-800 dark:text-teal-300 font-semibold">{item.name}</p>
                  <p className="text-gray-600 dark:text-gray-400">By: {item.farmerName}</p>
                </div>
              </div>
              <p className="text-teal-600 dark:text-teal-400 font-medium">₹{(item.qty * item.price).toFixed(2)}</p>
            </div>
          ))}
          <p className="text-xl font-bold text-gray-800 dark:text-teal-300 text-right">Total: ₹{totalAmount.toFixed(2)}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-teal-300">Shipping Address</h3>
          <select
            value={orderDetails.address}
            onChange={(e) => setOrderDetails({ ...orderDetails, address: e.target.value })}
            className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-400 mt-2"
          >
            <option value="">Select Address</option>
            {addresses.map((addr) => (
              <option key={addr.id} value={addr.id}>{`${addr.type}: ${addr.details}`}</option>
            ))}
          </select>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-teal-300">Payment Method</h3>
          <select
            value={orderDetails.paymentMethod}
            onChange={(e) => setOrderDetails({ ...orderDetails, paymentMethod: e.target.value })}
            className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-400 mt-2"
          >
            <option value="">Select Payment Method</option>
            {paymentMethods.map((pm) => (
              <option key={pm.id} value={pm.id}>{`${pm.type}: ${pm.value}`}</option>
            ))}
          </select>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={confirmOrder}
          className="w-full p-4 bg-gradient-to-r from-teal-500 to-indigo-500 text-white rounded-lg shadow-2xl"
        >
          {translations[language].confirmOrder}
        </motion.button>
      </div>
    </motion.div>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="p-4 sm:p-6 md:p-8 rounded-2xl bg-white dark:bg-gray-900 shadow-2xl w-full max-w-7xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-teal-500 dark:from-indigo-400 dark:to-teal-300">
              Explore Products
            </h2>
            <div className="flex flex-col sm:flex-row items-center mb-8 space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center w-full sm:w-auto">
                <FaSearch className="text-gray-500 dark:text-gray-300 mr-2" />
                <input
                  type="text"
                  placeholder={translations[language].search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-72 p-3 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-400"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-48 p-3 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-400"
              >
                <option value="relevance">Relevance</option>
                <option value="lowToHigh">Low to High Price</option>
                <option value="highToLow">High to Low Price</option>
                <option value="featured">Featured</option>
                <option value="rating">Customer Rating</option>
              </select>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="w-full sm:w-48 p-3 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-400"
              >
                <option value="all">All Categories</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
              </select>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`voice-btn p-3 rounded-full bg-gradient-to-r from-indigo-500 to-teal-500 text-white shadow-lg ${isListening ? 'animate-pulse' : ''}`}
              >
                <FaMicrophone />
              </motion.button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full min-h-[60vh]">
              {products.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">No products available.</p>
              ) : (
                sortedAndFilteredProducts()
                  .filter((product) =>
                    language === 'English'
                      ? product.name.toLowerCase().includes(searchQuery.toLowerCase())
                      : language === 'Tamil'
                      ? product.tamilName.toLowerCase().includes(searchQuery.toLowerCase())
                      : product.hindiName.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((product) => (
                    <div
                      key={product.id}
                      className={`p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg cursor-pointer border-2 hover:border-teal-400 transition-all ${
                        selectedProducts.some((p) => p.id === product.id) ? 'border-teal-400' : 'border-transparent'
                      }`}
                      onClick={() => setSelectedProduct(product) || setCurrentPage('productDetails')}
                    >
                      <img src={product.image} alt={product.name} className="w-full h-32 sm:h-40 object-cover rounded-md mb-4" />
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-teal-300">
                        {language === 'English' ? product.name : language === 'Tamil' ? product.tamilName : product.hindiName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">By: {product.farmerName}</p>
                      <p className="text-teal-600 dark:text-teal-400 font-medium">₹{product.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">Rating: {product.rating}/5</p>
                    </div>
                  ))
              )}
            </div>
            {selectedProducts.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  selectedProducts.forEach((p) => addToCart(p));
                  setSelectedProducts([]);
                }}
                className="mt-8 w-full sm:w-72 mx-auto block p-4 bg-gradient-to-r from-teal-500 to-indigo-500 text-white rounded-lg shadow-2xl"
              >
                {translations[language].addToCart}
              </motion.button>
            )}
          </motion.div>
        );
      case 'productDetails':
        return selectedProduct ? <ProductDetails product={selectedProduct} /> : null;
      case 'profile':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl bg-white dark:bg-gray-900 max-w-md mx-auto"
          >
            <div className="flex flex-col items-center space-y-6">
              <motion.img src={customer.photo} alt="Profile" className="w-28 h-28 rounded-full shadow-xl border-4 border-teal-400" whileHover={{ scale: 1.15 }} />
              <div className="text-center">
                <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-teal-500 dark:from-indigo-400 dark:to-teal-300">
                  {customer.name}
                </h2>
                <div className="mt-4 space-y-3 text-gray-700 dark:text-gray-200">
                  <p>{customer.phone}</p>
                  <p>{customer.email}</p>
                  <p>{customer.address}</p>
                  <p>Joined: {customer.joined}</p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 'orders':
        return (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl bg-white dark:bg-gray-900 w-full max-w-4xl mx-auto"
          >
            <h2 className="text-2xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-teal-500 dark:from-indigo-400 dark:to-teal-300">
              {translations[language].orders}
            </h2>
            <div className="space-y-6">
              {orders.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">No orders yet.</p>
              ) : (
                orders.map((order) => (
                  <motion.div key={order.orderId} whileHover={{ scale: 1.05 }} className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                    <p className="text-gray-800 dark:text-teal-300 font-semibold">{order.products.map((p) => p.productName).join(', ')}</p>
                    <p className="text-gray-600 dark:text-gray-400">Total: ₹{order.totalAmount.toFixed(2)}</p>
                    <p className="text-gray-600 dark:text-gray-400">Status: {order.status}</p>
                    <p className="text-gray-600 dark:text-gray-400">Date: {new Date(order.orderDateTime).toLocaleString()}</p>
                    <p className="text-gray-600 dark:text-gray-400">Address: {order.address.type} - {order.address.details}</p>
                    <p className="text-gray-600 dark:text-gray-400">Payment: {order.paymentMethod.type} - {order.paymentMethod.value}</p>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        );
      case 'wishlist':
        return (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl bg-white dark:bg-gray-900 w-full max-w-4xl mx-auto"
          >
            <h2 className="text-2xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-teal-500 dark:from-indigo-400 dark:to-teal-300">
              {translations[language].wishlist}
            </h2>
            {wishlist.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">Your wishlist is empty.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {wishlist.map((item) => (
                  <div key={item.id} className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex justify-between items-center">
                    <div>
                      <p className="text-gray-800 dark:text-teal-300 font-semibold">{item.name}</p>
                      <p className="text-teal-600 dark:text-teal-400">₹{item.price.toFixed(2)}</p>
                    </div>
                    <button onClick={() => removeFromWishlist(item.id)} className="text-red-500 hover:text-red-700">
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        );
      case 'address':
        return (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl bg-white dark:bg-gray-900 max-w-md mx-auto"
          >
            <h2 className="text-2xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-teal-500 dark:from-indigo-400 dark:to-teal-300">
              {translations[language].address}
            </h2>
            <div className="space-y-6 mb-8">
              {addresses.map((addr) => (
                <div key={addr.id} className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                  <div>
                    <p className="text-gray-800 dark:text-teal-300 font-semibold">{addr.type}</p>
                    <p className="text-gray-600 dark:text-gray-400">{addr.details}</p>
                  </div>
                  <button onClick={() => removeAddress(addr.id)} className="text-red-500 hover:text-red-700">
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Address Type"
                value={newAddress.type}
                onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-400"
              />
              <input
                type="text"
                placeholder="Address Details"
                value={newAddress.details}
                onChange={(e) => setNewAddress({ ...newAddress, details: e.target.value })}
                className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-400"
              />
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={addAddress} className="w-full p-3 bg-gradient-to-r from-teal-500 to-indigo-500 text-white rounded-lg shadow-2xl">
                <FaPlus className="mr-2 inline" /> Add Address
              </motion.button>
            </div>
          </motion.div>
        );
      case 'payment':
        return (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl bg-white dark:bg-gray-900 max-w-md mx-auto"
          >
            <h2 className="text-2xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-teal-500 dark:from-indigo-400 dark:to-teal-300">
              {translations[language].payment}
            </h2>
            <div className="space-y-6 mb-8">
              {paymentMethods.map((pm) => (
                <div key={pm.id} className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                  <div>
                    <p className="text-gray-800 dark:text-teal-300 font-semibold">{pm.type}</p>
                    <p className="text-gray-600 dark:text-gray-400">{pm.value}</p>
                  </div>
                  <button onClick={() => removePaymentMethod(pm.id)} className="text-red-500 hover:text-red-700">
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <select
                value={newPayment.type}
                onChange={(e) => setNewPayment({ ...newPayment, type: e.target.value })}
                className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-400"
              >
                <option value="">Select Payment Type</option>
                <option value="UPI">UPI</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
              </select>
              <input
                type="text"
                placeholder="Payment Details"
                value={newPayment.value}
                onChange={(e) => setNewPayment({ ...newPayment, value: e.target.value })}
                className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-400"
              />
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={addPaymentMethod} className="w-full p-3 bg-gradient-to-r from-teal-500 to-indigo-500 text-white rounded-lg shadow-2xl">
                <FaPlus className="mr-2 inline" /> Add Payment Method
              </motion.button>
            </div>
          </motion.div>
        );
      case 'cart':
        return (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl bg-white dark:bg-gray-900 w-full max-w-4xl mx-auto"
          >
            <h2 className="text-2xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-teal-500 dark:from-indigo-400 dark:to-teal-300">
              Your Cart
            </h2>
            {cart.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">Your cart is empty.</p>
            ) : (
              <>
                {cart.map((item) => (
                  <motion.div key={item.cartId} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-6">
                    <div className="flex items-center space-x-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md" />
                      <div>
                        <p className="text-gray-800 dark:text-teal-300 font-semibold">
                          {language === 'English' ? item.name : language === 'Tamil' ? item.tamilName : item.hindiName}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">By: {item.farmerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) => updateCartItem(item.cartId, parseInt(e.target.value) || 1)}
                        className="w-16 p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-center bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                        min="1"
                      />
                      <p className="text-teal-600 dark:text-teal-400 font-medium">₹{(item.qty * item.price).toFixed(2)}</p>
                      <button onClick={() => removeCartItem(item.cartId)} className="text-red-500 hover:text-red-700">
                        <FaTrash />
                      </button>
                    </div>
                  </motion.div>
                ))}
                <p className="text-2xl font-bold text-gray-800 dark:text-teal-300 text-right mt-6">Total: ₹{totalAmount.toFixed(2)}</p>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={placeOrder}
                  className="mt-8 w-full sm:w-72 mx-auto block py-4 bg-gradient-to-r from-teal-500 to-indigo-500 text-white rounded-lg shadow-2xl"
                >
                  {translations[language].placeOrder}
                </motion.button>
              </>
            )}
          </motion.div>
        );
      case 'orderConfirmation':
        return <OrderConfirmation />;
      default:
        return <p className="text-gray-600 dark:text-gray-400">Loading...</p>;
    }
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-all duration-500`}>
      <ToastContainer />
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-700 to-teal-600 dark:from-indigo-800 dark:to-teal-700 text-white p-4 shadow-2xl"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
            FarmFresh - {customer.name}
          </div>
          <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={toggleNav} className="sm:hidden text-2xl">
            <FaBars />
          </motion.button>
          <AnimatePresence>
            {isNavOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-16 left-0 right-0 bg-gradient-to-r from-indigo-700 to-teal-600 dark:from-indigo-800 dark:to-teal-700 p-4 sm:hidden shadow-lg rounded-b-xl"
              >
                <div className="space-y-4">
                  {[
                    { icon: <FaHome />, label: translations[language].home, page: 'home' },
                    { icon: <FaUser />, label: translations[language].profile, page: 'profile' },
                    { icon: <FaList />, label: translations[language].orders, page: 'orders' },
                    { icon: <FaHeart />, label: translations[language].wishlist, page: 'wishlist' },
                    { icon: <FaMapMarkerAlt />, label: translations[language].address, page: 'address' },
                    { icon: <FaCreditCard />, label: translations[language].payment, page: 'payment' },
                    { icon: <FaSignOutAlt />, label: translations[language].logout, page: 'logout' },
                  ].map((item) => (
                    <motion.button
                      key={item.page}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full text-left p-3 rounded-lg flex items-center"
                      onClick={() => {
                        if (item.page === 'logout') {
                          auth.signOut().then(() => toast.info('Logged out'));
                        } else {
                          setCurrentPage(item.page);
                        }
                        setIsNavOpen(false);
                      }}
                    >
                      {item.icon} <span className="ml-3">{item.label}</span>
                    </motion.button>
                  ))}
                </div>
                <div className="mt-6">
                  <select
                    className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="English">English</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={toggleDarkMode} className="w-full mt-4 p-3 rounded-lg bg-gradient-to-r from-teal-500 to-indigo-500 text-white">
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="hidden sm:flex items-center space-x-4">
            {[
              { icon: <FaHome />, label: translations[language].home, page: 'home' },
              { icon: <FaUser />, label: translations[language].profile, page: 'profile' },
              { icon: <FaList />, label: translations[language].orders, page: 'orders' },
              { icon: <FaHeart />, label: translations[language].wishlist, page: 'wishlist' },
              { icon: <FaMapMarkerAlt />, label: translations[language].address, page: 'address' },
              { icon: <FaCreditCard />, label: translations[language].payment, page: 'payment' },
              { icon: <FaSignOutAlt />, label: translations[language].logout, page: 'logout' },
            ].map((item) => (
              <motion.button
                key={item.page}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg flex items-center"
                onClick={() => {
                  if (item.page === 'logout') {
                    auth.signOut().then(() => toast.info('Logged out'));
                  } else {
                    setCurrentPage(item.page);
                  }
                }}
              >
                {item.icon} <span className="ml-2">{item.label}</span>
              </motion.button>
            ))}
            <select
              className="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="English">EN</option>
              <option value="Tamil">TA</option>
              <option value="Hindi">HI</option>
            </select>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={toggleDarkMode} className="p-2 rounded-lg bg-gradient-to-r from-teal-500 to-indigo-500 text-white">
              {darkMode ? 'Light' : 'Dark'}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <div className="flex-1 pt-24 pb-8 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full">
        {renderPage()}
      </div>

      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="bg-gradient-to-r from-indigo-700 to-teal-600 dark:from-indigo-800 dark:to-teal-700 text-white p-4 text-center shadow-2xl"
      >
        <p>© 2025 FarmFresh. All rights reserved.</p>
        <p className="text-sm mt-2">Freshness delivered from farm to table.</p>
      </motion.footer>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed top-20 right-6 bg-gradient-to-r from-teal-500 to-indigo-500 text-white p-4 rounded-full shadow-2xl flex items-center z-40"
        onClick={() => setCurrentPage('cart')}
      >
        <FaShoppingCart className="text-xl" />
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
            {cart.length}
          </span>
        )}
      </motion.button>
    </div>
  );
};

export default CustomerDashboard;