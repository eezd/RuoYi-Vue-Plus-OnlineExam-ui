export interface ExamVO {
  /**
   * 考试ID
   */
  id: string | number;

  /**
   * 考试名称
   */
  examName: string;

  /**
   * 考试描述
   */
  examDesc: string;

  /**
   * 考试分类ID
   */
  categoryId: string | number;

  /**
   * 考试分类名称
   */
  categoryName: string;

  /**
   * 关联题库ID
   */
  bankId: string | number;

  /**
   * 关联题库名称
   */
  bankName: string;

  /**
   * 考试时长（分钟）
   */
  examTime: number;

  /**
   * 考试开始时间
   */
  startTime: string;

  /**
   * 考试结束时间
   */
  endTime: string;

  /**
   * 是否随机出题（0否 1是）
   */
  isRandom: string;

  /**
   * 是否允许查看答案（0否 1是）
   */
  allowReview: string;

  /**
   * 状态（0待发布 1发布 2过期）
   */
  status: string;

  /**
   * 备注
   */
  remark: string;
}

export interface ExamForm extends BaseEntity {
  /**
   * 考试ID
   */
  id?: string | number;

  /**
   * 考试名称
   */
  examName?: string;

  /**
   * 考试描述
   */
  examDesc?: string;

  /**
   * 考试分类ID
   */
  categoryId?: string | number;

  /**
   * 关联题库ID
   */
  bankId?: string | number;

  /**
   * 考试时长（分钟）
   */
  examTime?: number;

  /**
   * 考试开始时间
   */
  startTime?: string;

  /**
   * 考试结束时间
   */
  endTime?: string;

  /**
   * 是否随机出题（0否 1是）
   */
  isRandom?: string;

  /**
   * 是否允许查看答案（0否 1是）
   */
  allowReview?: string;

  /**
   * 状态（0待发布 1发布 2过期）
   */
  status?: string;

  /**
   * 备注
   */
  remark?: string;
}

export interface ExamQuery extends PageQuery {
  /**
   * 考试名称
   */
  examName?: string;

  /**
   * 考试描述
   */
  examDesc?: string;

  /**
   * 考试分类ID
   */
  categoryId?: string | number;

  /**
   * 关联题库ID
   */
  bankId?: string | number;

  /**
   * 考试时长（分钟）
   */
  examTime?: number;

  /**
   * 考试开始时间
   */
  startTime?: string;

  /**
   * 考试结束时间
   */
  endTime?: string;

  /**
   * 是否随机出题（0否 1是）
   */
  isRandom?: string;

  /**
   * 是否允许查看答案（0否 1是）
   */
  allowReview?: string;

  /**
   * 状态（0待发布 1发布 2过期）
   */
  status?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}

/**
 * EduExamResult，考试结果对象 edu_exam_result
 */
export interface EduExamResult {
  /**
   * 答题快照（JSON格式记录所有答题情况）
   */
  answerSnapshot?: string;
  /**
   * 客户端IP
   */
  clientIp?: string;
  /**
   * 正确题目数
   */
  correctCount?: number;
  /**
   * 创建者
   */
  createBy?: number;
  /**
   * 创建部门
   */
  createDept?: number;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 考试ID
   */
  examId?: number;
  /**
   * 实际考试时长（分钟）
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
   * 请求参数
   */
  params?: { [key: string]: any };
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
   * 交卷时间
   */
  submitTime?: Date;
  /**
   * 租户编号
   */
  tenantId?: string;
  /**
   * 总分
   */
  totalScore?: number;
  /**
   * 更新者
   */
  updateBy?: number;
  /**
   * 更新时间
   */
  updateTime?: Date;
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
  [property: string]: any;
}

export interface EduExamResultSubmitQuery {
  /**
   * 答题快照（JSON格式记录所有答题情况）
   */
  answerSnapshot?: string;
  /**
   * 考试ID
   */
  id?: number;
}
