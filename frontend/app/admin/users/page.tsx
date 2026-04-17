export default function Page() {
  return (
    <>



{/* Main Content Area */}
<div className="w-full">


{/* Page Canvas */}
<div className="p-10 max-w-7xl mx-auto">
<div className="flex justify-between items-end mb-12">
<div>
<h2 className="text-4xl font-headline font-extrabold tracking-tight text-primary-container mb-2">User Management</h2>
<p className="text-on-primary-container font-medium">Directory of all registered candidates, recruiters, and internal staff.</p>
</div>
<div className="flex gap-4">
<button className="px-6 py-2.5 bg-surface-container-high text-primary-container rounded-lg font-semibold text-sm hover:bg-slate-200 transition-colors">
                        Export CSV
                    </button>
<button className="px-6 py-2.5 bg-secondary-container text-on-secondary-container rounded-lg font-bold text-sm shadow-lg shadow-secondary-container/20 hover:scale-[1.02] active:scale-95 transition-all">
                        Invite New User
                    </button>
</div>
</div>
{/* Bento Filter Bar */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
<div className="md:col-span-2 bg-surface-container-lowest p-1 rounded-lg editorial-shadow flex items-center">
<span className="material-symbols-outlined px-4 text-outline">search</span>
<input className="w-full border-none focus:ring-0 text-sm py-3 placeholder:text-outline/60" placeholder="Filter by name, email, or ID..." type="text"/>
</div>
<div className="bg-surface-container-lowest p-1 rounded-lg editorial-shadow">
<select className="w-full border-none focus:ring-0 text-sm py-3 font-medium text-on-surface-variant bg-transparent">
<option>All Roles</option>
<option>Candidate</option>
<option>Recruiter</option>
<option>Admin</option>
</select>
</div>
<div className="bg-surface-container-lowest p-1 rounded-lg editorial-shadow">
<select className="w-full border-none focus:ring-0 text-sm py-3 font-medium text-on-surface-variant bg-transparent">
<option>All Status</option>
<option>Active</option>
<option>Pending</option>
<option>Suspended</option>
</select>
</div>
</div>
{/* Data Table Container */}
<div className="bg-surface-container-low rounded-lg overflow-hidden editorial-shadow">
<table className="w-full text-left border-separate border-spacing-0">
<thead>
<tr className="bg-primary-container text-white">
<th className="px-6 py-4 text-xs font-bold uppercase tracking-widest first:rounded-tl-lg">Name</th>
<th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Role</th>
<th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Status</th>
<th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Joined</th>
<th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-right last:rounded-tr-lg">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-surface-container-high bg-surface-container-lowest">
{/* Table Row 1 */}
<tr className="group hover:bg-surface transition-colors">
<td className="px-6 py-5">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
<img alt="User" className="w-full h-full object-cover" data-alt="portrait of a professional man in a grey suit against a neutral background with natural lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhtgitf0_jIcnD3wSh6_5RXcwJVTkha2Nh781TW34rNdF1kYA3-GH3Y8F8y-NvizgjjhhUdAubVU_xbB-cnd2OPS7NYd1alZ9ovWRuVhYLAe124flKOfV_Rs2-lRUuL1012Od6M6-8sQ7Z4W5M0QRBR2okGPjb0fYPkCDKDMMNxvqdwzlGK0NZIo-5MhKcyFYjMawOM3zpe3oaSAFd6MgIQi9moDhuzD7wfsdigaAyOiWNsuLR1qC2a5Sx9e0f2W5tQEBeY0GDHds"/>
</div>
<div>
<p className="font-bold text-primary-container">Alexander Thorne</p>
<p className="text-xs text-on-tertiary-container">alex.thorne@internbeacon.com</p>
</div>
</div>
</td>
<td className="px-6 py-5">
<span className="px-3 py-1 bg-surface-container-high rounded-full text-[10px] font-bold text-primary-container uppercase tracking-wider">Candidate</span>
</td>
<td className="px-6 py-5">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-emerald-500"></span>
<span className="text-sm font-medium text-on-surface">Active</span>
</div>
</td>
<td className="px-6 py-5 text-sm text-on-surface-variant font-medium">Oct 12, 2023</td>
<td className="px-6 py-5 text-right">
<div className="flex justify-end gap-2">
<button className="p-2 text-slate-400 hover:text-primary-container hover:bg-slate-100 rounded-lg transition-all">
<span className="material-symbols-outlined text-xl">edit</span>
</button>
<button className="p-2 text-slate-400 hover:text-error hover:bg-error-container/30 rounded-lg transition-all">
<span className="material-symbols-outlined text-xl">delete</span>
</button>
</div>
</td>
</tr>
{/* Table Row 2 (Featured Style) */}
<tr className="group hover:bg-surface transition-colors">
<td className="px-6 py-5">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
<img alt="User" className="w-full h-full object-cover" data-alt="headshot of a smiling young woman with dark hair in professional attire with soft studio lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGxqr5PvulG_InUDSRJxR0qjNe_55SAEWuu-n6Je_fvm3Kg0jmF8a613oal9dD83RuxhhXbLooLt9heydwedjJIXvNLFoaV_mGXg5jHd0pHCFA0qqu-fYQaTuEjEYJxmQLFUARJ-x5mE4hYyC5HLS_4EQUvoAeLhsElMZWXEStLndhGlKXStUpAhFzOhSN7yY8o-c_sYlNzoZeqoUXOHMJXLDGxwHpNsMfWlceWANjvbGne7OgTSg0jJ-nwTA9_brbFFRvkn9DTnI"/>
</div>
<div>
<div className="flex items-center gap-2">
<p className="font-bold text-primary-container">Elena Rodriguez</p>
<span className="bg-primary-container text-secondary-container text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">Vetted</span>
</div>
<p className="text-xs text-on-tertiary-container">elena.rod@globaltalent.io</p>
</div>
</div>
</td>
<td className="px-6 py-5">
<span className="px-3 py-1 bg-secondary-container/10 border border-secondary-container/20 rounded-full text-[10px] font-bold text-secondary uppercase tracking-wider">Recruiter</span>
</td>
<td className="px-6 py-5">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-emerald-500"></span>
<span className="text-sm font-medium text-on-surface">Active</span>
</div>
</td>
<td className="px-6 py-5 text-sm text-on-surface-variant font-medium">Nov 04, 2023</td>
<td className="px-6 py-5 text-right">
<div className="flex justify-end gap-2">
<button className="p-2 text-slate-400 hover:text-primary-container hover:bg-slate-100 rounded-lg transition-all">
<span className="material-symbols-outlined text-xl">edit</span>
</button>
<button className="p-2 text-slate-400 hover:text-error hover:bg-error-container/30 rounded-lg transition-all">
<span className="material-symbols-outlined text-xl">delete</span>
</button>
</div>
</td>
</tr>
{/* Loading State Representation */}
<tr className="animate-pulse">
<td className="px-6 py-5">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-slate-200"></div>
<div className="space-y-2">
<div className="h-3 w-32 bg-slate-200 rounded"></div>
<div className="h-2 w-24 bg-slate-100 rounded"></div>
</div>
</div>
</td>
<td className="px-6 py-5"><div className="h-4 w-16 bg-slate-100 rounded-full"></div></td>
<td className="px-6 py-5"><div className="h-4 w-12 bg-slate-100 rounded-full"></div></td>
<td className="px-6 py-5"><div className="h-4 w-20 bg-slate-100 rounded"></div></td>
<td className="px-6 py-5 text-right"><div className="ml-auto h-8 w-20 bg-slate-100 rounded"></div></td>
</tr>
</tbody>
</table>
{/* Pagination/Footer */}
<div className="px-6 py-4 bg-surface-container-low flex justify-between items-center">
<p className="text-xs font-medium text-on-tertiary-container">Showing 1 to 10 of 2,481 users</p>
<div className="flex gap-2">
<button className="w-10 h-10 flex items-center justify-center bg-surface-container-lowest rounded-lg text-primary-container border border-outline-variant/20 hover:bg-white transition-colors">
<span className="material-symbols-outlined">chevron_left</span>
</button>
<button className="w-10 h-10 flex items-center justify-center bg-primary-container text-white rounded-lg font-bold">1</button>
<button className="w-10 h-10 flex items-center justify-center bg-surface-container-lowest rounded-lg text-primary-container border border-outline-variant/20 hover:bg-white transition-colors">2</button>
<button className="w-10 h-10 flex items-center justify-center bg-surface-container-lowest rounded-lg text-primary-container border border-outline-variant/20 hover:bg-white transition-colors">3</button>
<button className="w-10 h-10 flex items-center justify-center bg-surface-container-lowest rounded-lg text-primary-container border border-outline-variant/20 hover:bg-white transition-colors">
<span className="material-symbols-outlined">chevron_right</span>
</button>
</div>
</div>
</div>
{/* Error State Alert */}
<div className="mt-8 p-4 bg-error-container/40 rounded-lg flex items-center gap-4 border border-error/10">
<span className="material-symbols-outlined text-error" data-weight="fill">error</span>
<p className="text-sm font-medium text-on-error-container">Failed to sync real-time user metrics. Retrying in 5s...</p>
<button className="ml-auto text-xs font-bold text-error uppercase tracking-widest hover:underline">Dismiss</button>
</div>
</div>
</div>
{/* Modal Backdrop (Confirmation Modal) */}
<div className="fixed inset-0 z-[60] bg-primary-container/40 backdrop-blur-sm flex items-center justify-center p-6">
<div className="bg-surface-container-lowest w-full max-w-md rounded-lg editorial-shadow p-8 text-center relative overflow-hidden">
{/* Boutique Accent Line */}
<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-error to-primary-container"></div>
<div className="w-16 h-16 bg-error-container/30 text-error rounded-full flex items-center justify-center mx-auto mb-6">
<span className="material-symbols-outlined text-3xl">delete_forever</span>
</div>
<h3 className="text-2xl font-headline font-bold text-primary-container mb-3">Delete User Account?</h3>
<p className="text-on-tertiary-container mb-8 leading-relaxed">This action will permanently remove <span className="font-bold text-primary-container">Alexander Thorne</span> and all associated data from the InternBeacon ecosystem. This cannot be undone.</p>
<div className="grid grid-cols-2 gap-4">
<button className="py-3 px-6 bg-surface-container-high rounded-lg font-bold text-primary-container hover:bg-slate-200 transition-colors">
                    Keep User
                </button>
<button className="py-3 px-6 bg-error text-white rounded-lg font-bold shadow-lg shadow-error/20 active:scale-95 transition-all">
                    Delete Permanently
                </button>
</div>
</div>
</div>

</>
  )
}
