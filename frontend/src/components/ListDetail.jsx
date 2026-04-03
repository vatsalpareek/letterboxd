import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, Trash2, Music } from 'lucide-react';

const ListDetail = () => {
    const { id } = useParams();
    const { token } = useContext(AuthContext);
    const [listData, setListData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchList = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/lists/${id}`);
                setListData(res.data.list);
            } catch (err) { console.error('Error fetching list:', err); }
            finally { setLoading(false); }
        };
        fetchList();
    }, [id]);

    const upgradeImg = (url) => url?.replace(/\/\d+x\d+bb\.jpg$/, '/1000x1000bb.jpg') || '';

    if (loading) return <div className="brutal-loader">Opening Archive...</div>;
    if (!listData) return <div className="brutal-loader">Archive Not Found.</div>;

    return (
        <div className="list-detail-view">
            <Link to="/lists" className="back-link">
                <ArrowLeft size={16} /> BACK TO COLLECTIONS
            </Link>

            <header className="list-detail-header">
                <h1>{listData.title?.toUpperCase() || 'UNTITLED COLLECTION'}</h1>
                <p className="list-meta">{listData.description || 'No description provided.'}</p>
            </header>

            <div className="brutal-grid">
                {listData.songs && listData.songs.length > 0 ? (
                    listData.songs.map((song) => (
                        <div className="brutal-card" key={song.id}>
                            <img src={upgradeImg(song.cover_url)} alt={song.title} className="card-image-box" />
                            <div className="card-info">
                                <h4>{song.title.toUpperCase()}</h4>
                                <p>{song.artist.toUpperCase()}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state-card">
                        This collection is currently empty.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListDetail;
