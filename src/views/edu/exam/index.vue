<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="考试名称" prop="examName">
              <el-input v-model="queryParams.examName" placeholder="请输入考试名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <!-- <el-form-item label="考试描述" prop="examDesc">
              <el-input v-model="queryParams.examDesc" placeholder="请输入考试描述" clearable @keyup.enter="handleQuery" />
            </el-form-item> -->
            <el-form-item label="分类" prop="categoryId">
              <!-- <el-input v-model="queryParams.categoryId" placeholder="请输入考试分类ID" clearable @keyup.enter="handleQuery" /> -->
              <el-tree-select
                v-model="queryParams.categoryId"
                :data="examCategoryOptions"
                :props="{ value: 'id', label: 'categoryName', children: 'children' }"
                value-key="id"
                placeholder="请选择分类"
                check-strictly
              />
            </el-form-item>
            <!-- <el-form-item label="关联题库ID" prop="bankId">
              <el-input v-model="queryParams.bankId" placeholder="请输入关联题库ID" clearable @keyup.enter="handleQuery" />
            </el-form-item> -->
            <!-- <el-form-item label="考试时长" prop="examTime">
              <el-input v-model="queryParams.examTime" placeholder="请输入考试时长" clearable @keyup.enter="handleQuery" />
            </el-form-item> -->
            <!-- <el-form-item label="考试开始时间" prop="startTime">
              <el-date-picker clearable v-model="queryParams.startTime" type="date" value-format="YYYY-MM-DD" placeholder="请选择考试开始时间" />
            </el-form-item> -->
            <!-- <el-form-item label="考试结束时间" prop="endTime">
              <el-date-picker clearable v-model="queryParams.endTime" type="date" value-format="YYYY-MM-DD" placeholder="请选择考试结束时间" />
            </el-form-item> -->
            <el-form-item label="是否随机出题" prop="isRandom">
              <el-select v-model="queryParams.isRandom" placeholder="请选择是否随机出题" clearable>
                <el-option v-for="dict in edu_exam_is_random" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="是否允许查看答案" prop="allowReview">
              <el-select v-model="queryParams.allowReview" placeholder="请选择是否允许查看答案" clearable>
                <el-option v-for="dict in edu_exam_allow_review" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
                <el-option v-for="dict in edu_exam_status" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['edu:exam:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['edu:exam:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['edu:exam:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['edu:exam:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="examList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="考试ID" align="center" prop="id" v-if="true" /> -->
        <el-table-column label="考试名称" align="center" prop="examName" />
        <!-- <el-table-column label="考试描述" align="center" prop="examDesc" /> -->
        <el-table-column label="考试分类" align="center" prop="categoryName" />
        <el-table-column label="关联题库" align="center" prop="bankName" />
        <el-table-column label="考试时长" align="center" prop="examTime" />
        <el-table-column label="考试开始时间" align="center" prop="startTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="考试结束时间" align="center" prop="endTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否随机出题" align="center" prop="isRandom">
          <template #default="scope">
            <dict-tag :options="edu_exam_is_random" :value="scope.row.isRandom" />
          </template>
        </el-table-column>
        <el-table-column label="是否允许查看答案" align="center" prop="allowReview">
          <template #default="scope">
            <dict-tag :options="edu_exam_allow_review" :value="scope.row.allowReview" />
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="edu_exam_status" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width" width="110">
          <template #default="scope">
            <el-tooltip content="绑定班级" placement="top">
              <el-button link type="primary" icon="Link" @click="handleBindClass(scope.row)" v-hasPermi="['edu:exam:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['edu:exam:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['edu:exam:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>

    <!-- 添加或修改考试信息对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="800px" append-to-body>
      <el-steps :active="activeStep" align-center finish-status="success" class="mb-4">
        <el-step title="选择题库" />
        <el-step title="填写考试信息" />
      </el-steps>

      <div v-if="activeStep === 0">
        <!-- <el-form-item label="关联题库" prop="bankId">
          <el-input v-model="form.bankId" placeholder="请输入关联题库ID" />
        </el-form-item> -->
        <el-form ref="queryBankFormRef" :model="queryBankParams" :inline="true">
          <el-form-item label="题库名称" prop="bankName">
            <el-input v-model="queryBankParams.bankName" placeholder="请输入题库名称" clearable @keyup.enter="handleQueryBank" />
          </el-form-item>
          <el-form-item label="分类选择" prop="categoryId">
            <el-tree-select
              v-model="queryBankParams.categoryId"
              :data="questionBankCategoryOptions"
              :props="{ value: 'id', label: 'categoryName', children: 'children' }"
              value-key="id"
              placeholder="请选择分类"
              check-strictly
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryBankParams.status" placeholder="请选择状态" clearable>
              <el-option v-for="dict in edu_question_bank_status" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQueryBank">搜索</el-button>
            <el-button icon="Refresh" @click="resetQueryBank">重置</el-button>
          </el-form-item>
        </el-form>

        <el-table v-loading="loadingBank" border :data="questionBankList" @selection-change="handleSelectionChange">
          <!-- <el-table-column label="题库ID" align="center" prop="id" v-if="true" /> -->
          <el-table-column label="题库名称" align="center" prop="bankName" />
          <el-table-column label="题库描述" align="center" prop="bankDesc" />
          <el-table-column label="分类" align="center" prop="categoryId">
            <template #default="scope">
              <el-tag v-for="item in filteredQuestionBankCategory(scope.row.categoryId)" :key="item.id">
                {{ item.categoryName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" prop="status">
            <template #default="scope">
              <dict-tag :options="edu_question_bank_status" :value="scope.row.status" />
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" prop="remark" />
          <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-button v-if="form.bankId !== scope.row.id" link type="primary" @click="bindBank(scope.row)"> 绑定 </el-button>
              <el-button v-else link type="danger" @click="unbindBank"> 解除绑定 </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="totalBank > 0"
          :total="totalBank"
          v-model:page="queryBankParams.pageNum"
          v-model:limit="queryBankParams.pageSize"
          @pagination="getListBank"
        />
      </div>
      <div v-if="activeStep === 1">
        <el-form ref="examFormRef" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="考试名称" prop="examName">
            <el-input v-model="form.examName" placeholder="请输入考试名称" />
          </el-form-item>
          <el-form-item label="考试描述" prop="examDesc">
            <el-input v-model="form.examDesc" type="textarea" placeholder="请输入内容" />
          </el-form-item>
          <el-form-item label="考试分类" prop="categoryId">
            <el-tree-select
              v-model="form.categoryId"
              :data="examCategoryOptions"
              :props="{ value: 'id', label: 'categoryName', children: 'children' }"
              value-key="id"
              placeholder="请选择分类"
              check-strictly
            />
          </el-form-item>
          <el-form-item label="考试时长" prop="examTime">
            <el-input v-model="form.examTime" placeholder="请输入考试时长" />
          </el-form-item>
          <el-form-item label="考试开始时间" prop="startTime">
            <el-date-picker clearable v-model="form.startTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择考试开始时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="考试结束时间" prop="endTime">
            <el-date-picker clearable v-model="form.endTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择考试结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="是否随机出题" prop="isRandom">
            <el-select v-model="form.isRandom" placeholder="请选择是否随机出题" clearable>
              <el-option v-for="dict in edu_exam_is_random" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否允许查看答案" prop="allowReview">
            <el-select v-model="form.allowReview" placeholder="请选择是否允许查看答案" clearable>
              <el-option v-for="dict in edu_exam_allow_review" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio v-for="dict in edu_exam_status" :key="dict.value" :value="dict.value">{{ dict.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button v-show="activeStep === 0" :disabled="!form.bankId" type="primary" @click="nextStep">下一步</el-button>
          <el-button v-show="activeStep === 1" @click="prevStep">上一步</el-button>
          <el-button v-show="activeStep === 1" :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <dialog-bind-class ref="dialogBindClassRef" v-model:visible="dialogBindClassData.visible" :exam-id="dialogBindClassData.examId" />
  </div>
</template>

<script setup name="Exam" lang="ts">
import dialogBindClass from './dialogBindClass.vue';
import { listExam, getExam, delExam, addExam, updateExam } from '@/api/edu/exam';
import { ExamVO, ExamQuery, ExamForm } from '@/api/edu/exam/types';
import { listExamCategory } from '@/api/edu/examCategory';
import { listQuestionBank } from '@/api/edu/questionBank';
import { QuestionBankQuery, QuestionBankVO } from '@/api/edu/questionBank/types';
import { listQuestionBankCategory } from '@/api/edu/questionBankCategory';
import { QuestionBankCategoryVO } from '@/api/edu/questionBankCategory/types';
import { getCurrentInstance } from 'vue';

type ExamCategoryOption = {
  id: number;
  categoryName: string;
  children?: ExamCategoryOption[];
};

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { edu_exam_allow_review, edu_exam_status, edu_exam_is_random, edu_question_bank_status } = toRefs<any>(
  proxy?.useDict('edu_exam_allow_review', 'edu_exam_status', 'edu_exam_is_random', 'edu_question_bank_status')
);

const examList = ref<ExamVO[]>([]);
const examCategoryOptions = ref<ExamCategoryOption[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const examFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: ExamForm = {
  id: undefined,
  examName: undefined,
  examDesc: undefined,
  categoryId: undefined,
  bankId: undefined,
  examTime: undefined,
  startTime: undefined,
  endTime: undefined,
  isRandom: undefined,
  allowReview: undefined,
  status: undefined,
  remark: undefined
};

const data = reactive<PageData<ExamForm, ExamQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    examName: undefined,
    examDesc: undefined,
    categoryId: undefined,
    bankId: undefined,
    examTime: undefined,
    startTime: undefined,
    endTime: undefined,
    isRandom: undefined,
    allowReview: undefined,
    status: undefined,
    params: {}
  },
  rules: {
    id: [{ required: true, message: '考试ID不能为空', trigger: 'blur' }],
    examName: [{ required: true, message: '考试名称不能为空', trigger: 'blur' }],
    categoryId: [{ required: true, message: '考试分类ID不能为空', trigger: 'blur' }],
    bankId: [{ required: true, message: '关联题库ID不能为空', trigger: 'blur' }],
    examTime: [{ required: true, message: '考试时长不能为空', trigger: 'blur' }],
    startTime: [{ required: true, message: '考试开始时间不能为空', trigger: 'blur' }],
    endTime: [{ required: true, message: '考试结束时间不能为空', trigger: 'blur' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

// 当前步骤
const activeStep = ref(0);

const nextStep = () => {
  activeStep.value = 1;
};
const prevStep = () => {
  activeStep.value = 0;
};

/** 查询考试信息列表 */
const getList = async () => {
  loading.value = true;
  const res = await listExam(queryParams.value);
  getTreeselect();
  getBankTreeselect();
  examList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/** 查询考试分类下拉树结构 */
const getTreeselect = async () => {
  const res = await listExamCategory();
  examCategoryOptions.value = [];
  const data: ExamCategoryOption = { id: 0, categoryName: '顶级节点', children: [] };
  data.children = proxy?.handleTree<ExamCategoryOption>(res.data, 'id', 'parentId');
  examCategoryOptions.value.push(data);
};

//#region 题库分类下拉树结构
type QuestionBankCategoryOption = {
  id: number;
  categoryName: string;
  children?: QuestionBankCategoryOption[];
};
const queryBankFormRef = ref<ElFormInstance>();
const questionBankList = ref<QuestionBankVO[]>([]);
const questionBankCategory = ref<QuestionBankCategoryVO[]>([]);
const questionBankCategoryOptions = ref<QuestionBankCategoryOption[]>([]);
const queryBankParams = ref<QuestionBankQuery>({
  pageNum: 1,
  pageSize: 10,
  bankName: undefined,
  bankDesc: undefined,
  categoryId: undefined,
  status: undefined,
  params: {}
});

const loadingBank = ref(true);
const totalBank = ref(0);
/** 查询题库列表 */
const getListBank = async () => {
  loadingBank.value = true;
  const res = await listQuestionBank(queryParams.value);
  await getQuestionBankCategory();
  questionBankList.value = res.rows;
  totalBank.value = res.total;
  loadingBank.value = false;
};

/** 查询题库分类下拉树结构 */
const getBankTreeselect = async () => {
  const res = await listQuestionBankCategory();
  questionBankCategoryOptions.value = [];
  const data: QuestionBankCategoryOption = { id: 0, categoryName: '顶级节点', children: [] };
  data.children = proxy?.handleTree<QuestionBankCategoryOption>(res.data, 'id', 'parentId');
  questionBankCategoryOptions.value.push(data);
};
/** 查询题库分类 */
const getQuestionBankCategory = async () => {
  const res = await listQuestionBankCategory();
  questionBankCategory.value = res.data;
};
/** 获取题库分类名称 */
function filteredQuestionBankCategory(categoryId: string | number) {
  return questionBankCategory.value.filter((item) => item.id === categoryId);
}
const bindBank = (row: any) => {
  form.value.bankId = row.id;
};

const unbindBank = () => {
  form.value.bankId = null;
};
/** 搜索按钮操作 */
const handleQueryBank = async () => {
  queryBankParams.value.pageNum = 1;
  await getListBank();
};

/** 重置按钮操作 */
const resetQueryBank = () => {
  queryBankFormRef.value?.resetFields();
  handleQueryBank();
};

//#endregion

//#region 绑定班级

export interface DialogBindClassOption extends DialogOption {
  examId: number;
}
const dialogBindClassData = reactive<DialogOption & { examId: number | string | null }>({
  visible: false,
  title: '',
  examId: null
});
const handleBindClass = (row: ExamVO) => {
  dialogBindClassData.visible = true;
  dialogBindClassData.title = '绑定班级';
  dialogBindClassData.examId = row.id;
};
//#endregion
/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  examFormRef.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: ExamVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加考试信息';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: ExamVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getExam(_id);
  Object.assign(form.value, res.data);
  await handleQueryBank();
  dialog.visible = true;
  dialog.title = '修改考试信息';
};

/** 提交按钮 */
const submitForm = () => {
  examFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateExam(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addExam(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: ExamVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除考试信息编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delExam(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'edu/exam/export',
    {
      ...queryParams.value
    },
    `exam_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>
