<script>
import BlogItem from './BlogItem.vue';
import TopBar from './TopBar.vue';
import {fetchBlog} from '../api/posts.js'
import { onMounted, ref } from 'vue';
import CommentSection from './CommentSection.vue';

export default{
    components:{
        TopBar,
        BlogItem,
        CommentSection,
    },
    props:['id', 'detailed'],
    setup(props){
        const postId=ref()
        postId.value=props.id;
        const post = ref({}) // if using ref(), it will be initialized to be an undefined
        const loading = ref(true)
        const detailed = ref(true) // a flag, which tells blog item component it's from blog detail page, not home page

        const getBlogDetail = async ()=>{
            try{
                const data = await fetchBlog(postId.value);
                post.value = data;
                //console.log("post info: ", post.value);
            }catch(error){
                console.log("fetching single blog error", error);
                throw error;
            }finally{
                loading.value=false;
            } 
        }

        onMounted(getBlogDetail)

        
       
        return {
            getBlogDetail,
            post,
            loading,
            detailed,
            postId,
        }
   }
};
</script>

<template>
<el-main class="content-area">
    <TopBar/>
    <div class="blog-feed">
        <BlogItem v-if="!loading" :post="post" :detailed="detailed"/>
        <div v-else>Loading...</div>
    </div>
    <div class="blog-comments">
        <CommentSection :postId="postId"/>
    </div>
</el-main>
</template>

<style scoped>
.content-area{
    overflow: auto;
    width: 1500px;
}
</style>