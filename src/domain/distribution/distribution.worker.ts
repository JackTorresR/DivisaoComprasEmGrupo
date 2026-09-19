import { calculateDistribution } from './calculateDistribution';
import type { WorkerRequest, WorkerResponse } from './workerProtocol';

const respond = (response: WorkerResponse) => self.postMessage(response);

self.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const { people, products, bindings } = event.data;
  const assignments = calculateDistribution(people, products, bindings, (progress) =>
    respond({ type: 'progress', progress }),
  );
  respond({ type: 'done', assignments });
};
