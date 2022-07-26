<script lang="tsx" setup>
import {
  computed,
  inject,
  nextTick,
  onMounted,
  reactive,
  ref,
  toRef,
  toRefs,
  unref,
  watch,
} from "vue";
import type { Ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { useVideoStore } from "@/stores/video";
import { ElMessage, ElTabPane, ElTreeV2, type Column } from "element-plus";
import { DataBase } from "@/database";
import { storeToRefs } from "pinia";
import CommentAndReply from "@/components/CommentAndReplyList.vue";
import CommentAndReplyOneData from "@/components/CommentAndReplyOneData.vue";
import { throttle, debounce } from "lodash";

//-------------------头部操作区域
const videoIdInput = ref("BV1Nf4y1G7ZS");
const videoStore = useVideoStore();
const {
  loadedCommentCount,
  commentCount,
  videoData,
  videoId,
  onlyCommentCount,
  onlyReplyCount,
} = storeToRefs(videoStore);
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
  if (per > 99.9) return 99.9;
  return per;
});
//-------------------头部操作区域

//---------------------树状布局
import type { VideoCommentsData } from "@/dto/videoCommentsData";
//-----计算可用高度
const windowRect: Ref<{ width: number; height: number }> = inject(
  "windowRect",
  ref({
    height: 0,
    width: 0,
  })
);
const treeTabsRef = ref<InstanceType<typeof ElTabPane>>();
const treeTabsContentTop = ref<number>(0);
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
//-----计算可用高度

import type { ReplyData } from "@/dto/replyData";

type CellRenderProps<T> = {
  class: String;
  cellData: T;
  column: Column<T>;
  columns: Column<T>[];
  columnIndex: number;
  rowData: T;
  rowIndex: number;
};

function cellRenderer(clickable: boolean) {
  return function (props: CellRenderProps<ReplyData>) {
    let isChild = props.rowData.root !== 0;
    let style: Record<string, string> = {
      flex: "1",
    };
    if (isChild) {
      //Object.defineProperty不生效
      style["margin-left"] = "50px";
    }
    // console.log(props, isChild, style);
    return (
      <div
        style={style}
        class={props.class}
        onClick={() => {
          clickable &&
            setDoublePanelRightTableRepliesData(
              unref(toRef(props.rowData, "replies"))
            );
        }}
      >
        <CommentAndReplyOneData
          comment-item={props.rowData}
          index={props.rowIndex}
        ></CommentAndReplyOneData>
      </div>
    );
  };
}

//---------------------树状布局

//---------------------左右布局
const doublePanelDivider = ref<InstanceType<typeof HTMLElement>>();
const doublePanelLeftWidthNum = ref(50);
const doublePanelIsActive = ref(false);
import type { TableV2 } from "element-plus";

const doublePanelRightTableRepliesData = ref<ReplyData[]>([]);

function setDoublePanelRightTableRepliesData(replies: ReplyData[] | null) {
    if (replies !== null) doublePanelRightTableRepliesData.value = replies;
    else doublePanelRightTableRepliesData.value = [];
}

const doublePanelLeftTable = ref<InstanceType<typeof TableV2>>();
onMounted(() => {
  nextTick(() => {
    watch([treeRefHeight, doublePanelLeftWidthNum], () => {
      console.log(
        `doublePanelLeftTable!.value?.$forceUpdate`,
        doublePanelLeftTable!.value!
      );
      doublePanelLeftTable!.value!.$forceUpdate();
    });
  });
});

/**
 * 不理解为什么要计算属性才能绑定生效
 * @link https://staging-cn.vuejs.org/guide/essentials/class-and-style.html#binding-inline-styles
 */
const doublePanelLeftWidthComputed = computed(() => {
  return doublePanelLeftWidthNum.value;
});
onMounted(() => {
  nextTick(() => {
    let dividerOnMouseMoveThrottle = throttle((e: MouseEvent) => {
      doublePanelLeftWidthNum.value = (e.x / document.body.offsetWidth) * 100;
      // console.log(
      //     `dividerOnMouseMove`,
      //     e.x,
      //     document.body.offsetWidth,
      //     e.x / document.body.offsetWidth,
      //     e
      // );
    }, 20);
    let dividerOnMouseMove = (e: MouseEvent) => dividerOnMouseMoveThrottle(e);
    let dividerOnMouseUp = (e: MouseEvent) => {
      doublePanelIsActive.value = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.removeEventListener("mouseup", dividerOnMouseUp);
      document.removeEventListener("mousemove", dividerOnMouseMove);
    };
    doublePanelDivider.value!.addEventListener("mousedown", (e: MouseEvent) => {
      doublePanelIsActive.value = true;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mouseup", dividerOnMouseUp);
      document.addEventListener("mousemove", dividerOnMouseMove);
    });
  });
});

//---------------------左右布局

