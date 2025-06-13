import {
  proxyActivities,
  sleep,
  setHandler,
  condition,
  defineSignal,
  RetryPolicy,
} from '@temporalio/workflow';

// Define retry policy for activities
const retryPolicy: RetryPolicy = {
  initialInterval: '1 second',
  maximumInterval: '10 seconds',
  backoffCoefficient: 2,
  maximumAttempts: 3,
};

// Activities interface
const activities = proxyActivities<{
  saveToLocalDB(profile: any): Promise<void>;
  syncToCrudCrud(profile: any): Promise<void>;
}>({
  startToCloseTimeout: '15 seconds',
  retry: retryPolicy,
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
  try {
    await activities.saveToLocalDB(latestProfile);
    await sleep(10000); // Wait 10 seconds before syncing
    await activities.syncToCrudCrud(latestProfile);
  } catch (error) {
    console.error('Initial sync failed:', error);
    // Continue workflow even if initial sync fails
  }

  // Keep workflow alive and listen for future updates
  while (true) {
    try {
      await condition(() => hasUpdate);
      hasUpdate = false;
      
      await activities.saveToLocalDB(latestProfile);
      await sleep(10000); // Wait 10 seconds before syncing
      await activities.syncToCrudCrud(latestProfile);
    } catch (error) {
      console.error('Update sync failed:', error);
      // Continue workflow even if update sync fails
    }
  }
}
