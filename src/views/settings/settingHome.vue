<template>
  <div class="container" v-loading="loading">
    <el-form :inline="true" label-position="right" label-width="150px" v-if="!loading">
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item title="背景轮播图 推荐尺寸(1440*790)" name="1" style="font-size: 20px">
          <div v-for="(silder, index) in sliderList">
            <el-form-item label="图片地址">
              <el-input v-model="silder.url" :ref="'slider'-index"
                        @focus="activePicDialogHandler('slider', index)"></el-input><br><br>
              <pic-magnify :picUrl="silder.url"></pic-magnify>
            </el-form-item>
            <el-form-item label="文字描述(15字内)">
              <el-input v-model="silder.text" style="width: 260px"></el-input>
            </el-form-item>
          </div>
        </el-collapse-item>
        <el-collapse-item title="电台悬停广告位 推荐尺寸(400*300)" name="2">
          <div v-for="(radio, index) in radioAdList">
            <el-form-item label="标题(10字内)">
              <el-input v-model="radio.title"></el-input>
            </el-form-item>
            <el-form-item label="图片地址">
              <el-input v-model="radio.url"
                        @focus="activePicDialogHandler('radioAd', index)"></el-input><br><br>
              <pic-magnify :picUrl="radio.url"></pic-magnify>
            </el-form-item>
            <el-form-item label="跳转地址">
              <el-input v-model="radio.jumpUrl"></el-input><br><br>
            </el-form-item>
          </div>
        </el-collapse-item>
        <el-collapse-item title="12家媒体主Logo 推荐尺寸(94*62)" name="3">
          <div v-for="(mediaSeller, index) in mediaSellerList">
            <el-form-item label="选择刊例">
              <el-select v-model="mediaSeller.mediaSellerList"
                         size="medium"
                         filterable
                         remote
                         reserve-keyword
                         no-data-text="..."
                         placeholder="请输入刊例名称并选择"
                         @change="selectChangeHandler"
                         @focus="activePicDialogHandler('mediaSeller', index, false)"
                         :remote-method="publishedChangeHandler"
                         :loading="selectLoading">
                <el-option v-for="item in mediaSeller.options"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
              <el-button @click="cleanPublihsedHandler('mediaSeller', index, false)" class="cleanBtn">清除</el-button>
            </el-form-item>
            <el-form-item label="标题(10字以内)">
              <el-input v-model="mediaSeller.title"></el-input>
            </el-form-item>
            <el-form-item label="图片地址">
              <el-input v-model="mediaSeller.url" :ref="'mediaSeller'-index"
                        @focus="activePicDialogHandler('mediaSeller', index)"></el-input><br><br>
              <pic-magnify :picUrl="mediaSeller.url"></pic-magnify>
            </el-form-item>
          </div>
        </el-collapse-item>
        <el-collapse-item title="电台刊例 推荐尺寸(200*200)" name="5">
          <div v-for="(radio, index) in radioShowList">
            <el-form-item label="选择刊例">
              <el-select v-model="radio.radioShowList"
                         size="medium"
                         filterable
                         remote
                         reserve-keyword
                         no-data-text="..."
                         placeholder="请输入刊例名称并选择"
                         @change="selectChangeHandler"
                         @focus="activePicDialogHandler('radio', index, false)"
                         :remote-method="publishedChangeHandler"
                         :loading="selectLoading">
                <el-option v-for="item in radio.options"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="标题(10字以内)">
              <el-input v-model="radio.title"></el-input>
            </el-form-item>
            <el-form-item label="图片地址">
              <el-input v-model="radio.url" :ref="'radiohsow'-index"
                        @focus="activePicDialogHandler('radio', index)"></el-input><br><br>
              <pic-magnify :picUrl="radio.url"></pic-magnify>
            </el-form-item>
          </div>
        </el-collapse-item>
        <el-collapse-item title="电视刊例 推荐尺寸(200*200)" name="6">
          <div v-for="(tv, index) in tvList">
            <el-form-item label="选择刊例">
              <el-select v-model="tv.tvList"
                         size="medium"
                         filterable
                         remote
                         reserve-keyword
                         no-data-text="..."
                         placeholder="请输入刊例名称并选择"
                         @change="selectChangeHandler"
                         @focus="activePicDialogHandler('tv', index, false)"
                         :remote-method="publishedChangeHandler"
                         :loading="selectLoading">
                <el-option v-for="item in tv.options"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="标题(10字以内)">
              <el-input v-model="tv.title"></el-input>
            </el-form-item>
            <el-form-item label="图片地址">
              <el-input v-model="tv.url" :ref="'tv'-index"
                        @focus="activePicDialogHandler('tv', index)"></el-input><br><br>
              <pic-magnify :picUrl="tv.url"></pic-magnify>
            </el-form-item>
          </div>
        </el-collapse-item>
        <el-collapse-item title="网络刊例 推荐尺寸(200*200)" name="7">
          <div v-for="(wechat, index) in wechatList">
            <el-form-item label="选择刊例">
              <el-select v-model="wechat.wechatList"
                         size="medium"
                         filterable
                         remote
                         reserve-keyword
                         no-data-text="..."
                         placeholder="请输入刊例名称并选择"
                         @change="selectChangeHandler"
                         @focus="activePicDialogHandler('wechat', index, false)"
                         :remote-method="publishedChangeHandler"
                         :loading="selectLoading">
                <el-option v-for="item in wechat.options"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="标题(10字以内)">
              <el-input v-model="wechat.title"></el-input>
            </el-form-item>
            <el-form-item label="图片地址">
              <el-input v-model="wechat.url" :ref="'wechat'-index"
                        @focus="activePicDialogHandler('wechat', index)"></el-input><br><br>
              <pic-magnify :picUrl="wechat.url"></pic-magnify>
            </el-form-item>
          </div>
        </el-collapse-item>
        <el-collapse-item title="广播 推荐尺寸(304*200)" name="12">
          <div v-for="(popular, index) in popularList">
            <el-form-item label="选择刊例">
              <el-select v-model="popular.publishedCode"
                         size="medium"
                         filterable
                         remote
                         reserve-keyword
                         no-data-text="..."
                         placeholder="请输入刊例名称并选择"
                         @change="selectChangeHandler"
                         @focus="activePicDialogHandler('popular', index, false)"
                         :remote-method="publishedChangeHandler"
                         :loading="selectLoading">
                <el-option v-for="item in popular.options"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
              <el-button @click="cleanPublihsedHandler('popular', index, false)" class="cleanBtn">清除</el-button>
            </el-form-item>
            <el-form-item label="标题(10字内)">
              <el-input v-model="popular.title"></el-input>
            </el-form-item>
            <el-form-item label="描述(25字内)">
              <el-input v-model="popular.describe"></el-input>
            </el-form-item>
            <el-form-item label="图片地址">
              <el-input v-model="popular.url" :ref="'popular'-index"
                        @focus="activePicDialogHandler('popular', index)"></el-input><br><br>
              <pic-magnify :picUrl="popular.url"></pic-magnify>
            </el-form-item>
          </div>
        </el-collapse-item>
        <el-collapse-item title="电视 推荐尺寸(300*200)" name="13">
          <div v-for="(time, index) in timeList">
            <el-form-item label="选择刊例">
              <el-select v-model="time.publishedCode"
                         size="medium"
                         filterable
                         remote
                         reserve-keyword
                         no-data-text="..."
                         placeholder="请输入刊例名称并选择"
                         @change="selectChangeHandler"
                         @focus="activePicDialogHandler('time', index, false)"
                         :remote-method="publishedChangeHandler"
                         :loading="selectLoading">
                <el-option v-for="item in time.options"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
              <el-button @click="cleanPublihsedHandler('time', index, false)" class="cleanBtn">清除</el-button>
            </el-form-item>
            <el-form-item label="标题(10字内)">
              <el-input v-model="time.title"></el-input>
            </el-form-item>
            <el-form-item label="描述(25字内)">
              <el-input v-model="time.describe"></el-input>
            </el-form-item>
            <el-form-item label="图片地址">
              <el-input v-model="time.url" :ref="'time'-index"
                        @focus="activePicDialogHandler('time', index)"></el-input><br><br>
              <pic-magnify :picUrl="time.url"></pic-magnify>
            </el-form-item>
          </div>
        </el-collapse-item>
        <el-collapse-item title="网络 推荐尺寸(304*200)" name="14">
          <div v-for="(set, index) in setList">
            <el-form-item label="选择刊例">
              <el-select v-model="set.publishedCode"
                         size="medium"
                         filterable
                         remote
                         reserve-keyword
                         no-data-text="..."
                         placeholder="请输入刊例名称并选择"
                         @change="selectChangeHandler"
                         @focus="activePicDialogHandler('set', index, false)"
                         :remote-method="publishedChangeHandler"
                         :loading="selectLoading">
                <el-option v-for="item in set.options"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
                <el-button @click="cleanPublihsedHandler('set', index, false)" class="cleanBtn">清除</el-button>
            </el-form-item>
            <el-form-item label="标题(10字内)">
              <el-input v-model="set.title"></el-input>
            </el-form-item>
            <el-form-item label="描述(25字内)">
              <el-input v-model="set.describe"></el-input>
            </el-form-item>
            <el-form-item label="图片地址">
              <el-input v-model="set.url" :ref="'set'-index"
                        @focus="activePicDialogHandler('set', index)"></el-input><br><br>
              <pic-magnify :picUrl="set.url"></pic-magnify>
            </el-form-item>
          </div>
        </el-collapse-item>
        <el-collapse-item title="综合 推荐尺寸(304*200)" name="15">
          <div v-for="(famous, index) in famousList">
            <el-form-item label="选择刊例">
              <el-select v-model="famous.publishedCode"
                         size="medium"
                         filterable
                         remote
                         reserve-keyword
                         no-data-text="..."
                         placeholder="请输入刊例名称并选择"
                         @change="selectChangeHandler"
                         @focus="activePicDialogHandler('famous', index, false)"
                         :remote-method="publishedChangeHandler"
                         :loading="selectLoading">
                <el-option v-for="item in famous.options"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
                <el-button @click="cleanPublihsedHandler('famous', index, false)" class="cleanBtn">清除</el-button>
            </el-form-item>
            <el-form-item label="标题(10字内)">
              <el-input v-model="famous.title"></el-input>
            </el-form-item>
            <el-form-item label="描述(25字内)">
              <el-input v-model="famous.describe"></el-input>
            </el-form-item>
            <el-form-item label="图片地址">
              <el-input v-model="famous.url" :ref="'famous'-index"
                        @focus="activePicDialogHandler('famous', index)"></el-input><br><br>
              <pic-magnify :picUrl="famous.url"></pic-magnify>
            </el-form-item>
          </div>
        </el-collapse-item>
        <el-collapse-item title="底部广告 推荐尺寸(616*408)" name="16">
          <div v-for="(ad, index) in adFooterList">
            <el-row>
              <el-form-item label="选择刊例">
                <el-select v-model="ad.publishedCode"
                           size="medium"
                           filterable
                           remote
                           reserve-keyword
                           no-data-text="..."
                           placeholder="请输入刊例名称并选择"
                           @change="selectChangeHandler"
                           @focus="activePicDialogHandler('ad', index, false)"
                           :remote-method="publishedChangeHandler"
                           :loading="selectLoading">
                  <el-option v-for="item in ad.options"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
                <el-button @click="cleanPublihsedHandler('ad', index, false)" class="cleanBtn">清除</el-button>
              </el-form-item>
              <el-form-item label="标题(5-10字以内)">
                <el-input v-model="ad.title"></el-input>
              </el-form-item>
              <el-form-item label="描述(20-25字内)">
                <el-input v-model="ad.describe"></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="图片地址">
                <el-input v-model="ad.url" :ref="'ad'-index"
                          @focus="activePicDialogHandler('ad', index)"></el-input><br><br>
                <pic-magnify :picUrl="ad.url"></pic-magnify>
              </el-form-item>
            </el-row>
          </div>
        </el-collapse-item>
        <el-collapse-item title="友情链接 推荐尺寸(210*134)" name="17">
          <div v-for="(link, index) in linkList">
            <el-form-item label="图片地址">
              <el-input v-model="link.url"
                        @focus="activePicDialogHandler('link', index)"></el-input><br><br>
              <pic-magnify :picUrl="link.url"></pic-magnify>
            </el-form-item>
            <el-form-item label="跳转地址">
              <el-input v-model="link.jumpUrl"></el-input><br><br>
            </el-form-item>
          </div>
        </el-collapse-item>
      </el-collapse>
      <el-row class="form-content-submit">
        <el-col :span="18"
                :offset="5"
                style="margin-top: 10px"
                class="text-center">
          <el-form-item>
            <el-button type="primary" :disabled="selectLoading"
                       icon="el-icon-edit"
                       @click="save"> 保 存
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <vue-dialog :visible="visible"
                :title='"图片库"'
                :type='"PhotoGallery"'
                :width='"80%"'
                @closeHandler="visible=false"
                @confirmHandler="confirmHandler"></vue-dialog>
  </div>
