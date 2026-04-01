import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Heart, Disc, User, ArrowRight, LayoutGrid, List } from 'lucide-react';
import { AuthContext } from './context/AuthContext';
import Login from './components/Login';
import ReviewSidebar from './components/ReviewSidebar';
import './App.css';

// --- DASHBOARD COMPONENT (The Live Feed) ---
const Dashboard = ({ openReview }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/reviews');
        setReviews(res.data.reviews || []);
      } catch (err) { console.error('Feed error:', err); }
      finally { setLoading(false); }
    };
    fetchRecent();
  }, []);

  if (loading) return <div className="brutal-loader">FETCHING_HISTORY...</div>;

  return (
    <div className="feed-container">
      <h1>YOUR_LISTEN_LOGS.</h1>
      <div className="brutal-grid">
        {reviews.length === 0 && <p className="empty-msg">NO_REVIEWS_LOGGED_YET.</p>}
        {reviews.map((rev) => (
          <div className="brutal-card review-card" key={rev.id}>
             <img src={rev.cover_url} alt={rev.title} className="card-image-box" />
             <div className="card-info">
               <div className="rating-pill">{'★'.repeat(rev.rating)}</div>
               <h4>{rev.title.toUpperCase()}</h4>
               <p className="artist">{rev.artist.toUpperCase()}</p>
               <p className="review-body">"{rev.body}"</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- SEARCH ENGINE COMPONENT ---
const SearchPage = ({ openReview }) => {
  const [search, setSearch] = useState("");
  const [songs, setSongs] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);

  useEffect(() => {
    if (!isUserTyping || loading) return; 
    const timer = setTimeout(async () => {
      if (search.length > 2) {
        try {
          const res = await axios.get(`http://localhost:3000/api/songs/search?q=${encodeURIComponent(search)}`);
          setSuggestions(res.data.songs.slice(0, 5));
          setShowSuggestions(true);
        } catch (err) { console.error('Suggest error:', err); }
      } else { setSuggestions([]); setShowSuggestions(false); }
    }, 300);
    return () => clearTimeout(timer);
  }, [search, loading, isUserTyping]);

  const handleSearch = async (optionalQuery) => {
    const query = optionalQuery || search;
    if (!query) return;
    setIsUserTyping(false); setShowSuggestions(false); setSuggestions([]);
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/api/songs/search?q=${encodeURIComponent(query)}`);
      setSongs(res.data.songs);
    } catch (err) { console.error('Search error:', err); } 
    finally { setLoading(false); }
  };

  const selectSuggestion = (song) => {
    setIsUserTyping(false); setShowSuggestions(false); setSuggestions([]);
    setSearch(song.title); handleSearch(song.title);
  };

  const upgradeImg = (url) => url?.replace(/\/\d+x\d+bb\.jpg$/, '/1000x1000bb.jpg') || '';

  return (
    <div className="search-container">
      <div className="brutal-search-block">
        <Search size={22} />
        <input 
          type="text" 
          placeholder="SEARCH CATALOG MUSIC..." 
          value={search}
          onChange={(e) => { setSearch(e.target.value); setIsUserTyping(true); }}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()} 
          onFocus={() => search.length > 2 && !loading && setIsUserTyping(true)}
          onBlur={() => setTimeout(() => setIsUserTyping(false), 200)}
        />
        <button className="search-btn" onClick={() => handleSearch()} disabled={loading}>
          {loading ? 'WAIT...' : 'GO'} <ArrowRight size={16} />
        </button>

        {isUserTyping && showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions">
                {suggestions.map((song) => (
                    <div className="suggestion-item" key={song.id} onClick={() => selectSuggestion(song)}>
                        <img src={song.cover_url} alt="thumb" />
                        <div>
                            <div style={{ fontWeight: 800 }}>{song.title.toUpperCase()}</div>
                            <div style={{ fontSize: '12px', opacity: 0.6 }}>{song.artist}</div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      <div className="brutal-grid">
        {songs.map((song) => (
          <div className="brutal-card" key={song.id} onClick={() => openReview(song)}>
            <img className="card-image-box" src={upgradeImg(song.cover_url)} alt={song.title} />
            <div className="card-info">
              <h4>{song.title.toUpperCase()}</h4>
              <p>{song.artist.toUpperCase()}</p>
              <div className="card-footer">
                <span>ALBUM: {song.album_name?.split(' ').slice(0, 2).join(' ').toUpperCase()}...</span>
                <button className="icon-btn" onClick={(e) => { e.stopPropagation(); }}><Heart size={18} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MAIN APP WRAPPER WITH ROUTER ---
function App() {
  const { token, user, logout } = useContext(AuthContext);
  const [selectedSong, setSelectedSong] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  if (!token) return <Login />;

  const openReview = (song) => {
    setSelectedSong(song);
    setSidebarOpen(true);
  };

  return (
    <Router>
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
               <NavLink to="/" className={({ isActive }) => isActive ? 'nav-btn active' : 'nav-btn'}>01 / FEED</NavLink>
               <NavLink to="/search" className={({ isActive }) => isActive ? 'nav-btn active' : 'nav-btn'}>02 / SEARCH</NavLink>
               <NavLink to="/lists" className={({ isActive }) => isActive ? 'nav-btn active' : 'nav-btn'}>03 / MY LISTS</NavLink>
               <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-btn active' : 'nav-btn'}>04 / MY PROFILE</NavLink>
             </nav>
           </aside>

           <main className="brutal-main">
             <Routes>
               <Route path="/" element={<Dashboard openReview={openReview} />} />
               <Route path="/search" element={<SearchPage openReview={openReview} />} />
               <Route path="/lists" element={<div className="placeholder-view">UNDER_CONSTRUCTION: MY_LISTS</div>} />
               <Route path="/profile" element={<div className="placeholder-view">UNDER_CONSTRUCTION: MY_PROFILE</div>} />
               <Route path="*" element={<Navigate to="/" />} />
             </Routes>
           </main>
        </div>

        <ReviewSidebar 
          song={selectedSong} 
          isOpen={isSidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
      </div>
    </Router>
  );
}

export default App;
