import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { List, Plus, Archive } from 'lucide-react';

const MyLists = () => {
    const { user, token } = useContext(AuthContext);
    const [lists, setLists] = useState([]);
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLists = async () => {
            if (!user) return;
            try {
                const res = await axios.get(`http://localhost:3000/api/lists/user/${user.id}`);
                setLists(res.data.lists || []);
            } catch (err) { console.error('List error:', err); }
            finally { setLoading(false); }
        };
        fetchLists();
    }, [user, token]);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3000/api/lists', {
                name,
                description: desc
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setLists([res.data.list, ...lists]);
            setName(""); setDesc("");
            alert('COLLECTION_CREATED');
        } catch (err) { console.error('Create list error:', err); }
    };

    if (loading) return <div className="brutal-loader">INDEXING_COLLECTIONS...</div>;

    return (
        <div className="lists-view">
             <header className="view-header">
                <h1>COLLECTIONS.</h1>
                <p>ORGANIZE YOUR SOUND ARCHIVES.</p>
             </header>

             <form className="brutal-list-form" onSubmit={handleCreate}>
                 <div className="form-title">00 / NEW_COLLECTION</div>
                 <input 
                    type="text" 
                    placeholder="COLLECTION_NAME..." 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                 />
                 <textarea 
                    placeholder="DESCRIPTION (OPTIONAL)..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                 />
                 <button type="submit">GENERATE_LIST <Plus size={18} /></button>
             </form>

             <div className="brutal-grid lists-grid">
                 {lists.map(list => (
                     <div className="brutal-card list-card" key={list.id}>
                         <div className="list-icon-box"><Archive size={48} /></div>
                         <div className="card-info">
                             <h3>{list.name.toUpperCase()}</h3>
                             <p>{list.description || 'NO_DESCRIPTION'}</p>
                             <div className="list-count-pill">ITEMS_LOGGED: 0</div>
                         </div>
                     </div>
                 ))}
                 {lists.length === 0 && <p className="empty-msg">START_BY_CREATING_YOUR_FIRST_COLLECTION.</p>}
             </div>
        </div>
    );
};

export default MyLists;
