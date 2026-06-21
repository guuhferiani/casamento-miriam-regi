import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Location from './components/Location';
import PhotoAlbum from './components/PhotoAlbum';
import RSVP from './components/RSVP';
import GiftList from './components/GiftList';
import Tips from './components/Tips';

function App() {
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
