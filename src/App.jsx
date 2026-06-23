import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Location from './components/Location';
import PhotoAlbum from './components/PhotoAlbum';
import RSVP from './components/RSVP';
import GiftList from './components/GiftList';
import Tips from './components/Tips';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [route, setRoute] = useState('home'); // 'home', 'painel', 'admin'

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      if (hash === '#/painel' || hash === '#painel') {
        setRoute('painel');
      } else if (hash === '#/admin' || hash === '#admin') {
        setRoute('admin');
      } else {
        setRoute('home');
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  if (route === 'painel') {
    return <Dashboard />;
  }

  if (route === 'admin') {
    return <AdminDashboard />;
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
