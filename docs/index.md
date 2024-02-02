# vue-memoize-dict

Vue 字典缓存，支持 Vue2 和 Vue3。
[[toc]]

## 安装  {#install}
```sh [pnpm]
$ pnpm add vue-memoize-dict
```

## 新建字典对象 {#create-dict}
dict.ts:

<<< @/dict.ts{18-21}

## API

### get()
:::preview
demo-preview=./demo-get.vue
:::

### item()
:::preview
demo-preview=./demo-item.vue
:::

### label()
:::preview
demo-preview=./demo-label.vue
:::

### treeLabel()
分隔符暂时是 `-`
:::preview
demo-preview=./demo-treeLabel.vue
:::


### labels()
:::preview
demo-preview=./demo-labels.vue
:::

### fetch()
```ts
remoteDict.fetch("food").then((res) => {
  console.log(res);
});
```

### load()
```ts
remoteDict.load("food").then((res) => {
  console.log(res);
});
```

### delete()
```ts
remoteDict.delete("food");
```

### clear()
```ts
remoteDict.clear();
```
