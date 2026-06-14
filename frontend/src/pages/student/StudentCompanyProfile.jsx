import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  MapPin, Globe, Building2, Users, Briefcase, ShieldCheck,
  ExternalLink, Clock, DollarSign, CheckCircle2, ArrowLeft,
} from 'lucide-react';
import { companiesApi } from '../../api/companies';
import Spinner from '../../components/ui/Spinner';
import { formatDate } from '../../lib/utils';

const AVATAR_COLORS = [
  { bg: '#EDE9FE', text: '#5B21B6' },
  { bg: '#DBEAFE', text: '#1E40AF' },
  { bg: '#EDF2EE', text: '#1E5B45' },
  { bg: '#FEF3C7', text: '#92400E' },
  { bg: '#FCE7F3', text: '#9D174D' },
  { bg: '#EEF2FF', text: '#3730A3' },
  { bg: '#FEE2E2', text: '#991B1B' },
];
const avatarColor = (name) => AVATAR_COLORS[(name || '?').charCodeAt(0) % AVATAR_COLORS.length];

function StatCard({ label, value, icon: Icon, active, highlight, sub }) {
  let bg, border, valueColor, iconColor;
  if (highlight && active) {
    bg = '#EDF2EE'; border = '#C4DBCE'; valueColor = '#1E5B45'; iconColor = '#1E5B45';
  } else if (active) {
    bg = '#fff'; border = '#E7E6DF'; valueColor = '#1B1D1A'; iconColor = '#6B6F69';
  } else {
    bg = '#F6F5F1'; border = '#E7E6DF'; valueColor = '#C0BFBA'; iconColor = '#DDDBD2';
  }
  return (
    <div className="p-4 rounded-2xl" style={{ background: bg, border: `1px solid ${border}` }}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-semibold uppercase tracking-wide leading-tight" style={{ color: '#9A9E97' }}>{label}</p>
        <Icon size={13} style={{ color: iconColor }} />
      </div>
      <p className="text-2xl font-black" style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: valueColor }}>{value}</p>
      {sub && <p className="text-[10px] mt-0.5" style={{ color: '#9A9E97' }}>{sub}</p>}
    </div>
  );
}

