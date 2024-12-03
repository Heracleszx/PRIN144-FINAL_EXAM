const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();

// Middleware
app.use(express.json());

// Set up Sequelize for PostgreSQL
const sequelize = new Sequelize('employee_tracker', 'your_username', 'your_password', {
  host: 'localhost',
  dialect: 'postgres',
});

// Define the Employee model
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
  },
  department: {
    type: DataTypes.STRING,
  },
  is_working_from_home: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

// Create Employee
async function createEmployee(req, res) {
  try {
    const { first_name, last_name, position, department, is_working_from_home } = req.body;
    const newEmployee = await Employee.create({
      first_name,
      last_name,
      position,
      department,
      is_working_from_home,
    });
    res.status(201).json({ id: newEmployee.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get All Employees
async function getAllEmployees(req, res) {
  try {
    const employees = await Employee.findAll();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get Employee by ID
async function getEmployeeById(req, res) {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Update Employee
async function updateEmployee(req, res) {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const { first_name, last_name, position, department, is_working_from_home } = req.body;
    employee.first_name = first_name || employee.first_name;
    employee.last_name = last_name || employee.last_name;
    employee.position = position || employee.position;
    employee.department = department || employee.department;
    employee.is_working_from_home = is_working_from_home || employee.is_working_from_home;

    await employee.save();
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Delete Employee
async function deleteEmployee(req, res) {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    await employee.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Routes
app.get('/api/employees', getAllEmployees);
app.get('/api/employees/:id', getEmployeeById);
app.post('/api/employees', createEmployee);
app.put('/api/employees/:id', updateEmployee);
app.delete('/api/employees/:id', deleteEmployee);

// Root Route
app.get('/', (req, res) => {
  res.send('Employee Tracker: Your Name');
});

// Sync Database and Start Server
sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });
});
