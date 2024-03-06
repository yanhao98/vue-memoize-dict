<template>
  <TreeComp :data="remoteDict.tree('food')" />
  <button @click="showAlert(remoteDict.tree('food'))">
    Show Tree
  </button>
</template>
<script setup lang="ts">
import { remoteDict } from "./dict";
import { defineComponent, h } from "vue";

function showAlert(data: any) {
  alert(JSON.stringify(data, null, 4));
}

const TreeComp = defineComponent({
  props: {
    data: {
      type: Array as () => ReturnType<typeof remoteDict.tree>,
      required: true,
    },
  },
  setup(props) {
    function renderItem(): any {
      return props.data.map((item) => {
        return h("li", [
          h("span", item.name),
          item.children && h(TreeComp, { data: item.children }),
        ]);
      });
    }

    return () => {
      return h("ul", renderItem());
    };
  },
});
</script>
