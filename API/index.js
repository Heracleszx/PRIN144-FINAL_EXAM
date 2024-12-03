const express = require('express');
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

// Define Employee model
const Employee = sequelize.define('Employee', {
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_working_from_home: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

sequelize.sync()
  .then(() => console.log('Database synchronized'))
  .catch((error) => console.error('Error syncing database:', error));

// Routes for CRUD operations

// 1. Get all employees
app.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.findAll();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch employees' });
  }
});

// 2. Get a specific employee by ID
app.get('/employees/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch employee' });
  }
});

// 3. Create a new employee
app.post('/employees', async (req, res) => {
  const { first_name, last_name, position, department, is_working_from_home } = req.body;
  try {
    const newEmployee = await Employee.create({
      first_name,
      last_name,
      position,
      department,
      is_working_from_home,
    });
    res.status(201).json({ id: newEmployee.id });
  } catch (error) {
    res.status(500).json({ error: 'Unable to create employee' });
  }
});

// 4. Update an existing employee
app.put('/employees/:id', async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, position, department, is_working_from_home } = req.body;
  try {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    await employee.update({
      first_name,
      last_name,
      position,
      department,
      is_working_from_home,
    });
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Unable to update employee' });
  }
});

// 5. Delete an employee by ID
app.delete('/employees/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    await employee.destroy();
    res.status(204).send(); // No content status code
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete employee' });
  }
});

// Index page to show "PRIN144-Final-Exam: Your Name"
app.get('/', (req, res) => {
  res.send('PRIN144-Final-Exam: Your Name'); // Change "Your Name" to your actual name
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
