<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <el-scrollbar always :style="{ height: '100vh' }" wrap-class="scrollbar-target-backtop">
    <div class="app-container">
      <RouterView />
    </div>
  </el-scrollbar>
  <el-backtop target=".scrollbar-target-backtop"></el-backtop>
</template>

<style scoped lang="scss">
.app-container {
  margin: 0 10px;
}
</style>
