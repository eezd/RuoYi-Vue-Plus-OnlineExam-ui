export interface ExamCategoryVO {
  /**
   * 考试分类ID
   */
  id: string | number;

  /**
   * 父级分类ID,根节点为0
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
   * 备注
   */
  remark: string;

  /**
   * 子对象
   */
  children: ExamCategoryVO[];
}

export interface ExamCategoryForm extends BaseEntity {
  /**
   * 考试分类ID
   */
  id?: string | number;

  /**
   * 父级分类ID,根节点为0
   */
  parentId?: string | number;

  /**
   * 分类名称
   */
  categoryName?: string;

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

export interface ExamCategoryQuery {
  /**
   * 父级分类ID,根节点为0
   */
  parentId?: string | number;

  /**
   * 分类名称
   */
  categoryName?: string;

  /**
   * 状态（0正常 1停用）
   */
  status?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
