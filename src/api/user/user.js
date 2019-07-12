import {
  objectMerge,
  request
} from '@/utils'

export function selectByPage(object) {
  object.tableDataLoading = true
  const params = objectMerge({
    pageSize: object.tableData.pageSize,
    pageNum: object.tableData.pageNum,
    sort: object.tableData.sort,
    defaultSort: object.defaultSort
  },
  object.filterFormData)
  // console.debug(params)
  return request({
    url: '/user/userPage',
    method: 'get',
    params: params
  })
}

export function getByUserName(userName) {
  return request({
    url: '/user/selectByUserName/' + userName,
    method: 'get',
    userName: userName
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
        url: '/user/' + code,
        method: 'delete'
      }).then(res => {
        object.refreshTable()
        object.tableDataLoading = false
      })
    }).catch(() => {})
}

// 删除多行主键
export function deleteArrayCode(codeArray, object) {
  if (object.multipleSelection.length === 0) {
    object.$message({
      type: 'warning',
      message: '请选择数据！'
    })
    return
  }
  if (object.batchFilterData === '') {
    object.$message({
      type: 'warning',
      message: '请选择批处理操作！'
    })
    return
  }
  object
    .$confirm('确定删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(() => {
      object.tableDataLoading = true
      return request({
        url: '/user/codes/' + codeArray,
        method: 'delete'
      }).then(res => {
        object.refreshTable()
        object.tableDataLoading = false
      })
    })
    .catch(() => {})
}

// 批量操作
export function batctExecute(object) {
  if (typeof object.multipleSelection === 'undefined') {
    object.$message({
      type: 'warning',
      message: '请选择数据！'
    })
    return
  }
  if (object.batchFilterData === '') {
    object.$message({
      type: 'warning',
      message: '请选择批处理操作！'
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
          codes.push(row.dictCode)
        })
        deleteArrayCode(codes, object)
      })
  }
}

export function insert(data) {
  return request({
    url: '/user/front/permit/singup',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/user',
    method: 'put',
    data
  })
}

// 头像上传
export function uploadAvatar(data) {
  return request({
    baseURL: process.env.BASE_API + process.env.ZUUL + process.env.PREFIX,
    url: '/general/upload/uploadImgToNginx',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    message: '上传成功，点击底部“更新”即可保存'
  })
}

// 模板select控件-全部
export function getUserAll() {
  return request({
    url: '/user/component/select/user',
    method: 'get'
  })
}

// 模板select控件-名称模糊匹配
export function getLikeUserName(userName) {
  return request({
    url: '/user/component/select/user' + userName,
    method: 'get'
  })
}

// 获取注册用户数
export function selectAllUserCount() {
  return request({
    url: '/user/front/permit/selectAllUserCount',
    method: 'get'
  })
}
