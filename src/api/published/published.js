import { request } from '@/utils/request'
import { objectMerge, param } from '@/utils/index'

export function selectByPage(_this) {
  _this.tableDataLoading = true
  const params = {
    mediaSellerTypeCode: _this.type,
    pageSize: _this.tableData.pageSize,
    pageNum: _this.tableData.pageNum,
    sort: _this.tableData.sort,
    defaultSort: _this.defaultSort
  }
  // console.debug(params)
  return request({
    url: '/media/published/selectPublishedPage',
    method: 'get',
    params: objectMerge(params, _this.filterFormData)
  })
}

export function getByCode(code) {
  return request({
    url: '/media/published/front/permit/selectPublishedByCode/' + code,
    method: 'get'
  })
}

// 删除一行主键
export function deleteByCode(code, object) {
  object
    .$confirm('确定删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(() => {
      object.tableDataLoading = true
      return request({
        url: '/media/published/' + code,
        method: 'delete'
      }).then(res => {
        object.refreshTable()
        object.tableDataLoading = false
      })
    })
}

// 删除多行主键
export function deleteCodes(codes, object) {
  return request({
    url: '/media/published/codes/' + codes,
    method: 'delete'
  }).then(() => {
    object.refreshTable()
  })
}

// 批量操作
export function batctExecute(object) {
  if (typeof object.multipleSelection === 'undefined') {
    object.$message({
      type: 'warning',
      message: '请选择数据!'
    })
    return
  }
  if (object.batchFilterData === '') {
    object.$message({
      type: 'warning',
      message: '请选择批处理操作!'
    })
    return
  }
  if (object.batchFilterData === 'delete') {
    object
      .$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        const codes = []
        object.multipleSelection.forEach(row => {
          codes.push(row.publishedCode)
        })
        deleteCodes(codes, object)
      })
  }
}

export function insert(data) {
  const params = initSubmitFormParam(data)
  return request({
    url: '/media/published/insert',
    method: 'post',
    data: params
  })
}

export function initFirstEditForm(result, form, self) {
  // 媒体主
  form.publishedCode = result.data.publishedCode
  form.publishedName = result.data.publishedName
  if (typeof result.data.publishedSellerCode !== 'undefined') {
    self.options = [
      {
        label: result.data.mediaSeller.mediaSellerName,
        value: result.data.mediaSeller.mediaSellerCode,
        key: result.data.mediaSeller.mediaSellerCode
      }
    ]
    form.publishedSellerCode = result.data.mediaSeller.mediaSellerCode
  }
  // 执行时间
  const dateArray = String(result.data.publishedDateRange).split(',')
  if (dateArray && dateArray.length === 2) {
    form.publishedDateRange = [dateArray[0], dateArray[1]]
  }
  form.publishedPriceUnit = result.data.publishedPriceUnit
  form.publishedStatus = result.data.publishedStatus
  form.publishedImg1 = result.data.publishedImg1
  form.publishedImg2 = result.data.publishedImg2
  form.publishedImg3 = result.data.publishedImg3
  form.publishedRemark = result.data.publishedRemark
  form.publishedInfo = result.data.publishedInfo
}

export function initSecondEditForm(result, form) {
  // 媒体主
  // form.publishedCode = result.data.publishedCode
  form.publishedTypeCode = result.data.publishedTypeCode
  try {
    if (typeof result.data.publishedItems !== 'undefined') {
      form.publishedItems = JSON.parse(result.data.publishedItems)
    } else {
      form.publishedItems = []
    }
  } catch (error) {
    form.publishedItems = []
    // console.log(error)
  }
  try {
    if (typeof result.data.publishedOptions !== 'undefined') {
      form.publishedOptions = JSON.parse(result.data.publishedOptions)
    } else {
      form.publishedOptions = []
    }
  } catch (error) {
    form.publishedOptions = []
    // console.log(error)
  }
  try {
    if (typeof result.data.publishedKeys !== 'undefined') {
      form.publishedKeys = JSON.parse(result.data.publishedKeys)
    } else {
      form.publishedKeys = {}
    }
  } catch (error) {
    form.publishedKeys = {}
    // console.log(error)
  }
  try {
    if (typeof result.data.publishedPaths !== 'undefined') {
      form.publishedPaths = JSON.parse(result.data.publishedPaths)
    } else {
      form.publishedPaths = {}
    }
  } catch (error) {
    form.publishedPaths = {}
    // console.log(error)
  }
  try {
    // 规格名称
    if (typeof result.data.publishedTitle !== 'undefined') {
      const titleArray = JSON.parse(result.data.publishedTitle)
      if (Array.isArray(titleArray)) {
        form.publishedTitle = titleArray.join(',')
      }
    } else {
      form.publishedTitle = ''
    }
  } catch (error) {
    form.publishedTitle = ''
    // console.log(error)
  }
  try {
    // 播出时长
    if (typeof result.data.publishedTimePoint !== 'undefined') {
      form.publishedTimePoint = JSON.parse(result.data.publishedTimePoint)
    } else {
      form.publishedTimePoint = {}
    }
  } catch (error) {
    form.publishedTitle = {}
    // console.log(error)
  }
  try {
    if (typeof result.data.publishedTimeSlot !== 'undefined') {
      form.publishedTimeSlot = JSON.parse(result.data.publishedTimeSlot)
    } else {
      form.publishedTimeSlot = []
    }
  } catch (error) {
    form.publishedTimeSlot = []
    // console.log(error)
  }
}

