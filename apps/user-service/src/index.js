const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3003;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (replace with MongoDB later)
let users = [
  {
    id: 'user1',
    username: 'johndoe',
    email: 'john@example.com',
    password: '$2b$10$rOzJqKZ5Q5Z5Z5Z5Z5Z5Z.5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', // password: password123
    role: 'author',
    createdAt: new Date('2024-01-01')
  }
];

// Routes
app.post('/api/users/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (users.find(u => u.email === email || u.username === username)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  const newUser = {
    id: `user${users.length + 1}`,
    username,
    email,
    password: hashedPassword,
    role: 'reader',
    createdAt: new Date()
  };

  users.push(newUser);
  res.status(201).json({ id: newUser.id, username: newUser.username, email: newUser.email });
});

app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
});

app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ id: user.id, username: user.username, email: user.email, role: user.role });
});

app.get('/api/users', (req, res) => {
  const userList = users.map(u => ({
    id: u.id,
    username: u.username,
    email: u.email,
    role: u.role
  }));
  res.json(userList);
});

app.get('/', (req, res) => {
  res.json({ 
    service: 'user-service',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      register: '/api/users/register',
      login: '/api/users/login',
      users: '/api/users'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'user-service' });
});

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});

