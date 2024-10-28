import { describe, test } from 'vitest';
import { createMemoizeDict, MemoizeDict } from '.';

const mockData = Array.from({ length: 1000 }, (_, i) => ({ label: `Item ${i}`, value: i, parent: i - 1 }));
const options = {
  config: new Proxy({}, {
    get: (_, key: string) => ({
      data: async () => (JSON.parse(JSON.stringify(mockData))),
    }),
  }),
};
describe('Memory test: createMemoizeDict', () => {
  const memoizeDict = createMemoizeDict(options);

  test('check memory usage', async () => {
    console.debug(`process.pid :>> `, process.pid);
    const startMemory = process.memoryUsage().heapUsed;
    console.debug('Memory used:', `start: ${startMemory / 1024 / 1024} MB`);

    for (let i = 0; i < 101; i++) {
      memoizeDict('test' + i).data;
    }
    while (!memoizeDict('test99').data) {
      await new Promise((resolve) => setTimeout(resolve, 1));
    }
    console.debug(`!!memoizeDict('test88').data :>> `, !!memoizeDict('test88').data);
    console.debug('Memory used:', ` diff: ${(process.memoryUsage().heapUsed - startMemory) / 1024 / 1024} MB`);
  });
});



describe('Memory test: MemoizeDict', () => {
  const memoizeDict = new MemoizeDict(options);

  test('check memory usage', async () => {
    console.debug(`process.pid :>> `, process.pid);
    const startMemory = process.memoryUsage().heapUsed;
    console.debug('Memory used:', `start: ${startMemory / 1024 / 1024} MB`);

    for (let i = 0; i < 101; i++) {
      memoizeDict.get('test' + i);
    }
    while (!memoizeDict.get('test99')) {
      await new Promise((resolve) => setTimeout(resolve, 1));
    }
    console.debug(`!!memoizeDict.get('test88') :>> `, !!memoizeDict.get('test88'));
    console.debug('Memory used:', ` diff: ${(process.memoryUsage().heapUsed - startMemory) / 1024 / 1024} MB`);
  });
});
