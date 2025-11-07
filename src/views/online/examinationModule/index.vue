<template>
  <div class="exam-container">
    <!-- 头部信息栏 -->
    <el-card class="exam-header" shadow="never">
      <div class="header-content">
        <div class="exam-info">
          <h2>{{ title }}</h2>
          <el-tag type="info">总分: {{ examInfo.totalScore }}分</el-tag>
          <el-tag type="warning" style="margin-left: 10px">题目数: {{ questions.length }}</el-tag>
        </div>
        <div class="time-info" v-if="status">
          <el-statistic :value="remainingTime" title="剩余时间(秒)" />
          <el-button type="primary" @click="handleSubmit" :loading="submitting" style="margin-top: 10px"> 提交试卷 </el-button>
        </div>
      </div>
    </el-card>

    <!-- 答题区域 -->
    <div class="exam-content" :style="isMobile ? { display: 'flex', flexDirection: 'column' } : {}">
      <!-- 题目列表 -->
      <el-card class="question-area" shadow="never">
        <div v-for="(question, index) in questions" :key="question.id" class="question-item">
          <div class="question-header">
            <span class="question-number">第 {{ index + 1 }} 题</span>
            <el-tag :type="getQuestionTypeTag(question.questionType)" size="small">
              {{ getQuestionTypeName(question.questionType) }}
            </el-tag>
            <el-tag type="info" size="small" style="margin-left: 5px">{{ question.score }}分</el-tag>
            <el-tag :type="getDifficultyTag(question.difficulty)" size="small" style="margin-left: 5px">
              {{ getDifficultyName(question.difficulty) }}
            </el-tag>
          </div>

          <!-- {{ question }} -->

          <div class="question-title">{{ question.question_title }}</div>

          <!-- 单选题 -->
          <el-radio-group
            v-if="question.questionType === '1'"
            v-model="answers[question.id]"
            class="question-options"
            @change="updateChooseAnswer(question)"
          >
            <el-radio v-for="(value, key) in question.options" :key="key" :value="key" class="option-item"> {{ key }}. {{ value }} </el-radio>
          </el-radio-group>

          <!-- 多选题 -->
          <el-checkbox-group
            v-if="question.questionType === '2'"
            v-model="answers[question.id]"
            class="question-options"
            @change="updateChooseAnswer(question)"
          >
            <el-checkbox v-for="(value, key) in question.options" :key="key" :value="key" class="option-item"> {{ key }}. {{ value }} </el-checkbox>
          </el-checkbox-group>

          <!-- 判断题 -->
          <el-radio-group
            v-if="question.questionType === '3'"
            v-model="answers[question.id]"
            class="question-options"
            @change="updateChooseAnswer(question)"
          >
            <el-radio :value="'A'" class="option-item">正确</el-radio>
            <el-radio :value="'B'" class="option-item">错误</el-radio>
          </el-radio-group>
        </div>
      </el-card>

      <!-- 答题卡 -->
      <el-card class="answer-card" shadow="never">
        <template #header>
          <div class="card-header">答题卡</div>
        </template>
        <div class="answer-grid">
          <div
            v-for="(question, index) in questions"
            :key="question.id"
            :class="['answer-cell', getAnswerStatus(question.id)]"
            @click="scrollToQuestion(index)"
          >
            {{ index + 1 }}
          </div>
        </div>
        <div class="answer-legend">
          <div class="legend-item">
            <span class="legend-box answered"></span>
            <span>已答</span>
          </div>
          <div class="legend-item">
            <span class="legend-box unanswered"></span>
            <span>未答</span>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { startStudentExam } from '@/api/edu/studentExam';
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { EduExamResult } from '@/api/edu/studentExam/types';
import { submitStudentExam } from '@/api/edu/studentExam';
import { useAppStore } from '@/store/modules/app';

const route = useRoute();
const router = useRouter();

const appStore = useAppStore();

const isMobile = computed(() => appStore.device === 'mobile');

const title = ref('正在考试');
const examResultId = ref(0);
const examId = computed(() => route.query.examId as string);

const status = ref(true);

// 添加更新 chooseAnswer 的方法
const updateChooseAnswer = (question: any) => {
  const answer = answers[question.id];

  if (question.questionType === '2') {
    // 多选题：数组转字符串
    question.chooseAnswer = Array.isArray(answer) ? answer.sort().join(',') : '';
  } else {
    // 单选题和判断题：直接赋值
    question.chooseAnswer = answer || '';
  }

  console.log(`题目 ${question.id} 更新答案:`, question.chooseAnswer);
};

