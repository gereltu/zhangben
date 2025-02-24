import request from '@/utils/request'

// 查询预算管理列表
export function listBudgets(query) {
  return request({
    url: '/project/budgets/list',
    method: 'get',
    params: query
  })
}

// 查询预算管理详细
export function getBudgets(data) {
  return request({
    url: '/project/budgets/detil' ,
    method: 'post',
    data:data
  })
}

// 新增预算管理
export function addBudgets(data) {
  return request({
    url: '/project/budgets/add',
    method: 'post',
    data: data
  })
}

// 修改预算管理
export function updateBudgets(data) {
  return request({
    url: '/project/budgets/edit',
    method: 'post',
    data: data
  })
}

// 删除预算管理
export function delBudgets(data) {
  return request({
    url: '/project/budgets/del',
    method: 'post',
    data: data
  })
}


