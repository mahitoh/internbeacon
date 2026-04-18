export default function Page() {
  return (
    <>





{/* Main Content Canvas */}
<div className="w-full">
{/* Header Section */}
<section className="mb-12 flex justify-between items-end">
<div>
<nav className="flex items-center gap-2 text-xs font-semibold text-on-tertiary-container uppercase tracking-widest mb-4">
<span>Job Postings</span>
<span className="material-symbols-outlined text-xs">chevron_right</span>
<span>Senior Product Design Intern</span>
<span className="material-symbols-outlined text-xs">chevron_right</span>
<span className="text-primary">Candidate Matches</span>
</nav>
<h2 className="text-4xl font-extrabold tracking-tighter text-primary-container flex items-center gap-4">
                    Top Talent Matches
                    <span className="bg-secondary-container text-on-secondary-fixed-variant text-xs px-3 py-1 rounded-full font-bold uppercase tracking-tighter">14 Elite Matches</span>
</h2>
<p className="text-on-surface-variant mt-2 max-w-2xl">Based on your offer criteria for the <span className="font-semibold text-primary">Senior Product Design</span> position, our AI has curated the following elite profiles from the global talent pool.</p>
</div>
<div className="flex items-center gap-3">
<div className="flex bg-surface-container-low p-1 rounded-xl">
<button className="px-4 py-2 bg-white shadow-sm rounded-lg text-sm font-bold text-primary">List View</button>
<button className="px-4 py-2 text-sm font-medium text-on-surface-variant">Grid View</button>
</div>
<button className="flex items-center gap-2 bg-primary-container text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all">
<span className="material-symbols-outlined text-sm">sort</span>
                    Sort by Score
                </button>
</div>
</section>
{/* Main Grid Layout */}
<div className="grid grid-cols-12 gap-8">
{/* Filter Rail */}
<div className="col-span-3 space-y-8">
<div className="bg-surface-container-low rounded-lg p-6">
<h3 className="font-bold text-primary mb-6 flex items-center justify-between">
                        Curation Filters
                        <span className="material-symbols-outlined text-sm">tune</span>
</h3>
<div className="space-y-6">
<div>
<label className="text-[10px] uppercase font-bold tracking-widest text-on-tertiary-container block mb-3">Match Score %</label>
<input className="w-full h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-secondary-container" type="range"/>
<div className="flex justify-between text-[10px] font-bold text-on-surface-variant mt-2">
<span>80%</span>
<span>100%</span>
</div>
</div>
<div className="space-y-3">
<label className="text-[10px] uppercase font-bold tracking-widest text-on-tertiary-container block">Core Skillset</label>
<div className="flex flex-wrap gap-2">
<span className="bg-white border border-outline-variant/30 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer hover:bg-primary hover:text-white transition-colors">UI Design</span>
<span className="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer">Figma</span>
<span className="bg-white border border-outline-variant/30 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer hover:bg-primary hover:text-white transition-colors">Prototyping</span>
<span className="bg-white border border-outline-variant/30 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer hover:bg-primary hover:text-white transition-colors">React</span>
</div>
</div>
<div className="space-y-3">
<label className="text-[10px] uppercase font-bold tracking-widest text-on-tertiary-container block">Education Level</label>
<div className="space-y-2">
<label className="flex items-center gap-3 text-sm cursor-pointer group">
<input defaultChecked className="rounded border-outline-variant text-secondary-container focus:ring-secondary-container" type="checkbox"/>
<span className="group-hover:text-primary transition-colors">Master's Degree</span>
</label>
<label className="flex items-center gap-3 text-sm cursor-pointer group">
<input className="rounded border-outline-variant text-secondary-container focus:ring-secondary-container" type="checkbox"/>
<span className="group-hover:text-primary transition-colors">Undergraduate</span>
</label>
</div>
</div>
</div>
</div>
<div className="relative rounded-lg overflow-hidden h-48 group">
<img alt="Recruitment insights" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="Minimalist office interior with large windows and clean wooden surfaces, moody atmospheric lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuByIu8JQzFGQB0Nxa_BkpK2Q4I6AyruwYa0HMQW8p3dVWdk4ZafikuxVnnMKV0vzULxCawll8kP2cKIS8wdTu2avvDAS-aY6V0BDPCGC7Jmtun-viixhBGdgO3OGFJOxB2iUBC9eyCTeIXWwMwJ6kpw3wk7716uhoy1Bw36JFRJEXqIycdbwXPujn8DsAbA6LULtdWkhAEKZltcRnjnEYD3mDNeB6Vw48aXFIVcn4OR4GhShS0OJjzXmMBb_fY3xbdJftlWeijJFyo"/>
<div className="absolute inset-0 bg-gradient-to-t from-primary-container/80 to-transparent p-6 flex flex-col justify-end">
<p className="text-xs text-secondary-container font-bold uppercase tracking-wider mb-1">Elite Tip</p>
<p className="text-white text-sm font-medium">94% of top matches are hired within 48 hours of initial message.</p>
</div>
</div>
</div>
{/* Match Cards Container */}
<div className="col-span-9 space-y-6">
{/* Match Card 1: The Featured Match */}
<div className="bg-surface-container-lowest rounded-lg p-8 relative overflow-hidden group border-l-4 border-secondary-container">
<div className="flex gap-8 items-start relative z-10">
<div className="relative">
<div className="w-24 h-24 rounded-lg overflow-hidden bg-surface-container-high">
<img alt="Candidate profile" className="w-full h-full object-cover" data-alt="Portrait of a young creative professional man in a minimalist studio, sharp lighting, editorial style" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAm7I39Twnc9bhXhK6lmKySrrKOcoGBSG8UAYn1O3t1K1jNX5aAcx57WI8CDZ7TVSTNfquMA1vHURhZeubzqzghdqT2dJEJg25djsRdMJQuWq-e_Ab09TPGF4i0ZSXfWmXqo4N2I648pkiO2LuJcYkOXTuq3iz1ARdyaMN7Z2wRsA33R-iT3taBZIr5un5xBW21ucdveXqiNOqLp96Ein_sKL9zuPH5c2n2XE8hIrkSC36bqDMo3JXgrdEJpfu9WBZ61cIEuD_hKpY"/>
</div>
<div className="absolute -bottom-2 -right-2 bg-secondary-container text-white p-1 rounded-md flex items-center shadow-lg">
<span className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: '"FILL" 1'}}>verified</span>
</div>
</div>
<div className="flex-1">
<div className="flex justify-between items-start mb-2">
<div>
<h3 className="text-2xl font-extrabold text-primary-container leading-none mb-1">Adrian Thorne</h3>
<p className="text-on-tertiary-container font-medium text-sm">Product Design Master's Student @ RISD</p>
</div>
<div className="text-right">
<div className="text-[10px] uppercase font-bold tracking-widest text-on-tertiary-container mb-1">Match Score</div>
<div className="text-4xl font-black text-secondary-container">98%</div>
</div>
</div>
<div className="flex flex-wrap gap-2 my-4">
<span className="bg-surface-container-low px-3 py-1 rounded-full text-[10px] font-bold text-primary uppercase">Elite Vetted</span>
<span className="bg-surface-container-low px-3 py-1 rounded-full text-[10px] font-bold text-primary uppercase">Ex-Apple Intern</span>
<span className="bg-surface-container-low px-3 py-1 rounded-full text-[10px] font-bold text-primary uppercase">System Design</span>
</div>
<p className="text-sm text-on-surface-variant line-clamp-2 mb-6">
                                Passionate about building modular design systems and accessible user interfaces. Currently finalizing a thesis on neural-interface design patterns.
                            </p>
