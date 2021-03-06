import { request } from '@/utils/request'
import { objectMerge } from '@/utils/index'

export function selectByPage(object) {
  const params = objectMerge(
    {
      pageSize: object.tableData.pageSize,
      pageNum: object.tableData.pageNum,
      sort: object.tableData.sort,
      defaultSort: object.defaultSort
    },
    object.filterFormData
  )
  // console.debug(params)
  return request({
    url: '/center/template/page',
    method: 'get',
    params: params
  })
}

export function getByCode(code) {
  return request({
    url: '/center/template/' + code,
    method: 'get',
    code: code
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
        url: '/center/template/' + code,
        method: 'delete'
      }).then(res => {
        object.refreshTable()
        object.tableDataLoading = false
      })
    })
    .catch(() => {})
}

// 删除多行主键
export function deleteCodes(codes, object) {
  return request({
    url: '/center/template/' + codes,
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
          codes.push(row.templateCode)
        })
        deleteCodes(codes, object)
      })
      .catch(() => {})
  }
}

export function insert(data) {
  return request({
    url: '/center/template/insert',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/center/template',
    method: 'put',
    data
  })
}
