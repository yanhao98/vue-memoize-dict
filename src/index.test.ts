import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createMemoizeDict, MemoizeDict } from '.';

const mockData = [
  { label: 'Item 1', value: 10, parent: 0 },
  { label: 'Item 1-1', value: 11, parent: 10 },
  { label: 'Item 1-1-1', value: 111, parent: 11 },
  { label: 'Item 999', value: 999, parent: 998 },// 没有父级
  { label: 'Item 888', value: 888, parent: 888 },// 父级等于自己(这种应该是不合理的)
]
const mockDataTree = [
  {
    label: 'Item 1',
    value: 10,
    parent: 0,
    children: [
      {
        label: 'Item 1-1',
        value: 11,
        parent: 10,
        children: [
          {
            label: 'Item 1-1-1',
            value: 111,
            parent: 11,
            children: []
          }
        ]
      }
    ]
  },
  // {
  //   label: 'Item 999',
  //   value: 999,
  //   parent: 998,
  //   children: []
  // },
  // {
  //   label: 'Item 888',
  //   value: 888,
  //   parent: 888,
  //   children: []
  // }
]

describe('MemoizeDict', () => {
  type DictData = {
    id: number;
    label: string;
    parent: number;
  };

  const mockData = [
    { id: 1, label: 'Item 1', parent: 0 },
    { id: 2, label: 'Item 2', parent: 1 },
    { id: 3, label: 'Item 3', parent: 2 },
  ];

  const dataFunc = vi.fn();

  beforeEach(() => {
    dataFunc.mockReset();
    dataFunc.mockImplementation((dictName: string) => {
      return new Promise<DictData[]>((resolve) => {
        setTimeout(() => {
          resolve(mockData);
        }, 50);
      });
    })
  });

  const memoizeDict = new MemoizeDict({
    fieldNames: {
      label: 'label',
      value: 'id',
      parent: 'parent',
    },
    config: new Proxy({},
      {
        get: (_, key: string) => ({
          data: async () => {
            return dataFunc(key);
          },
        }),
      }
    ),
  });

  it('get()', async () => {
    expect(memoizeDict.get('test')).toBeUndefined();
    expect(dataFunc).toHaveBeenCalledWith('test');
    expect(dataFunc).toBeCalledTimes(1);
    await new Promise((resolve) => setTimeout(resolve, 51));
    expect(memoizeDict.get('test')).toBe(mockData);
    expect(dataFunc).toBeCalledTimes(1);
  });


  it('tree()', async () => {
    expect(
      memoizeDict.tree('test')
    ).toEqual([
      {
        id: 1,
        label: 'Item 1',
        parent: 0,
        children: [
          {
            id: 2,
            label: 'Item 2',
            parent: 1,
            children: [
              {
                id: 3,
                label: 'Item 3',
                parent: 2,
                children: []
              }
            ]
          }
        ]
      }
    ]);
    expect(dataFunc).toBeCalledTimes(0);
  });


  it('item()', async () => {
    expect(
      memoizeDict.item('test', 2)
    ).toEqual({ id: 2, label: 'Item 2', parent: 1 });
    expect(dataFunc).toBeCalledTimes(0);
  });


  it('label()', async () => {
    expect(
      memoizeDict.label('test', 2)
    ).toBe('Item 2');
    expect(dataFunc).toBeCalledTimes(0);
  });

  it('treeLabel()', async () => {
    expect(
      memoizeDict.treeLabel('test', 3)
    ).toBe('Item 1-Item 2-Item 3');
    expect(dataFunc).toBeCalledTimes(0);
  });

  it('labels()', async () => {
    expect(
      memoizeDict.labels('test', [2, 3])
    ).toEqual(['Item 2', 'Item 3']);
    expect(dataFunc).toBeCalledTimes(0);
  });



  it('fetch()', async () => {
    expect(await memoizeDict.fetch('test')).toBe(mockData);
    expect(dataFunc).toBeCalledTimes(0);
  });

  it('load()', async () => {
    expect(await memoizeDict.load('test')).toBe(mockData);
    expect(dataFunc).toBeCalledTimes(1);
  });

  it('clear()', async () => {
    memoizeDict.get('test-1');
    memoizeDict.get('test-2');
    await new Promise((resolve) => setTimeout(resolve, 101));
    expect(memoizeDict.get('test-1')).toBe(mockData);
    expect(memoizeDict.get('test-2')).toBe(mockData);
    expect(dataFunc).toBeCalledTimes(2);
    memoizeDict.clear();
    expect(dataFunc).toBeCalledTimes(2);
    expect(memoizeDict.get('test-1')).toBeUndefined();
    expect(memoizeDict.get('test-2')).toBeUndefined();
    expect(dataFunc).toBeCalledTimes(4);
  });


  it('delete()', async () => {
    memoizeDict.delete('test')
    expect(memoizeDict.get('test')).toBeUndefined();
    expect(dataFunc).toBeCalledTimes(1);
    await new Promise((resolve) => setTimeout(resolve, 101));
    expect(memoizeDict.get('test')).toBe(mockData);
  });
});