<div className="flex items-center gap-4">
<button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">View Profile</button>
<button className="bg-surface-container-low text-primary px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-surface-container-high transition-colors">Message</button>
<button className="ml-auto flex items-center gap-2 text-on-tertiary-container hover:text-primary transition-colors">
<span className="material-symbols-outlined">bookmark</span>
<span className="text-xs font-bold uppercase tracking-tight">Save</span>
</button>
</div>
</div>
</div>
</div>
{/* Match Card 2 */}
<div className="bg-surface-container-lowest rounded-lg p-8 relative overflow-hidden group transition-all hover:bg-surface-container-low/30">
<div className="flex gap-8 items-start">
<div className="w-24 h-24 rounded-lg overflow-hidden bg-surface-container-high">
<img alt="Candidate profile" className="w-full h-full object-cover" data-alt="Modern studio portrait of a woman professional, soft lighting, neutral background, architectural curator aesthetic" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkdmym-WAubWtOeQwR0A5ficZmO8QjcbwQ09hqoxfaq9CsEJJDo2YxpIUaiB_fYNULWoL6MEzfRwyu57wEJGDRun7Cw_15KuMDsLRXAjLgOgwBrnrC-IWc4xcISZZlmSXCldZ4lgMgYWlK5ABZ5ZGJDN4ddMKdbJ40rnZ1SteC-w9vSet52VNQaptMAuedtSdYmL5BNYRkAfxuP-BzGqO48PzZ_p5n098WZ8chzxOS2AGNCf_5CoRep2KtAaOEsONvpyjk1R8vu2c"/>
</div>
<div className="flex-1">
<div className="flex justify-between items-start mb-2">
<div>
<h3 className="text-2xl font-extrabold text-primary-container leading-none mb-1">Elena Vance</h3>
<p className="text-on-tertiary-container font-medium text-sm">Interaction Design @ Carnegie Mellon</p>
</div>
<div className="text-right">
<div className="text-[10px] uppercase font-bold tracking-widest text-on-tertiary-container mb-1">Match Score</div>
<div className="text-4xl font-black text-on-tertiary-container opacity-40 group-hover:opacity-100 transition-opacity">92%</div>
</div>
</div>
<div className="flex flex-wrap gap-2 my-4">
<span className="bg-surface-container-low px-3 py-1 rounded-full text-[10px] font-bold text-primary uppercase">HCI Specialist</span>
<span className="bg-surface-container-low px-3 py-1 rounded-full text-[10px] font-bold text-primary uppercase">UX Research</span>
</div>
<p className="text-sm text-on-surface-variant line-clamp-2 mb-6">
                                Focused on the intersection of human psychology and digital product architecture. Published 3 case studies on FinTech accessibility.
                            </p>
