import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../shared/interface/user';

const parseMessage = function (message: string) {
  try {
    const parsedMessage = JSON.parse(message);
    return parsedMessage;
  } catch (error) {
    return message.toString();
  }
};
@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket;
  public messages: string[] = [];

  constructor() { }

  connect(token?: string): void {
    this.socket = new WebSocket(`${environment.api.webSocketUrl}?userToken=${token}`);

    this.socket.onopen = () => {
      console.log('WebSocket connection established.');
    };

    this.socket.onmessage = (event: MessageEvent) => {
      const message = event.data;
      console.log('Received message:', parseMessage(message));
      this.messages.push(message);
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  send(message: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error('WebSocket connection is not open.');
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}