export interface ExamClassVO {
  /**
   * 考试ID
   */
  examId?: number;

  /**
   * 考试名称
   */
  examName?: string;

  /**
   * 关联部门列表
   */
  deptList?: DeptInfo[];
}

export interface ExamClassForm extends BaseEntity {
  /**
   * 考试ID
   */
  examId?: string | number;

  /**
   * 部门ID
   */
  deptId?: string | number;
}

/**
 * DeptInfo
 */
export interface DeptInfo {
  /**
   * 部门ID
   */
  deptId?: number;
  /**
   * 部门名称
   */
  deptName?: string;
}
