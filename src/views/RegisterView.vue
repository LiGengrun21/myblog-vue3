<template>
    <div class="logo-container">
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="260" height="260" />
    </div>

    <div class="register-container">
      <el-card class="register-card">
        <h2 class="register-title">Create an Account</h2>
        <el-form :model="registerForm" :rules="rules" ref="registerFormRef" label-width="80px">

          <el-form-item label="Username" prop="username">
            <el-input v-model="registerForm.username" placeholder="Enter your username" />
          </el-form-item>

          <el-form-item label="Email" prop="email">
            <el-input v-model="registerForm.email" placeholder="Enter your email"/>
          </el-form-item>
          
          <el-form-item label="Password" prop="password">
            <el-input v-model="registerForm.password" placeholder="Enter your password" show-password />
          </el-form-item>

          <el-form-item label="Confirm password" prop="password2">
            <el-input v-model="registerForm.password2" placeholder="Enter your password again" show-password/>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="onSubmit">Create account</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
</template>

<script>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import '../assets/login.css'
import {register} from '../api/login.js'
import router from '@/router'
export default{
    name: "RegisterView",
    setup(){
    const registerForm = ref({
        username: '',
        email: '',
        password: '',
        password2: ''
      })

    const registerFormRef = ref(null)

    const rules={
        username: [
            {required: true, message:"Please enter your username" ,trigger: "blur"}
        ],
        password: [
            {required: true, message:"Please enter your password", trigger: "blur"},
            {
                validator:(rule, value, callback)=>{
                    const hasUpperCase=/[A-Z]/.test(value);
                    const hasLowerCase=/[a-z]/.test(value);
                    const hasSpecialChar=/[!@#$%^&*()_+?{}\[\]<>]/.test(value);
                    //console.log(hasLowerCase,hasUpperCase, hasSpecialChar);
                    if (!hasLowerCase||!hasUpperCase||!hasSpecialChar){
                        callback(new Error("Password must contain uppercase, lowercase, and a special character"));
                    }
                    else{
                        callback();
                    }
                },
                trigger: "blur"
            }
        ],
        password2:[
            {required: true, message:"Please enter your password again", trigger: "blur"},
            {
                validator:(rule, value, callback)=>{
                    if (value!=registerForm.value.password){
                        callback(new Error("Passwords don't match"));
                    }
                    else{
                        callback();
                    }
                },
                trigger:"blur"
            }
        ],
        email:[
            {required:true, message:"Please enter your email", trigger: "blur"},
            {
                validator:(rule, value, callback)=>{
                    const isEmail=/^[a-zA-Z0-9-.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(value);
                    //console.log(isEmail);
                    if (!isEmail){
                        callback(new Error("Email format is not correct"));
                    }
                    else{
                        callback();
                    }
                },
                trigger:"blur"
            }
        ]
    }

    const onSubmit=()=>{
        registerFormRef.value.validate((valid) => {
          if (valid) {
            handleRegister();
          } else {
            ElMessage.error('Please complete the form correctly')
          }
        })
    }

    const handleRegister=async()=>{
      //console.log(registerForm);
      try{
        const data = await register(registerForm.value);
        console.log("register successfully returned: ", data.username, data.email);
        ElMessage.success("Created a new Account");
        router.push("/login");
      }catch(error){
        if (error.response.data.username){
          const errorMsg = error.response.data.username[0];
          console.log("error message: ", errorMsg);
          ElMessage.warning(errorMsg);
        }
        else if (error.response.data.email){
          const errorMsg = error.response.data.email[0];
          console.log("error message: ", errorMsg);
          ElMessage.warning(errorMsg);
        }
        else{
          ElMessage.error("An error occurred during sign-up");
        }
      }
    }

    return {
        registerForm,
        registerFormRef,
        rules,
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
  .register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  .register-card {
    width: 700px;
    padding: 25px;
    background-color: rgba(255, 255, 255, 0); /* 设置白色背景并使其50%透明 */
    border-radius: 25px;
  }
  
  .register-title {
    text-align: center;
    margin-bottom: 40px;
    font-family: Arial, sans-serif;
    font-size: 30px;
  }
  </style>
  