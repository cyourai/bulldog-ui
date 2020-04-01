<template>
  <el-menu class="navbar"
           mode="horizontal">
    <hamburger class="hamburger-container"
               :toggleClick="toggleSideBar"
               :isActive="sidebar.opened"></hamburger>

    <breadcrumb class="breadcrumb-container"></breadcrumb>

    <div class="right-menu">

      <!-- 公告栏 -->
<!--      <div id="notice"
           class="notice">
        <Notice class="rowup"
                @noticeList="noticeList"></Notice>
      </div>-->

      <!-- 欢迎标语 -->
      <span class="user-name">欢迎回来，{{userName}}</span>

      <!-- 错误提示 -->
      <error-log class="errLog-container right-menu-item"></error-log>

      <!-- 站内信 -->
      <el-tooltip effect="dark"
                  :content="$t('navbar.MessageBox')"
                  placement="bottom">
        <MessageBox class="messageBox right-menu-item"></MessageBox>
      </el-tooltip>

      <!-- 全屏 -->
      <el-tooltip effect="dark"
                  :content="$t('navbar.screenfull')"
                  placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip>

      <!-- 中英切换 -->
      <!--
      <lang-select class="international right-menu-item"></lang-select>-->

      <!-- 主题色切换 -->
      <!--
     <el-tooltip effect="dark"
                  :content="$t('navbar.theme')"
                  placement="bottom">
        <theme-picker class="theme-switch right-menu-item"></theme-picker>
      </el-tooltip>-->

      <!-- 用户信息 -->
      <el-dropdown class="avatar-container right-menu-item"
                   trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar"
               :src="userAvatar">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              {{$t('navbar.dashboard')}}
            </el-dropdown-item>
          </router-link>
          <!-- <a target='_blank'
             href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>
              {{$t('navbar.github')}}
            </el-dropdown-item>
          </a> -->
          <el-dropdown-item divided>
            <span @click="logout"
                  style="display:block;">{{$t('navbar.logOut')}}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import MessageBox from '@/components/MessageBox'
import Notice from '@/components/Notice'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'
import Bus from '@/utils/bus.js'
import store from '@/store'
import { isEmpty } from '@/utils'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    MessageBox,
    LangSelect,
    ThemePicker,
    Notice
  },
  data() {
    return {
      userAvatar: isEmpty(store.state.user.userAvatar) ? '/static/images/userAvatar.jpg' : store.state.user.userAvatar,
      userName: store.state.user.userName
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'name', 'avatar'])
  },
  watch: {
    userAvatar(old, newVal) {
      this.userAvatar = isEmpty(newVal)
        ? '/static/images/userAvatar.jpg'
        : newVal
    }
  },
  created() {
    this.init()
    // 从bus事件接收更新后的头像
    Bus.$on('userAvatar', userAvatar => {
      this.userAvatar = userAvatar
    })
  },
  methods: {
    init() {
      if (store.state.user.userAvatar !== '') {
        // 从store里拉取用户头像
        this.userAvatar = store.state.user.userAvatar
      }
    },
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    // 接收子组件传来的noticeList
    noticeList(data) {
      document.getElementById('notice').style.opacity =
        data.length === 0 ? '0' : '1'
    },
    toOnekey() {
      window.open(
        process.env.SIGN_SERVER + `/onekey-index`, '_self'
        // 测试用地址
        // 'http://localhost:9527/#/onekey-index', '_self'
      )
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus {
      outline: none;
    }
    .notice /deep/ {
      // width: 600px;
      width: 500px;
      display: inline-block;
      height: 40px;
      line-height: 27px;
      padding: 1px 20px;
      margin: 5px 20px 0 0;
      border: 1px solid #ed0a2b;
      color: #ed0a2b;
      vertical-align: top;
      font-size: 14px;
      .rowup {
        height: 30px;
        .slider-container {
          width: 400px;
          margin-left: 50px;
        }
      }
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .menu {
      width: 20px;
      height: 20px;
      vertical-align: 10px;
      span {
        display: inline-block;
        width: 100%;
        height: 100%;
        cursor: pointer;
      }
      svg {
        width: 100%;
        height: 100%;
        color: #606266;
      }
    }
    .user-name {
      display: inline-block;
      vertical-align: top;
      font-size: 14px;
    }
    .screenfull {
      height: 20px;
    }
    .messageBox {
      height: 20px;
    }
    .international {
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
