const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.js');
const reportRoutes = require('./routes/report.js');
const faceMonitorRoutes = require('./routes/faceMonitor.js');
const insightRoutes = require('./routes/insights.js');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/face', faceMonitorRoutes);
app.use('/api/insights', insightRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  })
  .catch((error) => console.log(error.message));
