<template>
  <div class="login-container">
    <el-form class="login-form"
             autoComplete="on"
             :model="loginForm"
             :rules="loginRules"
             ref="loginForm"
             label-position="left">
      <div class="title-container">
        <h3 class="title"
            style="margin-bottom:15px"></h3>
        <h3 class="title">管理系统</h3>
        <!-- <lang-select class="set-language"></lang-select> -->
      </div>
      <el-form-item prop="userName">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="userName"
                  type="text"
                  v-model="loginForm.userName"
                  autoComplete="on"
                  placeholder="用户名" />
      </el-form-item>

      <el-form-item prop="userPassword">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input name="userPassword"
                  :type="passwordType"
                  v-model="loginForm.userPassword"
                  autoComplete="on"
                  placeholder="密码" />
        <span class="show-pwd"
              @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>

      <div style="width: 450px;height: 54px">
        <div style="float: left">
          <el-form-item prop="verificationCode" style="width: 250px;margin: 0">
            <span class="svg-container">
              <svg-icon icon-class="verificationCode" />
            </span>
            <el-input name="verificationCode"
                      type="text"
                      @keyup.enter.native="handleLogin"
                      v-model="loginForm.verificationCode"
                      autoComplete="on"
                      placeholder="验证码" />
          </el-form-item>
        </div>
        <div class="img">
          <img class="codeImg"
               :src="codeSrc"
               @click="changeCode">
        </div>
      </div>

      <div class="buttons">
        <el-button type="primary"
                   class="login-button"
                   :loading="loading"
                   @click.native.prevent="handleLogin">登录</el-button>

<!--        <el-button type="primary"
                   class="register-button"
                   :loading="loading"
                   @click="toRegister">注册</el-button>-->

        <span class="reset">
          <router-link to="/resetPassword">忘记密码了?</router-link>
        </span>
      </div>

      <!-- <div class="tips">
        <span>{{$t('login.userName')}} : admin</span>
        <span>{{$t('login.userPassword')}} : {{$t('login.any')}}</span>
      </div>
      <div class="tips">
        <span style="margin-right:18px;">{{$t('login.userName')}} : editor</span>
        <span>{{$t('login.userPassword')}} : {{$t('login.any')}}</span>
      </div>

      <el-button class="thirdparty-button"
                 type="primary"
                 @click="showDialog=true">{{$t('login.thirdparty')}}</el-button> -->
    </el-form>

    <!-- <el-dialog :title="$t('login.thirdparty')"
               :visible.sync="showDialog"
               append-to-body>
      {{$t('login.thirdpartyTips')}}
      <br/>
      <br/>
      <br/>
      <social-sign />
    </el-dialog> -->

  </div>
</template>

<script>
// import { isvalidUsername } from '@/utils/validate'
// import { loginByUsername } from '@/api/login/login'
// import LangSelect from '@/components/LangSelect'
// import SocialSign from './socialsignin'

import { request, isNotEmpty } from '@/utils'

export default {
  // components: { LangSelect, SocialSign },
  name: 'login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码至少6位'))
      } else {
        callback()
      }
    }
    const validateVerificationCode = (rule, value, callback) => {
      request({
        url: `/user/validateCode/${this.loginForm.verificationCode}`,
        method: 'get'
      }).then(result => {
        if (isNotEmpty(result.data)) {
          this.flag = false
        } else {
          this.flag = true
        }
      }).finally(() => {
        if (value.length === 0) {
          callback(new Error('请输入验证码'))
        } else if (!this.flag) {
          callback(new Error('验证码不正确'))
        } else {
          callback()
        }
      })
    }
    return {
      // 表格数据
      loginForm: {
        userName: '',
        userPassword: '',
        verificationCode: ''
      },
      // 验证码是否正确
      flag: true,
      // 规则
      loginRules: {
        userName: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        userPassword: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        verificationCode: [
          { required: true, trigger: 'blur', validator: validateVerificationCode }
        ]
      },
      // 密码是否可见
      passwordType: 'password',
      // loading
      loading: false,
      // 是否显示dialog
      // showDialog: false,
      // 图文验证码src
      codeSrc: `${process.env.BASE_API + process.env.PREFIX}/user/validateCode`
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('LoginByUsername', this.loginForm)
            .then(() => {
              this.loading = false
              this.$router.push({ path: '/' })
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    },
    toRegister() {
      this.$router.push('/register')
    },
    changeCode() {
      // 刷新图文验证码
      this.codeSrc = this.codeSrc.split('?')[0] + '?timestamps=' + Date.now()
    },
    afterQRScan() {
      // const hash = window.location.hash.slice(1)
      // const hashObj = getQueryObject(hash)
      // const originUrl = window.location.origin
      // history.replaceState({}, '', originUrl)
      // const codeMap = {
      //   wechat: 'code',
      //   tencent: 'code'
      // }
      // const codeName = hashObj[codeMap[this.auth_type]]
      // if (!codeName) {
      //   alert('第三方登录失败')
      // } else {
      //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
      //     this.$router.push({ path: '/' })
      //   })
      // }
    }
  },
  created() {
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #283442;
$light_gray: #eee;
$white: #ffffff;

/* reset element-ui css */
.login-container {
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
  $white: #ffffff;

  .login-container {
    .login-form {
      margin: 120px auto;
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }
    .thirdparty-button {
      position: absolute;
      right: 35px;
      bottom: 28px;
    }
    .register-div {
      display: inline-block;
    }
    .reset {
      color: $white;
      margin-left: 40px;
      margin-top: 20px;
      font-size: 10px;
      a:hover {
        text-decoration: underline;
        display: inline-block;
      }
    }
    .img {
      width: 160px;
      float: right;
      margin: 8px 5px 5px 5px;
      height: 50px;
      .codeImg {
        width: 85% !important;
        height: 85% !important;

        &:hover {
          cursor: pointer;
        }
      }
    }
  }
</style>
