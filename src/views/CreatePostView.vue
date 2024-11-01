<script>
import {onMounted, ref, computed} from'vue'
import { ClassicEditor, Bold, Essentials, Italic, Mention, Paragraph, Undo, FontBackgroundColor, FontColor, Underline, Strikethrough, ImageUpload, Image, List, Link, BlockQuote  } from 'ckeditor5';
import { Ckeditor } from '@ckeditor/ckeditor5-vue'
import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';
import SideBar from '@/components/SideBar.vue';
import {fetchTagList, createPost} from '../api/posts.js'
import {useUserStore} from '../stores/userStore.js'
import { useRouter } from 'vue-router';

export default{

    name: "CreatePostView",
    components: {
        Ckeditor,
        SideBar,
    },
    setup(){

        const userStore = useUserStore();
        const userId = computed(()=>userStore.userId); // get userId from userStore

        const router = useRouter();

        // the new post to be created
        const post = ref({
            title: '',
            userId: userId.value,
            tagIds: [],
            content: '<p> Just say something!</p>',
        })

        // available tags
        const availableTags = ref([]) // tag-id: tag-name

        // get available tags
        const getTagList = async()=>{
            try{
              const data = await fetchTagList();
              availableTags.value = data;
              console.log("Tag list data: ", availableTags.value);
            }catch(error){
              console.log("failed to get tags: ", error);
              throw error;
            }
        }
        onMounted(getTagList); 

        // create a new post
        const createNewPost = async()=>{
          try{
            const data = await createPost(post.value);
            console.log("result of creating post: ", data);
          }catch(error){
            throw error;
          }
        }
        
        // click post button to post
        const submitPost = ()=>{
          console.log("form data of the new post: ", post.value);
          // invoke the function to submit the post
          createNewPost().then(()=>{
            // submitted the post successfully
            post.value = {
              title: '',
              userId: userId.value,
              tagIds: [],
              content: '<p> Just say something!</p>',
            };
            router.push("/home");
          }).catch((error)=>{
            console.log("failed to create a new post: ", error);
          });
        };

        return{
            availableTags,
            getTagList,
            post,
            createNewPost,
            submitPost,
            editor: ClassicEditor,
            editorConfig: {
                plugins: [ Bold, Essentials, Italic, Mention, Paragraph, Undo, FontBackgroundColor, FontColor ,Underline, Strikethrough, ImageUpload, Image, Link, List, BlockQuote ],
                toolbar: [ 'undo', 'redo', '|', 'bold', 'italic', 'underline', 'strikethrough', '|', 'fontColor', 'fontBackgroundColor', '|', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'imageUpload', ],
            }
        }
    }
}
</script>

<template>
    <div class="sidebar">
      <SideBar/>
    </div>

    <div class="form-container">
      <el-form label-position="top" size="large">
        <el-form-item label="Title" required>
          <el-input placeholder="Enter title" maxlength="50" show-word-limit v-model="post.title"/>
        </el-form-item>
        <el-form-item label="Tags">
          <el-select multiple placeholder="Choose tags" v-model="post.tagIds">
            <el-option v-for="tag in availableTags" :key="tag.tag_id" :label="tag.tag_name" :value="tag.tag_id"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <ckeditor :editor="editor" :config="editorConfig" v-model="post.content"/>
        </el-form-item>
        <div class="action-buttons">
          <el-button type="success" @click="submitPost">Post</el-button>
        </div>
    </el-form>
    </div>
   
  </template>

<style scoped>
.form-container{
    height: 100vh;
    width: 800px;
    position: relative; /**move the container to left */
    left: -150px
}
.action-buttons{
    text-align: right;
}
</style>

<style>    /**don't add scoped to it, because it's rendered separately*/
.ck-editor__editable {
    height: 600px;
    width: 800px;
    color: #333333;  /** This is the default color shown in the page, not has to be same as the color of the submitted text content */
}
</style>