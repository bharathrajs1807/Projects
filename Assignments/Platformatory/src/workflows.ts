import { proxyActivities, sleep } from '@temporalio/workflow';

const activities = proxyActivities<{
  saveToLocalDB(profile: any): Promise<void>;
  syncToCrudCrud(profile: any): Promise<void>;
}>({ startToCloseTimeout: '15 seconds' });

export async function updateProfileWorkflow(profile: any) {
  await activities.saveToLocalDB(profile);
  await sleep(10000); // 10-second delay
  await activities.syncToCrudCrud(profile);
}
