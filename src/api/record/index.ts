import { request } from '@/api';

export async function getAllRecord(opts) {
  return request.post<any, any>('/record/getAllRecord', opts);
}
