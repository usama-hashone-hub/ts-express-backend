import mqConnection, { HandlerCB, RMQ_QUEUES } from "../../rabbitmq";
import { FunctionCaller } from "../../utils/functionCaller";
import userService from "./user.service";

const functionCaller = new FunctionCaller();

functionCaller.registerFunction("testFunc", userService.testFunc);

const UserConsumer = async () => {
  await mqConnection.channel.assertQueue(RMQ_QUEUES.USERS_QUEUE, {
    durable: true,
  });

  console.log(`✅ Listening for Messags On Queue: ${RMQ_QUEUES.USERS_QUEUE}`);

  mqConnection.channel.consume(
    RMQ_QUEUES.USERS_QUEUE,
    (msg) => {
      {
        if (!msg) {
          return console.error(`Invalid incoming message`);
        }

        const content = JSON.parse(msg?.content?.toString());

        functionCaller.callFunction(content.action, content.payload);
        console.log("Received data in UserConsumer", msg?.content?.toString());
        mqConnection.channel.ack(msg);
      }
    },
    {
      noAck: false,
    }
  );
};

export default UserConsumer;
