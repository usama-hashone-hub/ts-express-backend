import { Processor, Queue, Worker } from "bullmq";
import { CustomQueueOptions, CustomWorkerOptions } from "./utils/queueOptions";

export enum JobType {
  PROCESS_PAYMENT = "process-payment",
  DEFAULT_USER = "DEFAULT_USER",
}

export enum Queues {
  DEFAULT = "default",
  USER_QUEUE = "USER_QUEUE",
}

type QueueReturn = {
  queue: Queue;
  worker: Worker;
};

export function QueueServer(name: string, processor: Processor): QueueReturn {
  const queue = new Queue(name, CustomQueueOptions);
  const worker = new Worker(name, processor, CustomWorkerOptions);

  return { queue, worker };
}
