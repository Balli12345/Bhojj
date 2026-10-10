import express from 'express';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { authenticate, authorize } from './src/middleware/auth';

// Initialize Firebase Admin (Ensure you have service account credentials)
// In AI Studio, this might need specific config or environment variables
initializeApp({
  credential: applicationDefault()
});

const app = express();
app.use(express.json());

// Example protected route
app.get('/api/admin-data', authenticate, authorize(['admin']), (req, res) => {
  res.json({ message: 'Welcome Admin' });
});

app.listen(3000, () => console.log('Server running on port 3000'));