export default function StudentCompanyProfile() {
  const { id } = useParams();

  const { data: company, isLoading } = useQuery({
    queryKey: ['company-public', id],
    queryFn:  () => companiesApi.get(id).then(r => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  if (!company) return (
    <div className="flex flex-col items-center justify-center py-20 rounded-2xl"
      style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
      <Building2 size={40} className="mb-3" style={{ color: '#DDDBD2' }} />
      <p className="text-sm" style={{ color: '#9A9E97' }}>Company not found.</p>
      <Link to="/student/companies" className="mt-3 text-xs font-semibold" style={{ color: '#1E5B45' }}>
        Back to companies →
      </Link>
    </div>
  );

  const colors    = avatarColor(company.companyName);
  const initial   = (company.companyName || '?')[0].toUpperCase();
  const openCount = company.openOffers?.length || 0;
  const paidCount = (company.openOffers || []).filter(o => o.isPaid).length;
  const paidPct   = openCount > 0 ? Math.round((paidCount / openCount) * 100) : null;

  return (
    <div className="space-y-5 max-w-3xl" style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}>
      <Link to="/student/companies"
        className="inline-flex items-center gap-2 text-sm transition-colors"
        style={{ color: '#9A9E97', textDecoration: 'none' }}
        onMouseEnter={e => e.currentTarget.style.color = '#1B1D1A'}
        onMouseLeave={e => e.currentTarget.style.color = '#9A9E97'}>
        <ArrowLeft size={14} /> Back to companies
      </Link>

      {/* Header card */}
      <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
        <div className="flex items-start gap-5">
          {company.logoUrl ? (
            <img src={company.logoUrl} alt={company.companyName}
              className="w-20 h-20 rounded-2xl object-contain flex-shrink-0"
              style={{ background: '#F6F5F1', border: '1px solid #E7E6DF' }}
              referrerPolicy="no-referrer" />
          ) : (
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-2xl flex-shrink-0"
              style={{ background: colors.bg, color: colors.text }}>
              {initial}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black leading-tight" style={{ color: '#1B1D1A' }}>{company.companyName}</h1>
              {company.isVerified && (
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: '#EDF2EE', border: '1px solid #C4DBCE', color: '#1E5B45' }}>
                  <ShieldCheck size={11} /> Verified
                </span>
              )}
            </div>

            {company.sector && <p className="text-sm mt-0.5" style={{ color: '#6B6F69' }}>{company.sector}</p>}

            <div className="flex flex-wrap gap-3 mt-3">
              {company.city && (
                <span className="flex items-center gap-1.5 text-xs" style={{ color: '#9A9E97' }}>
                  <MapPin size={11} /> {company.city}
                </span>
              )}
              {company.employeeSize && (
                <span className="flex items-center gap-1.5 text-xs" style={{ color: '#9A9E97' }}>
                  <Users size={11} /> {company.employeeSize} employees
                </span>
              )}
            </div>

            {company.websiteUrl && (
              <a href={company.websiteUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 text-xs transition-colors"
                style={{ color: '#1E5B45', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = '#10342A'}
                onMouseLeave={e => e.currentTarget.style.color = '#1E5B45'}>
                <Globe size={12} />
                {company.websiteUrl.replace(/^https?:\/\//, '')}
                <ExternalLink size={10} />
              </a>
            )}
          </div>
        </div>

        {company.description && (
          <p className="mt-5 text-sm leading-relaxed" style={{ color: '#6B6F69', borderTop: '1px solid #F0F0EA', paddingTop: '16px' }}>
            {company.description}
          </p>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Active Internships" value={openCount}    icon={Briefcase}    active={openCount > 0}                      highlight />
        <StatCard label="Total Posted"        value={company.totalOffersEver || 0} icon={CheckCircle2} active={(company.totalOffersEver || 0) > 0} />
        <StatCard label="Paid Internships"    value={paidPct !== null ? `${paidPct}%` : '—'} icon={DollarSign} active={paidPct !== null && paidPct > 0} sub={paidPct !== null ? `${paidCount} of ${openCount}` : 'No open offers'} />
        <StatCard label="Verification"        value={company.isVerified ? 'Verified' : 'Unverified'} icon={ShieldCheck} active={company.isVerified} />
      </div>

      {/* Open internships */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #E7E6DF' }}>
          <h2 className="font-semibold text-sm" style={{ color: '#1B1D1A' }}>
            Active Opportunities
            {openCount > 0 && <span className="ml-2 font-normal" style={{ color: '#9A9E97' }}>({openCount})</span>}
          </h2>
          {openCount === 0 && <span className="text-xs" style={{ color: '#C0BFBA' }}>None right now</span>}
        </div>

        {openCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-14">
            <Briefcase size={32} className="mb-2" style={{ color: '#DDDBD2' }} />
            <p className="text-sm" style={{ color: '#9A9E97' }}>No open positions at this time</p>
          </div>
        ) : (
          <div>
            {company.openOffers.map((offer, i) => (
              <Link
                key={offer.id}
                to={`/student/offers/${offer.id}`}
                className="flex items-center gap-4 px-5 py-4 group transition-colors"
                style={{ borderTop: i > 0 ? '1px solid #F0F0EA' : 'none', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = '#F6F5F1'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate transition-colors" style={{ color: '#1B1D1A' }}>
                    {offer.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    {offer.location && (
                      <span className="flex items-center gap-1 text-xs" style={{ color: '#9A9E97' }}>
                        <MapPin size={10} />{offer.location}
                      </span>
                    )}
                    {offer.durationWeeks && (
                      <span className="flex items-center gap-1 text-xs" style={{ color: '#9A9E97' }}>
                        <Clock size={10} />{offer.durationWeeks}w
                      </span>
                    )}
                    {offer.domain && (
                      <span className="px-1.5 py-0.5 text-[10px] rounded"
                        style={{ background: '#F6F5F1', border: '1px solid #E7E6DF', color: '#9A9E97' }}>
                        {offer.domain}
                      </span>
                    )}
                    {offer.isPaid && (
                      <span className="px-1.5 py-0.5 text-[10px] rounded font-semibold"
                        style={{ background: '#EDF2EE', border: '1px solid #C4DBCE', color: '#1E5B45' }}>
                        Paid{offer.stipendAmount ? ` · ${offer.stipendCurrency || 'XAF'} ${offer.stipendAmount.toLocaleString()}` : ''}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  {offer.deadline && (
                    <>
                      <p className="text-[10px]" style={{ color: '#9A9E97' }}>Deadline</p>
                      <p className="text-xs font-medium" style={{ color: '#6B6F69' }}>{formatDate(offer.deadline)}</p>
                    </>
                  )}
                </div>
                <ExternalLink size={12} className="flex-shrink-0 transition-colors" style={{ color: '#DDDBD2' }} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
