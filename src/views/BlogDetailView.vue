<script lang="ts">
import SideBar from "../components/Sidebar.vue";
import DetailContent from "@/components/DetailContent.vue";
import TopBar from "@/components/TopBar.vue";
import { ref } from "vue";

export default{
  name: "BlogDetailView",
  components:{
    SideBar,
    TopBar,
    DetailContent,
  },
  props: ['id'],
  setup(props){
    const postId=ref();
    postId.value=props.id;
    // console.log("postId is: ", postId.value);
    return{
        postId,
    }
  }
}
</script>

<template>
  <div class="app-container">
   <SideBar/>
   <DetailContent :id="postId"/>
  </div>
</template>

<style scoped>
.app-container {
  height: 100vh;
  display: flex;
}

</style>