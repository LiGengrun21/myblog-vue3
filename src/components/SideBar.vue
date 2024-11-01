<template>
    <el-container class="sidebar-container">
      <el-aside width="280px" class="sidebar">
        <!-- Main Navigation -->
        <el-menu :default-active="activeItem" class="el-menu-vertical-demo" @select="handleSelect">
          <el-menu-item index="home" @click="clickHome">
            <el-icon><HomeFilled /></el-icon>
            <span>Home</span>
          </el-menu-item>
          <el-menu-item index="popular">
            <el-icon><StarFilled /></el-icon>
            <span>Popular</span>
          </el-menu-item>
        </el-menu>

        <!-- Category section-->
         <div class="section">
          <p class="section-title">CATEGORY</p>
          <el-collapse v-model="categoryOpen">
            <el-collapse-item name="category">
              <el-menu :default-active="activeItem" >
                <el-menu-item v-for="(category, index) in categories" :key="index" :index="category.id.toString()">
                  <el-avatar size="small">{{ category.name.charAt(0) }}</el-avatar>
                  <span>{{ category.name }}</span>
                </el-menu-item>
              </el-menu>
            </el-collapse-item>
          </el-collapse>
         </div>

      </el-aside>
    </el-container>
  </template>
  
<script>
  import { ref } from 'vue';
  import { HomeFilled, StarFilled, Search, Document, Plus } from '@element-plus/icons-vue'; 
  import { useRouter } from 'vue-router';
  
  export default {
    components: {
      HomeFilled,
      StarFilled,
    },
    setup() {
      const router = useRouter();

      const activeItem = ref('home');
      const categoryOpen = ref(true);

      const categories=ref([
        {id: 1, name: "Javascript", avatar:"" },
        {id: 2, name: "Python", avatar:""}
      ])
  
      const handleSelect = (index) => {
        activeItem.value = index;
      };

      /**
       * click home button to redirect to home page
       */
      const clickHome = ()=>{
        router.push("/home");
      }
  
      return {
        activeItem,
        categoryOpen,
        categories,
        handleSelect,
        clickHome,
      };
    },
  };
</script>
  
  <style scoped>
  .sidebar {
    background-color: #ffffff;
    padding: 5px;
    height: 100vh;
    border-right: 1px solid #ddd;
    position: fixed;
    left: 0;
    top: 0;
  }
  
  .el-menu-vertical-demo {
    border-right: none;
  }
  
  .section {
    margin-top: 20px;
  }
  
  .section-title {
    font-size: 12px;
    color: black;
    font-weight: bold;
    margin-bottom: 8px;
  }
  
  .el-menu-item {
    display: flex;
    align-items: center;
  }
  
  .el-menu-item .el-icon {
    margin-right: 10px;
  }
  
  .el-avatar {
    margin-right: 10px;
  }
  </style>
  