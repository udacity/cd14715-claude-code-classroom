/**
 * Sample Transactions
 *
 * 5 test cases for fraud analysis with different risk levels.
 */

export interface Transaction {
  id: string;
  amount: number;
  merchant: string;
  category: string;
  location: string;
  time: string;
  customerHistory: {
    typicalAmount: number;
    typicalLocation: string;
    accountAgeDays: number;
    previousFlags: number;
  };
}

export const TRANSACTIONS: Record<string, Transaction> = {
  // 1. Legitimate large purchase - should be LOW risk
  legitimate_large: {
    id: "TXN001",
    amount: 2500,
    merchant: "Kay Jewelers",
    category: "jewelry",
    location: "New York, USA",
    time: "2024-02-14T14:30:00Z",
    customerHistory: {
      typicalAmount: 150,
      typicalLocation: "New York, USA",
      accountAgeDays: 1825,
      previousFlags: 0,
    },
  },

  // 2. Obvious fraud - should be CRITICAL risk
  obvious_fraud: {
    id: "TXN002",
    amount: 4999,
    merchant: "Electronics Plus",
    category: "electronics",
    location: "Lagos, Nigeria",
    time: "2024-02-14T03:45:00Z",
    customerHistory: {
      typicalAmount: 75,
      typicalLocation: "Chicago, USA",
      accountAgeDays: 45,
      previousFlags: 2,
    },
  },

  // 3. Ambiguous case - requires judgment (MEDIUM risk)
  ambiguous_case: {
    id: "TXN003",
    amount: 890,
    merchant: "Hotel Marrakech",
    category: "travel",
    location: "Marrakech, Morocco",
    time: "2024-02-14T19:20:00Z",
    customerHistory: {
      typicalAmount: 200,
      typicalLocation: "Boston, USA",
      accountAgeDays: 730,
      previousFlags: 0,
    },
  },

  // 4. Velocity abuse - gift card pattern (HIGH risk)
  velocity_abuse: {
    id: "TXN004",
    amount: 199,
    merchant: "Gift Cards R Us",
    category: "gift_cards",
    location: "Miami, USA",
    time: "2024-02-14T22:58:00Z",
    customerHistory: {
      typicalAmount: 50,
      typicalLocation: "Miami, USA",
      accountAgeDays: 120,
      previousFlags: 1,
    },
  },

  // 5. First-time buyer - new account risk (MEDIUM risk)
  first_time_buyer: {
    id: "TXN005",
    amount: 1200,
    merchant: "Apple Store",
    category: "electronics",
    location: "San Francisco, USA",
    time: "2024-02-14T11:15:00Z",
    customerHistory: {
      typicalAmount: 0,
      typicalLocation: "San Francisco, USA",
      accountAgeDays: 3,
      previousFlags: 0,
    },
  },
};
