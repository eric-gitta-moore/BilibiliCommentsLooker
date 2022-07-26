<script setup lang="ts">
import { RouterView } from "vue-router";
import { onMounted, provide, ref } from "vue";
import { throttle } from "lodash";

const windowRect = ref({
  height: document.body.offsetHeight,
  width: document.body.offsetWidth,
});
onMounted(() => {
  windowRect.value.height = document.body.offsetHeight;
  windowRect.value.width = document.body.offsetWidth;
  let handleWindowOnResize = throttle(() => {
    windowRect.value.height = document.body.offsetHeight;
    windowRect.value.width = document.body.offsetWidth;
  }, 100);
  window.onresize = (e) => handleWindowOnResize();
});
provide("windowRect", windowRect);
</script>

<template>
    <div class="app-container">
      <RouterView />
    </div>
</template>

<style scoped lang="scss">
.app-container {
  margin: 0 16px 0 10px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: hidden;
}
</style>
