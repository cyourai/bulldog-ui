import { request } from '@/utils/request'

export function insert(data) {
  return request({
    message: '新增配置参数成功',
    url: '/center/setting/insertSetting',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    message: '配置参数成功',
    url: '/center/setting/updateSetting',
    method: 'put',
    data
  })
}

export function selectSettingByGroup(group) {
  return request({
    url: '/center/setting/front/permit/selectSettingByGroup/' + group,
    method: 'get'
  })
}

export function selectSettingByKey(key) {
  return request({
    url: '/center/setting/front/permit/selectSetting/' + key,
    method: 'get'
  })
}

// 删除一行主键
export function deleteByCode(code, _this) {
  _this
    .$confirm('确定删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(() => {
      _this.loading = true
      return request({
        url: '/center/setting/' + code,
        method: 'delete'
      }).finally(() => {
        _this.loading = false
        _this.init()
      })
    })
    .catch(() => {
    })
}
