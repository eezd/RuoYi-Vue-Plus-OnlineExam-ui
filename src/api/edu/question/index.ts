import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { QuestionVO, QuestionForm, QuestionQuery } from '@/api/edu/question/types';

/**
 * 查询试题列表
 * @param query
 * @returns {*}
 */

export const listQuestion = (query?: QuestionQuery): AxiosPromise<QuestionVO[]> => {
  return request({
    url: '/edu/question/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询试题详细
 * @param id
 */
export const getQuestion = (id: string | number): AxiosPromise<QuestionVO> => {
  return request({
    url: '/edu/question/' + id,
    method: 'get'
  });
};

/**
 * 新增试题
 * @param data
 */
export const addQuestion = (data: QuestionForm) => {
  return request({
    url: '/edu/question',
    method: 'post',
    data: data
  });
};

/**
 * 修改试题
 * @param data
 */
export const updateQuestion = (data: QuestionForm) => {
  return request({
    url: '/edu/question',
    method: 'put',
    data: data
  });
};

/**
 * 删除试题
 * @param id
 */
export const delQuestion = (id: string | number | Array<string | number>) => {
  return request({
    url: '/edu/question/' + id,
    method: 'delete'
  });
};