</template>

<script>
  import { PicMagnify, VueDialog } from 'cyourai-vue-dialog'
  import { isEmpty, request } from '@/utils'
  import { insert, update, selectSettingByGroup } from '@/api/settings/settings'
  import { getByCode } from '@/api/published/published'

  export default {
    name: 'setting',
    components: { PicMagnify, VueDialog },
    data() {
      return {
        loading: false,
        selectLoading: false,
        visible: false,
        activeName: '',
        errorUrl: '/static/images/404.jpg',
        setting: {},
        selectOptions: [],
        activeOptions: { type: '', index: 0 },
        // 图片库对应的form字段
        activeField: {},
        // title字段
        pageTitle: '首页参数',
        // 背景轮播图
        sliderList: [
          {
            url: 'http://yaqun-smart.oss-cn-beijing.aliyuncs.com/1534110232',
            text: '中国山东于纽约城市中心时代广场电视墙大屏广告宣传案例'
          },
          {
            url: 'http://yaqun-smart.oss-cn-beijing.aliyuncs.com/1534110232',
            text: '中国山东于纽约城市中心时代广场电视墙大屏广告宣传案例'
          },
          {
            url: 'http://yaqun-smart.oss-cn-beijing.aliyuncs.com/1534110232',
            text: '中国山东于纽约城市中心时代广场电视墙大屏广告宣传案例'
          }
        ],
        radioAdList: [
          { url: '', title: '', jumpUrl: '' },
          { url: '', title: '', jumpUrl: '' },
          { url: '', title: '', jumpUrl: '' }
        ],
        radioShowList: [
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] }
        ],
        mediaSellerList: [
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] }
        ],
        tvList: [
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] }
        ],
        wechatList: [
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', publishedCode: '', mediaSellerTypeCode: '', options: [] }
        ],
        popularList: [
          { url: '', title: '', describe: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', describe: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', describe: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', describe: '', publishedCode: '', mediaSellerTypeCode: '', options: [] }],
        timeList: [
          { url: '', title: '', describe: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', describe: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', describe: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', describe: '', publishedCode: '', mediaSellerTypeCode: '', options: [] }],
        setList: [
          { url: '', title: '', describe: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', describe: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', describe: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', describe: '', publishedCode: '', mediaSellerTypeCode: '', options: [] }],
        famousList: [
          { url: '', title: '', describe: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', describe: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', describe: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', describe: '', publishedCode: '', mediaSellerTypeCode: '', options: [] }],
        adFooterList: [
          { url: '', title: '', describe: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', describe: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', describe: '', publishedCode: '', mediaSellerTypeCode: '', options: [] },
          { url: '', title: '', describe: '', publishedCode: '', mediaSellerTypeCode: '', options: [] }
        ],
        linkList: [
          { url: '', jumpUrl: '' }, { url: '', jumpUrl: '' },
          { url: '', jumpUrl: '' }, { url: '', jumpUrl: '' },
          { url: '', jumpUrl: '' }, { url: '', jumpUrl: '' },
          { url: '', jumpUrl: '' }, { url: '', jumpUrl: '' },
          { url: '', jumpUrl: '' }, { url: '', jumpUrl: '' },
          { url: '', jumpUrl: '' }, { url: '', jumpUrl: '' },
          { url: '', jumpUrl: '' }, { url: '', jumpUrl: '' },
          { url: '', jumpUrl: '' }, { url: '', jumpUrl: '' },
          { url: '', jumpUrl: '' }, { url: '', jumpUrl: '' },
          { url: '', jumpUrl: '' }, { url: '', jumpUrl: '' }
        ]
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        // 初始化选择刊例
        this.selectLoading = true
        request({
          url: '/media/published/select/',
          method: 'get'
        }).then(result => {
          this.selectOptions = result.data.options
          this.loading = true
          selectSettingByGroup('home').then(result => {
            if (result.data.settingList && result.data.settingList.length > 0) {
              this.setting = result.data.settingList[0]
              try {
                // debugger
                const json = JSON.parse(this.setting.settingValue)
                if (json.sliderList.length > 0) this.sliderList = json.sliderList
                if (json.radioAdList.length > 0) this.radioAdList = json.radioAdList
                if (json.radioShowList.length > 0) this.radioShowList = json.radioShowList
                if (json.mediaSellerList.length > 0) this.mediaSellerList = json.mediaSellerList
                if (json.tvList.length > 0) this.tvList = json.tvList
                if (json.wechatList.length > 0) this.wechatList = json.wechatList
                if (json.popularList.length > 0) this.popularList = json.popularList
                if (json.timeList.length > 0) this.timeList = json.timeList
                if (json.setList.length > 0) this.setList = json.setList
                if (json.famousList.length > 0) this.famousList = json.famousList
                if (json.adFooterList.length > 0) this.adFooterList = json.adFooterList
                if (json.linkList.length > 0) this.linkList = json.linkList
                const list = [this.sliderList, this.radioShowList, this.popularList, this.timeList, this.setList, this.famousList, this.adFooterList]
                for (let i = 0; i < list.length; i++) {
                  for (let j = 0; j < list[i].length; j++) {
                    list[i][j].options = this.selectOptions
                  }
                }
              } catch (e) {
                console.error(e)
              }
            }
          }).finally(result => {
            this.loading = false
          })
        }).finally(() => {
          this.selectLoading = false
        })
      },
      activePicDialogHandler(type, index, visable) {
        if (isEmpty(visable)) {
          this.visible = true
        } else {
          this.visible = visable
        }
        if (type === 'slider') {
          this.activeField = this.sliderList[index]
        } else if (type === 'mediaSeller') {
          this.activeField = this.mediaSellerList[index]
        } else if (type === 'radioAd') {
          this.activeField = this.radioAdList[index]
        } else if (type === 'radio') {
          this.activeField = this.radioShowList[index]
        } else if (type === 'tv') {
          this.activeField = this.tvList[index]
        } else if (type === 'wechat') {
          this.activeField = this.wechatList[index]
        } else if (type === 'popular') {
          this.activeField = this.popularList[index]
        } else if (type === 'time') {
          this.activeField = this.timeList[index]
        } else if (type === 'set') {
          this.activeField = this.setList[index]
        } else if (type === 'famous') {
          this.activeField = this.famousList[index]
        } else if (type === 'ad') {
          this.activeField = this.adFooterList[index]
        } else if (type === 'link') {
          this.activeField = this.linkList[index]
        }
      },
      confirmHandler(params) {
        // 图片库确认按钮回调
        this.visible = false
        if (Array.isArray(params.galleryList) && params.galleryList.length > 0) {
          this.activeField.url = params.galleryList[0]
        }
      },
      save() {
        const list = [this.sliderList, this.radioShowList, this.popularList, this.timeList, this.setList,
          this.famousList, this.adFooterList, this.linkList]
        for (let i = 0; i < list.length; i++) {
          for (let j = 0; j < list[i].length; j++) {
            list[i][j].options = []
          }
        }
        const param = {}
        param.sliderList = this.sliderList
        param.radioShowList = this.radioShowList
        param.mediaSellerList = this.mediaSellerList
        param.wechatList = this.wechatList
        param.tvList = this.tvList
        param.radioAdList = this.radioAdList
        param.popularList = this.popularList
        param.timeList = this.timeList
        param.setList = this.setList
        param.famousList = this.famousList
        param.adFooterList = this.adFooterList
        param.linkList = this.linkList
        this.setting.settingKey = 'home'
        this.setting.settingValue = JSON.stringify(param)
        this.setting.settingGroup = 'home'
        if (isEmpty(this.setting.settingCode)) {
          this.loading = true
          insert(this.setting).then(result => {
          }).finally(result => {
            this.loading = false
          })
        } else {
          this.loading = true
          update(this.setting).then(result => {
            // window.location.reload()
          }).finally(result => {
            this.loading = false
          })
        }
      },
      publishedChangeHandler(keyword) {
        // 选择刊例
        this.selectLoading = true
        if (!isEmpty(keyword)) {
          return request({
            url: '/media/published/select/' + keyword,
            method: 'get'
          }).then(result => {
            this.activeField.options = result.data.options
            console.debug('publishedChangeHandler', this.radioShowList[0].options)
          }).finally(() => {
            this.selectLoading = false
          })
        }
      },
      cleanPublihsedHandler(type, index, flg) {
        this.activePicDialogHandler(type, index, flg)
        this.activeField.publishedCode = ''
      },
      selectChangeHandler(selectCode) {
        if (isEmpty(selectCode)) {
          this.activeField.url = ''
          this.activeField.mediaSellerTypeCode = ''
          this.activeField.publishedCode = ''
        } else {
          this.selectLoading = true
          getByCode(selectCode).then(result => {
            if (isEmpty(this.activeField.url)) {
              this.activeField.url = result.data.mediaSeller.mediaSellerLogo
            }
            if (isEmpty(this.activeField.title)) {
              this.activeField.title = result.data.mediaSeller.mediaSellerName
            }
            this.activeField.mediaSellerTypeCode = result.data.mediaSeller.mediaSellerTypeCode
            this.activeField.publishedCode = result.data.publishedCode
          }).finally(() => {
            this.selectLoading = false
          })
        }
      }
    }
  }
</script>
<style>
  .el-collapse-item__header {
    font-size: 18px;
    padding-left: 18px;
  }

  .el-collapse-item__content {
    padding-left: 18px;
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/styles/smart-ui/smart-ui.scss';

  .el-input {
    width: 250px !important;
  }

  .el-button {
    width: 200px;
  }
  .cleanBtn{
    width: 100px !important;
  }
</style>
