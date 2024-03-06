<template>
  <!-- <pre>{{ JSON.stringify(remoteDict.get("food"), null, 2) }}</pre> -->
  <select>
    <option
      v-for="item in remoteDict.get('food')"
      :key="item.id"
      :value="item.id"
    >
      {{ item.name }}
    </option>
  </select>
</template>
<script setup lang="ts">
import { remoteDict } from "./dict";
</script>
