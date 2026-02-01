import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';

// Import images from res folders
const opportunityImages = [
  '/res/modeling-casting-call-poster-template-29rsqe2585d962.webp',
  '/res/modern-fashion-show-poster-template-1ytnbr00c0a30f.webp',
  '/res/model-casting-call,-pageant-flyer,-fashion-design-template-2d1ef3f77ca56012c1e5685657edd92f_screen.jpg',
  '/res/5d6d6f4405f6c984339785ee5c611988.jpg',
  '/res/model-casting-call-event-flyer-template-m2wcp360148f5a.webp',
  '/res/model-casting-call-flyer-template-design-f1cb8367765d869d66825b25da803dbe_screen.jpg',
  '/res/model-fashion-poster-design-template-1d6dc0643be3e6c8da749b4c79fd5382_screen.jpg',
  '/res/professional-modeling-event-extravaganza-poster-template-m61bes047ca319.webp',
];

const castingImages = [
  '/res/select/images (2).jpeg',
  '/res/select/images.jpeg',
  '/res/select/images (1).jpeg',
  '/res/select/images (3).jpeg',
  '/res/select/casting-call-visual-social-media-ng.jpg',
];

const SubscriptionTier = ({ name, price, features, icon, isPremium, isFeatured }) => {
  return (
    <div
      className={`rounded-lg p-8 transition-all duration-300 ${
        isFeatured
          ? 'bg-gradient-to-br from-red-600 to-red-700 ring-2 ring-red-400 scale-105 shadow-2xl'
          : 'bg-gray-800 hover:bg-gray-700'
      } text-white flex flex-col h-full`}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <div className={`text-4xl font-bold mb-6 ${isFeatured ? 'text-white' : 'text-red-500'}`}>
        {price}
        {price !== 'Gratuit' && <span className="text-lg">/mois</span>}
      </div>
      <ul className="space-y-4 mb-8 flex-grow">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className={`text-xl mt-1 ${isFeatured ? 'text-white' : 'text-red-500'}`}>✓</span>
            <span className={isFeatured ? 'text-white' : 'text-gray-300'}>{feature}</span>
          </li>
        ))}
      </ul>
      <button
        className={`w-full py-3 px-6 rounded-lg font-bold transition-all duration-200 ${
          isFeatured
            ? 'bg-white text-red-600 hover:bg-gray-100'
            : 'bg-red-600 text-white hover:bg-red-700'
        }`}
      >
        Souscrire
      </button>
      {isPremium && (
        <span className={`mt-4 text-center text-sm font-semibold ${isFeatured ? 'text-white' : 'text-red-400'}`}>
          ⭐ PLUS POPULAIRE
        </span>
      )}
    </div>
  );
};

const CTA = ({ children, onClick, isDark = true }) => {
  return (
    <button
      onClick={onClick}
      className={`px-8 py-3 rounded-lg font-bold transition-all duration-200 ${
        isDark
          ? 'bg-white text-red-600 hover:bg-gray-100'
          : 'bg-red-600 text-white hover:bg-red-700'
      }`}
    >
      {children}
    </button>
  );
};

export const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [activeFilter, setActiveFilter] = useState('Tout');

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with YouTube Video Background */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* YouTube Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <iframe
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/m5FPAvHLEVM?autoplay=1&mute=1&loop=1&playlist=m5FPAvHLEVM&controls=0&showinfo=0&rel=0"
            title="Paris Fashion Week 2026 Runway"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ pointerEvents: 'none' }}
          ></iframe>
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
          <h1 className="text-6xl md:text-7xl font-black text-white mb-6 drop-shadow-lg">
            KCD Talent Agency
          </h1>
          <p className="text-2xl md:text-3xl text-gray-100 mb-12 max-w-3xl drop-shadow-lg">
            Plateforme professionnelle de mise en relation entre talents du mannequinat et marques
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <CTA
              isDark={true}
              onClick={() => {
                if (isAuthenticated) {
                  navigate('/workspace');
                } else {
                  scrollToSection('opportunities');
                }
              }}
            >
              Découvrir les opportunités
            </CTA>
            <CTA
              isDark={true}
              onClick={() => scrollToSection('subscriptions')}
            >
              Comprendre l'offre
            </CTA>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>

      {/* Subscription Pricing Section */}
      <div id="subscriptions" className="py-20 bg-gradient-to-b from-black via-gray-950 to-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-4">Nos Offres d'Abonnement</h2>
            <p className="text-xl text-gray-300">Choisissez le plan qui correspond à vos besoins</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SubscriptionTier
              name="Gratuit"
              price="0€"
              icon="🎭"
              features={[
                'Accès limité aux opportunités',
                'Voir 5 annonces par mois',
                'Profil basique',
                'Pas de support prioritaire',
              ]}
            />
            <SubscriptionTier
              name="Premium"
              price="29"
              icon="⭐"
              features={[
                'Accès illimité aux opportunités',
                'Notifications en temps réel',
                'Profil premium avec portfolio',
                'Support par email 24/7',
                'Candidatures directes aux marques',
              ]}
              isPremium
              isFeatured
            />
            <SubscriptionTier
              name="Pro"
              price="79"
              icon="👑"
              features={[
                'Tous les avantages Premium',
                'Coaching personnalisé',
                'Accès aux événements exclusifs',
                'Photo shoot professionnel',
                'Support téléphonique VIP',
              ]}
            />
          </div>
        </div>
      </div>

      {/* Opportunities Section */}
      <div id="opportunities" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-4xl font-black text-white mb-6">Opportunités à la une</h2>
            <div className="flex flex-wrap gap-3">
              {['Tout', 'Nouveau', 'Populaire', 'Tendances'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-6 py-2 rounded-full font-bold transition-all duration-200 ${
                    activeFilter === filter
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {opportunityImages.map((image, idx) => (
              <div key={idx} className="group relative rounded-lg overflow-hidden hover:ring-2 hover:ring-red-600 transition-all duration-300 cursor-pointer h-64">
                <img
                  src={image}
                  alt={`Opportunité ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div>
                    <h3 className="text-white font-bold text-lg">Opportunité {idx + 1}</h3>
                    <button className="mt-2 px-4 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700">
                      Voir l'annonce
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trending Castings Section */}
      <div className="py-20 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-black text-white mb-12">Castings en tendance</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {castingImages.map((image, idx) => (
              <div key={idx} className="group relative rounded-lg overflow-hidden aspect-square hover:ring-2 hover:ring-red-600 transition-all duration-300 cursor-pointer">
                <img
                  src={image}
                  alt={`Casting ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button className="px-4 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700">
                    Détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4">
          <div className="rounded-lg p-12 bg-gradient-to-r from-red-600 to-red-900 text-center">
            <h3 className="text-4xl font-black text-white mb-4">Prêt à rejoindre l'agence ?</h3>
            <p className="text-lg text-gray-100 mb-8">
              Créez votre profil et accédez aux collaborations selon votre niveau d'abonnement.
            </p>
            <CTA isDark={false} onClick={() => navigate(isAuthenticated ? '/workspace' : '/register')}>
              {isAuthenticated ? 'Accéder à mon espace' : 'Créer un profil'}
            </CTA>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
