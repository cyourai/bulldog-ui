import {
  objectMerge,
  request
} from '@/utils'

// 分页查询服务器
export function selectServerByPage(object) {
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
    url: '/maintenance/server/page',
    method: 'get',
    params: params
  })
}

// 根据编号查询服务器详情
export function getByServerCode(serverCode) {
  return request({
    url: '/maintenance/server/' + serverCode,
    method: 'get',
    scriptCode: serverCode
  })
}

// 新增服务器
export function insertServer(data) {
  return request({
    url: '/maintenance/server/insertServer',
    method: 'post',
    data
  })
}

// 执行ping操作
export function testPing(data) {
  return request({
    url: '/maintenance/server/ping',
    method: 'post',
    data
  })
}

// 更新服务器
export function updateServer(data) {
  return request({
    url: '/maintenance/server',
    method: 'put',
    data
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
        url: '/maintenance/server/' + code,
        method: 'delete'
      }).then(res => {
        object.refreshTable()
        object.tableDataLoading = false
      })
    }).catch(() => {})
}

// 删除多行主键
export function deleteCodes(codes, object) {
  return request({
    url: '/maintenance/server/codes/' + codes,
    method: 'delete'
  }).then(res => {
    object.refreshTable()
    object.tableDataLoading = false
  })
}

// 批量删除
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
        const delCodes = []
        object.multipleSelection.forEach(row => {
          delCodes.push(row.serverCode)
        })
        deleteCodes(delCodes, object)
      })
  }
}

// 批量测试ping
export function test(object, data) {
  // if (typeof object.multipleSelection === 'undefined') {
  //   object.$message({
  //     type: 'warning',
  //     message: '请选择数据！'
  //   })
  //   return
  // }
  return request({
    url: '/maintenance/server/test/' + data,
    method: 'post'
  })
}

// 批量测试推送公钥
export function ssh(object, data) {
  if (typeof object.multipleSelection === 'undefined') {
    object.$message({
      type: 'warning',
      message: '请选择数据！'
    })
    return
  }
  return request({
    url: '/maintenance/server/ssh/' + data,
    method: 'post'
  })
}

// 清除密码
export function remove(codes, object) {
  return request({
    url: '/maintenance/server/remove/' + codes,
    method: 'put'
  }).then(() => {
    object.refreshTable()
  })
}

// 下载模板
export function downloadTemplate() {
  return request({
    url: '/maintenance/server/downloadTemplate',
    method: 'get'
  })
}
