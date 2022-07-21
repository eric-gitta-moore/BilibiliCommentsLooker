<script setup lang="ts">
import type { ReplyData } from "@/dto/replyData";
import type { PropType } from "vue";
import { dayjs } from "@/utils/dayjs";

const props = defineProps({
  commentsList: {
    required: true,
    type: Array as PropType<ReplyData[]>,
  },
});
</script>

<template>
  <!--  评论列表-->
  <template
    v-for="(commentItem, index) in props.commentsList"
    :key="commentItem.rpid"
  >
    <slot name="prefix" :index="index"></slot>
    <el-row>
      <el-col :span="4">
        <!--        头像-->
        <el-image
          :src="commentItem.member.avatar"
          loading="lazy"
          :preview-src-list="[commentItem.member.avatar]"
          :style="{ marginRight: '10px' }"
          :hide-on-click-modal="true"
          :preview-teleported="true"
          fit="cover"
        ></el-image>
      </el-col>
      <el-col :span="20">
        <!--        昵称-->
        <el-row>
          <el-col>
            <el-tag effect="plain">
              {{ index + 1 }}
            </el-tag>
            {{ commentItem.member.uname }}
          </el-col>
        </el-row>

        <!--        发表时间-->
        <el-row>
          <el-col>
            <span
              >{{
                dayjs.unix(commentItem.ctime).format("YYYY-MM-DD HH:mm:ss")
              }}({{ dayjs.unix(commentItem.ctime).fromNow() }})</span
            >
            <span>&nbsp;&nbsp;&nbsp;赞：{{ commentItem.like }}</span>
          </el-col>
        </el-row>

        <!--        点赞-->
        <el-row>
          <el-col>
            <div class="comment-content">
              {{ commentItem.content.message }}
            </div>
          </el-col>
        </el-row>

        <!--        二级评论-->
        <slot name="replies" :commentData="commentItem"></slot>
      </el-col>
    </el-row>
    <slot name="suffix" :index="index"></slot>
  </template>
</template>

<style scoped lang="scss">
.comment-content {
  white-space: pre-wrap;
  overflow-wrap: break-word;
}
</style>
