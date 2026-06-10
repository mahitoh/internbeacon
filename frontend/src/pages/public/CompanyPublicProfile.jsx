import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft, MapPin, Globe, Building2, Users, Briefcase,
  ShieldCheck, CheckCircle2, ExternalLink, Clock,
} from 'lucide-react';
import Spinner from '../../components/ui/Spinner';
import { formatDate } from '../../lib/utils';
import api from '../../api/axios';

function getCompanyPublic(id) {
  return api.get(`/companies/${id}`);
}

export default function CompanyPublicProfile() {
  const { id }     = useParams();
  const navigate   = useNavigate();

  const { data: res, isLoading } = useQuery({
    queryKey: ['company-public', id],
    queryFn:  () => getCompanyPublic(id).then(r => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#111]">
      <Spinner />
    </div>
  );

  if (!res) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#111] text-white/40">
      <Building2 size={40} className="mb-3" />
      <p>Company not found.</p>
    </div>
  );

  const company = res;
  const initial = company.companyName?.[0]?.toUpperCase() ?? '?';
  const colors  = ['bg-violet-500/20','bg-blue-500/20','bg-lime-500/20','bg-orange-500/20'];
  const initBg  = colors[(initial.charCodeAt(0) || 0) % colors.length];

  const profileColor =
    company.profileScore >= 80 ? 'text-lime-400'
    : company.profileScore >= 50 ? 'text-yellow-400'
    : 'text-orange-400';

  return (
    <div className="min-h-screen bg-[#111] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft size={15} /> Back
        </button>

        {/* Header card */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-6">
          <div className="flex items-start gap-5">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden ${company.logoUrl ? 'bg-white/5' : initBg}`}>
              {company.logoUrl
                ? <img src={company.logoUrl} alt={company.companyName} className="w-full h-full object-contain" />
                : <span className="text-2xl font-black text-white/80">{initial}</span>}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-white">{company.companyName}</h1>
                {company.isVerified && (
                  <span className="flex items-center gap-1 text-xs text-lime-400 bg-lime-500/10 px-2 py-0.5 rounded-full font-semibold border border-lime-500/20">
                    <ShieldCheck size={11} /> Verified
                  </span>
                )}
              </div>

              {company.sector && (
                <p className="text-white/50 text-sm mt-0.5">{company.sector}</p>
              )}

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
                {company.totalOffersEver > 0 && (
                  <span className="flex items-center gap-1.5 text-xs text-white/40">
                    <Briefcase size={11} /> {company.totalOffersEver} internship{company.totalOffersEver !== 1 ? 's' : ''} posted
                  </span>
                )}
              </div>

              {company.websiteUrl && (
                <a
                  href={company.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 text-xs text-lime-400 hover:text-lime-300 transition-colors"
                >
                  <Globe size={12} /> {company.websiteUrl.replace(/^https?:\/\//, '')}
                  <ExternalLink size={10} />
                </a>
              )}
            </div>

            {/* Profile completeness */}
            <div className="flex-shrink-0 text-right hidden sm:block">
              <p className="text-[10px] text-white/30 uppercase tracking-wide mb-1">Profile</p>
              <p className={`text-2xl font-black ${profileColor}`}>{company.profileScore}%</p>
              <p className="text-[10px] text-white/25">complete</p>
            </div>
          </div>

          {/* Description */}
          {company.description && (
            <p className="mt-5 text-sm text-white/55 leading-relaxed border-t border-white/5 pt-4">
              {company.description}
            </p>
          )}
        </div>

        {/* Trust signals */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <TrustCard
            icon={ShieldCheck}
            label="Verification"
            value={company.isVerified ? 'Verified' : 'Unverified'}
            active={company.isVerified}
          />
          <TrustCard
            icon={Globe}
            label="Website"
            value={company.websiteUrl ? 'Listed' : 'Not listed'}
            active={!!company.websiteUrl}
          />
          <TrustCard
            icon={Building2}
            label="Description"
            value={company.description ? 'Complete' : 'Missing'}
            active={!!company.description}
          />
          <TrustCard
            icon={Briefcase}
            label="Active offers"
            value={`${company.openOffers?.length || 0} open`}
            active={(company.openOffers?.length || 0) > 0}
          />
        </div>

        {/* Open internships */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">
              Open Internships
              {company.openOffers?.length > 0 && (
                <span className="ml-2 text-xs text-white/30 font-normal">
                  ({company.openOffers.length})
                </span>
              )}
            </h2>
          </div>

          {company.openOffers?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-[#1a1a1a] rounded-2xl border border-white/5 text-white/20">
              <Briefcase size={36} className="mb-3" />
              <p className="text-sm">No open positions right now</p>
            </div>
          ) : (
            <div className="space-y-3">
              {company.openOffers.map(offer => (
                <Link
                  key={offer.id}
                  to={`/offers/${offer.id}`}
                  className="flex items-center gap-4 p-4 bg-[#1a1a1a] rounded-2xl border border-white/5 hover:border-lime-500/20 hover:bg-[#1f1f1f] transition-all group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm group-hover:text-lime-400 transition-colors truncate">
                      {offer.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      {offer.location && (
                        <span className="flex items-center gap-1 text-xs text-white/40">
                          <MapPin size={10} />{offer.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs text-white/40">
                        <Clock size={10} />{offer.durationWeeks}w
                      </span>
                      {offer.isPaid && (
                        <span className="px-1.5 py-0.5 bg-lime-500/10 text-lime-400 text-[10px] rounded font-semibold border border-lime-500/20">
                          Paid
                        </span>
                      )}
                      <span className="px-1.5 py-0.5 bg-white/5 text-white/40 text-[10px] rounded border border-white/8">
                        {offer.domain}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-white/30">Deadline</p>
                    <p className="text-xs font-medium text-white/60">{formatDate(offer.deadline)}</p>
                  </div>
                  <ExternalLink size={13} className="text-white/20 group-hover:text-lime-400 transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TrustCard({ icon: Icon, label, value, active }) {
  return (
    <div className={`p-3 rounded-xl border ${active ? 'bg-lime-500/5 border-lime-500/15' : 'bg-white/3 border-white/5'}`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon size={12} className={active ? 'text-lime-400' : 'text-white/20'} />
        <p className="text-[10px] text-white/30 uppercase tracking-wide">{label}</p>
      </div>
      <p className={`text-xs font-semibold ${active ? 'text-lime-400' : 'text-white/30'}`}>{value}</p>
    </div>
  );
}
