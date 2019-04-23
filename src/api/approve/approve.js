import store from '@/store'
import { request } from '@/utils/request'
import { objectMerge } from '@/utils/index'

export function selectByPage(_this) {
  _this.tableDataLoading = true
  const params = objectMerge({
    pageSize: _this.tableData.pageSize,
    pageNum: _this.tableData.pageNum,
    sort: _this.tableData.sort,
    defaultSort: _this.defaultSort
  }, _this.filterFormData)
  return request({
    url: '/process/processPage',
    method: 'get',
    params: params
  }).then(result => {
    _this.tableDataLoading = false
    _this.tableData = result.data.tableData
    // debug(_this.tableData)
  }).catch(e => {
    _this.tableDataLoading = false
  }).finally(() => {
    _this.tableDataLoading = false
  })
}

// 同意无附加参数
export function agree(_this, taskId, callback) {
  agreeTaskWithVariable(_this, taskId, { taskId: taskId }, callback)
}

export function agreeTaskWithVariable(_this, taskId, data, callback) {
  _this
    .$confirm('确定同意?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success'
    })
    .then(() => {
      _this.loading = true
      return request({
        message: '已同意',
        url: '/process/task/agree',
        method: 'post',
        data
      }).then(() => {
        callback()
      }).finally(() => {
        _this.loading = false
      })
    })
}

// 拒绝无附加参数
export function reject(_this, taskId, callback) {
  rejectTaskWithVariable(_this, taskId, { taskId: taskId }, callback)
}

// 拒绝
export function rejectTaskWithVariable(_this, taskId, data, callback) {
  _this
    .$confirm('确定拒绝?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(() => {
      _this.loading = true
      return request({
        message: '已拒绝',
        url: '/process/task/reject',
        method: 'post',
        data: data
      }).then(() => {
        callback()
      }).finally(() => {
        _this.loading = false
      })
    })
}

// 下一步无附加参数
export function next(_this, taskId, callback) {
  nextTaskWithVariable(_this, taskId, { taskId: taskId }, callback)
}

// 下一步
export function nextTaskWithVariable(_this, taskId, data, callback) {
  _this
    .$confirm('确定提交?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'default'
    })
    .then(() => {
      _this.loading = true
      return request({
        url: '/process/task/next',
        method: 'post',
        data
      }).then(() => {
        callback()
      }).finally(() => {
        _this.loading = false
      })
    })
}

// 同意一行
export function agreeTask(_this, row) {
  _this
    .$confirm('确定审批同意?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(() => {
      return request({
        message: '已通过审核',
        url: '/process/agreeTaskWithVariable',
        method: 'post',
        data: {
          taskId: row.task.taskId,
          currentUserName: store.state.user.userName
        }
      }).then(() => {
        _this.refreshTable()
      })
    })
}

export function getByCode(code) {
  return request({
    url: '/process/processSeller/' + code,
    method: 'get',
    code: code
  })
}

// 删除一行
export function delTask(_this, processInstanceId) {
  _this
    .$confirm('确定删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(() => {
      _this.tableDataLoading = true
      const data = {
        processInstanceId: processInstanceId
      }
      return request({
        url: '/process/delProcessInstance',
        method: 'post',
        data
      }).then(res => {
        _this.refreshTable()
        _this.tableDataLoading = false
      })
    })
}

// 批量操作
export function batctExecute(_this) {
  if (typeof _this.multipleSelection === 'undefined') {
    _this.$message({
      type: 'warning',
      message: '请选择数据!'
    })
    return
  }
  if (_this.batchFilterData === '') {
    _this.$message({
      type: 'warning',
      message: '请选择批处理操作!'
    })
    return
  }
  if (_this.batchFilterData === 'agree') {
    _this
      .$confirm('确定全部同意?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        new Promise(function(resolve, reject) {
          _this.multipleSelection.forEach(row => {
            return request({
              message: '已通过审核',
              url: '/process/agreeTask',
              method: 'get',
              params: {
                taskId: row.task.taskId,
                currentUserName: store.state.user.userName
              }
            })
          })
          resolve()
        }).then(() => {
          _this.refreshTable()
        })
      })
  } else if (_this.batchFilterData === 'delete') {
    _this
      .$confirm('确定批量删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        new Promise(function(resolve, reject) {
          _this.multipleSelection.forEach(row => {
            if (row.eventStatusCode !== 'wait') {
              this.$alert('只能删除未提交的事件')
              return
            }
          })
          _this.multipleSelection.forEach(row => {
            const data = {
              processInstanceId: row.processInstanceId
            }
            return request({
              message: '删除成功',
              url: '/process/delProcessInstance',
              method: 'post',
              data
            })
          })
          resolve()
        }).then(() => {
          _this.refreshTable()
        })
      })
  }
}

export function insert(data) {
  return request({
    url: '/process/processSeller/insert',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/process/processSeller',
    method: 'put',
    data
  })
}
