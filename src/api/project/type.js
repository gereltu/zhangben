import request from '@/utils/request'

// 查询支出类型管理列表
export function listType(query) {
  return request({
    url: '/project/type/list',
    method: 'get',
    params: query
  })
}

// 查询支出类型管理详细
export function getType(data) {
  return request({
    url: '/project/type/detil' ,
    method: 'post',
    data:data
  })
}

// 新增支出类型管理
export function addType(data) {
  return request({
    url: '/project/type/add',
    method: 'post',
    data: data
  })
}

// 修改支出类型管理
export function updateType(data) {
  return request({
    url: '/project/type/edit',
    method: 'post',
    data: data
  })
}

// 删除支出类型管理
export function delType(data) {
  return request({
    url: '/project/type/del',
    method: 'post',
    data: data
  })
}


