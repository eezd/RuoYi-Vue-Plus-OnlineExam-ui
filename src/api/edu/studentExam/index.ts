import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ExamVO, ExamQuery } from '@/api/edu/exam/types';

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
