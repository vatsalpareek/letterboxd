import React, { useState, useContext } from 'react';
import { Search, Heart, Disc, User, ArrowRight } from 'lucide-react';
import { AuthContext } from './context/AuthContext';
import Login from './components/Login';
import './App.css';

function App() {
  const [selectedSong, setSelectedSong] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const { token, user, logout } = useContext(AuthContext);
  const [search, setSearch] = useState("");

  // Logic: If there is no token, show the Login page and nothing else.
  if (!token) {
    return <Login />;
  }
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!search) return;
    setLoading(true);
    try {
      // Connect to your backend search endpoint
      const res = await axios.get(`http://localhost:3000/api/songs/search?q=${encodeURIComponent(search)}`);
      setSongs(res.data.songs);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
    const openReview = (song) => {
      setSelectedSong(song);
      setSidebarOpen(true);
    };

  };


  return (
    <div className="brutal-outer">
      {/* Heavy Border Header */}
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
        {/* Navigation Section */}
        <aside className="brutal-sidebar">
          <nav>
            <div className="nav-btn active">01 / FEED</div>
            <div className="nav-btn">02 / SEARCH</div>
            <div className="nav-btn">03 / FAVORITES</div>
            <div className="nav-btn">04 / MY_PROFILE</div>
          </nav>
        </aside>

        {/* Main Interface */}
        <main className="brutal-main">
          <div className="brutal-search-block">
            <Search size={22} />
            <input
              type="text"
              placeholder="SEARCH CATALOG_..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="search-btn" onClick={handleSearch} disabled={loading}>
              {loading ? 'WAIT_...' : 'GO'} <ArrowRight size={16} />
            </button>


            <section className="brutal-hero">
              <h1>TRACK YOUR<br />LISTEN_LOGS.</h1>
              <p>A HIGH-UTILITY MUSIC ARCHIVE SYSTEM.</p>
            </section>

            <div className="brutal-grid">
              {songs.map((song) => (
                <div className="brutal-card" key={song.id} onClick={() => openReview(song)}>

                  <img
                    className="card-image-box"
                    src={song.cover_url.replace("100x100", "600x600")}
                    alt={song.title}
                  />




                  <div className="card-info">
                    <h4>{song.title.toUpperCase()}</h4>
                    <p>{song.artist.toUpperCase()}</p>
                    <div className="card-footer">
                      <span>ALBUM: {song.album_name?.toUpperCase() || '--'}</span>
                      <button className="icon-btn"><Heart size={18} /></button>
                    </div>
                  </div>
                </div>
              ))}
              <ReviewSidebar
                song={selectedSong}
                isOpen={isSidebarOpen}
                onClose={() => setSidebarOpen(false)}
              />

            </div>


            export default App;
