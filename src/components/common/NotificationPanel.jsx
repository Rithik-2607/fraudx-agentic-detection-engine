import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, X, ShieldAlert, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { getNotifications } from '../../services/api';
import { formatRelativeTime } from '../../utils/formatters';

export default function NotificationPanel({ onClose }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const panelRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const data = await getNotifications();
        setItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();

    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleMarkAllRead = () => {
    setItems(items.map(item => ({ ...item, read: true })));
  };

  const handleItemClick = (item) => {
    setItems(items.map(i => i.id === item.id ? { ...i, read: true } : i));
    navigate(item.link);
    onClose();
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <ShieldAlert className="w-4.5 h-4.5 text-accent-red" />;
      case 'warning':
        return <AlertTriangle className="w-4.5 h-4.5 text-accent-yellow" />;
      default:
        return <Info className="w-4.5 h-4.5 text-accent-blue" />;
    }
  };

  const unreadCount = items.filter(i => !i.read).length;

  return (
    <div
      ref={panelRef}
      className="fixed right-4 top-16 z-50 w-full max-w-sm bg-surface-800 border border-surface-600/60 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[500px] animate-fade-in"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-600/50 bg-surface-800">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-accent-cyan" />
          <h4 className="text-sm font-semibold text-white">Notifications</h4>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-accent-red text-white">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-accent-cyan hover:underline transition-all"
            >
              Mark all read
            </button>
          )}
          <button onClick={onClose} className="text-surface-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-surface-700/50">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="w-5 h-5 border-2 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-sm text-surface-200">
            No notification history.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`p-4 flex gap-3 cursor-pointer hover:bg-surface-700/30 transition-colors relative ${
                !item.read ? 'bg-surface-700/10' : ''
              }`}
            >
              {!item.read && (
                <span className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-accent-blue" />
              )}
              <div className="flex-shrink-0 mt-0.5">
                {getSeverityIcon(item.severity)}
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <p className="text-xs font-semibold text-white truncate">{item.title}</p>
                <p className="text-xs text-surface-200 mt-0.5 break-words">{item.description}</p>
                <p className="text-[10px] text-surface-300 mt-1">{formatRelativeTime(item.time)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
