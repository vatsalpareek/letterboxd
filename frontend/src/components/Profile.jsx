import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { User, Calendar, Award } from 'lucide-react';

const Profile = () => {
    const { user, token } = useContext(AuthContext);
    const [stats, setStats] = useState({ count: 0, lists: 0 });
    const [myReviews, setMyReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;
            try {
                // Fetch reviews count
                const revRes = await axios.get(`http://localhost:3000/api/reviews/user/${user.id}`);
                const reviews = revRes.data.reviews || [];
                setMyReviews(reviews);

                // Fetch lists count
                const listRes = await axios.get(`http://localhost:3000/api/lists/user/${user.id}`);
                const lists = listRes.data.lists || [];

                setStats({ count: reviews.length, lists: lists.length });
            } catch (err) { console.error('Profile error:', err); }
            finally { setLoading(false); }
        };
        fetchUserData();
    }, [user, token]);

    if (loading) return <div className="brutal-loader">Analyzing stats...</div>;

    return (
        <div className="profile-container">
            <header className="profile-header-brutal">
                <div className="user-icon-box"><User size={64} /></div>
                <div className="user-info-stack">
                    <h1>{user?.username?.toUpperCase()}</h1>
                    <div className="stats-row">
                        <div className="stat-pill">
                           <span className="label">Total Reviews:</span>
                           <span className="value">{stats.count}</span>
                        </div>
                        <div className="stat-pill">
                           <span className="label">Collections:</span>
                           <span className="value">{stats.lists}</span>
                        </div>
                        <div className="stat-pill">
                           <span className="label">Membership:</span>
                           <span className="value">PRO</span>
                        </div>
                    </div>
                </div>
            </header>

            <section className="profile-history">
                <h2>Your Entry History</h2>
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
                    {myReviews.length === 0 && <p className="empty-msg">You haven't logged anything yet.</p>}
                </div>
            </section>
        </div>
    );
};

export default Profile;
