<template>
  {{ remoteDict.labels("food", [10, 20]).join(",") }}
</template>
<script setup lang="ts">
import { remoteDict } from "./dict";
</script>
