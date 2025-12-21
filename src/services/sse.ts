import { ErrorHandler, MessageHandler } from '../types';

class SSEService {
  private source: EventSource | null = null;
  private messageHandlers = new Set<MessageHandler>();
  private errorHandlers = new Set<ErrorHandler>();
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private currentUrl = '';

  private readonly MAX_ATTEMPTS = 5;
  private readonly BASE_DELAY = 1000;

  connect(url: string): void {
    if (this.isConnected()) return;

    this.currentUrl = url;
    this.cleanup();

    this.source = new EventSource(url, { withCredentials: true });

    this.source.onopen = () => {
      this.reconnectAttempts = 0;
    };

    this.source.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.messageHandlers.forEach((h) => h(message));
    };

    this.source.onerror = () => {
      const error = new Error('SSE connection failed');
      this.errorHandlers.forEach((h) => h(error));
      this.handleReconnect();
    };
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.MAX_ATTEMPTS) {
      this.disconnect();
      return;
    }

    const delay = this.BASE_DELAY * Math.pow(2, this.reconnectAttempts);
    this.reconnectAttempts++;

    this.reconnectTimer = setTimeout(() => {
      this.connect(this.currentUrl);
    }, delay);
  }

  private cleanup(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.source) {
      this.source.close();
      this.source = null;
    }
  }

  disconnect(): void {
    this.cleanup();
    this.messageHandlers.clear();
    this.errorHandlers.clear();
  }

  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  onError(handler: ErrorHandler): () => void {
    this.errorHandlers.add(handler);
    return () => this.errorHandlers.delete(handler);
  }

  isConnected(): boolean {
    return this.source?.readyState === EventSource.OPEN;
  }
}

export const sseService = new SSEService();
