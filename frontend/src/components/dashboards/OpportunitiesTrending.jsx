import React, { useState, useEffect } from 'react';
import api from '../../api/client';

export default function OpportunitiesTrending() {
  const [opportunities, setOpportunities] = useState([
    {
      id: 1,
      title: 'Paris Fashion Week Runway',
      image: 'https://images.unsplash.com/photo-1469022563149-aa64dbd37dae?w=400&h=300&fit=crop',
      category: 'Runway',
      tier: 'Premium'
    },
    {
      id: 2,
      title: 'Editorial Photoshoot',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop',
      category: 'Editorial',
      tier: 'All'
    },
    {
      id: 3,
      title: 'Luxury Brand Campaign',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=300&fit=crop',
      category: 'Campaign',
      tier: 'Premium'
    },
    {
      id: 4,
      title: 'International Lookbook',
      image: 'https://images.unsplash.com/photo-1483389127117-b6a2102724ae?w=400&h=300&fit=crop',
      category: 'Lookbook',
      tier: 'Free'
    },
    {
      id: 5,
      title: 'High Fashion Editorial',
      image: 'https://images.unsplash.com/photo-1502716315431-19e6d3a965d9?w=400&h=300&fit=crop',
      category: 'Editorial',
      tier: 'Premium'
    },
    {
      id: 6,
      title: 'Summer Collection Launch',
      image: 'https://images.unsplash.com/photo-1539651038615-4ec2e2611a96?w=400&h=300&fit=crop',
      category: 'Campaign',
      tier: 'All'
    },
    {
      id: 7,
      title: 'Runway - Milan Fashion Week',
      image: 'https://images.unsplash.com/photo-1467043237529-ea22bae6c16d?w=400&h=300&fit=crop',
      category: 'Runway',
      tier: 'Premium'
    },
    {
      id: 8,
      title: 'Beauty & Cosmetics Shoot',
      image: 'https://images.unsplash.com/photo-1500495046891-9be0efa08c16?w=400&h=300&fit=crop',
      category: 'Photoshoot',
      tier: 'All'
    },
    {
      id: 9,
      title: 'Designer Collaboration',
      image: 'https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?w=400&h=300&fit=crop',
      category: 'Collaboration',
      tier: 'Premium'
    }
  ]);

  const [selectedTier, setSelectedTier] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const tiers = ['All', 'Free', 'Premium'];
  const categories = ['All', 'Runway', 'Editorial', 'Campaign', 'Lookbook', 'Photoshoot', 'Collaboration'];

  const filteredOpportunities = opportunities.filter(opp => {
    const tierMatch = selectedTier === 'All' || opp.tier === selectedTier;
    const categoryMatch = selectedCategory === 'All' || opp.category === selectedCategory;
    return tierMatch && categoryMatch;
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">🎯 Opportunités en tendance</h1>

      {/* Filter Section */}
      <div className="mb-8 space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-3">By Subscription Tier</h3>
          <div className="flex gap-3">
            {tiers.map(tier => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`px-6 py-2 rounded-full transition font-semibold ${
                  selectedTier === tier
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">By Category</h3>
          <div className="flex gap-3 flex-wrap">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  selectedCategory === category
                    ? 'bg-white text-gray-950 font-bold'
                    : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-3 gap-6">
        {filteredOpportunities.map(opp => (
          <div
            key={opp.id}
            className="bg-gray-900 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-red-600/20 transition cursor-pointer group"
          >
            <div className="relative overflow-hidden h-48">
              <img
                src={opp.image}
                alt={opp.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              />
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  opp.tier === 'Premium' ? 'bg-purple-600' : opp.tier === 'Free' ? 'bg-green-600' : 'bg-blue-600'
                }`}>
                  {opp.tier}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold mb-2 group-hover:text-red-400 transition">{opp.title}</h3>
              <p className="text-gray-400 text-sm mb-3">{opp.category}</p>
              <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm font-semibold transition">
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredOpportunities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No opportunities found matching your filters.</p>
        </div>
      )}
    </div>
  );
}
