<script setup lang="ts">
import UseMemoizeComp from "./components/UseMemoizeComp.vue";
import MemoizeDict from "./components/MemoizeDict.vue";
</script>

<template>
  <div>
    <!-- <UseMemoizeComp /> -->
    <MemoizeDict />
  </div>
</template>

<style>
p {
  border: 1px solid pink;
  padding: 10px;
}

button+button {
  margin-left: 10px;
}
</style>
