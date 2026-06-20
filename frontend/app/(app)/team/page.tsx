'use client';

import { Mail, Calendar, Shield } from 'lucide-react';

const members = [
  { name: 'Karthik', role: 'Admin · Full Stack', email: 'karthik@taskforge.io', tasks: 24, avatar: 'K' },
  { name: 'Alice Chen', role: 'Frontend Lead', email: 'alice@taskforge.io', tasks: 12, avatar: 'AC' },
  { name: 'Bob Torres', role: 'Backend Lead', email: 'bob@taskforge.io', tasks: 10, avatar: 'BT' },
  { name: 'Carol Wu', role: 'QA Engineer', email: 'carol@taskforge.io', tasks: 8, avatar: 'CW' },
  { name: 'Diana Park', role: 'Security Lead', email: 'diana@taskforge.io', tasks: 14, avatar: 'DP' },
];

export default function TeamPage() {
  return (
    <div className="p-6 space-y-6 bg-background min-h-full">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Team</h1>
        <p className="text-sm text-muted-subtle mt-0.5">Manage your team members and their workloads.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {members.map((member) => (
          <div key={member.name} className="bg-card border border-border rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                  background: member.name === 'Karthik'
                    ? 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))'
                    : 'var(--color-muted)',
                  color: member.name === 'Karthik' ? '#fff' : 'var(--color-muted-foreground)',
                  border: member.name === 'Karthik' ? 'none' : '1px solid var(--color-input)',
                }}
              >
                {member.avatar}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-semibold text-foreground">{member.name}</h3>
                  {member.name === 'Karthik' && <Shield size={12} className="text-primary" />}
                </div>
                <p className="text-xs text-muted-subtle">{member.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-subtle">
              <Mail size={12} />
              <span>{member.email}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-subtle">
                <Calendar size={12} />
                <span>Active this week</span>
              </div>
              <span className="text-xs font-semibold text-foreground">{member.tasks} tasks</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
