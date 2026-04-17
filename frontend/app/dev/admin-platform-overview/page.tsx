export default function Page() {
  return (
    <>

{/* SideNavBar Component */}
<aside className="fixed inset-y-0 left-0 flex flex-col h-full py-8 px-6 bg-slate-50 dark:bg-slate-900 h-screen w-64 border-r-0 font-plus-jakarta text-sm font-medium z-50">
<div className="mb-10 px-2">
<h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">InternBeacon</h1>
<p className="text-[10px] text-slate-400 font-semibold tracking-widest mt-1">CURATED EXCELLENCE</p>
</div>
<nav className="flex-1 space-y-1">
<a className="flex items-center gap-3 px-4 py-3 text-slate-900 dark:text-slate-50 font-bold border-r-4 border-amber-500 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors active:scale-95 duration-150" href="#">
<span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span>Dashboard</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors active:scale-95 duration-150" href="#">
<span className="material-symbols-outlined" data-icon="description">description</span>
<span>Applications</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors active:scale-95 duration-150" href="#">
<span className="material-symbols-outlined" data-icon="group">group</span>
<span>Talent Pool</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors active:scale-95 duration-150" href="#">
<span className="material-symbols-outlined" data-icon="work">work</span>
<span>Job Postings</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors active:scale-95 duration-150" href="#">
<span className="material-symbols-outlined" data-icon="monitoring">monitoring</span>
<span>Analytics</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors active:scale-95 duration-150" href="#">
<span className="material-symbols-outlined" data-icon="settings">settings</span>
<span>Settings</span>
</a>
</nav>
<div className="mt-auto space-y-1">
<button className="w-full mb-6 py-3 bg-tertiary-container text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
<span>Post a Role</span>
</button>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors" href="#">
<span className="material-symbols-outlined" data-icon="help">help</span>
<span>Help Center</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors" href="#">
<span className="material-symbols-outlined" data-icon="logout">logout</span>
<span>Sign Out</span>
</a>
</div>
</aside>
{/* Main Content Area */}
<main className="flex-1 ml-64 min-h-screen">
{/* TopNavBar Component */}
<header className="flex justify-between items-center w-full h-16 px-8 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm shadow-slate-200/50 dark:shadow-none z-40 font-plus-jakarta text-sm">
<div className="flex items-center gap-4 flex-1">
<div className="relative w-full max-w-md">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" data-icon="search">search</span>
<input className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-slate-50/10 placeholder:text-slate-400" placeholder="Search analytics or candidates..." type="text"/>
</div>
</div>
<div className="flex items-center gap-6">
<div className="flex items-center gap-2 px-3 py-1 bg-surface-container text-on-surface rounded-full text-xs font-semibold">
<span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Live System Status
                </div>
<div className="flex gap-4 text-slate-600 dark:text-slate-400">
<button className="hover:text-slate-900 dark:hover:text-slate-50 transition-all flex items-center justify-center p-2 rounded-full hover:bg-surface">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
<button className="hover:text-slate-900 dark:hover:text-slate-50 transition-all flex items-center justify-center p-2 rounded-full hover:bg-surface">
<span className="material-symbols-outlined" data-icon="chat_bubble">chat_bubble</span>
</button>
<button className="hover:text-slate-900 dark:hover:text-slate-50 transition-all flex items-center justify-center">
<img alt="User profile avatar" className="w-8 h-8 rounded-full border border-slate-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbHAyCjr_cv5AYNDov0F8-oTGXT3VHIjum-lpuzF0kFmcCW7m2PUxPhBoSrMvuN4obaqND6Lb2loWr3nnUox3vT5DNCmG7YnCYb9lxHnJSnVmbUOjflqX-F-p8VRJxgSE1WwWUK-GTLVRESNJxslbTplb1AKsPt1w-6Tox5Vs0RROYNj5HzdJdzkNx7iOSuJFqXtANIKAM9_aZDDSvb60qs3KxnOdNZxyvJqV9qvrqBXrn59X6Z6KdFAPcjNXUtPV8smJVBC85HTY"/>
</button>
</div>
</div>
</header>
{/* Content Canvas */}
<div className="p-10 space-y-10 max-w-7xl mx-auto">
{/* Dashboard Header & Actions */}
<div className="flex justify-between items-end">
<div className="space-y-1">
<span className="text-amber-600 font-bold uppercase tracking-[0.2em] text-[10px]">Management Console</span>
<h2 className="text-4xl font-extrabold text-primary tracking-tight font-headline">Platform Statistics</h2>
<p className="text-on-surface-variant flex items-center gap-2">
                        Last updated: <span className="font-semibold">Oct 24, 2023 at 09:42 AM</span>
<button className="ml-2 p-1 hover:bg-surface-container rounded-full transition-colors flex items-center text-primary" title="Retry data fetch">
<span className="material-symbols-outlined text-sm" data-icon="refresh">refresh</span>
</button>
</p>
</div>
<div className="flex gap-4">
<button className="px-6 py-3 rounded-DEFAULT bg-surface-container-high text-primary font-bold hover:bg-surface-container-highest transition-colors flex items-center gap-2">
<span className="material-symbols-outlined" data-icon="download">download</span>
                        Export Report
                    </button>
<button className="px-6 py-3 rounded-DEFAULT bg-primary text-white font-bold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-slate-900/10">
<span className="material-symbols-outlined" data-icon="add">add</span>
                        New Campaign
                    </button>
</div>
</div>
{/* KPI Cards Bento Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
{/* KPI 1: Total Users */}
<div className="bg-surface-container-lowest p-8 rounded-lg flex flex-col justify-between border border-transparent shadow-sm shadow-slate-200/50 hover:shadow-md transition-shadow">
<div className="flex justify-between items-start">
<div className="p-3 bg-slate-100 rounded-lg text-primary">
<span className="material-symbols-outlined" data-icon="groups">groups</span>
</div>
<span className="text-green-600 flex items-center font-bold text-sm bg-green-50 px-2 py-1 rounded">
<span className="material-symbols-outlined text-xs mr-1" data-icon="trending_up">trending_up</span>
                            12%
                        </span>
</div>
<div className="mt-6">
<h4 className="text-on-surface-variant text-sm font-semibold uppercase tracking-wider mb-1">Total Users</h4>
<p className="text-3xl font-extrabold text-primary">12,840</p>
</div>
</div>
{/* KPI 2: Active Offers */}
<div className="bg-surface-container-lowest p-8 rounded-lg flex flex-col justify-between border border-transparent shadow-sm shadow-slate-200/50 hover:shadow-md transition-shadow">
<div className="flex justify-between items-start">
<div className="p-3 bg-amber-50 rounded-lg text-amber-600">
<span className="material-symbols-outlined" data-icon="local_activity">local_activity</span>
</div>
<span className="text-red-600 flex items-center font-bold text-sm bg-red-50 px-2 py-1 rounded">
<span className="material-symbols-outlined text-xs mr-1" data-icon="trending_down">trending_down</span>
                            3%
                        </span>
</div>
<div className="mt-6">
<h4 className="text-on-surface-variant text-sm font-semibold uppercase tracking-wider mb-1">Active Offers</h4>
<p className="text-3xl font-extrabold text-primary">452</p>
</div>
</div>
{/* KPI 3: Success Rate */}
<div className="bg-surface-container-lowest p-8 rounded-lg flex flex-col justify-between border border-transparent shadow-sm shadow-slate-200/50 hover:shadow-md transition-shadow">
<div className="flex justify-between items-start">
<div className="p-3 bg-slate-100 rounded-lg text-primary">
<span className="material-symbols-outlined" data-icon="verified">verified</span>
</div>
<span className="text-green-600 flex items-center font-bold text-sm bg-green-50 px-2 py-1 rounded">
<span className="material-symbols-outlined text-xs mr-1" data-icon="trending_up">trending_up</span>
                            8%
                        </span>
</div>
<div className="mt-6">
<h4 className="text-on-surface-variant text-sm font-semibold uppercase tracking-wider mb-1">Success Rate</h4>
<p className="text-3xl font-extrabold text-primary">94.2%</p>
</div>
</div>
{/* KPI 4: Revenue */}
<div className="bg-primary text-white p-8 rounded-lg flex flex-col justify-between shadow-xl shadow-slate-900/20">
<div className="flex justify-between items-start">
<div className="p-3 bg-white/10 rounded-lg text-amber-500">
<span className="material-symbols-outlined" data-icon="payments" style={{fontVariationSettings: '"FILL" 1'}}>payments</span>
</div>
<span className="text-white flex items-center font-bold text-sm bg-white/10 px-2 py-1 rounded">
<span className="material-symbols-outlined text-xs mr-1" data-icon="auto_graph">auto_graph</span>
                            24%
                        </span>
</div>
<div className="mt-6">
<h4 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">MTD Revenue</h4>
<p className="text-3xl font-extrabold">$84,200</p>
</div>
</div>
</div>
{/* Visualization Row */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
{/* Large Chart Section */}
<div className="lg:col-span-2 bg-surface-container-low p-8 rounded-lg space-y-8">
<div className="flex justify-between items-center">
<h3 className="text-xl font-bold tracking-tight text-primary">Growth Trajectory</h3>
<div className="flex bg-surface-container-lowest p-1 rounded-lg">
<button className="px-4 py-1 text-xs font-bold rounded-md bg-primary text-white">Weekly</button>
<button className="px-4 py-1 text-xs font-bold rounded-md text-on-surface-variant hover:text-primary transition-colors">Monthly</button>
</div>
</div>
{/* SVG Chart Mockup */}
<div className="relative w-full h-[300px]">
<svg className="w-full h-full drop-shadow-lg" viewBox="0 0 800 300">
{/* Area Gradient */}
<defs>
<lineargradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3"></stop>
<stop offset="100%" stopColor="#F59E0B" stopOpacity="0"></stop>
</lineargradient>
</defs>
{/* Grid Lines */}
<line stroke="#E2E8F0" strokeDasharray="4" strokeWidth="1" x1="0" x2="800" y1="50" y2="50"></line>
<line stroke="#E2E8F0" strokeDasharray="4" strokeWidth="1" x1="0" x2="800" y1="150" y2="150"></line>
<line stroke="#E2E8F0" strokeDasharray="4" strokeWidth="1" x1="0" x2="800" y1="250" y2="250"></line>
{/* Path Area */}
<path d="M0 300 L0 250 Q100 200 200 220 T400 120 T600 150 T800 50 L800 300 Z" fill="url(#areaGradient)"></path>
{/* Main Path */}
<path d="M0 250 Q100 200 200 220 T400 120 T600 150 T800 50" fill="none" stroke="#F59E0B" strokeLinecap="round" strokeWidth="4"></path>
{/* Points */}
<circle cx="200" cy="220" fill="#F59E0B" r="6" stroke="white" strokeWidth="2"></circle>
<circle cx="400" cy="120" fill="#F59E0B" r="6" stroke="white" strokeWidth="2"></circle>
<circle cx="800" cy="50" fill="#F59E0B" r="6" stroke="white" strokeWidth="2"></circle>
</svg>
<div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
<span>Mon</span>
<span>Tue</span>
<span>Wed</span>
<span>Thu</span>
<span>Fri</span>
<span>Sat</span>
<span>Sun</span>
</div>
</div>
</div>
{/* Recent Activity Feed */}
<div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm border-none">
<h3 className="text-xl font-bold tracking-tight text-primary mb-8">System Audit</h3>
<div className="space-y-8">
<div className="flex gap-4 items-start">
<div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-primary text-sm" data-icon="person_add">person_add</span>
</div>
<div>
<p className="text-sm font-semibold">New Talent Vetted</p>
<p className="text-xs text-on-surface-variant">Alex Rivera completed verification.</p>
<span className="text-[10px] text-slate-400 font-bold mt-1 block">2 MINS AGO</span>
</div>
</div>
<div className="flex gap-4 items-start">
<div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-amber-600 text-sm" data-icon="verified_user">verified_user</span>
</div>
<div>
<p className="text-sm font-semibold">New Job Live</p>
<p className="text-xs text-on-surface-variant">Stark Industries posted 'Lead Engineer'.</p>
<span className="text-[10px] text-slate-400 font-bold mt-1 block">15 MINS AGO</span>
</div>
</div>
<div className="flex gap-4 items-start">
<div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-primary text-sm" data-icon="bug_report">bug_report</span>
</div>
<div>
<p className="text-sm font-semibold">API Performance</p>
<p className="text-xs text-on-surface-variant">99.9% uptime maintained over last 24h.</p>
<span className="text-[10px] text-slate-400 font-bold mt-1 block">1 HOUR AGO</span>
</div>
</div>
<div className="flex gap-4 items-start">
<div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-primary text-sm" data-icon="settings">settings</span>
</div>
<div>
<p className="text-sm font-semibold">System Patch</p>
<p className="text-xs text-on-surface-variant">v2.4.1 deployed to production.</p>
<span className="text-[10px] text-slate-400 font-bold mt-1 block">3 HOURS AGO</span>
</div>
</div>
</div>
<button className="w-full mt-10 py-3 text-sm font-bold text-primary border border-slate-200 rounded-lg hover:bg-surface-container-low transition-colors">
                        View Full Activity Log
                    </button>
</div>
</div>
{/* Talent Spotlight Card (Bento Style) */}
<div className="bg-surface-container-low rounded-lg overflow-hidden flex flex-col md:flex-row">
<div className="md:w-1/3 h-64 md:h-auto relative overflow-hidden">
<img alt="Professional profile" className="absolute inset-0 w-full h-full object-cover" data-alt="Close-up of a professional black female executive in a modern glass-walled office, soft cinematic lighting, professional attire" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2NlfM7TFWehuUN2aJJ0y3m_tUbHbFPhexzamdA_w4tDZCafQeRHpH9NO7joA4VPU5kwH_BZ9gsCDtEh60f8yvGB1wTSMqn1lVnC0ZWJQHJPd1Lpkr46eAk6mueul5zOIE253PIhD34U6r5bskKIiOPrgntC1US2PPlJPdVvPE1tBmGgZfAD6tSEOdpRYZvr4BSwu9fjQmgDXOtImi4bFcesGoa7qV1B5vdR3Fx7PTwSQXBE1grgWBfHFBnSdBAhVYpJVJREQIkvY"/>
<div className="absolute top-4 left-4 bg-tertiary-container text-secondary-container px-3 py-1 rounded text-xs font-extrabold uppercase tracking-widest">
                        Top Vetted
                    </div>
</div>
<div className="md:w-2/3 p-10 space-y-6">
<div className="space-y-1">
<h4 className="text-3xl font-extrabold text-primary tracking-tight">Meet Maya Chen</h4>
<p className="text-amber-600 font-bold">Senior Product Designer · 8 Years Experience</p>
</div>
<p className="text-on-surface-variant leading-relaxed max-w-2xl">
                        Maya represents the top 1% of talent in our ecosystem. With a track record at high-growth startups and a focus on architectural design systems, she is currently open to elite leadership opportunities.
                    </p>
<div className="flex flex-wrap gap-2">
<span className="px-4 py-2 bg-surface-container-lowest text-on-surface-variant text-xs font-bold rounded-full">Figma</span>
<span className="px-4 py-2 bg-surface-container-lowest text-on-surface-variant text-xs font-bold rounded-full">React</span>
<span className="px-4 py-2 bg-surface-container-lowest text-on-surface-variant text-xs font-bold rounded-full">Product Strategy</span>
<span className="px-4 py-2 bg-surface-container-lowest text-on-surface-variant text-xs font-bold rounded-full">System Architecture</span>
</div>
<div className="pt-6 border-t border-slate-200 flex gap-4">
<button className="px-8 py-3 bg-primary text-white font-bold rounded-DEFAULT hover:opacity-90 transition-opacity">View Portfolio</button>
<button className="px-8 py-3 text-primary font-bold hover:bg-surface-container transition-colors">Schedule Interview</button>
</div>
</div>
</div>
</div>
</main>
{/* Error Handling Notification (Initially hidden in real logic, but placed for design) */}
<div className="fixed bottom-10 right-10 bg-white border-l-4 border-error p-6 rounded-lg shadow-2xl flex items-center gap-4 animate-in slide-in-from-right duration-500 max-w-md hidden" id="error-toast">
<div className="w-10 h-10 bg-error-container rounded-full flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-error" data-icon="error">error</span>
</div>
<div className="flex-1">
<p className="font-bold text-primary">Connection Interrupted</p>
<p className="text-sm text-on-surface-variant">Failed to fetch the latest platform stats.</p>
</div>
<button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold active:scale-95 transition-transform">Retry</button>
</div>

</>
  )
}
