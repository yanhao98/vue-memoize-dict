<template>
  <div>缓存的数据: {{ remoteDict.get("food") }}</div>
  <div>查找字典项: {{ remoteDict.find("food", 1) }}</div>
  <div>回显字典单个值: {{ remoteDict.label("food", 1) }}</div>
  <!-- <div>回显树形字典单个值: {{ remoteDict.treeLabel("food", 1) }}</div> -->
  <div>回显字典多个值: {{ remoteDict.labels("food", [1, 2]).join(",") }}</div>
  <div class="btns">
    <button @click="remoteDict.clear()">清空缓存</button>
    <button @click="clickFetch">加载数据（从缓存）</button>
    <button @click="clickLoad">加载数据（更新缓存）</button>
    <button @click="clickDelete">删除指定缓存</button>
  </div>
</template>

<script setup lang="ts">
import { remoteDict } from "./dict";

function clickFetch() {
  remoteDict.fetch("food").then((res) => {
    console.log(res);
  });
}

function clickLoad() {
  remoteDict.load("food").then((res) => {
    console.log(res);
  });
}

function clickDelete() {
  remoteDict.delete("food");
}
</script>

<style scoped>
button {
  padding: 10px 20px;
  border-radius: 4px;
  background-color: #409eff;
  color: #fff;
  border: none;
  outline: none;
  cursor: pointer;
  transition: all 0.3s;
}
button:hover {
  background-color: #66b1ff;
}
.btns {
  display: flex;
  gap: 16px;
}
</style>
