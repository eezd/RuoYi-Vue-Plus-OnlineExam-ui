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
