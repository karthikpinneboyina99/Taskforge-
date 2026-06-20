'use client';

import { Kanban, Sparkles, Users, CheckCircle2, TrendingUp, Clock } from 'lucide-react';
import { useBoard } from '@/context/BoardContext';

const stats = [
  { label: 'Active Boards', value: '3', icon: Kanban, color: 'var(--color-primary)' },
  { label: 'Tasks Completed', value: '47', icon: CheckCircle2, color: '#22c55e' },
  { label: 'Team Members', value: '8', icon: Users, color: 'var(--color-secondary)' },
  { label: 'AI Suggestions', value: '12', icon: Sparkles, color: 'var(--color-accent)' },
];

export default function DashboardPage() {
  const { board } = useBoard();
  const totalTasks = board.columns.reduce((s, c) => s + c.cards.length, 0);
  const overdue = board.columns
    .flatMap((c) => c.cards)
    .filter((c) => c.dueDate && new Date(c.dueDate) < new Date()).length;

  return (
    <div className="p-6 space-y-6 bg-background min-h-full">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-subtle mt-0.5">Welcome back, Alice. Here is your project overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-xl p-4 flex items-center gap-3"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${stat.color}15` }}
            >
              <stat.icon size={18} style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-subtle">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Board Overview</h2>
          </div>
          <div className="space-y-2">
            {board.columns.map((col) => (
              <div key={col.id} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: col.color }} />
                <span className="text-xs text-muted-foreground flex-1">{col.title}</span>
                <span className="text-xs font-medium text-foreground tabular-nums">{col.cards.length}</span>
                <div className="w-20 h-1.5 bg-foreground/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${col.cards.length > 0 ? Math.min(100, (col.cards.filter(c => !!c.dueDate).length / col.cards.length) * 100) : 0}%`,
                      backgroundColor: col.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-subtle">
            <span>{totalTasks} total tasks</span>
            <span>{board.columns.length} columns</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={16} className="text-accent" />
            <h2 className="text-sm font-semibold text-foreground">Quick Info</h2>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Overdue tasks', value: overdue, color: 'var(--color-destructive)' },
              { label: 'Tasks with due dates', value: board.columns.flatMap(c => c.cards).filter(c => c.dueDate).length, color: 'var(--color-primary)' },
              { label: 'High priority', value: board.columns.flatMap(c => c.cards).filter(c => c.priority === 'high' || c.priority === 'urgent').length, color: '#ea580c' },
              { label: 'Tasks with tags', value: board.columns.flatMap(c => c.cards).filter(c => c.tags.length > 0).length, color: 'var(--color-secondary)' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{item.label}</span>
                <span className="text-xs font-semibold" style={{ color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
          {board.columns.flatMap(c => c.cards).length > 0 && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-muted-subtle">
                {Math.round((board.columns.flatMap(c => c.cards).filter(c => !!c.assignee).length / board.columns.flatMap(c => c.cards).length) * 100)}% tasks assigned
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
