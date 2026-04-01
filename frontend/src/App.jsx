import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Search, Heart, Disc, User, ArrowRight } from 'lucide-react';
import { AuthContext } from './context/AuthContext';
import Login from './components/Login';
import ReviewSidebar from './components/ReviewSidebar';
import './App.css';

function App() {
  const { token, user, logout } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  if (!token) return <Login />;

  const handleSearch = async () => {
    if (!search) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/api/songs/search?q=${encodeURIComponent(search)}`);
      setSongs(res.data.songs);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const openReview = (song) => {
    setSelectedSong(song);
    setSidebarOpen(true);
  };

  const upgradeImg = (url) => {
    if (!url) return '';
    return url.replace(/\/\d+x\d+bb\.jpg$/, '/800x800bb.jpg');
  };

  return (
    <div className="brutal-outer">
      <header className="brutal-header">
        <div className="logo">
          <Disc size={32} strokeWidth={3} />
          <span>MELODEX / REVIEWS</span>
        </div>
        <div className="header-actions">
          <div className="user-pill">LOGGED IN: {user?.username?.toUpperCase() || 'USER'}</div>
          <button className="logout-btn" onClick={logout}>00 / LOGOUT</button>
        </div>
      </header>

      <div className="brutal-container">
        <aside className="brutal-sidebar">
          <nav>
            <div className="nav-btn active">01 / FEED</div>
            <div className="nav-btn">02 / SEARCH</div>
            <div className="nav-btn">03 / FAVORITES</div>
            <div className="nav-btn">04 / MY PROFILE</div>
          </nav>
        </aside>

        <main className="brutal-main">
          <div className="brutal-search-block">
            <Search size={22} />
            <input 
              type="text" 
              placeholder="SEARCH CATALOG..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="search-btn" onClick={handleSearch} disabled={loading}>
              {loading ? 'WAIT...' : 'GO'} <ArrowRight size={16} />
            </button>
          </div>

          <section className="brutal-hero">
            <h1>TRACK YOUR<br/>LISTEN LOGS.</h1>
            <p>A HIGH-UTILITY MUSIC ARCHIVE SYSTEM.</p>
          </section>

          <div className="brutal-grid">
            {songs.map((song) => (
              <div className="brutal-card" key={song.id} onClick={() => openReview(song)}>
                <img className="card-image-box" src={upgradeImg(song.cover_url)} alt={song.title} />
                <div className="card-info">
                  <h4>{song.title.toUpperCase()}</h4>
                  <p>{song.artist.toUpperCase()}</p>
                  <div className="card-footer">
                    <span>ALBUM: {song.album_name?.split(' ').slice(0, 2).join(' ').toUpperCase()}...</span>
                    <button className="icon-btn"><Heart size={18} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <ReviewSidebar 
        song={selectedSong} 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
    </div>
  );
}

export default App;
