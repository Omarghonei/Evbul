import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import ListingDetails from './pages/ListingDetails';
import Admin from './pages/Admin';
import Messages from './pages/Messages';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
      <DataProvider>
        <Router>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/search" element={<Search />} />
                <Route path="/listing/:id" element={<ListingDetails />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/messages" element={<Messages />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
