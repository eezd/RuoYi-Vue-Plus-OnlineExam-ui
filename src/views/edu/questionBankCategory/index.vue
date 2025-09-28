<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="分类名称" prop="categoryName">
              <el-input v-model="queryParams.categoryName" placeholder="请输入分类名称" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd()" v-hasPermi="['edu:questionBankCategory:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="info" plain icon="Sort" @click="handleToggleExpandAll">展开/折叠</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>
      <el-table
        ref="questionBankCategoryTableRef"
        v-loading="loading"
        :data="questionBankCategoryList"
        row-key="id"
        border
        :default-expand-all="isExpandAll"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <!-- <el-table-column label="父级分类ID" align="center" prop="parentId" /> -->
        <el-table-column label="分类名称" align="center" prop="categoryName" />
        <el-table-column label="排序" align="center" prop="sortOrder" />
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="edu_question_bank_category_status" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['edu:questionBankCategory:edit']" />
            </el-tooltip>
            <el-tooltip content="新增" placement="top">
              <el-button link type="primary" icon="Plus" @click="handleAdd(scope.row)" v-hasPermi="['edu:questionBankCategory:add']" />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['edu:questionBankCategory:remove']" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加或修改题库分类对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="questionBankCategoryFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="父级分类ID" prop="parentId">
          <el-tree-select
            v-model="form.parentId"
            :data="questionBankCategoryOptions"
            :props="{ value: 'id', label: 'categoryName', children: 'children' }"
            value-key="id"
            placeholder="请选择父级分类ID，根节点为0"
            check-strictly
          />
        </el-form-item>
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="form.categoryName" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类描述" prop="categoryDesc">
          <el-input v-model="form.categoryDesc" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input v-model="form.sortOrder" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="dict in edu_question_bank_category_status" :key="dict.value" :value="dict.value">{{ dict.label }}</el-radio>
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

<script setup name="QuestionBankCategory" lang="ts">
import {
  listQuestionBankCategory,
  getQuestionBankCategory,
  delQuestionBankCategory,
  addQuestionBankCategory,
  updateQuestionBankCategory
} from '@/api/edu/questionBankCategory';
import { QuestionBankCategoryVO, QuestionBankCategoryQuery, QuestionBankCategoryForm } from '@/api/edu/questionBankCategory/types';

type QuestionBankCategoryOption = {
  id: number;
  categoryName: string;
  children?: QuestionBankCategoryOption[];
};

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const { edu_question_bank_category_status } = toRefs<any>(proxy?.useDict('edu_question_bank_category_status'));

const questionBankCategoryList = ref<QuestionBankCategoryVO[]>([]);
const questionBankCategoryOptions = ref<QuestionBankCategoryOption[]>([]);
const buttonLoading = ref(false);
const showSearch = ref(true);
const isExpandAll = ref(true);
const loading = ref(false);

const queryFormRef = ref<ElFormInstance>();
const questionBankCategoryFormRef = ref<ElFormInstance>();
const questionBankCategoryTableRef = ref<ElTableInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: QuestionBankCategoryForm = {
  id: undefined,
  parentId: undefined,
  categoryName: undefined,
  categoryDesc: undefined,
  sortOrder: undefined,
  status: undefined,
  remark: undefined
};

const data = reactive<PageData<QuestionBankCategoryForm, QuestionBankCategoryQuery>>({
  form: { ...initFormData },
  queryParams: {
    categoryName: undefined,
    params: {}
  },
  rules: {
    categoryName: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询题库分类列表 */
const getList = async () => {
  loading.value = true;
  const res = await listQuestionBankCategory(queryParams.value);
  const data = proxy?.handleTree<QuestionBankCategoryVO>(res.data, 'id', 'parentId');
  if (data) {
    questionBankCategoryList.value = data;
    loading.value = false;
  }
};

/** 查询题库分类下拉树结构 */
const getTreeselect = async () => {
  const res = await listQuestionBankCategory();
  questionBankCategoryOptions.value = [];
  const data: QuestionBankCategoryOption = { id: 0, categoryName: '顶级节点', children: [] };
  data.children = proxy?.handleTree<QuestionBankCategoryOption>(res.data, 'id', 'parentId');
  questionBankCategoryOptions.value.push(data);
};

// 取消按钮
const cancel = () => {
  reset();
  dialog.visible = false;
};

// 表单重置
const reset = () => {
  form.value = { ...initFormData };
  questionBankCategoryFormRef.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** 新增按钮操作 */
const handleAdd = (row?: QuestionBankCategoryVO) => {
  reset();
  getTreeselect();
  if (row != null && row.id) {
    form.value.parentId = row.id;
  } else {
    form.value.parentId = 0;
  }
  dialog.visible = true;
  dialog.title = '添加题库分类';
};

/** 展开/折叠操作 */
const handleToggleExpandAll = () => {
  isExpandAll.value = !isExpandAll.value;
  toggleExpandAll(questionBankCategoryList.value, isExpandAll.value);
};

/** 展开/折叠操作 */
const toggleExpandAll = (data: QuestionBankCategoryVO[], status: boolean) => {
  data.forEach((item) => {
    questionBankCategoryTableRef.value?.toggleRowExpansion(item, status);
    if (item.children && item.children.length > 0) toggleExpandAll(item.children, status);
  });
};

/** 修改按钮操作 */
const handleUpdate = async (row: QuestionBankCategoryVO) => {
  reset();
  await getTreeselect();
  if (row != null) {
    form.value.parentId = row.parentId;
  }
  const res = await getQuestionBankCategory(row.id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改题库分类';
};

/** 提交按钮 */
const submitForm = () => {
  questionBankCategoryFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateQuestionBankCategory(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addQuestionBankCategory(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row: QuestionBankCategoryVO) => {
  await proxy?.$modal.confirm('是否确认删除题库分类为"' + row.categoryName + '"的数据项？');
  loading.value = true;
  await delQuestionBankCategory(row.id).finally(() => (loading.value = false));
  await getList();
  proxy?.$modal.msgSuccess('删除成功');
};

onMounted(() => {
  getList();
});
</script>