export function initSubmitFormParam(data) {
  const params = {
    publishedName: data.publishedName,
    publishedSellerCode: data.publishedSellerCode,
    publishedPriceUnit: data.publishedPriceUnit,
    publishedStatus: data.publishedStatus,
    publishedImg1: data.publishedImg1,
    publishedImg2: data.publishedImg2,
    publishedImg3: data.publishedImg3,
    publishedInfo: data.publishedInfo,
    publishedRemark: data.publishedRemark
  }
  if (typeof data.publishedCode !== 'undefined') {
    params.publishedCode = data.publishedCode
  }
  if (
    Array.isArray(data.publishedDateRange) &&
    data.publishedDateRange.length === 2
  ) {
    const dataRange = [
      data.publishedDateRange[0],
      data.publishedDateRange[1]
    ].join(',')
    // console.debug(dataRange)
    params.publishedDateRange = dataRange
  }
  return params
}

export function getMediaSellerSelect(keyWord, mediaSellerType) {
  return request({
    url: `/media/component/select/mediaSeller/${keyWord}/${mediaSellerType}`,
    method: 'get'
  })
}

export function update(data) {
  const params = initSubmitFormParam(data)
  return request({
    url: '/media/published',
    method: 'put',
    data: params
  })
}

export function updateSecondForm(data) {
  const params = {
    publishedCode: data.publishedCode,
    publishedTypeCode: data.publishedTypeCode,
    publishedTitle: data.publishedTitle
  }
  if (Array.isArray(data.publishedItems) && data.publishedItems.length > 0) {
    params.publishedItems = JSON.stringify(data.publishedItems)
  }
  return request({
    url: '/media/published/updateSecond',
    message: '刊例更新成功',
    method: 'put',
    data: params
  })
}

export function updateAdd(data, code) {
  const params = {
    publishedAdd: data,
    publishedCode: code
  }
  return request({
    message: '',
    url: '/media/published',
    method: 'put',
    data: params
  })
}

export function updateDiscount(data, code) {
  const params = {
    publishedDiscount: data,
    publishedCode: code
  }
  return request({
    message: '',
    url: '/media/published',
    method: 'put',
    data: params
  })
}

export function jumpUrl(urlPath, publishedCode, step) {
  // 跳转新tab
  const path = require('path')
  const url = path.join(
    '/#',
    urlPath +
    '?' +
    param({
      publishedCode: publishedCode,
      step: step
    })
  )
  window.location.href = url
  window.location.reload()
}

export function replaceSing(field) {
  let strResult = field.replace(new RegExp('/', 'gm'), ',')
  strResult = field.replace(new RegExp('，', 'gm'), ',')
  strResult = field.replace(new RegExp(' ', 'gm'), ',')
  return strResult
}

export function preview(form) {
  const params = {
    publishedCode: form.publishedCode,
    publishedTypeCode: form.publishedTypeCode,
    publishedTitle: form.publishedTitle
  }
  if (Array.isArray(form.publishedItems) && form.publishedItems.length > 0) {
    params.publishedItems = JSON.stringify(form.publishedItems)
  }
  return request({
    url: '/media/published/preview',
    method: 'post',
    data: params
  })
}
