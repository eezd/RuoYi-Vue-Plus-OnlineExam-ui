export interface ExamResultVO {
  /**
   * 结果ID
   */
  id: string | number;

  /**
   * 考试ID
   */
  examId: string | number;

  /**
   * 学生ID
   */
  studentId: string | number;

  /**
   * 开始考试时间
   */
  startTime: string;

  /**
   * 交卷时间
   */
  submitTime: string;

  /**
   * 实际考试时长（分钟）
   */
  examTime: number;

  /**
   * 总分
   */
  totalScore: number;

  /**
   * 得分
   */
  userScore: number;

  /**
   * 题目总数
   */
  questionCount: number;

  /**
   * 正确题目数
   */
  correctCount: number;

  /**
   * 错误题目数
   */
  wrongCount: number;

  /**
   * 答题快照（JSON格式记录所有答题情况）
   */
  answerSnapshot: string;

  /**
   * 是否已交卷（0否 1是）
   */
  isSubmit: string;

  /**
   * 客户端IP
   */
  clientIp: string;

  /**
   * 浏览器信息
   */
  userAgent: string;

  /**
   * 备注
   */
  remark: string;

}

export interface ExamResultForm extends BaseEntity {
  /**
   * 结果ID
   */
  id?: string | number;

  /**
   * 考试ID
   */
  examId?: string | number;

  /**
   * 学生ID
   */
  studentId?: string | number;

  /**
   * 开始考试时间
   */
  startTime?: string;

  /**
   * 交卷时间
   */
  submitTime?: string;

  /**
   * 实际考试时长（分钟）
   */
  examTime?: number;

  /**
   * 总分
   */
  totalScore?: number;

  /**
   * 得分
   */
  userScore?: number;

  /**
   * 题目总数
   */
  questionCount?: number;

  /**
   * 正确题目数
   */
  correctCount?: number;

  /**
   * 错误题目数
   */
  wrongCount?: number;

  /**
   * 答题快照（JSON格式记录所有答题情况）
   */
  answerSnapshot?: string;

  /**
   * 是否已交卷（0否 1是）
   */
  isSubmit?: string;

  /**
   * 客户端IP
   */
  clientIp?: string;

  /**
   * 浏览器信息
   */
  userAgent?: string;

  /**
   * 备注
   */
  remark?: string;

}

export interface ExamResultQuery extends PageQuery {

  /**
   * 考试ID
   */
  examId?: string | number;

  /**
   * 学生ID
   */
  studentId?: string | number;

  /**
   * 开始考试时间
   */
  startTime?: string;

  /**
   * 交卷时间
   */
  submitTime?: string;

  /**
   * 实际考试时长（分钟）
   */
  examTime?: number;

  /**
   * 总分
   */
  totalScore?: number;

  /**
   * 得分
   */
  userScore?: number;

  /**
   * 题目总数
   */
  questionCount?: number;

  /**
   * 正确题目数
   */
  correctCount?: number;

  /**
   * 错误题目数
   */
  wrongCount?: number;

  /**
   * 答题快照（JSON格式记录所有答题情况）
   */
  answerSnapshot?: string;

  /**
   * 是否已交卷（0否 1是）
   */
  isSubmit?: string;

  /**
   * 客户端IP
   */
  clientIp?: string;

  /**
   * 浏览器信息
   */
  userAgent?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
