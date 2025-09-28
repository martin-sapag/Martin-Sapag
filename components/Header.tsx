
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-800 shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Control Presupuestario
        </h1>
        <p className="text-teal-400">Fundación Salud Para Todos</p>
      </div>
    </header>
  );
};

export default Header;
