import React, { useState } from 'react';
import Modal from './Modal';

const Hero = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <section className="hero bg-gray-100 py-20 text-center">
      <h2 className="text-4xl font-bold mb-4">Find Your Dream Job with Jobwise</h2>
      <p className="text-lg text-gray-700 mb-6">AI-powered career matching tailored for Georgia 🇬🇪</p>
      <button
        onClick={() => setModalOpen(true)}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
      >
        Start with Jobwiser AI
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <h3 className="text-xl font-semibold mb-2">Hello from Jobwiser 👋</h3>
        <p>Our AI advisor will guide you to your ideal career path. (Real chat coming soon!)</p>
      </Modal>
    </section>
  );
};

export default Hero;
