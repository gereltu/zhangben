import request from '@/utils/request'

// 查询账单管理列表
export function listBills(query) {
  return request({
    url: '/project/bills/list',
    method: 'get',
    params: query
  })
}

// 查询账单管理详细
export function getBills(data) {
  return request({
    url: '/project/bills/detil' ,
    method: 'post',
    data:data
  })
}

// 新增账单管理
export function addBills(data) {
  return request({
    url: '/project/bills/add',
    method: 'post',
    data: data
  })
}

// 修改账单管理
export function updateBills(data) {
  return request({
    url: '/project/bills/edit',
    method: 'post',
    data: data
  })
}

// 删除账单管理
export function delBills(data) {
  return request({
    url: '/project/bills/del',
    method: 'post',
    data: data
  })
}


