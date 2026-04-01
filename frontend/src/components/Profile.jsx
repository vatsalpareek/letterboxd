import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { User, Disc, Star } from 'lucide-react';

const Profile = () => {
    const { user, token } = useContext(AuthContext);
    const [stats, setStats] = useState({ count: 0, avg: 0 });
    const [myReviews, setMyReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;
            try {
                // Fetch user-specific reviews
                const res = await axios.get(`http://localhost:3000/api/reviews/user/${user.id}`);
                const reviews = res.data.reviews || [];
                setMyReviews(reviews);

                const total = reviews.length;
                const avg = total > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1) : 0;
                setStats({ count: total, avg: avg });
            } catch (err) { console.error('Profile error:', err); }
            finally { setLoading(false); }
        };
        fetchUserData();
    }, [user, token]);

    if (loading) return <div className="brutal-loader">ANALYZING_STATS...</div>;

    return (
        <div className="profile-container">
            <header className="profile-header-brutal">
                <div className="user-icon-box"><User size={64} /></div>
                <div className="user-info-stack">
                    <h1>{user?.username?.toUpperCase()}</h1>
                    <div className="stats-row">
                        <div className="stat-pill">
                           <span className="label">LOGGED_COUNT:</span>
                           <span className="value">{stats.count}</span>
                        </div>
                        <div className="stat-pill">
                           <span className="label">AVG_RATING:</span>
                           <span className="value">{stats.avg} / 5</span>
                        </div>
                    </div>
                </div>
            </header>

            <section className="profile-history">
                <h2>YOUR_ARCHIVE.</h2>
                <div className="brutal-grid">
                    {myReviews.map((rev) => (
                        <div className="brutal-card" key={rev.id}>
                            <img src={rev.cover_url} alt={rev.title} className="card-image-box" />
                            <div className="card-info">
                                <div className="rating-pill">{'★'.repeat(rev.rating)}</div>
                                <h4>{rev.title.toUpperCase()}</h4>
                                <p className="artist">{rev.artist.toUpperCase()}</p>
                                <p className="review-body">"{rev.body}"</p>
                            </div>
                        </div>
                    ))}
                    {myReviews.length === 0 && <p>YOU_HAVE_NOT_LOGGED_ANYTHING_YET.</p>}
                </div>
            </section>
        </div>
    );
};

export default Profile;
