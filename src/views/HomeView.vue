<script setup lang="ts">
import { ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { useVideoStore } from "@/stores/video";
import { ElMessage } from "element-plus";
import { DataBase } from "@/database";

const videoId = ref("385660942");
const videoStore = useVideoStore();

function handleSearchVideo(): void {
  if (videoId.value.trim() === "") {
    ElMessage({
      message: "avid不能为空",
      type: "error",
    });
    return undefined;
  }
  videoStore.fetchVideoDetail(Number.parseInt(videoId.value), 2);
}

function handleDebugDatabase() {
  const dataBase = DataBase.getInstance();
}
</script>

<template>
  <el-input v-model="videoId" placeholder="请输入视频avid">
    <template #append>
      <el-button @click="handleSearchVideo" type="primary" :icon="Search" />
    </template>
  </el-input>
  <el-button @click="handleDebugDatabase">sqlite</el-button>
</template>
