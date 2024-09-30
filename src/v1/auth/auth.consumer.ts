import mqConnection, { HandlerCB, RMQ_QUEUES } from "../../rabbitmq";
import { FunctionCaller } from "../../utils/functionCaller";
import authService from "./auth.service";

const functionCaller = new FunctionCaller();

functionCaller.registerFunction("testFunc", authService.testFunc);

const AuthConsumer = async () => {
  await mqConnection.channel.assertQueue(RMQ_QUEUES.AUTH_QUEUE, {
    durable: true,
  });

  console.log(`✅ Listening for Messags On Queue: ${RMQ_QUEUES.AUTH_QUEUE}`);

  mqConnection.channel.consume(
    RMQ_QUEUES.AUTH_QUEUE,
    (msg) => {
      {
        if (!msg) {
          return console.error(`Invalid incoming message`);
        }

        const content = JSON.parse(msg?.content?.toString());

        functionCaller.callFunction(content.action, content.payload);
        console.log("Received data in AuthConsumer", msg?.content?.toString());
        mqConnection.channel.ack(msg);
      }
    },
    {
      noAck: false,
    }
  );
};

export default AuthConsumer;
