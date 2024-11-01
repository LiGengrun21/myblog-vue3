<script>
import {computed, onMounted, ref, watch} from 'vue'
import {fetchCommentReplies, createComment} from '../api/comments.js'
import {useUserStore} from '../stores/userStore.js'

export default{
  props:{
    commentId:{
      type: Number,
      required: true
    },
    postId:{
      type: Number,
      required: true
    }
  },
  setup(props){
    const userStore = useUserStore();
    const userId = computed(()=>userStore.userId);

    const commentId = ref(0);
    commentId.value = props.commentId;

    const postId = ref(0);
    postId.value = props.postId;

    const replies = ref([]);

    const showReplies = ref([]); // the comments that show replies

    const replyContent = ref({}); // v-model for reply area, key-value

    const replyingToCommentId = ref(null); // the comment being replied

    const replyData = ref({
        userComment: "",
        userId: null,
        postId: null,
        parentId: null,
    }); // json data for creating a reply

    const submitReply = (replyId)=>{
        console.log(replyContent.value[replyId], replyingToCommentId.value, replyId);
        if (replyContent.value[replyId] && replyingToCommentId.value == replyId){
            replyData.value.userComment = replyContent.value[replyId];
            replyData.value.postId = postId.value;
            replyData.value.userId = userId.value;
            replyData.value.parentId = replyId; // which reply to reply
            addReply();
            replyContent.value[replyId] = ""; //reset
            replyingToCommentId = null; // reset
        }
        else{
          ElMessage.warning("Nothing to reply!");
        }
    }

    const toggleReplies = (commentId)=>{
      const index = showReplies.value.indexOf(commentId);
      console.log("show replies: ", showReplies.value);
      if (index==-1){
        // if the comment is not active, add it 
        showReplies.value.push(commentId);
      }
      else{
        showReplies.value.splice(index, 1);
      }
    };

     // focus
    const setActiveReply = (id)=>{
      replyingToCommentId.value = id;
      console.log(replyingToCommentId.value);
    }
      
      // blur
    const clearActiveReply = () => {
      //replyingToCommentId.value = null;
    };

    const getReplies = async()=>{
        try{
            const data = await fetchCommentReplies(commentId.value);
            replies.value = data;
            console.log("Replies of the comment: ", replies.value);
        }catch(error){
            console.log("Failed to get replies: ", error);
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

    onMounted(getReplies);

    watch(
        ()=>props.commentId,
        (newCommentId, oldCommentId)=>{
            if (newCommentId!=oldCommentId){
                getReplies();
            }
        }
    );

    return{
        getReplies,
        replies,
        commentId,
        toggleReplies,
        showReplies,
        replyContent,
        submitReply,
        replyData,
        addReply,
        replyingToCommentId,
        setActiveReply,
        clearActiveReply,
    }
  }
}
</script>

<template>
  <el-main class="comment-section">
    <el-card class="comment" v-for="comment in replies" :key="comment.comment_id" shadow="always">
      <div class="comment-header">
        <el-avatar :src="comment.user_avatar" class="avatar" />
        <p class="username">{{ comment.username }}</p>
      </div>

      <div class="comment-details">
        <p class="comment-text">{{ comment.user_comment }}</p>
      </div>
      
      <div class="comment-actions">
        <el-button type="text"> ▲ {{ comment.likes }}</el-button>
        <el-button type="text"> ▼ {{ comment.dislikes }}</el-button>
        <el-button type="text" @click="toggleReplies(comment.comment_id)">replies</el-button>
      </div>
     
      <div class="comment-reply">
        <el-input  v-model="replyContent[comment.comment_id]" placeholder="Write a reply..." class="reply-input"
        @focus="setActiveReply(comment.comment_id)"
        />
        <el-button type="primary" @click="submitReply(comment.comment_id)">Reply</el-button>
      </div>

      <div class="replies" v-if="showReplies.includes(comment.comment_id)">
        <CommentReplies :commentId="comment.comment_id"/>
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
  margin-top: 10px;
}
.avatar {
  margin-right: 10px; 
}
.comment-reply{
  display: flex;
}
</style>