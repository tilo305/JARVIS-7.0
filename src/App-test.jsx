import React from 'react';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-blue-400 tracking-wider">
          JARVIS
        </h1>
        <p className="text-blue-300 text-lg">
          Just A Rather Very Intelligent System
        </p>
        <div className="w-64 h-32 bg-blue-900/30 border border-blue-400/30 rounded-lg p-4">
          <p className="text-blue-200 text-sm">Test Interface Loading...</p>
        </div>
      </div>
    </div>
  );
}

export default App;

