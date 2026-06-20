'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ListChecks, GanttChart, Lightbulb, Send } from 'lucide-react';

const tabs = [
  { id: 'generator', label: 'Task Generator', icon: Sparkles },
  { id: 'prioritization', label: 'Prioritization', icon: ListChecks },
  { id: 'sprint', label: 'Sprint Planner', icon: GanttChart },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
];

const priorityItems = [
  { task: 'Payment flow review', score: 92, label: 'Critical' },
  { task: 'Security audit', score: 85, label: 'High' },
  { task: 'Authentication implementation', score: 78, label: 'High' },
  { task: 'Homepage mockup', score: 45, label: 'Medium' },
  { task: 'API documentation', score: 30, label: 'Low' },
];

const sprintItems = [
  { task: 'Notification system', assignee: 'Carol Wu', pts: 8, status: 'In Progress' },
  { task: 'User dashboard', assignee: 'Alice Chen', pts: 13, status: 'Planned' },
  { task: 'API rate limiting', assignee: 'Bob Torres', pts: 5, status: 'Planned' },
  { task: 'Mobile responsive fixes', assignee: 'Alice Chen', pts: 8, status: 'Planned' },
  { task: 'E2E test suite', assignee: 'Carol Wu', pts: 11, status: 'Planned' },
];

const insights = [
  { icon: '⚠️', title: 'At Risk', desc: 'Payment flow review is overdue. Consider re-assigning or extending the deadline.' },
  { icon: '📈', title: 'Trending Up', desc: 'Team velocity increased 15% this sprint. Great work!' },
  { icon: '💡', title: 'Suggestion', desc: 'Split the "User dashboard" task into smaller subtasks for faster delivery.' },
  { icon: '🔄', title: 'Bottleneck', desc: 'The Review column has 3 cards waiting for 2+ days. Consider unblocking.' },
];

function GeneratorTab({ prompt, setPrompt }: { prompt: string; setPrompt: (v: string) => void }) {
  return (
    <div className="space-y-4">
      <p className="text-body-sm text-muted-foreground">
        Describe a task and AI will generate a structured card with title, details, tags, and priority.
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Implement user authentication with OAuth2..."
          className="flex-1 h-10 px-3 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
        />
        <button className="h-10 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
          <Send size={16} /> Generate
        </button>
      </div>
      {prompt && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-4 space-y-3"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs font-medium text-green-600">AI Generated</span>
          </div>
          <h4 className="text-sm font-semibold text-foreground">User Authentication System</h4>
          <p className="text-xs text-muted-foreground">
            Implement OAuth2 authentication with Google and GitHub providers, including JWT token management, refresh token rotation, and session persistence.
          </p>
          <div className="flex gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">backend</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-brand-dark/10 text-brand-dark">security</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="font-medium text-amber-600">Priority: High</span>
            <span>Est: 3 days</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function PrioritizationTab() {
  return (
    <div className="space-y-4">
      <p className="text-body-sm text-muted-foreground">
        AI analyzes your board and reorders tasks by business impact, dependencies, and deadlines.
      </p>
      <div className="bg-card border border-border rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Current Sprint Priority Order</h4>
        {priorityItems.map((item) => (
          <div key={item.task} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <span className="text-sm text-foreground">{item.task}</span>
            <div className="flex items-center gap-3">
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${item.score}%`,
                    backgroundColor: item.score > 80 ? 'var(--color-primary)' : item.score > 60 ? 'var(--color-accent)' : 'var(--color-brand-neutral)',
                  }}
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground w-12 text-right">{item.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SprintTab() {
  return (
    <div className="space-y-4">
      <p className="text-body-sm text-muted-foreground">
        AI plans your next sprint based on team velocity, capacity, and task dependencies.
      </p>
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">Sprint 6 Plan</h4>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-medium">45 pts</span>
        </div>
        {sprintItems.map((item) => (
          <div key={item.task} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${item.status === 'In Progress' ? 'bg-primary' : 'bg-brand-neutral'}`} />
              <span className="text-sm text-foreground">{item.task}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">{item.assignee}</span>
              <span className="text-xs font-mono text-muted-foreground">{item.pts} pts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InsightsTab() {
  return (
    <div className="space-y-4">
      <p className="text-body-sm text-muted-foreground">
        AI-generated insights and recommendations based on your board data.
      </p>
      <div className="space-y-3">
        {insights.map((insight) => (
          <div key={insight.title} className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
            <span className="text-lg flex-shrink-0">{insight.icon}</span>
            <div>
              <h4 className="text-sm font-semibold text-foreground">{insight.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{insight.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AIPage() {
  const [activeTab, setActiveTab] = useState('generator');
  const [prompt, setPrompt] = useState('');

  const renderTab = useCallback(() => {
    switch (activeTab) {
      case 'generator':
        return <GeneratorTab prompt={prompt} setPrompt={setPrompt} />;
      case 'prioritization':
        return <PrioritizationTab />;
      case 'sprint':
        return <SprintTab />;
      case 'insights':
        return <InsightsTab />;
      default:
        return null;
    }
  }, [activeTab, prompt]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-heading-2 font-bold text-foreground">AI Features</h1>
      <p className="text-body-sm text-muted-foreground">
        Leverage artificial intelligence to accelerate your workflow.
      </p>

      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="max-w-2xl"
      >
        {renderTab()}
      </motion.div>
    </div>
  );
}
