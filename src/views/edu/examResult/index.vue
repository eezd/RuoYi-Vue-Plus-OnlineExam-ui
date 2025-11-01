<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="考试ID" prop="examId">
              <el-input v-model="queryParams.examId" placeholder="请输入考试ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="学生ID" prop="studentId">
              <el-input v-model="queryParams.studentId" placeholder="请输入学生ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="开始考试时间" prop="startTime">
              <el-date-picker clearable v-model="queryParams.startTime" type="date" value-format="YYYY-MM-DD" placeholder="请选择开始考试时间" />
            </el-form-item>
            <el-form-item label="交卷时间" prop="submitTime">
              <el-date-picker clearable v-model="queryParams.submitTime" type="date" value-format="YYYY-MM-DD" placeholder="请选择交卷时间" />
            </el-form-item>
            <el-form-item label="实际考试时长" prop="examTime">
              <el-input v-model="queryParams.examTime" placeholder="请输入实际考试时长" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="总分" prop="totalScore">
              <el-input v-model="queryParams.totalScore" placeholder="请输入总分" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="得分" prop="userScore">
              <el-input v-model="queryParams.userScore" placeholder="请输入得分" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="题目总数" prop="questionCount">
              <el-input v-model="queryParams.questionCount" placeholder="请输入题目总数" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="正确题目数" prop="correctCount">
              <el-input v-model="queryParams.correctCount" placeholder="请输入正确题目数" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="错误题目数" prop="wrongCount">
              <el-input v-model="queryParams.wrongCount" placeholder="请输入错误题目数" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="是否已交卷" prop="isSubmit">
              <el-input v-model="queryParams.isSubmit" placeholder="请输入是否已交卷" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="客户端IP" prop="clientIp">
              <el-input v-model="queryParams.clientIp" placeholder="请输入客户端IP" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="浏览器信息" prop="userAgent">
              <el-input v-model="queryParams.userAgent" placeholder="请输入浏览器信息" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['edu:examResult:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['edu:examResult:edit']"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['edu:examResult:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['edu:examResult:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="examResultList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="结果ID" align="center" prop="id" v-if="true" />
        <el-table-column label="考试ID" align="center" prop="examId" />
        <el-table-column label="学生ID" align="center" prop="studentId" />
        <el-table-column label="开始考试时间" align="center" prop="startTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="交卷时间" align="center" prop="submitTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.submitTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实际考试时长" align="center" prop="examTime" />
        <el-table-column label="总分" align="center" prop="totalScore" />
        <el-table-column label="得分" align="center" prop="userScore" />
        <el-table-column label="题目总数" align="center" prop="questionCount" />
        <el-table-column label="正确题目数" align="center" prop="correctCount" />
        <el-table-column label="错误题目数" align="center" prop="wrongCount" />
        <el-table-column label="答题快照" align="center" prop="answerSnapshot" />
        <el-table-column label="是否已交卷" align="center" prop="isSubmit">
          <template #default="scope">
            <dict-tag :options="edu_exam_result_submit" :value="scope.row.isSubmit" />
          </template>
        </el-table-column>
        <el-table-column label="客户端IP" align="center" prop="clientIp" />
        <el-table-column label="浏览器信息" align="center" prop="userAgent" />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['edu:examResult:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['edu:examResult:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改考试结果对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="examResultFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="考试ID" prop="examId">
          <el-input v-model="form.examId" placeholder="请输入考试ID" />
        </el-form-item>
        <el-form-item label="学生ID" prop="studentId">
          <el-input v-model="form.studentId" placeholder="请输入学生ID" />
        </el-form-item>
        <el-form-item label="开始考试时间" prop="startTime">
          <el-date-picker clearable v-model="form.startTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择开始考试时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="交卷时间" prop="submitTime">
          <el-date-picker clearable v-model="form.submitTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择交卷时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="实际考试时长" prop="examTime">
          <el-input v-model="form.examTime" placeholder="请输入实际考试时长" />
        </el-form-item>
        <el-form-item label="总分" prop="totalScore">
          <el-input v-model="form.totalScore" placeholder="请输入总分" />
        </el-form-item>
        <el-form-item label="得分" prop="userScore">
          <el-input v-model="form.userScore" placeholder="请输入得分" />
        </el-form-item>
        <el-form-item label="题目总数" prop="questionCount">
          <el-input v-model="form.questionCount" placeholder="请输入题目总数" />
        </el-form-item>
        <el-form-item label="正确题目数" prop="correctCount">
          <el-input v-model="form.correctCount" placeholder="请输入正确题目数" />
        </el-form-item>
        <el-form-item label="错误题目数" prop="wrongCount">
          <el-input v-model="form.wrongCount" placeholder="请输入错误题目数" />
        </el-form-item>
        <el-form-item label="是否已交卷" prop="isSubmit">
          <el-input v-model="form.isSubmit" placeholder="请输入是否已交卷" />
        </el-form-item>
        <el-form-item label="客户端IP" prop="clientIp">
          <el-input v-model="form.clientIp" placeholder="请输入客户端IP" />
        </el-form-item>
        <el-form-item label="浏览器信息" prop="userAgent">
          <el-input v-model="form.userAgent" type="textarea" placeholder="请输入内容" />
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

<script setup name="ExamResult" lang="ts">
import { listExamResult, getExamResult, delExamResult, addExamResult, updateExamResult } from '@/api/edu/examResult';
import { ExamResultVO, ExamResultQuery, ExamResultForm } from '@/api/edu/examResult/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const examResultList = ref<ExamResultVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const examResultFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: ExamResultForm = {
  id: undefined,
  examId: undefined,
  studentId: undefined,
  startTime: undefined,
  submitTime: undefined,
  examTime: undefined,
  totalScore: undefined,
  userScore: undefined,
  questionCount: undefined,
  correctCount: undefined,
  wrongCount: undefined,
  answerSnapshot: undefined,
  isSubmit: undefined,
  clientIp: undefined,
  userAgent: undefined,
  remark: undefined
};
const data = reactive<PageData<ExamResultForm, ExamResultQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    examId: undefined,
    studentId: undefined,
    startTime: undefined,
    submitTime: undefined,
    examTime: undefined,
    totalScore: undefined,
    userScore: undefined,
    questionCount: undefined,
    correctCount: undefined,
    wrongCount: undefined,
    answerSnapshot: undefined,
    isSubmit: undefined,
    clientIp: undefined,
    userAgent: undefined,
    params: {}
  },
  rules: {
    id: [{ required: true, message: '结果ID不能为空', trigger: 'blur' }],
    examId: [{ required: true, message: '考试ID不能为空', trigger: 'blur' }],
    studentId: [{ required: true, message: '学生ID不能为空', trigger: 'blur' }],
    startTime: [{ required: true, message: '开始考试时间不能为空', trigger: 'blur' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询考试结果列表 */
const getList = async () => {
  loading.value = true;
  const res = await listExamResult(queryParams.value);
  examResultList.value = res.rows;
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
  examResultFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: ExamResultVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加考试结果';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: ExamResultVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getExamResult(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改考试结果';
};

/** 提交按钮 */
const submitForm = () => {
  examResultFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateExamResult(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addExamResult(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: ExamResultVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除考试结果编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delExamResult(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'edu/examResult/export',
    {
      ...queryParams.value
    },
    `examResult_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>
