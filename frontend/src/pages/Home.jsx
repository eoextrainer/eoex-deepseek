import React, { useState, useEffect } from 'react';
import { Button, Card, Skeleton } from '../components/ui';
import { useThemeStore } from '../store';

export const Home = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentTheme } = useThemeStore();

  useEffect(() => {
    // Simulate loading featured content
    setTimeout(() => {
      setVideos([
        { id: 1, title: 'Featured Module 1', image: 'https://via.placeholder.com/800x450', category: 'Featured' },
        { id: 2, title: 'Trending Module 2', image: 'https://via.placeholder.com/800x450', category: 'Trending' },
        { id: 3, title: 'Popular Module 3', image: 'https://via.placeholder.com/800x450', category: 'Popular' },
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Carousel */}
      <div className="relative w-full h-96 md:h-screen bg-gradient-to-br from-red-900 via-gray-900 to-gray-950 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-transparent animate-pulse" />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            Welcome to EOEX
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl">
            Discover, Learn, and Grow with our subscription-based community platform
          </p>
          <div className="flex gap-4">
            <Button size="lg" variant="primary">
              Start Exploring
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Featured Content</h2>
          <div className="flex space-x-2">
            <span className="text-sm font-semibold px-4 py-2 bg-red-600 text-white rounded-full">
              All
            </span>
            <span className="text-sm font-semibold px-4 py-2 bg-gray-800 text-gray-300 rounded-full hover:bg-gray-700 cursor-pointer">
              New
            </span>
            <span className="text-sm font-semibold px-4 py-2 bg-gray-800 text-gray-300 rounded-full hover:bg-gray-700 cursor-pointer">
              Popular
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
              <Card key={video.id} className="card-hover overflow-hidden">
                <img
                  src={video.image}
                  alt={video.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-white font-semibold text-lg mb-2">
                  {video.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4">{video.category}</p>
                <Button size="sm" className="w-full">
                  Watch Now
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Trending Modules */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8">Trending Now</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="aspect-video bg-gray-800 rounded-lg hover:ring-2 hover:ring-red-600 transition-smooth cursor-pointer flex items-center justify-center"
              >
                <span className="text-gray-500">{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-red-600 to-red-900 border-0">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-3xl font-bold text-white mb-2">
                Ready to Join?
              </h3>
              <p className="text-gray-200">
                Create an account and unlock exclusive content today.
              </p>
            </div>
            <Button size="lg" variant="secondary" className="mt-4 md:mt-0">
              Sign Up Now
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Home;
