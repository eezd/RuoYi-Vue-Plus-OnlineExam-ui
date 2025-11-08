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
   * 考试名称
   */
  examName?: string;

  /**
   * 学生名称
   */
  studentName?: string;

  /**
   * 班别名称
   */
  deptName?: string;
}

/**
 * EduStudentExamResultVo，查询考试结果VO对象
 */
export interface EduStudentExamResultVo {
  /**
   * 客户端IP
   */
  clientIp?: string;
  /**
   * 正确题目数
   */
  correctCount?: number;
  /**
   * 部门ID
   */
  deptId?: number;
  /**
   * 部门名称
   */
  deptName?: string;
  /**
   * 考试ID
   */
  examId?: number;
  /**
   * 考试时长（分钟）
   */
  examTime?: number;
  /**
   * 结果ID
   */
  id?: number;
  /**
   * 是否已交卷（0否 1是）
   */
  isSubmit?: string;
  /**
   * 学生名字
   */
  nickName?: string;
  /**
   * 题目总数
   */
  questionCount?: number;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 开始考试时间
   */
  startTime?: Date;
  /**
   * 学生ID
   */
  studentId?: number;
  /**
   * 学生用户名
   */
  studentName?: string;
  /**
   * 交卷时间
   */
  submitTime?: Date;
  /**
   * 总分
   */
  totalScore?: number;
  /**
   * 浏览器信息
   */
  userAgent?: string;
  /**
   * 得分
   */
  userScore?: number;
  /**
   * 错误题目数
   */
  wrongCount?: number;
  /** 考试名称 */
  examName?: string;
  [property: string]: any;
}
