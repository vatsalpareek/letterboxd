import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

const NotificationToast = () => {
    const { notifications } = useContext(AuthContext);

    if (!notifications || notifications.length === 0) return null;

    return (
        <div className="brutal-notifications-container">
            {notifications.map(n => (
                <div key={n.id} className={`brutal-toast ${n.type || 'success'}`}>
                    <div className="toast-icon">
                        {n.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                    </div>
                    <div className="toast-content">
                        {n.msg?.toUpperCase()}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NotificationToast;
