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
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-black text-white">Saved Offers</h2>
        <p className="text-white/40 text-sm mt-0.5">{saved.length} saved internship{saved.length !== 1 ? 's' : ''}</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : saved.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-white/20">
          <Bookmark size={40} className="mb-3" />
          <p className="text-sm">No saved offers yet</p>
          <Link to="/offers" className="mt-3 text-lime-400 text-xs hover:underline">Browse internships →</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {saved.map(offer => <OfferCard key={offer.id} offer={offer} dark basePath="/student/offers" />)}
        </div>
      )}
    </div>
  );
}
