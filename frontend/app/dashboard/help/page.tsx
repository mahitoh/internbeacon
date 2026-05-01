import React from "react";
import Link from "next/link";

const FAQS = [
  {
    q: "How do I update my resume?",
    a: "You can update your resume by navigating to the Profile page and uploading a new PDF in the 'Curriculum Vitae' section."
  },
  {
    q: "How does the 'Vetted Talent' status work?",
    a: "Our team reviews portfolios and applications regularly. If your profile stands out, you'll receive the Vetted Talent badge, increasing your visibility to top employers."
  },
  {
    q: "Can I hide my profile from my current employer?",
    a: "Yes. Go to Settings > Privacy and you can specify companies that should not be able to view your profile."
  },
  {
    q: "How do I cancel my interview?",
    a: "Navigate to your Applications tab, select the specific application, and click 'Reschedule or Cancel' at least 24 hours before the scheduled time."
  }
];

export default function HelpPage() {
  return (
    <div className="w-full max-w-5xl">
      <div className="mb-10">
        <span className="text-[10px] uppercase tracking-[0.3em] font-black text-secondary mb-1.5 block">
          Support
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-headline">
          Help Center
        </h1>
        <p className="text-slate-500 text-sm mt-1 max-w-md">
          Get support, read our guides, and contact the team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col items-start justify-center">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-2xl text-amber-600">mail</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2 font-headline">Contact Support</h2>
          <p className="text-slate-500 text-sm mb-6">
            Our team is here to help you with any issues you encounter. We typically reply within 24 hours.
          </p>
          <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-amber-500 transition-colors mt-auto">
            Email Us
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col items-start justify-center">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-2xl text-blue-600">menu_book</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2 font-headline">Documentation</h2>
          <p className="text-slate-500 text-sm mb-6">
            Learn how to make the most of the InternBeacon platform, optimize your profile, and nail interviews.
          </p>
          <button className="bg-slate-100 text-slate-900 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors mt-auto">
            Read Guides
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6 font-headline">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {FAQS.map((faq, i) => (
            <div key={i} className="pb-6 border-b border-slate-100 last:border-0 last:pb-0">
              <h3 className="font-bold text-slate-900 text-sm mb-2">{faq.q}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
