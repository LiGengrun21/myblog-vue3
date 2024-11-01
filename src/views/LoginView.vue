<template>
    <div class="logo-container">
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="260" height="260" />
      <p>No account? <RouterLink to="/register">Click here to sign up</RouterLink></p>
    </div>

    <div class="login-container">
      <el-card class="login-card">
        <h2 class="login-title">Login</h2>
        <el-form :model="loginForm" :rules="rules" ref="loginFormRef" label-width="80px">
          <el-form-item label="Username" prop="username">
            <el-input v-model="loginForm.username" placeholder="Enter your username" />
          </el-form-item>
          
          <el-form-item label="Password" prop="password">
            <el-input v-model="loginForm.password" placeholder="Enter your password" show-password />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="onSubmit">Login</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
</template>
  
  <script>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router';
  import { ElMessage } from 'element-plus'
  import '../assets/login.css'
  import {login, setTokens} from '../api/login.js'
  import {useUserStore} from '../stores/userStore.js'
  
  export default {
    name: 'LoginView',
    setup() {
      const router = useRouter();
      const loginForm = ref({
        username: '',
        password: ''
      })

      const userStore = useUserStore(); // pinia to manage userId while login 
  
      const rules = {
        username: [
          { required: true, message: 'Please enter your username', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Please enter your password', trigger: 'blur' }
        ]
      }
  
      const loginFormRef = ref(null)
  
      const onSubmit = () => {
        loginFormRef.value.validate((valid) => {
          if (valid) {
            handleLogin();
          } else {
            ElMessage.error('Please complete the form correctly')
          }
        })
      }

      const handleLogin = async()=>{
        try{
          const data = await login(loginForm.value.username, loginForm.value.password);
          if (data.access && data.refresh){
            ElMessage.success("Login successful");
            // store tokens in the local machine
            localStorage.setItem("access",data.access);
            localStorage.setItem("refresh",data.refresh);
            // store userId in pinia
            userStore.setUserId(data.user_id); 
            console.log("check user_id after login: ", userStore.userId);
            // set access token in header
            setTokens(data.access, data.refresh);
            router.push("/home");
          }
          else{
            ElMessage.warning("Login failed");
          }
        }
        catch(error){
          ElMessage.error("Login failed");
        }
      };
  
      return {
        loginForm,
        rules,
        loginFormRef,
        onSubmit
      }
    }
  }
  </script>
  
  <style scoped>
  .logo-container{
    display: flex;
    flex-direction: column;
    align-items: center; /* 水平居中 */
    justify-content: center; /* 垂直居中 */
    height: 100vh; /* 使容器占满整个视口高度 */
    margin-left: 100px; /**右移 */
  }
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  .login-card {
    width: 700px;
    padding: 25px;
    background-color: rgba(255, 255, 255, 0); /* 设置白色背景并使其50%透明 */
    border-radius: 25px;
  }
  
  .login-title {
    text-align: center;
    margin-bottom: 40px;
    font-family: Arial, sans-serif;
    font-size: 30px;
  }
  </style>
  