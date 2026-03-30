import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Home, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [role, setRole] = useState('seeker'); // 'seeker' or 'owner'
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin 
      ? { email: formData.email, password: formData.password }
      : { ...formData, role: role === 'seeker' ? 'student' : 'landlord' };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Bir hata oluştu');

      login(data.user, data.token);
      
      // Navigate users properly based on their new secure role
      if (data.user.role === 'admin' || data.user.role === 'landlord') {
        navigate('/admin');
      } else {
        navigate('/search');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-12 flex justify-center items-center flex-1 min-h-[80vh]">
      <div className="glass-card animate-fade-in w-full max-w-md p-6">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Hoş Geldiniz</h1>
          <p className="text-secondary">
            {role === 'seeker' ? 'Yeni evinizi veya ev arkadaşınızı bulun.' : 'Ev veya odanızı kiraya verin.'}
          </p>
        </div>

        {/* Role Toggle */}
        <div className="role-toggle mb-8">
          <div className={`role-bg ${role === 'owner' ? 'owner' : ''}`} />
          <button 
            type="button"
            className={`role-btn ${role === 'seeker' ? 'text-white' : 'text-secondary'}`}
            onClick={() => setRole('seeker')}
          >
            <User size={18} /> Öğrenci / Kiracı
          </button>
          <button 
            type="button"
            className={`role-btn ${role === 'owner' ? 'text-white' : 'text-secondary'}`}
            onClick={() => setRole('owner')}
          >
            <Home size={18} /> Ev Sahibi
          </button>
        </div>

        {error && <div className="bg-danger/20 text-danger p-3 rounded-md mb-4 text-sm font-bold border border-danger/50">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div className="input-group mb-0 relative">
              <label className="input-label">Ad Soyad</label>
              <div className="relative flex items-center w-full">
                <User className="absolute left-3 text-muted pointer-events-none" size={20} />
                <input type="text" className="input-field pl-12" placeholder="Adınız Soyadınız" required={!isLogin} 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
            </div>
          )}

          <div className="input-group mb-0 relative">
            <label className="input-label">E-posta</label>
            <div className="relative flex items-center w-full">
              <Mail className="absolute left-3 text-muted pointer-events-none" size={20} />
              <input type="email" className="input-field pl-12" placeholder="ornek@email.com" required 
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
          </div>

          <div className="input-group mb-0 relative">
            <label className="input-label">Şifre</label>
            <div className="relative flex items-center w-full">
              <Lock className="absolute left-3 text-muted pointer-events-none" size={20} />
              <input type="password" className="input-field pl-12" placeholder="••••••••" required 
                value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full mt-4 py-3 text-lg" disabled={loading}>
            {loading ? 'Lütfen bekleyin...' : (isLogin ? 'Giriş Yap' : 'Kayıt Ol')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-secondary">
          {isLogin ? "Hesabınız yok mu?" : "Zaten hesabınız var mı?"}{" "}
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="font-bold text-accent cursor-pointer border-none bg-transparent">
            {isLogin ? 'Buradan kayıt olun' : 'Giriş yapın'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;
