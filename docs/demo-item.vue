<template>
  {{ remoteDict.find("food", 1) }}
</template>
<script setup lang="ts">
import { remoteDict } from "./dict";
</script>
