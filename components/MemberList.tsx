
import React from 'react';
import { Member } from '../types';

interface MemberListProps {
  members: Member[];
  nextPayerId?: string;
}

const MemberList: React.FC<MemberListProps> = ({ members, nextPayerId }) => {
  if (members.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed p-10 text-center text-slate-400">
        No members added to the rotation yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Member Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {members.sort((a,b) => a.order - b.order).map((member) => (
              <tr key={member.id} className={`hover:bg-slate-50 transition-colors ${nextPayerId === member.id ? 'bg-blue-50/50' : ''}`}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      nextPayerId === member.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {member.name.charAt(0)}
                    </div>
                    <span className="font-semibold text-slate-700">{member.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500 text-sm">
                  {member.phone || '--'}
                </td>
                <td className="px-6 py-4 text-right">
                  {nextPayerId === member.id ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 animate-pulse">
                      NEXT TO PAY
                    </span>
                  ) : member.exemptions > 0 ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                      EXEMPTED ({member.exemptions})
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500">
                      IN QUEUE
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberList;
