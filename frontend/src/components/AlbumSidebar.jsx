import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { X as XIcon, Star as StarIcon, Save as SaveIcon, Music as MusicIcon, Calendar as CalendarIcon, Edit3 as EditIcon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AlbumSidebar = ({ album, isOpen, onClose, onOpenSongReview }) => {
    const { token, notify } = useContext(AuthContext);
    const navigate = useNavigate();
    const [tracks, setTracks] = useState([]);
    const [loadingTracks, setLoadingTracks] = useState(false);
    
    const [rating, setRating] = useState(5);
    const [body, setBody] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [existingReviewId, setExistingReviewId] = useState(null);

    // CHECK FOR EXISTING REVIEW WHEN ALBUM/DRAWER OPENS
    useEffect(() => {
        if (album && isOpen && token) {
            const checkReview = async () => {
                try {
                    const res = await axios.get(`http://localhost:3000/api/reviews/check/album/${album.id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.data.exists) {
                        setExistingReviewId(res.data.review.id);
                        setRating(res.data.review.rating);
                        setBody(res.data.review.body);
                    } else {
                        setExistingReviewId(null);
                        setRating(5);
                        setBody("");
                    }
                } catch (err) { console.error('Check review error:', err); }
            };
            checkReview();
        }
    }, [album?.id, isOpen, token]);

    useEffect(() => {
        if (isOpen && album) {
            const fetchTracks = async () => {
                setLoadingTracks(true);
                try {
                    const res = await axios.get(`http://localhost:3000/api/songs/album/${album.external_id || album.id}`);
                    setTracks(res.data.tracks || []);
                } catch (err) { console.error('Error fetching tracks:', err); }
                finally { setLoadingTracks(false); }
            }
            fetchTracks();
        }
    }, [isOpen, album]);

    const handleAlbumReview = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (existingReviewId) {
                // UPDATE EXISTING
                await axios.put(`http://localhost:3000/api/reviews/${existingReviewId}`, {
                    rating: rating,
                    body: body
                }, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                notify('Album Review Updated!');
            } else {
                // CREATE NEW
                await axios.post('http://localhost:3000/api/reviews', {
                    album_id: album.id,
                    rating: rating,
                    body: body
                }, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                notify('Album Review Logged!');
            }
            onClose();
        } catch (err) {
            notify(err.response?.data?.error || 'Failed to process album review', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const goToArtist = (e) => {
        if (e) e.stopPropagation();
        const aId = album.artist_id || album.artistId;
        if (aId) {
            onClose();
            navigate(`/artist/${aId}`);
        }
    };

    if (!isOpen || !album) return null;

    const isSingle = (album.track_count || album.trackCount) === 1;
    const upgradeImg = (url) => url?.replace(/\/\d+x\d+bb\.jpg$/, '/1000x1000bb.jpg') || '';
    const year = (album.release_date || album.year)?.split('-')[0] || '----';

    return (
        <div className={`review-sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={(e) => {
             if (e.target.className === 'review-sidebar-overlay open' && onClose) onClose();
        }}>
            <div className="brutal-review-panel">
                <header className="panel-header">
                    <h3>{existingReviewId ? 'Modify Record' : (isSingle ? 'Log SINGLE / EP' : 'Log ALBUM')}</h3>
                    <button onClick={onClose} className="close-btn"><XIcon size={32} /></button>
                </header>

                <div className="song-detail-sidebar">
                    <img 
                      src={upgradeImg(album.cover_url)} 
                      alt={album.title || 'ALBUM'} 
                      className="sidebar-art"
                    />
                    <div className="sidebar-meta">
                        <div className="sidebar-type-row">
                          <span className="type-badge-mini">{isSingle ? 'SINGLE' : 'ALBUM'}</span>
                          <span className="sidebar-year-badge"><CalendarIcon size={10}/> {year}</span>
                        </div>
                        <h2>{(album.title || 'Untitled').toUpperCase()}</h2>
                        <p className="clickable-text" onClick={goToArtist}>{(album.artist || 'Unknown Artist').toUpperCase()}</p>
                    </div>
                </div>

                <div className="sidebar-scroll-area">
                    {!isSingle && (
                        <div className="tracklist-section">
                            <h4>TRACKLIST</h4>
                            {loadingTracks ? <p>Loading tracks...</p> : (
                                <div className="track-list">
                                    {(tracks || []).map((track, idx) => (
                                        <div key={track.id || idx} className="track-item" onClick={() => onOpenSongReview?.(track)}>
                                            <span className="track-num">{idx + 1}</span>
                                            <span className="track-name">{track.title || 'Untitled'}</span>
                                            <MusicIcon size={12} className="track-icon" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <form onSubmit={handleAlbumReview} className="brutal-form-stack album-form">
                        <div className="input-group">
                            <label>Rate {isSingle ? 'Single' : 'Whole Album'}</label>
                            <div className="rating-selector">
                                {[1, 2, 3, 4, 5].map(num => (
                                    <button 
                                        key={num} 
                                        type="button" 
                                        className={rating === num ? 'active' : ''}
                                        onClick={() => setRating(num)}
                                    >
                                        {num} <StarIcon size={14} fill={rating >= num ? "var(--text-main)" : "none"} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Review</label>
                            <textarea 
                                placeholder={isSingle ? "What do you think of this single?" : "What did you think of the whole project?"}
                                rows="3"
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                            />
                        </div>

                        <button type="submit" disabled={submitting} className="log-btn" style={{marginTop: '20px'}}>
                            {submitting ? 'Archiving...' : (existingReviewId ? 'Update Record' : 'Record Entry')} 
                            {existingReviewId ? <EditIcon size={18} /> : <SaveIcon size={18} />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AlbumSidebar;
