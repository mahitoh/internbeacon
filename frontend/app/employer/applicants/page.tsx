import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ManageApplicants() {
  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex overflow-hidden font-body">
      {/* SideNavBar Shell */}
      <aside className="h-screen w-64 bg-slate-900 flex flex-col py-8 px-4 flex-shrink-0 z-40 hidden md:flex">
        <div className="mb-10 px-4">
          <h1 className="text-xl font-bold text-white tracking-tighter font-headline">InternBeacon</h1>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mt-1 font-headline">Recruiter Workspace</p>
        </div>

        <nav className="flex-1 space-y-1">
          <Link href="/employer/dashboard" className="text-slate-400 hover:text-white px-4 py-3 flex items-center gap-3 transition-colors hover:bg-white/5 rounded-xl group">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-sm font-medium uppercase tracking-wider font-label">Dashboard</span>
          </Link>
          <Link href="/employer/applicants" className="bg-white/10 text-white rounded-xl px-4 py-3 flex items-center gap-3 active:scale-[0.98] transition-all group">
            <span className="material-symbols-outlined">description</span>
            <span className="text-sm font-medium uppercase tracking-wider font-label">Applications</span>
          </Link>
          <Link href="#" className="text-slate-400 hover:text-white px-4 py-3 flex items-center gap-3 transition-colors hover:bg-white/5 rounded-xl group">
            <span className="material-symbols-outlined">group</span>
            <span className="text-sm font-medium uppercase tracking-wider font-label">Talent Pool</span>
          </Link>
          <Link href="#" className="text-slate-400 hover:text-white px-4 py-3 flex items-center gap-3 transition-colors hover:bg-white/5 rounded-xl group">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm font-medium uppercase tracking-wider font-label">Settings</span>
          </Link>
        </nav>

        <div className="mt-auto px-4 py-6 bg-white/5 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold">JD</div>
            <div>
              <p className="text-xs font-bold text-white">Jane Doe</p>
              <p className="text-[10px] text-slate-500">Premium Recruiter</p>
            </div>
          </div>
          <button className="w-full py-2 bg-secondary-container text-on-secondary-container text-[11px] font-bold uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity">
            Upgrade Plan
          </button>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* TopNavBar Shell (Embedded into Header) */}
        <header className="h-20 bg-white/80 backdrop-blur-xl flex justify-between items-center px-8 flex-shrink-0 z-30">
          <div className="flex items-center gap-4">
            <Link href="/employer/dashboard" className="transition-transform hover:-translate-x-1">
              <span className="material-symbols-outlined text-on-tertiary-container">arrow_back</span>
            </Link>
            <h2 className="text-2xl font-bold tracking-tight text-on-primary-fixed font-headline">Product Design Intern 2024</h2>
            <span className="px-3 py-1 bg-surface-container text-on-tertiary-container text-xs font-semibold rounded-full uppercase tracking-tighter hidden sm:inline-block">Active Listing</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
              <input type="text" placeholder="Search applicants..." className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-sm focus:ring-2 focus:ring-primary-container w-64" />
            </div>
            <button className="bg-primary-container text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:opacity-90 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span className="hidden sm:inline">Post Internship</span>
            </button>
          </div>
        </header>

        {/* Application Content Area */}
        <section className="flex-1 overflow-y-auto p-4 sm:p-8 bg-surface space-y-8">
          {/* Filters & Stats (Asymmetric Layout) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Statistics Card */}
            <div className="lg:col-span-4 bg-surface-container-lowest p-6 rounded-lg shadow-sm flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-on-tertiary-container mb-2">Total Applicants</p>
                <h3 className="text-4xl font-extrabold text-on-primary-fixed tracking-tighter font-headline">142</h3>
              </div>
              <div className="flex items-center gap-4 mt-6">
                <div className="flex -space-x-2">
                  <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCv5Wozu2VRYF-1-41nGMyzJz7wTGdyZHhQl5fA7aVp4scO92_Tmu3dAExV1qqeErHFlh-G5DbCDslbPFbKyOrVOS-e_ctqVDfg6U-OaxbDC4bHlVy2mx91FW41MZ9T3cc8ZXFB3IIG7lDYFurkdmIdP6WZQiwZb7iV9wJf95Vx1Fg8tcZ6PTSM4WTkapUwoyQoF53qQ4yT-A6E1ynP-C0x9x8umYjYRz7KN04zCaD8TQ-S7oUv-0Ly5EH2AliOc5yHoEgSsRl04Ys" alt="Applicant"/>
                  <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIu7xI9eWOcP29uf9JvQO1U-zJLfrvfLyA25e_dH8STiMa2UQW3QEb59O540XEHYnyIKNXMlLmiA6fXS-hsjIcTWwH97w6TmQgmRZ39Z5fD00NfCPRUVFfEwGSI7u2hQzMtcfGaQV82YyLGONIBGydTIlt_NbBDC_ySq8pEC24RGdcesUdkcCM-ub69p84eUC9swUh0vAVkPgs31I8q7h94dfPpeNI43PjtO-ralyeBvJ2WipEEtchP_-Am1SAPqTHoaHi-3Zq2Mc" alt="Applicant"/>
                  <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0CbgIlnTv_VIvcc9FzT16bYl7wq2Vq8j-FiiOkeDaGtZh_CivYUOBSZpWkTBA25cxPLudpuo_Z5c7qAoH2Un-IWywA9f0EzD7owTxgAe3rJyj_qZCspy6PWaoyk5VqWGKwrfIX3yKwCfDyyYVZyZtY2OEQh5ST_iHSFrFoSuRC577M6SK-_4iCbC3JJ3__ge1dMNGycKYXqpZ2tTNuE2olDw-vmo59rSQ21guVL43nXm8nvA6VguRFlBluKxOpVpGnr1iB8Baxvc" alt="Applicant"/>
                </div>
                <span className="text-xs text-on-tertiary-container font-medium">+139 others applied</span>
              </div>
            </div>

            {/* Status Filters (Bento Style) */}
            <div className="lg:col-span-8 flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
              <button className="flex-1 min-w-[160px] snap-center bg-primary-container text-white p-6 rounded-lg flex flex-col justify-between group">
                <span className="material-symbols-outlined text-secondary-container text-3xl">all_inbox</span>
                <div className="mt-4 text-left">
                  <p className="text-xs uppercase font-bold tracking-widest text-slate-400 group-hover:text-white transition-colors">All Applications</p>
                  <p className="text-xl font-bold font-headline mt-1">142</p>
                </div>
              </button>
              
              <button className="flex-1 min-w-[160px] snap-center bg-surface-container-lowest p-6 rounded-lg flex flex-col justify-between border border-transparent hover:border-outline-variant transition-all">
                <span className="material-symbols-outlined text-on-primary-fixed text-3xl">hourglass_empty</span>
                <div className="mt-4 text-left">
                  <p className="text-xs uppercase font-bold tracking-widest text-on-tertiary-container">Pending Review</p>
                  <p className="text-xl font-bold text-on-primary-fixed font-headline mt-1">24</p>
                </div>
              </button>

              <button className="flex-1 min-w-[160px] snap-center bg-surface-container-lowest p-6 rounded-lg flex flex-col justify-between border border-transparent hover:border-outline-variant transition-all">
                <span className="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
                <div className="mt-4 text-left">
                  <p className="text-xs uppercase font-bold tracking-widest text-on-tertiary-container">Shortlisted</p>
                  <p className="text-xl font-bold text-on-primary-fixed font-headline mt-1">12</p>
                </div>
              </button>

              <button className="flex-1 min-w-[160px] snap-center bg-surface-container-lowest p-6 rounded-lg flex flex-col justify-between border border-transparent hover:border-outline-variant transition-all">
                <span className="material-symbols-outlined text-on-tertiary-container text-3xl">cancel</span>
                <div className="mt-4 text-left">
                  <p className="text-xs uppercase font-bold tracking-widest text-on-tertiary-container">Rejected</p>
                  <p className="text-xl font-bold text-on-primary-fixed font-headline mt-1">86</p>
                </div>
              </button>
            </div>
          </div>

          {/* Data Grid / Table */}
          <div className="bg-surface-container-lowest rounded-lg overflow-hidden border border-outline-variant/10 shadow-sm">
            <div className="px-6 py-4 bg-surface-container-low flex justify-between items-center">
              <h4 className="font-bold text-on-primary-fixed tracking-tight font-headline">Applicant Queue</h4>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-surface-container rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-on-tertiary-container">filter_list</span>
                </button>
                <button className="p-2 hover:bg-surface-container rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-on-tertiary-container">download</span>
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
                <thead>
                  <tr className="text-[11px] uppercase tracking-widest text-on-tertiary-container border-b border-surface-container-low">
                    <th className="px-8 py-4 font-bold">Student Name</th>
                    <th className="px-6 py-4 font-bold">University</th>
                    <th className="px-6 py-4 font-bold">Academic Level</th>
                    <th className="px-6 py-4 font-bold">Documents</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-8 py-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-low">
                  {/* Row 1 */}
                  <tr className="hover:bg-surface-container-low/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <img className="w-10 h-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8ziUnBUtHoCORHOSXfIU5uRkLQNqF5BBHvbwTlG8j0ub09cCR-5If1N7uGHSWo3LtY0FoOFxLSSgCaBetKHXLkCkyPcQzWo2BASi1KnTV3ou2UBp7RwsWn3h2BQ7fE_ycZtddBEsBZCXZyIcxnQS5GZUkdkFmSru1KAb7U3ZA1zjRy5twmEIvY8egvjm_L1QOUK1oJB3KP1dfy1p4L1vsSsc3TE1kvR4Mm3WfMxbRThpOOYPHhT5h6mA8GHcKiqLdKOIyB4jmiM0" alt="Amara Okafor"/>
                        <div>
                          <p className="font-semibold text-on-primary-fixed text-sm">Amara Okafor</p>
                          <p className="text-xs text-on-tertiary-container mt-0.5">Applied 2h ago</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-on-surface">University of Toronto</td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-medium px-2.5 py-1 bg-surface-container-high text-on-tertiary-container rounded-full">Masters, CS</span>
                    </td>
                    <td className="px-6 py-5">
                      <a href="#" className="inline-flex items-center gap-2 text-xs font-bold text-secondary hover:text-secondary-container transition-colors">
                        <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                        RESUME_2024.pdf
                      </a>
                    </td>
                    <td className="px-6 py-5">
                      <select className="bg-surface-container border-none text-xs font-bold rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary-container cursor-pointer transition-shadow">
                        <option value="pending">Pending Review</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interviewing">Interviewing</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 bg-surface-container-low text-on-primary-fixed rounded-full hover:bg-primary-container hover:text-white transition-all active:scale-95">
                        <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                      </button>
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="hover:bg-surface-container-low/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <img className="w-10 h-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuABnQKVHCYi1I-dnY97b8l0QMbA8GBvcC8BzODHKguZiOiefoijg2Qnc9Gb1VZa-9RmQb1KF84O6lewxW2k9Fn-mPsZ28BKKkSd5VOL0PTANsApSeUOmLGe_vZeUOWJE0jgp_sRIeUrJKSWZQTGMM54OMCWOpASAam--4AWEQ4rqxjZHszRdXJzUt23TrUsBDBPTea8KqIgRvtINWUFFUISHPTcSjUpEEQ3ssj_F6A1PuI4RsIEsb_i9IfVytbf_elQCtRIqA_svrI" alt="Julian Rivera"/>
                        <div>
                          <p className="font-semibold text-on-primary-fixed text-sm">Julian Rivera</p>
                          <p className="text-xs text-on-tertiary-container mt-0.5">Applied 5h ago</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-on-surface">Stanford University</td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-medium px-2.5 py-1 bg-surface-container-high text-on-tertiary-container rounded-full">Bachelors, Design</span>
                    </td>
                    <td className="px-6 py-5">
                      <a href="#" className="inline-flex items-center gap-2 text-xs font-bold text-secondary hover:text-secondary-container transition-colors">
                        <span className="material-symbols-outlined text-sm">link</span>
                        Portfolio.web
                      </a>
                    </td>
                    <td className="px-6 py-5">
                      <select defaultValue="shortlisted" className="bg-secondary-container/10 border-none text-xs font-bold text-on-secondary-container rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-secondary-container cursor-pointer transition-shadow">
                        <option value="pending">Pending Review</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interviewing">Interviewing</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 bg-surface-container-low text-on-primary-fixed rounded-full hover:bg-primary-container hover:text-white transition-all active:scale-95">
                        <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                      </button>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="hover:bg-surface-container-low/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <img className="w-10 h-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuATs0fteZtgmT9ZPM7d2TtdjXJB71RalM0X-_iLaEIqhSZ1oY0Laz7DVvXopON-XOSdJHUa5U6UjmyhUlQB93xC6jkUyHFyNPY_cX56OOTrspw5vY0-hiFtqekMXnhjBvSFmpubiY0tgM1LdRdcDnW0SA9P8Otvu5Jfh0BI-bFYgtBv_Y3qR7jwk2N2ikYZuhtvg0bt2qbFNkZfJ2ryDMAl0lkkazXefO2EWZOJtH5vtH11HQMd7vhsj2uC3OEOCoQNhLKa0nuUbUs" alt="Sophie Chen"/>
                        <div>
                          <p className="font-semibold text-on-primary-fixed text-sm">Sophie Chen</p>
                          <p className="text-xs text-on-tertiary-container mt-0.5">Applied 1d ago</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-on-surface">Imperial College London</td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-medium px-2.5 py-1 bg-surface-container-high text-on-tertiary-container rounded-full">Bachelors, HCI</span>
                    </td>
                    <td className="px-6 py-5">
                      <a href="#" className="inline-flex items-center gap-2 text-xs font-bold text-secondary hover:text-secondary-container transition-colors">
                        <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                        Sophie_Resume.pdf
                      </a>
                    </td>
                    <td className="px-6 py-5">
                      <select className="bg-surface-container border-none text-xs font-bold rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary-container cursor-pointer transition-shadow">
                        <option value="pending">Pending Review</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interviewing">Interviewing</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 bg-surface-container-low text-on-primary-fixed rounded-full hover:bg-primary-container hover:text-white transition-all active:scale-95">
                        <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                      </button>
                    </td>
                  </tr>

                  {/* Row 4 */}
                  <tr className="hover:bg-surface-container-low/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <img className="w-10 h-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBo-rwa5ub4zTVEipWtwmanXCgqlb9jgRVNAOaA_lcvEa3zt45JqxwZ3mpUO1yr2hEca-ROEOxg85rhhmjGq-8nohYRGN0eLygaluYDuKmgTOitCdzMKOkWdFPfcbpIN5JjSeNNqKywSBxFDdvEtyLDPaR42Q6QVU0iIZVuceFFSNcBmq6V3tzpYxBMSDZJyXoCHruluJXWx9TO1yd0C2dUzEfpA8W1gKzhE_mw_1wlCtKUg9phkzWorHn7juWTarGABhaX9OqyRDk" alt="Marcus Thorne"/>
                        <div>
                          <p className="font-semibold text-on-primary-fixed text-sm">Marcus Thorne</p>
                          <p className="text-xs text-on-tertiary-container mt-0.5">Applied 2d ago</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-on-surface">MIT</td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-medium px-2.5 py-1 bg-surface-container-high text-on-tertiary-container rounded-full">PhD, Analytics</span>
                    </td>
                    <td className="px-6 py-5">
                      <a href="#" className="inline-flex items-center gap-2 text-xs font-bold text-secondary hover:text-secondary-container transition-colors">
                        <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                        Thorne_CV.pdf
                      </a>
                    </td>
                    <td className="px-6 py-5">
                      <select defaultValue="rejected" className="bg-error-container/20 border-none text-xs font-bold text-error rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-error cursor-pointer transition-shadow">
                        <option value="pending">Pending Review</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interviewing">Interviewing</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 bg-surface-container-low text-on-primary-fixed rounded-full hover:bg-primary-container hover:text-white transition-all active:scale-95">
                        <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer Pagination */}
            <div className="px-8 py-6 bg-surface-container-lowest border-t border-surface-container-low flex justify-between items-center overflow-x-auto">
              <p className="text-xs font-medium text-on-tertiary-container hidden sm:block whitespace-nowrap">Showing 4 of 142 applicants</p>
              <div className="flex items-center gap-2 ml-auto">
                <button className="px-4 py-2 border border-outline-variant text-xs font-bold rounded-lg hover:bg-surface-container transition-colors disabled:opacity-50" disabled>Previous</button>
                <div className="flex items-center gap-1">
                  <button className="w-8 h-8 flex items-center justify-center bg-primary-container text-white text-xs font-bold rounded-lg">1</button>
                  <button className="w-8 h-8 flex items-center justify-center text-on-primary-fixed text-xs font-bold rounded-lg hover:bg-surface-container">2</button>
                  <button className="w-8 h-8 flex items-center justify-center text-on-primary-fixed text-xs font-bold rounded-lg hover:bg-surface-container">3</button>
                  <span className="text-on-tertiary-container px-1">...</span>
                  <button className="w-8 h-8 flex items-center justify-center text-on-primary-fixed text-xs font-bold rounded-lg hover:bg-surface-container">12</button>
                </div>
                <button className="px-4 py-2 border border-outline-variant text-xs font-bold rounded-lg hover:bg-surface-container transition-colors">Next</button>
              </div>
            </div>
          </div>

          {/* Contextual Curator Chip */}
          <div className="bg-primary-container text-white p-4 rounded-xl flex items-center justify-between border-l-4 border-secondary-container shadow-md lg:hidden">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-secondary-container">auto_awesome</span>
              <div>
                <p className="text-sm font-bold tracking-tight">Curator Insight</p>
                <p className="text-xs text-slate-400">Based on your previous hires, Amara Okafor has a 94% skills match.</p>
              </div>
            </div>
            <button className="text-xs font-bold text-secondary-container hover:underline uppercase tracking-widest shrink-0 ml-4">View Analysis</button>
          </div>
          
          <div className="bg-primary-container text-white p-4 rounded-xl items-center justify-between border-l-4 border-secondary-container w-full max-w-4xl mx-auto shadow-md hidden lg:flex">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <div>
                <p className="text-sm font-bold tracking-tight">Curator Insight</p>
                <p className="text-xs text-slate-400">Based on your previous hires, Amara Okafor has a 94% skills match for your Product Design workflow.</p>
              </div>
            </div>
            <button className="text-xs font-bold text-secondary-container hover:underline uppercase tracking-widest shrink-0">View Analysis</button>
          </div>
        </section>
      </main>
    </div>
  );
}
