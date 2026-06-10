import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  MapPin, Globe, Building2, Users, Briefcase, ShieldCheck,
  ExternalLink, Clock, DollarSign, CheckCircle2, ArrowLeft,
} from 'lucide-react';
import { companiesApi } from '../../api/companies';
import Spinner from '../../components/ui/Spinner';
import { formatDate } from '../../lib/utils';

const INITIAL_COLORS = [
  'bg-violet-500/20 text-violet-300', 'bg-blue-500/20 text-blue-300',
  'bg-lime-500/20 text-lime-300',     'bg-orange-500/20 text-orange-300',
  'bg-pink-500/20 text-pink-300',     'bg-indigo-500/20 text-indigo-300',
];
const initColor = (name) => INITIAL_COLORS[(name || '?').charCodeAt(0) % INITIAL_COLORS.length];

export default function StudentCompanyProfile() {
  const { id } = useParams();

  const { data: company, isLoading } = useQuery({
    queryKey: ['company-public', id],
    queryFn:  () => companiesApi.get(id).then(r => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (!company)  return (
    <div className="flex flex-col items-center justify-center py-20 text-white/30">
      <Building2 size={40} className="mb-3" />
      <p className="text-sm">Company not found.</p>
      <Link to="/student/companies" className="mt-3 text-lime-400 text-xs hover:underline">Back to companies →</Link>
    </div>
  );

  const initial   = (company.companyName || '?')[0].toUpperCase();
  const colorCls  = initColor(company.companyName);
  const openCount = company.openOffers?.length || 0;
  const paidCount = (company.openOffers || []).filter(o => o.isPaid).length;
  const paidPct   = openCount > 0 ? Math.round((paidCount / openCount) * 100) : null;

  return (
    <div className="space-y-5 max-w-3xl">

      <Link to="/student/companies"
        className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
        <ArrowLeft size={14} /> Back to companies
      </Link>

      {/* Header card */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-6">
        <div className="flex items-start gap-5">
          {company.logoUrl ? (
            <img src={company.logoUrl} alt={company.companyName}
              className="w-20 h-20 rounded-2xl object-contain bg-white/5 ring-1 ring-white/10 flex-shrink-0"
              referrerPolicy="no-referrer" />
          ) : (
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center font-black text-2xl flex-shrink-0 ${colorCls}`}>
              {initial}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black text-white leading-tight">{company.companyName}</h1>
              {company.isVerified && (
                <span className="flex items-center gap-1 text-xs text-lime-400 bg-lime-500/10 px-2 py-0.5 rounded-full font-semibold border border-lime-500/20">
                  <ShieldCheck size={11} /> Verified
                </span>
              )}
            </div>

            {company.sector && <p className="text-white/50 text-sm mt-0.5">{company.sector}</p>}

            <div className="flex flex-wrap gap-3 mt-3">
              {company.city && (
                <span className="flex items-center gap-1.5 text-xs text-white/40">
                  <MapPin size={11} /> {company.city}
                </span>
              )}
              {company.employeeSize && (
                <span className="flex items-center gap-1.5 text-xs text-white/40">
                  <Users size={11} /> {company.employeeSize} employees
                </span>
              )}
            </div>

            {company.websiteUrl && (
              <a href={company.websiteUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 text-xs text-lime-400 hover:text-lime-300 transition-colors">
                <Globe size={12} />
                {company.websiteUrl.replace(/^https?:\/\//, '')}
                <ExternalLink size={10} />
              </a>
            )}
          </div>
        </div>

        {company.description && (
          <p className="mt-5 text-sm text-white/55 leading-relaxed border-t border-white/5 pt-4">
            {company.description}
          </p>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="Active Internships"
          value={openCount}
          icon={Briefcase}
          active={openCount > 0}
          highlight
        />
        <StatCard
          label="Total Posted"
          value={company.totalOffersEver || 0}
          icon={CheckCircle2}
          active={(company.totalOffersEver || 0) > 0}
        />
        <StatCard
          label="Paid Internships"
          value={paidPct !== null ? `${paidPct}%` : '—'}
          icon={DollarSign}
          active={paidPct !== null && paidPct > 0}
          sub={paidPct !== null ? `${paidCount} of ${openCount}` : 'No open offers'}
        />
        <StatCard
          label="Verification"
          value={company.isVerified ? 'Verified' : 'Unverified'}
          icon={ShieldCheck}
          active={company.isVerified}
        />
      </div>

      {/* Open internships */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h2 className="font-semibold text-white text-sm">
            Active Opportunities
            {openCount > 0 && <span className="ml-2 text-white/30 font-normal">({openCount})</span>}
          </h2>
          {openCount === 0 && <span className="text-xs text-white/25">None right now</span>}
        </div>

        {openCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-white/20">
            <Briefcase size={32} className="mb-2" />
            <p className="text-sm">No open positions at this time</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {company.openOffers.map(offer => (
              <Link
                key={offer.id}
                to={`/student/offers/${offer.id}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-white/2 transition-colors group">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm group-hover:text-lime-400 transition-colors truncate">
                    {offer.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    {offer.location && (
                      <span className="flex items-center gap-1 text-xs text-white/40">
                        <MapPin size={10} />{offer.location}
                      </span>
                    )}
                    {offer.durationWeeks && (
                      <span className="flex items-center gap-1 text-xs text-white/40">
                        <Clock size={10} />{offer.durationWeeks}w
                      </span>
                    )}
                    {offer.domain && (
                      <span className="px-1.5 py-0.5 bg-white/5 text-white/40 text-[10px] rounded border border-white/8">
                        {offer.domain}
                      </span>
                    )}
                    {offer.isPaid && (
                      <span className="px-1.5 py-0.5 bg-lime-500/10 text-lime-400 text-[10px] rounded font-semibold border border-lime-500/20">
                        Paid{offer.stipendAmount ? ` · ${offer.stipendCurrency || 'XAF'} ${offer.stipendAmount.toLocaleString()}` : ''}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  {offer.deadline && (
                    <>
                      <p className="text-[10px] text-white/30">Deadline</p>
                      <p className="text-xs font-medium text-white/60">{formatDate(offer.deadline)}</p>
                    </>
                  )}
                </div>
                <ExternalLink size={12} className="text-white/15 group-hover:text-lime-400 transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, active, highlight, sub }) {
  return (
    <div className={`p-4 rounded-2xl border ${
      highlight && active ? 'bg-lime-500/8 border-lime-500/20'
      : active ? 'bg-white/3 border-white/8'
      : 'bg-white/2 border-white/5'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wide leading-tight">{label}</p>
        <Icon size={13} className={active ? (highlight ? 'text-lime-400' : 'text-white/50') : 'text-white/15'} />
      </div>
      <p className={`text-2xl font-black ${active ? (highlight ? 'text-lime-400' : 'text-white') : 'text-white/20'}`}>{value}</p>
      {sub && <p className="text-[10px] text-white/25 mt-0.5">{sub}</p>}
    </div>
  );
}
