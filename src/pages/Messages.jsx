import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Messages = () => {
  const { user, token } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [socket, setSocket] = useState(null);

  if (!user) return <Navigate to="/login" />;

  useEffect(() => {
    // Fetch conversations
    fetch('/api/messages/conversations', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(r => r.json())
    .then(data => setConversations(data))
    .catch(console.error);

    // Socket.io removed due to Vercel Serverless environment limitations
  }, [token, user.id]);

  useEffect(() => {
    if (activeChat) {
      fetch(`/api/messages/${activeChat.user._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(r => r.json())
      .then(data => setMessages(data))
      .catch(console.error);
    }
  }, [activeChat, token]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if(!inputText.trim() || !activeChat) return;

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ receiverId: activeChat.user._id, text: inputText })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, data]);
      // Real-time broadcast disabled via Serverless Architecture constraint
      setInputText('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container py-8 flex-1 min-h-[80vh] flex flex-col md:flex-row gap-6">
      
      {/* Sidebar - Contacts */}
      <aside className="w-full md:w-1/3 glass-panel p-4 flex flex-col h-[75vh]">
        <h2 className="text-xl font-bold mb-4 border-b border-border-glass pb-2">Mesajlar</h2>
        <div className="flex-1 overflow-y-auto flex flex-col gap-2">
          {conversations.length === 0 ? (
             <p className="text-secondary text-sm p-2 text-center">Henüz bir mesajınız yok.</p>
          ) : conversations.map(c => (
             <button key={c.user._id} onClick={() => setActiveChat(c)}
               className={`text-left p-3 rounded-md transition-colors ${activeChat?.user._id === c.user._id ? 'bg-primary text-bg-primary' : 'hover:bg-secondary bg-secondary/30'}`}>
               <h4 className="font-bold">{c.user.name} <span className="text-xs opacity-75">({c.user.role})</span></h4>
               <p className="text-sm truncate opacity-80">{c.lastMessage}</p>
             </button>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="w-full md:w-2/3 glass-panel flex flex-col h-[75vh]">
        {activeChat ? (
          <>
            <div className="p-4 border-b border-border-glass bg-secondary/50 font-bold text-lg rounded-t-xl">
              {activeChat.user.name} ile konuşuyorsunuz
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 h-full">
              {messages.map(m => {
                const isMe = m.senderId === user.id;
                return (
                  <div key={m._id} className={`max-w-[70%] p-3 rounded-lg ${isMe ? 'bg-accent text-white self-end rounded-br-none' : 'bg-secondary self-start rounded-bl-none'}`}>
                    {m.text}
                  </div>
                )
              })}
            </div>

            <form onSubmit={sendMessage} className="p-4 border-t border-border-glass flex gap-2">
              <input type="text" className="input-field mb-0 flex-1" placeholder="Mesajınızı yazın..." 
                value={inputText} onChange={e => setInputText(e.target.value)} />
              <button type="submit" className="btn btn-primary px-6">Gönder</button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-secondary font-bold text-lg">
            Sohbet etmek için sol taraftan bir kişi seçin.
          </div>
        )}
      </main>

    </div>
  );
};
export default Messages;
