import { useQuery } from '@tanstack/react-query';
import { Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { offersApi } from '../../api/offers';
import OfferCard from '../../components/offers/OfferCard';
import Spinner from '../../components/ui/Spinner';

export default function StudentSavedOffers() {
  const { data, isLoading } = useQuery({
    queryKey: ['bookmarks'],
    queryFn:  () => offersApi.bookmarks().then(r => r.data.data || []),
  });

  const saved = data || [];

  return (
    <div className="space-y-5" style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}>
      <div>
        <h2 className="text-2xl font-black" style={{ color: '#1B1D1A' }}>Saved Offers</h2>
        <p className="text-sm mt-0.5" style={{ color: '#9A9E97' }}>
          {saved.length} saved internship{saved.length !== 1 ? 's' : ''}
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : saved.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl"
          style={{ background: '#fff', border: '1px solid #E7E6DF', color: '#C0BFBA' }}>
          <Bookmark size={40} className="mb-3 opacity-50" />
          <p className="text-sm font-medium">No saved offers yet</p>
          <p className="text-xs mt-1" style={{ color: '#9A9E97' }}>Bookmark internships you like to revisit them later</p>
          <Link to="/student/offers" className="mt-4 text-xs font-semibold" style={{ color: '#1E5B45' }}>
            Browse internships →
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {saved.map(offer => (
            <OfferCard key={offer.id} offer={offer} basePath="/student/offers" companyBasePath="/student/companies" />
          ))}
        </div>
      )}
    </div>
  );
}
