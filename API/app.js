const express = require('express');
const app = express();
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const employeesRoutes = require('./routes/employees');
require('dotenv').config();

// Middleware to parse JSON requests
app.use(express.json());

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Employee Tracker API',
      version: '1.0.0',
      description: 'API for managing employee records'
    }
  },
  apis: ['./routes/employees.js'], // Point to the routes
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// API Routes
app.use('/api', employeesRoutes);

// Index Route
app.get('/', (req, res) => {
  res.send('PRIN144-Final-Exam: Your Name');
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});