const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3004;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (replace with MongoDB later)
let notifications = [];

// Helper function to get post author (would normally query post service)
// For MVP, we'll pass it from the comment service
const getPostAuthor = async (postId) => {
  // In production, this would call the post service
  // For now, return a default user
  return 'user1';
};

// Routes
app.get('/', (req, res) => {
  res.json({ 
    service: 'notification-service',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      notifications: '/api/notifications',
      userNotifications: '/api/notifications/user/:userId',
      markRead: '/api/notifications/:id/read'
    }
  });
});

// Get all notifications for a user
app.get('/api/notifications/user/:userId', (req, res) => {
  const { userId } = req.params;
  const userNotifications = notifications
    .filter(n => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  res.json(userNotifications);
});

// Get unread count for a user
app.get('/api/notifications/user/:userId/unread-count', (req, res) => {
  const { userId } = req.params;
  const unreadCount = notifications.filter(
    n => n.userId === userId && !n.read
  ).length;
  
  res.json({ count: unreadCount });
});

// Create a new notification
app.post('/api/notifications', async (req, res) => {
  const { userId, type, message, postId, commentId, metadata } = req.body;

  const notification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    type, // 'comment', 'like', 'follow', etc.
    message,
    postId: postId || null,
    commentId: commentId || null,
    metadata: metadata || {},
    read: false,
    createdAt: new Date()
  };

  notifications.push(notification);
  res.status(201).json(notification);
});

// Mark notification as read
app.put('/api/notifications/:id/read', (req, res) => {
  const notification = notifications.find(n => n.id === req.params.id);
  if (!notification) {
    return res.status(404).json({ error: 'Notification not found' });
  }

  notification.read = true;
  res.json(notification);
});

// Mark all notifications as read for a user
app.put('/api/notifications/user/:userId/read-all', (req, res) => {
  const { userId } = req.params;
  const userNotifications = notifications.filter(n => n.userId === userId);
  
  userNotifications.forEach(n => {
    n.read = true;
  });

  res.json({ message: 'All notifications marked as read', count: userNotifications.length });
});

// Delete a notification
app.delete('/api/notifications/:id', (req, res) => {
  const index = notifications.findIndex(n => n.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Notification not found' });
  }

  notifications.splice(index, 1);
  res.status(204).send();
});

// Get all notifications (for admin/debugging)
app.get('/api/notifications', (req, res) => {
  res.json(notifications);
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'notification-service' });
});

app.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
});

