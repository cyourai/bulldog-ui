<template>
  <div class="container">
    <div class='navbar'>
      <div class='navbar-inner'>
        <div class='container'>
          <a class='brand'
             href='/'
             style="color : #fff">

            <img src="/public/images/vue.png" /> Vue.js

          </a>

          <form id='search_form'
                class='navbar-search'
                action="/search">
            <input type='text'
                   id='q'
                   name='q'
                   class='search-query span3'
                   value='' />
          </form>
          <ul class='nav pull-right'>
            <li>
              <a href='/'>首页</a>
            </li>

            <li>
              <a href="#"
                 class="goWechat"
                 data-toggle="modal"
                 data-target="#wechat">微信公众号</a>
            </li>
            <li>
              <a href='http://doc.vue-js.com/'>VUE 2.0</a>
            </li>
            <li>
              <a href='/getstart'>参考资料</a>
            </li>
            <li>
              <a href='/api'>API</a>
            </li>

            <li>
              <a href="/about"
                 target="">关于</a>
            </li>

            <li>
              <a href='/signup'>注册</a>
            </li>
            <li>
              <a href='/signin'>登录</a>
            </li>

          </ul>
          <a class="btn btn-navbar"
             id="responsive-sidebar-trigger">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </a>
        </div>
      </div>
    </div>
    <div id='main'>
      <div id='sidebar'>

        <div class='panel'>

          <div class='inner'>
            <p>Vue：Vue.js专业中文社区</p>

            <div>
              您可以
              <a href='/signin'>登录</a>
              或
              <a href='/signup'>注册</a>
              , 也可以
              <a href="/auth/github">
                <span class="span-info">
                  通过 GitHub 登录
                </span>
              </a>
            </div>
          </div>

        </div>

        <div class='new_panel'>
          <div class='inner new_ads'>
            <img onclick="_hmt.push(['_trackEvent','zhufeng', 'advs', 'click']);window.location.href='http://www.zhufengpeixun.cn/main/course/index.html?ref=zb'"
                 src="http://ooaa8syjw.bkt.clouddn.com/FvhctjLHyPoeNGlanoZeFz0DE1LS">
            <a href="mailto:vueclub@126.com?subject=赞助vue中文社区"
               target="_blank">赞助商</a>
          </div>
          <div class='inner new_ads'
               style="margin-top: 5px">
            <img onclick="_hmt.push(['_trackEvent','taosheng', 'advs', 'click']);window.location.href='https://bbs.we7.cc/thread-32436-1-1.html?hmsr=vue&hmpl=&hmcu=&hmkw=&hmci='"
                 src="http://ooaa8syjw.bkt.clouddn.com/Fo-BQkQJk3dHYQVcDu5NR-ArkOQi">
            <a href="mailto:vueclub@126.com?subject=赞助vue中文社区"
               target="_blank">赞助商</a>
          </div>
        </div>
        <div class='panel'>
          <div class='inner ads'>

            <a href="/nav.html"
               target="_blank"
               class="banner sponsor_outlink"
               data-label="web navigation">
              <img src="https://user-images.githubusercontent.com/9276376/27581837-70cf9944-5b61-11e7-8d76-72cfc3856dad.png"
                   style="width:100%;height:45px;">
            </a>

            <div class="sep5"></div>

            <a href="http://www.react-d.com/api/"
               target="_blank"
               class="banner sponsor_outlink"
               data-label="fruit-ui">
              <img src="https://cloud.githubusercontent.com/assets/9276376/18077980/92747c60-6ebb-11e6-9a6c-e65bfe42d45e.png"
                   style="width:100%;height:45px;">
            </a>

            <div class="sep5"></div>

            <a href="http://weekly.vue-js.com/#/"
               target="_blank"
               class="banner sponsor_outlink"
               data-label="weekly">
              <img src="https://user-images.githubusercontent.com/9276376/30099651-eb36c06a-9318-11e7-8987-2da1bb2b3e13.png"
                   style="width:100%;height:45px;">
            </a>

            <div class="sep5"></div>

            <a href="https://promotion.aliyun.com/ntms/act/ambassador/sharetouser.html?userCode=m5qa9mqc&utm_source=m5qa9mqc"
               target="_blank"
               class="banner sponsor_outlink"
               data-label="fruit-ui">
              <img src="https://user-images.githubusercontent.com/9276376/30099311-fd5c02f6-9317-11e7-8103-abb77c02fb40.png"
                   style="width:100%;height:45px;">
            </a>

          </div>
        </div>

        <div class='panel'>
          <div class='header'>
            <span class='col_fade'>无人回复的话题</span>
          </div>
          <div class='inner'>

            <ul class="unstyled">
              <li>
                <div>
                  <a class='dark topic_title'
                     href="/topic/5b8e4259e1b3091b17d30aac"
                     title="vue+elementUI项目，使用xlsx和file-saver导出excel表格时报错">vue+elementUI项目，使用xlsx和file-saver导出excel表格时报错</a>
                </div>
              </li>
              <li>
                <div>
                  <a class='dark topic_title'
                     href="/topic/5b8e1f43e1b3091b17d30a9e"
                     title="vue-cli 3.x 使用ts时引入模块报错">vue-cli 3.x 使用ts时引入模块报错</a>
                </div>
              </li>
              <li>
                <div>
                  <a class='dark topic_title'
                     href="/topic/5b8d0f30e1b3091b17d30a94"
                     title="【上海松江九亭，急招】招聘VUE工程师">【上海松江九亭，急招】招聘VUE工程师</a>
                </div>
              </li>
              <li>
                <div>
                  <a class='dark topic_title'
                     href="/topic/5b8cd272e1b3091b17d30a82"
                     title="React、Redux、Dva、Ant Design 全家桶视频分享">React、Redux、Dva、Ant Design 全家桶视频分享</a>
                </div>
              </li>
              <li>
                <div>
                  <a class='dark topic_title'
                     href="/topic/5b88e144e1b3091b17d30a5a"
                     title="全面兼容第三方框架的vue组件开发方案，可以在 angular，jquery，react等所有框架中使用vue组件">全面兼容第三方框架的vue组件开发方案，可以在 angular，jquery，react等所有框架中使用vue组件</a>
                </div>
              </li>

            </ul>

          </div>
        </div>

        <div class='panel'>
          <div class='header'>
            <span class='col_fade'>积分榜</span>
            &nbsp;
            <a class='dark'
               href='/users/top100'>TOP 100 &gt;&gt;</a>
          </div>

        </div>

        <div class='panel'>
          <div class='header'>
            <span class='col_fade'>社区交流群</span>
          </div>
          <div class='inner club'>
            <div>
              <img width='200'
                   src="https://user-images.githubusercontent.com/9276376/30367105-de95534e-989f-11e7-8c43-039222352121.png">
              <br />
              <a>微信扫码关注</a>
            </div>
            <div>
              <img width='200'
                   src="https://cloud.githubusercontent.com/assets/9276376/20613626/b317ca38-b300-11e6-940d-33df210cb7ba.png">
              <br />
              <a>QQ扫码快速入群</a>
            </div>

          </div>
        </div>
        <div class='panel'>
          <div class='header'>
            <span class='col_fade'>友情社区</span>
          </div>
          <div class='inner'>
            <ol class="friendship-community">
              <li>
                <a href="https://www.getweapp.com/"
                   target="_blank">
                  微信小程序学习社群
                </a>
              </li>
              <li>
                <a href="http://www.ctolib.com/"
                   target="_blank">
                  CTOLib码库
                </a>
              </li>
              <li>
                <a href="//www.hubwiz.com/"
                   target="_blank">
                  汇智网
                </a>
              </li>
              <li>
                <a href="https://www.w3cvip.org"
                   target="_blank">
                  w3c社区-前端专业综合性技术交流平台
                </a>
              </li>
              <li>
                <a href="//juejin.im"
                   target="_blank">
                  掘金-帮助开发者成长的社区
                </a>
              </li>
            </ol>
          </div>
        </div>
      </div>

      <div id="content">
        <div class="panel">
          <div class="header">

            <a href="/?tab=all"
               class="topic-tab ">全部</a>

            <a href="/?tab=good"
               class="topic-tab ">精华</a>

            <a href="/?tab=weex"
               class="topic-tab ">weex</a>

            <a href="/?tab=share"
               class="topic-tab ">分享</a>

            <a href="/?tab=ask"
               class="topic-tab current-tab">问答</a>

            <a href="/?tab=job"
               class="topic-tab ">招聘</a>

          </div>

          <div class="inner no-padding">
            <div id="topic_list">
              <div class='cell'>

                <a class="user_avatar pull-left"
                   href="/user/xiaowen9527">
                  <img src="https://avatars3.githubusercontent.com/u/15827087?v=4&amp;s=120"
                       title="xiaowen9527" />
                </a>

                <span class="reply_count pull-left">
                  <span class="count_of_replies"
                        title="回复数">
                    2
                  </span>
                  <span class="count_seperator">/</span>
                  <span class="count_of_visits"
                        title='点击数'>
                    58
                  </span>
                </span>

                <a class='last_time pull-right'
                   href="/topic/5b8e6b45ead64ac05b70e30a#5b8f40f7ead64ac05b70e311">
                  <img class="user_small_avatar"
                       src="https://avatars3.githubusercontent.com/u/15827087?v=4&amp;s=120">
                  <span class="last_active_time">22分钟前</span>
                </a>

                <div class="topic_title_wrapper">

                  <a class='topic_title'
                     href='/topic/5b8e6b45ead64ac05b70e30a'
                     title='vue如何关闭当前窗口？？'>
                    vue如何关闭当前窗口？？
                  </a>
                </div>
              </div>
              <div class='cell'>

                <a class="user_avatar pull-left"
                   href="/user/86driver">
                  <img src="https://avatars2.githubusercontent.com/u/38236070?v=4&amp;s=120"
                       title="86driver" />
                </a>

                <span class="reply_count pull-left">
                  <span class="count_of_replies"
                        title="回复数">
                    2
                  </span>
                  <span class="count_seperator">/</span>
                  <span class="count_of_visits"
                        title='点击数'>
                    103
                  </span>
                </span>

                <a class='last_time pull-right'
                   href="/topic/5b8d301ae1b3091b17d30a97#5b8e95e3ead64ac05b70e30d">
                  <img class="user_small_avatar"
                       src="https://avatars2.githubusercontent.com/u/38236070?v=4&amp;s=120">
                  <span class="last_active_time">13小时前</span>
                </a>

                <div class="topic_title_wrapper">

                  <a class='topic_title'
                     href='/topic/5b8d301ae1b3091b17d30a97'
                     title='请问有没有大佬自己写过vue社区的开源项目'>
                    请问有没有大佬自己写过vue社区的开源项目
                  </a>
                </div>
              </div>
              <div class='cell'>

                <a class="user_avatar pull-left"
                   href="/user/shu-chuan">
                  <img src="https://avatars3.githubusercontent.com/u/20960848?v=4&amp;s=120"
                       title="shu-chuan" />
                </a>

                <span class="reply_count pull-left">
                  <span class="count_of_replies"
                        title="回复数">
                    0
                  </span>
                  <span class="count_seperator">/</span>
                  <span class="count_of_visits"
                        title='点击数'>
                    62
                  </span>
                </span>

                <span class='last_time pull-right'>
                  <span class="last_active_time">18小时前</span>
                </span>

                <div class="topic_title_wrapper">

                  <a class='topic_title'
                     href='/topic/5b8e4259e1b3091b17d30aac'
                     title='vue+elementUI项目，使用xlsx和file-saver导出excel表格时报错'>
                    vue+elementUI项目，使用xlsx和file-saver导出excel表格时报错
                  </a>
                </div>
              </div>
              <div class='cell'>

                <a class="user_avatar pull-left"
                   href="/user/1029110628">
                  <img src="//gravatar.com/avatar/2dc8d6f5f00680052f57c8d0897d515f?size=48"
                       title="1029110628" />
                </a>

                <span class="reply_count pull-left">
                  <span class="count_of_replies"
                        title="回复数">
                    2
                  </span>
                  <span class="count_seperator">/</span>
                  <span class="count_of_visits"
                        title='点击数'>
                    79
                  </span>
                </span>

                <a class='last_time pull-right'
                   href="/topic/5b8dfc6ae1b3091b17d30a9c#5b8e39d0e1b3091b17d30aa8">
                  <img class="user_small_avatar"
                       src="//gravatar.com/avatar/2dc8d6f5f00680052f57c8d0897d515f?size=48">
                  <span class="last_active_time">19小时前</span>
                </a>

                <div class="topic_title_wrapper">

                  <a class='topic_title'
                     href='/topic/5b8dfc6ae1b3091b17d30a9c'
                     title='vue-cli 打包之后背景图片变模糊'>
                    vue-cli 打包之后背景图片变模糊
                  </a>
                </div>
              </div>
              <div class='cell'>

                <a class="user_avatar pull-left"
                   href="/user/liwenguang">
                  <img src="https://avatars0.githubusercontent.com/u/19889748?v=4&amp;s=120"
                       title="liwenguang" />
                </a>

                <span class="reply_count pull-left">
                  <span class="count_of_replies"
                        title="回复数">
                    1
                  </span>
                  <span class="count_seperator">/</span>
                  <span class="count_of_visits"
                        title='点击数'>
                    53
                  </span>
                </span>

                <a class='last_time pull-right'
                   href="/topic/5b8df952e1b3091b17d30a9b#5b8e3863e1b3091b17d30aa2">
                  <img class="user_small_avatar"
                       src="//gravatar.com/avatar/e43c3648ba7049e521009b4b73126005?size=48">
                  <span class="last_active_time">19小时前</span>
                </a>

                <div class="topic_title_wrapper">

                  <a class='topic_title'
                     href='/topic/5b8df952e1b3091b17d30a9b'
                     title='v-html不能解析组件 还有其他方法可以吗'>
                    v-html不能解析组件 还有其他方法可以吗
                  </a>
                </div>
              </div>
              <div class='cell'>

                <a class="user_avatar pull-left"
                   href="/user/maopixin">
                  <img src="https://avatars1.githubusercontent.com/u/30068481?v=4&amp;s=120"
                       title="maopixin" />
                </a>

                <span class="reply_count pull-left">
                  <span class="count_of_replies"
                        title="回复数">
                    0
                  </span>
                  <span class="count_seperator">/</span>
                  <span class="count_of_visits"
                        title='点击数'>
                    48
                  </span>
                </span>

                <span class='last_time pull-right'>
                  <span class="last_active_time">21小时前</span>
                </span>

                <div class="topic_title_wrapper">

                  <a class='topic_title'
                     href='/topic/5b8e1f43e1b3091b17d30a9e'
                     title='vue-cli 3.x 使用ts时引入模块报错'>
                    vue-cli 3.x 使用ts时引入模块报错
                  </a>
                </div>
              </div>
              <div class='cell'>

                <a class="user_avatar pull-left"
                   href="/user/ttaccp">
                  <img src="//gravatar.com/avatar/4564c04e0834e000bc503b45f543834b?size=48"
                       title="ttaccp" />
                </a>

                <span class="reply_count pull-left">
                  <span class="count_of_replies"
                        title="回复数">
                    1
                  </span>
                  <span class="count_seperator">/</span>
                  <span class="count_of_visits"
                        title='点击数'>
                    8989
                  </span>
                </span>

                <a class='last_time pull-right'
                   href="/topic/58b913a916e85e176c17735a#5b89f5bde1b3091b17d30a6b">
                  <img class="user_small_avatar"
                       src="https://avatars2.githubusercontent.com/u/29766851?v=4&amp;s=120">
                  <span class="last_active_time">4天前</span>
                </a>

                <div class="topic_title_wrapper">

                  <a class='topic_title'
                     href='/topic/58b913a916e85e176c17735a'
                     title='vue2.0自定义指令如何更改data数据'>
                    vue2.0自定义指令如何更改data数据
                  </a>
                </div>
              </div>
              <div class='cell'>

                <a class="user_avatar pull-left"
                   href="/user/yuanshuai007">
                  <img src="https://avatars2.githubusercontent.com/u/29766851?v=4&amp;s=120"
                       title="yuanshuai007" />
                </a>

                <span class="reply_count pull-left">
                  <span class="count_of_replies"
                        title="回复数">
                    1
                  </span>
                  <span class="count_seperator">/</span>
                  <span class="count_of_visits"
                        title='点击数'>
                    141
                  </span>
                </span>

                <a class='last_time pull-right'
                   href="/topic/5b880d83e1b3091b17d30a55#5b89174ee1b3091b17d30a66">
                  <img class="user_small_avatar"
                       src="//gravatar.com/avatar/e43c3648ba7049e521009b4b73126005?size=48">
                  <span class="last_active_time">5天前</span>
                </a>

                <div class="topic_title_wrapper">

                  <a class='topic_title'
                     href='/topic/5b880d83e1b3091b17d30a55'
                     title='在页面中显示代码'>
                    在页面中显示代码
                  </a>
                </div>
              </div>
              <div class='cell'>

                <a class="user_avatar pull-left"
                   href="/user/gaopengxiang">
                  <img src="https://avatars2.githubusercontent.com/u/23214381?v=4&amp;s=120"
                       title="gaopengxiang" />
                </a>

                <span class="reply_count pull-left">
                  <span class="count_of_replies"
                        title="回复数">
                    0
                  </span>
                  <span class="count_seperator">/</span>
                  <span class="count_of_visits"
                        title='点击数'>
                    133
                  </span>
                </span>

                <span class='last_time pull-right'>
                  <span class="last_active_time">6天前</span>
                </span>

                <div class="topic_title_wrapper">

                  <a class='topic_title'
                     href='/topic/5b87e0f9e1b3091b17d30a51'
                     title='子组件中包含其他组件的情况下如何缓存页面？'>
                    子组件中包含其他组件的情况下如何缓存页面？
                  </a>
                </div>
              </div>
              <div class='cell'>

                <a class="user_avatar pull-left"
                   href="/user/lcoder">
                  <img src="https://avatars2.githubusercontent.com/u/5225853?v=4&amp;s=120"
                       title="lcoder" />
                </a>

                <span class="reply_count pull-left">
                  <span class="count_of_replies"
                        title="回复数">
                    3
                  </span>
                  <span class="count_seperator">/</span>
                  <span class="count_of_visits"
                        title='点击数'>
                    176
                  </span>
                </span>

                <a class='last_time pull-right'
                   href="/topic/5b87591be1b3091b17d30a43#5b879d82e1b3091b17d30a4d">
                  <img class="user_small_avatar"
                       src="https://avatars2.githubusercontent.com/u/5225853?v=4&amp;s=120">
                  <span class="last_active_time">6天前</span>
                </a>

                <div class="topic_title_wrapper">

                  <a class='topic_title'
                     href='/topic/5b87591be1b3091b17d30a43'
                     title='vue-cli3生成的webpack配置（vue inspect）为什么没有presets: [ @babel/preset-env ]的配置？'>
                    vue-cli3生成的webpack配置（vue inspect）为什么没有presets: [ @babel/preset-env ]的配置？
                  </a>
                </div>
              </div>
              <div class='cell'>

                <a class="user_avatar pull-left"
                   href="/user/zyl-lili">
                  <img src="//gravatar.com/avatar/e6d15fd11ee8415e09b93147f4f63521?size=48"
                       title="zyl-lili" />
                </a>

                <span class="reply_count pull-left">
                  <span class="count_of_replies"
                        title="回复数">
                    1
                  </span>
                  <span class="count_seperator">/</span>
                  <span class="count_of_visits"
                        title='点击数'>
                    237
                  </span>
                </span>

                <a class='last_time pull-right'
                   href="/topic/5b83ba86e1b3091b17d309ee#5b875a91e1b3091b17d30a44">
                  <img class="user_small_avatar"
                       src="https://avatars2.githubusercontent.com/u/18630029?v=4&amp;s=120">
                  <span class="last_active_time">6天前</span>
                </a>

                <div class="topic_title_wrapper">

                  <a class='topic_title'
                     href='/topic/5b83ba86e1b3091b17d309ee'
                     title='keepAlive . 和transition 同时作用无效？'>
                    keepAlive . 和transition 同时作用无效？
                  </a>
                </div>
              </div>
              <div class='cell'>

                <a class="user_avatar pull-left"
                   href="/user/tobytoby">
                  <img src="https://avatars0.githubusercontent.com/u/9709287?v=4&amp;s=120"
                       title="tobytoby" />
                </a>

                <span class="reply_count pull-left">
                  <span class="count_of_replies"
                        title="回复数">
                    0
                  </span>
                  <span class="count_seperator">/</span>
                  <span class="count_of_visits"
                        title='点击数'>
                    214
                  </span>
                </span>

                <span class='last_time pull-right'>
                  <span class="last_active_time">13天前</span>
                </span>

                <div class="topic_title_wrapper">

                  <a class='topic_title'
                     href='/topic/5b7e617ee1b3091b17d30979'
                     title='nuxt 加载js  sdk 页面刷新内容不渲染'>
                    nuxt 加载js sdk 页面刷新内容不渲染
                  </a>
                </div>
              </div>
              <div class='cell'>

                <a class="user_avatar pull-left"
                   href="/user/tobytoby">
                  <img src="https://avatars0.githubusercontent.com/u/9709287?v=4&amp;s=120"
                       title="tobytoby" />
                </a>

                <span class="reply_count pull-left">
                  <span class="count_of_replies"
                        title="回复数">
                    0
                  </span>
                  <span class="count_seperator">/</span>
                  <span class="count_of_visits"
                        title='点击数'>
                    186
                  </span>
                </span>

                <span class='last_time pull-right'>
                  <span class="last_active_time">13天前</span>
                </span>

                <div class="topic_title_wrapper">

                  <a class='topic_title'
                     href='/topic/5b7e5f6ae1b3091b17d30978'
                     title='nuxt框架，多次发送同一请求'>
                    nuxt框架，多次发送同一请求
                  </a>
                </div>
              </div>
              <div class='cell'>

                <a class="user_avatar pull-left"
                   href="/user/plutosliu">
                  <img src="https://avatars2.githubusercontent.com/u/33054980?v=4&amp;s=120"
                       title="plutosliu" />
                </a>

                <span class="reply_count pull-left">
                  <span class="count_of_replies"
                        title="回复数">
                    3
                  </span>
                  <span class="count_seperator">/</span>
                  <span class="count_of_visits"
                        title='点击数'>
                    299
                  </span>
                </span>

                <a class='last_time pull-right'
                   href="/topic/5b7cf913e1b3091b17d30934#5b7e12f4e1b3091b17d30966">
                  <img class="user_small_avatar"
                       src="https://avatars2.githubusercontent.com/u/33054980?v=4&amp;s=120">
                  <span class="last_active_time">13天前</span>
                </a>

                <div class="topic_title_wrapper">

                  <a class='topic_title'
                     href='/topic/5b7cf913e1b3091b17d30934'
                     title='求助，页面不显示元素'>
                    求助，页面不显示元素
                  </a>
                </div>
              </div>
              <div class='cell'>

                <a class="user_avatar pull-left"
                   href="/user/505141222">
                  <img src="https://avatars2.githubusercontent.com/u/37398280?v=4&amp;s=120"
                       title="505141222" />
                </a>

                <span class="reply_count pull-left">
                  <span class="count_of_replies"
                        title="回复数">
                    0
                  </span>
                  <span class="count_seperator">/</span>
                  <span class="count_of_visits"
                        title='点击数'>
                    178
                  </span>
                </span>

                <span class='last_time pull-right'>
                  <span class="last_active_time">13天前</span>
                </span>

                <div class="topic_title_wrapper">

                  <a class='topic_title'
                     href='/topic/5b7e1091e1b3091b17d30965'
                     title='求助，vue修改文件无效的问题'>
                    求助，vue修改文件无效的问题
                  </a>
                </div>
              </div>
              <div class='cell'>

                <a class="user_avatar pull-left"
                   href="/user/liwenguang">
                  <img src="https://avatars0.githubusercontent.com/u/19889748?v=4&amp;s=120"
                       title="liwenguang" />
                </a>

                <span class="reply_count pull-left">
                  <span class="count_of_replies"
                        title="回复数">
                    3
                  </span>
                  <span class="count_seperator">/</span>
                  <span class="count_of_visits"
                        title='点击数'>
                    321
                  </span>
                </span>

                <a class='last_time pull-right'
                   href="/topic/5b7d19fbe1b3091b17d3093f#5b7d3c0ee1b3091b17d30955">
                  <img class="user_small_avatar"
                       src="//gravatar.com/avatar/e43c3648ba7049e521009b4b73126005?size=48">
                  <span class="last_active_time">14天前</span>
                </a>

                <div class="topic_title_wrapper">

                  <a class='topic_title'
                     href='/topic/5b7d19fbe1b3091b17d3093f'
                     title='vue-cli3.0打包问题'>
                    vue-cli3.0打包问题
                  </a>
                </div>
              </div>
              <div class='cell'>

                <a class="user_avatar pull-left"
                   href="/user/zs7662">
                  <img src="https://avatars1.githubusercontent.com/u/41998864?v=4&amp;s=120"
                       title="zs7662" />
                </a>

                <span class="reply_count pull-left">
                  <span class="count_of_replies"
                        title="回复数">
                    2
                  </span>
                  <span class="count_seperator">/</span>
                  <span class="count_of_visits"
                        title='点击数'>
                    353
                  </span>
                </span>

                <a class='last_time pull-right'
                   href="/topic/5b7c13c1e1b3091b17d30912#5b7c4ef5e1b3091b17d3091f">
                  <img class="user_small_avatar"
                       src="https://avatars0.githubusercontent.com/u/18413524?v=4&amp;s=120">
                  <span class="last_active_time">14天前</span>
                </a>

                <div class="topic_title_wrapper">

                  <a class='topic_title'
                     href='/topic/5b7c13c1e1b3091b17d30912'
                     title='vue路由切换问题页面不刷新'>
                    vue路由切换问题页面不刷新
                  </a>
                </div>
              </div>
              <div class='cell'>

                <a class="user_avatar pull-left"
                   href="/user/jaction">
                  <img src="https://avatars2.githubusercontent.com/u/17811893?v=4&amp;s=120"
                       title="jaction" />
                </a>

                <span class="reply_count pull-left">
                  <span class="count_of_replies"
                        title="回复数">
                    1
                  </span>
                  <span class="count_seperator">/</span>
                  <span class="count_of_visits"
                        title='点击数'>
                    210
                  </span>
                </span>

                <a class='last_time pull-right'
                   href="/topic/5b7b91a4e1b3091b17d308f3#5b7bd41ee1b3091b17d30908">
                  <img class="user_small_avatar"
                       src="//gravatar.com/avatar/09649061f9b05549a3aea4c145796259?size=48">
                  <span class="last_active_time">15天前</span>
                </a>

                <div class="topic_title_wrapper">

                  <a class='topic_title'
                     href='/topic/5b7b91a4e1b3091b17d308f3'
                     title='iview安装后，依旧报错iview is not defined'>
                    iview安装后，依旧报错iview is not defined
                  </a>
                </div>
              </div>
              <div class='cell'>

                <a class="user_avatar pull-left"
                   href="/user/mrgaow">
                  <img src="//gravatar.com/avatar/0bf1ad96a1479f84bd839523c1dd4d65?size=48"
                       title="mrgaow" />
                </a>

                <span class="reply_count pull-left">
                  <span class="count_of_replies"
                        title="回复数">
                    0
                  </span>
                  <span class="count_seperator">/</span>
                  <span class="count_of_visits"
                        title='点击数'>
                    272
                  </span>
                </span>

                <span class='last_time pull-right'>
                  <span class="last_active_time">19天前</span>
                </span>

                <div class="topic_title_wrapper">

                  <a class='topic_title'
                     href='/topic/5b7666c9e1b3091b17d30882'
                     title='vue页面关闭问题'>
                    vue页面关闭问题
                  </a>
                </div>
              </div>
              <div class='cell'>

                <a class="user_avatar pull-left"
                   href="/user/wjf_net">
                  <img src="//gravatar.com/avatar/8e27d45266bb00ef5e3cc5e7bd883d58?size=48"
                       title="wjf_net" />
                </a>

                <span class="reply_count pull-left">
                  <span class="count_of_replies"
                        title="回复数">
                    0
                  </span>
                  <span class="count_seperator">/</span>
                  <span class="count_of_visits"
                        title='点击数'>
                    159
                  </span>
                </span>

                <span class='last_time pull-right'>
                  <span class="last_active_time">19天前</span>
                </span>

                <div class="topic_title_wrapper">

                  <a class='topic_title'
                     href='/topic/5b7660abe1b3091b17d30881'
                     title='一起报   Cannot read property &amp;#x27;data&amp;#x27; of undefined&amp;quot;'>
                    一起报 Cannot read property &amp;#x27;data&amp;#x27; of undefined&amp;quot;
                  </a>
                </div>
              </div>
              <div class='cell'>

                <a class="user_avatar pull-left"
                   href="/user/taylor">
                  <img src="//gravatar.com/avatar/7e93e1c78f9df4775d57cb04f9581a31?size=48"
                       title="taylor" />
                </a>

                <span class="reply_count pull-left">
                  <span class="count_of_replies"
                        title="回复数">
                    2
                  </span>
                  <span class="count_seperator">/</span>
                  <span class="count_of_visits"
                        title='点击数'>
                    288
                  </span>
                </span>

                <a class='last_time pull-right'
                   href="/topic/5b750f4ae1b3091b17d30844#5b763796e1b3091b17d30877">
                  <img class="user_small_avatar"
                       src="//gravatar.com/avatar/7e93e1c78f9df4775d57cb04f9581a31?size=48">
                  <span class="last_active_time">19天前</span>
                </a>

                <div class="topic_title_wrapper">

                  <a class='topic_title'
                     href='/topic/5b750f4ae1b3091b17d30844'
                     title='第个组件页面顶部都有一个大大的V字图标 要怎么去掉'>
                    第个组件页面顶部都有一个大大的V字图标 要怎么去掉
                  </a>
                </div>
              </div>
              <div class='cell'>

                <a class="user_avatar pull-left"
                   href="/user/ColouredGlaze">
                  <img src="https://avatars1.githubusercontent.com/u/19931697?v=4&amp;s=120"
                       title="ColouredGlaze" />
                </a>

                <span class="reply_count pull-left">
                  <span class="count_of_replies"
                        title="回复数">
                    0
                  </span>
                  <span class="count_seperator">/</span>
                  <span class="count_of_visits"
                        title='点击数'>
                    433
                  </span>
                </span>

                <span class='last_time pull-right'>
                  <span class="last_active_time">20天前</span>
                </span>

                <div class="topic_title_wrapper">

                  <a class='topic_title'
                     href='/topic/5b7543a8e1b3091b17d3085f'
                     title='vue怎么实现这种动态效果'>
                    vue怎么实现这种动态效果
                  </a>
                </div>
              </div>
              <div class='cell'>

                <a class="user_avatar pull-left"
                   href="/user/lemomade">
                  <img src="https://avatars3.githubusercontent.com/u/22953406?v=4&amp;s=120"
                       title="lemomade" />
                </a>

                <span class="reply_count pull-left">
                  <span class="count_of_replies"
                        title="回复数">
                    0
                  </span>
                  <span class="count_seperator">/</span>
                  <span class="count_of_visits"
                        title='点击数'>
                    158
                  </span>
                </span>

                <span class='last_time pull-right'>
                  <span class="last_active_time">20天前</span>
                </span>

                <div class="topic_title_wrapper">

                  <a class='topic_title'
                     href='/topic/5b753e52e1b3091b17d30858'
                     title='IE mounted表单提交数据未绑定问题'>
                    IE mounted表单提交数据未绑定问题
                  </a>
                </div>
              </div>
              <div class='cell'>

                <a class="user_avatar pull-left"
                   href="/user/UprightCedar">
                  <img src="https://avatars1.githubusercontent.com/u/30796282?v=4&amp;s=120"
                       title="UprightCedar" />
                </a>

                <span class="reply_count pull-left">
                  <span class="count_of_replies"
                        title="回复数">
                    3
                  </span>
                  <span class="count_seperator">/</span>
                  <span class="count_of_visits"
                        title='点击数'>
                    245
                  </span>
                </span>

                <a class='last_time pull-right'
                   href="/topic/5b73a69be1b3091b17d30819#5b74e555e1b3091b17d3083e">
                  <img class="user_small_avatar"
                       src="https://avatars1.githubusercontent.com/u/30796282?v=4&amp;s=120">
                  <span class="last_active_time">20天前</span>
                </a>

                <div class="topic_title_wrapper">

                  <a class='topic_title'
                     href='/topic/5b73a69be1b3091b17d30819'
                     title='关于video.js做直播推流和腾讯云跨域问题 （推流软件obs）'>
                    关于video.js做直播推流和腾讯云跨域问题 （推流软件obs）
                  </a>
                </div>
              </div>
              <div class='cell'>

                <a class="user_avatar pull-left"
                   href="/user/yuanshuai007">
                  <img src="https://avatars2.githubusercontent.com/u/29766851?v=4&amp;s=120"
                       title="yuanshuai007" />
                </a>

                <span class="reply_count pull-left">
                  <span class="count_of_replies"
                        title="回复数">
                    1
                  </span>
                  <span class="count_seperator">/</span>
                  <span class="count_of_visits"
                        title='点击数'>
                    284
                  </span>
                </span>

                <a class='last_time pull-right'
                   href="/topic/5b73e943e1b3091b17d30827#5b74d8dfe1b3091b17d3083a">
                  <img class="user_small_avatar"
                       src="//gravatar.com/avatar/e43c3648ba7049e521009b4b73126005?size=48">
                  <span class="last_active_time">20天前</span>
                </a>

                <div class="topic_title_wrapper">

                  <a class='topic_title'
                     href='/topic/5b73e943e1b3091b17d30827'
                     title='v-model的循环绑定'>
                    v-model的循环绑定
                  </a>
                </div>
              </div>
              <div class='cell'>

                <a class="user_avatar pull-left"
                   href="/user/leejingyun">
                  <img src="https://avatars3.githubusercontent.com/u/22773225?v=4&amp;s=120"
                       title="leejingyun" />
                </a>

                <span class="reply_count pull-left">
                  <span class="count_of_replies"
                        title="回复数">
                    2
                  </span>
                  <span class="count_seperator">/</span>
                  <span class="count_of_visits"
                        title='点击数'>
                    251
                  </span>
                </span>

                <a class='last_time pull-right'
                   href="/topic/5b728caae1b3091b17d30802#5b738c67e1b3091b17d30814">
                  <img class="user_small_avatar"
                       src="//gravatar.com/avatar/09649061f9b05549a3aea4c145796259?size=48">
                  <span class="last_active_time">21天前</span>
                </a>

                <div class="topic_title_wrapper">

                  <a class='topic_title'
                     href='/topic/5b728caae1b3091b17d30802'
                     title='关于从后台获取地址绑定到img标签src属性不显示,求解'>
                    关于从后台获取地址绑定到img标签src属性不显示,求解
                  </a>
                </div>
              </div>

            </div>
            <div class='pagination'
                 current_page='1'>
              <ul>

                <li class='disabled'>
                  <a>«</a>
                </li>

                <li class='disabled'>
                  <a>1</a>
                </li>

                <li>
                  <a href='/?tab=ask&amp;page=2'>2</a>
                </li>

                <li>
                  <a href='/?tab=ask&amp;page=3'>3</a>
                </li>

                <li>
                  <a href='/?tab=ask&amp;page=4'>4</a>
                </li>

                <li>
                  <a href='/?tab=ask&amp;page=5'>5</a>
                </li>

                <li>
                  <a>...</a>
                </li>

                <li>
                  <a href='/?tab=ask&amp;page=45'>»</a>
                </li>

              </ul>
            </div>

          </div>

        </div>
      </div>

      <div id="wechat"
           class="modal hide fade"
           tabindex="-1"
           role="dialog"
           aria-labelledby="myModalLabel"
           aria-hidden="true">
        <div class="modal-body">
          <div class="wechatbox">
            <img src="https://user-images.githubusercontent.com/9276376/30367105-de95534e-989f-11e7-8c43-039222352121.png"
                 alt="wechat">
            <p>Vue中文社区 独家公众号，面向前端爱好者， 每日更新最有料的文章，最前沿的资讯,内容包含但不限于Vue,React,Angular,前端工程化...等各种"大保健"知识点,右上角点关注,老司机带你弯道超车,不定期更有各种福利赠送 <br><br>
              <span>👈🏼 亲,微信扫一扫奴家</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div id='backtotop'>回到顶部</div>
    <div id='footer'>
      <div id='footer_main'>
        <div class="links">
          <a class='dark'
             href='/rss'>RSS</a>
          |
          <a class='dark'
             href='https://github.com/febobo/vueClub'>源码地址</a>
        </div>

        <div class='col_fade'>

          <p>

            服务器搭建在
            <a href="http://www.ucloud.cn/?utm_source=zanzhu&utm_campaign=Ionichina&utm_medium=display"><img src="/public/images/ucloud.png"
                   border="0"
                   alt="UCloud云计算" /></a>
            ， 存储赞助商为
            <a href="http://www.qiniu.com/?ref=ionichina"
               target="_blank"
               class="sponsor_outlink"
               data-label="qiniu_bottom">
              <img src="/public/images/qiniu.png"
                   title="七牛云存储"
                   alt="七牛云存储"
                   width="115px" />
            </a>
          </p>
          <p>
            声明：内容均来自于网络，如有侵权行为请发送邮件至vueclub@126.com,我们将在第一时间删除
          </p>
        </div>

      </div>
    </div>
    <div id="sidebar-mask"></div>
  </div>
</template>

<script>
export default {
  name: 'vueClub',
  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
// @import '~@/styles/smart-ui/smart-ui.scss';
</style>
