import { WalletTransaction } from '../types';

export const INITIAL_WALLET_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'WTX-8921',
    type: 'credit',
    amount: 500,
    description: 'Welcome Bonus Credited (Goverdhan Satvik Seva)',
    timestamp: 'Today, 09:30 AM',
    status: 'success',
    paymentMethod: 'Promotional Welcome Bonus',
    referenceId: 'BHOJJ-WELCOME-500',
    closingBalance: 500,
  },
  {
    id: 'WTX-8922',
    type: 'debit',
    amount: 150,
    description: 'Payment for Order #ORD-7821 (Mansi Ganga Thali)',
    timestamp: 'Today, 12:15 PM',
    status: 'success',
    paymentMethod: 'Bhojj 1-Click Pay',
    orderId: 'ORD-7821',
    closingBalance: 350,
  },
  {
    id: 'WTX-8923',
    type: 'credit',
    amount: 100,
    description: 'Promotional Top-Up Cashback (Parikrama Seva Bonus)',
    timestamp: 'Today, 02:00 PM',
    status: 'success',
    paymentMethod: 'Cashback Credit',
    referenceId: 'CB-PARIKRAMA-100',
    closingBalance: 450,
  }
];

export const INITIAL_WALLET_BALANCE = 450;
