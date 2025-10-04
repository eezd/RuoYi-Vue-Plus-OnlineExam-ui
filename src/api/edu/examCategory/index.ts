import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ExamCategoryVO, ExamCategoryForm, ExamCategoryQuery } from '@/api/edu/examCategory/types';

/**
 * 查询考试分类列表
 * @param query
 * @returns {*}
 */

export const listExamCategory = (query?: ExamCategoryQuery): AxiosPromise<ExamCategoryVO[]> => {
  return request({
    url: '/edu/examCategory/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询考试分类详细
 * @param id
 */
export const getExamCategory = (id: string | number): AxiosPromise<ExamCategoryVO> => {
  return request({
    url: '/edu/examCategory/' + id,
    method: 'get'
  });
};

/**
 * 新增考试分类
 * @param data
 */
export const addExamCategory = (data: ExamCategoryForm) => {
  return request({
    url: '/edu/examCategory',
    method: 'post',
    data: data
  });
};

/**
 * 修改考试分类
 * @param data
 */
export const updateExamCategory = (data: ExamCategoryForm) => {
  return request({
    url: '/edu/examCategory',
    method: 'put',
    data: data
  });
};

/**
 * 删除考试分类
 * @param id
 */
export const delExamCategory = (id: string | number | Array<string | number>) => {
  return request({
    url: '/edu/examCategory/' + id,
    method: 'delete'
  });
};
