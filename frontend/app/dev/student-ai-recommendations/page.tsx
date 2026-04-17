export default function Page() {
  return (
    <>

{/* SideNavBar Anchor */}
<aside className="fixed left-0 top-0 flex flex-col h-full py-8 px-6 bg-slate-50 dark:bg-slate-900 h-screen w-64 border-r-0 font-plus-jakarta text-sm font-medium z-50">
<div className="mb-10 px-2">
<h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">InternBeacon</h1>
<p className="text-[10px] uppercase tracking-widest text-slate-400 mt-1">Curated Excellence</p>
</div>
<nav className="flex-1 space-y-1">
<a className="flex items-center gap-3 px-4 py-3 text-slate-900 dark:text-slate-50 font-bold border-r-4 border-amber-500 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors" href="#">
<span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
        Dashboard
      </a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors" href="#">
<span className="material-symbols-outlined" data-icon="description">description</span>
        Applications
      </a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors" href="#">
<span className="material-symbols-outlined" data-icon="group">group</span>
        Talent Pool
      </a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors" href="#">
<span className="material-symbols-outlined" data-icon="work">work</span>
        Job Postings
      </a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors" href="#">
<span className="material-symbols-outlined" data-icon="monitoring">monitoring</span>
        Analytics
      </a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors" href="#">
<span className="material-symbols-outlined" data-icon="settings">settings</span>
        Settings
      </a>
</nav>
<div className="mt-auto space-y-1">
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 transition-colors" href="#">
<span className="material-symbols-outlined" data-icon="help">help</span>
        Help Center
      </a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 transition-colors" href="#">
<span className="material-symbols-outlined" data-icon="logout">logout</span>
        Sign Out
      </a>
</div>
</aside>
{/* Main Canvas */}
<main className="ml-64 min-h-screen">
{/* TopNavBar Anchor */}
<header className="flex justify-between items-center w-full h-16 px-8 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-40 shadow-sm shadow-slate-200/50 dark:shadow-none font-plus-jakarta text-sm">
<div className="flex items-center gap-4 flex-1">
<div className="relative w-full max-w-md">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
<input className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-0 rounded-full focus:ring-2 focus:ring-slate-900/10 transition-all placeholder:text-slate-400" placeholder="Search curated opportunities..." type="text"/>
</div>
</div>
<div className="flex items-center gap-6">
<button className="relative text-slate-600 hover:text-slate-900 transition-all">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
<span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full border-2 border-white"></span>
</button>
<button className="text-slate-600 hover:text-slate-900 transition-all">
<span className="material-symbols-outlined" data-icon="chat_bubble">chat_bubble</span>
</button>
<div className="h-8 w-8 rounded-full overflow-hidden bg-slate-200 ring-2 ring-slate-100">
<img alt="User profile avatar" data-alt="close-up portrait of a young professional smiling in bright studio lighting with neutral background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9qR1uei0ALRVvV-SDp_P_Fb5SyfKHUjQjgC0W7tUBBrkyUiyvCL56O9iaVLmAZWpcmTcoCWkMASFDla8-soPtuNstcIJCBp5SNTS84ZkEvX2d5-DWohHydfpIxzU-rkH3C_QwYs7fAi5eCGZmFJHyDJltZd7iOycF5FJxtOMKhEjpm1M2bIRvh3pL_VDGuKT-aTphRwzj09i9kIrfQ4ajS2z12aHA4wzpWzDMhQUWpoEodWLF83B3BRyhUnPtxK8p4s9BMEgPTsQ"/>
</div>
</div>
</header>
{/* Content Area */}
<div className="p-12 max-w-7xl mx-auto">
{/* Page Header */}
<section className="mb-12">
<h2 className="text-4xl font-extrabold tracking-tight text-primary mb-2">Curated Matches</h2>
<p className="text-on-primary-container font-medium">AI-driven recommendations based on your architectural portfolio and technical stack.</p>
</section>
{/* Matches Grid */}
<div className="grid asymmetric-grid gap-8">
{/* Match Card 1 */}
<article className="bg-surface-container-lowest rounded-lg p-8 shadow-sm group hover:shadow-md transition-shadow relative overflow-hidden">
<div className="absolute top-0 right-0 p-6">
<span className="px-3 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings: '"FILL" 1'}}>bolt</span>
              98% Match
            </span>
</div>
<div className="flex items-start gap-6 mb-8">
<div className="w-16 h-16 bg-primary-container flex items-center justify-center rounded-lg text-white">
<span className="material-symbols-outlined text-3xl" data-icon="architecture">architecture</span>
</div>
<div>
<p className="text-amber-600 text-xs font-bold tracking-widest uppercase mb-1">Featured Boutique</p>
<h3 className="text-xl font-bold text-primary">Senior Design Lead</h3>
<p className="text-on-surface-variant font-medium">Studio Vertigo • Copenhagen</p>
</div>
</div>
<div className="space-y-4 mb-8">
<p className="text-sm leading-relaxed text-on-surface-variant">
              Leading sustainable architecture firm seeking a visionary intern to support our 2024 Nordic Pavilion submission.
            </p>
<div className="flex flex-wrap gap-2">
<span className="px-3 py-1 bg-surface-container-low text-on-surface text-[11px] font-semibold rounded-full border-0">Parametric Design</span>
<span className="px-3 py-1 bg-surface-container-low text-on-surface text-[11px] font-semibold rounded-full border-0">Rhino 3D</span>
<span className="px-3 py-1 bg-surface-container-low text-on-surface text-[11px] font-semibold rounded-full border-0">Sustainable Materials</span>
</div>
</div>
<div className="pt-6 border-t border-surface-container-low">
<div className="flex items-center justify-between">
<div className="flex items-center -space-x-2">
<img alt="Recruiter" className="w-8 h-8 rounded-full ring-2 ring-white" data-alt="close-up portrait of a recruiter in professional attire with soft natural lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMShuskqpa-T_tGcgThM1eSN-jXObJahoKo4StDmXOwNAptMapMvnd4MiPNicJrer-zEFLV4ALWBHEJBK7QOEY5FuiH5Yxg5-kDnn7Gv0XAYugUSzNWBTo2kOHmSskIBgHmDovuV8Rx-1SUwSZ5aas9ym8GU9gHoy97rdW3u2lWdN2B4RW8Ieu8A-McueNHm3xav5XrXjXxpb7oNKTTVRDlMThCaBM1XOEn-ymYOyJJYSo5PhmMPJPYz_zLGeazk2Yo-dkf8kYIME"/>
<div className="pl-4 text-[11px] text-on-tertiary-container">Matched with your "Eco-Pod" project</div>
</div>
<button className="bg-primary text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-primary-container transition-colors active:scale-95 duration-150">
                Apply Now
              </button>
</div>
</div>
</article>
{/* Match Card 2 */}
<article className="bg-surface-container-lowest rounded-lg p-8 shadow-sm group hover:shadow-md transition-shadow relative overflow-hidden">
<div className="absolute top-0 right-0 p-6">
<span className="px-3 py-1.5 bg-surface-container-high text-primary text-xs font-bold rounded-full">
              92% Match
            </span>
</div>
<div className="flex items-start gap-6 mb-8">
<div className="w-16 h-16 bg-secondary-container flex items-center justify-center rounded-lg text-primary">
<span className="material-symbols-outlined text-3xl" data-icon="urban_density">high_density</span>
</div>
<div>
<p className="text-amber-600 text-xs font-bold tracking-widest uppercase mb-1">Elite Opportunity</p>
<h3 className="text-xl font-bold text-primary">Urban Systems Intern</h3>
<p className="text-on-surface-variant font-medium">Metropoli Global • London</p>
</div>
</div>
<div className="space-y-4 mb-8">
<p className="text-sm leading-relaxed text-on-surface-variant">
              Focus on transit-oriented development and data-driven urban planning for smart city initiatives.
            </p>
<div className="flex flex-wrap gap-2">
<span className="px-3 py-1 bg-surface-container-low text-on-surface text-[11px] font-semibold rounded-full border-0">GIS Analysis</span>
<span className="px-3 py-1 bg-surface-container-low text-on-surface text-[11px] font-semibold rounded-full border-0">Python</span>
<span className="px-3 py-1 bg-surface-container-low text-on-surface text-[11px] font-semibold rounded-full border-0">Smart Transit</span>
</div>
</div>
<div className="pt-6 border-t border-surface-container-low">
<div className="flex items-center justify-between">
<div className="flex items-center -space-x-2">
<img alt="Recruiter" className="w-8 h-8 rounded-full ring-2 ring-white" data-alt="woman in modern office setting looking at camera with professional expression and soft bokeh background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0JXT856hl79FXz8_8Pa3egmPVd_rp_XsFzeb2l1foKxOc0uvErHDqSBUwel-e8zBrUnAy2dOMpp3Hi_Mq69ybcOCbAtzW4i8Qo73aWaB9duxrKeRBWKYaHb9cT9g5mp5Q0n5Zhg6ASHQLXhmsCvN8zt6At5C1Omm74VACmT6Qiz11ApifRdsePVC6iQeI9O_vkKLG_kNLCk1hxzZjSuQIJGQ_wwWwHXKIQ73O7CuCtSNz4AyCByfrMkOZaO718-xn-tholKyiqT8"/>
<div className="pl-4 text-[11px] text-on-tertiary-container">Top 5% candidate for this role</div>
</div>
<button className="bg-primary text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-primary-container transition-colors active:scale-95 duration-150">
                Apply Now
              </button>
</div>
</div>
</article>
{/* Match Card 3 */}
<article className="bg-surface-container-lowest rounded-lg p-8 shadow-sm group hover:shadow-md transition-shadow relative overflow-hidden">
<div className="absolute top-0 right-0 p-6">
<span className="px-3 py-1.5 bg-surface-container-high text-primary text-xs font-bold rounded-full">
              89% Match
            </span>
</div>
<div className="flex items-start gap-6 mb-8">
<div className="w-16 h-16 bg-tertiary-container flex items-center justify-center rounded-lg text-white">
<span className="material-symbols-outlined text-3xl" data-icon="history_edu">history_edu</span>
</div>
<div>
<p className="text-on-tertiary-container text-xs font-bold tracking-widest uppercase mb-1">Cultural Sector</p>
<h3 className="text-xl font-bold text-primary">Heritage Restorer</h3>
<p className="text-on-surface-variant font-medium">The Archive Agency • Paris</p>
</div>
</div>
<div className="space-y-4 mb-8">
<p className="text-sm leading-relaxed text-on-surface-variant">
              Bridge the gap between classical masonry and modern digital scanning in the heart of historic Paris.
            </p>
<div className="flex flex-wrap gap-2">
<span className="px-3 py-1 bg-surface-container-low text-on-surface text-[11px] font-semibold rounded-full border-0">Conservation</span>
<span className="px-3 py-1 bg-surface-container-low text-on-surface text-[11px] font-semibold rounded-full border-0">Photogrammetry</span>
</div>
</div>
<div className="pt-6 border-t border-surface-container-low">
<div className="flex items-center justify-between">
<div className="flex items-center -space-x-2">
<img alt="Recruiter" className="w-8 h-8 rounded-full ring-2 ring-white" data-alt="professional woman smiling in sunlit workspace with artistic atmosphere" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFAa1_D1SutCKpbQL3aGv9Lt8KPrGypJcO8iOefJC2bcQvlbc2gUvXmMZQCzWAIEyhENpdBxgPG25W65NDroBf0yfl7o5PUkJFKMeKOSnEJO3a_fGmsJ0VbsCkPjlEMJghNxhnkI85mnz6nsfpirdpLO5Qc2A6Qa9ApPHw4fh4Tj5g1cqwqRqe7bTIwRcEgIfr05ZliChe4vtB8Csvft-nFb2F45FJ8KHQ6GnS2z1FlQ62FlgXyM4xv8iQe2WAwCZDlHK0l_y3SgA"/>
<div className="pl-4 text-[11px] text-on-tertiary-container">Relevant "Modern Ruins" research</div>
</div>
<button className="bg-primary text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-primary-container transition-colors active:scale-95 duration-150">
                Apply Now
              </button>
</div>
</div>
</article>
</div>
{/* Empty State (Hidden by default, shown if matches empty) */}
<section className="hidden flex flex-col items-center justify-center py-24 text-center">
<div className="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center mb-6">
<span className="material-symbols-outlined text-4xl text-outline" data-icon="search_off">search_off</span>
</div>
<h3 className="text-2xl font-bold text-primary mb-2">Refining Your Matches</h3>
<p className="text-on-surface-variant max-w-sm mb-8">We're currently scouring our curator network. Try updating your portfolio to unlock more targeted opportunities.</p>
<button className="bg-secondary-container text-on-secondary-container px-8 py-3 rounded-full font-bold transition-all hover:brightness-95">
          Update Profile
        </button>
</section>
</div>
{/* Curator Insight Banner (Bento style highlight) */}
<div className="px-12 pb-12 max-w-7xl mx-auto">
<div className="bg-primary-container rounded-lg p-10 flex flex-col md:flex-row items-center gap-10 text-white overflow-hidden relative">
<div className="absolute top-0 right-0 opacity-10 translate-x-1/4 -translate-y-1/4">
<span className="material-symbols-outlined text-[200px]" data-icon="stars">stars</span>
</div>
<div className="flex-1 z-10">
<h4 className="text-amber-500 font-bold uppercase tracking-[0.2em] text-xs mb-4">Curator Insight</h4>
<h2 className="text-3xl font-bold mb-4 leading-tight">Your skills in "Parametric Design" are currently trending with top firms in Scandinavia.</h2>
<p className="text-on-primary-container max-w-lg mb-0">Our AI has detected a 40% increase in demand for these specific competencies since last quarter. Consider highlighting your Rhino projects on your dashboard.</p>
</div>
<div className="flex-shrink-0 z-10">
<button className="bg-amber-500 text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform">
            View Skill Trends
          </button>
</div>
</div>
</div>
</main>
{/* FAB for Quick Actions (Contextual suppression applied elsewhere, active here) */}
<div className="fixed bottom-10 right-10 z-50">
<button className="w-16 h-16 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-xl shadow-amber-500/20 hover:scale-110 transition-transform group">
<span className="material-symbols-outlined text-3xl" data-icon="auto_awesome" style={{fontVariationSettings: '"FILL" 1'}}>auto_awesome</span>
<span className="absolute right-full mr-4 bg-primary px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">AI Recommendations</span>
</button>
</div>

</>
  )
}
