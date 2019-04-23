<template>
  <div class="login-container">
    <el-form class="login-form"
             autoComplete="on"
             :model="registerForm"
             :rules="registerRules"
             ref="registerForm"
             label-position="left">
      <div class="title-container">
        <h3 class="title"
            style="margin-bottom:15px"></h3>
        <h3 class="title">管理系统</h3>
      </div>

      <el-form-item prop="userName">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="userName"
                  type="text"
                  v-model="registerForm.userName"
                  autoComplete="false"
                  placeholder="用户名" />
      </el-form-item>

      <el-form-item prop="userNickName">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="userNickName"
                  type="text"
                  v-model="registerForm.userNickName"
                  autoComplete="false"
                  placeholder="中文名" />
      </el-form-item>

      <el-form-item prop="userPassword">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input name="userPassword"
                  :type="passwordType"
                  v-model="registerForm.userPassword"
                  autoComplete="false"
                  placeholder="密码" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>

      <el-form-item prop="userPasswordConfirm">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input name="userPasswordConfirm"
                  :type="passwordType"
                  v-model="registerForm.userPasswordConfirm"
                  autoComplete="false"
                  placeholder="确认密码" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>

      <el-form-item prop="userMobile">
        <span class="svg-container">
          <svg-icon icon-class="mobile" />
        </span>
        <el-input name="userMobile"
                  v-model="registerForm.userMobile"
                  autoComplete="false"
                  placeholder="手机号" />
      </el-form-item>

      <el-form-item prop="userEmail">
        <span class="svg-container">
          <svg-icon icon-class="email" />
        </span>
        <el-input name="userEmail"
                  v-model="registerForm.userEmail"
                  autoComplete="false"
                  placeholder="邮箱" />
      </el-form-item>

      <div class="buttons">
        <el-button type="primary"
                   class="login-button"
                   :loading="loading"
                   @click="register">注册</el-button>
        <div class="to-login">
          <span class="to-login-for">
          <router-link to="/login">已注册？直接登录</router-link>
        </span>
        </div>
      </div>

    </el-form>
  </div>
</template>

<script>

import { request } from '@/utils'
import { setToken } from '@/utils/auth'

