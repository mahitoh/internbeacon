import { Link } from 'react-router-dom';
import { MapPin, Clock, Banknote, Building2, ExternalLink, ShieldCheck } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export default function OfferCard({ offer, dark = false, basePath = '/offers' }) {
  const bg = dark 
    ? 'bg-forest-950/60 border-white/5 hover:border-lime-500/20 text-white' 
    : 'bg-white border-gray-100 hover:border-forest-200 hover:shadow-md';
  const text = dark ? 'text-white' : 'text-forest-950';
  const sub  = dark ? 'text-white/40' : 'text-forest-800/50';

  return (
    <Link to={`${basePath}/${offer.id}`}
      className={`block p-5 rounded-2xl border transition-all duration-200 group ${bg}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Company */}
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-forest-900 flex items-center justify-center flex-shrink-0 shadow-sm">
              {offer.company?.logoUrl
                ? <img src={offer.company.logoUrl} className="w-full h-full rounded-lg object-cover" alt="" />
                : <Building2 size={14} className="text-lime-400" />
              }
            </div>
            <span className={`text-xs font-bold ${sub}`}>{offer.company?.companyName}</span>
            {offer.company?.isVerified && (
              <ShieldCheck size={11} className="text-lime-400 flex-shrink-0" title="Verified company" />
            )}
          </div>

          {/* Title */}
          <h3 className={`font-extrabold text-base leading-snug truncate group-hover:text-forest-700 transition-colors ${text}`}>
            {offer.title}
          </h3>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className={`flex items-center gap-1 text-xs font-semibold ${sub}`}>
              <MapPin size={11} className="text-forest-800/40" />{offer.location}
            </span>
            <span className={`flex items-center gap-1 text-xs font-semibold ${sub}`}>
              <Clock size={11} className="text-forest-800/40" />{offer.durationWeeks}w
            </span>
            {offer.isPaid && (
              <span className={`flex items-center gap-1 text-xs font-semibold ${sub}`}>
                <Banknote size={11} className="text-forest-800/40" />{offer.stipendCurrency} {Number(offer.stipendAmount).toLocaleString()}/mo
              </span>
            )}
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${dark ? 'bg-white/5 text-white/50 border border-white/10' : 'bg-[#f2f1ea] text-forest-800 border border-[#e7e4d5]'}`}>
              {offer.domain}
            </span>
            {offer.isPaid && (
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${dark ? 'bg-lime-500/10 text-lime-400 border border-lime-500/25' : 'bg-lime-100/50 text-forest-950 border border-lime-300/30'}`}>
                Paid
              </span>
            )}
          </div>
        </div>

        <ExternalLink size={14} className={`flex-shrink-0 mt-1 ${sub} opacity-0 group-hover:opacity-100 transition-opacity`} />
      </div>

      {/* Deadline */}
      <div className={`mt-3 pt-3 border-t flex items-center justify-between ${dark ? 'border-white/5' : 'border-gray-100'}`}>
        <span className={`text-xs font-semibold ${sub}`}>Deadline: {formatDate(offer.deadline)}</span>
        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${dark ? 'bg-lime-500/10 text-lime-400 border border-lime-500/25' : 'bg-[#f2faf6] text-forest-700 font-bold border border-[#def2e8]'}`}>
          {offer.openings} opening{offer.openings !== 1 ? 's' : ''}
        </span>
      </div>
    </Link>
  );
}
