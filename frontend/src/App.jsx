import React, { useState } from 'react';
import { Search, Heart, Disc, User, ArrowRight } from 'lucide-react';
import './App.css';

function App() {
  const [search, setSearch] = useState("");

  return (
    <div className="brutal-outer">
      {/* Heavy Border Header */}
      <header className="brutal-header">
        <div className="logo">
          <Disc size={32} strokeWidth={3} />
          <span>MELODEX / REVIEWS</span>
        </div>
        <div className="header-actions">
          <div className="user-pill">LOGGED IN: VATSAL</div>
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
            <button className="search-btn">GO <ArrowRight size={16} /></button>
          </div>

          <section className="brutal-hero">
            <h1>TRACK YOUR<br/>LISTEN_LOGS.</h1>
            <p>A HIGH-UTILITY MUSIC ARCHIVE SYSTEM.</p>
          </section>

          <div className="brutal-grid">
            {/* Music Card Example */}
            <div className="brutal-card">
              <div className="card-image-box">NO_COVER</div>
              <div className="card-info">
                <h4>CHOOSE_A_SONG</h4>
                <p>SEARCH TO START LOGGING</p>
                <div className="card-footer">
                  <span>RANK: --</span>
                  <button className="icon-btn"><Heart size={18} /></button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
