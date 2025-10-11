import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ExamClassVO, ExamClassForm, ExamClassQuery } from '@/api/edu/examClass/types';

/**
 * 查询考试班级关联详细
 * @param examId
 */
export const getExamClass = (examId: string | number): AxiosPromise<ExamClassVO> => {
  return request({
    url: '/edu/examClass/' + examId,
    method: 'get'
  });
};

/**
 * 新增考试班级关联
 * @param data
 */
export const addExamClass = (params: ExamClassForm) => {
  return request({
    url: '/edu/examClass',
    method: 'post',
    params: params
  });
};

/**
 * 删除考试班级关联
 * @param examId
 */
export const delExamClass = (params: ExamClassForm) => {
  return request({
    url: '/edu/examClass',
    method: 'delete',
    params: params
  });
};
