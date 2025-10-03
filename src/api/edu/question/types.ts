export interface QuestionVO {
  /**
   * 试题ID
   */
  id: string | number;

  /**
   * 题库ID
   */
  bankId: string | number;

  /**
   * 题目类型（1-单选 2-多选 3-判断）
   */
  questionType: string;

  /**
   * 题目
   */
  questionTitle: string;

  /**
   * 选项内容（JSON格式，判断题可为空）
   */
  options: string;

  /**
   * 正确答案
   */
  correctAnswer: string;

  /**
   * 答案解析
   */
  answerAnalysis: string;

  /**
   * 难度等级（1-简单 2-中等 3-困难）
   */
  difficulty: string;

  /**
   * 题目分值
   */
  score: number;

  /**
   * 状态（0正常 1停用）
   */
  status: string;

  /**
   * 备注
   */
  remark: string;
}

export interface QuestionForm extends BaseEntity {
  /**
   * 试题ID
   */
  id?: string | number;

  /**
   * 题库ID
   */
  bankId?: string | number;

  /**
   * 题目类型（1-单选 2-多选 3-判断）
   */
  questionType?: string;

  /**
   * 题目
   */
  questionTitle?: string;

  /**
   * 选项内容（JSON格式，判断题可为空）
   */
  options?: { [key: string]: string } | string;

  /**
   * 正确答案
   */
  correctAnswer?: string;

  /**
   * 答案解析
   */
  answerAnalysis?: string;

  /**
   * 难度等级（1-简单 2-中等 3-困难）
   */
  difficulty?: string;

  /**
   * 题目分值
   */
  score?: number;

  /**
   * 状态（0正常 1停用）
   */
  status?: string;

  /**
   * 备注
   */
  remark?: string;
}

export interface QuestionQuery extends PageQuery {
  /**
   * 题库ID
   */
  bankId?: string | number;

  /**
   * 题目类型（1-单选 2-多选 3-判断）
   */
  questionType?: string;

  /**
   * 题目
   */
  questionTitle?: string;

  /**
   * 难度等级（1-简单 2-中等 3-困难）
   */
  difficulty?: string;

  /**
   * 状态（0正常 1停用）
   */
  status?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
