<script>
import {computed, onMounted, ref} from 'vue'
import {fetchRootComments, createComment} from '../api/comments.js'
import CommentReplies from './CommentReplies.vue';
import {useUserStore} from '../stores/userStore.js'
import { ElMessage } from 'element-plus';

export default{
  components:{
    CommentReplies,
  },
  props:{
    postId:{
      type: Number,
      required: true
    }
  },
    setup(props){
      const userStore = useUserStore();
      const userId = computed(()=>userStore.userId); // get userId from userStore

      const postId = ref(0);
      postId.value = props.postId;

      const rootComments = ref([]); // root comments shown when the page is loaded

      const showReplies = ref([]); // the comments that show replies

      const commentText = ref("") // write a comment. v-model for comment box.

      const commentData = ref({
        userComment: "",
        userId: null,
        postId: null
      }); // json data for creating a comment

      const replyingToCommentId = ref(null); // the comment being replied

      const replyContent = ref({}); // v-model for reply area, key-value structure: commentId:content

      const replyData = ref({
        userComment: "",
        userId: null,
        postId: null,
        parentId: null,
    }); // json data for creating a reply

      const toggleReplies = (commentId)=>{
        const index = showReplies.value.indexOf(commentId);
        if (index==-1){
          // if the comment is not active, add it 
          showReplies.value.push(commentId);
        }
        else{
          showReplies.value.splice(index, 1);
        }
      };

      const submitComment = ()=>{
        commentData.value.userComment=commentText.value;
        commentData.value.postId=props.postId;
        // userId is a computed attribute based on userStore.userId
        commentData.value.userId= userId.value;
        commentText.value = "";
        console.log("submit a comment, comment data: ", commentData);
        addComment();
        replyingToCommentId.value = null; // reset to null meaning no comment being replied
      }

      const cancelComment = ()=>{
        commentText.value = "";
        commentData.value = "";
      }

      const submitReply = (commentId)=>{
        console.log(replyContent.value[commentId], replyingToCommentId.value, commentId);
        if (replyContent.value[commentId] && replyingToCommentId.value == commentId){
            replyData.value.userComment = replyContent.value[commentId];
            replyData.value.postId = postId.value;
            replyData.value.userId = userId.value;
            replyData.value.parentId = commentId; // which comment to reply
            addReply();
            replyContent.value[commentId] = ""; // reset
            replyingToCommentId = null; // reset
        }
        else{
          ElMessage.warning("Nothing to reply!");
        }
      }

      // focus
      const setActiveReply = (id)=>{
        replyingToCommentId.value = id;
        console.log(replyingToCommentId.value);
      }
      
      // blur
      const clearActiveReply = () => {
        //replyingToCommentId.value = null;
        console.log(replyingToCommentId.value);
      };

      const addComment = async()=>{
        try{
          const data = await createComment(commentData.value);
          console.log("New comment created: ", data);
        }catch(error){
          console.log("create a comment failed:", error);
          throw error;
        }
      }

      const addReply = async()=>{
        try{
          console.log(replyData.value);
          const data = await createComment(replyData.value);
          console.log("New reply added: ", data);
        }catch(error){
            console.log("adding reply error: ", error);
            throw error;
        }
    }


      const getRootComments = async()=>{
        try{
          const data = await fetchRootComments(postId.value);
          rootComments.value = data;
          console.log("Root comments: ", rootComments.value);
        }catch(error){
          console.log("get root comments failed", error);
          throw error;
        }
      }

      onMounted(getRootComments);
      return{
        getRootComments,
        rootComments,
        postId,
        toggleReplies,
        showReplies,
        commentText,
        cancelComment,
        submitComment,
        commentData,
        addComment,
        replyData,
        submitReply,
        replyContent,
        replyingToCommentId,
        setActiveReply,
        clearActiveReply,
      }
    }
}
</script>

<template>
  <el-main class="comment-section">
    <el-card shadow="hover" class="comment-box">
      <el-input
        v-model="commentText"
        type="textarea"
        placeholder="Write a comment..."
        class="comment-input"
        rows="3"/>
      <div class="comment-actions">
        <el-button @click="submitComment" type="primary">Comment</el-button>
        <el-button @click="cancelComment" type="info" plain>Cancel</el-button>
      </div>
    </el-card>

    <el-card class="comment" v-for="comment in rootComments" :key="comment.comment_id" shadow="always">
      <div class="comment-header">
        <el-avatar :src="comment.user_avatar" class="avatar" />
        <p class="username">{{ comment.username }}</p>
      </div>

      <div class="comment-details">
        <p class="comment-text">{{ comment.user_comment }}</p>
      </div>
      
      <div class="comment-actions">
        <el-button type="text" > ▲ {{ comment.likes }}</el-button>
        <el-button type="text" > ▼ {{ comment.dislikes }}</el-button>
        <el-button type="text" @click="toggleReplies(comment.comment_id)">replies</el-button>
      </div>
     
      <div class="comment-reply">
        <el-input  v-model="replyContent[comment.comment_id]" placeholder="Write a reply..."  class="reply-input" 
        @focus="setActiveReply(comment.comment_id)"
        />
        <el-button type="primary" @click="submitReply(comment.comment_id)">Reply</el-button>
      </div>

      <div class="replies" v-if="showReplies.includes(comment.comment_id)">
        <CommentReplies :commentId="comment.comment_id" :postId="postId"/>
      </div>
    </el-card>
  </el-main>
</template>

<style scoped>
.comment-header{
  display: flex;
  align-items: center;
}
.comment-details{
  margin-bottom: 10px;
  margin-top: 20px;
}
.avatar {
  margin-right: 10px; 
}
.comment-reply{
  display: flex;
}
.comment-input {
  width: 100%;
  margin-bottom: 10px;
}
.comment-actions {
  display: flex;
  justify-content: flex-start; /* 左对齐 */
  gap: 10px;
}
</style>