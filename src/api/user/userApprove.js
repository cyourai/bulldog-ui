import { request } from '@/utils/request'
import { objectMerge } from '@/utils/index'

export function getUserAll() {
  return request({
    url: '/user/all',
    method: 'get'
  })
}

export function selectByPage(object) {
  object.tableDataLoading = true
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
    url: '/user/userApprovePage',
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

