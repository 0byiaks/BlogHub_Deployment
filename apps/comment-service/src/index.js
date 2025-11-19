const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3004';
const POST_SERVICE_URL = process.env.POST_SERVICE_URL || 'http://localhost:3001';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (replace with MongoDB later)
let comments = [
  {
    id: '1',
    postId: '1',
    author: 'user2',
    content: 'This is exactly what I needed to read today.',
    parentId: null,
    createdAt: new Date('2024-11-03'),
    approved: true
  },
  {
    id: '2',
    postId: '2',
    author: 'user3',
    content: 'Great insights on micro-interactions!',
    parentId: null,
    createdAt: new Date('2024-11-01'),
    approved: true
  }
];

// Routes
app.get('/api/comments/post/:postId', (req, res) => {
  const postComments = comments.filter(c => c.postId === req.params.postId);
  res.json(postComments);
});

app.post('/api/comments', async (req, res) => {
  const { postId, author, content, parentId } = req.body;

  const newComment = {
    id: String(comments.length + 1),
    postId,
    author,
    content,
    parentId: parentId || null,
    createdAt: new Date(),
    approved: true
  };

  comments.push(newComment);

  // Send notification to post author (async, don't wait)
  try {
    // Get post to find the author
    const postResponse = await axios.get(`${POST_SERVICE_URL}/api/posts/${postId}`).catch(() => null);
    const postAuthor = postResponse?.data?.author || 'user1';

    // Only notify if commenter is not the post author
    if (postAuthor !== author) {
      await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications`, {
        userId: postAuthor,
        type: 'comment',
        message: `${author} commented on your post`,
        postId: postId,
        commentId: newComment.id,
        metadata: {
          commentAuthor: author,
          commentContent: content.substring(0, 50) // First 50 chars
        }
      }).catch(err => {
        console.error('Failed to send notification:', err.message);
      });
    }
  } catch (error) {
    console.error('Error sending notification:', error.message);
    // Don't fail the comment creation if notification fails
  }

  res.status(201).json(newComment);
});

app.put('/api/comments/:id', (req, res) => {
  const commentIndex = comments.findIndex(c => c.id === req.params.id);
  if (commentIndex === -1) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  comments[commentIndex] = {
    ...comments[commentIndex],
    ...req.body
  };

  res.json(comments[commentIndex]);
});

app.delete('/api/comments/:id', (req, res) => {
  const commentIndex = comments.findIndex(c => c.id === req.params.id);
  if (commentIndex === -1) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  comments.splice(commentIndex, 1);
  res.status(204).send();
});

app.get('/', (req, res) => {
  res.json({ 
    service: 'comment-service',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      comments: '/api/comments',
      postComments: '/api/comments/post/:postId'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'comment-service' });
});

app.listen(PORT, () => {
  console.log(`Comment Service running on port ${PORT}`);
});