const commentsList = computed(() => {
  if (!videoData.value) return [];
  let comments = toRef(videoData.value, "replies");

  return toRef(videoData.value, "replies").value;
});
const commentsListColumnKey = "list";
const commentsListColumns = [
  {
    //必须要加key字段，不然表格row左侧会出现一个多选框的div占位
    //key字段是用于区分不同的列
    key: commentsListColumnKey,
    dataKey: "rpid",
    width: 150,
    cellRenderer: cellRenderer(true),
  },
];
const doublePanelLeftTableColumns = [
  {
    ...commentsListColumns[0],
    cellRenderer: cellRenderer(false),
  },
];
const debugFun = function (...args: any[]) {
  console.log(...args);
};
</script>

<template>
  <el-row>
    <el-col>
      <el-input v-model="videoIdInput" placeholder="请输入视频avid或bvid">
        <template #append>
          <el-button :icon="Search" type="primary" @click="handleSearchVideo" />
        </template>
      </el-input>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="6"> 总评论:{{ commentCount }}</el-col>
    <el-col :span="6"> 已加载评论:{{ loadedCommentCount }}</el-col>
    <el-col :span="6"> 一级评论:{{ onlyCommentCount }}</el-col>
    <el-col :span="6"> 二级评论:{{ onlyReplyCount }}</el-col>
  </el-row>
  <el-row>
    <el-col>
      <el-progress
        :percentage="progressPercentage"
        :stroke-width="20"
        :text-inside="true"
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
  <el-row>
    <el-col>
      <el-tabs ref="treeTabsRef">
        <el-tab-pane label="左右分栏" lazy>
          <div :style="{ height: `${treeRefHeight}px` }" class="double-panel">
            <div
              :style="{ width: `${doublePanelLeftWidthComputed}%` }"
              class="double-panel__left"
            >
              <el-auto-resizer class="double-panel__auto-resizer">
                <template #default="{ height, width }">
                  <el-table-v2
                    ref="doublePanelLeftTable"
                    :columns="commentsListColumns"
                    :data="commentsList"
                    :estimated-row-height="100"
                    :header-height="0"
                    :height="treeRefHeight"
                    :width="width"
                    class="tree-table"
                    row-key="rpid"
                    scrollbar-always-on
                  >
                  </el-table-v2>
                </template>
              </el-auto-resizer>
            </div>
            <div
              :style="{ width: `${100 - doublePanelLeftWidthComputed}%` }"
              class="double-panel__right"
            >
              <div
                ref="doublePanelDivider"
                :class="{ 'is-active': doublePanelIsActive }"
                class="double-panel__divider"
              ></div>
              <el-auto-resizer class="double-panel__auto-resizer">
                <template #default="{ height, width }">
                  <el-table-v2
                    :columns="doublePanelLeftTableColumns"
                    :data="doublePanelRightTableRepliesData"
                    :estimated-row-height="100"
                    :header-height="0"
                    :height="treeRefHeight"
                    :width="width"
                    class="tree-table"
                    row-key="rpid"
                    scrollbar-always-on
                  >
                  </el-table-v2>
                </template>
              </el-auto-resizer>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="楼中楼" lazy>
          <el-auto-resizer>
            <template #default="{ height, width }">
              <el-table-v2
                :columns="commentsListColumns"
                :data="commentsList"
                :estimated-row-height="100"
                :expand-column-key="commentsListColumnKey"
                :header-height="0"
                :height="treeRefHeight"
                :width="width"
                class="tree-table"
                row-key="rpid"
                scrollbar-always-on
              >
              </el-table-v2>
            </template>
          </el-auto-resizer>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.progress-title {
  color: black;
}

.double-panel {
  display: flex;

  &__auto-resizer {
    width: inherit !important;
    flex: 1;
  }

  &__left,
  &__right {
    flex-grow: 1;
    display: flex;
    min-width: 20%;
  }

  &__divider {
    height: 100%;
    //width: 6px;
    flex: 0 0 6px;
    box-sizing: border-box;
    background-color: #dee0e3;
    margin: 0 4px 15px 4px;
    cursor: col-resize;
    border-radius: 4px;
    transition: opacity 0.15s ease-in 0.15s,
      background-color 0.15s ease-in 0.15s;
    border-right: 5px solid white;

    &:hover,
    &.is-active {
      background-color: #3370ff;
    }
  }
}

.tree-table {
  &:deep(.el-table-v2__main),
  &:deep(.el-table-v2__body),
  :deep(.el-table-v2__row),
  :deep(.el-table-v2__row-cell) {
    width: 100% !important;
  }

  //有些地方这里有问题，被压缩了
  //:deep(.el-table-v2__row-cell) {
  //  & > div:not([class]) {
  //    margin-inline-start: unset !important;
  //  }
  //}

  //可展开项目与不可展开项目不对齐
  :deep(.el-table-v2__row-depth-0) .el-table-v2__row-cell {
    & > div:not([class]) {
      margin-inline-start: 4px !important;
    }
  }

  &:deep(.el-table-v2__body) {
    .el-vl__horizontal .el-scrollbar__thumb {
      display: none;
    }

    & > div[style*="will-change"] {
      width: 100% !important;

      & > div:not([class]) {
        width: 100% !important;
      }
    }
  }
}
</style>
