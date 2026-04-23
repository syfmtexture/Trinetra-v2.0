'use client';

import React, { useState } from 'react';
import {
  MapPin, Calendar, Clock, CreditCard,
  Plus, Trash2, Download, CheckCircle2, Wifi,
  Camera, ShoppingBag, X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AlibiEvent {
  id: string;
  time: string;
  title: string;
  location: string;
  source: string;
  verified: boolean;
}

interface DataSource {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  connected: boolean;
  description: string;
}

const SOURCE_ICONS: Record<string, React.ElementType> = {
  'google-maps': MapPin, 'google-cal': Calendar, 'receipts': CreditCard,
  'social': Camera, 'wifi': Wifi, 'purchases': ShoppingBag, 'manual': Clock,
};

const SIMULATED: Record<string, Omit<AlibiEvent, 'id'>[]> = {
  'google-maps': [
    { time: '08:15', title: 'Left home', location: 'Home Address, Mumbai', source: 'google-maps', verified: true },
    { time: '09:02', title: 'Arrived at office', location: 'Tech Park, Andheri East', source: 'google-maps', verified: true },
    { time: '18:30', title: 'Left office', location: 'Tech Park, Andheri East', source: 'google-maps', verified: true },
  ],
  'google-cal': [
    { time: '10:00', title: 'Team standup meeting', location: 'Conference Room B', source: 'google-cal', verified: true },
    { time: '14:00', title: 'Client presentation', location: 'Zoom Call', source: 'google-cal', verified: true },
  ],
  'receipts': [
    { time: '08:45', title: 'Coffee purchase — Starbucks', location: 'Starbucks, Andheri Station', source: 'receipts', verified: true },
    { time: '13:15', title: 'Lunch order — Swiggy', location: 'Delivered to Tech Park', source: 'receipts', verified: true },
  ],
  'social': [
    { time: '12:30', title: 'Instagram story posted', location: 'Office cafeteria', source: 'social', verified: true },
  ],
  'wifi': [
    { time: '09:05', title: 'Connected to OfficeNet-5G', location: 'Tech Park, Andheri', source: 'wifi', verified: true },
    { time: '18:35', title: 'Connected to HomeWiFi', location: 'Home Address', source: 'wifi', verified: true },
  ],
  'purchases': [
    { time: '11:20', title: 'Amazon order placed', location: 'Delivery to home address', source: 'purchases', verified: true },
  ],
};

const INIT_SOURCES: DataSource[] = [
  { id: 'google-maps', name: 'Google Maps Timeline', icon: MapPin, color: 'bg-blue-500', connected: false, description: 'Location history & travel routes' },
  { id: 'google-cal', name: 'Google Calendar', icon: Calendar, color: 'bg-emerald-500', connected: false, description: 'Meetings, events & appointments' },
  { id: 'receipts', name: 'Digital Receipts', icon: CreditCard, color: 'bg-amber-500', connected: false, description: 'Purchase records & transactions' },
  { id: 'social', name: 'Social Media Check-ins', icon: Camera, color: 'bg-pink-500', connected: false, description: 'Posts, stories & location tags' },
  { id: 'wifi', name: 'Wi-Fi Connection Logs', icon: Wifi, color: 'bg-indigo-500', connected: false, description: 'Network connection timestamps' },
  { id: 'purchases', name: 'Online Orders', icon: ShoppingBag, color: 'bg-teal-500', connected: false, description: 'E-commerce order confirmations' },
];

export const AlibiTab = () => {
  const [incidentDate, setIncidentDate] = useState('');
  const [incidentTime, setIncidentTime] = useState('');
  const [events, setEvents] = useState<AlibiEvent[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ time: '', title: '', location: '' });
  const [dataSources, setDataSources] = useState<DataSource[]>(INIT_SOURCES);

  const toggleConnect = (id: string) => {
    setDataSources(prev => prev.map(ds => {
      if (ds.id !== id) return ds;
      const nowConnected = !ds.connected;
      if (nowConnected) {
        const sim = (SIMULATED[id] || []).map((e, i) => ({ ...e, id: `${id}-${Date.now()}-${i}` }));
        setEvents(p => [...p, ...sim].sort((a, b) => a.time.localeCompare(b.time)));
      } else {
        setEvents(p => p.filter(e => e.source !== id));
      }
      return { ...ds, connected: nowConnected };
    }));
  };

  const addManualEvent = () => {
    if (!newEvent.time || !newEvent.title) return;
    setEvents(prev => [...prev, {
      id: `manual-${Date.now()}`, time: newEvent.time, title: newEvent.title,
      location: newEvent.location || 'Not specified', source: 'manual', verified: false,
    }].sort((a, b) => a.time.localeCompare(b.time)));
    setNewEvent({ time: '', title: '', location: '' });
    setShowAddForm(false);
  };

  const exportAlibi = () => {
    const report = {
      alibi_report: {
        generated_by: 'Trinetra Deepfake Detection Platform',
        generated_at: new Date().toISOString(),
        incident_date: incidentDate, incident_time: incidentTime,
        sources: dataSources.filter(ds => ds.connected).map(ds => ds.name),
        verified_events: events.filter(e => e.verified).length,
        total_events: events.length,
        timeline: events.map(e => ({ time: e.time, event: e.title, location: e.location, source: e.source, verified: e.verified })),
      },
      disclaimer: 'This report was generated from user-provided digital footprint data. Each connected data source provides cryptographically timestamped evidence.',
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `trinetra-alibi-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const connectedCount = dataSources.filter(ds => ds.connected).length;
  const verifiedCount = events.filter(e => e.verified).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold">Digital Alibi Builder</h2>
              <p className="text-xs text-muted-foreground">Prove where you really were — connect your digital footprint</p>
            </div>
          </div>
          {events.length > 0 && (
            <button onClick={exportAlibi} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-foreground text-background hover:bg-foreground/90 text-sm font-medium transition-colors">
              <Download className="h-4 w-4" /> Export Alibi Report
            </button>
          )}
        </div>
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground font-semibold uppercase tracking-widest block mb-2">Incident Date</label>
            <input type="date" value={incidentDate} onChange={(e) => setIncidentDate(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-muted/40 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-sm" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-semibold uppercase tracking-widest block mb-2">Incident Time</label>
            <input type="time" value={incidentTime} onChange={(e) => setIncidentTime(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-muted/40 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-sm" />
          </div>
        </div>
        {incidentDate && (
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { val: connectedCount, label: 'Sources', cls: 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400' },
              { val: verifiedCount, label: 'Verified', cls: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' },
              { val: events.length, label: 'Events', cls: 'bg-brand-purple/10 border-brand-purple/20 text-brand-purple' },
            ].map(s => (
              <div key={s.label} className={`rounded-2xl border p-3 text-center ${s.cls}`}>
                <p className="text-2xl font-display font-bold">{s.val}</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Data Sources */}
      <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
        <h3 className="font-display text-lg font-semibold mb-1">Connect Data Sources</h3>
        <p className="text-xs text-muted-foreground mb-6">Link your accounts to automatically import timestamped location evidence</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {dataSources.map((ds) => {
            const Icon = ds.icon;
            return (
              <button key={ds.id} onClick={() => incidentDate ? toggleConnect(ds.id) : undefined}
                className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                  ds.connected ? 'border-emerald-500/40 bg-emerald-500/5' :
                  incidentDate ? 'border-border bg-muted/20 hover:border-blue-500/40 hover:bg-blue-500/5 cursor-pointer' :
                  'border-border bg-muted/20 opacity-50 cursor-not-allowed'}`}>
                <div className={`h-10 w-10 rounded-xl ${ds.color} flex items-center justify-center shrink-0`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{ds.name}</p>
                  <p className="text-[11px] text-muted-foreground">{ds.description}</p>
                </div>
                {ds.connected ? <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" /> : <div className="h-5 w-5 rounded-full border-2 border-border shrink-0" />}
              </button>
            );
          })}
        </div>
        {!incidentDate && <p className="mt-4 text-xs text-amber-600 dark:text-amber-400 font-medium">⚠ Set the incident date above first</p>}
      </div>

      {/* Timeline */}
      <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h3 className="font-display text-lg font-semibold">Alibi Timeline</h3>
            <p className="text-xs text-muted-foreground">Your verified digital footprint for {incidentDate || 'the incident date'}</p>
          </div>
          <button onClick={() => setShowAddForm(true)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border bg-muted/40 hover:bg-muted text-sm font-medium transition-colors">
            <Plus className="h-4 w-4" /> Add Entry
          </button>
        </div>
        <AnimatePresence>
          {showAddForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-5 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-display font-semibold text-sm">Add Manual Entry</h4>
                  <button onClick={() => setShowAddForm(false)}><X className="h-4 w-4 text-muted-foreground" /></button>
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <input type="time" value={newEvent.time} onChange={(e) => setNewEvent(p => ({ ...p, time: e.target.value }))} className="px-3 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
                  <input type="text" value={newEvent.title} onChange={(e) => setNewEvent(p => ({ ...p, title: e.target.value }))} placeholder="What were you doing?" className="px-3 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
                  <input type="text" value={newEvent.location} onChange={(e) => setNewEvent(p => ({ ...p, location: e.target.value }))} placeholder="Location" className="px-3 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
                </div>
                <button onClick={addManualEvent} className="mt-3 px-4 py-2 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors">Add to Timeline</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {events.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">No events yet. Connect data sources or add entries manually.</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 via-brand-purple to-brand-orange" />
            <div className="space-y-1">
              {events.map((evt, i) => {
                const Icon = SOURCE_ICONS[evt.source] || Clock;
                return (
                  <motion.div key={evt.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="relative flex items-start gap-4 pl-12 py-3 group">
                    <div className={`absolute left-3.5 top-4 h-3 w-3 rounded-full border-2 border-background ${evt.verified ? 'bg-emerald-500' : 'bg-muted-foreground/40'}`} />
                    <div className="flex-1 rounded-2xl border border-border bg-muted/20 p-4 hover:bg-muted/40 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-blue-600 dark:text-blue-400 font-bold">{evt.time}</span>
                          {evt.verified && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="h-2.5 w-2.5" /> Verified
                            </span>
                          )}
                        </div>
                        <button onClick={() => setEvents(p => p.filter(e => e.id !== evt.id))} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-sm font-medium mt-1">{evt.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{evt.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-2">
                        <Icon className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{evt.source.replace('-', ' ')}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
