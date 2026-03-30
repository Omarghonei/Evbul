import { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
  const { listings, loading } = useData();
  const { token } = useAuth();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const API_URL = '/api/listings';

  if (loading) return <div className="container py-20 text-center font-bold">Veriler Yükleniyor... (Backend'i başlattığınıza emin olun)</div>;

  const handleEditClick = (listing) => {
    setEditingId(listing.id);
    setEditForm(listing);
  };

  const handleSave = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });
      setEditingId(null);
    } catch (err) {
      console.error("Güncelleme hatası", err);
    }
  };

  const handleDelete = async (id) => {
    if(confirm('İlanı silmek istediğinize emin misiniz?')) {
      await fetch(`${API_URL}/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    }
  };

  return (
    <div className="container py-12 animate-fade-in min-h-[80vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Sistem Yönetimi (Admin)</h1>
          <p className="text-secondary mt-2">Burası yönetim paneli. Fiyatları veya eksik kişi sayılarını anlık değiştirin.</p>
        </div>
        <div className="bg-success/20 text-success px-4 py-2 rounded-full font-bold shadow-glow flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-success animate-pulse inline-block"></span>
          Canlı Bağlantı Aktif
        </div>
      </div>

      <div className="glass-panel overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-secondary">
            <tr>
              <th className="p-4 border-b border-border-glass">ID</th>
              <th className="p-4 border-b border-border-glass">Başlık</th>
              <th className="p-4 border-b border-border-glass">Fiyat (₺)</th>
              <th className="p-4 border-b border-border-glass">Şehir</th>
              <th className="p-4 border-b border-border-glass">Durum (Mevcut/Eksik)</th>
              <th className="p-4 border-b border-border-glass text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {listings.map(l => (
              <tr key={l.id} className="border-b border-border-glass/50 hover:bg-secondary/20 transition-colors">
                <td className="p-4 text-sm text-secondary">#{l.id}</td>
                
                {editingId === l.id ? (
                  <>
                    <td className="p-4"><input className="input-field py-1 px-2" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} /></td>
                    <td className="p-4"><input type="number" className="input-field py-1 px-2 w-24 text-success font-bold" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} /></td>
                    <td className="p-4"><input className="input-field py-1 px-2 w-32" value={editForm.city} onChange={e => setEditForm({...editForm, city: e.target.value})} /></td>
                    <td className="p-4 flex gap-2">
                       <input type="number" className="input-field py-1 px-2 w-16" placeholder="Mevcut" value={editForm.occupants} onChange={e => setEditForm({...editForm, occupants: e.target.value})} /> 
                       <input type="number" className="input-field py-1 px-2 w-16" placeholder="Aranan" value={editForm.missing} onChange={e => setEditForm({...editForm, missing: e.target.value})} />
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => handleSave(l.id)} className="btn btn-primary py-1 px-3 text-sm">Kaydet</button>
                        <button onClick={() => setEditingId(null)} className="btn btn-glass py-1 px-3 text-sm">İptal</button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-4 font-medium">{l.title}</td>
                    <td className="p-4 font-bold text-gradient text-lg">₺{l.price}</td>
                    <td className="p-4 text-secondary">{l.city}</td>
                    <td className="p-4">
                      {l.type === 'apartment' ? (
                        <span className="badge badge-success">Tam Daire</span>
                      ) : (
                        <div className="flex items-center gap-2">
                           <span className="badge bg-secondary text-primary">{l.occupants} Kişi</span> 
                           {l.missing > 0 ? <span className="badge badge-warning">{l.missing} Eksik</span> : <span className="badge badge-primary">Dolu</span>}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleEditClick(l)} className="text-accent hover:underline mr-4 font-semibold">Düzenle</button>
                      <button onClick={() => handleDelete(l.id)} className="text-danger hover:underline font-semibold">Sil</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {listings.length === 0 && (
              <tr><td colSpan="6" className="p-8 text-center text-muted">Hiç ilan bulunamadı.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-8 bg-warning/20 border border-warning/50 p-4 rounded-md inline-block">
        <p className="text-sm font-semibold text-warning">
          ⚠️ Buradan yaptığınız her (Fiyat veya Durum) değişikliği "Gerçek Zamanlı (Real-Time)" olarak, 
          şu anda arama yapan veya ilanlara bakan tüm kullanıcılara saniyesinde yansıyacaktır.
        </p>
      </div>
    </div>
  );
};

export default Admin;
