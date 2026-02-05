
import React from 'react';

interface HeaderProps {
  isAdmin: boolean;
  onAdminClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAdmin, onAdminClick }) => {
  return (
    <header className="bg-white border-b sticky top-0 z-30 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Water Bucket</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Expense Tracker</p>
          </div>
        </div>
        
        <button 
          onClick={onAdminClick}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            isAdmin 
            ? 'bg-rose-50 text-rose-600 border border-rose-200' 
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {isAdmin ? 'Exit Admin' : 'Admin Login'}
        </button>
      </div>
    </header>
  );
};

export default Header;
