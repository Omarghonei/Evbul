import { Link } from 'react-router-dom';
import { MapPin, Users, User, Home as HomeIcon, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useData } from '../context/DataContext';

const Search = () => {
  const [filterCity, setFilterCity] = useState('');
  const { listings, loading, lastUpdate } = useData();
  
  return (
    <div className="container py-8 animate-fade-in flex flex-col md:flex-row gap-6 min-h-[80vh]">
      
      {/* Sidebar Filters */}
      <aside className="w-full md:w-1/4">
        <div className="glass-card p-6 sticky top-24">
          <div className="flex items-center gap-2 mb-6 border-b pb-4 border-border-glass">
            <SlidersHorizontal size={20} className="text-accent" />
            <h2 className="text-xl font-bold">Filtreler</h2>
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="input-group mb-0">
              <label className="input-label">Şehir</label>
              <div className="relative flex items-center w-full">
                <MapPin className="absolute left-3 text-muted pointer-events-none" size={20} />
                <select className="input-field pl-12 bg-secondary" value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
                  <option value="">Tüm Şehirler</option>
                  <option value="İstanbul">İstanbul</option>
                  <option value="Ankara">Ankara</option>
                  <option value="İzmir">İzmir</option>
                </select>
              </div>
            </div>

            <div className="input-group mb-0">
              <label className="input-label">Konaklama Türü</label>
              <select className="input-field bg-secondary">
                <option value="">Farketmez</option>
                <option value="apartment">Tam Daire</option>
                <option value="room">Tek Kişilik Oda</option>
                <option value="shared">Paylaşımlı Oda</option>
              </select>
            </div>

            <div className="input-group mb-0">
              <label className="input-label">Aylık Bütçe (₺)</label>
              <div className="flex gap-2">
                <input type="number" className="input-field px-2 text-center" placeholder="Min" />
                <span className="text-secondary self-center">-</span>
                <input type="number" className="input-field px-2 text-center" placeholder="Max" />
              </div>
            </div>

            <button className="btn btn-primary w-full mt-4 py-3">Sonuçları Göster</button>
          </div>
        </div>
      </aside>

      {/* Main Results */}
      <main className="w-full md:w-3/4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-border-glass pb-4">
          <h1 className="text-2xl font-bold">Türkiye Genelinde İlanlar</h1>
          <span className="text-sm font-bold bg-secondary text-primary px-4 py-2 rounded-full shadow-sm">
            {loading ? "Yükleniyor..." : `${listings.length} Sonuç Bulundu`}
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20 font-bold text-secondary text-xl">İlanlar Aratılıyor...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {listings.map((listing) => {
              const isUpdated = lastUpdate?.id == listing.id;
              return (
                <Link to={`/listing/${listing.id}`} key={listing.id} className={`listing-card glass-card relative transition-all duration-300 block ${isUpdated ? 'live-update' : ''}`}>
                  
                  {isUpdated && (
                    <div className="absolute top-2 right-2 z-20 bg-success text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      {lastUpdate.type === 'new' ? '+ YENİ EKLENDİ!' : '⚡ BİLGİ GÜNCELLENDİ!'}
                    </div>
                  )}

                  <div className="card-image-wrapper h-48">
                    <span className="badge badge-primary absolute-badge">{listing.city}</span>
                    <img src={listing.image} alt={listing.title} className="card-image" />
                  </div>
                  <div className="card-info flex-1 flex flex-col p-4">
                    <h3 className="mb-2 font-bold text-lg">{listing.title}</h3>
                    
                    <div className="card-stats">
                      {listing.type === 'apartment' ? (
                        <span className="stat text-secondary"><HomeIcon size={16}/> Tam Daire</span>
                      ) : (
                        <>
                          <span className="stat text-secondary"><Users size={16}/> {listing.occupants} Kişi</span>
                          {listing.missing > 0 ? (
                            <span className="stat text-success font-bold"><User size={16}/> {listing.missing} Eksik</span>
                          ) : (
                            <span className="stat text-muted">Dolu</span>
                          )}
                        </>
                      )}
                    </div>
                    
                    <div className="card-price-row mt-auto pt-4 border-t border-border-glass">
                      <div className="price-item">
                        <span className="price-label">Aylık Kira</span>
                        <span className={`price-value font-bold ${isUpdated ? 'text-success' : 'text-gradient'}`}>₺{listing.price}</span>
                      </div>
                      <div className="price-item align-right">
                        <span className="price-label">Tahmini Fatura</span>
                        <span className="price-value-small font-semibold text-warning">{listing.bills === 'Dahil' ? 'Dahil' : `₺${listing.bills}`}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
            
            {listings.length === 0 && !loading && (
              <div className="col-span-1 md:col-span-2 text-center py-20 text-muted">Seçili kriterlere uygun ilan bulunamadı.</div>
            )}
          </div>
        )}
      </main>

    </div>
  );
};

export default Search;
