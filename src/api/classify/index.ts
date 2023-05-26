import { request } from '@/api';

export async function createClassify(opts) {
  return request.post<any, any>('/classify/createClassify', opts);
}

export async function getAllClassify(opts) {
  return request.post<any, any>('/classify/getAllClassify', opts);
}
export async function deleteClassify(opts) {
  return request.post<any, any>('/classify/deleteClassify', opts);
}

export async function updateClassify(opts) {
  return request.post<any, any>('/classify/updateClassify', opts);
}
export async function getClassifyDetail(opts) {
  return request.post<any, any>('/classify/getClassifyDetail', opts);
}

export async function getLeafClassifyList(opts) {
  return request.post<any, any>('/classify/getLeafClassifyList', opts);
}
