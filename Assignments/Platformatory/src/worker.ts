import { Worker } from '@temporalio/worker';
import * as activities from './activities';

async function runWorker() {
  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflows'),
    activities,
    taskQueue: 'profile-task-queue',
  });
  await worker.run();
}

runWorker().catch(err => {
  console.error(err);
  process.exit(1);
});
