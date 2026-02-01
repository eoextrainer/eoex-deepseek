import React, { useState, useEffect } from 'react';
import api from '../../api/client';

export default function Portfolio() {
  const [portfolioItems, setPortfolioItems] = useState([
    {
      id: 1,
      title: 'Editorial Shoot',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop',
      category: 'Editorial'
    },
    {
      id: 2,
      title: 'Runway Show Paris',
      image: 'https://images.unsplash.com/photo-1469022563149-aa64dbd37dae?w=500&h=500&fit=crop',
      category: 'Runway'
    },
    {
      id: 3,
      title: 'Fashion Campaign',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&h=500&fit=crop',
      category: 'Campaign'
    },
    {
      id: 4,
      title: 'Lookbook Feature',
      image: 'https://images.unsplash.com/photo-1483389127117-b6a2102724ae?w=500&h=500&fit=crop',
      category: 'Lookbook'
    },
    {
      id: 5,
      title: 'Street Style',
      image: 'https://images.unsplash.com/photo-1539651038615-4ec2e2611a96?w=500&h=500&fit=crop',
      category: 'Street'
    },
    {
      id: 6,
      title: 'Luxury Brand Collab',
      image: 'https://images.unsplash.com/photo-1502716315431-19e6d3a965d9?w=500&h=500&fit=crop',
      category: 'Collaboration'
    }
  ]);

  const [selectedFilter, setSelectedFilter] = useState('All');
  const categories = ['All', 'Editorial', 'Runway', 'Campaign', 'Lookbook', 'Street', 'Collaboration'];

  const filteredItems = selectedFilter === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === selectedFilter);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Portfolio</h1>
      
      {/* Category Filter - Instagram style */}
      <div className="flex gap-4 mb-12 overflow-x-auto pb-4 border-b border-gray-800">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedFilter(category)}
            className={`px-6 py-2 rounded-full whitespace-nowrap transition ${
              selectedFilter === category
                ? 'bg-white text-gray-950 font-bold'
                : 'border border-gray-600 hover:border-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Gallery Grid - Instagram feed style */}
      <div className="grid grid-cols-3 gap-6 auto-rows-max">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="aspect-square rounded-lg overflow-hidden cursor-pointer group relative"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="text-center">
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-300 text-sm">{item.category}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