export default {
  name: 'register',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validateUserNickName = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请输入中文名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      var passwordPattern = /^(?![a-zA-Z]+$)(?![a-z\d]+$)(?![a-z!@#\$%]+$)(?![A-Z\d]+$)(?![A-Z!@#\$%]+$)(?![\d!@#\$%]+$)[a-zA-Z\d!@#\$%]+$/
      var LevenshteinDistance
      LevenshteinDistance = {
        str1: null,
        str3: null,
        matrix: null,
        isString(s) {
          return Object.prototype.toString.call(s) === '[object String]'
        },
        isNumber(s) {
          return Object.prototype.toString.call(s) === '[object Number]'
        },
        init(str1, str2) {
          if (!this.isString(str1) || !this.isString(str2)) return

          this.str1 = str1
          this.str2 = str2

          str1.length && str2.length && this.createMatrix(str1.length + 1, str2.length + 1)
          this.matrix && this.initMatrix()

          return this
        },
        get() {
          return 1 - this.getDistance() / Math.max(this.str1.length, this.str2.length)
        },
        // 计算编辑距离
        getDistance: function() {
          var len1 = this.str1.length
          var len2 = this.str2.length

          if (!len1 || !len2) return Math.max(len1, len2)

          var str1 = this.str1.split('')
          var str2 = this.str2.split('')

          var i = 0
          var j = 0
          var temp = 0
          while (i++ < len1) {
            j = 0
            while (j++ < len2) {
              temp = str1[i - 1] === str2[j - 1] ? 0 : 1
              this.matrix[i][j] = Math.min(this.matrix[i - 1][j] + 1, this.matrix[i][j - 1] + 1, this.matrix[i - 1][j - 1] + temp)
            }
          }
          return this.matrix[i - 1][j - 1]
        },
        /*
         * 初始化矩阵
         * 为第一行、第一列赋值
         */
        initMatrix: function() {
          var cols = this.matrix[0].length
          var rows = this.matrix.length
          var l = Math.max(cols, rows)
          while (l--) {
            cols - 1 >= l && (this.matrix[0][l] = l)
            rows - 1 >= l && (this.matrix[l][0] = l)
          }
        },
        /*
         * 创建矩阵
         * n:行
         * m:列
         */
        createMatrix: function(n, m) {
          if (!this.isNumber(n) || !this.isNumber(m) || n < 1 || m < 1) return

          this.matrix = new Array(n)
          var i = 0
          while (i < n) this.matrix[i++] = new Array(m)
        }
      }
      function similarityString(user, pwd) {
        // 不得包含和用户名完整字符串，大小写变位的字符串
        if (pwd.indexOf(user) !== -1 ||
          pwd.toLocaleUpperCase().indexOf(user.toLocaleUpperCase()) !== -1) {
          return true
        }
        // 形似变换(编辑距离算法，编辑距离越小，字符串相似程度越大)
        // if (similarity(user, pwd) > 0.8) {
        //   return true
        // }
        return false
      }
      function keyboardSortPassword(pwd) {
        pwd = pwd.toLocaleLowerCase()
        var i = 0
        var arr = ['1234567890', 'qwertyuiop[]', '|asdfghjklzxcvbnm', '~!@#$%^&*()_+']
        for (i = 0; i < arr.length; i++) {
          if (arr[i].indexOf(pwd) !== -1) {
            break
          }
        }
        if (i < arr.length) {
          return true
        }
        return false
      }
      if (value.length < 8) {
        callback(new Error('密码至少8位'))
      } else if (!(passwordPattern.test(value))) {
        callback(new Error('密码至少包括数字，小写字母，大写字母，特殊符号4类中的3类'))
      } else if (LevenshteinDistance.init(value, this.registerForm.userName).get() > 0.5) {
        callback(new Error('密码不得包含和用户名完整字符串，大小写变位，形似变换的字符串'))
      } else if (similarityString(this.registerForm.userName, value)) {
        callback(new Error('密码不得包含和用户名完整字符串，大小写变位，形似变换的字符串'))
      } else if (keyboardSortPassword(value)) {
        callback(new Error('密码应避免键盘排序'))
      } else {
        callback()
      }
    }
    const validatePasswordConfirm = (rule, value, callback) => {
      if (value !== this.registerForm.userPassword) {
        callback(new Error('确认密码与输入密码不符'))
      } else {
        callback()
      }
    }
    const validateUserMobile = (rule, value, callback) => {
      var phonePattern = /^[1][3,4,5,7,8][0-9]{9}$/
      if (value.length === 0) {
        callback(new Error('请输入手机号'))
      } else if (value.length !== 0 && !(phonePattern.test(value))) {
        callback(new Error('手机号格式不正确'))
      } else {
        callback()
      }
    }
    const validateUserEmail = (rule, value, callback) => {
      var emailPattern = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/
      if (value.length === 0) {
        callback(new Error('请输入邮箱'))
      } else if (value.length !== 0 && !(emailPattern.test(value))) {
        callback(new Error('邮箱格式不正确'))
      } else {
        callback()
      }
    }
    return {
      // 表格数据
      registerForm: {
        userName: '',
        userNickName: '',
        userPassword: '',
        userPasswordConfirm: '',
        userMobile: '',
        userEmail: ''
      },
      // 密码是否可见
      passwordType: 'password',
      // 注册规则
      registerRules: {
        userName: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        userNickName: [
          { required: true, trigger: 'blur', validator: validateUserNickName }
        ],
        userPassword: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        userPasswordConfirm: [
          { required: true, trigger: 'blur', validator: validatePasswordConfirm }
        ],
        userMobile: [
          { required: true, trigger: 'blur', validator: validateUserMobile }
        ],
        userEmail: [
          { required: true, trigger: 'blur', validator: validateUserEmail }
        ]
      },
      // loading
      loading: false
    }
  },
  created() {
  },
  methods: {
    showPwd() {
      // 显示密码
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    register() {
      // 注册
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true
          request({
            url: '/user/front/permit/singup',
            method: 'post',
            data: {
              userName: this.registerForm.userName,
              userNickName: this.registerForm.userNickName,
              userPassword: this.registerForm.userPassword,
              userMobile: this.registerForm.userMobile,
              userEmail: this.registerForm.userEmail,
              roles: [{ roleKey: 'admin' }]
            }
          }).then(result => {
            setToken(result.data.token)
            this.$router.push('/login')
          })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg: #283442;
  $light_gray: #eee;
  $white: #ffffff;

  /* reset element-ui css */
  .login-container {
    .login-form {
      margin: 70px auto;
    }
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        background: transparent;
        border: 0px;
         -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        &:-webkit-autofill {
           -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
           -webkit-text-fill-color: #fff !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
      padding: 1px 0;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/styles/smart-ui/login.scss';
</style>
