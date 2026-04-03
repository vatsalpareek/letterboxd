import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search as SearchIcon, Disc as DiscIcon, User as UserIcon, ArrowRight as ArrowRightIcon, Moon, Sun } from 'lucide-react';
import { AuthContext } from './context/AuthContext';
import { ThemeContext } from './context/ThemeContext';
import Login from './components/Login';
import Profile from './components/Profile';
import MyLists from './components/MyLists';
import ListDetail from './components/ListDetail';
import ArtistProfile from './components/ArtistProfile';
import ReviewSidebar from './components/ReviewSidebar';
import AlbumSidebar from './components/AlbumSidebar';
import Signup from './components/Signup';
import NotificationToast from './components/NotificationToast';
import './App.css';

// GLOBAL SESSION INTERCEPTOR
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.clear();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

const upgradeImg = (url) => url?.replace(/\/\d+x\d+bb\.jpg$/, '/1000x1000bb.jpg') || '';

const Dashboard = ({ openReview, openAlbum }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  if (loading) return (
    <div className="feed-container">
      <h1>All Entries</h1>
      <div className="brutal-grid">
        {[1,2,3,4,5,6].map(i => (
          <div className="skeleton-card" key={i}>
            <div className="skeleton-img"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line short"></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="feed-container">
      <h1>All Entries</h1>
      <p className="feed-sub">Real-time global musical catalog.</p>
      <div className="brutal-grid">
        {(reviews || []).map((rev) => (
          <div className="brutal-card" key={`rev_${rev.id}`} onClick={() => {
            if (rev.item_type === 'song') openReview({ ...rev, id: rev.song_id });
            else openAlbum({ ...rev, id: rev.album_id, external_id: rev.external_id });
          }}>
            <img src={upgradeImg(rev.cover_url)} alt={rev.title} className="card-image-box" />
            <div className="card-info">
              <span className="type-badge-mini">{(rev.item_type || 'Unknown').toUpperCase()}</span>
              <div className="rating-pill">{'★'.repeat(rev.rating || 0)}</div>
              <h4>{(rev.title || 'Untitled').toUpperCase()}</h4>
              <p className="artist-label">{(rev.artist || 'Unknown').toUpperCase()}</p>
              <p className="review-body">"{rev.body || ""}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SearchPage = ({ openReview, openAlbum }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    if (!isTyping) return;
    const timer = setTimeout(async () => {
      if (searchQuery.length > 3) {
        try {
          const res = await axios.get(`http://localhost:3000/api/songs/search?q=${encodeURIComponent(searchQuery)}`);
          setSuggestions((res.data.results || []).slice(0, 5));
        } catch (err) { console.error('Suggest error:', err); }
      } else { setSuggestions([]); }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, isTyping]);

  const handleSearch = async (val) => {
    const q = val || searchQuery;
    if (!q) return;
    setLoading(true);
    setIsTyping(false); // Stop suggestions
    setSuggestions([]); // Clear existing
    try {
      const res = await axios.get(`http://localhost:3000/api/songs/search?q=${encodeURIComponent(q)}`);
      setResults(res.data.results || []);
    } catch (err) { console.error('Search error:', err); }
    finally { setLoading(false); }
  };

  const filtered = filterType === 'all' ? results : results.filter(i => i.type === filterType);

  return (
    <div className="search-container">
      <div className="brutal-search-block">
        <SearchIcon size={22} />
        <input
          type="text" placeholder="Search for music, artists, or albums..."
          value={searchQuery} 
          onChange={(e) => { setSearchQuery(e.target.value); setIsTyping(true); }}
          onFocus={() => { if (searchQuery.length > 3) setIsTyping(true); }}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          onBlur={() => setTimeout(() => { setIsTyping(false); setSuggestions([]); }, 200)}
        />
        <button className="search-btn" onClick={() => handleSearch()}>{loading ? 'WAIT' : 'GO'}</button>

        {suggestions.length > 0 && (
          <div className="search-suggestions">
            {suggestions.map(s => (
              <div className="suggestion-item" key={`s_${s.id}`} onClick={() => { setSearchQuery(s.title); handleSearch(s.title); }}>
                <img src={s.cover_url} alt="t" />
                <div>
                  <div style={{ fontWeight: 900 }}>{(s.title || 'Untitled').toUpperCase()}</div>
                  <div style={{ fontSize: '10px', opacity: 0.5 }}>{(s.artist || 'Unknown').toUpperCase()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="brutal-tabs">
          {['all', 'artist', 'album', 'song'].map(t => (
            <button key={t} className={`tab-trigger ${filterType === t ? 'active' : ''}`} onClick={() => setFilterType(t)}>
              {t.toUpperCase()} ({t === 'all' ? results.length : results.filter(r => r.type === t).length})
            </button>
          ))}
        </div>
      )}

      <div className="brutal-grid">
        {loading ? [1,2,3,4,5,6].map(i => (
          <div className="skeleton-card" key={i}>
            <div className="skeleton-img"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line short"></div>
          </div>
        )) : filtered.map((item) => (
          <div className="brutal-card" key={`g_${item.type}_${item.id}`} onClick={() => {
            if (item.type === 'song') openReview(item);
            else if (item.type === 'album') openAlbum(item);
            else if (item.type === 'artist') navigate(`/artist/${item.id}`);
          }}>
            <img className="card-image-box" src={upgradeImg(item.cover_url)} alt={item.title} />
            <div className="card-info">
              <span className="type-badge-mini">{(item.type || 'item').toUpperCase()}</span>
              <h4>{(item.title || 'Untitled').toUpperCase()}</h4>
              <p className="artist-label">{(item.artist || 'Unknown').toUpperCase()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  const { token, user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [selectedSong, setSelectedSong] = useState(null);
  const [isSongOpen, setIsSongOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [isAlbumOpen, setIsAlbumOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'

  if (!token) {
    return authMode === 'login' 
        ? <Login onSwitch={() => setAuthMode('signup')} /> 
        : <Signup onBackToLogin={() => setAuthMode('login')} />;
  }

  const openReview = (s) => { setSelectedSong(s); setIsSongOpen(true); };
  const openAlbum = (a) => { setSelectedAlbum(a); setIsAlbumOpen(true); };

  return (
    <Router>
      <div className="brutal-outer">
        <header className="brutal-header">
          <Link to="/" className="logo">
            <DiscIcon size={32} />
            <span>MELODEX / REVIEWS</span>
          </Link>
          <div className="header-actions">
            <button className="icon-btn" onClick={toggleTheme}>
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <div className="user-pill">{user?.username?.toUpperCase()}</div>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>
        </header>

        <div className="brutal-container">
          <aside className="brutal-sidebar">
            <nav>
              <NavLink to="/" className={({ isActive }) => isActive ? 'nav-btn active' : 'nav-btn'}>Feed</NavLink>
              <NavLink to="/search" className={({ isActive }) => isActive ? 'nav-btn active' : 'nav-btn'}>Search</NavLink>
              <NavLink to="/lists" className={({ isActive }) => isActive ? 'nav-btn active' : 'nav-btn'}>My Lists</NavLink>
              <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-btn active' : 'nav-btn'}>Profile</NavLink>
            </nav>
          </aside>

          <main className="brutal-main">
            <Routes>
              <Route path="/" element={<Dashboard openReview={openReview} openAlbum={openAlbum} />} />
              <Route path="/search" element={<SearchPage openReview={openReview} openAlbum={openAlbum} />} />
              <Route path="/lists" element={<MyLists />} />
              <Route path="/lists/:id" element={<ListDetail />} />
              <Route path="/artist/:id" element={<ArtistProfile openReview={openReview} openAlbum={openAlbum} />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>

        <ReviewSidebar song={selectedSong} isOpen={isSongOpen} onClose={() => setIsSongOpen(false)} openAlbum={openAlbum} />
        <AlbumSidebar album={selectedAlbum} isOpen={isAlbumOpen} onClose={() => setIsAlbumOpen(false)} onOpenSongReview={(s) => { setIsAlbumOpen(false); openReview(s); }} />
        <NotificationToast />
      </div>
    </Router>
  );
}

export default App;