// 初始化考试页面
const initStartExam = async () => {
  if (examId.value === undefined) {
    await ElMessageBox.confirm('考试ID为空，无法开始考试。', '警告', {
      confirmButtonText: '确定',
      type: 'warning'
    });
    status.value = false;
    title.value = '无法考试';
    // router.go(-1);
  }

  const result = await startStudentExam(examId.value, navigator.userAgent);
  // examInfo.totalScore = result.data.totalScore;
  examResultId.value = result.data.id;
  examInfo.startTime = new Date(result.data.startTime);
  examInfo.examTime = result.data.examTime;
  if (result.data.isSubmit === '1') {
    status.value = false;
    title.value = '正在浏览答卷';
  }

  const answerSnapshot = result.data.answerSnapshot;

  // 反序列化答题快照
  if (answerSnapshot) {
    try {
      const snapshotData = JSON.parse(answerSnapshot);
      if (Array.isArray(snapshotData)) {
        snapshotData.forEach((item: any) => {
          // 直接展示题目内容
          console.log('答题快照数据：', item.options); // 打印答题快照数据
          const question = {
            id: item.id,
            bankId: item.bankId,
            questionType: item.questionType,
            questionTitle: item.questionTitle,
            options: JSON.parse(item.options), // 解析选项
            difficulty: item.difficulty,
            score: item.score,
            chooseAnswer: item.chooseAnswer || ''
          };
          questions.value.push(question);

          // 打印题目和选项
          // console.log(`题目ID: ${question.id}`);
          // console.log(`题目: ${question.questionTitle}`);
          // console.log(`选项:`, question.options);
          // console.log(`所选答案: ${question.chooseAnswer}`);
        });
      } else {
        console.error('答题快照格式不正确');
      }
    } catch (e) {
      console.error('反序列化答题快照失败', e);
    }
  }

  // 初始化答案对象
  questions.value.forEach((q) => {
    if (q.questionType === '2') {
      // 多选题：字符串转数组
      answers[q.id] = q.chooseAnswer ? q.chooseAnswer.split(',').filter(Boolean) : [];
    } else {
      // 单选题和判断题：直接使用字符串
      answers[q.id] = q.chooseAnswer || '';
    }
  });

  // 检查 examInfo 是否已经设置好
  if (examInfo.startTime && examInfo.examTime) {
    startTimer();
  } else {
    console.error('考试信息不完整，无法启动计时器');
  }
  // console.log('初始化后的题目:', questions.value);
  // console.log('初始化后的答案:', answers);
};

interface ExamInfo {
  totalScore: number;
  startTime: Date;
  examTime: number; // 分钟
}

// 响应式数据
const examInfo = reactive<ExamInfo>({
  totalScore: 100,
  startTime: new Date(),
  examTime: 60 // 默认60分钟
});

const questions = ref<any[]>([]);
const answers = reactive<Record<number, string | string[]>>({});
const startTime = ref<Date>(new Date());
const remainingTime = ref<number>(0);
const timer = ref<number | null>(null);
const submitting = ref<boolean>(false);
const userAgent = ref<string>('');
const clientIp = ref<string>('');

// 计算属性
const answeredCount = computed(() => {
  return Object.keys(answers).filter((key) => {
    const answer = answers[Number(key)];
    return Array.isArray(answer) ? answer.length > 0 : answer !== '';
  }).length;
});

// 倒计时
const startTimer = () => {
  const currentTime = new Date(); // 当前时间
  const timeDifference = Math.floor((currentTime.getTime() - examInfo.startTime.getTime()) / 1000); // 当前时间与考试开始时间的差，单位是秒
  console.log('当前时间：', currentTime.getTime());
  console.log('考试开始时间：', examInfo.startTime.getTime());
  console.log('时间差（秒）：', timeDifference);

  let remainingTimeInSeconds = examInfo.examTime * 60 - timeDifference; // 剩余时间（秒）

  if (!status.value) {
    if (remainingTimeInSeconds <= 0) {
      remainingTimeInSeconds = 0;
      ElMessage.warning('考试时间已到，自动提交试卷');
      handleSubmit();
    }

    remainingTime.value = remainingTimeInSeconds;

    timer.value = window.setInterval(() => {
      remainingTime.value--; // 每秒钟减少一秒
      if (remainingTime.value <= 0) {
        clearInterval(timer.value!);
        ElMessage.warning('考试时间已到，自动提交试卷');
        handleSubmit();
      }
    }, 1000);
  }
};
// 获取题目类型名称
const getQuestionTypeName = (type: string): string => {
  const typeMap: Record<string, string> = {
    '1': '单选题',
    '2': '多选题',
    '3': '判断题'
  };
  return typeMap[type] || '未知';
};

