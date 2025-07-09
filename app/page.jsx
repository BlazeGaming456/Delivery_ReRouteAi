import React from 'react';
import MapComponent from '../components/MapComponent';

export default function Home() {
  return (
    <div className='min-h-screen'>
      <h1 className='items-center justify-center text-center mt-6 text-xl font-mono font-bold'>My Google Map</h1>
      <MapComponent />
    </div>
  );
}
