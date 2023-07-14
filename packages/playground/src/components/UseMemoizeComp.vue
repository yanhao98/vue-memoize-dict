<template>
  <div>
    <h1>UseMemoizeComp</h1>
    <button @click="onClear">.clear</button>
    <p>{{ data }}</p>
    <ul>
      <li v-for="item in data">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { asyncComputed, useMemoize } from "@vueuse/core";
import { onMounted } from "vue";

const getData = useMemoize(async (...args) /* : Promise<Object> */ => {
  const [dictName, otherP] = args;
  console.debug(`🔔 ${dictName} data fn called, args :>> `, args);
  const timestamp = Date.now();
  await new Promise((r) => setTimeout(r, 1000));
  return Array.from({ length: 2 }).map((_, index) => ({
    id: index,
    timestamp,
    otherP,
  }));
});

let dictName = `dict1`;
const data = asyncComputed(() => getData(dictName));
console.debug(`data.value :>> `, data.value);

setTimeout(() => {
  console.debug(`data :>> `, data);
  console.debug(`data.value :>> `, data.value);
}, 1000);

function onClear() {
  getData.clear();
}

onMounted(async () => {
  console.debug("UseMemoizeComp onMounted");
  // console.debug(`await getData(${dictName}) :>> `, await getData(dictName));
  // console.debug(`await getData(${dictName}, "params") :>> `, await getData(dictName, "params"));
  // console.debug(`await getData(${dictName}) :>> `, await getData(dictName));

  // console.debug(`await getData.load(${dictName}) :>> `, await getData.load(dictName));

  // console.debug(`await getData(${dictName}) :>> `, await getData(dictName));

  // console.debug(`getData.delete(${dictName}) :>> `, getData.delete(dictName));
  // console.debug(`await getData(${dictName}) :>> `, await getData(dictName));

  // console.debug(`getData.clear() :>> `, getData.clear());
  // console.debug(`await getData(${dictName}) :>> `, await getData(dictName));
});
</script>

<style scoped></style>
