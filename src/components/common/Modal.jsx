import { X } from 'lucide-react';

export default function Modal({ title, children, onClose, onConfirm, confirmLabel = 'Confirm Action', confirmColor = '#ef4444', size = 'md' }) {
  const widthClass = size === 'lg' ? 'max-w-2xl' : size === 'sm' ? 'max-w-sm' : 'max-w-lg';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className={`relative w-full ${widthClass} bg-surface-800 border border-surface-600/50 rounded-xl shadow-2xl animate-fade-in`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-600/50">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-surface-300 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {onConfirm && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-surface-600/50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-surface-200 bg-surface-700 rounded-lg hover:bg-surface-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
              style={{ backgroundColor: confirmColor }}
            >
              {confirmLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
