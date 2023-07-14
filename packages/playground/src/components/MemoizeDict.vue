<template>
  <div>
    <h1>MemoizeDict</h1>
    <button @click="onClear">.clear</button>
    <div style="padding:8px; border:1px solid blue;">

      <hr>
      <button @click="onLoad">.load</button>
      <button @click="onFetch">.fetch</button>
      <p>
      <div>{{ `channel data function call count: ${channelCount}` }}</div>
      </p>
      <p>
      <ul>
        <li v-for="item in localDict.get(`channel`)">
          {{ `id: ${item.id}, name: ${item.name}` }}
        </li>
      </ul>
      </p>
      <p>{{ localDict.find('channel', 1) }}</p>
      <p>{{ localDict.label('channel', 1) }}</p>
    </div>

    <hr>
    <div style="padding:8px; border:1px solid darkkhaki;">
      <button @click="localDict.delete('sex')">.delete</button>
      <div>{{ `sex data function call count: ${sexCount}` }}</div>
      <p>{{ localDict.get(`sex`) }}</p>
    </div>

    <hr>
    <div style="padding:8px; border:1px solid darkkhaki;">
      {{ remoteDict.get('dict-name') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

const channelCount = ref(0);
const sexCount = ref(0);

const data1 = [
  { name: "苹果", id: 1 },
  { name: "华为", id: 2 },
];
const data2 = [
  { name: "小米", id: 3 },
  { name: "三星", id: 4 },
  { name: "OPPO", id: 5 },
];

type DictData = {
  name: string;
  id: number;
};

const localDict = new MemoizeDict<DictData>({
  fieldNames: {
    label: 'name',
    value: 'id'
  },
  config: {
    channel: {
      data: () => {
        channelCount.value++;
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(channelCount.value % 2 === 1 ? data1 : data2);
          }, 300);
        });
      },
    },
    sex: {
      data: async () => {
        sexCount.value++;
        return [
          { name: "男", id: 1 },
          { name: "女", id: 2 },
        ];
      },
    },
  },
});

import { MemoizeDict, type DatasetConfig } from "vue-memoize-dict";

const remoteDict = new MemoizeDict<any>({
  fieldNames: {
    // label: '',
    // value: ''
  },
  config: new Proxy(
    {},
    {
      get: (target, key): DatasetConfig => {
        return {
          data: async () => {
            await new Promise(r => setTimeout(r, 1000));
            return Array.from({ length: 2 }).map((_, index) => ({
              label: `${String(key)} ${index}`,
              value: `${index}`.padStart(3, '0'),
            }));
          },
        }
      },
    }
  )
});

// const data = localDict.get(`channel`);
// console.debug(`data :>> `, data);

onMounted(() => {
  console.debug(`MemoizeDict onMounted`);
});

async function onLoad() {
  console.group(`onLoad`);
  console.time(`onLoad`);
  const data = await localDict.load(`channel`);
  console.debug(`data :>> `, data);
  console.timeEnd(`onLoad`);
  console.groupEnd();
}

async function onFetch() {
  console.group(`onFetch`);
  console.time(`onFetch`);
  const data = await localDict.fetch(`channel`);
  console.debug(`data :>> `, data);
  console.timeEnd(`onFetch`);
  console.groupEnd();
}

function onClear() {
  localDict.clear();
}
</script>

<style scoped></style>
