<script lang="ts" setup>
import type { ReplyData } from "@/dto/replyData";
import type { PropType } from "vue";
import { dayjs } from "@/utils/dayjs";

const props = defineProps({
  commentItem: {
    required: true,
    type: Object as PropType<ReplyData>,
  },
  index: {
    type: Number,
  },
});
</script>

<template>
  <slot name="prefix"></slot>
  <div class="row-line">
    <div class="row-line__left">
      <!--        头像-->
      <el-image
        :hide-on-click-modal="true"
        :preview-src-list="[commentItem.member.avatar]"
        :preview-teleported="true"
        :src="commentItem.member.avatar"
        :style="{ marginRight: '10px', width: '100px', height: '100px' }"
        fit="cover"
        loading="lazy"
      ></el-image>
    </div>
    <div class="row-line__right">
      <!--        昵称-->
      <el-row>
        <el-col>
          <el-tag effect="plain">
            {{ commentItem.index ? commentItem.index + 1 : index + 1 }}
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
          <span
            >&nbsp;&nbsp;&nbsp;回复：{{
              commentItem.replies?.length ?? 0
            }}</span
          >
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
      <slot :commentData="commentItem" name="replies"></slot>
    </div>
  </div>
  <slot name="suffix"></slot>
</template>

<style lang="scss" scoped>
.comment-content {
  white-space: pre-wrap;
  overflow-wrap: break-word;
}

.row-line {
  display: flex;
}
</style>
