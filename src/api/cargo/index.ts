import { request } from '@/api';

export async function getAllCargo(opts) {
  return request.post<any, any>('/cargo/getAllCargo', opts);
}

export async function deleteCargo(opts) {
  return request.post<any, any>('/cargo/deleteCargo', opts);
}

export async function getCargoDetail(opts) {
  return request.post<any, any>('/cargo/getCargoDetail', opts);
}
export async function createCargo(opts) {
  return request.post<any, any>('/cargo/createCargo', opts);
}
export async function updateCargo(opts) {
  return request.post<any, any>('/cargo/updateCargo', opts);
}
export async function takeCargo(opts) {
  return request.post<any, any>('/cargo/takeCargo', opts);
}
