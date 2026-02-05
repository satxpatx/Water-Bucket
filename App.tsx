
import React, { useState, useEffect, useCallback } from 'react';
import { Member, Payment, UserRole, AppState } from './types';
import { BUCKET_COST, LOCAL_STORAGE_KEY, ADMIN_PASSWORD } from './constants';
import { calculateNextPayer, getExemptedMembers } from './utils';
import MemberList from './components/MemberList';
import PaymentHistory from './components/PaymentHistory';
import AdminPanel from './components/AdminPanel';
import Header from './components/Header';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...parsed, role: 'MEMBER' };
    }
    return {
      members: [],
      payments: [],
      role: 'MEMBER'
    };
  });

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  // Persist state to local storage
  useEffect(() => {
    const { role, ...dataToSave } = state;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
  }, [state]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdminMode(true);
      setShowLogin(false);
      setPasswordInput('');
    } else {
      alert('Incorrect password!');
    }
  };

  const handleLogout = () => {
    setIsAdminMode(false);
  };

  const addMember = (name: string, phone: string) => {
    const newMember: Member = {
      id: crypto.randomUUID(),
      name,
      phone,
      exemptions: 0,
      order: state.members.length,
      isActive: true,
    };
    setState(prev => ({
      ...prev,
      members: [...prev.members, newMember]
    }));
  };

  const removeMember = (id: string) => {
    setState(prev => ({
      ...prev,
      members: prev.members.map(m => m.id === id ? { ...m, isActive: false } : m)
    }));
  };

  const recordPayment = (memberId: string, isOverride: boolean = false) => {
    const member = state.members.find(m => m.id === memberId);
    if (!member) return;

    const lastPayment = state.payments[0];
    const nextScheduledPayer = calculateNextPayer(state.members, state.payments);

    // Deep copy members to update exemptions
    let updatedMembers = state.members.map(m => ({ ...m }));

    // --- RULE #4 Logic: Granting Exemptions ---
    
    // A: Paid twice consecutively
    const isConsecutive = lastPayment && lastPayment.memberId === memberId;
    
    // B: Voluntarily paid extra (paying when someone else was scheduled)
    const isVoluntaryExtra = nextScheduledPayer && nextScheduledPayer.id !== memberId;

    if (isConsecutive || isVoluntaryExtra) {
      updatedMembers = updatedMembers.map(m => 
        m.id === memberId ? { ...m, exemptions: m.exemptions + 1 } : m
      );
    }

    // --- Exemption Consumption Logic ---
    // If the person who paid IS the one scheduled by the rotation, 
    // it means we effectively "passed" all the people who were skipped due to exemptions.
    if (nextScheduledPayer && nextScheduledPayer.id === memberId) {
      const activeSorted = updatedMembers.filter(m => m.isActive).sort((a,b) => a.order - b.order);
      const lastIdx = lastPayment ? activeSorted.findIndex(m => m.id === lastPayment.memberId) : -1;
      
      // Walk from last payer to current payer and consume 1 exemption for each person skipped
      let walkIdx = (lastIdx + 1) % activeSorted.length;
      while (activeSorted[walkIdx].id !== memberId) {
        const skippedMember = activeSorted[walkIdx];
        if (skippedMember.exemptions > 0) {
          updatedMembers = updatedMembers.map(m => 
            m.id === skippedMember.id ? { ...m, exemptions: m.exemptions - 1 } : m
          );
        }
        walkIdx = (walkIdx + 1) % activeSorted.length;
      }
    }

    const newPayment: Payment = {
      id: crypto.randomUUID(),
      memberId,
      memberName: member.name,
      amount: BUCKET_COST,
      timestamp: Date.now(),
      isOverride
    };

    setState(prev => ({
      ...prev,
      members: updatedMembers,
      payments: [newPayment, ...prev.payments]
    }));
  };

  const resetCycle = () => {
    if (window.confirm("Are you sure? This will clear all payment history and reset exemptions.")) {
      setState(prev => ({
        ...prev,
        payments: [],
        members: prev.members.map(m => ({ ...m, exemptions: 0 }))
      }));
    }
  };

  const nextPayer = calculateNextPayer(state.members, state.payments);
  const exempted = getExemptedMembers(state.members);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header 
        isAdmin={isAdminMode} 
        onAdminClick={() => isAdminMode ? handleLogout() : setShowLogin(true)} 
      />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        <Dashboard 
          nextPayer={nextPayer} 
          lastPayment={state.payments[0]} 
          exempted={exempted}
        />

        {isAdminMode ? (
          <AdminPanel 
            members={state.members} 
            payments={state.payments}
            onAddMember={addMember} 
            onRemoveMember={removeMember}
            onRecordPayment={recordPayment}
            onReset={resetCycle}
          />
        ) : (
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                Member List
              </h2>
              <MemberList members={state.members.filter(m => m.isActive)} nextPayerId={nextPayer?.id} />
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                Recent Payments
              </h2>
              <PaymentHistory payments={state.payments.slice(0, 10)} />
            </section>
          </div>
        )}
      </main>

      {/* Admin Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-center">Admin Access</h3>
            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                type="password" 
                placeholder="Enter Admin Password" 
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoFocus
              />
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => setShowLogin(false)}
                  className="flex-1 py-3 bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t py-3 text-center text-xs text-slate-400">
        Water Bucket Manager &bull; Fair Rotation System
      </footer>
    </div>
  );
};

export default App;
