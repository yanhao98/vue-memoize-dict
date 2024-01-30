<template>
  {{ remoteDict.labels("food", [1, 2]).join(",") }}
</template>
<script setup lang="ts">
import { remoteDict } from "./dict";
</script>
