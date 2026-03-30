import { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const DataContext = createContext();

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
const SOCKET_URL = BACKEND_URL || '/';
const API_URL = `${BACKEND_URL}/api/listings`;

export const DataProvider = ({ children }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null); 

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setListings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("API'ye ulaşılamadı. Backend kapalı olabilir:", err);
        setLoading(false);
      });

    const socket = io(SOCKET_URL);

    socket.on('NEW_LISTING', (newListing) => {
      setListings(prev => [...prev, newListing]);
      setLastUpdate({ id: newListing.id, type: 'new' });
      setTimeout(() => setLastUpdate(null), 3500);
    });

    socket.on('UPDATE_LISTING', (updatedListing) => {
      setListings(prev => prev.map(l => l.id == updatedListing.id ? updatedListing : l));
      setLastUpdate({ id: updatedListing.id, type: 'update' });
      setTimeout(() => setLastUpdate(null), 3500);
    });

    socket.on('DELETE_LISTING', (id) => {
      setListings(prev => prev.filter(l => l.id != id));
    });

    return () => socket.disconnect();
  }, []);

  return (
    <DataContext.Provider value={{ listings, loading, lastUpdate }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
