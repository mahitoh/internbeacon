export default function Page() {
  return (
    <>



{/* Main Canvas */}
<div className="w-full">


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
</div>
{/* Curator Insight Panel (Asymmetric Editorial Element) */}


</>
  )
}
