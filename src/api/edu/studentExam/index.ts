import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ExamVO, ExamQuery } from '@/api/edu/exam/types';
import { EduExamResult, EduExamResultSubmitQuery } from './types';

/**
 * 考试交卷
 * @param query
 * @returns
 */
export const submitStudentExam = (data?: EduExamResultSubmitQuery) => {
  return request({
    url: '/edu/StudentExam/resultSubmit',
    method: 'post',
    data
  });
};

/**
 * 开始考试
 * @param query
 * @returns
 */
export const startStudentExam = (examId: number | string, ua: string): AxiosPromise<EduExamResult> => {
  return request({
    url: '/edu/StudentExam/start',
    method: 'post',
    params: { examId, ua }
  });
};

/**
 * 查询考试信息列表
 * @param query
 * @returns {*}
 */
export const listStudentExam = (query?: ExamQuery): AxiosPromise<ExamVO[]> => {
  return request({
    url: '/edu/StudentExam/list',
    method: 'get',
    params: query
  });
};
