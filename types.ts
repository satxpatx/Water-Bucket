
export interface Member {
  id: string;
  name: string;
  phone?: string;
  exemptions: number;
  order: number;
  isActive: boolean;
}

export interface Payment {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  timestamp: number;
  isOverride: boolean;
}

export type UserRole = 'ADMIN' | 'MEMBER';

export interface AppState {
  members: Member[];
  payments: Payment[];
  role: UserRole;
}