describe('特殊情况的处理', () => {
  const mockData = [
    { label: 'Item 1', value: 1, parent: 0 },
    { label: 'Item 2', value: 2, parent: 1 },
    { label: 'Item 3', value: 3, parent: 1 },
    { label: 'Item 999', value: 999, parent: 998 },
    { label: 'Item 888', value: 888, parent: 888 },
  ]
  const memoizeDict = new MemoizeDict({
    // fieldNames:{
    //   label: 'label',
    //   value: 'value',
    //   parent: 'parent',
    // },
    config: {
      test: {
        data: () => mockData
      },
    }
  });

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('data 不是异步函数', async () => {
    memoizeDict.tree('test');
    await new Promise((resolve) => setTimeout(resolve, 101));
    expect(memoizeDict.get('test')).toEqual(mockData);
  });

  it('fieldNames 未定义', async () => {
    expect(memoizeDict.treeLabel('test', 2)).toBe('Item 1-Item 2');
  });

  it('dictName 不存在', async () => {
    expect(() => memoizeDict.fetch('test-1')).toThrowError('config not found: test-1');
  });

  it('label() 传的值不存在', async () => {
    expect(memoizeDict.label('test', 99)).toBe('99');
  });

  it('label() 不传值', async () => {
    expect(memoizeDict.label('test', undefined as any)).toBe('');
  });

  it('labels() 不传值', async () => {
    expect(memoizeDict.labels('test', undefined as any)).toEqual([]);
  });

  it('treeLabel() 不传值', async () => {
    expect(memoizeDict.treeLabel('test', undefined as any)).toBe('');
  });


  it('treeLabel() 传的值父级不存在', async () => {
    await memoizeDict.fetch('test');
    expect(memoizeDict.treeLabel('test', 999)).toBe('Item 999');
  })

  it('treeLabel() 的item的parent等于自己', async () => {
    await memoizeDict.fetch('test');
    expect(memoizeDict.treeLabel('test', 888)).toBe('Item 888');
  });

  it('treeLabel() 传的值不存在', async () => {
    expect(memoizeDict.treeLabel('test', 99)).toBe('99');
  });

  it('values() 不传数组', async () => {
    expect(memoizeDict.labels('test', 2 as any)).toEqual(2);
    expect(console.error).toBeCalledTimes(1);
  });
});


describe('createMemoizeDict', () => {
  it('createMemoizeDict usage', async () => {
    const dataFunc = vi.fn();
    dataFunc.mockImplementation(async (dictName: string) => {
      await new Promise((resolve) => setTimeout(resolve, 33));
      return mockData;
    })

    const memoizeDict = createMemoizeDict<{ label: string; value: number; parent: number; }>({
      config: new Proxy({}, {
        get: (_, key: string) => ({
          data: async () => {
            return dataFunc(key);
          },
        }),
      }),
    })

    while (!memoizeDict('test-create').data) {
      await new Promise((resolve) => setTimeout(resolve, 1));
    }
    expect(memoizeDict('test-create').data).toBe(mockData);
    expect(memoizeDict('test-create').tree).toEqual(mockDataTree);
    expect(await memoizeDict('test-create').fetch()).toBe(mockData);// 不会再次调用 dataFunc，也就是从缓存中取
    expect(memoizeDict('test-create').itemByValue(11)).toBe(mockData[1]);
    expect(memoizeDict('test-create').labelByValue(11)).toBe('Item 1-1');
    expect(memoizeDict('test-create').labelsByValues([11, 111])).toEqual(['Item 1-1', 'Item 1-1-1']);
    expect(memoizeDict('test-create').treeLabelByValue(111)).toBe('Item 1-Item 1-1-Item 1-1-1');

    expect(await memoizeDict('test-create').load()).toBe(mockData);// 会再次调用 dataFunc，并更新缓存
    expect(memoizeDict('test-create').data).toBeUndefined();
    expect(dataFunc).toBeCalledTimes(2);
  })
})
