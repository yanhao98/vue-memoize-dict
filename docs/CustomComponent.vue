<template>
  <div>这是一个自定义组件</div>
</template>

<script setup>
import { onMounted } from "vue";
onMounted(() => {
  console.log("自定义组件挂载了");
});
</script>
