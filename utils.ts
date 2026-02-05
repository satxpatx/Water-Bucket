
import { Member, Payment } from './types';

/**
 * Logic to determine who is next to pay.
 * A person is next if it's their turn in the rotation and they have 0 exemptions.
 * If they have exemptions, they are skipped (consuming 1 exemption) and the next person is checked.
 */
export const calculateNextPayer = (members: Member[], payments: Payment[]): Member | null => {
  const activeMembers = members.filter(m => m.isActive).sort((a, b) => a.order - b.order);
  if (activeMembers.length === 0) return null;

  if (payments.length === 0) return activeMembers[0];

  const lastPayment = payments[0]; // Assumes sorted newest first
  const lastPayerIndex = activeMembers.findIndex(m => m.id === lastPayment.memberId);
  
  // Start searching from the next person after the last payer
  let currentIndex = (lastPayerIndex + 1) % activeMembers.length;
  
  // We need to simulate the skipping process to find who is truly "Next"
  // However, for the UI, we just want to know who is CURRENTLY next.
  // Note: Exemptions are "consumed" when the turn reaches that person.
  for (let i = 0; i < activeMembers.length; i++) {
    const candidate = activeMembers[currentIndex];
    if (candidate.exemptions === 0) {
      return candidate;
    }
    // If they have exemptions, they are technically "Exempted" and we look at the next.
    currentIndex = (currentIndex + 1) % activeMembers.length;
  }

  // If everyone is exempted (rare), the first one pays anyway.
  return activeMembers[0];
};

export const getExemptedMembers = (members: Member[]): Member[] => {
  return members.filter(m => m.isActive && m.exemptions > 0);
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
