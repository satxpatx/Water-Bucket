
import React, { useState } from 'react';
import { Member, Payment } from '../types';
import { BUCKET_COST } from '../constants';
import PaymentHistory from './PaymentHistory';

interface AdminPanelProps {
  members: Member[];
  payments: Payment[];
  onAddMember: (name: string, phone: string) => void;
  onRemoveMember: (id: string) => void;
  onRecordPayment: (memberId: string, isOverride?: boolean) => void;
  onReset: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  members, 
  payments, 
  onAddMember, 
  onRemoveMember, 
  onRecordPayment,
  onReset
}) => {
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [activeTab, setActiveTab] = useState<'MEMBERS' | 'PAYMENTS'>('MEMBERS');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onAddMember(newName.trim(), newPhone.trim());
    setNewName('');
    setNewPhone('');
  };

  const activeMembers = members.filter(m => m.isActive);

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex gap-2 p-1 bg-slate-200 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('MEMBERS')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'MEMBERS' ? 'bg-white shadow text-blue-600' : 'text-slate-600 hover:bg-slate-300'
          }`}
        >
          Manage Members
        </button>
        <button 
          onClick={() => setActiveTab('PAYMENTS')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'PAYMENTS' ? 'bg-white shadow text-blue-600' : 'text-slate-600 hover:bg-slate-300'
          }`}
        >
          Manage Payments
        </button>
      </div>

      {activeTab === 'MEMBERS' && (
        <div className="space-y-6">
          {/* Add Member Form */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h3 className="text-lg font-bold mb-4">Add New Member</h3>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input 
                placeholder="Full Name" 
                className="px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                required
              />
              <input 
                placeholder="Phone (Optional)" 
                className="px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={newPhone}
                onChange={e => setNewPhone(e.target.value)}
              />
              <button 
                type="submit"
                className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Member
              </button>
            </form>
          </div>

          {/* Members Table */}
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
             <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-bold">Existing Members</h3>
                <button 
                  onClick={onReset}
                  className="text-xs font-bold text-rose-500 hover:text-rose-600 uppercase tracking-widest border border-rose-100 px-3 py-1.5 rounded-lg"
                >
                  Reset All Data
                </button>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full">
                 <thead className="bg-slate-50 border-b">
                   <tr>
                     <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Member</th>
                     <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Exemptions</th>
                     <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {activeMembers.map(m => (
                     <tr key={m.id} className="hover:bg-slate-50">
                       <td className="px-6 py-4 font-semibold text-slate-700">{m.name}</td>
                       <td className="px-6 py-4 text-center">
                         <span className={`font-bold ${m.exemptions > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                           {m.exemptions}
                         </span>
                       </td>
                       <td className="px-6 py-4 text-right">
                         <button 
                          onClick={() => onRemoveMember(m.id)}
                          className="text-rose-500 hover:bg-rose-50 px-3 py-1 rounded-lg text-sm font-semibold"
                         >
                           Remove
                         </button>
                       </td>
                     </tr>
                   ))}
                   {activeMembers.length === 0 && (
                     <tr>
                       <td colSpan={3} className="px-6 py-10 text-center text-slate-400">No active members found.</td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'PAYMENTS' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h3 className="text-lg font-bold mb-4">Record New Payment</h3>
            <p className="text-sm text-slate-500 mb-6">Select the person who is paying right now. This will update the rotation automatically.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {activeMembers.map(m => (
                <button
                  key={m.id}
                  onClick={() => onRecordPayment(m.id)}
                  className="flex flex-col items-center p-3 border rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2 font-bold text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {m.name.charAt(0)}
                  </div>
                  <span className="text-sm font-bold text-slate-700 text-center truncate w-full">{m.name}</span>
                  <span className="text-[10px] font-bold text-emerald-600 mt-1">₹{BUCKET_COST}</span>
                </button>
              ))}
            </div>
          </div>

          <section>
            <h3 className="text-lg font-bold mb-4">Full Payment History</h3>
            <PaymentHistory payments={payments} />
          </section>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
