import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { BarChart3, Calendar, ShieldAlert, Award, RefreshCw, Filter } from 'lucide-react';

import PageHeader from '../components/common/PageHeader';
import { getAnalyticsData } from '../services/api';
import { formatCurrency, formatNumber } from '../utils/formatters';

export default function Analytics() {
  const [period, setPeriod] = useState('7d');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await getAnalyticsData(period);
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [period]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-3 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Security Analytics & Trends"
        subtitle="Historical fraud activity and prevented loss analysis metrics"
      />

      {/* Period Filter bar */}
      <div className="bg-surface-800 border border-surface-600/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-surface-200">
          <Filter className="w-4 h-4 text-surface-300" />
          <span className="text-xs font-semibold">Analytics View Range</span>
        </div>

        <div className="flex items-center gap-1.5 bg-surface-700/60 p-0.5 rounded-lg border border-surface-600/50">
          {['24h', '7d', '30d', '90d'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                period === p
                  ? 'bg-accent-blue text-white shadow'
                  : 'text-surface-200 hover:text-white'
              }`}
            >
              {p === '24h' ? 'Today' : p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Trends & prevented Loss */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Detection Trend */}
        <div className="lg:col-span-8 bg-surface-800 border border-surface-600/50 rounded-xl p-5 h-[340px] flex flex-col">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Fraud Detection Trend</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.detectionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252d4a" vertical={false} />
                <XAxis dataKey="time" stroke="#4a5478" fontSize={10} tickLine={false} />
                <YAxis stroke="#4a5478" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f1424', borderColor: '#323b5a', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="detected" name="Detected" stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#22c55e" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Prevented Loss Area chart */}
        <div className="lg:col-span-4 bg-surface-800 border border-surface-600/50 rounded-xl p-5 h-[340px] flex flex-col">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Cumulative Prevented Loss</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.preventedLoss}>
                <defs>
                  <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#4a5478" fontSize={10} tickLine={false} />
                <YAxis
                  stroke="#4a5478"
                  fontSize={10}
                  tickLine={false}
                  tickFormatter={(val) => `₹${(val / 1000000).toFixed(0)}M`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f1424', borderColor: '#323b5a', borderRadius: '8px' }}
                  formatter={(value) => [`₹${formatNumber(value)}`, 'Loss Prevented']}
                />
                <Area type="monotone" dataKey="amount" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorLoss)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid: Pattern breakdown & Ring growth */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Fraud by Pattern BarChart */}
        <div className="lg:col-span-6 bg-surface-800 border border-surface-600/50 rounded-xl p-5 h-[320px] flex flex-col">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Fraud Cases by Pattern</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.fraudByPattern}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252d4a" vertical={false} />
                <XAxis dataKey="pattern" stroke="#4a5478" fontSize={10} tickLine={false} />
                <YAxis stroke="#4a5478" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f1424', borderColor: '#323b5a', borderRadius: '8px' }} />
                <Bar dataKey="count" name="Case Count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fraud Ring Growth Line Chart */}
        <div className="lg:col-span-6 bg-surface-800 border border-surface-600/50 rounded-xl p-5 h-[320px] flex flex-col">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Fraud Ring Growth Rate</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.fraudRingGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252d4a" vertical={false} />
                <XAxis dataKey="time" stroke="#4a5478" fontSize={10} tickLine={false} />
                <YAxis stroke="#4a5478" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f1424', borderColor: '#323b5a', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="rings" name="Identified Rings" stroke="#ef4444" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
