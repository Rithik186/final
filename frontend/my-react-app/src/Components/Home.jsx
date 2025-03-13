import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';

// Dashboard Component
const Dashboard = () => (
  <div className="h-[100vh] bg-gradient-to-br from-white to-gray-50 flex items-center justify-center p-6">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center"
    >
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
        Welcome to Your Dashboard
      </h1>
      <p className="text-gray-600 text-lg leading-relaxed">
        Your personalized space to manage farm-to-table connections.
      </p>
    </motion.div>
  </div>
);

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // State to manage the current background image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array of background image URLs
  const backgroundImages = [
    'homebackground.jpg',
    'back2.jpg',
    'back3.jpg',
    'back4.jpg',
  ];

  // Effect to cycle or set a random image on mount
  useEffect(() => {
    // Option 1: Set a random image on page load
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    setCurrentImageIndex(randomIndex);

    // Option 2: Cycle images every 5 seconds (uncomment to enable)
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
       );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0,
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 120,
        damping: 20
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        delay: i * 0.2,
        ease: 'easeOut'
      }
    })
  };

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Technology', href: '#farmers' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const section = document.querySelector(href);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white text-gray-900 antialiased font-sans">
      {/* Header */}
      <motion.header 
        className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-lg shadow-lg border-b border-gray-100/50"
        initial="hidden"
        animate="visible"
        variants={headerVariants}
      >
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="flex items-center gap-3">
            <span className="text-3xl text-emerald-600">🌾</span>
            <span className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Farm2Consumer</span>
          </a>
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:text-emerald-600 transition-colors duration-200"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
            <div className={`md:flex ${isMenuOpen ? 'block' : 'hidden'} absolute md:static top-16 right-6 md:right-auto bg-white md:bg-transparent shadow-xl md:shadow-none rounded-xl md:rounded-none p-6 md:p-0`}>
              <div className="flex flex-col md:flex-row md:space-x-8">
                {navItems.map((item) => (
                  <a 
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="py-2 px-4 text-gray-700 text-lg font-semibold hover:text-emerald-600 transition-colors duration-200 hover:bg-emerald-50 md:hover:bg-transparent rounded-lg"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Hero Section with Multiple Background Images */}
      <section 
        id="home" 
        className="h-[100vh] flex items-center justify-center px-6 relative overflow-hidden bg-gradient-to-b from-white to-[#F5F5F5]"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${backgroundImages[currentImageIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        
        <div className="text-center max-w-5xl relative z-10">
          <motion.h1 
            className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-white drop-shadow-lg"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            Fresh from{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
              Farm
            </span>{' '}
            to Table
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-gray-100 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          >
            Empowering local farmers with a blockchain-based platform for direct consumer connections and maximum profit.
          </motion.p>
          <Link to="/login">
            <motion.button 
              className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-12 py-4 rounded-lg font-semibold text-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-2xl hover:shadow-xl transform hover:-translate-y-1"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Get Started
            </motion.button>
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-emerald-900/40 to-transparent"></div>
      </section>

      {/* Services Section */}
      <section id="services" className="h-[100vh] flex items-center justify-center px-6 bg-gradient-to-b from-[#F5F5F5] to-[#ECEFF1]">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-10 text-gray-900 tracking-tight drop-shadow-sm">
            Our Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              { icon: '🌿', title: 'Organic Farming', desc: 'Pure, pesticide-free produce' },
              { icon: '🚜', title: 'Direct Sourcing', desc: 'From farm to your table' },
              { icon: '🔒', title: 'Blockchain Tracking', desc: 'Transparent supply chain' },
              { icon: '🛒', title: 'Easy Ordering', desc: 'Shop with convenience' },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white p-20 h-80 w-80 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-100/50 hover:border-emerald-200 transform hover:-translate-y-2 cursor-pointer group"
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="flex justify-center mb-4">
                  <div className="text-4xl md:text-5xl text-emerald-500 transition-all duration-300 group-hover:scale-110">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="h-[100vh] flex items-center justify-center px-6 bg-gradient-to-b from-[#ECEFF1] to-[#E0E7FF] relative overflow-hidden">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center max-w-7xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-2 md:order-1"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 tracking-tight text-center md:text-left">
              About Us
            </h2>
            <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-8 text-justify">
              At Farm2Consumer, we are passionate about revolutionizing the agricultural supply chain. Our blockchain-based platform connects local farmers directly with consumers, ensuring transparency, trust, and maximum profit for farmers. By eliminating intermediaries, we empower farmers to earn fair prices while delivering fresh, high-quality produce to your table. Join us in supporting sustainable farming and building stronger communities.
            </p>
            <div className="text-center md:text-left">
              <motion.button
                className="bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-1 md:order-2"
          >
            <img 
              src="https://media.istockphoto.com/id/543212762/photo/tractor-cultivating-field-at-spring.jpg?s=612x612&w=0&k=20&c=uJDy7MECNZeHDKfUrLNeQuT7A1IqQe89lmLREhjIJYU=" 
              alt="Farm" 
              className="w-full h-80 md:h-[450px] object-cover rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300"
            />
          </motion.div>
        </div>
        <motion.div
          className="absolute top-20 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          transition={{ duration: 1 }}
        />
      </section>

      {/* Technology Section */}
      <section id="farmers" className="h-[100vh] flex items-center justify-center px-6 bg-gradient-to-b from-[#E0E7FF] to-[#F5F5DC]">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-10 text-gray-900 tracking-tight drop-shadow-sm">
            Our Technology
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { 
                name: 'Blockchain', 
                desc: 'Secure, transparent transactions for trust.',
                icon: 'https://img.freepik.com/premium-vector/blockchain-line-icon-logo-concept-dark-background_516670-196.jpg?semt=ais_hybrid'
              },
              { 
                name: 'Farmer Profit', 
                desc: 'Maximizes earnings for local farmers.',
                icon: 'https://cdn-icons-png.flaticon.com/512/10870/10870773.png'
              },
              { 
                name: 'Direct Connection', 
                desc: 'Links farmers and consumers directly.',
                icon: 'https://cdn-icons-png.flaticon.com/512/194/194279.png'
              },
              { 
                name: 'Easy Marketplace', 
                desc: 'Simple buying and selling platform.',
                icon: 'https://cdn-icons-png.flaticon.com/512/13799/13799176.png'
              },
            ].map((tech, index) => (
              <motion.div
                key={tech.name}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-100/50 hover:border-emerald-200 transform hover:-translate-y-2 cursor-pointer group"
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="flex justify-center mb-4">
                  <img 
                    src={tech.icon} 
                    alt={tech.name} 
                    className="w-16 h-16 rounded-full object-contain bg-emerald-50 p-2 shadow-md transition-all duration-300 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">
                  {tech.name}
                </h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                  {tech.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="h-[100vh] flex items-center justify-center px-6 bg-gradient-to-b from-[#F5F5DC] to-[#F0F4F8] relative overflow-hidden">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-10 text-gray-900 tracking-tight drop-shadow-sm">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { quote: 'Fresh produce like never before! The quality is unmatched.', name: 'Voice Based Purchase' },
              { quote: 'Love the transparency with blockchain! It’s a game-changer.', name: 'Multi Language Support' },
              { quote: 'The best way to support farmers while eating healthy!', name: 'Surf Across Various Farmers' },
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100/50 hover:border-emerald-200 transition-all duration-300"
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <p className="text-gray-600 text-lg leading-relaxed mb-4">"{testimonial.quote}"</p>
                <p className="text-gray-900 font-semibold text-lg">{testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="h-[100vh] flex items-center justify-center px-6 bg-gradient-to-b from-[#F0F4F8] to-[#EDE7F6]">
        <div className="container mx-auto max-w-lg text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-10 text-gray-900 tracking-tight drop-shadow-sm">
            Contact Us
          </h2>
          <motion.form
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <input 
              type="text" 
              placeholder="Your Name" 
              className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 bg-gray-50 text-gray-900 placeholder-gray-500"
              required
            />
            <input 
              type="email" 
              placeholder="Your Email" 
              className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 bg-gray-50 text-gray-900 placeholder-gray-500"
              required
            />
            <textarea 
              placeholder="Your Message" 
              rows="5" 
              className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 bg-gray-50 text-gray-900 placeholder-gray-500"
              required
            ></textarea>
            <motion.button 
              type="submit" 
              className="w-full bg-emerald-600 text-white p-4 rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Send Message
            </motion.button>
          </motion.form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-gradient-to-b from-gray-800 to-gray-900 text-gray-300">
        <div className="container mx-auto text-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 max-w-6xl mx-auto">
            <div>
              <h4 className="text-2xl font-bold mb-4 flex items-center justify-center gap-3">
                <span className="text-emerald-500 text-3xl">🌾</span> 
                <span>Farm2Consumer</span>
              </h4>
              <p className="text-gray-400 text-lg">Connecting farms to homes with transparency.</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4 text-white">Links</h4>
              {navItems.map((item) => (
                <a 
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="block text-gray-400 hover:text-emerald-500 transition-colors duration-200 py-2 text-lg"
                >
                  {item.name}
                </a>
              ))}
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4 text-white">Contact</h4>
              <p className="text-gray-400 text-lg">support@farm2consumer.com</p>
              <p className="text-gray-400 text-lg">+1 234 567 890</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4 text-white">Newsletter</h4>
              <div className="flex justify-center">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="p-3 rounded-l-xl bg-gray-700 text-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all w-full md:w-auto"
                />
                <button className="p-3 bg-emerald-600 rounded-r-xl hover:bg-emerald-700 transition-all duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-center space-x-6 mb-6">
            {['Facebook', 'Twitter', 'Instagram'].map((social) => (
              <a 
                key={social}
                href="#" 
                className="text-2xl text-gray-400 hover:text-emerald-500 transition-all duration-200"
              >
                {social === 'Facebook' ? '📘' : social === 'Twitter' ? '🐦' : '📸'}
              </a>
            ))}
          </div>
          <p className="text-gray-400 text-lg">© 2025 Farm2Consumer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;