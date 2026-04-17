export default function Page() {
  return (
    <>

{/* SideNavBar (Authority: Shared Components JSON) */}
<aside className="fixed left-0 top-0 h-screen w-64 border-r-0 bg-slate-50 dark:bg-slate-900 flex flex-col py-8 px-6 z-50">
<div className="mb-10">
<h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">InternBeacon</h1>
<p className="text-xs text-on-primary-container font-medium uppercase tracking-widest mt-1">Curated Excellence</p>
</div>
<nav className="flex-1 space-y-1">
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors font-plus-jakarta text-sm font-medium" href="#">
<span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
                Dashboard
            </a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors font-plus-jakarta text-sm font-medium" href="#">
<span className="material-symbols-outlined" data-icon="description">description</span>
                Applications
            </a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors font-plus-jakarta text-sm font-medium" href="#">
<span className="material-symbols-outlined" data-icon="group">group</span>
                Talent Pool
            </a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors font-plus-jakarta text-sm font-medium" href="#">
<span className="material-symbols-outlined" data-icon="work">work</span>
                Job Postings
            </a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors font-plus-jakarta text-sm font-medium" href="#">
<span className="material-symbols-outlined" data-icon="monitoring">monitoring</span>
                Analytics
            </a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-900 dark:text-slate-50 font-bold border-r-4 border-amber-500 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors font-plus-jakarta text-sm" href="#">
<span className="material-symbols-outlined" data-icon="settings">settings</span>
                Settings
            </a>
</nav>
<div className="mt-auto pt-8 border-t border-slate-200/10">
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors font-plus-jakarta text-sm font-medium" href="#">
<span className="material-symbols-outlined" data-icon="help">help</span>
                Help Center
            </a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors font-plus-jakarta text-sm font-medium" href="#">
<span className="material-symbols-outlined" data-icon="logout">logout</span>
                Sign Out
            </a>
</div>
</aside>
{/* Main Canvas */}
<main className="ml-64 min-h-screen">
{/* TopNavBar (Authority: Shared Components JSON) */}
<header className="flex justify-between items-center w-full h-16 px-8 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-40 shadow-sm shadow-slate-200/50 dark:shadow-none">
<div className="flex items-center bg-surface-container-low px-4 py-1.5 rounded-full w-full max-w-md">
<span className="material-symbols-outlined text-outline text-sm" data-icon="search">search</span>
<input className="bg-transparent border-none focus:ring-0 text-sm font-body w-full" placeholder="Search activities or talent..." type="text"/>
</div>
<div className="flex items-center gap-6">
<div className="flex items-center gap-4">
<button className="relative p-2 text-amber-600 dark:text-amber-500 hover:text-slate-900 transition-all focus:ring-2 ring-slate-900/10">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
<span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full border-2 border-white"></span>
</button>
<button className="p-2 text-slate-600 hover:text-slate-900 transition-all">
<span className="material-symbols-outlined" data-icon="chat_bubble">chat_bubble</span>
</button>
<button className="p-2 text-slate-600 hover:text-slate-900 transition-all">
<span className="material-symbols-outlined" data-icon="account_circle">account_circle</span>
</button>
</div>
</div>
</header>
{/* Notification Content */}
<div className="p-12 max-w-5xl mx-auto">
<div className="flex justify-between items-end mb-12">
<div>
<h2 className="text-4xl font-extrabold tracking-tight text-primary font-headline">Activity Feed</h2>
<p className="text-on-tertiary-container mt-2 font-medium">Keep track of your latest talent interactions and system updates.</p>
</div>
<button className="text-sm font-semibold text-secondary hover:text-on-secondary-container transition-colors flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-low">
<span className="material-symbols-outlined text-sm" data-icon="done_all">done_all</span>
                    Mark all as read
                </button>
</div>
{/* Notifications List */}
<div className="space-y-12">
{/* Group: Today */}
<section>
<div className="flex items-center gap-4 mb-6">
<h3 className="text-xs font-bold uppercase tracking-[0.2em] text-on-tertiary-container">Today</h3>
<div className="h-[1px] flex-1 bg-surface-container-high"></div>
</div>
<div className="space-y-4">
{/* Unread Notification */}
<div className="group relative flex gap-6 p-6 bg-surface-container-lowest rounded-lg hover:bg-surface transition-all border-l-4 border-secondary shadow-sm">
<div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0 bg-surface-container-low border border-outline-variant/20">
<img className="h-full w-full object-cover" data-alt="portrait of a young professional man with a friendly smile, clean studio lighting, high-end corporate headshot style" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAy4PnY_fSQlPPSzTecmX6lMvHc-Fvrbm03bs84CEAFdGFUpztpNO_7K3ndvFYNQjDrfs9pFzB5ORa_otKZAOBgLeEmAoRNmzjeK3oDWio5AcOlr3qip0u7-7CrbsJqRwLz9OR3hBPjzcrvzCgxT2TqrjnCT74Vr0OYBD4nO1oNTLS1L8mVwvgAE9EmbmqlMpunVNAwsZNgmhrkz3apNiDWCrfPBh8pDdEQR_Y1O2-EW0CudVWtB5Xs43oiBWMFuxEDy8RM54o9tLw"/>
</div>
<div className="flex-1">
<div className="flex justify-between items-start">
<div>
<p className="font-semibold text-primary leading-snug">
                                            Alex Rivers <span className="font-normal text-on-surface-variant">applied for</span> Senior Product Designer
                                        </p>
<p className="text-sm text-on-tertiary-container mt-1">"I've been following InternBeacon's growth and would love to bring my expertise to the team..."</p>
</div>
<span className="text-[10px] font-bold text-on-tertiary-container uppercase tracking-wider">2h ago</span>
</div>
<div className="mt-4 flex gap-3">
<span className="bg-tertiary-container text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">High Match</span>
<span className="bg-surface-container-low text-on-surface-variant px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Vetted</span>
</div>
</div>
<div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="p-2 text-outline hover:text-primary"><span className="material-symbols-outlined" data-icon="more_horiz">more_horiz</span></button>
</div>
</div>
{/* Regular Notification */}
<div className="group relative flex gap-6 p-6 bg-surface-container-low/50 rounded-lg hover:bg-surface-container-low transition-all border-l-4 border-transparent">
<div className="flex h-12 w-12 rounded-full bg-secondary-container/20 items-center justify-center flex-shrink-0">
<span className="material-symbols-outlined text-secondary" data-icon="bolt">bolt</span>
</div>
<div className="flex-1">
<div className="flex justify-between items-start">
<div>
<p className="font-semibold text-primary leading-snug">System Update: New Analytics V2 is live</p>
<p className="text-sm text-on-tertiary-container mt-1">Explore the revamped talent performance metrics in your dashboard.</p>
</div>
<span className="text-[10px] font-bold text-on-tertiary-container uppercase tracking-wider">5h ago</span>
</div>
</div>
</div>
</div>
</section>
{/* Group: This Week */}
<section>
<div className="flex items-center gap-4 mb-6">
<h3 className="text-xs font-bold uppercase tracking-[0.2em] text-on-tertiary-container">This Week</h3>
<div className="h-[1px] flex-1 bg-surface-container-high"></div>
</div>
<div className="space-y-4">
{/* Unread Notification (Blue Dot Style) */}
<div className="group relative flex gap-6 p-6 bg-surface-container-lowest rounded-lg hover:bg-surface transition-all border-l-4 border-secondary shadow-sm">
<div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0 bg-surface-container-low border border-outline-variant/20">
<img className="h-full w-full object-cover" data-alt="professional woman in her late 20s, neutral background, editorial lighting, confident expression" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpOXEbsl3IjiY03z80USvyQeWV1Rxrl-yjbnePQvgGKXM7TNO8y94fvm9QkG9RsZVgtHrU8N-NIXr5pSwCM2eK__e-lGdRd7ae5KXjOZmsQ3BqJ3QoMvVRm6YS8q5lRltFCzsmnw8f09C76hqkf1ejHSUoMdLDDO_E1wR5nnVb2Cn9_G-T8rktxkjRKZfPyBoz_RmgrjALPCl_RQ7s4yizJ0dSw6bNSN3r8UzLlb21LnX4GW-1eSwOf3zj8_317QemAE9yTFAgzNc"/>
</div>
<div className="flex-1">
<div className="flex justify-between items-start">
<div>
<p className="font-semibold text-primary leading-snug">
                                            Sarah Chen <span className="font-normal text-on-surface-variant">scheduled an interview for</span> Tuesday at 10:00 AM
                                        </p>
</div>
<span className="text-[10px] font-bold text-on-tertiary-container uppercase tracking-wider">2d ago</span>
</div>
<div className="mt-4">
<button className="text-xs font-bold text-on-primary-fixed bg-primary-fixed px-4 py-2 rounded-full hover:bg-primary-container hover:text-white transition-colors">Add to Calendar</button>
</div>
</div>
</div>
<div className="group relative flex gap-6 p-6 bg-surface-container-low/50 rounded-lg hover:bg-surface-container-low transition-all border-l-4 border-transparent">
<div className="flex h-12 w-12 rounded-full bg-on-tertiary-container/10 items-center justify-center flex-shrink-0 text-on-tertiary-container">
<span className="material-symbols-outlined" data-icon="mail">mail</span>
</div>
<div className="flex-1">
<div className="flex justify-between items-start">
<div>
<p className="font-semibold text-primary leading-snug">Weekly Talent Report</p>
<p className="text-sm text-on-tertiary-container mt-1">Your summary of the top 15 candidates matching your open roles is ready.</p>
</div>
<span className="text-[10px] font-bold text-on-tertiary-container uppercase tracking-wider">4d ago</span>
</div>
</div>
</div>
</div>
</section>
{/* Group: Older */}
<section>
<div className="flex items-center gap-4 mb-6">
<h3 className="text-xs font-bold uppercase tracking-[0.2em] text-on-tertiary-container">Older</h3>
<div className="h-[1px] flex-1 bg-surface-container-high"></div>
</div>
<div className="space-y-4">
<div className="group relative flex gap-6 p-6 bg-surface-container-low/30 rounded-lg hover:bg-surface-container-low transition-all">
<div className="flex h-12 w-12 rounded-full bg-on-tertiary-container/10 items-center justify-center flex-shrink-0 text-on-tertiary-container">
<span className="material-symbols-outlined" data-icon="verified_user">verified_user</span>
</div>
<div className="flex-1">
<div className="flex justify-between items-start">
<div>
<p className="font-semibold text-primary leading-snug">Security Checkpoint</p>
<p className="text-sm text-on-tertiary-container mt-1">New login detected from San Francisco, CA. If this wasn't you, please change your password.</p>
</div>
<span className="text-[10px] font-bold text-on-tertiary-container uppercase tracking-wider">Aug 12</span>
</div>
</div>
</div>
{/* Infinite Scroll Loader */}
<div className="py-12 flex flex-col items-center justify-center gap-4">
<div className="w-8 h-8 border-4 border-surface-container-high border-t-secondary rounded-full animate-spin"></div>
<p className="text-xs font-bold text-on-tertiary-container uppercase tracking-widest">Loading earlier activity</p>
</div>
</div>
</section>
</div>
</div>
{/* FAB (Conditionally suppressed based on prompt - but for dashboard/nav context it can appear if relevant. Here, we prioritize focus on content) */}
</main>
{/* Curator Insight Panel (Asymmetric Editorial Element) */}
<aside className="fixed right-8 top-32 w-72 hidden xl:block">
<div className="bg-surface-container-low p-8 rounded-lg relative overflow-hidden">
<div className="absolute -right-12 -top-12 w-32 h-32 bg-secondary-container/10 rounded-full blur-3xl"></div>
<span className="text-[10px] font-extrabold text-secondary uppercase tracking-[0.2em] mb-4 block">Curator Insight</span>
<h4 className="text-lg font-bold text-primary mb-3 leading-tight">Your response rate is up by 14%</h4>
<p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                Engaging with notifications within 4 hours significantly increases talent retention.
            </p>
<div className="h-1 w-full bg-surface-container-high rounded-full">
<div className="h-1 w-3/4 bg-secondary rounded-full"></div>
</div>
<p className="text-[10px] font-bold text-on-tertiary-container mt-4 uppercase tracking-wider">Excellence Level: Elite</p>
</div>
</aside>

</>
  )
}
