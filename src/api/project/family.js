import request from '@/utils/request'


export function listFamily(query) {
    return request({
        url: '/project/family/list',
        method: 'get',
        params: query
    })
}


export function getFamily(data) {
    return request({
        url: '/project/family/detil' ,
        method: 'post',
        data:data
    })
}


export function addFamily(data) {
    return request({
        url: '/project/family/add',
        method: 'post',
        data: data
    })
}


export function updateFamily(data) {
    return request({
        url: '/project/family/edit',
        method: 'post',
        data: data
    })
}


export function delFamily(data) {
    return request({
        url: '/project/family/del',
        method: 'post',
        data: data
    })
}
