const express = require('express');
const Employee = require('../models/employee');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Initialize express app
const app = express();
const PORT = 3000;

app.use(express.json()); // Use built-in express JSON parser

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Employee Tracker API',
      description: 'API documentation for Employee Tracker System',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// API docs route
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Set up Sequelize (PostgreSQL database connection)
const sequelize = new Sequelize('postgres://user:password@localhost:5432/your_database_name', {
  dialect: 'postgres',
  logging: false, 
});

// GET all employees
router.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.findAll();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve employees' });
  }
});

// GET employee by ID
router.get('/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve employee' });
  }
});

// POST create a new employee
router.post('/employees', async (req, res) => {
  const { first_name, last_name, position, department, is_working_from_home } = req.body;

  try {
    const newEmployee = await Employee.create({ first_name, last_name, position, department, is_working_from_home });
    res.status(201).json({ id: newEmployee.id });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create employee' });
  }
});

// PUT update an employee
router.put('/employees/:id', async (req, res) => {
  const { first_name, last_name, position, department, is_working_from_home } = req.body;
  
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    await employee.update({ first_name, last_name, position, department, is_working_from_home });
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update employee' });
  }
});

// DELETE employee
router.delete('/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    await employee.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

module.exports = router;

// Index page to show "PRIN144-Final-Exam: Your Name"
app.get('/', (req, res) => {
  res.send('PRIN144-Final-Exam: Your Name'); // Change "Your Name" to your actual name
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
