import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { X, Star, Save, Library } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const ReviewSidebar = ({ song, isOpen, onClose }) => {
    const { token, user } = useContext(AuthContext);
    const [rating, setRating] = useState(5);
    const [body, setBody] = useState("");
    const [myLists, setMyLists] = useState([]);
    const [selectedListId, setSelectedListId] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch lists when sidebar opens
    useEffect(() => {
        if (isOpen && user) {
            const fetchLists = async () => {
                try {
                    const res = await axios.get(`http://localhost:3000/api/lists/user/${user.id}`);
                    setMyLists(res.data.lists || []);
                } catch (err) { console.error('Error fetching lists:', err); }
            };
            fetchLists();
        }
    }, [isOpen, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Submit the Review
            await axios.post('http://localhost:3000/api/reviews', {
                song_id: song.id,
                rating: rating,
                body: body
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // 2. If a list is selected, add song to that list
            if (selectedListId) {
                await axios.post(`http://localhost:3000/api/lists/${selectedListId}/songs`, {
                    song_id: song.id
                }, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }

            alert('Entry Logged Successfully');
            onClose();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to log entry');
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
                    <h3>04 / Log Entry</h3>
                    <button onClick={onClose} className="close-btn" title="Close"><X size={32} /></button>
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
                        <label>Rating (1-5)</label>
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
                        <label>Add to Collection</label>
                        <select 
                            className="brutal-select"
                            value={selectedListId}
                            onChange={(e) => setSelectedListId(e.target.value)}
                        >
                            <option value="">None</option>
                            {myLists.map(list => (
                                <option key={list.id} value={list.id}>{list.name.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label>Your Thoughts</label>
                        <textarea 
                            placeholder="Type review here..." 
                            rows="4"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                        />
                    </div>

                    <button type="submit" disabled={loading} className="log-btn">
                        {loading ? 'Archiving...' : 'Confirm Entry'} <Save size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReviewSidebar;
