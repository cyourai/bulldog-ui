import {
  objectMerge,
  request
} from '@/utils'

// 分页查询
export function selectByPage(object) {
  object.tableDataLoading = true
  const params = objectMerge({
    pageSize: object.tableData.pageSize,
    pageNum: object.tableData.pageNum,
    sort: object.tableData.sort,
    defaultSort: object.defaultSort
  }, object.filterFormData)
  // console.debug(params)
  return request({
    url: '/center/dump/page',
    method: 'get',
    params: params
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
        url: '/center/dump/' + code,
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
    url: '/center/dump/codes/' + codes,
    method: 'delete'
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
          delCodes.push(row.dumpCode)
        })
        deleteCodes(delCodes, object)
      })
  }
}

// 新增备份文件
export function insertDump(data) {
  return request({
    url: '/center/dump/insertDump',
    method: 'post',
    data
  })
}

// 根据备份文件还原数据库
export function dbRestore(data) {
  return request({
    url: '/center/dump/dbRestore',
    method: 'put',
    data
  })
}

