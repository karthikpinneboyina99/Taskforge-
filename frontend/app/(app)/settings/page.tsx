'use client';

import { useState } from 'react';
import { Bell, Shield, Palette, Globe } from 'lucide-react';

const sections = [
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'language', label: 'Language & Region', icon: Globe },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('notifications');

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-heading-2 font-bold text-foreground">Settings</h1>
      <p className="text-body-sm text-muted-foreground">Manage your account and application preferences.</p>

      <div className="flex gap-6">
        <div className="w-48 space-y-1 flex-shrink-0">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSection === section.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <section.icon size={16} />
              {section.label}
            </button>
          ))}
        </div>
        <div className="flex-1 max-w-lg">
          {activeSection === 'notifications' && (
            <div className="space-y-4">
              {[
                { label: 'Email notifications', desc: 'Receive email updates for task assignments' },
                { label: 'Push notifications', desc: 'Get push notifications in your browser' },
                { label: 'Slack integration', desc: 'Send updates to your Slack workspace' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                  </label>
                </div>
              ))}
            </div>
          )}
          {activeSection === 'security' && (
            <div className="space-y-4">
              <div className="py-3 border-b border-border">
                <p className="text-sm font-medium text-foreground">Two-factor authentication</p>
                <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
              </div>
              <div className="py-3 border-b border-border">
                <p className="text-sm font-medium text-foreground">Session management</p>
                <p className="text-xs text-muted-foreground">Manage active sessions and devices</p>
              </div>
            </div>
          )}
          {activeSection === 'appearance' && (
            <div className="space-y-4">
              <div className="py-3 border-b border-border">
                <p className="text-sm font-medium text-foreground">Dark mode</p>
                <p className="text-xs text-muted-foreground">Toggle between light and dark themes</p>
              </div>
              <div className="py-3 border-b border-border">
                <p className="text-sm font-medium text-foreground">Compact mode</p>
                <p className="text-xs text-muted-foreground">Reduce spacing for a denser layout</p>
              </div>
            </div>
          )}
          {activeSection === 'language' && (
            <div className="space-y-4">
              <div className="py-3 border-b border-border">
                <p className="text-sm font-medium text-foreground">Language</p>
                <p className="text-xs text-muted-foreground">English (United States)</p>
              </div>
              <div className="py-3 border-b border-border">
                <p className="text-sm font-medium text-foreground">Time zone</p>
                <p className="text-xs text-muted-foreground">UTC-8 (Pacific Time)</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
