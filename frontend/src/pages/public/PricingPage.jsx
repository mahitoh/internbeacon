import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, CheckCircle2, X as XIcon, Zap, Building2,
  GraduationCap, HelpCircle, Diamond
} from 'lucide-react';

const STUDENT_PLAN = {
  name: 'Student',
  price: 'Free',
  subtitle: 'Forever free for students',
  cta: 'Create Student Account',
  ctaHref: '/register/student',
  features: [
    { label: 'Unlimited internship browsing', included: true },
    { label: 'Apply to up to 20 offers/month', included: true },
    { label: 'Real-time application tracking', included: true },
    { label: 'Direct messaging with recruiters', included: true },
    { label: 'CV upload & profile builder', included: true },
    { label: 'Smart internship recommendations', included: true },
    { label: 'Saved offers list', included: true },
  ],
};

const COMPANY_PLANS = [
  {
    name: 'Starter',
    price: '0',
    period: '/month',
    subtitle: 'Perfect to get started',
    highlight: false,
    cta: 'Get Started Free',
    ctaHref: '/register/company',
    features: [
      { label: 'Up to 2 active listings', included: true },
      { label: 'Up to 50 applications/listing', included: true },
      { label: 'Candidate messaging', included: true },
      { label: 'Basic application pipeline', included: true },
      { label: 'Company profile page', included: true },
      { label: 'AI candidate matching', included: false },
      { label: 'Analytics dashboard', included: false },
      { label: 'Priority support', included: false },
    ],
  },
  {
    name: 'Growth',
    price: '25,000',
    period: ' FCFA/month',
    subtitle: 'For growing teams',
    highlight: true,
    badge: 'Most Popular',
    cta: 'Start Free Trial',
    ctaHref: '/register/company',
    features: [
      { label: 'Up to 10 active listings', included: true },
      { label: 'Unlimited applications', included: true },
      { label: 'Candidate messaging', included: true },
      { label: 'Advanced pipeline management', included: true },
      { label: 'Company profile page', included: true },
      { label: 'AI candidate matching', included: true },
      { label: 'Analytics dashboard', included: true },
      { label: 'Priority support', included: false },
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    subtitle: 'For large organisations',
    highlight: false,
    cta: 'Contact Sales',
    ctaHref: '/contact',
    features: [
      { label: 'Unlimited active listings', included: true },
      { label: 'Unlimited applications', included: true },
      { label: 'Candidate messaging', included: true },
      { label: 'Advanced pipeline management', included: true },
      { label: 'Branded company profile', included: true },
      { label: 'AI candidate matching', included: true },
      { label: 'Full analytics & reporting', included: true },
      { label: 'Dedicated account manager', included: true },
    ],
  },
];

const FAQS = [
  {
    q: 'Is InternBeacon really free for students?',
    a: 'Yes, 100%. Students can browse, apply, chat, and track applications with no cost ever. We monetise through companies, not students.',
  },
  {
    q: 'Can I switch plans at any time?',
    a: 'Absolutely. You can upgrade or downgrade your company plan at any time. Changes take effect at the start of your next billing cycle.',
  },
  {
    q: 'Is there a free trial for paid plans?',
    a: 'Yes. The Growth plan includes a 14-day free trial with no credit card required. You can cancel any time during the trial at no charge.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept Mobile Money (MTN MoMo, Orange Money), bank transfer, and major credit/debit cards.',
  },
  {
    q: 'What is AI candidate matching?',
    a: 'Our algorithm scores each applicant against your listing requirements and ranks them by relevance, saving your team hours of manual screening.',
  },
  {
    q: 'How do I get a custom Enterprise quote?',
    a: "Contact our sales team via the Contact page or click 'Contact Sales' on the Enterprise plan. We'll respond within one business day.",
  },
];

export default function PricingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-sand-50 min-h-screen">
      {/* Hero */}
      <section className="relative bg-forest-950 py-24 text-center text-white overflow-hidden border-b border-forest-900">
        <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-6">
          <motion.span
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-[#b4f05b] mb-4">
            <Zap size={12} className="text-lime-500" /> Pricing
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black leading-tight tracking-tight">
            Simple, transparent<br />
            <span className="text-lime-500 relative inline-block">
              pricing plans
              <span className="absolute bottom-1 left-0 w-full h-1 bg-lime-500/30 rounded-sm"></span>
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="mt-6 text-white/60 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            Free for students. Affordable for companies. No hidden fees, no surprises.
          </motion.p>
        </div>
      </section>

      {/* Student plan */}
      <section className="bg-white py-16 border-b ">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f2faf6] border border-[#def2e8] text-[10px] font-bold uppercase tracking-widest text-[#226148]"><GraduationCap size={14} /> For Students</span>
            <h2 className="mt-4 text-2xl font-black text-forest-950">Always free for students</h2>
          </div>
          <div className="bg-[#f2f1ea] border border-[#e7e4d5] p-8 flex flex-col md:flex-row gap-8 items-center shadow-sm">
            <div className="flex-1 space-y-4">
              <p className="text-4xl font-black text-forest-950">Free</p>
              <p className="text-forest-800/60 text-sm leading-tight">{STUDENT_PLAN.subtitle}</p>
              <button 
                onClick={() => navigate(STUDENT_PLAN.ctaHref)}
                className="bg-forest-950 text-white font-bold text-sm px-6 py-3 rounded-lg hover:bg-forest-900 transition-all flex items-center gap-2">
                {STUDENT_PLAN.cta} <ArrowRight size={15} />
              </button>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white/50 p-6 rounded-2xl border ">
              {STUDENT_PLAN.features.map(f => (
                <div key={f.label} className="flex items-center gap-2.5 text-xs sm:text-sm text-forest-950 font-semibold">
                  <CheckCircle2 size={16} className="text-lime-600 flex-shrink-0" />
                  {f.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Company plans */}
      <section className="bg-sand-50 py-24 border-b ">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f2faf6] border border-[#def2e8] text-[10px] font-bold uppercase tracking-widest text-[#226148]"><Building2 size={14} /> For Companies</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-black text-forest-950">Plans that grow with you</h2>
            <p className="mt-4 text-forest-800/60 text-sm sm:text-base">Start free. Scale when you're ready.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {COMPANY_PLANS.map((plan, i) => (
              <div
                key={plan.name}
                className={`relative rounded-3xl p-8 flex flex-col justify-between ${
                  plan.highlight
                    ? 'bg-forest-950 text-white ring-2 ring-lime-500 shadow-xl border border-forest-900'
                    : 'bg-white border  shadow-sm'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-lime-500 text-forest-950 text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
                    {plan.badge}
                  </span>
                )}
                
                <div className="space-y-4">
                  <p className={`text-xs font-extrabold uppercase tracking-widest ${plan.highlight ? 'text-lime-400' : 'text-forest-700'}`}>
                    {plan.name}
                  </p>
                  <div className="flex items-end gap-1 pt-2">
                    {plan.price !== 'Custom' && (
                      <span className={`text-[10px] font-bold ${plan.highlight ? 'text-white/50' : 'text-forest-800/40'}`}>FCFA</span>
                    )}
                    <p className={`text-4xl font-black ${plan.highlight ? 'text-white' : 'text-forest-950'}`}>
                      {plan.price === '0' ? 'Free' : plan.price}
                    </p>
                    {plan.period && (
                      <span className={`text-xs pb-1 font-semibold ${plan.highlight ? 'text-white/40' : 'text-forest-800/40'}`}>
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs leading-relaxed ${plan.highlight ? 'text-white/50' : 'text-forest-800/40'}`}>
                    {plan.subtitle}
                  </p>
                  
                  <ul className="space-y-3 pt-6 border-t ">
                    {plan.features.map(f => (
                      <li key={f.label} className="flex items-center gap-2.5 text-xs sm:text-sm">
                        {f.included ? (
                          <CheckCircle2 size={16} className="text-lime-500 flex-shrink-0" />
                        ) : (
                          <XIcon size={16} className={`flex-shrink-0 ${plan.highlight ? 'text-white/20' : 'text-forest-800/20'}`} />
                        )}
                        <span className={f.included ? (plan.highlight ? 'text-white/95 font-medium' : 'text-forest-950 font-medium') : (plan.highlight ? 'text-white/30' : 'text-forest-800/20')}>
                          {f.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <button
                    onClick={() => navigate(plan.ctaHref)}
                    className={`w-full font-bold text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                      plan.highlight
                        ? 'bg-lime-500 text-forest-950 hover:bg-lime-400 shadow-md'
                        : 'bg-forest-950 text-white hover:bg-forest-900 shadow-sm'
                    }`}
                  >
                    {plan.cta} <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f2faf6] border border-[#def2e8] text-[10px] font-bold uppercase tracking-widest text-[#226148]"><HelpCircle size={14} /> FAQ</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-black text-forest-950">Frequently asked questions</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="bg-[#f2f1ea] border border-[#e7e4d5] rounded-2xl p-6 space-y-2">
                <h3 className="font-extrabold text-forest-950 text-sm sm:text-base">{faq.q}</h3>
                <p className="text-forest-800/70 text-xs sm:text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest-900 py-24 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.02] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-6 space-y-8">
          <h2 className="text-4xl font-black tracking-tight leading-tight">
            Still have questions?
          </h2>
          <p className="text-white/60 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            Our team is happy to walk you through the right plan for your needs.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap pt-4">
            <button
              onClick={() => navigate('/contact')}
              className="bg-white text-forest-950 font-bold px-8 py-3.5 rounded-xl hover:bg-sand-100 transition-all active:scale-95 text-sm shadow-md">
              Contact Sales
            </button>
            <button
              onClick={() => navigate('/register/company')}
              className="bg-lime-500 text-forest-950 font-bold px-8 py-3.5 rounded-xl hover:bg-lime-400 transition-all active:scale-95 text-sm shadow-md">
              Start for Free
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
