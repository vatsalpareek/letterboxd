import React, { useState, useContext } from 'react';
import axios from 'axios';
import { X, Star, Save } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const ReviewSidebar = ({ song, isOpen, onClose }) => {
    const { token } = useContext(AuthContext);
    const [rating, setRating] = useState(5);
    const [body, setBody] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:3000/api/reviews', {
                song_id: song.id,
                rating: rating,
                body: body
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('REVIEW LOGGED SUCCESSFULLY');
            onClose();
        } catch (err) {
            alert(err.response?.data?.error || 'FAILED TO LOG REVIEW');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`review-sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={(e) => {
             if (e.target.className === 'review-sidebar-overlay open') onClose();
        }}>
            <div className="brutal-review-panel">
                <header className="panel-header">
                    <h3>04 / LOG REVIEW</h3>
                    <button onClick={onClose} className="close-btn" title="CLOSE"><X size={32} /></button>
                </header>

                {song && (
                    <div className="song-detail">
                        <img 
                            src={song.cover_url.replace(/\/\d+x\d+bb\.jpg$/, '/400x400bb.jpg')} 
                            alt={song.title} 
                        />
                        <div className="song-meta-box">
                            <h2>{song.title.toUpperCase()}</h2>
                            <p>{song.artist.toUpperCase()}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="brutal-form-stack">
                    <div className="input-group">
                        <label>RATING (1-5)</label>
                        <div className="rating-selector">
                            {[1, 2, 3, 4, 5].map(num => (
                                <button 
                                    key={num} 
                                    type="button" 
                                    className={rating === num ? 'active' : ''}
                                    onClick={() => setRating(num)}
                                >
                                    {num} <Star size={14} fill={rating >= num ? "black" : "none"} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="input-group">
                        <label>YOUR THOUGHTS</label>
                        <textarea 
                            placeholder="TYPE REVIEW HERE..." 
                            rows="6"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                        />
                    </div>

                    <button type="submit" disabled={loading} className="log-btn">
                        {loading ? 'ARCHIVING...' : 'LOG SEARCH ENTRY'} <Save size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReviewSidebar;
