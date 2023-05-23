import { request } from '@/api';

export async function uploadFile(opts) {
  return request.post<any, any>('/file/uploadFile',opts);
}