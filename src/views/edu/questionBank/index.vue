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
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['edu:questionBank:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['edu:questionBank:edit']"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['edu:questionBank:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['edu:questionBank:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="questionBankList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
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
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['edu:questionBank:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['edu:questionBank:remove']"></el-button>
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
import { listQuestionBank, getQuestionBank, delQuestionBank, addQuestionBank, updateQuestionBank } from '@/api/edu/questionBank';
import { QuestionBankVO, QuestionBankQuery, QuestionBankForm } from '@/api/edu/questionBank/types';
import { listQuestionBankCategory } from '@/api/edu/questionBankCategory';
import { QuestionBankCategoryVO } from '@/api/edu/questionBankCategory/types';

type QuestionBankCategoryOption = {
  id: number;
  categoryName: string;
  children?: QuestionBankCategoryOption[];
};

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { edu_question_bank_status } = toRefs<any>(proxy?.useDict('edu_question_bank_status'));

const questionBankList = ref<QuestionBankVO[]>([]);
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
  const res = await listQuestionBank(queryParams.value);
  await getQuestionBankCategory();
  questionBankList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/** 查询题库分类下拉树结构 */
const getTreeselect = async () => {
  const res = await listQuestionBankCategory();
  questionBankCategoryOptions.value = [];
  const data: QuestionBankCategoryOption = { id: 0, categoryName: '顶级节点', children: [] };
  data.children = proxy?.handleTree<QuestionBankCategoryOption>(res.data, 'id', 'parentId');
  console.log(data);
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

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  questionBankFormRef.value?.resetFields();
  getQuestionBankCategory();
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
const handleSelectionChange = (selection: QuestionBankVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  getTreeselect();
  dialog.visible = true;
  dialog.title = '添加题库';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: QuestionBankVO) => {
  reset();
  await getTreeselect();
  const _id = row?.id || ids.value[0];
  const res = await getQuestionBank(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改题库';
};

/** 提交按钮 */
const submitForm = () => {
  questionBankFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateQuestionBank(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addQuestionBank(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: QuestionBankVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除题库编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delQuestionBank(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'edu/questionBank/export',
    {
      ...queryParams.value
    },
    `questionBank_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
  getTreeselect();
});
</script>
