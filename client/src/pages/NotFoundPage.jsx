import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#101946] text-white flex flex-col justify-between">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-40 text-center space-y-6">
        <h1 className="text-8xl font-black text-[#B8FF00]">404</h1>
        <h2 className="text-3xl font-extrabold">Page Not Found</h2>
        <p className="text-gray-300">
          The page you are looking for does not exist or has been moved.
        </p>
        <a
          href="/"
          className="inline-block bg-[#B8FF00] hover:bg-[#A3E600] text-[#101946] font-extrabold px-8 py-3.5 rounded-full transition-all shadow-xl"
        >
          Back to Home
        </a>
      </div>
      <Footer />
    </div>
  );
};

export default NotFoundPage;
