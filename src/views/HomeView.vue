<script setup lang="tsx">
import { computed, inject, nextTick, onMounted, ref, toRef, watch } from "vue";
import type { Ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { useVideoStore } from "@/stores/video";
import { ElMessage, ElTabPane, ElTreeV2, type Column } from "element-plus";
import { DataBase } from "@/database";
import { storeToRefs } from "pinia";
import CommentAndReply from "@/components/CommentAndReplyList.vue";
import CommentAndReplyOneData from "@/components/CommentAndReplyOneData.vue";

const videoIdInput = ref("BV1Nf4y1G7ZS");
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
  // (function echo() {
  //   setTimeout(() => {
  //     if (videoData.value) console.log(videoData.value.replies);
  //     else echo();
  //   }, 1000);
  // })();
  fetchVideoDetailSettled.value = false;
  let r = await videoStore.fetchVideoDetail(videoId.value);
  if (r !== false) fetchVideoDetailSettled.value = true;
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

//---------------------树状布局
import { ElAutoResizer } from "element-plus";
import type { VideoCommentsData } from "@/dto/videoCommentsData";

type CellRenderProps<T> = {
  cellData: T;
  column: Column<T>;
  columns: Column<T>[];
  columnIndex: number;
  rowData: any;
  rowIndex: number;
};

const windowRect: Ref<{ width: number; height: number }> = inject(
  "windowRect",
  ref({
    height: 0,
    width: 0,
  })
);
const treeTabsRef = ref<InstanceType<typeof ElTabPane>>();
const treeTabsContentTop = ref<number>(
  treeTabsRef.value?.$el
    .querySelector(".el-tabs__content")
    .getBoundingClientRect().top ?? 0
);
onMounted(() => {
  nextTick(() => {
    treeTabsContentTop.value = treeTabsRef
      .value!.$el.querySelector(".el-tabs__content")
      .getBoundingClientRect().top;
  });
});
const treeRefHeight = computed(() => {
  return windowRect.value.height - treeTabsContentTop.value;
});
// watch(
//   treeRefHeight,
//   (val) => {
//     console.log(
//       "windowRect",
//       windowRect,
//       treeTabsRef.value?.$el
//         .querySelector(".el-tabs__content")
//         .getBoundingClientRect(),
//       `treeRefHeight`,
//       treeRefHeight
//     );
//   },
//   { immediate: true }
// );

function cellRenderer(props: CellRenderProps<VideoCommentsData>) {
  console.log(`CellRenderProps`, props);
  return (
    <CommentAndReplyOneData
      comment-item={props.rowData}
      row-index={props.rowIndex}
    ></CommentAndReplyOneData>
  );
}

//---------------------树状布局

const commentsList = computed(() => {
  if (!videoData.value) return [];
  return toRef(videoData.value, "replies");
});
const debugFun = function (...args: any[]) {
  console.log(...args);
};
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
    <el-col :span="6">avid:{{ videoId }}</el-col>
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
  <el-tabs :style="{ flex: 1 }" ref="treeTabsRef">
    <el-tab-pane name="1" label="左右布局" lazy>
      <el-row>
        <el-col :span="12">
          <CommentAndReply
            v-if="videoData?.replies"
            :comments-list="videoData.replies"
          >
            <template #suffix>
              <el-divider></el-divider>
            </template>
          </CommentAndReply>
        </el-col>
        <el-col :span="12"></el-col>
      </el-row>
    </el-tab-pane>
    <el-tab-pane v-if="false" label="楼中楼布局" lazy>
      <CommentAndReply
        v-if="videoData?.replies"
        :comments-list="videoData.replies"
      >
        <template #suffix>
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
    </el-tab-pane>
    <el-tab-pane name="0" label="树状布局" lazy>
      <el-auto-resizer>
        <template #default="{ width }">
          <el-table-v2
            class="tree-table"
            v-if="commentsList.value"
            :columns="[
              {
                key: 'ripd',
                dataKey: 'rpid',
                title: '记录',
                width,
                flexGrow: 1,
                cellRenderer,
              },
            ]"
            :data="commentsList.value"
            :width="width"
            :header-height="0"
            :height="treeRefHeight"
            row-key="rpid"
            :estimated-row-height="100"
            scrollbar-always-on
          >
          </el-table-v2>
        </template>
      </el-auto-resizer>
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped lang="scss">
.progress-title {
  color: black;
}

.tree-list :deep(.el-tree-virtual-list) {
  overflow-y: hidden !important;
}

.tree-table :deep(.el-table-v2__header-wrapper) {
  //display: none;
}

.el-tabs {
  flex-direction: column;
  display: flex;

  :deep(.el-tabs__content),
  :deep(.el-tab-pane) {
    flex-grow: 1;
    flex-direction: column;
    display: flex;
  }

  //:deep(.el-tab-pane){
  //  height :v-bind(treeRefHeight);
  //}
}
</style>
