import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ShieldAlert, ArrowLeftRight, Network, FileSearch } from 'lucide-react';
import { searchAll } from '../../services/api';
import RiskBadge from './RiskBadge';
import { formatCurrency } from '../../utils/formatters';

export default function SearchModal({ onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ accounts: [], transactions: [], investigations: [], fraudRings: [] });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!query) {
      setResults({ accounts: [], transactions: [], investigations: [], fraudRings: [] });
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const searchResults = await searchAll(query);
        setResults(searchResults);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  const hasResults =
    results.accounts.length > 0 ||
    results.transactions.length > 0 ||
    results.investigations.length > 0 ||
    results.fraudRings.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-surface-800 border border-surface-600/60 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh] animate-fade-in">
        {/* Search input bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-surface-600/50 bg-surface-800">
          <Search className="w-5 h-5 text-surface-300 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search account, transaction, fraud ring, or investigation ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-white border-0 p-0 focus:outline-none focus:ring-0 placeholder-surface-300 text-base"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-surface-300 hover:text-white mr-2">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded bg-surface-700 text-surface-200 border border-surface-600">ESC</kbd>
        </div>

        {/* Search Results Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-sm text-surface-200">Querying intelligence database...</span>
            </div>
          )}

          {!loading && !query && (
            <div className="text-center py-12 text-surface-200 text-sm">
              Type to search transaction systems. Try searching "U1042", "TX-82", "INV-10", or "RING".
            </div>
          )}

          {!loading && query && !hasResults && (
            <div className="text-center py-12 text-surface-200 text-sm">
              No matching records found for "{query}".
            </div>
          )}

          {!loading && query && hasResults && (
            <div className="space-y-4">
              {/* Accounts */}
              {results.accounts.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-surface-200 uppercase tracking-wider mb-2 px-2">Accounts</h4>
                  <div className="space-y-1">
                    {results.accounts.map((acc) => (
                      <button
                        key={acc.id}
                        onClick={() => handleNavigate(`/transactions?search=${acc.id}`)}
                        className="w-full text-left flex items-center justify-between p-2 rounded-lg hover:bg-surface-700/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-surface-700 flex items-center justify-center text-accent-cyan text-xs font-mono font-bold">
                            U
                          </div>
                          <div>
                            <span className="font-mono text-sm text-white font-semibold">{acc.id}</span>
                            {acc.fraudRing && (
                              <span className="ml-2 text-xs text-accent-red font-medium">Part of {acc.fraudRing}</span>
                            )}
                          </div>
                        </div>
                        <RiskBadge score={acc.riskScore} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Transactions */}
              {results.transactions.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-surface-200 uppercase tracking-wider mb-2 px-2">Transactions</h4>
                  <div className="space-y-1">
                    {results.transactions.map((tx) => (
                      <button
                        key={tx.id}
                        onClick={() => handleNavigate(`/transactions?selected=${tx.id}`)}
                        className="w-full text-left flex items-center justify-between p-2 rounded-lg hover:bg-surface-700/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-surface-700 flex items-center justify-center text-accent-blue">
                            <ArrowLeftRight className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-mono text-sm text-white font-semibold">{tx.id}</span>
                            <span className="text-xs text-surface-200 ml-2 font-mono">U{tx.sender.replace(/[^0-9]/g, '')} → U{tx.receiver.replace(/[^0-9]/g, '')}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-white">{formatCurrency(tx.amount)}</span>
                          <RiskBadge score={tx.riskScore} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Fraud Rings */}
              {results.fraudRings.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-surface-200 uppercase tracking-wider mb-2 px-2">Fraud Rings</h4>
                  <div className="space-y-1">
                    {results.fraudRings.map((ring) => (
                      <button
                        key={ring.id}
                        onClick={() => handleNavigate(`/fraud-rings/${ring.id}`)}
                        className="w-full text-left flex items-center justify-between p-2 rounded-lg hover:bg-surface-700/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-surface-700 flex items-center justify-center text-accent-red">
                            <Network className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-mono text-sm text-white font-semibold">{ring.id}</span>
                            <span className="text-xs text-surface-200 ml-2">{ring.pattern} • {ring.accountCount} Accounts</span>
                          </div>
                        </div>
                        <RiskBadge score={ring.riskScore} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Investigations */}
              {results.investigations.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-surface-200 uppercase tracking-wider mb-2 px-2">Investigations</h4>
                  <div className="space-y-1">
                    {results.investigations.map((inv) => (
                      <button
                        key={inv.id}
                        onClick={() => handleNavigate(`/investigations/${inv.id}`)}
                        className="w-full text-left flex items-center justify-between p-2 rounded-lg hover:bg-surface-700/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-surface-700 flex items-center justify-center text-accent-yellow">
                            <FileSearch className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-mono text-sm text-white font-semibold">{inv.id}</span>
                            <span className="text-xs text-surface-200 ml-2">Target Account: {inv.targetAccount} • Priority: {inv.priority}</span>
                          </div>
                        </div>
                        <RiskBadge score={inv.riskScore} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
