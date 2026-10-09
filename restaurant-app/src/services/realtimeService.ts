import { Order, OrderStatus, RealtimeAlert, UserRole, RiderLiveTelemetry } from '../types';
import { soundEffects } from '../utils/soundEffects';

type RealtimeListener = (alert: RealtimeAlert) => void;

class RealtimeEventService {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<RealtimeListener> = new Set();
  private pollIntervalId: any = null;
  private lastKnownOrderStatuses: Map<string, OrderStatus> = new Map();
  private lastKnownOrderCount: number = 0;
  private isPollingActive: boolean = false;
  private lastPolledAt: Date = new Date();

  constructor() {
    // Setup BroadcastChannel for true cross-tab WebSocket-style communication
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('bhojj_realtime_events');
        this.channel.onmessage = (event) => {
          if (event.data && event.data.type) {
            this.handleIncomingBroadcast(event.data);
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel setup error', e);
      }
    }

    // Setup window storage listener as fallback for cross-tab sync
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === 'bhojj_realtime_event_signal' && e.newValue) {
          try {
            const data = JSON.parse(e.newValue);
            this.handleIncomingBroadcast(data);
          } catch (err) {
            // ignore
          }
        }
      });
    }
  }

  private handleIncomingBroadcast(alert: RealtimeAlert) {
    // Play appropriate sound
    if (alert.type === 'new_order') {
      soundEffects.playNewOrderAlert();
    } else if (alert.type === 'delivery_update' || alert.type === 'rider_assigned') {
      soundEffects.playDeliveryStatusAlert();
    }

    // Notify all active React listeners
    this.notifyListeners(alert);
  }

  private notifyListeners(alert: RealtimeAlert) {
    this.listeners.forEach(fn => {
      try {
        fn(alert);
      } catch (e) {
        console.error('Error in realtime listener', e);
      }
    });
  }

  public subscribe(listener: RealtimeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public broadcastAlert(alert: RealtimeAlert) {
    // Play local audio
    if (alert.type === 'new_order') {
      soundEffects.playNewOrderAlert();
    } else if (alert.type === 'delivery_update' || alert.type === 'rider_assigned') {
      soundEffects.playDeliveryStatusAlert();
    }

    // Notify local in-memory listeners
    this.notifyListeners(alert);

    // Broadcast across other browser tabs/windows
    if (this.channel) {
      try {
        this.channel.postMessage(alert);
      } catch (e) {
        // ignore
      }
    }

    // Storage fallback for tabs without BroadcastChannel
    try {
      localStorage.setItem('bhojj_realtime_event_signal', JSON.stringify({
        ...alert,
        _nonce: Date.now()
      }));
    } catch (e) {
      // ignore
    }
  }

  public broadcastRiderLocation(telemetry: RiderLiveTelemetry) {
    const alert: RealtimeAlert = {
      id: `loc-${telemetry.orderId}-${Date.now()}`,
      type: 'rider_location_update',
      title: 'Rider GPS Update',
      message: `Rider is ${telemetry.remainingDistanceKm.toFixed(1)} km away (${telemetry.speedKmh} km/h)`,
      orderId: telemetry.orderId,
      telemetry,
      timestamp: Date.now(),
      targetRole: 'all',
      soundAlert: false,
    };
    this.broadcastAlert(alert);
  }

  public startPolling(
    getOrders: () => Order[],
    currentRole: UserRole,
    restaurantId?: string,
    customerId?: string
  ) {
    if (this.pollIntervalId) {
      clearInterval(this.pollIntervalId);
    }

    this.isPollingActive = true;
    const initialOrders = getOrders();
    this.lastKnownOrderCount = initialOrders.length;
    this.lastKnownOrderStatuses.clear();
    initialOrders.forEach(o => this.lastKnownOrderStatuses.set(o.id, o.status));

    // Poll every 3 seconds
    this.pollIntervalId = setInterval(() => {
      this.lastPolledAt = new Date();
      const currentOrders = getOrders();

      // 1. Check for incoming new orders (Restaurant perspective)
      if (currentOrders.length > this.lastKnownOrderCount) {
        const newlyAdded = currentOrders.slice(0, currentOrders.length - this.lastKnownOrderCount);
        newlyAdded.forEach(order => {
          if (order.status === 'placed' && (!restaurantId || order.restaurantId === restaurantId)) {
            const alert: RealtimeAlert = {
              id: `alert-${Date.now()}-${order.id}`,
              type: 'new_order',
              title: '🔔 New Incoming Order Placed!',
              message: `Order #${order.id} received: ${order.items.length} items (₹${order.totalAmount}) for ${order.deliveryAddress}`,
              orderId: order.id,
              order,
              timestamp: Date.now(),
              targetRole: 'restaurant',
              targetRestaurantId: order.restaurantId,
              soundAlert: true
            };
            this.broadcastAlert(alert);
          }
        });
        this.lastKnownOrderCount = currentOrders.length;
      }

      // 2. Check for order status transitions (Customer perspective)
      currentOrders.forEach(order => {
        const prevStatus = this.lastKnownOrderStatuses.get(order.id);
        if (prevStatus && prevStatus !== order.status) {
          // Status updated!
          let statusText = '';
          if (order.status === 'accepted') statusText = 'Kitchen accepted your order and started preparations in pure cow ghee.';
          else if (order.status === 'preparing') statusText = 'Chef is preparing your fresh Satvik delicacies.';
          else if (order.status === 'ready_for_pickup') statusText = 'Your order is freshly packed and waiting for delivery partner pickup.';
          else if (order.status === 'out_for_delivery') {
            statusText = `Rider ${order.riderName || 'Partner'} is out for delivery with your meal! Share OTP ${order.otp} on arrival.`;
          } else if (order.status === 'delivered') {
            statusText = `Order #${order.id} has been delivered successfully! Shubh Bhojan!`;
          } else if (order.status === 'cancelled') {
            statusText = `Order #${order.id} was cancelled.`;
          }

          const alert: RealtimeAlert = {
            id: `alert-${Date.now()}-${order.id}`,
            type: 'delivery_update',
            title: `🛵 Delivery Update: Order #${order.id}`,
            message: statusText || `Status changed to ${order.status.replace(/_/g, ' ').toUpperCase()}`,
            orderId: order.id,
            order,
            timestamp: Date.now(),
            targetRole: 'customer',
            targetCustomerId: order.customerId,
            soundAlert: true
          };
          this.broadcastAlert(alert);
        }
        this.lastKnownOrderStatuses.set(order.id, order.status);
      });

    }, 3000);
  }

  public stopPolling() {
    if (this.pollIntervalId) {
      clearInterval(this.pollIntervalId);
      this.pollIntervalId = null;
    }
    this.isPollingActive = false;
  }

  public getLastPolledAt(): Date {
    return this.lastPolledAt;
  }

  public isPolling(): boolean {
    return this.isPollingActive;
  }
}

export const realtimeService = new RealtimeEventService();
