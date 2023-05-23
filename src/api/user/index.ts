import { request } from '@/api';

export async function loginAPI(opts: { username: string; password: string }) {
  return request.post<any, string>('/user/login', opts);
}

export async function getUserInfo(opts) {
  return request.post<any, any>('/user/getUserInfo',opts);
}

export async function getAllUser(opts) {
  return request.post<any, any>('/user/getAllUser',opts);
}

export async function createUser(opts) {
  return request.post<any, any>('/user/createUser',opts);
}

export async function resetPassword(opts) {
  return request.post<any, any>('/user/resetPassword',opts);
}
export async function deleteUser(opts) {
  return request.post<any, any>('/user/deleteUser',opts);
}