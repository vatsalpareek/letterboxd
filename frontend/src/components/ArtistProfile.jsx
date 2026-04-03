import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Disc as DiscIcon, Calendar as CalendarIcon, ArrowLeft as ArrowLeftIcon } from 'lucide-react';

const ArtistProfile = ({ openAlbum }) => {
    const { id } = useParams();
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('newest');
    const [activeTab, setActiveTab] = useState('albums');

    useEffect(() => {
        const fetchArtistData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`http://localhost:3000/api/songs/artist/${id}`);
                const data = res.data.albums || [];
                setAlbums(data);
                
                // Smart auto-tab selection
                const hasAlbums = data.some(a => (a.track_count || 0) > 1);
                if (!hasAlbums && data.some(a => (a.track_count || 0) <= 1)) {
                    setActiveTab('singles');
                }
            } catch (err) {
                console.error('Error fetching artist:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchArtistData();
    }, [id]);

    const sortedAlbums = [...(albums || [])].sort((a, b) => {
        const dateA = new Date(a.release_date || 0);
        const dateB = new Date(b.release_date || 0);
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    const albumList = (sortedAlbums || []).filter(a => (a.track_count || 0) > 1);
    const singlesList = (sortedAlbums || []).filter(a => (a.track_count || 0) <= 1);

    const upgradeImg = (url) => url?.replace(/\/\d+x\d+bb\.jpg$/, '/1000x1000bb.jpg') || '';

    if (loading) return <div className="brutal-loader">Tracing Discography...</div>;

    const renderGrid = (items) => (
        <div className="brutal-grid">
            {(items || []).map((album) => (
                <div className="brutal-card" key={album.id} onClick={() => openAlbum?.(album)}>
                    <div className="card-year-badge">
                        <CalendarIcon size={10} /> {album.release_date?.split('-')[0] || '----'}
                    </div>
                    <img src={upgradeImg(album.cover_url)} alt={album.title || 'ALBUM'} className="card-image-box" />
                    <div className="card-info">
                        <h4>{(album.title || 'Untitled').toUpperCase()}</h4>
                        <div className="card-footer">
                            <span className="track-count">{album.track_count || 0} TRACKS</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="artist-profile-view">
            <Link to="/search" className="back-link"><ArrowLeftIcon size={20} /> Back to Search</Link>
            
            <header className="artist-header-brutal">
                <div className="artist-icon-box">
                    <DiscIcon size={60} />
                </div>
                <div className="artist-info">
                    <p style={{ fontWeight: 800, opacity: 0.5, margin: 0 }}>ARTIST PROFILE</p>
                    <h1 style={{ fontSize: '72px', margin: '10px 0', lineHeight: 0.9 }}>
                        {(albums?.[0]?.artist || 'Artist').toUpperCase()}
                    </h1>
                    
                    <div className="header-meta-row">
                        <div className="sort-box">
                            <label className="brutal-label">SORT DISC BY</label>
                            <div className="brutal-tabs" style={{ marginBottom: 0 }}>
                                <button 
                                    className={`tab-trigger ${sortOrder === 'newest' ? 'active' : ''}`}
                                    onClick={() => setSortOrder('newest')}
                                >
                                    NEWEST
                                </button>
                                <button 
                                    className={`tab-trigger ${sortOrder === 'oldest' ? 'active' : ''}`}
                                    onClick={() => setSortOrder('oldest')}
                                >
                                    OLDEST
                                </button>
                            </div>
                        </div>
                        <div className="stats-box">
                            <label className="brutal-label">ARCHIVE STATS</label>
                            <div className="stats-pill-main">
                                {albums.length} RELEASES
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="brutal-tabs-container">
                <div className="brutal-tabs content-tabs">
                    <button 
                        className={`tab-trigger ${activeTab === 'albums' ? 'active' : ''}`}
                        onClick={() => setActiveTab('albums')}
                    >
                        ALBUMS ({albumList.length})
                    </button>
                    <button 
                        className={`tab-trigger ${activeTab === 'singles' ? 'active' : ''}`}
                        onClick={() => setActiveTab('singles')}
                    >
                        SINGLES & EPS ({singlesList.length})
                    </button>
                </div>

                <div className="tab-content" style={{ marginTop: '40px' }}>
                    {activeTab === 'albums' && (
                        albumList.length > 0 ? renderGrid(albumList) : <p className="empty-msg">No albums found.</p>
                    )}
                    {activeTab === 'singles' && (
                        singlesList.length > 0 ? renderGrid(singlesList) : <p className="empty-msg">No singles found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArtistProfile;
