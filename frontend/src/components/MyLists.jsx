import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Archive, Plus, Trash2 } from 'lucide-react';

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
            alert('New collection successfully created');
        } catch (err) { console.error('Create list error:', err); }
    };

    if (loading) return <div className="brutal-loader">Indexing collections...</div>;

    return (
        <div className="lists-view">
             <header className="view-header">
                <h1>Collections</h1>
                <p>Organize your sound archives.</p>
             </header>

             <form className="brutal-list-form" onSubmit={handleCreate}>
                 <div className="form-title">Create New Archive</div>
                 <div className="form-row">
                    <input 
                        type="text" 
                        placeholder="Name (e.g. Midnight Jazz)..." 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <button type="submit" className="create-list-btn">
                        Create <Plus size={18} />
                    </button>
                 </div>
                 <textarea 
                    placeholder="Description (Optional)..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                 />
             </form>

             <div className="brutal-grid lists-grid">
                 {lists.map(list => (
                     <div className="brutal-card list-card" key={list.id}>
                         <div className="list-icon-box">
                             <Archive size={48} strokeWidth={2.5} />
                             <div className="items-count-badge">0 Items</div>
                         </div>
                         <div className="card-info">
                             <h3>{list.name.toUpperCase()}</h3>
                             <p>{list.description || 'No description provided'}</p>
                             <div className="list-footer">
                                <button className="icon-btn-danger"><Trash2 size={16} /></button>
                             </div>
                         </div>
                     </div>
                 ))}
                 {lists.length === 0 && (
                    <div className="empty-state-card">
                        No collections found. Create one above.
                    </div>
                 )}
             </div>
        </div>
    );
};

export default MyLists;
