<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="题库名称" prop="bankName">
              <el-input v-model="queryParams.bankName" placeholder="请输入题库名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="题库描述" prop="bankDesc">
              <el-input v-model="queryParams.bankDesc" placeholder="请输入题库描述" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="分类选择" prop="categoryId">
              <el-tree-select
                v-model="queryParams.categoryId"
                :data="questionBankCategoryOptions"
                :props="{ value: 'id', label: 'categoryName', children: 'children' }"
                value-key="id"
                placeholder="请选择分类"
                check-strictly
              />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
                <el-option v-for="dict in edu_question_bank_status" :key="dict.value" :label="dict.label" :value="dict.value" />
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
      <el-table v-loading="loading" border :data="onlineExamList">
        <el-table-column label="考试名称" align="center" prop="examName" />
        <el-table-column label="考试分类" align="center" prop="categoryName" />
        <el-table-column label="题库名称" align="center" prop="bankName" />
        <el-table-column label="考试时长(分钟)" align="center" prop="examTime" />
        <el-table-column label="开始考试时间" align="center" prop="startTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开始考试时间" align="center" prop="endTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="edu_question_bank_status" :value="scope.row.status" />
          </template>
        </el-table-column> -->
        <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['edu:questionBank:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="参加考试" placement="top">
              <el-button type="success" round>参加考试</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改题库对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="questionBankFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="题库名称" prop="bankName">
          <el-input v-model="form.bankName" placeholder="请输入题库名称" />
        </el-form-item>
        <el-form-item label="题库描述" prop="bankDesc">
          <el-input v-model="form.bankDesc" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <!-- <el-form-item label="分类ID" prop="categoryId">
          <el-input v-model="form.categoryId" placeholder="请输入分类ID" />
        </el-form-item> -->
        <el-form-item label="分类" prop="parentId">
          <el-tree-select
            v-model="form.categoryId"
            :data="questionBankCategoryOptions"
            :props="{ value: 'id', label: 'categoryName', children: 'children' }"
            value-key="id"
            placeholder="请选择分类"
            check-strictly
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="dict in edu_question_bank_status" :key="dict.value" :value="dict.value">{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="QuestionBank" lang="ts">
import { ExamVO } from '@/api/edu/exam/types';
import { listQuestionBank } from '@/api/edu/questionBank';
import { QuestionBankVO, QuestionBankQuery, QuestionBankForm } from '@/api/edu/questionBank/types';
import { QuestionBankCategoryVO } from '@/api/edu/questionBankCategory/types';

import { listStudentExam } from '@/api/edu/studentExam';

type QuestionBankCategoryOption = {
  id: number;
  categoryName: string;
  children?: QuestionBankCategoryOption[];
};

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { edu_question_bank_status } = toRefs<any>(proxy?.useDict('edu_question_bank_status'));
const router = useRouter();

const onlineExamList = ref<ExamVO[]>([]);
const questionBankCategoryOptions = ref<QuestionBankCategoryOption[]>([]);
const questionBankCategory = ref<QuestionBankCategoryVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const questionBankFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: QuestionBankForm = {
  id: undefined,
  bankName: undefined,
  bankDesc: undefined,
  categoryId: 1,
  status: undefined,
  remark: undefined
};

const data = reactive<PageData<QuestionBankForm, QuestionBankQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    bankName: undefined,
    bankDesc: undefined,
    categoryId: undefined,
    status: undefined,
    params: {}
  },
  rules: {
    id: [{ required: true, message: '题库ID不能为空', trigger: 'blur' }],
    bankName: [{ required: true, message: '题库名称不能为空', trigger: 'blur' }],
    categoryId: [{ required: true, message: '分类ID不能为空', trigger: 'blur' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询题库列表 */
const getList = async () => {
  loading.value = true;
  const res = await listStudentExam(queryParams.value);
  onlineExamList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  questionBankFormRef.value?.resetFields();
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

/** 修改按钮操作 */
const handleUpdate = async (row?: QuestionBankVO) => {
  reset();
  dialog.visible = true;
  dialog.title = '修改题库';
};

/** 提交按钮 */
const submitForm = () => {
  questionBankFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      // if (form.value.id) {
      //   await updateQuestionBank(form.value).finally(() => (buttonLoading.value = false));
      // } else {
      //   await addQuestionBank(form.value).finally(() => (buttonLoading.value = false));
      // }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** */


onMounted(() => {
  getList();
});
</script>
