export default function Page() {
  return (
    <>

{/* SideNavBar Integration */}
<aside className="fixed inset-y-0 left-0 flex flex-col h-full py-8 px-6 bg-slate-50 dark:bg-slate-900 h-screen w-64 border-r-0 font-plus-jakarta text-sm font-medium z-50">
<div className="mb-10">
<h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">InternBeacon</h1>
<p className="text-[10px] uppercase tracking-widest text-slate-400 mt-1">Curated Excellence</p>
</div>
<nav className="flex-1 space-y-1">
<a className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors" href="#">
<span className="material-symbols-outlined">dashboard</span>
                Dashboard
            </a>
<a className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors" href="#">
<span className="material-symbols-outlined">description</span>
                Applications
            </a>
<a className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors" href="#">
<span className="material-symbols-outlined">group</span>
                Talent Pool
            </a>
<a className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors" href="#">
<span className="material-symbols-outlined">work</span>
                Job Postings
            </a>
<a className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors" href="#">
<span className="material-symbols-outlined">monitoring</span>
                Analytics
            </a>
{/* Active Navigation State for Settings */}
<a className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-900 dark:text-slate-50 font-bold border-r-4 border-amber-500 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors" href="#">
<span className="material-symbols-outlined">settings</span>
                Settings
            </a>
</nav>
<div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800 space-y-1">
<a className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors" href="#">
<span className="material-symbols-outlined">help</span>
                Help Center
            </a>
<a className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors" href="#">
<span className="material-symbols-outlined">logout</span>
                Sign Out
            </a>
</div>
</aside>
{/* TopNavBar Integration */}
<header className="fixed top-0 right-0 left-64 flex justify-between items-center h-16 px-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-40 shadow-sm shadow-slate-200/50 dark:shadow-none">
<div className="flex items-center w-96 relative">
<span className="material-symbols-outlined absolute left-3 text-slate-400 text-lg">search</span>
<input className="w-full bg-slate-50 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-slate-900/10 transition-all outline-none" placeholder="Search talent, roles, or insights..." type="text"/>
</div>
<div className="flex items-center gap-6">
<button className="relative text-slate-600 hover:text-slate-900 transition-all">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
</button>
<button className="text-slate-600 hover:text-slate-900 transition-all">
<span className="material-symbols-outlined">chat_bubble</span>
</button>
<div className="flex items-center gap-3 pl-4 border-l border-slate-200">
<div className="text-right">
<p className="text-xs font-bold text-slate-900">Alex Rivers</p>
<p className="text-[10px] text-slate-500">Talent Lead</p>
</div>
<img alt="User avatar" className="w-10 h-10 rounded-full object-cover ring-2 ring-white" data-alt="Professional headshot of a recruitment manager in a modern office setting with natural lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQxHH4lpAV0weN5qAGKTVGNAXK9YnLHbBYWcAUfwAuAf7AGfTyB8O6xYsRajr_lShoYI2JYfNcFHBLfDmX4AOBQ-r8B3ftDRWHPL7YfqKrDbv0o8Kh1Y1E3oUZeqYBv63Ks5KoGa2J66qNksjPfaEfr0eYGV7Xlmu8k9Ui91W7z6tRvQ6_YKzt-pNAEzm_v-KFzDD7KTDfnv9pMnceO2EGYnCjBpdVZsHR2KnsPeIAClwzAV9uaDUVQDpRKKiwmWhaxqGmfJnPy9s"/>
</div>
</div>
</header>
{/* Main Content Canvas */}
<main className="ml-64 pt-24 pb-16 px-12">
{/* Success Toast (Hidden by default, shown here for visualization) */}
<div className="fixed top-8 right-8 z-50 flex items-center gap-4 bg-primary-container text-white px-6 py-4 rounded-xl shadow-2xl animate-bounce-slow">
<span className="material-symbols-outlined text-secondary-container">check_circle</span>
<div>
<p className="font-bold text-sm">Changes Saved</p>
<p className="text-xs text-on-primary-container">Company profile has been updated successfully.</p>
</div>
</div>
<div className="max-w-5xl mx-auto">
{/* Header Section */}
<div className="flex justify-between items-end mb-12">
<div className="space-y-2">
<nav className="flex items-center gap-2 text-xs text-on-primary-container font-medium uppercase tracking-widest mb-4">
<span>Settings</span>
<span className="material-symbols-outlined text-[10px]">chevron_right</span>
<span className="text-on-surface">Employer Profile</span>
</nav>
<h2 className="text-5xl font-extrabold font-headline tracking-tighter text-tertiary-container">Employer Profile</h2>
<p className="text-outline max-w-md font-medium">Manage your organization's identity and global presence across the InternBeacon network.</p>
</div>
<button className="bg-secondary-container text-on-secondary-fixed px-8 py-3 rounded-lg font-bold text-sm hover:scale-[0.98] transition-transform flex items-center gap-2">
<span className="material-symbols-outlined text-lg">save</span>
                    Update Profile
                </button>
</div>
{/* Profile Bento Grid */}
<div className="grid grid-cols-12 gap-8">
{/* Left Column: Branding */}
<div className="col-span-12 md:col-span-4 space-y-8">
<div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm ghost-border flex flex-col items-center text-center">
<div className="relative group cursor-pointer mb-6">
<div className="w-32 h-32 rounded-xl bg-surface-container overflow-hidden ring-4 ring-white shadow-lg">
<img alt="Company logo" className="w-full h-full object-cover" data-alt="Minimalist abstract corporate logo featuring geometric blue shapes on a clean white background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4l7a0evxRepsVamKdweNG_fnPRJKNmsobg1oyy2zx9amTb2GJ8AUT20x5uGxbTk58AtsNJc5slB__1Uanq5B1kbYRAbfAfxPdnefyRt2GwLi2MXue7IF0Vxu4rt0ERMlDNdq72oI1AAKL0G4-SbqaCGS_EVRlrNq8BplF2MmPNoVIlnl5XJ6iomRr1P6jKa4qsXjTjqyJJVobiHU0Cx2bKICKMv4-gCEaIJn8pk7ka8qNin-o1AUla_yhAsAuQ2RUmNEJaApUm6c"/>
</div>
<div className="absolute inset-0 bg-primary-container/60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity">
<span className="material-symbols-outlined text-white">photo_camera</span>
</div>
</div>
<h3 className="font-bold font-headline text-xl text-tertiary-container">Lumina Tech Systems</h3>
<p className="text-sm text-outline mb-6">Established 2018</p>
<div className="w-full h-px bg-surface-container mb-6"></div>
<div className="w-full space-y-4">
<div className="flex justify-between items-center text-sm">
<span className="text-outline">Profile Strength</span>
<span className="font-bold text-secondary">85%</span>
</div>
<div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
<div className="bg-secondary-container h-full w-[85%]"></div>
</div>
</div>
</div>
<div className="bg-tertiary-container p-8 rounded-lg text-white">
<span className="material-symbols-outlined text-secondary-container mb-4 text-3xl">verified</span>
<h4 className="font-bold font-headline text-lg mb-2">Vetted Employer</h4>
<p className="text-xs text-on-tertiary-container leading-relaxed">Your profile is currently verified. This badge increases your visibility to premium talent by 40%.</p>
</div>
</div>
{/* Right Column: Details Form */}
<div className="col-span-12 md:col-span-8 bg-surface-container-low rounded-lg p-1">
<div className="bg-surface-container-lowest h-full rounded-[0.8rem] p-10">
<form className="space-y-10">
{/* Section: Core Details */}
<section>
<div className="flex items-center gap-3 mb-8">
<span className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center">
<span className="material-symbols-outlined text-lg text-primary">business</span>
</span>
<h3 className="font-bold font-headline text-lg">Organizational Identity</h3>
</div>
<div className="grid grid-cols-2 gap-6">
<div className="col-span-2">
<label className="block text-xs font-bold uppercase tracking-widest text-outline mb-2 ml-1">Company Legal Name</label>
<input className="w-full bg-surface-container-low border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary-container transition-all ghost-border" type="text" defaultValue="Lumina Tech Systems Inc."/>
</div>
<div>
<label className="block text-xs font-bold uppercase tracking-widest text-outline mb-2 ml-1">Industry Sector</label>
<div className="relative">
<select className="w-full bg-surface-container-low border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary-container transition-all ghost-border appearance-none">
<option>Cloud Computing &amp; SaaS</option>
<option>Artificial Intelligence</option>
<option>FinTech</option>
<option>Renewable Energy</option>
</select>
<span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
</div>
</div>
<div>
<label className="block text-xs font-bold uppercase tracking-widest text-outline mb-2 ml-1">Company Size</label>
<div className="relative">
<select className="w-full bg-surface-container-low border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary-container transition-all ghost-border appearance-none">
<option>50 - 200 employees</option>
<option>201 - 500 employees</option>
<option>501 - 1000 employees</option>
<option>1000+ employees</option>
</select>
<span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
</div>
</div>
</div>
</section>
{/* Section: Global Presence */}
<section>
<div className="flex items-center gap-3 mb-8">
<span className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center">
<span className="material-symbols-outlined text-lg text-primary">location_on</span>
</span>
<h3 className="font-bold font-headline text-lg">Global Presence</h3>
</div>
<div className="space-y-6">
<div className="relative group">
<label className="block text-xs font-bold uppercase tracking-widest text-outline mb-2 ml-1">Headquarters Location</label>
<div className="flex gap-2">
<input className="flex-1 bg-surface-container-low border-2 border-error/20 rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary-container transition-all" type="text" defaultValue="San Francisco, CA"/>
<button className="bg-surface-container-high px-4 rounded-lg" type="button">
<span className="material-symbols-outlined text-primary">map</span>
</button>
</div>
{/* Error State Message */}
<p className="text-[10px] text-error font-bold mt-2 flex items-center gap-1">
<span className="material-symbols-outlined text-xs">error</span>
                                            Address must be specific (Street, City, Zip)
                                        </p>
</div>
<div>
<label className="block text-xs font-bold uppercase tracking-widest text-outline mb-2 ml-1">Company Website</label>
<div className="relative">
<span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline text-sm">https://</span>
<input className="w-full bg-surface-container-low border-none rounded-lg p-4 pl-16 text-sm focus:ring-2 focus:ring-primary-container transition-all ghost-border" type="text" defaultValue="lumina-tech.systems"/>
</div>
</div>
</div>
</section>
{/* Section: Bio */}
<section>
<div className="flex items-center gap-3 mb-8">
<span className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center">
<span className="material-symbols-outlined text-lg text-primary">auto_awesome</span>
</span>
<h3 className="font-bold font-headline text-lg">Company Manifesto</h3>
</div>
<textarea className="w-full bg-surface-container-low border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary-container transition-all ghost-border" placeholder="Describe your company culture, mission, and what you look for in talent..." rows={4}></textarea>
<p className="text-[10px] text-outline mt-2 text-right">0 / 500 characters</p>
</section>
</form>
</div>
</div>
</div>
{/* Asymmetric Grid Section: Perks / Culture */}
<div className="mt-16 grid grid-cols-12 gap-8">
<div className="col-span-12 md:col-span-7 bg-surface-container rounded-lg p-10 flex flex-col justify-between min-h-[300px]">
<div>
<h4 className="font-extrabold font-headline text-3xl tracking-tight mb-4 text-tertiary-container">Workplace Culture</h4>
<p className="text-outline leading-relaxed max-w-lg mb-8">Define the intangible benefits of working at your organization. From remote flexibility to learning stipends, tell talent why they should choose you.</p>
</div>
<div className="flex flex-wrap gap-3">
<span className="px-4 py-2 bg-surface-container-lowest text-primary rounded-full text-xs font-bold ghost-border flex items-center gap-2">
<span className="material-symbols-outlined text-sm">remote_gen</span> Remote-First
                        </span>
<span className="px-4 py-2 bg-surface-container-lowest text-primary rounded-full text-xs font-bold ghost-border flex items-center gap-2">
<span className="material-symbols-outlined text-sm">school</span> Learning Budget
                        </span>
<span className="px-4 py-2 bg-surface-container-lowest text-primary rounded-full text-xs font-bold ghost-border flex items-center gap-2">
<span className="material-symbols-outlined text-sm">health_and_safety</span> Global Healthcare
                        </span>
<button className="px-4 py-2 bg-primary-container text-white rounded-full text-xs font-bold flex items-center gap-2">
<span className="material-symbols-outlined text-sm">add</span> Add Perk
                        </button>
</div>
</div>
<div className="col-span-12 md:col-span-5 relative group overflow-hidden rounded-lg min-h-[300px]">
<img alt="Office space" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-alt="Modern high-end open plan office with large windows, designer furniture, and lush indoor plants" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA68RbD4UuzbtvsOtDv0sDtJsT5wY-I7BGj0kIiRZlLvOlkhPZWn6ayaxoNQwx4P_R-bqNdD47cgeAzpcNY7KIEreSO2nqxI1Xdzu5pF5Qrab3_3-6g-VtzVTR_tNlt-FVswqCa1w25gehyHFtisQvQPVD_W0Gd4-zv8mXvE5Djf3v3eYHkON6Xf-Ol90JLtvmMnivyddBKJ6EukaSuleToLWoLPDcE-7WCPuN0ZySmsy_gVfT_HdlXs1I49gVdBh5ot_95BTm4QUM"/>
<div className="absolute inset-0 bg-gradient-to-t from-primary-container/80 to-transparent flex flex-col justify-end p-8 text-white">
<p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 opacity-80 text-secondary-container">Gallery Spotlight</p>
<h5 className="font-bold font-headline text-xl">San Francisco Office</h5>
<p className="text-xs text-on-tertiary-container mt-2">A workspace designed for collaboration and architectural clarity.</p>
</div>
</div>
</div>
</div>
</main>
{/* Footer Action Bar (Contextual) */}
<div className="fixed bottom-0 right-0 left-64 h-20 glass-nav border-t border-surface-container-high flex items-center justify-between px-12 z-40">
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-error animate-pulse"></div>
<p className="text-xs font-medium text-outline">Unsaved changes detected in Headquarters Location</p>
</div>
<div className="flex gap-4">
<button className="px-6 py-2.5 text-sm font-bold text-outline hover:text-primary transition-colors">Discard</button>
<button className="px-8 py-2.5 bg-primary-container text-white rounded-lg text-sm font-bold shadow-lg shadow-primary-container/20 hover:-translate-y-0.5 transition-all">Save Profile Changes</button>
</div>
</div>

</>
  )
}
