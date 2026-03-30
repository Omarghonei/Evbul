import { useParams, Link } from 'react-router-dom';
import { MapPin, Users, Home as HomeIcon, CheckCircle, Info, ChevronLeft, Calendar, FileText, User } from 'lucide-react';
import { useData } from '../context/DataContext';

const ListingDetails = () => {
  const { id } = useParams();
  const { listings, loading, lastUpdate } = useData();

  const listing = listings.find(l => l.id == id);
  const isUpdated = lastUpdate?.id == id;

  if (loading) return <div className="container py-20 text-center font-bold">Veriler Yükleniyor...</div>;
  if (!listing) return <div className="container py-20 text-center">İlan bulunamadı veya kaldırılmış olabilir.</div>;

  return (
    <div className={`container py-8 animate-fade-in ${isUpdated ? 'live-update' : ''}`}>
      
      <Link to="/search" className="inline-flex items-center text-secondary hover:text-primary mb-6 transition-colors font-medium">
        <ChevronLeft size={20} /> Aramaya Dön
      </Link>
      
      {isUpdated && (
        <div className="mb-6 bg-success text-white px-4 py-3 rounded-lg font-bold shadow-glow animate-pulse">
          ⚡ Dikkat: İlan sahibi fiyatları veya durumu şu anda güncelledi. En yeni bilgileri görüyorsunuz.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col - Images & Info */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="relative w-full h-[40vh] md:h-[50vh] rounded-xl overflow-hidden shadow-md">
            <span className="badge badge-primary font-bold px-4 py-1 absolute top-4 left-4 z-10 backdrop-blur-md">{listing.city}</span>
            <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
          </div>

          <div className="glass-panel p-6 md:p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
                <p className="text-secondary flex items-center gap-1 font-medium"><MapPin size={16} /> Merkezi Konum, {listing.city}</p>
              </div>
              {listing.type === 'apartment' || listing.missing > 0 ? (
                 <div className="bg-success text-white px-3 py-1 rounded-md font-bold text-sm shadow-sm">Müsait</div>
              ) : (
                 <div className="bg-secondary text-primary px-3 py-1 rounded-md font-bold text-sm shadow-sm">Dolu</div>
              )}
            </div>

            <div className="flex flex-wrap gap-6 py-6 border-y border-border-glass mb-6">
              {listing.type === 'apartment' ? (
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-accent"><HomeIcon size={20} /></div>
                   <div><p className="text-xs text-secondary font-medium">Konaklama Tipi</p><p className="font-bold">Tam Daire</p></div>
                 </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-accent"><Users size={20} /></div>
                    <div><p className="text-xs text-secondary font-medium">Mevcut Durum</p><p className="font-bold">{listing.occupants} Kişi Yaşıyor</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-success"><User size={20} /></div>
                    <div><p className="text-xs text-secondary font-medium">Aranan</p>
                      {listing.missing > 0 ? (
                        <p className="font-bold text-success">{listing.missing} Ev Arkadaşı</p>
                      ) : (
                        <p className="font-bold text-muted">Şu an Aranan Yok</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Omitted boring filler texts for brevity */}
            <h2 className="text-xl font-bold mb-4">Açıklama</h2>
            <p className="text-secondary leading-relaxed mb-8">Bu platform üzerinden güncellenen %100 doğrulanmış ilanlardır.</p>
          </div>
        </div>

        {/* Right Col - Pricing & Apply Widget */}
        <aside className="lg:col-span-1">
          <div className={`glass-card p-6 sticky top-24 border-t-4 transition-all duration-300 ${isUpdated ? 'border-success' : 'border-accent'}`} style={{borderTopColor: isUpdated ? 'var(--success)' : 'var(--accent-primary)'}}>
            <h3 className="text-lg font-bold mb-6">Finansal Detaylar</h3>
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-secondary flex items-center gap-2 font-medium"><Calendar size={18} /> Aylık Kira</span>
              <span className={`text-2xl font-bold ${isUpdated ? 'text-success animate-pulse' : 'text-gradient'}`}>₺{listing.price}</span>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-secondary flex items-center gap-2 font-medium"><FileText size={18} /> Tahmini Faturalar</span>
              <span className="text-lg font-bold text-warning">{listing.bills === 'Dahil' ? 'Dahil' : `₺${listing.bills}`}</span>
            </div>

            <div className="bg-secondary p-4 rounded-md mb-6 relative mt-6">
              <div className={`absolute top-0 left-0 w-1 h-full rounded-l-md ${isUpdated ? 'bg-success' : 'bg-accent-primary'}`}></div>
              <h4 className="font-bold mb-1 text-sm">Aylık Toplam Beklenen</h4>
              <p className="text-2xl font-bold">
                 ₺{Number(listing.price) + (listing.bills === 'Dahil' ? 0 : Number(listing.bills))}
              </p>
            </div>

            <Link to="/login" className="btn btn-primary w-full py-3 mb-3 text-lg flex justify-center">Hemen İletişime Geç</Link>
          </div>
        </aside>

      </div>
    </div>
  );
};
export default ListingDetails;
