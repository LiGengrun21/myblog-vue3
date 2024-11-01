<script lang="ts">
import SideBar from "../components/Sidebar.vue";
import Content from "@/components/Content.vue";
import TopBar from "@/components/TopBar.vue";

export default{
  name: "HomeView",
  components:{
    SideBar,
    Content,
    TopBar,
  },
  setup(){
    
  }
}
</script>

<template>
  <div class="app-container">
   <SideBar/>
   <Content/>
  </div>
</template>

<style scoped>
.app-container {
  height: 100vh;
  display: flex;
}

</style>


