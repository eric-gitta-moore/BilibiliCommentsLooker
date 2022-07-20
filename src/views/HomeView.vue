<script setup lang="ts">
import { computed, inject, ref, toRef, toRefs } from "vue";
import { Search } from "@element-plus/icons-vue";
import { useVideoStore } from "@/stores/video";
import { ElMessage } from "element-plus";
import { DataBase } from "@/database";
import { storeToRefs } from "pinia";
import CommentAndReply from "@/components/CommentAndReply.vue";

const videoIdInput = ref("BV1uL4y1876h");
const videoStore = useVideoStore();
const { loadedCommentCount, commentCount, videoData, videoId } =
  storeToRefs(videoStore);
const fetchVideoDetailSettled = ref(false);

async function handleSearchVideo() {
  if (videoIdInput.value.trim() === "") {
    ElMessage({
      message: "视频id不能为空",
      type: "error",
    });
    return undefined;
  }
  await videoStore.parseVideoId(videoIdInput.value);
  if (!videoId.value) {
    ElMessage({
      message: "avid获取失败，请检查输入",
      type: "error",
    });
    return undefined;
  }
  fetchVideoDetailSettled.value = false;
  await videoStore.fetchVideoDetail(videoId.value);
  fetchVideoDetailSettled.value = true;
}

function handleDebugDatabase() {
  const dataBase = DataBase.getInstance();
}

const progressPercentage = computed(() => {
  if (fetchVideoDetailSettled.value) return 100;
  if (commentCount.value === 0) return 0;
  const per = (loadedCommentCount.value / commentCount.value) * 100;
  if (per > 100) return 99;
  return per;
});
</script>

<template>
  <el-row>
    <el-col>
      <el-input v-model="videoIdInput" placeholder="请输入视频avid或bvid">
        <template #append>
          <el-button @click="handleSearchVideo" type="primary" :icon="Search" />
        </template>
      </el-input>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="3">
      <el-button @click="handleDebugDatabase">sqlite</el-button>
    </el-col>
    <el-col :span="6">avid:{{videoId}}</el-col>
    <el-col :span="6"> 总评论数:{{ commentCount }}</el-col>
    <el-col :span="6"> 已加载评论数:{{ loadedCommentCount }}</el-col>
  </el-row>
  <el-row>
    <el-col>
      <el-progress
        :text-inside="true"
        :stroke-width="20"
        :percentage="progressPercentage"
      >
        <template #default="{ percentage }">
          <span>{{
            `[${percentage.toFixed(2)}%]${loadedCommentCount}/${commentCount}`
          }}</span>
        </template>
      </el-progress>
    </el-col>
  </el-row>
  <!--  评论列表-->
  <CommentAndReply v-if="videoData?.replies" :comments-list="videoData.replies">
    <template #prefix>
      <el-divider></el-divider>
    </template>
    <template #replies="{ commentData }">
      <CommentAndReply
        v-if="commentData?.replies"
        :comments-list="commentData.replies"
      >
        <template #prefix>
          <el-divider></el-divider>
        </template>
      </CommentAndReply>
    </template>
  </CommentAndReply>
</template>

<style scoped lang="scss">
.progress-title {
  color: black;
}
</style>
