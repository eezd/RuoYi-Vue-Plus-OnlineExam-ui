export interface QuestionBankCategoryVO {
  /**
   * 分类ID
   */
  id: string | number;

  /**
   * 父级分类ID，根节点为0
   */
  parentId: string | number;

  /**
   * 分类名称
   */
  categoryName: string;

  /**
   * 排序
   */
  sortOrder: number;

  /**
   * 状态（0正常 1停用）
   */
  status: string;

  /**
   * 子对象
   */
  children: QuestionBankCategoryVO[];
}

export interface QuestionBankCategoryForm extends BaseEntity {
  /**
   * 分类ID
   */
  id?: string | number;

  /**
   * 父级分类ID，根节点为0
   */
  parentId?: string | number;

  /**
   * 分类名称
   */
  categoryName?: string;

  /**
   * 分类描述
   */
  categoryDesc?: string;

  /**
   * 排序
   */
  sortOrder?: number;

  /**
   * 状态（0正常 1停用）
   */
  status?: string;

  /**
   * 备注
   */
  remark?: string;
}

export interface QuestionBankCategoryQuery {
  /**
   * 分类名称
   */
  categoryName?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