<div className="flex items-center gap-4">
<button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">View Profile</button>
<button className="bg-surface-container-low text-primary px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-surface-container-high transition-colors">Message</button>
<button className="ml-auto flex items-center gap-2 text-on-tertiary-container hover:text-primary transition-colors">
<span className="material-symbols-outlined">bookmark</span>
<span className="text-xs font-bold uppercase tracking-tight">Save</span>
</button>
</div>
</div>
</div>
</div>
{/* Match Card 3 */}
<div className="bg-surface-container-lowest rounded-lg p-8 relative overflow-hidden group transition-all hover:bg-surface-container-low/30">
<div className="flex gap-8 items-start">
<div className="w-24 h-24 rounded-lg overflow-hidden bg-surface-container-high">
<img alt="Candidate profile" className="w-full h-full object-cover" data-alt="Corporate headshot of a young man, clean minimalist background, professional lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuACjvmMADNZkuK4u3sO_9pDBXUcLEDvxlKgtC_iaenm_ouEznSfqu3jqsztK-J2j0dZIpor1Rbf6-UCGoyq4cnvZiM4acUwAVjzmWSZwhdhMjuNH816gJiGUVKhvkC2ezep7-o-rGsb9RTD83HlbIrF9M6h76KLq-2zRGG79eeTcli7ZOeNVnZPNoXSZnyNxf5vJclmzb0p9OQi0gxiatVMuTWXOJ4IINNyFu1_P8RMonNhFtk0twha4r69o_OxEvZQx4FuJhPn-LE"/>
</div>
<div className="flex-1">
<div className="flex justify-between items-start mb-2">
<div>
<h3 className="text-2xl font-extrabold text-primary-container leading-none mb-1">Julian Mercer</h3>
<p className="text-on-tertiary-container font-medium text-sm">Visual Communication @ Parsons School of Design</p>
</div>
<div className="text-right">
<div className="text-[10px] uppercase font-bold tracking-widest text-on-tertiary-container mb-1">Match Score</div>
<div className="text-4xl font-black text-on-tertiary-container opacity-40 group-hover:opacity-100 transition-opacity">89%</div>
</div>
</div>
<div className="flex flex-wrap gap-2 my-4">
<span className="bg-surface-container-low px-3 py-1 rounded-full text-[10px] font-bold text-primary uppercase">Typography Elite</span>
<span className="bg-surface-container-low px-3 py-1 rounded-full text-[10px] font-bold text-primary uppercase">Brand Strategy</span>
</div>
<p className="text-sm text-on-surface-variant line-clamp-2 mb-6">
                                Crafting visual narratives for high-growth tech startups. Expert in Figma, Framer, and 3D motion design for web environments.
                            </p>
