---
# sidebar: auto
---
# vue3和vue2的对比
## vue3对Web应用性能的改进
原文地址：[vue3对Web应用性能的改进](https://mp.weixin.qq.com/s/g5S4N78lUl4jPFsqnYLB4g)

<!-- <font color=#000 size=5>总结：</font> -->

## vue3新功能
### 组件api
~~~ html
<template>
  <button @click="increment">
    Count is: {{ count }}, double is {{ double }}, click to increment.
  </button>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const double = computed(() => count.value * 2)

    function increment() {
      count.value++
    }

    onMounted(() => console.log('component mounted!'))

    return {
      count,
      double,
      increment
    }
  }
}
</script>
~~~