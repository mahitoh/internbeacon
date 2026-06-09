import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MapPin, Clock, Banknote, Building2, Calendar, ArrowLeft, Bookmark, Share2, Users } from 'lucide-react';
import { offersApi } from '../../api/offers';
import { applicationsApi } from '../../api/applications';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import { formatDate } from '../../lib/utils';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function OfferDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [applying, setApplying]         = useState(false);
  const [coverLetter, setCoverLetter]   = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [bookmarking, setBookmarking]   = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['offer', id],
    queryFn: () => offersApi.getOne(id).then(r => r.data.data),
  });

  // Derive bookmark status from query data (onSuccess removed in TanStack Query v5)
  const { data: bookmarksData } = useQuery({
    queryKey: ['bookmarks'],
    queryFn:  () => offersApi.bookmarks().then(r => r.data.data || []),
    enabled:  user?.role === 'student',
  });
  const bookmarked = bookmarksData?.some(o => o.id === id) ?? false;

  const handleApply = async () => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'student') { toast.error('Only students can apply'); return; }
    setApplying(true);
    try {
      await applicationsApi.apply({ offerId: id, coverLetter });
      toast.success('Application submitted!');
      navigate('/student/applications');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to apply';
      toast.error(msg);
    } finally { setApplying(false); }
  };

  const handleBookmark = async () => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'student') { toast.error('Only students can save offers'); return; }
    setBookmarking(true);
    try {
      if (bookmarked) {
        await offersApi.unbookmark(id);
        toast.success('Removed from saved');
      } else {
        await offersApi.bookmark(id);
        toast.success('Offer saved!');
      }
      qc.invalidateQueries({ queryKey: ['bookmarks'] });
    } catch {
      toast.error('Could not update saved offers');
    } finally { setBookmarking(false); }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => toast.success('Link copied!'))
      .catch(() => toast.error('Could not copy link'));
  };

  if (isLoading) return <div className="flex justify-center items-center min-h-screen bg-sand-50"><Spinner /></div>;
  if (!data)     return <div className="text-center pt-32 text-forest-800/60 font-bold bg-sand-50 min-h-screen">Offer not found</div>;

  const offer = data;

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs sm:text-sm font-bold text-forest-800/65 hover:text-forest-950 mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to offers
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header card */}
            <div className="bg-white rounded-3xl border  p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className="w-16 h-16 rounded-2xl bg-forest-900 flex items-center justify-center flex-shrink-0 shadow-sm">
                  {offer.company?.logoUrl
                    ? <img src={offer.company.logoUrl} className="w-full h-full rounded-2xl object-cover" alt="" />
                    : <Building2 size={26} className="text-lime-400" />}
                </div>
                <div className="flex-1 space-y-1.5">
                  <h1 className="text-xl sm:text-2xl font-black text-forest-950">{offer.title}</h1>
                  <p className="text-sm font-semibold text-forest-800/60">{offer.company?.companyName}</p>
                  <div className="flex flex-wrap gap-2.5 pt-3">
                    <Chip icon={MapPin}>{offer.location}</Chip>
                    <Chip icon={Clock}>{offer.durationWeeks} weeks</Chip>
                    {offer.isPaid && <Chip icon={Banknote}>{offer.stipendCurrency} {Number(offer.stipendAmount).toLocaleString()}/mo</Chip>}
                    <Chip icon={Users}>{offer.openings} opening{offer.openings !== 1 ? 's' : ''}</Chip>
                    <Chip icon={Calendar}>Deadline: {formatDate(offer.deadline)}</Chip>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl border  p-6 sm:p-8 shadow-sm space-y-6">
              <div className="space-y-3">
                <h2 className="text-lg font-black text-forest-950">About the role</h2>
                <p className="text-forest-800/80 text-sm sm:text-base leading-relaxed whitespace-pre-line">{offer.description}</p>
              </div>

              {offer.responsibilities && (
                <div className="space-y-3 pt-6 border-t ">
                  <h3 className="text-base font-black text-forest-950">Responsibilities</h3>
                  <p className="text-forest-800/80 text-sm leading-relaxed whitespace-pre-line">{offer.responsibilities}</p>
                </div>
              )}
              {offer.requirements && (
                <div className="space-y-3 pt-6 border-t ">
                  <h3 className="text-base font-black text-forest-950">Requirements</h3>
                  <p className="text-forest-800/80 text-sm leading-relaxed whitespace-pre-line">{offer.requirements}</p>
                </div>
              )}
              {offer.requiredSkills?.length > 0 && (
                <div className="space-y-3 pt-6 border-t ">
                  <h3 className="text-base font-black text-forest-950">Required Skills</h3>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {offer.requiredSkills.map(s => (
                      <span key={s} className="px-3.5 py-1 bg-lime-100/50 text-forest-950 border border-lime-300/30 rounded-lg text-xs font-bold">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Apply form */}
            {showApplyForm && (
              <div className="bg-white rounded-3xl border  p-6 sm:p-8 shadow-sm space-y-4">
                <h2 className="text-lg font-black text-forest-950">Cover Letter (optional)</h2>
                <textarea
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  rows={5}
                  placeholder="Tell the company why you're the right candidate for this role…"
                  className="w-full rounded-2xl border  p-4 text-sm text-forest-950 placeholder:text-forest-800/30 focus:outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-400/10 bg-sand-50/50 resize-none"
                />
                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={handleApply} 
                    disabled={applying}
                    className="bg-forest-950 text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-forest-900 transition-all shadow-sm">
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                  <button 
                    onClick={() => setShowApplyForm(false)}
                    className="bg-white text-forest-950 border  font-bold text-sm px-6 py-3 rounded-xl hover:bg-sand-100 transition-all">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border  p-6 shadow-sm sticky top-24 space-y-6">
              <div className="space-y-3">
                {!showApplyForm && (
                  <button 
                    onClick={() => user?.role === 'student' ? setShowApplyForm(true) : navigate('/login')}
                    className="w-full bg-forest-950 text-white font-bold py-3.5 rounded-xl hover:bg-forest-900 transition-all text-center text-sm shadow-sm">
                    Apply Now
                  </button>
                )}
                <button
                  onClick={handleBookmark}
                  disabled={bookmarking}
                  className={`w-full font-bold py-3.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2 border ${bookmarked ? 'bg-lime-50 text-lime-700 border-lime-300' : 'bg-white text-forest-950 border-forest-200 hover:bg-sand-50'}`}>
                  <Bookmark size={15} className={bookmarked ? 'fill-lime-600' : ''} />
                  {bookmarked ? 'Saved' : 'Save Offer'}
                </button>
                <button
                  onClick={handleShare}
                  className="w-full bg-white text-forest-950 border border-forest-200 hover:bg-sand-50 font-bold py-3.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2">
                  <Share2 size={15} /> Share
                </button>
              </div>

              <div className="space-y-4 pt-6 border-t ">
                <InfoRow label="Domain"    value={offer.domain} />
                <InfoRow label="Duration"  value={`${offer.durationWeeks} weeks`} />
                <InfoRow label="Location"  value={offer.location} />
                <InfoRow label="Openings"  value={offer.openings} />
                <InfoRow label="Start Date" value={offer.startDate ? formatDate(offer.startDate) : 'Flexible'} />
                <InfoRow label="Deadline"  value={formatDate(offer.deadline)} />
                <InfoRow label="Compensation" value={offer.isPaid ? `Yes — ${offer.stipendCurrency} ${Number(offer.stipendAmount).toLocaleString()}/mo` : 'Unpaid'} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Chip({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sand-100 text-forest-900 rounded-lg text-xs font-semibold">
      <Icon size={12} className="text-forest-800/70" />{children}
    </span>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between text-xs sm:text-sm">
      <span className="font-semibold text-forest-800/40">{label}</span>
      <span className="font-bold text-forest-950">{value}</span>
    </div>
  );
}
