<template>
    <el-card class="blog-post" shadow="always">
      <!-- Header: User info -->
      <div class="post-header">
        <el-avatar :src="post.author_avatar" size="large" class="avatar" />
        <div class="user-info">
          <div class="username">{{ post.author_name }}</div>
          <div class="timestamp">{{ formatTimeStamp(post.created_time) }}</div>
        </div>
        <el-icon class="more-options" @click="handleMoreOptions"><More /></el-icon>
      </div>
  
      <!-- Content: Post text -->
      <div class="post-content">
        <el-button @click="handleClickTitle" type="text" class="post-title">
            <h2 style="font-weight: bold;">{{ post.title }}</h2>
        </el-button>
        
        <!-- <p>{{ getPlainTextContent }}</p> -->
        <div v-if="!detailed" v-html="getDescription" class="post-content-text"></div>
        <div v-else v-html="post.content" class="post-content-text"></div>
      </div>
  
      <!-- Tags -->
      <div class="post-tags">
        <el-tag v-for="tag in post.tags" :key="tag" type="info">{{ tag }}</el-tag>
      </div>
  
      <!-- Footer: Interaction buttons -->
      <div class="post-footer">
        <el-button @click="handleLike" type="success" size="small">
            {{ post.likes }} likes
        </el-button>
        <el-button @click="handleDislike" type="danger" size="small">
            {{ post.dislikes }} dislikes
        </el-button>
        <el-button type="text" @click="handleClickComment" class="comments-button">
            <el-icon :style="{fontSize:'25px'}"><Comment/></el-icon>
            {{ post.comment_count }}
        </el-button>
        
      </div>
    </el-card>
  </template>
  
<script>
  import { More, Comment } from '@element-plus/icons-vue'
  import { computed, ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
    components: {
      More,
      Comment,
    },
    props: {
      post: {
        type: Object,
        required: true,
      },
      detailed:{
        type: Boolean,
        required: true
      }
    },
    setup(props){
        const router = useRouter()

        // react on the post
        const reactData = ref({
          likes: props.post.likes,
          dislikes: props.post.dislikes,
        });

        const handleClickTitle = ()=>{
            router.push({
                name: 'blogDetail',
                params:{
                    id: props.post.post_id
                }
            })
        }

        const handleClickComment=()=>{
            router.push({
                name: 'blogDetail', // route name 
                params:{
                    id: props.post.post_id
                }
            })
        }

        // display formatted time
        const formatTimeStamp = (timestamp)=>{
          const date = new Date(timestamp);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要+1
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          return `${year}-${month}-${day} ${hours}:${minutes}`
        }

        const getDescription = computed(()=>{
            let description = props.post.content.replace(/<img[^>]*>/g, '').replace(/&nbsp;/,'');
            return description;
        })

        return {
            getDescription,
            handleClickTitle,
            handleClickComment,
            formatTimeStamp,
            reactData,
        }
      }
    }
</script>
  
  <style scoped>
  .blog-post {
    margin-bottom: 20px;
    /* max-height: 300px; */
  }
  
  .post-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .avatar {
    margin-right: 10px;
  }
  
  .user-info {
    flex: 1;
  }
  
  .username {
    font-weight: bold;
    color: #333;
  }
  
  .timestamp {
    font-size: 12px;
    color: #888;
  }
  
  .more-options {
    cursor: pointer;
    color: #888;
  }

  .post-title{
    color: black;
  }
  
  .post-content h3 {
    font-size: 16px;
    color: #333;
    margin: 0;
  }
  
  .post-content p {
    font-size: 14px;
    color: #555;
    line-height: 1.5;
    margin: 5px 0 0 0;
  }
  
  .post-tags {
    margin: 10px 0;
  }
  
  .post-footer {
    /* display: flex; */
    justify-content: space-between;
    margin-top: 10px;
  }
  
  .post-footer .el-button {
    font-size: 11px;
    margin-right: 20px
  }

  .post-footer .comments-button{
    margin-left: 500px;
  }
  </style>
  