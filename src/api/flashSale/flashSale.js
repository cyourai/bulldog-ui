import { request } from '@/utils/request'
import { objectMerge } from '@/utils/index'

export function selectByPage(object) {
  object.tableDataLoading = true
  // console.debug(object.tableData.sort)
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
    url: '/media/flashSale/front/permit/selectFlashSalePage',
    method: 'get',
    params: params
  })
}

export function getByCode(code) {
  return request({
    url: '/media/flashSale/' + code,
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
        url: '/media/flashSale/' + code,
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
    url: '/media/flashSale/codes/' + codes,
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
          codes.push(row.flashSaleCode)
        })
        deleteCodes(codes, object)
      })
  }
}

export function insert(data) {
  return request({
    url: '/media/flashSale/insert',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/media/flashSale',
    method: 'put',
    data
  })
}
