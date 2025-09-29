import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { QuestionBankVO, QuestionBankForm, QuestionBankQuery } from '@/api/edu/questionBank/types';

/**
 * 查询题库列表
 * @param query
 * @returns {*}
 */

export const listQuestionBank = (query?: QuestionBankQuery): AxiosPromise<QuestionBankVO[]> => {
  return request({
    url: '/edu/questionBank/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询题库详细
 * @param id
 */
export const getQuestionBank = (id: string | number): AxiosPromise<QuestionBankVO> => {
  return request({
    url: '/edu/questionBank/' + id,
    method: 'get'
  });
};

/**
 * 新增题库
 * @param data
 */
export const addQuestionBank = (data: QuestionBankForm) => {
  return request({
    url: '/edu/questionBank',
    method: 'post',
    data: data
  });
};

/**
 * 修改题库
 * @param data
 */
export const updateQuestionBank = (data: QuestionBankForm) => {
  return request({
    url: '/edu/questionBank',
    method: 'put',
    data: data
  });
};

/**
 * 删除题库
 * @param id
 */
export const delQuestionBank = (id: string | number | Array<string | number>) => {
  return request({
    url: '/edu/questionBank/' + id,
    method: 'delete'
  });
};
