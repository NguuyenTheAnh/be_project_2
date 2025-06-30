# Real-time Notification Integration Guide

## Overview
The backend system has been integrated with WebSocket (Socket.IO) to send real-time notifications when important events occur, especially when customers make successful payments.

## 🚀 Frontend Setup

### 1. Install Socket.IO Client
```bash
npm install socket.io-client
# or
yarn add socket.io-client
```

### 2. WebSocket Connection in React/Next.js

```javascript
import { io, Socket } from 'socket.io-client';

// Initialize connection
const socket: Socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000', {
  withCredentials: true,
  autoConnect: true,
});

export default socket;
```

### 3. React Hook Component for Notifications

```javascript
import { useEffect, useState } from 'react';
import socket from './socket'; // socket connection file above

interface Notification {
  type: string;
  message: string;
  data: any;
  timestamp: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connection events
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
    });

    // Listen for payment success notifications
    socket.on('payment-success', (notification: Notification) => {
      console.log('Payment success notification:', notification);
      setNotifications(prev => [notification, ...prev]);
      
      // Show toast notification
      showToast(notification.message, 'success');
      
      // Reload management page or update state
      window.location.reload(); // or use state management
    });

    // Listen for table status updates
    socket.on('table-status-update', (notification: Notification) => {
      console.log('Table status update:', notification);
      setNotifications(prev => [notification, ...prev]);
      
      // Update table list without full page reload
      refreshTableList();
    });

    // Listen for order status updates
    socket.on('order-status-update', (notification: Notification) => {
      console.log('Order status update:', notification);
      setNotifications(prev => [notification, ...prev]);
      
      // Update order list
      refreshOrderList();
    });

    // Listen for general notifications
    socket.on('notification', (notification: Notification) => {
      console.log('General notification:', notification);
      setNotifications(prev => [notification, ...prev]);
      showToast(notification.message, 'info');
    });

    // Cleanup when component unmounts
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('payment-success');
      socket.off('table-status-update');
      socket.off('order-status-update');
      socket.off('notification');
    };
  }, []);

  return {
    notifications,
    isConnected,
    socket
  };
};

// Helper functions (customize according to your UI framework)
const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error') => {
  // Use toast library like react-toastify, sonner, etc.
  console.log(`${type.toUpperCase()}: ${message}`);
};

const refreshTableList = () => {
  // Implement logic to refresh table list
  // Can call API or update state
};

const refreshOrderList = () => {
  // Implement logic to refresh order list
  // Can call API or update state
};
```

### 4. Usage in Admin Dashboard

```javascript
// AdminDashboard.jsx
import React from 'react';
import { useNotifications } from './hooks/useNotifications';

const AdminDashboard = () => {
  const { notifications, isConnected } = useNotifications();

  return (
    <div className="admin-dashboard">
      {/* Connection status indicator */}
      <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
        {isConnected ? '🟢 Connected successfully' : '🔴 Connection lost'}
      </div>

      {/* Notifications panel */}
      <div className="notifications-panel">
        <h3>Recent notifications</h3>
        {notifications.slice(0, 5).map((notification, index) => (
          <div key={index} className={`notification ${notification.type.toLowerCase()}`}>
            <div className="notification-message">{notification.message}</div>
            <div className="notification-time">
              {new Date(notification.timestamp).toLocaleString('en-US')}
            </div>
          </div>
        ))}
      </div>

      {/* Other dashboard components */}
    </div>
  );
};

export default AdminDashboard;
```

## 📊 Event Types Sent by Backend

### 1. `payment-success`
**Triggered**: When customer makes successful payment
```javascript
{
  type: 'PAYMENT_SUCCESS',
  message: 'Payment successful at Table 5',
  data: {
    table_id: 5,
    table_name: 'Table 5',
    order_id: 123,
    amount: 150000,
    guest_name: 'Nguyễn Văn A',
    timestamp: '2025-06-30T15:30:00.000Z'
  },
  timestamp: '2025-06-30T15:30:00.000Z'
}
```

### 2. `table-status-update`
**Triggered**: When table status is updated
```javascript
{
  type: 'TABLE_STATUS_UPDATE',
  message: 'Table Table 5 status has been updated',
  data: {
    table_id: 5,
    table_name: 'Table 5',
    status: 'Unavailable',
    payment_status: 'Paid'
  },
  timestamp: '2025-06-30T15:30:00.000Z'
}
```

### 3. `order-status-update`
**Triggered**: When order status is updated
```javascript
{
  type: 'ORDER_STATUS_UPDATE',
  message: 'Order at Table 5 has been updated',
  data: {
    order_id: 123,
    table_name: 'Table 5',
    status: 'Completed',
    total_order: 150000
  },
  timestamp: '2025-06-30T15:30:00.000Z'
}
```

### 4. `notification`
**Triggered**: General notifications
```javascript
{
  type: 'GENERAL_NOTIFICATION',
  message: 'General system notification',
  data: { /* customizable */ },
  timestamp: '2025-06-30T15:30:00.000Z'
}
```

## 🔧 Advanced Customization

### 1. Smart Auto-reload handling
Instead of reloading the entire page, you can:
```javascript
// Only reload specific components/data
const handlePaymentSuccess = (notification) => {
  // Update table list
  refetchTables();
  
  // Update order list
  refetchOrders();
  
  // Update statistics
  refetchStats();
  
  // Show notification
  showNotification(notification.message);
};
```

### 2. Sound Notification
```javascript
const playNotificationSound = () => {
  const audio = new Audio('/notification-sound.mp3');
  audio.play().catch(e => console.log('Cannot play sound:', e));
};

// In useEffect
socket.on('payment-success', (notification) => {
  playNotificationSound();
  // ... other handling
});
```

### 3. Desktop Notification
```javascript
const showDesktopNotification = (message: string) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Restaurant Admin', {
      body: message,
      icon: '/restaurant-icon.png'
    });
  }
};

// Request permission when component mounts
useEffect(() => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}, []);
```

## 🚨 Important Notes

1. **Environment Variables**: Make sure `NEXT_PUBLIC_BACKEND_URL` is configured correctly in `.env.local`

2. **CORS**: Backend has been configured with CORS for WebSocket, ensure frontend URL is added to whitelist

3. **Error Handling**: Always handle connection loss and automatic reconnection

4. **Performance**: Limit the number of notifications displayed to avoid memory leaks

5. **Security**: WebSocket connection is protected, only admin dashboard should connect

## 🔄 Testing

To test WebSocket connection:
1. Open admin dashboard
2. Open browser console to see logs
3. Make payment from customer interface
4. Check notifications appear in admin dashboard

## 📱 Mobile Support

WebSocket works well on mobile browsers. However, note:
- Connection may be lost when app goes to background
- Implement reconnection logic when app returns to foreground

---

**Contact support if you need additional help with implementation!**