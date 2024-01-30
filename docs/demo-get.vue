<template>
  <ul>
    <li v-for="item in remoteDict.get('food')" :key="item.id">
      {{ item }}
    </li>
  </ul>
</template>
<script setup lang="ts">
import { remoteDict } from "./dict";
</script>
