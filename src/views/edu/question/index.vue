<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <!-- <el-form-item label="题库ID" prop="bankId">
              <el-input v-model="queryParams.bankId" placeholder="请输入题库ID" clearable @keyup.enter="handleQuery" />
            </el-form-item> -->
            <el-form-item label="题目类型" prop="questionType">
              <el-select v-model="queryParams.questionType" placeholder="请选择题目类型" clearable>
                <el-option v-for="dict in edu_question_type" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="题目" prop="questionTitle">
              <el-input v-model="queryParams.questionTitle" placeholder="请输入题目" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="难度等级" prop="difficulty">
              <el-input v-model="queryParams.difficulty" placeholder="请输入难度等级" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
                <el-option v-for="dict in edu_question_status" :key="dict.value" :label="dict.label" :value="dict.value" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['edu:question:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['edu:question:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['edu:question:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['edu:question:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="questionList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="试题ID" align="center" prop="id" v-if="true" />
        <!-- <el-table-column label="题库ID" align="center" prop="bankId" /> -->
        <el-table-column label="题库名称" align="center">
          <template #default="">
            <el-text class="mx-1" type="primary">{{ questionBankName }}</el-text>
          </template>
        </el-table-column>
        <el-text class="mx-1 block" type="success" size="large">{{ questionBankName }}</el-text>
        <el-table-column label="题目类型" align="center" prop="questionType">
          <template #default="scope">
            <dict-tag :options="edu_question_type" :value="scope.row.questionType" />
          </template>
        </el-table-column>
        <el-table-column label="题目" align="center" prop="questionTitle" />
        <el-table-column label="正确答案" align="center" prop="correctAnswer" />
        <!-- <el-table-column label="答案解析" align="center" prop="answerAnalysis" /> -->
        <el-table-column label="难度等级" align="center" prop="difficulty" />
        <el-table-column label="题目分值" align="center" prop="score" />
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="edu_question_status" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['edu:question:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['edu:question:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改试题对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="questionFormRef" :model="form" :rules="rules" label-width="80px">
        <!-- <el-form-item label="题库ID" prop="bankId">
          <el-input v-model="form.bankId" placeholder="请输入题库ID" />
        </el-form-item> -->
        <el-form-item label="题目类型" prop="questionType">
          <el-radio-group v-model="form.questionType">
            <el-radio v-for="dict in edu_question_type" :key="dict.value" :value="dict.value">{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="题目" prop="questionTitle">
          <el-input v-model="form.questionTitle" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <!-- 动态生成的选项内容 -->
        <el-form-item label="选项内容" prop="options">
          <!-- 单选题和多选题的选项 -->
          <div v-if="form.questionType === '1' || form.questionType === '2'" class="option-container">
            <el-input v-for="key in optionKeys" :key="key" v-model="form.options[key]" class="option-input">
              <template #prepend>选项 {{ key }}</template>
            </el-input>
          </div>
          <!-- 判断题的选项 -->
          <div v-else-if="form.questionType === '3'" class="option-container">
            <el-alert title="判断题选项固定，请在'正确答案'中填写 A 或 B" type="info" :closable="false" show-icon style="margin-bottom: 10px" />
            <el-input v-model="form.options.A" disabled>
              <template #prepend>选项 A</template>
            </el-input>
            <el-input v-model="form.options.B" disabled class="option-input">
              <template #prepend>选项 B</template>
            </el-input>
          </div>
          <!-- 没有选择题目类型时的提示 -->
          <div v-else>
            <el-text type="info">请先选择题目类型</el-text>
          </div>
        </el-form-item>
        <el-form-item label="正确答案" prop="correctAnswer">
          <el-input v-model="form.correctAnswer" placeholder="请输入正确答案" />
        </el-form-item>
        <el-form-item label="答案解析" prop="answerAnalysis">
          <el-input v-model="form.answerAnalysis" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="难度等级" prop="difficulty">
          <el-input v-model="form.difficulty" placeholder="请输入难度等级" />
        </el-form-item>
        <el-form-item label="题目分值" prop="score">
          <el-input v-model="form.score" placeholder="请输入题目分值" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="dict in edu_question_status" :key="dict.value" :value="dict.value">{{ dict.label }}</el-radio>
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

<script setup name="Question" lang="ts">
import { listQuestion, getQuestion, delQuestion, addQuestion, updateQuestion } from '@/api/edu/question';
import { getQuestionBank } from '@/api/edu/questionBank';
import { QuestionVO, QuestionQuery, QuestionForm } from '@/api/edu/question/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { edu_question_status, edu_question_type } = toRefs<any>(proxy?.useDict('edu_question_status', 'edu_question_type'));
const route = useRoute();

const questionList = ref<QuestionVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const questionFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: QuestionForm = {
  id: undefined,
  bankId: undefined,
  questionType: '1',
  questionTitle: undefined,
  options: { A: '', B: '', C: '', D: '' },
  correctAnswer: undefined,
  answerAnalysis: undefined,
  difficulty: undefined,
  score: undefined,
  status: undefined,
  remark: undefined
};
const data = reactive<PageData<QuestionForm, QuestionQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    bankId: undefined,
    questionType: undefined,
    questionTitle: undefined,
    difficulty: undefined,
    status: undefined,
    params: {}
  },
  rules: {
    id: [{ required: true, message: '试题ID不能为空', trigger: 'blur' }],
    bankId: [{ required: true, message: '题库ID不能为空', trigger: 'blur' }],
    questionType: [{ required: true, message: '题目类型不能为空', trigger: 'change' }],
    questionTitle: [{ required: true, message: '题目不能为空', trigger: 'blur' }],
    options: [{ required: true, message: '选项内容不能为空', trigger: 'blur' }],
    correctAnswer: [{ required: true, message: '正确答案不能为空', trigger: 'blur' }],
    difficulty: [{ required: true, message: '难度等级不能为空', trigger: 'blur' }],
    score: [{ required: true, message: '题目分值不能为空', trigger: 'blur' }],
    status: [{ required: true, message: '状态不能为空', trigger: 'change' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

// 定义单选/多选题的选项 Key
const optionKeys = ['A', 'B', 'C', 'D', 'E', 'F'];
// 保存切换类型时的选项值
let optionsSave = reactive({});

const questionBankName = ref('');

/** 查询试题列表 */
const getList = async () => {
  loading.value = true;
  console.log(route.params.bankId);
  const bankId = route.params.bankId as string | number;
  initFormData.bankId = bankId;
  data.queryParams.bankId = bankId;

  const res = await listQuestion(queryParams.value);
  questionList.value = res.rows;
  total.value = res.total;

  const resBank = await getQuestionBank(bankId);
  questionBankName.value = resBank.data.bankName;

  loading.value = false;
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
  // 手动清空 options
  form.value.options = {};
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  questionFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: QuestionVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加试题';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: QuestionVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getQuestion(_id);
  // 解析options字段，确保它是一个对象
  let options = {};
  try {
    options = JSON.parse(res.data.options); // 解析 options 字符串，如果为空就使用空对象
  } catch (e) {
    console.error('Options parsing failed', e);
    options = {}; // 如果解析失败，确保不会影响后续操作
  }
  Object.assign(form.value, res.data);
  form.value.options = options;
  dialog.visible = true;
  dialog.title = '修改试题';
};

/** 提交按钮 */
const submitForm = () => {
  questionFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      form.value.options = JSON.stringify(form.value.options);
      if (form.value.id) {
        await updateQuestion(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addQuestion(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: QuestionVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除试题编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delQuestion(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'edu/question/export',
    {
      ...queryParams.value
    },
    `question_${new Date().getTime()}.xlsx`
  );
};

/**
 * 监听题目类型的变化，动态处理 options
 */
watch(
  () => form.value.questionType,
  (newType) => {
    console.log(form.value.options !== null);
    if (form.value.options.A !== '正确') {
      optionsSave = form.value.options;
    }

    // 如果是单选题或多选题
    if (newType === '1' || newType === '2') {
      form.value.options = optionsSave;
    }
    // 如果是判断题
    if (newType === '3') {
      // 设置固定的“正确”和“错误”选项
      form.value.options = { A: '正确', B: '错误' };
    }
  }
);

onMounted(() => {
  getList();
});
</script>

<style lang="scss" scoped>
.option-container .option-input {
  margin-bottom: 10px; /* 给每个选项之间增加一点间距 */
}
/* 最后一个选项不需要下边距 */
.option-container .option-input:last-child {
  margin-bottom: 0;
}
</style>
