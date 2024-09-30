import { Job, Processor } from "bullmq";
import { BullMQAdapter } from "bull-board/bullMQAdapter";
import { Queues, QueueServer } from "../bull";

const processor: Processor = async (job: Job, val: any) => {
  console.log("Need to call job funcion", job.name);
};

export const userQueue = QueueServer(Queues.USER_QUEUE, processor);

userQueue.worker.on("completed", (job: Job, value) => {
  console.log(
    `[DEFAULT QUEUE] Completed job with data\n
          Data: ${job.asJSON().data}\n
          ID: ${job.id}\n
          Value: ${value}
        `
  );
});

userQueue.worker.on("failed", (job: Job | undefined, value) => {
  console.log(
    `[DEFAULT QUEUE] Failed job with data\n
          Data: ${job?.asJSON().data}\n
          ID: ${job?.id}\n
          Value: ${value}
        `
  );
});

export default userQueue.queue;
export const UserQueueAdapter = new BullMQAdapter(userQueue.queue);
