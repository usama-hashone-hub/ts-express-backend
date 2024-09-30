import { QueueOptions } from "bullmq";

const CustomQueueOptions: QueueOptions = {
  defaultJobOptions: {
    removeOnComplete: false,
    removeOnFail: false,
  },
  connection: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
};

const CustomWorkerOptions = {
  connection: CustomQueueOptions.connection,
};

export { CustomQueueOptions, CustomWorkerOptions };
