import {
  objectMerge,
  request
} from '@/utils'

// 分页查询脚本
export function selectScriptByPage(object) {
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
    url: '/maintenance/script/page',
    method: 'get',
    params: params
  })
}

// 分页查询脚本模板
export function selectTemplateByPage(object) {
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
    url: '/general/template/page',
    method: 'get',
    params: params
  })
}

// 分页查询脚本模板
export function scriptResultCheckByPage(object) {
  object.tableDataLoading = true
  const params = objectMerge({
    pageSize: object.tableData.pageSize,
    pageNum: object.tableData.pageNum,
    sort: object.tableData.sort,
    defaultSort: object.defaultSort
  },
  object.filterFormData
  )
  // console.debug(params)
  return request({
    url: '/maintenance/scriptResultCheck/page',
    method: 'get',
    params: params
  })
}

// 根据编号查询脚本及对应模板和结果条件
export function getByScriptCode(scriptCode) {
  return request({
    url: '/maintenance/script/selectByCode/' + scriptCode,
    method: 'get',
    scriptCode: scriptCode
  })
}

// 根据编号查询脚本模板及对应详情
export function getByTemplateCode(templateCode) {
  return request({
    url: '/general/template/' + templateCode,
    method: 'get',
    scriptCode: templateCode
  })
}

// 根据编号查询脚本模板及对应详情
export function getByResultCheckCode(resultCheckCode) {
  return request({
    url: '/maintenance/scriptResultCheck/' + resultCheckCode,
    method: 'get',
    resultCheckCode: resultCheckCode
  })
}

// 新增脚本
export function insertScript(data) {
  return request({
    url: '/maintenance/script/insert',
    method: 'post',
    data
  })
}

// 根据脚本名称更新脚本
export function updateScript(data) {
  return request({
    url: '/maintenance/script',
    method: 'put',
    data
  })
}

// 更新脚本
export function updateScriptByCode(data) {
  return request({
    url: '/maintenance/script/updateScriptByCode',
    method: 'put',
    data
  })
}

// 根据脚本名称查询实体
export function selectScriptByName(data) {
  const params = {
    scriptName: data
  }
  return request({
    url: '/maintenance/script/selectScriptByName',
    method: 'get',
    params: params
  })
}

// 执行脚本
export function execute(data) {
  return request({
    message: '测试完毕',
    url: '/maintenance/script/executeShell',
    method: 'post',
    data
  })
}

// 新增脚本模板
export function insertTemplate(data) {
  return request({
    url: '/general/template/insert',
    method: 'post',
    data
  })
}

// 更新脚本模板
export function updateTemplate(data) {
  return request({
    url: '/general/template',
    method: 'put',
    data
  })
}

// 通过脚本模板生成脚本
export function scriptCreate(data) {
  return request({
    url: '/maintenance/script/generator',
    method: 'post',
    data
  })
}

// 新增结果检查表达式
export function insertResultCheck(data) {
  return request({
    url: '/maintenance/scriptResultCheck/insert',
    method: 'post',
    data
  })
}

// 更新结果检查表达式
export function updateResultCheck(data) {
  return request({
    url: '/maintenance/scriptResultCheck',
    method: 'put',
    data
  })
}

// 模板select控件-全部
export function getTemplateAll() {
  return request({
    url: '/maintenance/component/select/template',
    method: 'get'
  })
}

// 模板select控件-名称模糊匹配
export function getBytemplateName(templateName) {
  return request({
    url: '/maintenance/component/select/template' + templateName,
    method: 'get'
  })
}

// 模板select控件-全部
export function getResultCheckAll() {
  return request({
    url: '/maintenance/component/select/resultcheck',
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
        url: '/maintenance/script/' + code,
        method: 'delete'
      }).then(res => {
        object.refreshTable()
        object.tableDataLoading = false
      })
    }).catch(() => {})
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
          delCodes.push(row.scriptCode)
        })
        deleteCodes(delCodes, object)
      })
  }
}

// 删除多行主键
export function deleteCodes(codes, object) {
  return request({
    url: '/maintenance/script/codes/' + codes,
    method: 'delete'
  }).then(res => {
    object.refreshTable()
    object.tableDataLoading = false
  })
}