<div className="flex items-center gap-4">
<button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">View Profile</button>
<button className="bg-surface-container-low text-primary px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-surface-container-high transition-colors">Message</button>
<button className="ml-auto flex items-center gap-2 text-on-tertiary-container hover:text-primary transition-colors">
<span className="material-symbols-outlined">bookmark</span>
<span className="text-xs font-bold uppercase tracking-tight">Save</span>
</button>
</div>
</div>
</div>
</div>
{/* Pagination/Load More */}
<div className="pt-8 flex flex-col items-center">
<div className="h-[2px] w-24 bg-surface-container-high mb-6 relative">
<div className="absolute top-0 left-0 h-full w-1/3 bg-secondary-container"></div>
</div>
<button className="text-xs font-black uppercase tracking-[0.2em] text-primary hover:text-secondary-container transition-colors">
                        View More Talent
                    </button>
</div>
</div>
</div>
</div>
{/* Floating Action State (Subtle) */}
<div className="fixed bottom-8 right-8 flex items-center gap-4 z-50">
<div className="bg-primary-container text-white rounded-full py-4 px-8 shadow-2xl flex items-center gap-4">
<div className="flex -space-x-3">
<div className="w-8 h-8 rounded-full border-2 border-primary-container overflow-hidden">
<img alt="img" className="object-cover w-full h-full" data-alt="profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-0d13S3Y-8yiaDGdFXR17iIsbEKF2f6O-BjzEbYUDW-zjc5T2Ywrqjwz6Rvro8seWNwuugkfZOcKPNlvCnHvXuE1NmSczEV9n1ANTtVZJ1SNTpDvcB2GYm4TzAVu-L1GDNFl43xy8uyzB1p-lqvgyO4rTzlnWJqwVB0VBp4skVbu6SfyWf4Gc3WCE4WWb8KjqouvdiXmUtHRYqdWazEMXeYlPuK725vg6QpU_NkIZb5Vi-310aghDwwTM9EzbfTGKdw-WjjnqNvo"/>
</div>
<div className="w-8 h-8 rounded-full border-2 border-primary-container overflow-hidden">
<img alt="img" className="object-cover w-full h-full" data-alt="profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTn6Bd2lsy5YZT2PRmrKGBaJKHgdJS8p0tKU87I-nHn3474bv2x9Z7lKj08doZ3X-okD622I431sS7u3RMWZNOKl5MA4PmMNAFW6o7aqU6b2mxuZmk051WCCtRgakhC_wU9ZIwQxao6l0RjhtMgPcBQCyh-XFajrfiTGLaK9aSLKT_QnlsusV-vJL1yZYwqZqLzN5yfr4f422_CNZ5sjLNJ3jvgreRrhKyTv-EBYPtHv3RNbS1xVOtMcs1wQi2mO-_1zuYYY8vrw4"/>
</div>
<div className="w-8 h-8 rounded-full border-2 border-primary-container bg-surface-container-high flex items-center justify-center text-[10px] font-bold text-primary">
                    +4
                </div>
</div>
<div className="h-4 w-[1px] bg-white/20"></div>
<span className="text-xs font-bold tracking-tight uppercase">6 Profiles Bookmarked</span>
<button className="bg-secondary-container text-on-secondary-fixed-variant px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase">Bulk Action</button>
</div>
</div>

</>
  )
}
