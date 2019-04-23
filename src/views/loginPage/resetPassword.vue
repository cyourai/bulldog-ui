<template>
  <div class="login-container">
    <el-form class="login-form"
             autoComplete="on"
             :model="resetPasswordForm"
             :rules="resetPasswordRules"
             ref="resetPasswordForm"
             label-position="left">
      <div class="title-container">
        <h3 class="title"
            style="margin-bottom:15px"></h3>
        <h3 class="title">管理系统</h3>
      </div>

      <div style="width: 450px;height: 54px;margin-bottom: 20px">
        <div style="float: left">
          <el-form-item prop="userEmail" style="width: 250px;margin: 0">
            <span class="svg-container">
              <svg-icon icon-class="email" />
            </span>
            <el-input name="userEmail"
                      type="text"
                      @keyup.enter.native="handleLogin"
                      v-model="resetPasswordForm.userEmail"
                      autoComplete="false"
                      placeholder="邮箱" />
          </el-form-item>
        </div>
        <div class="button">
          <el-button type="primary"
                     plain
                     style="margin-left: 30px;margin-top: 8px"
                     :disabled="loading"
                     :loading="loading"
                     @click="sendMaileCode">获取验证码</el-button>
        </div>
      </div>

      <el-form-item prop="mailCode">
        <span class="svg-container">
            <svg-icon icon-class="verificationCode" />
          </span>
        <el-input name="mailCode"
                  v-model="resetPasswordForm.mailCode"
                  autoComplete="false"
                  placeholder="验证码"
                  @blur="validEmail"/>
      </el-form-item>

      <el-form-item prop="userPassword">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input name="userPassword"
                  :type="passwordType"
                  v-model="resetPasswordForm.userPassword"
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
                  v-model="resetPasswordForm.userPasswordConfirm"
                  autoComplete="false"
                  placeholder="确认密码" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>

      <div class="buttons">
        <el-button type="primary"
                   class="reset-button"
                   :loading="loading"
                   :disabled="flag"
                   @click="updatePassword">更新密码</el-button>
        <div class="to-login">
          <span class="to-login-for">
            <router-link to="/login">直接登录</router-link>
          </span>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>

import { request } from '@/utils'

export default {
  name: 'resetPassword',
  data() {
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
    const validateMailCode = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请输入邮件中的验证码'))
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
      } else if (LevenshteinDistance.init(value, this.resetPasswordForm.userName).get() > 0.5) {
        callback(new Error('密码不得包含和用户名完整字符串，大小写变位，形似变换的字符串'))
      } else if (similarityString(this.resetPasswordForm.userName, value)) {
        callback(new Error('密码不得包含和用户名完整字符串，大小写变位，形似变换的字符串'))
      } else if (keyboardSortPassword(value)) {
        callback(new Error('密码应避免键盘排序'))
      } else {
        callback()
      }
    }
    const validatePasswordConfirm = (rule, value, callback) => {
      if (value !== this.resetPasswordForm.userPassword) {
        callback(new Error('确认密码与输入密码不符'))
      } else {
        callback()
      }
    }
    return {
      // 表格数据
      resetPasswordForm: {
        userEmail: '',
        mailCode: '',
        userPassword: '',
        userPasswordConfirm: ''
      },
      // 表格规则
      resetPasswordRules: {
        userEmail: [
          { required: true, trigger: 'blur', validator: validateUserEmail }
        ],
        mailCode: [
          { required: true, trigger: 'blur', validator: validateMailCode }
        ],
        userPassword: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        userPasswordConfirm: [
          { required: true, trigger: 'blur', validator: validatePasswordConfirm }
        ]
      },
      // 密码是否可见
      passwordType: 'password',
      // loading
      loading: false,
      // 更改密码标识
      flag: true
    }
  },
  methods: {
    showPwd() {
      // 显示/隐藏密码
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    sendMaileCode() {
      var emailPattern = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/
      if (this.resetPasswordForm.userEmail.length === 0) {
        this.$alert('请输入邮箱')
      } else if (!(emailPattern.test(this.resetPasswordForm.userEmail))) {
        this.$alert('邮箱格式不正确')
      } else {
        request({
          url: '/user/forget/getForgetMailCode',
          method: 'post',
          data: {
            userEmail: this.resetPasswordForm.userEmail
          },
          message: '验证码已发送'
        })
      }
    },
    validEmail() {
      // 校验邮件验证码
      request({
        url: '/user/forget/getValidMailCode',
        method: 'post',
        data: {
          userEmail: this.resetPasswordForm.userEmail,
          mailCode: this.resetPasswordForm.mailCode
        }
      }).then(() => {
        this.flag = false
      }).catch(() => {
        this.flag = true
      })
    },
    updatePassword() {
      // 更新密码
      this.$refs.resetPasswordForm.validate(valid => {
        if (valid) {
          this.loading = true
          request({
            url: '/user/front/permit/updatePassword',
            method: 'put',
            data: {
              userPassword: this.resetPasswordForm.userPassword
            },
            message: '更新用户密码成功'
          }).then(() => {
          }).finally(() => {
            this.loading = false
          })
        }
      })
    }
  },
  created() {
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
