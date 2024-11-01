<script>
import BlogItem from './BlogItem.vue';
import TopBar from './TopBar.vue';
import { ref, onMounted } from 'vue';
import {fetchBlogList} from '../api/posts.js'

export default{
    components:{
        TopBar,
        BlogItem,
    },
    setup(){
      const blogList=ref([])
      const currentPage = ref(1)
      const totalPages=ref(0) 
      const pageSize = ref(10) // posts per page
      const loading  = ref(true) // the page is loading

      const getBlogList = async ()=>{
        try{
          const data = await fetchBlogList(currentPage.value, pageSize.value);
          // get the results of the current page and the number of total pages
          blogList.value=data.results;
          totalPages.value=data.total;
          console.log("blog list: ", blogList);
        }catch(error){
          console.log("fetching blog list error", error);
          throw error;
        }
        finally{
          loading.value=false;
        }
      }

    onMounted(getBlogList); // getBlogList is automatically executed when the page is loading

    return{
        blogList,
        loading,
        currentPage,
        totalPages,
        pageSize,
    }
  }
};
</script>

<template>
<el-main class="content-area">
    <TopBar/>
    <h2>Feel free to post anything!</h2>
    <br/>
    <div class="blog-feed">
      <BlogItem v-for="post in blogList" :key="post.id" :post="post" />
    </div>
    <el-pagination
      v-if="total > 0"
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="handlePageChange"
    />
</el-main>
</template>

<style scoped>
.content-area{
    /* position: fixed; */
    overflow: auto;
    width: 1500px;
}
</style>