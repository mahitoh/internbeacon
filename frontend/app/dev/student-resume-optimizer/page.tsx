export default function Page() {
  return (
    <>

{/* SideNavBar (Shared Component) */}
<aside className="fixed left-0 top-0 h-screen w-64 border-r-0 bg-slate-50 dark:bg-slate-900 flex flex-col py-8 px-6 font-plus-jakarta text-sm font-medium">
<div className="mb-10">
<h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">InternBeacon</h1>
<p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mt-1">Curated Excellence</p>
</div>
<nav className="flex-1 space-y-1">
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors rounded-DEFAULT" href="#">
<span className="material-symbols-outlined">dashboard</span>
<span>Dashboard</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-900 dark:text-slate-50 font-bold border-r-4 border-amber-500 bg-slate-200/30" href="#">
<span className="material-symbols-outlined">description</span>
<span>Applications</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors rounded-DEFAULT" href="#">
<span className="material-symbols-outlined">group</span>
<span>Talent Pool</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors rounded-DEFAULT" href="#">
<span className="material-symbols-outlined">work</span>
<span>Job Postings</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors rounded-DEFAULT" href="#">
<span className="material-symbols-outlined">monitoring</span>
<span>Analytics</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors rounded-DEFAULT" href="#">
<span className="material-symbols-outlined">settings</span>
<span>Settings</span>
</a>
</nav>
<div className="mt-auto space-y-1">
<button className="w-full bg-primary-container text-white py-3 rounded-DEFAULT mb-6 font-semibold flex items-center justify-center gap-2 active:scale-95 duration-150 shadow-lg shadow-slate-900/10">
<span className="material-symbols-outlined text-amber-500">add_circle</span>
<span>Post a Role</span>
</button>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-700 transition-colors" href="#">
<span className="material-symbols-outlined">help</span>
<span>Help Center</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-700 transition-colors" href="#">
<span className="material-symbols-outlined">logout</span>
<span>Sign Out</span>
</a>
</div>
</aside>
{/* TopNavBar (Shared Component) */}
<header className="fixed top-0 right-0 left-64 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-10 flex justify-between items-center px-8 shadow-sm shadow-slate-200/50 dark:shadow-none">
<div className="flex-1 max-w-xl">
<div className="relative group">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors">search</span>
<input className="w-full bg-slate-50 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-slate-900/10 transition-all outline-none" placeholder="Search talent, roles, or insights..." type="text"/>
</div>
</div>
<div className="flex items-center gap-6 ml-8">
<button className="text-slate-600 hover:text-slate-900 transition-all relative">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute top-0 right-0 w-2 h-2 bg-amber-500 rounded-full border-2 border-white"></span>
</button>
<button className="text-slate-600 hover:text-slate-900 transition-all">
<span className="material-symbols-outlined">chat_bubble</span>
</button>
<div className="flex items-center gap-3 pl-4 border-l border-slate-100">
<div className="text-right hidden sm:block">
<p className="text-xs font-bold text-slate-900">Julian Casablancas</p>
<p className="text-[10px] text-slate-500 uppercase tracking-wider">Lead Recruiter</p>
</div>
<img alt="Profile" className="w-8 h-8 rounded-full object-cover" data-alt="professional headshot of a man with a confident expression in neutral lighting and soft background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHFPa5S9TA3mCabMa6WVIX5j7NK-YtL_IZcJHh2GG7nyyITlpivee5ffC0rfQcTB7slyNOrUTq0Z8NxfOn6IfMA83GKc-91b31WG0-PGL7v6dMzF7lOCBjgg5_FkBCFYoL97vsD4JHQ8B3sg3rYdSTrHk88489M3R5b7SRVSOZgnHINf1k0veT0eEwRy8jEiBhtcoRbnitq_mdPOIsln7tKxLOEYUkH26vo35YmCNZ9cIEv3nVn5uc4iSqx3DE51YbhFK8ycxLwaI"/>
</div>
</div>
</header>
{/* Main Content Canvas */}
<main className="ml-64 pt-24 pb-16 px-12 min-h-screen bg-surface">
<div className="max-w-6xl mx-auto">
{/* Breadcrumbs & Title */}
<div className="mb-10">
<div className="flex items-center gap-2 text-xs font-medium text-on-tertiary-container uppercase tracking-widest mb-3">
<span>Dashboard</span>
<span className="material-symbols-outlined text-[14px]">chevron_right</span>
<span className="text-on-surface">Resume Optimizer</span>
</div>
<h2 className="text-4xl font-extrabold font-headline tracking-tight text-primary">Resume Optimizer</h2>
<p className="text-on-surface-variant mt-2 max-w-2xl font-body leading-relaxed">
                    Align your candidate profile with specific job requirements using our proprietary AI analysis. Refine phrasing, highlight key competencies, and bridge experience gaps instantly.
                </p>
</div>
{/* Bento Layout Container */}
<div className="grid grid-cols-12 gap-8">
{/* Input Section */}
<div className="col-span-12 lg:col-span-5 space-y-6">
<div className="bg-surface-container-low p-1 rounded-lg">
<div className="bg-surface-container-lowest p-8 rounded-DEFAULT">
<label className="block text-xs font-bold uppercase tracking-widest text-primary mb-4">Target Job Description</label>
<textarea className="w-full h-48 bg-surface-container-low border border-transparent focus:border-primary-container/20 focus:ring-0 rounded-DEFAULT p-4 text-sm font-body transition-all resize-none" placeholder="Paste the full job description here..."></textarea>
</div>
</div>
<div className="bg-surface-container-low p-1 rounded-lg">
<div className="bg-surface-container-lowest p-8 rounded-DEFAULT">
<label className="block text-xs font-bold uppercase tracking-widest text-primary mb-4">Existing Resume Text</label>
<textarea className="w-full h-72 bg-surface-container-low border border-transparent focus:border-primary-container/20 focus:ring-0 rounded-DEFAULT p-4 text-sm font-body transition-all resize-none" placeholder="Paste your current resume content here..."></textarea>
<div className="mt-8 flex items-center justify-between">
<button className="flex items-center gap-2 text-primary/60 hover:text-primary text-sm font-semibold transition-colors">
<span className="material-symbols-outlined">upload_file</span>
<span>Upload PDF/Docx</span>
</button>
<button className="bg-secondary-container text-on-secondary-container px-8 py-4 rounded-DEFAULT font-bold text-sm flex items-center gap-2 hover:brightness-105 transition-all shadow-lg shadow-secondary-container/20 active:scale-[0.98]">
                                    Optimize Resume
                                    <span className="material-symbols-outlined">auto_awesome</span>
</button>
</div>
</div>
</div>
</div>
{/* Output Section (Loading/Results) */}
<div className="col-span-12 lg:col-span-7">
<div className="h-full min-h-[600px] bg-primary-container rounded-lg overflow-hidden flex flex-col">
{/* Header for Results */}
<div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-md">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
<span className="material-symbols-outlined text-primary-container text-lg" style={{fontVariationSettings: '"FILL" 1'}}>bolt</span>
</div>
<span className="text-white font-bold tracking-tight">AI Optimization Result</span>
</div>
<div className="flex gap-2">
<button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="Copy to clipboard">
<span className="material-symbols-outlined">content_copy</span>
</button>
<button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="Download as PDF">
<span className="material-symbols-outlined">download</span>
</button>
</div>
</div>
{/* Content Area */}
<div className="flex-1 p-8 overflow-y-auto">
{/* Shimmer Loading State (Hidden by default, shown during AI call) */}
<div className="hidden space-y-6">
<div className="h-4 w-1/3 shimmer rounded-full opacity-20"></div>
<div className="space-y-3">
<div className="h-12 w-full shimmer rounded-DEFAULT opacity-10"></div>
<div className="h-40 w-full shimmer rounded-DEFAULT opacity-10"></div>
</div>
<div className="space-y-3">
<div className="h-4 w-1/4 shimmer rounded-full opacity-20"></div>
<div className="h-4 w-full shimmer rounded-full opacity-10"></div>
<div className="h-4 w-full shimmer rounded-full opacity-10"></div>
<div className="h-4 w-4/5 shimmer rounded-full opacity-10"></div>
</div>
</div>
{/* Mock Result Content */}
<article className="prose prose-invert max-w-none space-y-8">
<section>
<h4 className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-4">Strategic Summary</h4>
<p className="text-primary-fixed-dim leading-relaxed text-sm">
                                        Tailored your professional summary to highlight the <span className="text-white font-semibold">"Cloud Architecture Transition"</span> mentioned in the JD. Enhanced the focus on microservices and cross-functional leadership which were identified as key priority areas for the hiring manager.
                                    </p>
</section>
<section>
<h4 className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-4">Optimized Experience</h4>
<div className="space-y-6">
<div className="bg-white/5 border border-white/5 p-6 rounded-DEFAULT">
<div className="flex justify-between items-start mb-2">
<h5 className="text-white font-bold">Senior Backend Engineer</h5>
<span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-1 rounded-full border border-amber-500/20">98% Match</span>
</div>
<ul className="text-primary-fixed-dim text-sm space-y-3 list-none p-0">
<li className="flex gap-3">
<span className="material-symbols-outlined text-amber-500 text-sm mt-1">check_circle</span>
<span>Engineered high-performance <strong className="text-white">Kubernetes</strong> clusters ensuring 99.99% uptime for core fintech processing pipelines.</span>
</li>
<li className="flex gap-3">
<span className="material-symbols-outlined text-amber-500 text-sm mt-1">check_circle</span>
<span>Pioneered the migration from monolithic architecture to <strong className="text-white">Event-Driven Microservices</strong>, reducing latency by 45%.</span>
</li>
<li className="flex gap-3">
<span className="material-symbols-outlined text-amber-500 text-sm mt-1">check_circle</span>
<span>Mentored a team of 12 junior developers, implementing <strong className="text-white">Agile CI/CD</strong> workflows that tripled deployment frequency.</span>
</li>
</ul>
</div>
</div>
</section>
<section>
<h4 className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-4">Skill Bridge Analysis</h4>
<div className="flex flex-wrap gap-2">
<span className="px-3 py-1 bg-white/10 text-white text-[10px] font-bold rounded-full border border-white/10">AWS Solution Arch</span>
<span className="px-3 py-1 bg-white/10 text-white text-[10px] font-bold rounded-full border border-white/10">Docker &amp; K8s</span>
<span className="px-3 py-1 bg-white/10 text-white text-[10px] font-bold rounded-full border border-white/10">Golang</span>
<span className="px-3 py-1 bg-white/10 text-white text-[10px] font-bold rounded-full border border-white/10">Redis</span>
<span className="px-3 py-1 bg-white/10 text-white text-[10px] font-bold rounded-full border border-white/10">gRPC</span>
</div>
</section>
</article>
</div>
{/* Footer CTA */}
<div className="p-6 bg-white/5 border-t border-white/5 flex items-center justify-between">
<p className="text-xs text-primary-fixed-dim italic">Analysis completed in 1.4s using BeaconAI v4.2</p>
<button className="text-white text-xs font-bold flex items-center gap-1 hover:text-amber-500 transition-colors">
                                Apply with this Resume
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
</button>
</div>
</div>
</div>
</div>
{/* Insights / Stats Row */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
<div className="bg-surface-container-low p-6 rounded-lg flex items-center gap-5">
<div className="w-12 h-12 bg-white rounded-DEFAULT flex items-center justify-center shadow-sm">
<span className="material-symbols-outlined text-primary">target</span>
</div>
<div>
<p className="text-[10px] font-bold uppercase tracking-widest text-on-tertiary-container">ATS Score</p>
<h4 className="text-2xl font-extrabold text-primary">94<span className="text-sm font-normal text-on-surface-variant">/100</span></h4>
</div>
</div>
<div className="bg-surface-container-low p-6 rounded-lg flex items-center gap-5">
<div className="w-12 h-12 bg-white rounded-DEFAULT flex items-center justify-center shadow-sm">
<span className="material-symbols-outlined text-primary">verified</span>
</div>
<div>
<p className="text-[10px] font-bold uppercase tracking-widest text-on-tertiary-container">Vetted Skills</p>
<h4 className="text-2xl font-extrabold text-primary">12 <span className="text-sm font-normal text-on-surface-variant">Confirmed</span></h4>
</div>
</div>
<div className="bg-surface-container-low p-6 rounded-lg flex items-center gap-5">
<div className="w-12 h-12 bg-white rounded-DEFAULT flex items-center justify-center shadow-sm">
<span className="material-symbols-outlined text-primary">trending_up</span>
</div>
<div>
<p className="text-[10px] font-bold uppercase tracking-widest text-on-tertiary-container">Improvement</p>
<h4 className="text-2xl font-extrabold text-primary">+28% <span className="text-sm font-normal text-on-surface-variant">Clarity</span></h4>
</div>
</div>
</div>
</div>
</main>
{/* FAB for quick actions */}
<div className="fixed bottom-8 right-8">
<button className="bg-primary text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
<span className="material-symbols-outlined">support_agent</span>
</button>
</div>

</>
  )
}
