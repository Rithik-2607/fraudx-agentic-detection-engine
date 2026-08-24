/** Centralized mock transaction data */

export const transactions = [
  { id: 'TX-82931', sender: 'U1042', receiver: 'U1088', amount: 84500, currency: '₹', timestamp: '2026-08-24T14:32:08', device: 'DEV-882', location: 'Chennai', ip: '103.21.58.14', riskScore: 91, status: 'Investigating', type: 'transfer' },
  { id: 'TX-82932', sender: 'U1088', receiver: 'U1091', amount: 72000, currency: '₹', timestamp: '2026-08-24T14:32:09', device: 'DEV-882', location: 'Chennai', ip: '103.21.58.14', riskScore: 87, status: 'Flagged', type: 'transfer' },
  { id: 'TX-82933', sender: 'U1091', receiver: 'U1102', amount: 65000, currency: '₹', timestamp: '2026-08-24T14:28:15', device: 'DEV-903', location: 'Mumbai', ip: '182.73.12.44', riskScore: 78, status: 'Investigating', type: 'transfer' },
  { id: 'TX-82934', sender: 'U1102', receiver: 'U1132', amount: 58000, currency: '₹', timestamp: '2026-08-24T14:25:30', device: 'DEV-903', location: 'Mumbai', ip: '182.73.12.44', riskScore: 82, status: 'Flagged', type: 'transfer' },
  { id: 'TX-82935', sender: 'U1132', receiver: 'U1150', amount: 45000, currency: '₹', timestamp: '2026-08-24T14:20:45', device: 'DEV-771', location: 'Delhi', ip: '49.36.78.112', riskScore: 74, status: 'Investigating', type: 'transfer' },
  { id: 'TX-82936', sender: 'U1150', receiver: 'U1042', amount: 92000, currency: '₹', timestamp: '2026-08-24T14:18:10', device: 'DEV-771', location: 'Delhi', ip: '49.36.78.112', riskScore: 95, status: 'Flagged', type: 'transfer' },
  { id: 'TX-82937', sender: 'U2001', receiver: 'U2015', amount: 15000, currency: '₹', timestamp: '2026-08-24T14:15:22', device: 'DEV-112', location: 'Bangalore', ip: '103.87.45.22', riskScore: 32, status: 'Cleared', type: 'transfer' },
  { id: 'TX-82938', sender: 'U2015', receiver: 'U2033', amount: 8500, currency: '₹', timestamp: '2026-08-24T14:12:18', device: 'DEV-445', location: 'Hyderabad', ip: '122.176.32.18', riskScore: 18, status: 'Cleared', type: 'payment' },
  { id: 'TX-82939', sender: 'U1001', receiver: 'U1002', amount: 150000, currency: '₹', timestamp: '2026-08-24T13:58:44', device: 'DEV-551', location: 'Pune', ip: '115.96.12.77', riskScore: 88, status: 'Investigating', type: 'transfer' },
  { id: 'TX-82940', sender: 'U1002', receiver: 'U1003', amount: 142000, currency: '₹', timestamp: '2026-08-24T13:55:12', device: 'DEV-551', location: 'Pune', ip: '115.96.12.77', riskScore: 85, status: 'Flagged', type: 'transfer' },
  { id: 'TX-82941', sender: 'U1003', receiver: 'U1004', amount: 138000, currency: '₹', timestamp: '2026-08-24T13:50:33', device: 'DEV-662', location: 'Kolkata', ip: '59.94.176.8', riskScore: 79, status: 'Investigating', type: 'transfer' },
  { id: 'TX-82942', sender: 'U1004', receiver: 'U1005', amount: 130000, currency: '₹', timestamp: '2026-08-24T13:45:19', device: 'DEV-662', location: 'Kolkata', ip: '59.94.176.8', riskScore: 76, status: 'Investigating', type: 'transfer' },
  { id: 'TX-82943', sender: 'U1005', receiver: 'U1006', amount: 125000, currency: '₹', timestamp: '2026-08-24T13:40:08', device: 'DEV-773', location: 'Ahmedabad', ip: '203.134.56.91', riskScore: 71, status: 'Flagged', type: 'transfer' },
  { id: 'TX-82944', sender: 'U1006', receiver: 'U1002', amount: 118000, currency: '₹', timestamp: '2026-08-24T13:35:55', device: 'DEV-773', location: 'Ahmedabad', ip: '203.134.56.91', riskScore: 92, status: 'Flagged', type: 'transfer' },
  { id: 'TX-82945', sender: 'U3010', receiver: 'U3022', amount: 5200, currency: '₹', timestamp: '2026-08-24T13:30:11', device: 'DEV-901', location: 'Jaipur', ip: '106.215.44.33', riskScore: 12, status: 'Cleared', type: 'payment' },
  { id: 'TX-82946', sender: 'U3022', receiver: 'U3045', amount: 9800, currency: '₹', timestamp: '2026-08-24T13:25:44', device: 'DEV-322', location: 'Lucknow', ip: '117.96.78.55', riskScore: 8, status: 'Cleared', type: 'payment' },
  { id: 'TX-82947', sender: 'U4001', receiver: 'U4012', amount: 250000, currency: '₹', timestamp: '2026-08-24T13:20:08', device: 'DEV-411', location: 'Chandigarh', ip: '223.178.12.67', riskScore: 65, status: 'Monitoring', type: 'transfer' },
  { id: 'TX-82948', sender: 'U4012', receiver: 'U4028', amount: 245000, currency: '₹', timestamp: '2026-08-24T13:15:30', device: 'DEV-411', location: 'Chandigarh', ip: '223.178.12.67', riskScore: 68, status: 'Monitoring', type: 'transfer' },
  { id: 'TX-82949', sender: 'U5001', receiver: 'U5005', amount: 3200, currency: '₹', timestamp: '2026-08-24T13:10:55', device: 'DEV-201', location: 'Goa', ip: '14.139.56.78', riskScore: 5, status: 'Cleared', type: 'payment' },
  { id: 'TX-82950', sender: 'U5005', receiver: 'U5012', amount: 4100, currency: '₹', timestamp: '2026-08-24T13:05:22', device: 'DEV-556', location: 'Kochi', ip: '49.207.33.14', riskScore: 7, status: 'Cleared', type: 'payment' },
];

export const riskFactors = {
  'TX-82931': [
    { factor: 'Transaction anomaly', score: 20, description: 'Amount significantly deviates from account average' },
    { factor: 'Rapid transfer', score: 20, description: 'Multiple transfers within 5-minute window' },
    { factor: 'Suspicious network', score: 25, description: 'Connected to known suspicious accounts' },
    { factor: 'Shared device', score: 15, description: 'Same device fingerprint as flagged account' },
    { factor: 'Circular flow', score: 11, description: 'Funds return to originating account via intermediaries' },
  ],
  'TX-82936': [
    { factor: 'Circular transaction', score: 30, description: 'Completes a circular fund flow pattern' },
    { factor: 'Amount escalation', score: 20, description: 'Largest transfer in the chain' },
    { factor: 'Shared device cluster', score: 20, description: 'Device linked to multiple suspicious accounts' },
    { factor: 'Velocity anomaly', score: 15, description: 'Unusual transaction frequency' },
    { factor: 'Network centrality', score: 10, description: 'Account is hub in suspicious network' },
  ],
};

export default transactions;
