<script setup lang="ts">
import { RouterView } from "vue-router";
import { onMounted, provide, ref } from "vue";
const windowRect = ref({
  height: document.body.offsetHeight,
  width: document.body.offsetWidth,
});
onMounted(() => {
  windowRect.value.height = document.body.offsetHeight;
  windowRect.value.width = document.body.offsetWidth;
  let timer = null;
  window.onresize = (e) => {
    windowRect.value.height = document.body.offsetHeight;
    windowRect.value.width = document.body.offsetWidth;
  };
});
provide("windowRect", windowRect);
</script>

<template>
  <el-scrollbar
    always
    :style="{ height: '100vh' }"
    wrap-class="scrollbar-target-backtop"
    view-class="scrollbar-view"
  >
    <div class="app-container">
      <RouterView />
    </div>
  </el-scrollbar>
  <el-backtop target=".scrollbar-target-backtop"></el-backtop>
</template>

<style scoped lang="scss">
.app-container {
  margin: 0 16px 0 10px;
  display: flex;
  flex-direction: column;
}
:deep(.scrollbar-view),
.app-container {
  height: 100%;
}
</style>
