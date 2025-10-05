import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ExamVO, ExamForm, ExamQuery } from '@/api/edu/exam/types';

/**
 * 查询考试信息列表
 * @param query
 * @returns {*}
 */

export const listExam = (query?: ExamQuery): AxiosPromise<ExamVO[]> => {
  return request({
    url: '/edu/exam/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询考试信息详细
 * @param id
 */
export const getExam = (id: string | number): AxiosPromise<ExamVO> => {
  return request({
    url: '/edu/exam/' + id,
    method: 'get'
  });
};

/**
 * 新增考试信息
 * @param data
 */
export const addExam = (data: ExamForm) => {
  return request({
    url: '/edu/exam',
    method: 'post',
    data: data
  });
};

/**
 * 修改考试信息
 * @param data
 */
export const updateExam = (data: ExamForm) => {
  return request({
    url: '/edu/exam',
    method: 'put',
    data: data
  });
};

/**
 * 删除考试信息
 * @param id
 */
export const delExam = (id: string | number | Array<string | number>) => {
  return request({
    url: '/edu/exam/' + id,
    method: 'delete'
  });
};
