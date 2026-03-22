const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const webhookRoutes = require('./routes/webhook');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json({ limit: '10mb' })); // Increase limit for media files
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/webhook', webhookRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`GIBBOR Security Server running on port ${PORT}`);
});

module.exports = { app, server };
</task_progress>
- [x] Initialize Node.js project
- [x] Install required dependencies
- [x] Create project directory structure
- [x] Create Goldsky configuration file
- [x] Create webhook endpoint- [ ] Implement emergency response logic
- [ ] Set up database for evidence storage
- [ ] Add security validation
- [ ] Implement SMS notification service
- [ ] Create server entry point</task_progress>
</write_to_file>