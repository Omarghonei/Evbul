import { Link } from 'react-router-dom';
import { Search, MapPin, Users, User, Home as HomeIcon, ShieldCheck, Clock, ThumbsUp, Star, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';

const Home = () => {
  const { listings, loading, lastUpdate } = useData();
  const displayListings = listings.slice(0, 6);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section animate-fade-in relative overflow-hidden px-4 md:px-0">
        <div className="hero-glow"></div>
        <h1 className="hero-title text-5xl md:text-6xl text-center">
          Türkiye'de Yeni <span className="text-gradient">Evini Bul</span>
        </h1>
        <p className="hero-subtitle text-center mb-8 px-4 md:px-0">
          Öğrenciler ve yabancılar için %100 Doğrulanmış, güvenilir kiralık daireler, odalar ve ev arkadaşı platformu.
        </p>

        <div className="quick-search glass-card delay-1 w-full max-w-4xl flex flex-col md:flex-row gap-4">
          <div className="input-group mb-0 relative w-full flex items-center">
            <MapPin className="absolute left-3 text-muted pointer-events-none" size={20} />
            <input type="text" className="input-field pl-12" placeholder="Hangi şehir? (İstanbul...)" />
          </div>
          <div className="input-group mb-0 relative w-full flex items-center">
            <Users className="absolute left-3 text-muted pointer-events-none" size={20} />
            <select className="input-field pl-12 bg-secondary">
              <option value="">Ev veya Oda Türü</option>
              <option value="apartment">Tam Daire</option>
              <option value="room">Tek Kişilik Oda</option>
              <option value="shared">Paylaşımlı Oda</option>
            </select>
          </div>
          <Link to="/search" className="btn btn-primary search-btn py-3 mt-2 md:mt-0 w-full md:w-auto flex justify-center">
            <Search size={20} /> Ara
          </Link>
        </div>
      </section>

      {/* Trust Badges Bar */}
      <section className="border-y border-border-glass bg-secondary/50 py-12 delay-1 px-4">
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-5xl">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-success/20 text-success flex items-center justify-center mb-2"><ShieldCheck size={32} /></div>
            <h3 className="font-bold text-xl">%100 Doğrulanmış İlanlar</h3>
            <p className="text-secondary text-sm leading-relaxed px-4">Sistemimizdeki tüm ev sahipleri ve profiller manuel incelenir, dolandırıcılıklara karşı tam koruma sağlanır.</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-accent/20 text-accent flex items-center justify-center mb-2"><Clock size={32} /></div>
            <h3 className="font-bold text-xl">Canlı Veri (Real-Time)</h3>
            <p className="text-secondary text-sm leading-relaxed px-4">Bir fiyat değiştiğinde veya boş oda kalmadığında saniyesinde ekranınızda görürsünüz. Sayfayı yenilemenize gerek yok!</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-warning/20 text-warning flex items-center justify-center mb-2"><ThumbsUp size={32} /></div>
            <h3 className="font-bold text-xl">7/24 Aktif Destek</h3>
            <p className="text-secondary text-sm leading-relaxed px-4">Sorun mu yaşıyorsunuz? Yabancı dilde de destek veren müşteri temsilcilerimiz her an yanınızda.</p>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="featured-section container py-16 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4 border-b border-border-glass pb-4">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex flex-wrap items-center gap-3">
              Öne Çıkan İlanlar
              {lastUpdate && <span className="bg-success text-white text-xs px-2 py-1 rounded-full animate-pulse shadow-glow">🔴 Canlı Güncellendi</span>}
            </h2>
            <p className="text-secondary text-lg">Öğrenciler için seçilmiş, güvenilir en uygun yerler</p>
          </div>
          <Link to="/search" className="btn btn-glass group">
            Tümünü İncele <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 font-bold text-secondary text-xl">Canlı İlanlar Yükleniyor... (Backend'i kontrol edin)</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayListings.map(listing => {
              const isUpdated = lastUpdate?.id == listing.id; // Correct matching for int/string
              return (
                <Link to={`/listing/${listing.id}`} key={listing.id} className={`listing-card glass-card relative transition-all duration-300 block ${isUpdated ? 'live-update' : ''}`}>
                  
                  {isUpdated && (
                    <div className="absolute top-2 right-2 z-20 bg-success text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      {lastUpdate.type === 'new' ? '+ YENİ EKLENDİ!' : '⚡ FİYAT/DURUM GÜNCELLENDİ!'}
                    </div>
                  )}

                  <div className="card-image-wrapper h-48">
                    <span className="badge badge-primary absolute-badge">{listing.city}</span>
                    <img src={listing.image} alt={listing.title} className="card-image" />
                  </div>
                  <div className="card-info flex flex-col flex-1 p-4">
                    <h3 className="mb-2 truncate text-lg font-bold">{listing.title}</h3>
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
          </div>
        )}
      </section>

      {/* How it Works */}
      <section className="py-20 bg-secondary/50 px-4">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Nasıl Çalışır?</h2>
            <p className="text-secondary max-w-2xl mx-auto">Evbul ile aradığınız evi veya ev arkadaşını bulmak sadece üç adım sürer. Kolay, hızlı ve güvenli.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="absolute top-12 left-1/4 right-1/4 h-0.5 bg-border-glass hidden md:block z-0"></div>
            
            <div className="relative flex flex-col items-center text-center z-10 p-4">
              <div className="w-20 h-20 rounded-full bg-accent-gradient text-white flex items-center justify-center text-3xl font-bold mb-6 shadow-glow border-4 border-bg-primary">1</div>
              <h3 className="text-xl font-bold mb-3">Arama Yapın</h3>
              <p className="text-secondary leading-relaxed">Şehir, bütçe ve konaklama türüne göre binlerce güvenilir ve onaylı ilanı filtreleyin.</p>
            </div>
            
            <div className="relative flex flex-col items-center text-center z-10 p-4">
              <div className="w-20 h-20 rounded-full bg-accent-gradient text-white flex items-center justify-center text-3xl font-bold mb-6 shadow-glow border-4 border-bg-primary">2</div>
              <h3 className="text-xl font-bold mb-3">İletişime Geçin</h3>
              <p className="text-secondary leading-relaxed">Güvenli mesajlaşma sistemimiz üzerinden ilgilendiğiniz evin sahibiyle doğrudan görüşün.</p>
            </div>
            
            <div className="relative flex flex-col items-center text-center z-10 p-4">
              <div className="w-20 h-20 rounded-full bg-accent-gradient text-white flex items-center justify-center text-3xl font-bold mb-6 shadow-glow border-4 border-bg-primary">3</div>
              <h3 className="text-xl font-bold mb-3">Yeni Evinize Taşının</h3>
              <p className="text-secondary leading-relaxed">Profil doğrulamanızı tamamlayın, güvenle anlaşın ve yeni evinize yerleşmenin keyfini çıkarın.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonial / Social Proof */}
      <section className="py-24 container px-4">
        <div className="glass-panel p-8 md:p-16 text-center relative overflow-hidden border border-accent/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 z-0"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-secondary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 z-0"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="flex justify-center mb-8 text-warning">
              <Star fill="currentColor" size={28} />
              <Star fill="currentColor" size={28} />
              <Star fill="currentColor" size={28} />
              <Star fill="currentColor" size={28} />
              <Star fill="currentColor" size={28} />
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 leading-tight italic opacity-90">
              "Yabancı bir öğrenci olarak Türkiye'de ev bulmak dolandırıcılık korkusu yüzünden kabus gibiydi. Evbul'un %100 doğrulanmış profilleri ve Canlı Veri özelliği sayesinde mükemmel bir oda buldum."
            </h2>
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-accent">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" alt="User Avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold text-lg">Ahmed R.</p>
                <p className="text-secondary text-sm">Marmara Üniversitesi Öğrencisi</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
