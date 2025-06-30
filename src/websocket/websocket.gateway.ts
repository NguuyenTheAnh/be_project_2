import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
@Injectable()
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private adminClients = new Set<string>();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.adminClients.delete(client.id);
  }

  // Admin connects to receive notifications
  handleAdminConnect(clientId: string) {
    this.adminClients.add(clientId);
    console.log(`Admin client connected: ${clientId}`);
  }

  // Admin disconnects
  handleAdminDisconnect(clientId: string) {
    this.adminClients.delete(clientId);
    console.log(`Admin client disconnected: ${clientId}`);
  }

  // Send payment success notification to all admin clients
  sendPaymentSuccessNotification(data: {
    table_id: number;
    table_name: string;
    order_id: number;
    amount: number;
    guest_name: string;
    timestamp: string;
  }) {
    this.server.emit('payment-success', {
      type: 'PAYMENT_SUCCESS',
      message: `Payment successful at ${data.table_name}`,
      data: data,
      timestamp: data.timestamp,
    });

    console.log(`Payment success notification sent for table ${data.table_name}`);
  }

  // Send table status update notification
  sendTableStatusUpdate(data: {
    table_id: number;
    table_name: string;
    status: string;
    payment_status: string;
  }) {
    this.server.emit('table-status-update', {
      type: 'TABLE_STATUS_UPDATE',
      message: `Table ${data.table_name} status has been updated`,
      data: data,
      timestamp: new Date().toISOString(),
    });

    console.log(`Table status update sent for table ${data.table_name}`);
  }

  // Send order status update notification
  sendOrderStatusUpdate(data: {
    order_id: number;
    table_name: string;
    status: string;
    total_order: number;
  }) {
    this.server.emit('order-status-update', {
      type: 'ORDER_STATUS_UPDATE',
      message: `Order at ${data.table_name} has been updated`,
      data: data,
      timestamp: new Date().toISOString(),
    });

    console.log(`Order status update sent for order ${data.order_id}`);
  }

  // Send guest login notification
  sendGuestLoginNotification(data: {
    table_id: number;
    table_name: string;
    guest_id: number;
    guest_name: string;
    timestamp: string;
  }) {
    this.server.emit('guest-login', {
      type: 'GUEST_LOGIN',
      message: `Guest ${data.guest_name} has joined ${data.table_name}`,
      data: data,
      timestamp: data.timestamp,
    });

    console.log(`Guest login notification sent for ${data.guest_name} at table ${data.table_name}`);
  }

  // Send table occupied notification
  sendTableOccupiedNotification(data: {
    table_id: number;
    table_name: string;
    guest_name: string;
    previous_status: string;
    new_status: string;
    timestamp: string;
  }) {
    this.server.emit('table-occupied', {
      type: 'TABLE_OCCUPIED',
      message: `${data.table_name} is now occupied by ${data.guest_name}`,
      data: data,
      timestamp: data.timestamp,
    });

    console.log(`Table occupied notification sent for table ${data.table_name}`);
  }

  // General notification method
  sendNotification(type: string, message: string, data?: any) {
    this.server.emit('notification', {
      type: type,
      message: message,
      data: data,
      timestamp: new Date().toISOString(),
    });
  }
}
