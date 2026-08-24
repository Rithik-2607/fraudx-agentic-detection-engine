import { X } from 'lucide-react';

export default function Drawer({ title, children, onClose, width = 'max-w-lg' }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className={`relative w-full ${width} bg-surface-800 border-l border-surface-600/50 shadow-2xl overflow-y-auto animate-slide-in`}>
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-surface-600/50 bg-surface-800">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-surface-300 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
