const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (replace with MongoDB later)
let posts = [
  {
    id: '1',
    title: 'The Future of Design Systems: Trends to Watch in 2025',
    content: 'Design systems are evolving rapidly. Here are the key trends...',
    author: 'user1',
    category: 'Design',
    tags: ['design', 'systems', 'trends'],
    createdAt: new Date('2024-11-01'),
    published: true
  },
  {
    id: '2',
    title: 'Micro-interactions: The Secret Sauce of Great UX',
    content: 'Micro-interactions make the difference between good and great UX...',
    author: 'user1',
    category: 'UX',
    tags: ['ux', 'micro-interactions', 'design'],
    createdAt: new Date('2024-11-02'),
    published: true
  },
  {
    id: '3',
    title: 'What I Learned from Failing My First Startup',
    content: 'Starting a startup is hard. Here are the lessons I learned...',
    author: 'user2',
    category: 'Startups',
    tags: ['startups', 'entrepreneurship', 'lessons'],
    createdAt: new Date('2024-11-02'),
    published: true
  }
];

// Routes
app.get('/api/posts', (req, res) => {
  const { category, search } = req.query;
  let filteredPosts = [...posts];

  if (category) {
    filteredPosts = filteredPosts.filter(p => p.category === category);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filteredPosts = filteredPosts.filter(p => 
      p.title.toLowerCase().includes(searchLower) ||
      p.content.toLowerCase().includes(searchLower)
    );
  }

  res.json(filteredPosts);
});

app.get('/api/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  res.json(post);
});

app.post('/api/posts', (req, res) => {
  const { title, content, author, category, tags } = req.body;
  
  const newPost = {
    id: String(posts.length + 1),
    title,
    content,
    author,
    category,
    tags: tags || [],
    createdAt: new Date(),
    updatedAt: new Date(),
    published: true
  };

  posts.push(newPost);
  res.status(201).json(newPost);
});

app.put('/api/posts/:id', (req, res) => {
  const postIndex = posts.findIndex(p => p.id === req.params.id);
  if (postIndex === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }

  posts[postIndex] = {
    ...posts[postIndex],
    ...req.body,
    updatedAt: new Date()
  };

  res.json(posts[postIndex]);
});

app.delete('/api/posts/:id', (req, res) => {
  const postIndex = posts.findIndex(p => p.id === req.params.id);
  if (postIndex === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }

  posts.splice(postIndex, 1);
  res.status(204).send();
});

app.get('/', (req, res) => {
  res.json({ 
    service: 'post-service',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      posts: '/api/posts',
      post: '/api/posts/:id'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'post-service' });
});

app.listen(PORT, () => {
  console.log(`Post Service running on port ${PORT}`);
});

