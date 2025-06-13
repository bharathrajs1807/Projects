import {
  proxyActivities,
  sleep,
  setHandler,
  condition,
  defineSignal,
} from '@temporalio/workflow';

// Activities interface
const activities = proxyActivities<{
  saveToLocalDB(profile: any): Promise<void>;
  syncToCrudCrud(profile: any): Promise<void>;
}>({
  startToCloseTimeout: '15 seconds',
});

// Define the signal
export const updateProfileSignal = defineSignal<[any]>('updateProfileSignal');

// Main workflow function
export async function updateProfileWorkflow(initialProfile: any): Promise<void> {
  let latestProfile: any = initialProfile;
  let hasUpdate = false;

  // Register signal handler
  setHandler(updateProfileSignal, (newProfile: any) => {
    latestProfile = newProfile;
    hasUpdate = true;
  });

  // First save/sync
  await activities.saveToLocalDB(latestProfile);
  await sleep(10000);
  await activities.syncToCrudCrud(latestProfile);

  // Keep workflow alive and listen for future updates
  while (true) {
    await condition(() => hasUpdate);
    hasUpdate = false;
    await activities.saveToLocalDB(latestProfile);
    await sleep(10000);
    await activities.syncToCrudCrud(latestProfile);
  }
}
