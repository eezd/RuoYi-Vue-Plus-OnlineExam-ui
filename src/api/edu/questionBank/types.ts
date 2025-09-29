export interface QuestionBankVO {
  /**
   * 题库ID
   */
  id: string | number;

  /**
   * 题库名称
   */
  bankName: string;

  /**
   * 题库描述
   */
  bankDesc: string;

  /**
   * 分类ID
   */
  categoryId: string | number;

  /**
   * 状态（0正常 1停用）
   */
  status: string;

  /**
   * 备注
   */
  remark: string;
}

export interface QuestionBankForm extends BaseEntity {
  /**
   * 题库ID
   */
  id?: string | number;

  /**
   * 题库名称
   */
  bankName?: string;

  /**
   * 题库描述
   */
  bankDesc?: string;

  /**
   * 分类ID
   */
  categoryId?: string | number;

  /**
   * 状态（0正常 1停用）
   */
  status?: string;

  /**
   * 备注
   */
  remark?: string;
}

export interface QuestionBankQuery extends PageQuery {
  /**
   * 题库名称
   */
  bankName?: string;

  /**
   * 题库描述
   */
  bankDesc?: string;

  /**
   * 分类ID
   */
  categoryId?: string | number;

  /**
   * 状态（0正常 1停用）
   */
  status?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
