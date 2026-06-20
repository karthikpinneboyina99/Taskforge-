'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/ month',
    description: 'Perfect for getting started',
    features: [
      { included: true, text: 'Up to 2 boards' },
      { included: true, text: 'Basic kanban features' },
      { included: true, text: 'Up to 5 team members' },
      { included: false, text: 'AI task generation' },
      { included: false, text: 'Advanced analytics' },
      { included: false, text: 'Priority support' },
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$15',
    period: '/ month',
    description: 'For professional teams',
    features: [
      { included: true, text: 'Unlimited boards' },
      { included: true, text: 'Premium kanban features' },
      { included: true, text: 'Unlimited team members' },
      { included: true, text: 'AI task generation' },
      { included: true, text: 'Advanced analytics' },
      { included: false, text: 'Priority support' },
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Team',
    price: '$39',
    period: '/ month',
    description: 'For growing organizations',
    features: [
      { included: true, text: 'Everything in Pro' },
      { included: true, text: 'AI sprint planner' },
      { included: true, text: 'Custom fields & workflows' },
      { included: true, text: 'API access' },
      { included: true, text: 'Advanced analytics' },
      { included: true, text: 'Priority support' },
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large enterprises',
    features: [
      { included: true, text: 'Everything in Team' },
      { included: true, text: 'Dedicated AI model' },
      { included: true, text: 'SSO & SAML' },
      { included: true, text: 'Audit logs' },
      { included: true, text: '99.99% SLA' },
      { included: true, text: '24/7 dedicated support' },
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="p-6 space-y-8">
      <div className="text-center max-w-xl mx-auto">
        <h1 className="text-display-sm font-bold text-foreground">Simple, transparent pricing</h1>
        <p className="text-body text-muted-foreground mt-3">
          Choose the plan that fits your team. No hidden fees. Cancel anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            className={`relative bg-card border rounded-xl p-5 flex flex-col ${
              plan.popular ? 'border-primary shadow-lg shadow-primary/10' : 'border-border'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                Most Popular
              </div>
            )}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-foreground">{plan.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
            </div>
            <div className="flex-1 space-y-2 mb-6">
              {plan.features.map((feature) => (
                <div key={feature.text} className="flex items-center gap-2">
                  {feature.included ? (
                    <Check size={14} className="text-green-500 flex-shrink-0" />
                  ) : (
                    <X size={14} className="text-muted-foreground flex-shrink-0" />
                  )}
                  <span className={`text-xs ${feature.included ? 'text-foreground' : 'text-muted-foreground line-through'}`}>
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
            <button
              className={`w-full h-10 rounded-lg text-sm font-medium transition-colors ${
                plan.popular
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              {plan.cta}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
