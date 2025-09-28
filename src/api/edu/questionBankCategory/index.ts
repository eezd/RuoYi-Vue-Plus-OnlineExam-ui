import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { QuestionBankCategoryVO, QuestionBankCategoryForm, QuestionBankCategoryQuery } from '@/api/edu/questionBankCategory/types';

/**
 * 查询题库分类列表
 * @param query
 * @returns {*}
 */

export const listQuestionBankCategory = (query?: QuestionBankCategoryQuery): AxiosPromise<QuestionBankCategoryVO[]> => {
  return request({
    url: '/edu/questionBankCategory/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询题库分类详细
 * @param id
 */
export const getQuestionBankCategory = (id: string | number): AxiosPromise<QuestionBankCategoryVO> => {
  return request({
    url: '/edu/questionBankCategory/' + id,
    method: 'get'
  });
};

/**
 * 新增题库分类
 * @param data
 */
export const addQuestionBankCategory = (data: QuestionBankCategoryForm) => {
  return request({
    url: '/edu/questionBankCategory',
    method: 'post',
    data: data
  });
};

/**
 * 修改题库分类
 * @param data
 */
export const updateQuestionBankCategory = (data: QuestionBankCategoryForm) => {
  return request({
    url: '/edu/questionBankCategory',
    method: 'put',
    data: data
  });
};

/**
 * 删除题库分类
 * @param id
 */
export const delQuestionBankCategory = (id: string | number | Array<string | number>) => {
  return request({
    url: '/edu/questionBankCategory/' + id,
    method: 'delete'
  });
};
