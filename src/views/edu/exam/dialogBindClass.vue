<template>
  <el-dialog title="绑定班级" v-model="visible" width="800px" append-to-body>
    <el-form ref="queryFormRef" :model="queryParams" :inline="true">
      <el-form-item label="部门名称" prop="deptName">
        <el-input v-model="queryParams.deptName" placeholder="请输入部门名称" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="类别编码" prop="deptCategory">
        <el-input v-model="queryParams.deptCategory" placeholder="请输入类别编码" clearable style="width: 240px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="部门状态" clearable>
          <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      ref="deptTableRef"
      v-loading="loading"
      :data="deptList"
      row-key="deptId"
      border
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :default-expand-all="isExpandAll"
    >
      <el-table-column prop="deptName" label="部门名称" width="260"></el-table-column>
      <el-table-column prop="deptCategory" align="center" label="类别编码" width="200"></el-table-column>
      <el-table-column prop="orderNum" align="center" label="排序" width="200"></el-table-column>
      <el-table-column prop="status" align="center" label="状态" width="100">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="200">
        <template #default="scope">
          <span>{{ proxy.parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作">
        <template #default="scope">
          <el-tooltip content="修改" placement="top">
            <el-button v-if="!bindClassIds?.includes(scope.row.deptId)" link type="primary" @click="bindBank(scope.row.deptId)"> 绑定 </el-button>
            <el-button v-else link type="danger" @click="unbindBank(scope.row.deptId)"> 解除绑定 </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <template #footer>
      <div class="dialog-footer">
        <el-button :loading="loading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="Exam" lang="ts">
import { defineModel } from 'vue';

import { listDept, getDept, delDept, addDept, updateDept, listDeptExcludeChild } from '@/api/system/dept';
import { DeptForm, DeptQuery, DeptVO } from '@/api/system/dept/types';
import { UserVO } from '@/api/system/user/types';
import { listUserByDeptId } from '@/api/system/user';
import { addExamClass, delExamClass, getExamClass } from '@/api/edu/examClass';

interface DeptOptionsType {
  deptId: number | string;
  deptName: string;
  children: DeptOptionsType[];
}

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { sys_normal_disable } = toRefs<any>(proxy?.useDict('sys_normal_disable'));

const deptList = ref<DeptVO[]>([]);
const loading = ref(true);
const showSearch = ref(true);
const deptOptions = ref<DeptOptionsType[]>([]);
const isExpandAll = ref(true);
const deptUserList = ref<UserVO[]>([]);

// const dialog = reactive<DialogOption>({
//   visible: false,
//   title: ''
// });
const visible = defineModel<boolean>('visible', { required: true });
const examId = defineModel<string | number>('examId', { required: true });
const title = ref('111');

const deptTableRef = ref<ElTableInstance>();
const queryFormRef = ref<ElFormInstance>();
const deptFormRef = ref<ElFormInstance>();

const initFormData: DeptForm = {
  deptId: undefined,
  parentId: undefined,
  deptName: undefined,
  deptCategory: undefined,
  orderNum: 0,
  leader: undefined,
  phone: undefined,
  email: undefined,
  status: '0'
};
const initData: PageData<DeptForm, DeptQuery> = {
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deptName: undefined,
    deptCategory: undefined,
    status: undefined
  },
  rules: {
    parentId: [{ required: true, message: '上级部门不能为空', trigger: 'blur' }],
    deptName: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }],
    orderNum: [{ required: true, message: '显示排序不能为空', trigger: 'blur' }],
    email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
    phone: [{ pattern: /^1[3456789][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' }]
  }
};
const data = reactive<PageData<DeptForm, DeptQuery>>(initData);

const { queryParams, form, rules } = toRefs<PageData<DeptForm, DeptQuery>>(data);

/** 查询菜单列表 */
const getList = async () => {
  loading.value = true;
  const res = await listDept(queryParams.value);
  const data = proxy?.handleTree<DeptVO>(res.data, 'deptId');
  if (data) {
    deptList.value = data;
  }
  loading.value = false;
  console.log(res);
};

/** 查询当前部门的所有用户 */
async function getDeptAllUser(deptId: any) {
  if (deptId !== null && deptId !== '' && deptId !== undefined) {
    const res = await listUserByDeptId(deptId);
    deptUserList.value = res.data;
  }
}

/** 班级绑定管理 */
const bindClassIds = ref<Array<string | number>>([]);
const getbindClassList = async () => {
  const res = await getExamClass(examId.value);
  if (res.data.deptList && res.data.deptList.length > 0) {
    bindClassIds.value = res.data.deptList.map((item) => item.deptId);
  }
};

const bindBank = async (deptId: string | number) => {
  if (deptId === null && examId.value === null) {
    ElMessage.error('参数出错');
    return;
  }
  const res = await addExamClass({
    examId: examId.value,
    deptId: deptId
  });
  if (res.code === 200) {
    ElMessage.success('绑定成功');
    bindClassIds.value.push(deptId);
  } else {
    ElMessage.error(res.msg || '绑定失败');
  }
};

const unbindBank = async (deptId: string | number) => {
  if (deptId === null && examId.value === null) {
    ElMessage.error('参数出错');
    return;
  }
  const res = await delExamClass({
    examId: examId.value,
    deptId: deptId
  });
  if (res.code === 200) {
    ElMessage.success('解除绑定成功');
    bindClassIds.value = bindClassIds.value.filter((id) => id !== deptId);
  } else {
    ElMessage.error(res.msg || '解除失败');
  }
};

/** 取消按钮 */
const cancel = () => {
  reset();
  visible.value = false;
};
/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  deptFormRef.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = async () => {
  await getList();
};
/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** 展开/折叠操作 */
const handleToggleExpandAll = () => {
  isExpandAll.value = !isExpandAll.value;
  toggleExpandAll(deptList.value, isExpandAll.value);
};
/** 展开/折叠所有 */
const toggleExpandAll = (data: DeptVO[], status: boolean) => {
  data.forEach((item) => {
    deptTableRef.value?.toggleRowExpansion(item, status);
    if (item.children && item.children.length > 0) toggleExpandAll(item.children, status);
  });
};

/** 新增按钮操作 */
const handleAdd = async (row?: DeptVO) => {
  reset();
  const res = await listDept();
  const data = proxy?.handleTree<DeptOptionsType>(res.data, 'deptId');
  if (data) {
    deptOptions.value = data;
    if (row && row.deptId) {
      form.value.parentId = row?.deptId;
    }
    visible.value = true;
    title.value = '添加部门';
  }
};

/** 修改按钮操作 */
const handleUpdate = async (row: DeptVO) => {
  reset();
  //查询当前部门所有用户
  getDeptAllUser(row.deptId);
  const res = await getDept(row.deptId);
  form.value = res.data;
  const response = await listDeptExcludeChild(row.deptId);
  const data = proxy?.handleTree<DeptOptionsType>(response.data, 'deptId');
  if (data) {
    deptOptions.value = data;
    if (data.length === 0) {
      const noResultsOptions: DeptOptionsType = {
        deptId: res.data.parentId,
        deptName: res.data.parentName,
        children: []
      };
      deptOptions.value.push(noResultsOptions);
    }
  }
  visible.value = true;
  title.value = '修改部门';
};
/** 提交按钮 */
const submitForm = () => {
  deptFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      form.value.deptId ? await updateDept(form.value) : await addDept(form.value);
      proxy?.$modal.msgSuccess('操作成功');
      visible.value = false;
      await getList();
    }
  });
};
/** 删除按钮操作 */
const handleDelete = async (row: DeptVO) => {
  await proxy?.$modal.confirm('是否确认删除名称为"' + row.deptName + '"的数据项?');
  await delDept(row.deptId);
  await getList();
  proxy?.$modal.msgSuccess('删除成功');
};

onMounted(() => {
  getList();
});

watch(
  () => visible.value,
  (val) => {
    if (val) {
      getbindClassList();
    }
  }
);
</script>
