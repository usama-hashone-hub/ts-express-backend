import { Job, Processor, Queue, Worker } from "bullmq";
import {
  CustomQueueOptions,
  CustomWorkerOptions,
} from "../../../utils/queueOptions";
import { BullMQAdapter } from "bull-board/bullMQAdapter";

export enum JobType {
  PROCESS_PAYMENT = "process-payment",
  DEFAULT_USER = "DEFAULT_USER",
}

export enum Queues {
  DEFAULT = "default",
  USER_QUEUE = "USER_QUEUE",
}

const processor: Processor = async (job: Job, val: any) => {
  console.log("Need to call job funcion", job.name);
};

const userQueue = new Queue(Queues.USER_QUEUE, CustomQueueOptions);

const worker = new Worker(Queues.USER_QUEUE, processor, CustomWorkerOptions);

worker.on("completed", (job: Job, value) => {
  console.log(
    `[DEFAULT QUEUE] Completed job with data\n
          Data: ${job.asJSON().data}\n
          ID: ${job.id}\n
          Value: ${value}
        `
  );
});

worker.on("failed", (job: Job | undefined, value) => {
  console.log(
    `[DEFAULT QUEUE] Failed job with data\n
          Data: ${job?.asJSON().data}\n
          ID: ${job?.id}\n
          Value: ${value}
        `
  );
});

export default userQueue;
export const UserQueueAdapter = new BullMQAdapter(userQueue);
