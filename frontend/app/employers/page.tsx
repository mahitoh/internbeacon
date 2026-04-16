import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function EmployersPage() {
  return (
    <div className="bg-surface text-on-surface font-body antialiased min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[800px] flex items-center overflow-hidden bg-surface-container-low border-b border-outline-variant/10">
          <div className="absolute inset-0 architectural-grid opacity-5 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="z-10">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container/10 border border-secondary-container/20 rounded-full text-secondary font-bold text-xs tracking-widest uppercase mb-8">
                <span className="w-1.5 h-1.5 bg-secondary rounded-full" />
                Premium Talent Sourcing
              </span>
              <h1 className="text-4xl md:text-6xl font-headline font-extrabold text-on-primary-fixed leading-[1.2] tracking-tighter mb-8 max-w-2xl">
                Scale your team with Cameroon&apos;s elite talent.
              </h1>
              <p className="text-lg text-on-surface-variant max-w-md mb-12 leading-relaxed font-medium">
                We curate top-tier university students and early-career professionals through a rigorous vetting process that ensures immediate project impact.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/signup" 
                  className="bg-secondary text-white px-10 py-5 rounded-xl font-bold shadow-xl hover:bg-amber-600 transition-all scale-100 active:scale-95 text-center"
                >
                  Post Your First Role
                </Link>
                <Link 
                  href="/discover" 
                  className="bg-surface-container-lowest text-on-primary-fixed px-10 py-5 rounded-xl font-bold hover:bg-white transition-all outline outline-1 outline-outline-variant/20 text-center"
                >
                  Learn Our Method
                </Link>
              </div>
            </div>
            <div className="relative group hidden lg:block">
              <div className="rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl scale-105 transform translate-x-8 relative z-10 transition-transform duration-700 group-hover:scale-[1.07]">
                <img
                  alt="Professional in a modern office environment"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-CSpwwy3FOmZ4Y6a1YxZfPavI-6c8Km0YK-VFAb2rE-a87yzrNp5lbWQQgXz7b62Dne4azF768lTNdUICiuIKwXGG3cjgRgazUTd_qcNAKfqIqu50WuyAIzExaXgpQouehH2njvot25GraRqiCdfJCZFnyU7FGbFhtzIhHl_umqT8N427hAtqGUz-qoDc_hfWuhsYTPRS8_kFQO1kuyPsjwqJWnbmuZzuAjmBZF8xqIcbvOLnrEKgLThEzyBTrnecCcvYjfG5opY"
                />
              </div>
              {/* Decorative Element */}
              <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-secondary rounded-3xl -z-0 opacity-10 animate-pulse" />
            </div>
          </div>
        </section>

        {/* Trust & Vetting Section */}
        <section className="py-24 px-8 bg-surface">
          <div className="max-w-7xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-headline font-extrabold text-on-primary-fixed mb-4 tracking-tighter">How we verify our talent</h2>
            <div className="w-20 h-1 bg-secondary mx-auto rounded-full"></div>
          </div>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Vetting Card 1 */}
            <div className="bg-surface-container-low p-8 rounded-3xl group hover:bg-surface-container-lowest transition-all duration-500 border border-transparent hover:border-outline-variant/10 shadow-sm hover:shadow-xl">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:bg-on-primary-fixed transition-all duration-500">
                <span className="material-symbols-outlined text-secondary group-hover:text-white" style={{ fontVariationSettings: "'FILL' 1" }}>terminal</span>
              </div>
              <h3 className="text-2xl font-headline font-bold mb-4 text-on-primary-fixed">Technical Rigor</h3>
              <p className="text-on-surface-variant leading-relaxed font-medium">
                Every candidate undergoes a timed coding assessment or technical project simulation tailored to their specific discipline.
              </p>
            </div>
            {/* Vetting Card 2 */}
            <div className="bg-surface-container-low p-8 rounded-3xl group hover:bg-surface-container-lowest transition-all duration-500 border border-transparent hover:border-outline-variant/10 shadow-sm hover:shadow-xl">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:bg-on-primary-fixed transition-all duration-500">
                <span className="material-symbols-outlined text-secondary group-hover:text-white" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
              </div>
              <h3 className="text-2xl font-headline font-bold mb-4 text-on-primary-fixed">Soft Skill Audit</h3>
              <p className="text-on-surface-variant leading-relaxed font-medium">
                Communication, emotional intelligence, and cultural fit are evaluated through two rounds of behavioral interviews.
              </p>
            </div>
            {/* Vetting Card 3 */}
            <div className="bg-surface-container-low p-8 rounded-3xl group hover:bg-surface-container-lowest transition-all duration-500 border border-transparent hover:border-outline-variant/10 shadow-sm hover:shadow-xl">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:bg-on-primary-fixed transition-all duration-500">
                <span className="material-symbols-outlined text-secondary group-hover:text-white" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
              <h3 className="text-2xl font-headline font-bold mb-4 text-on-primary-fixed">Final Curated List</h3>
              <p className="text-on-surface-variant leading-relaxed font-medium">
                You only see the top 1% of applicants. We curate a list that fits your specific project needs and company culture.
              </p>
            </div>
          </div>
        </section>

        {/* Talent Highlights */}
        <section className="py-24 bg-on-primary-fixed text-white overflow-hidden relative">
          <div className="absolute inset-0 architectural-grid opacity-5 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-8 mb-16 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-secondary font-bold tracking-[.3em] uppercase text-xs mb-3 block">Our Expertise</span>
              <h2 className="text-3xl md:text-4xl font-headline font-extrabold tracking-tighter">Available Talent Spire</h2>
            </div>
            <Link href="/browse" className="text-secondary-fixed-dim font-bold hover:text-white transition-colors flex items-center gap-2 group">
              View all specializations
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 max-w-[1600px] mx-auto border-y border-white/10 relative z-10">
            {/* Engineering */}
            <div className="relative group h-[600px] overflow-hidden">
              <img
                alt="Software engineering talent"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAY-iYY4OUYqz_hJaw289jtVsiEEBhNHavBSUOFD6bSJZMnkQJ_eAybVwoPYPfzUinsZNTfjkM2to_Ch_8Y_n_lF3mIxsiIQKoZyW22Rh6ySUrSKauRAXh1OXcQL4pJQsWvPYQBrc0yCfcYvyRSfmJk_QRNWmZaq5GDO_Qo2qF4onj4t9kgpCo5IR8t8qBdPFA-wnl059ttFH_ANXArlKEpJob_a2d7-InF5cD8Yk410HB2q7pbubHms9ndHfA5h4ISO3Hl2TOuDI"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-container via-primary-container/20 to-transparent" />
              <div className="absolute bottom-12 left-12">
                <div className="inline-flex items-center gap-2 bg-secondary text-on-primary-fixed text-[10px] font-black uppercase tracking-[.2em] px-4 py-1.5 rounded-full mb-6">
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Vetted Elite
                </div>
                <h4 className="text-4xl font-headline font-extrabold tracking-tight">Engineering</h4>
                <p className="text-white/60 mt-3 font-medium text-lg">Full-stack, Mobile, DevOps & AI</p>
              </div>
            </div>
            {/* Design */}
            <div className="relative group h-[600px] overflow-hidden">
              <img
                alt="Design talent"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKPKSwKx906a3eJfFRdDXJ9ZTrEbA6vU_o3buh-kBn6fQCLY0pbnBtDrL3h7RMKyf6asXDUt4-rigyYv2l5rYFHmL7rWVaz7Djzqqm0_JfHZ8kjQl-QKi7fNKCKZ2fZRMue4W1ju4D_msTFXtEoYAf-VoKaEF1p8RRaqMWNtBgXNowzGvHJ8E1Z7CTipkBqPna_E1fd8HSBdbNG_9g7_-dqpHbolxM089QaTOvCEUoX6_T4eFMd4K1ZH0mF5oi-5byERjUq8wrWj8"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-container via-primary-container/20 to-transparent" />
              <div className="absolute bottom-12 left-12">
                <div className="inline-flex items-center gap-2 bg-secondary text-on-primary-fixed text-[10px] font-black uppercase tracking-[.2em] px-4 py-1.5 rounded-full mb-6">
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Vetted Elite
                </div>
                <h4 className="text-4xl font-headline font-extrabold tracking-tight">Design</h4>
                <p className="text-white/60 mt-3 font-medium text-lg">UX/UI, Product, & Brand Identity</p>
              </div>
            </div>
            {/* Marketing */}
            <div className="relative group h-[600px] overflow-hidden">
              <img
                alt="Marketing talent"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRYtgrNIKAdnHxsYgnHfmxC1Sptz4ffMojK0qXjNo2KgaNzA9yqiu9a83K0krewgk4tUf-loIdj-u-GvS8jqTQ6yNYMlcWqNvVW9aBatdmdf3tQbMXvaZ2mGa3_TbPFJ8CX-raQ6Va_8mKxtz5GvmnWhOGiyf5jkfANEeuFa66yAbnXdrX_AtdWPPmaxrMRrm2-nyfqqSoPwv391Xaa6iqmgg7saG64Pyue7hyZO09fYq4FCjzcQMt08hqXo-o2L4M6q_iUtGOUTc"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-container via-primary-container/20 to-transparent" />
              <div className="absolute bottom-12 left-12">
                <div className="inline-flex items-center gap-2 bg-secondary text-on-primary-fixed text-[10px] font-black uppercase tracking-[.2em] px-4 py-1.5 rounded-full mb-6">
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Vetted Elite
                </div>
                <h4 className="text-4xl font-headline font-extrabold tracking-tight">Marketing</h4>
                <p className="text-white/60 mt-3 font-medium text-lg">Growth, Analytics & Content strategy</p>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Structures Section */}
        <section className="py-24 px-8 bg-surface">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-secondary font-bold tracking-[.3em] uppercase text-xs mb-3 block">Hiring Modules</span>
              <h2 className="text-3xl md:text-4xl font-headline font-extrabold text-on-primary-fixed mb-4 tracking-tighter">Investment Structures</h2>
              <p className="text-on-surface-variant max-w-xl mx-auto text-base font-medium">
                Tailored hiring models for growing startups and established enterprises in Cameroon.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {/* Basic Plan */}
              <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/10 flex flex-col hover:shadow-lg transition-shadow">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-8 opacity-60">Standard Access</div>
                <h3 className="text-3xl font-headline font-extrabold mb-6 text-on-primary-fixed">Basic</h3>
                <div className="flex items-baseline gap-2 mb-10">
                  <span className="text-5xl font-extrabold font-headline text-on-primary-fixed">50K</span>
                  <span className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">FCFA / Post</span>
                </div>
                <ul className="space-y-6 mb-12 flex-grow">
                  {[
                    "30-day listing visibility",
                    "Access to basic vetting scores",
                    "Email support",
                    "Direct student messaging"
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-4 text-sm font-semibold text-on-surface-variant">
                      <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="w-full py-5 rounded-2xl font-bold bg-white text-on-primary-fixed outline outline-1 outline-outline-variant/20 hover:bg-slate-50 transition-all text-center">
                  Choose Basic
                </Link>
              </div>
              
              {/* Pro Plan */}
              <div className="bg-primary-container p-8 rounded-[2rem] relative overflow-hidden shadow-2xl scale-105 z-10 flex flex-col border border-white/5">
                <div className="absolute top-0 right-0 bg-secondary px-6 py-2 text-[10px] font-black uppercase text-on-primary-fixed tracking-widest">Most Popular</div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 mb-8">Concierge Support</div>
                <h3 className="text-3xl font-headline font-extrabold mb-6 text-white">Pro</h3>
                <div className="flex items-baseline gap-2 mb-10 text-white">
                  <span className="text-5xl font-extrabold font-headline">250K</span>
                  <span className="text-sm font-bold uppercase tracking-widest opacity-60">FCFA / Quarter</span>
                </div>
                <ul className="space-y-6 mb-12 flex-grow">
                  {[
                    "Unlimited talent listings",
                    "Direct recruiter matchmaking",
                    "Personality fit assessments",
                    "Priority hiring status",
                    "Dedicated account success lead"
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-4 text-sm font-semibold text-white/90">
                      <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="w-full py-5 rounded-2xl font-bold bg-secondary text-on-primary-fixed hover:bg-amber-400 transition-all text-center shadow-lg shadow-secondary/20">
                  Start Pro Experience
                </Link>
              </div>
              
              {/* Enterprise Plan */}
              <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/10 flex flex-col hover:shadow-lg transition-shadow">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-8 opacity-60">Volume Hiring</div>
                <h3 className="text-3xl font-headline font-extrabold mb-6 text-on-primary-fixed">Enterprise</h3>
                <div className="flex items-baseline gap-2 mb-10 text-on-primary-fixed">
                  <span className="text-4xl font-extrabold font-headline">Custom</span>
                </div>
                <ul className="space-y-6 mb-12 flex-grow">
                  {[
                    "Custom vetting environments",
                    "Dedicated Account Architect",
                    "Employer branding spotlight",
                    "API access for ATS integration",
                    "Volume discount structures"
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-4 text-sm font-semibold text-on-surface-variant">
                      <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="w-full py-5 rounded-2xl font-bold bg-white text-on-primary-fixed outline outline-1 outline-outline-variant/20 hover:bg-slate-50 transition-all text-center">
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-40 bg-surface-container-low relative overflow-hidden border-t border-outline-variant/10">
          <div className="absolute inset-0 architectural-grid opacity-5 pointer-events-none" />
          <div className="max-w-4xl mx-auto px-8 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-on-primary-fixed mb-10 tracking-tighter leading-tight">
              Ready to architect your future team?
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/signup"
                className="bg-primary-container text-white px-12 py-6 rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-xl"
              >
                Get Started Now
              </Link>
              <Link
                href="/employer/dashboard"
                className="bg-transparent text-on-primary-fixed border-2 border-primary-container px-12 py-6 rounded-2xl font-bold text-lg hover:bg-white transition-all"
              >
                Schedule a Demo
              </Link>
            </div>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-3xl" />
          <div className="absolute top-0 right-0 w-64 h-64 border-t-8 border-r-8 border-secondary/10 m-12 opacity-50" />
        </section>
      </main>

      <Footer />
    </div>
  );
}
