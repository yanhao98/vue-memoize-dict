<script setup lang="ts">
import MemoizeDict from "./components/MemoizeDict.vue";
</script>

<template>
  <div>
    <MemoizeDict />
    <div>
      <div style="padding:8px; border:1px solid orange;">
        <div>{{ $remoteDict.get('dict-name-1') }}</div>
        <div>{{ $remoteDict.get('dict-name-2') }}</div>
      </div>
    </div>
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
