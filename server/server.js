import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import dbConnect from './src/config/db.js';

try {
  await dbConnect();

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}