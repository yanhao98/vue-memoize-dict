# Examples
<!-- https://github.com/yanhao98/vue-memoize-dict/blob/a1f73b60b0b51823ffb3dc5ed4606f3f8d0bb644/packages/playground/src/components/MemoizeDict.vue -->


```vue preview
<template>
  <div>缓存的数据: {{ remoteDict.get("food") }}</div>
  <div>查找字典项: {{ remoteDict.find("food", 1) }}</div>
  <div>回显字典单个值: {{ remoteDict.label("food", 1) }}</div>
  <div>回显字典多个值: {{ remoteDict.labels("food", [1, 2]).join(",") }}</div>
  <button @click="remoteDict.clear()">清空缓存</button>
  <button @click="clickFetch">加载数据（从缓存）</button>
  <button @click="clickLoad">加载数据（更新缓存）</button>
  <button @click="clickDelete">删除指定缓存</button>
<!-- 
  fullLabel
 -->
</template>
<script setup lang="ts">
import { MemoizeDict } from "vue-memoize-dict";

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

type DictData = {
  name: string;
  id: number;
};

const remoteDict = new MemoizeDict<DictData>({
  fieldNames: {
    label: "name",
    value: "id",
    parent: "parent_id",
  },
  config: new Proxy(
    {},
    {
      get: (_, key) => {
        return {
          data: async () => {
            const res = await fetch("./static/food.json");
            return res.json();
          },
        };
      },
    }
  ),
});
</script>
<style>
button{
  margin-top: 20px;
  padding: 10px 20px;
  border-radius: 4px;
  background-color: #409eff;
  color: #fff;
  border: none;
  outline: none;
  cursor: pointer;
  transition: all 0.3s;
}
button:hover{
  background-color: #66b1ff;
}
button+button{
  margin-left: 20px;
}
</style>

```
