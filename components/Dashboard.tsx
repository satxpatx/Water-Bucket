
import React from 'react';
import { Member, Payment } from '../types';
import { formatDate } from '../utils';

interface DashboardProps {
  nextPayer: Member | null;
  lastPayment: Payment | undefined;
  exempted: Member[];
}

const Dashboard: React.FC<DashboardProps> = ({ nextPayer, lastPayment, exempted }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Primary Card: Next Payer */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
        <div className="relative">
          <p className="text-blue-600 text-sm font-bold uppercase tracking-widest mb-1">Next to Pay</p>
          <h2 className="text-3xl font-extrabold text-slate-800">
            {nextPayer ? nextPayer.name : 'No members'}
          </h2>
          {nextPayer?.phone && <p className="text-slate-500 text-sm mt-1">{nextPayer.phone}</p>}
        </div>
        <div className="mt-6 flex items-center gap-2">
          <div className="px-3 py-1 bg-blue-600 text-white text-sm font-bold rounded-lg shadow-sm">
            ₹20.00
          </div>
          <span className="text-xs text-slate-400 font-medium italic">Standard bucket rate</span>
        </div>
      </div>

      {/* Secondary Cards Column */}
      <div className="space-y-4">
        {/* Last Paid Card */}
        <div className="bg-white rounded-2xl shadow-sm border p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Last Paid By</p>
            <p className="font-bold text-slate-800">
              {lastPayment ? lastPayment.memberName : 'No payments yet'}
            </p>
            {lastPayment && (
              <p className="text-[10px] text-slate-400">{formatDate(lastPayment.timestamp)}</p>
            )}
          </div>
        </div>

        {/* Exempted Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Currently Exempted</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {exempted.length > 0 ? (
                exempted.map(m => (
                  <span key={m.id} className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                    {m.name} ({m.exemptions})
                  </span>
                ))
              ) : (
                <p className="text-xs text-slate-400">None</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
