import { Link } from 'react-router-dom';
import { Home, Search, LogIn, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo">
          <Home className="logo-icon" size={28} />
          <span className="logo-text text-gradient">Evbul</span>
        </Link>
        <div className="nav-links">
          <button onClick={toggleTheme} className="btn-icon" aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Link to="/search" className="nav-link hidden-mobile">
            <Search size={18} />
            <span>Ev Ara</span>
          </Link>
          <Link to="/login" className="btn btn-primary">
            <LogIn size={18} />
            <span className="hidden-mobile">Giriş Yap</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
