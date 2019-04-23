import { request } from '@/utils'

export function downloadFile(uploadCode) {
  // 导出上传列表中的文件
  const baseURL = `${process.env.BASE_API + process.env.PREFIX}`
  const url = baseURL + `/general/download/downloadFile/${uploadCode}`
  window.open(url)
}

export function delFile(code, _this, callback) {
  // 删除上传列表中的文件
  _this.$confirm('确定删除?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    return request({
      url: '/general/upload/deleteUpload/' + code,
      method: 'delete'
    }).then(() => {
      if (_this.hasOwnProperty('refreshUploadResultList')) _this.refreshUploadResultList()
    })
  }).catch(() => {
  })
}
