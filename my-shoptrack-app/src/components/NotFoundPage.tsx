import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-black-600">404</h1>
        <p className="text-2xl font-semibold text-black-900 mb-4">Strona nie została znaleziona</p>
        <p className="mb-8">Przepraszamy, szukana strona nie istnieje lub została przeniesiona.</p>
        <button
            className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none block w-full"
            type="button">
        <Link to="/">Powrót</Link>
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;