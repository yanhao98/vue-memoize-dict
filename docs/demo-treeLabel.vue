<template>
  {{ remoteDict.treeLabel("food", 12) }}
  <br />
  {{ remoteDict.treeLabel("food", 11).replace(/-/g, ",") }}
</template>
<script setup lang="ts">
import { remoteDict } from "./dict";
</script>
