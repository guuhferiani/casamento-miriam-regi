import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Location from './components/Location';
import PhotoAlbum from './components/PhotoAlbum';
import RSVP from './components/RSVP';
import GiftList from './components/GiftList';
import Tips from './components/Tips';
import Dashboard from './components/Dashboard';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkHash = () => {
      setIsAdmin(window.location.hash === '#/painel' || window.location.hash === '#painel');
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  if (isAdmin) {
    return <Dashboard />;
  }

  return (
    <div className="antialiased text-navy relative">
      <Navbar />
      <Hero />
      <Location />
      <PhotoAlbum />
      <RSVP />
      <GiftList />
      <Tips />
    </div>
  );
}

export default App;
