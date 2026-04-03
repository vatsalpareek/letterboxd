import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { User } from 'lucide-react';

const Profile = () => {
    const { user: authUser, token } = useContext(AuthContext);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    const upgradeImg = (url) => url?.replace(/\/\d+x\d+bb\.jpg$/, '/1000x1000bb.jpg') || '';

    useEffect(() => {
        const fetchMe = async () => {
            if (!token) return;
            try {
                const res = await axios.get('http://localhost:3000/api/users/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setProfileData(res.data);
            } catch (err) { 
                console.error('Profile fetch error:', err);
                if (err.response?.status === 401) {
                    // Token likely invalid
                }
            } finally { setLoading(false); }
        };
        fetchMe();
    }, [token]);

    if (loading) return <div className="brutal-loader">Analyzing stats...</div>;
    if (!profileData) return <div className="brutal-loader">Not Authorized. Please Login.</div>;

    const { user, reviews } = profileData;

    return (
        <div className="profile-wrapper">
            <header className="profile-header-brutal">
                <div className="user-icon-box"><User size={64} /></div>
                <div className="user-info-stack">
                    <p className="label-dim">MEMBER FILE</p>
                    <h1 className="user-title">{(user?.username || authUser?.username || 'GUEST').toUpperCase()}</h1>
                    <div className="stats-row">
                        <div className="stat-pill">
                           <span className="label">REVIEWS:</span>
                           <span className="value">{user?.review_count || 0}</span>
                        </div>
                        <div className="stat-pill">
                           <span className="label">ARCHIVES:</span>
                           <span className="value">{user?.list_count || 0}</span>
                        </div>
                        <div className="stat-pill">
                           <span className="label">LEVEL:</span>
                           <span className="value">MASTER</span>
                        </div>
                    </div>
                </div>
            </header>

            <section className="profile-history-section">
                <div className="section-title-box">
                    <h2>ENTRY HISTORY</h2>
                </div>
                <div className="brutal-grid">
                    {(reviews || []).map((rev) => (
                        <div className="brutal-card profile-card" key={rev.id}>
                            <img src={upgradeImg(rev.cover_url)} alt={rev.title} className="card-image-box" />
                            <div className="card-info">
                                <span className="type-badge-mini">{(rev.item_type || 'song').toUpperCase()}</span>
                                <div className="rating-pill">{'★'.repeat(Math.round(rev.rating) || 0)}</div>
                                <h4>{(rev.title || 'Untitled').toUpperCase()}</h4>
                                <p className="artist-label">{(rev.artist || 'Unknown').toUpperCase()}</p>
                                <p className="review-snippet">"{rev.body}"</p>
                            </div>
                        </div>
                    ))}
                    {(reviews || []).length === 0 && (
                        <div className="empty-state-card" style={{ gridColumn: '1 / -1' }}>
                            Archive is empty. Start your first audit.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Profile;
