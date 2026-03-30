import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', price: '', city: '', type: 'apartment', bills: '', occupants: 0, missing: 0
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Security Check: Ensure only authenticated Landlords (or Admins) access this route
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'student') return <div className="container py-20 text-center text-danger font-bold text-2xl">Bu sayfaya erişim yetkiniz yok. Menüden 'Öğrenci' yerine 'Ev Sahibi' rolüyle hesabınıza giriş yapın.</div>;

  const handleImageChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrls = [];
      // Upload Images to Cloudinary if files exist
      if (files.length > 0) {
        const uploadData = new FormData();
        Array.from(files).forEach(f => uploadData.append('images', f));
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: uploadData
        });
        const uploadJson = await uploadRes.json();
        if(!uploadRes.ok) throw new Error(uploadJson.error || 'Resim yükleme hatası (Cloudinary bağlanamadı)');
        imageUrls = uploadJson.urls;
      }

      // Save Listing to MongoDB
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({...formData, images: imageUrls, image: imageUrls[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600'})
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.error || 'İlan veritabanına kaydedilemedi');
      
      alert('Tebrikler! İlan başarıyla yayınlandı!');
      navigate('/');
    } catch(err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-12 flex justify-center flex-1 min-h-[80vh]">
      <div className="glass-card w-full max-w-2xl p-8 animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl"></div>
        
        <h1 className="text-3xl font-bold mb-6 border-b border-border-glass pb-4 flex items-center gap-3">
           🏠 Yeni İlan Ekle (Ev Sahibi Paneli)
        </h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
          <div className="input-group mb-0">
            <label className="input-label">Dikkat Çekici İlan Başlığı</label>
            <input type="text" className="input-field" placeholder="Örn: Kadıköy Moda'da Metroya Çok Yakın 2+1..." required 
               value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="input-group mb-0">
              <label className="input-label text-success font-bold">Aylık Kira Ücreti (₺)</label>
              <input type="number" className="input-field font-bold" placeholder="15000" required 
                 value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            </div>
            <div className="input-group mb-0">
              <label className="input-label">Şehir / İlçe</label>
              <input type="text" className="input-field" placeholder="Örn: İstanbul, Beşiktaş" required 
                 value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-y border-border-glass py-4">
            <div className="input-group mb-0">
              <label className="input-label">Ev/Oda Tipi</label>
              <select className="input-field bg-secondary" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="apartment">Tam Daire (Komple)</option>
                <option value="room">Ayrı Özel Oda</option>
                <option value="shared">Paylaşımlı Oda</option>
              </select>
            </div>
            <div className="input-group mb-0">
              <label className="input-label">Fatura Durumu (Elektrik/Su...)</label>
               <input type="text" className="input-field" placeholder="Örn: Faturalar Dahil veya 1000₺" 
                  value={formData.bills} onChange={e => setFormData({...formData, bills: e.target.value})} />
            </div>
          </div>

          {formData.type !== 'apartment' && (
             <div className="grid grid-cols-2 gap-4 bg-secondary p-4 rounded-xl border border-accent/30 shadow-inner">
                <div className="input-group mb-0">
                  <label className="input-label text-primary">Evde Şu An Yaşayan Kişi</label>
                  <input type="number" className="input-field" min="0" value={formData.occupants} onChange={e => setFormData({...formData, occupants: e.target.value})} />
                </div>
                <div className="input-group mb-0">
                  <label className="input-label font-bold text-accent">Aranan Ev Arkadaşı</label>
                  <input type="number" className="input-field" min="0" value={formData.missing} onChange={e => setFormData({...formData, missing: e.target.value})} />
                </div>
             </div>
          )}

          <div className="input-group mb-0 p-6 border-2 border-dashed border-accent/50 rounded-xl bg-accent-secondary/5 text-center transition-colors hover:bg-accent-secondary/10 cursor-pointer">
            <label className="input-label font-bold text-accent text-lg mb-2">📸 Fotoğraf Yükle (En fazla 5 adet)</label>
            <p className="text-sm text-secondary mb-4">Gerçek fotoğraflar ekleyerek ilanınızın onaylanmasını hızlandırın.</p>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-bg-primary hover:file:bg-accent-secondary transition-all" />
          </div>

          <button type="submit" disabled={loading} className={`btn btn-primary w-full py-4 text-xl shadow-glow ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {loading ? 'Sisteme Yükleniyor Lütfen Bekleyin...' : '🌍 İlanı Platformda Yayınla'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Dashboard;
