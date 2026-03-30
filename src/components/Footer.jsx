import { Link } from 'react-router-dom';
import { Home, MessageCircle, Share2, Globe, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary mt-auto border-t border-border-glass pt-12 pb-6">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 text-primary text-decoration-none">
              <Home className="text-accent" size={24} />
              <span className="text-xl font-bold">Evbul</span>
            </Link>
            <p className="text-sm text-secondary mb-4 leading-relaxed">
              Öğrenciler ve yabancılar için Türkiye'nin en güvenilir, kolay ve interaktif kiralık ev ve ev arkadaşı bulma platformu.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted hover:text-accent transition-colors"><MessageCircle size={20}/></a>
              <a href="#" className="text-muted hover:text-accent transition-colors"><Share2 size={20}/></a>
              <a href="#" className="text-muted hover:text-accent transition-colors"><Globe size={20}/></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Hızlı Bağlantılar</h4>
            <ul className="flex flex-col gap-2 text-sm text-secondary list-none">
              <li><Link to="/search" className="hover:text-primary transition-colors text-decoration-none text-inherit">İlanları Keşfet</Link></li>
              <li><Link to="/login" className="hover:text-primary transition-colors text-decoration-none text-inherit">Ev Sahibi Girişi</Link></li>
              <li><Link to="/login" className="hover:text-primary transition-colors text-decoration-none text-inherit">Öğrenci Kayıt</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors text-decoration-none text-inherit">Nasıl Çalışır?</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Güvenlik & Destek</h4>
            <ul className="flex flex-col gap-2 text-sm text-secondary list-none">
              <li><a href="#" className="hover:text-primary transition-colors text-decoration-none text-inherit">Sıkça Sorulan Sorular</a></li>
              <li><a href="#" className="hover:text-primary transition-colors text-decoration-none text-inherit">Güvenlik İpuçları (Doğrulama)</a></li>
              <li><a href="#" className="hover:text-primary transition-colors text-decoration-none text-inherit">Kullanım Koşulları</a></li>
              <li><a href="#" className="hover:text-primary transition-colors text-decoration-none text-inherit">Gizlilik Politikası</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">İletişim</h4>
            <ul className="flex flex-col gap-2 text-sm text-secondary list-none">
              <li className="flex items-center gap-2"><MapPin size={16}/> İstanbul, Türkiye</li>
              <li className="flex items-center gap-2"><Mail size={16}/> destek@evbul.com</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border-glass pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted">
          <p>&copy; {new Date().getFullYear()} Evbul Platformu. Tüm hakları saklıdır. Bu site %100 doğrulanmış ilanlar sağlamayı hedefler.</p>
          <div className="flex gap-4 items-center">
            <span className="flex items-center gap-1 font-medium"><span className="w-2 h-2 rounded-full bg-success"></span> Sistem Aktif</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
