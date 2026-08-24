/** Centralized mock notification data */

export const notifications = [
  { id: 'NOTIF-001', title: 'Critical fraud ring detected', description: 'RING-018 — 6 accounts, circular flow pattern', severity: 'critical', time: '2026-08-24T14:32:09', read: false, link: '/fraud-rings/RING-018' },
  { id: 'NOTIF-002', title: 'High-risk account identified', description: 'U1042 — Risk score 91/100', severity: 'critical', time: '2026-08-24T14:32:08', read: false, link: '/investigations/INV-1024' },
  { id: 'NOTIF-003', title: 'Countermeasure requires approval', description: 'Restrict transactions for U1042', severity: 'warning', time: '2026-08-24T14:32:11', read: false, link: '/countermeasures' },
  { id: 'NOTIF-004', title: 'New layering network detected', description: 'RING-019 — 6 accounts identified', severity: 'critical', time: '2026-08-24T11:55:00', read: true, link: '/fraud-rings/RING-019' },
  { id: 'NOTIF-005', title: 'Investigation completed', description: 'INV-1019 — Shared device cluster resolved', severity: 'info', time: '2026-08-23T15:00:00', read: true, link: '/investigations/INV-1019' },
  { id: 'NOTIF-006', title: 'Agent status change', description: 'Countermeasure Agent moved to Standby', severity: 'info', time: '2026-08-24T12:00:00', read: true, link: '/agents' },
  { id: 'NOTIF-007', title: 'Rapid transfer chain detected', description: 'RING-020 — 3 accounts, ₹890K flow', severity: 'warning', time: '2026-08-24T12:15:00', read: true, link: '/fraud-rings/RING-020' },
  { id: 'NOTIF-008', title: 'Forensic report generated', description: 'Report for INV-1024 ready for review', severity: 'info', time: '2026-08-24T14:32:12', read: false, link: '/reports' },
];

export default notifications;
