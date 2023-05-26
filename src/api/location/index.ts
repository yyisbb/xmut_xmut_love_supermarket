import { request } from '@/api';

export async function getAllLocation(opts) {
  return request.post<any, any>('/location/getAllLocation', opts);
}
export async function createLocation(opts) {
  return request.post<any, any>('/location/createLocation', opts);
}
export async function deleteLocation(opts) {
  return request.post<any, any>('/location/deleteLocation', opts);
}

export async function getLocationDetail(opts) {
  return request.post<any, any>('/location/getLocationDetail', opts);
}
export async function updateLocation(opts) {
  return request.post<any, any>('/location/updateLocation', opts);
}
