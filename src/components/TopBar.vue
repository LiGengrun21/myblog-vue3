<script>
  import { Search, Plus, Bell } from '@element-plus/icons-vue'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router';

  export default{
    components:{
        Search,
        Plus,
        Bell,
    },
    setup(){
        const searchQuery=ref('');

        const router =useRouter();

        // click 'create post' button on top bar
        const createPost = ()=>{
          router.push("/createPost");
        }

        return{
           searchQuery,
           createPost,
        }
    }
  };
</script>

<template>
    <el-row>
      <el-col :span="5"></el-col>
      <el-col :span="11">
        <div>
          <el-input v-model="searchQuery" placeholder="Search posts" class="search-bar" clearable>
            <template #prefix>
              <el-icon> <Search/> </el-icon>
            </template>
          </el-input>
        </div>
      </el-col>
      <el-col :span="4"></el-col>
      <el-col :span="2">
        <div class="create-post">
          <el-button  type="text" @click="createPost">
            <el-icon :style="{ fontSize: '32px' }"><Plus/></el-icon> 
          </el-button>
          <p>Create Post</p>
        </div>
      </el-col>
      <el-col :span="1">
        <div class="notification">
          <el-button type="text">
            <el-icon :style="{ fontSize: '32px' }"><Bell/></el-icon>
          </el-button>
        </div>
      </el-col>
      <el-col :span="1">
        <div class="user-avatar">
          <el-button type="text">
            <el-avatar size="medium"></el-avatar>
          </el-button>
        </div>
      </el-col>
    </el-row>
</template>

<style scoped>
.create-post{
  text-align: center;
}
</style>