// 获取题目类型标签颜色
const getQuestionTypeTag = (type: string): any => {
  const tagMap: Record<string, string> = {
    '1': 'success',
    '2': 'warning',
    '3': 'info'
  };
  return tagMap[type] || '';
};

// 获取难度名称
const getDifficultyName = (difficulty: string): any => {
  const diffMap: Record<string, string> = {
    '1': '简单',
    '2': '中等',
    '3': '困难'
  };
  return diffMap[difficulty] || '未知';
};

// 获取难度标签颜色
const getDifficultyTag = (difficulty: string): any => {
  const tagMap: Record<string, string> = {
    '1': 'success',
    '2': 'warning',
    '3': 'danger'
  };
  return tagMap[difficulty] || '';
};

// 获取答题状态
const getAnswerStatus = (questionId: number): string => {
  const answer = answers[questionId];
  if (Array.isArray(answer)) {
    return answer.length > 0 ? 'answered' : 'unanswered';
  }
  return answer ? 'answered' : 'unanswered';
};

// 滚动到指定题目
const scrollToQuestion = (index: number) => {
  const questionItems = document.querySelectorAll('.question-item');
  if (questionItems[index]) {
    questionItems[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

// 提交试卷
const handleSubmit = async () => {
  console.log(questions);
  await ElMessageBox.confirm(`确定要提交吗？`, '提示', {
    confirmButtonText: '确定提交',
    cancelButtonText: '继续答题',
    type: 'warning'
  });

  try {
    // 停止计时器
    if (timer.value) {
      clearInterval(timer.value);
    }
    const data = { id: examResultId.value, answerSnapshot: JSON.stringify(questions.value) };

    console.log('提交数据:' + data);
    await submitStudentExam(data);
    ElMessage.success('提交成功！');
  } catch (error) {
    console.error('提交失败:', error);
    ElMessage.error('提交失败，请重试');
  } finally {
    submitting.value = false;
  }
};

// 页面加载时初始化
onMounted(async () => {
  initStartExam();
});

// 页面卸载时清理定时器
onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
});
</script>

<style scoped>
.exam-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
}

.exam-header {
  margin-bottom: 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.exam-info h2 {
  margin: 0 0 10px 0;
  font-size: 24px;
  color: #303133;
}

.time-info {
  text-align: center;
}

.exam-content {
  display: flex;
  gap: 20px;
}

.question-area {
  flex: 1;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.question-item {
  padding: 20px;
  border-bottom: 1px solid #ebeef5;
}

.question-item:last-child {
  border-bottom: none;
}

.question-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.question-number {
  font-size: 16px;
  font-weight: bold;
  color: #409eff;
  margin-right: 10px;
}

.question-title {
  font-size: 16px;
  line-height: 1.8;
  color: #303133;
  margin-bottom: 20px;
}

.question-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.option-item:hover {
  background-color: #f5f7fa;
}

.answer-card {
  width: 300px;
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.card-header {
  font-weight: bold;
  font-size: 16px;
}

.answer-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.answer-cell {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: bold;
}

.answer-cell:hover {
  border-color: #409eff;
  transform: scale(1.05);
}

.answer-cell.answered {
  background-color: #409eff;
  color: white;
  border-color: #409eff;
}

.answer-cell.unanswered {
  background-color: white;
  color: #606266;
}

.answer-legend {
  display: flex;
  gap: 20px;
  padding-top: 15px;
  border-top: 1px solid #ebeef5;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #606266;
}

.legend-box {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}

.legend-box.answered {
  background-color: #409eff;
}

.legend-box.unanswered {
  background-color: white;
}

:deep(.el-radio),
:deep(.el-checkbox) {
  width: 100%;
  margin: 0;
}

:deep(.el-radio__label),
:deep(.el-checkbox__label) {
  white-space: normal;
  line-height: 1.6;
}
</style>
