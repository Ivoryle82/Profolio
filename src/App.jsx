import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import MyPhotos from './pages/MyPhotos';
import MySpotify from './pages/MySpotify';
import About from './pages/About';
import Contact from './pages/Contact';
import OurCompatibility from './pages/OurCompatibility';

function App() {
  const appStyles = {
    minHeight: '100vh', // Ensure the div takes up at least the full height of the viewport
    /* Add any other CSS styles you want to apply */
  };

  return (
    <BrowserRouter basename="/Profolio">
      <div style={appStyles}> {/* Apply styles directly to this div */}
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/myphotos" element={<MyPhotos />} />
          <Route path="/myspotify" element={<MySpotify />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/compatibility" element={<OurCompatibility />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
