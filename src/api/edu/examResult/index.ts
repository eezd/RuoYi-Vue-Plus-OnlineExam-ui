import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ExamResultVO, ExamResultForm, ExamResultQuery } from '@/api/edu/examResult/types';

/**
 * 查询考试结果列表
 * @param query
 * @returns {*}
 */

export const listExamResult = (query?: ExamResultQuery): AxiosPromise<ExamResultVO[]> => {
  return request({
    url: '/edu/examResult/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询考试结果详细
 * @param id
 */
export const getExamResult = (id: string | number): AxiosPromise<ExamResultVO> => {
  return request({
    url: '/edu/examResult/' + id,
    method: 'get'
  });
};

/**
 * 新增考试结果
 * @param data
 */
export const addExamResult = (data: ExamResultForm) => {
  return request({
    url: '/edu/examResult',
    method: 'post',
    data: data
  });
};

/**
 * 修改考试结果
 * @param data
 */
export const updateExamResult = (data: ExamResultForm) => {
  return request({
    url: '/edu/examResult',
    method: 'put',
    data: data
  });
};

/**
 * 删除考试结果
 * @param id
 */
export const delExamResult = (id: string | number | Array<string | number>) => {
  return request({
    url: '/edu/examResult/' + id,
    method: 'delete'
  });
};
