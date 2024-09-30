import client, { Connection, Channel } from "amqplib";
import UserConsumer from "../v1/user/user.consumer";
import AuthConsumer from "../v1/auth/auth.consumer";
import { HelperPromise } from "../utils/helperPromise";

export enum RMQ_QUEUES {
  MESSAGE_QUEUE = "MESSAGE_QUEUE",
  USERS_QUEUE = "USERS_QUEUE",
  AUTH_QUEUE = "AUTH_QUEUE",
}

export type HandlerCB = (msg: string) => any;

export type msgType = { action: string; payload: Record<string, any> };

export const QUEUES = Object.keys(RMQ_QUEUES);

class RabbitMQConnection {
  connection!: Connection;
  channel!: Channel;
  private connected!: Boolean;

  private consumers = new HelperPromise();

  async connect() {
    if (this.connected && this.channel) return;
    else this.connected = true;

    try {
      this.connection = await client.connect(
        `amqp://${process.env.RMQ_USER}:${process.env.RMQ_PASSWORD}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}`
      );
      this.channel = await this.connection.createChannel();
      this.execConsumers();
    } catch (error) {
      throw error;
    }
  }

  // Sender (Producer)
  async sendToQueue(queue: string, message: msgType) {
    try {
      if (!this.channel) {
        await this.connect();
      }

      this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
      console.log(`Sent the notification to consumer`);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private execConsumers() {
    this.consumers.register(UserConsumer);
    this.consumers.register(AuthConsumer);
    this.consumers.executeAll();
  }
}

const mqConnection = new RabbitMQConnection();

export default mqConnection;
