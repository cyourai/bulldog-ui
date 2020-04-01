import {
  objectMerge,
  request
} from '@/utils'

export function selectMessageListByReceiver(object) {
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
    url: '/center/message/selectMessageListByReceiver',
    method: 'get',
    params: params
  })
}

// 根据messageCode查询实体
export function getByMessageCode(messageCode) {
  return request({
    url: '/center/message/' + messageCode,
    method: 'get',
    userName: messageCode
  })
}

// 获取当前用户未读消息数
export function getUnReadMessageCount() {
  return request({
    url: '/center/message/selectMyUnReceiveMessageCount',
    method: 'get'
  })
}

// 批量删除
export function updateArrayCode(codeArray, object) {
  return request({
    url: '/center/message/codes/' + codeArray,
    method: 'put'
  }).then(res => {
    object.refreshTable()
    object.tableDataLoading = false
  })
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
        const delCodes = []
        object.multipleSelection.forEach(row => {
          delCodes.push(row.messageCode)
        })
        updateArrayCode(delCodes, object)
      })
  }
}

// 删除消息
export function update(data) {
  return request({
    url: '/center/message',
    method: 'put',
    data
  })
}

// 新增消息
export function insertMessage(data) {
  return request({
    message: '发送成功',
    url: '/center/message/insertMessage',
    method: 'post',
    data
  })
}

// 发送邮件
export function sendMail(data) {
  return request({
    url: '/center/mail/sendMail',
    method: 'post',
    data
  })
}

