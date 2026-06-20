'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, CartesianGrid } from 'recharts';

const completionData = [
  { name: 'Mon', completed: 4, created: 6 },
  { name: 'Tue', completed: 7, created: 5 },
  { name: 'Wed', completed: 3, created: 8 },
  { name: 'Thu', completed: 8, created: 4 },
  { name: 'Fri', completed: 6, created: 7 },
  { name: 'Sat', completed: 2, created: 3 },
  { name: 'Sun', completed: 1, created: 2 },
];

const velocityData = [
  { sprint: 'S1', points: 34 },
  { sprint: 'S2', points: 42 },
  { sprint: 'S3', points: 38 },
  { sprint: 'S4', points: 51 },
  { sprint: 'S5', points: 45 },
];

const burnDownData = [
  { day: 'Day 1', ideal: 50, actual: 50 },
  { day: 'Day 3', ideal: 40, actual: 38 },
  { day: 'Day 5', ideal: 30, actual: 28 },
  { day: 'Day 7', ideal: 20, actual: 15 },
  { day: 'Day 9', ideal: 10, actual: 8 },
  { day: 'Day 10', ideal: 0, actual: 2 },
];

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-card border border-border rounded-xl p-5">
    <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>
    {children}
  </div>
);

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-heading-2 font-bold text-foreground">Analytics</h1>
      <p className="text-body-sm text-muted-foreground">Track your team performance and productivity.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Task Completion Rate (This Week)">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={completionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
              <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="completed" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="created" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Sprint Velocity">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={velocityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="sprint" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
              <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}
              />
              <Line type="monotone" dataKey="points" stroke="var(--color-accent)" strokeWidth={2} dot={{ fill: 'var(--color-accent)' }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Burn Down Chart">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={burnDownData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
              <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}
              />
              <Area type="monotone" dataKey="ideal" stroke="var(--color-brand-neutral)" fill="var(--color-brand-neutral)" fillOpacity={0.125} strokeWidth={2} strokeDasharray="5 5" />
              <Area type="monotone" dataKey="actual" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.125} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Team Productivity">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[
              { name: 'Alice', tasks: 12 },
              { name: 'Bob', tasks: 10 },
              { name: 'Carol', tasks: 8 },
              { name: 'Diana', tasks: 14 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
              <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="tasks" fill="var(--color-brand-dark)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
