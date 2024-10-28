import { describe, test } from 'vitest';
import { MemoizeDict } from '.';

describe('Memory test', () => {
  const mockData = Array.from({ length: 1000 }, (_, i) => ({ label: `Item ${i}`, value: i, parent: i - 1 }));
  const memoizeDict = new MemoizeDict({
    config: new Proxy({}, {
      get: (_, key: string) => ({
        data: async () => (JSON.parse(JSON.stringify(mockData))),
      }),
    }),
  });

  test('should check memory usage', async () => {
    const startMemory = process.memoryUsage().heapUsed;
    console.debug('Memory used:', `start: ${startMemory / 1024 / 1024} MB`);

    for (let i = 0; i < 100; i++) {
      memoizeDict.get('test' + i);
    }
    while (!memoizeDict.get('test99')) {
      await new Promise((resolve) => setTimeout(resolve, 1));
    }
    console.debug(`!!memoizeDict.get('test88') :>> `, !!memoizeDict.get('test88'));
    console.debug('Memory used:', ` diff: ${(process.memoryUsage().heapUsed - startMemory) / 1024 / 1024} MB`);
  });
});
