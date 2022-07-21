<script setup lang="ts">
import type { ReplyData } from "@/dto/replyData";
import type { PropType } from "vue";

const props = defineProps({
  commentsList: {
    required: true,
    type: Array as PropType<ReplyData[]>,
  },
});

const treeProps = {
  value: "rpid",
  children: "replies",
  label: "rpid",
};
</script>

<template>
  <el-tree-v2
    :data="commentsList"
    :props="treeProps"
    highlight-current
    expand-on-click-node
  ></el-tree-v2>
</template>
