<template>
  <div class="exam-container">
    <!-- 顶部信息栏 -->
    <el-card class="exam-header" shadow="never">
      <div class="header-content">
        <div class="exam-info">
          <h2>{{ examInfo.title }}</h2>
          <div class="info-tags">
            <el-tag type="info">总分: {{ examInfo.totalScore }}分</el-tag>
            <el-tag type="warning">题目数: {{ examInfo.questionCount }}</el-tag>
          </div>
        </div>
        <div class="exam-timer">
          <el-statistic title="剩余时间" :value="remainingTime">
            <template #suffix>
              <el-icon><Timer /></el-icon>
            </template>
          </el-statistic>
        </div>
      </div>
    </el-card>

    <!-- 答题区域 -->
    <div class="exam-content">
      <el-card class="question-card">
        <div class="question-header">
          <span class="question-number">第 {{ currentQuestionIndex + 1 }} 题</span>
          <el-tag :type="getQuestionTypeTag(currentQuestion.question_type)">
            {{ getQuestionTypeText(currentQuestion.question_type) }}
          </el-tag>
          <el-tag type="danger" effect="plain">{{ currentQuestion.score }}分</el-tag>
        </div>

        <div class="question-title">
          <span class="title-text">{{ currentQuestion.question_title }}</span>
        </div>

        <!-- 单选题 -->
        <el-radio-group v-if="currentQuestion.question_type === '1'" v-model="answers[currentQuestion.id]" class="answer-options">
          <el-radio v-for="(option, key) in currentQuestion.options" :key="key" :label="key" class="answer-option">
            <span class="option-label">{{ key }}.</span>
            <span class="option-content">{{ option }}</span>
          </el-radio>
        </el-radio-group>

        <!-- 多选题 -->
        <el-checkbox-group v-else-if="currentQuestion.question_type === '2'" v-model="answers[currentQuestion.id]" class="answer-options">
          <el-checkbox v-for="(option, key) in currentQuestion.options" :key="key" :label="key" class="answer-option">
            <span class="option-label">{{ key }}.</span>
            <span class="option-content">{{ option }}</span>
          </el-checkbox>
        </el-checkbox-group>

        <!-- 判断题 -->
        <el-radio-group v-else-if="currentQuestion.question_type === '3'" v-model="answers[currentQuestion.id]" class="answer-options judge-options">
          <el-radio label="A" class="answer-option">
            <el-icon><Select /></el-icon> 正确
          </el-radio>
          <el-radio label="B" class="answer-option">
            <el-icon><CloseBold /></el-icon> 错误
          </el-radio>
        </el-radio-group>

        <!-- 导航按钮 -->
        <div class="question-navigation">
          <el-button @click="prevQuestion" :disabled="currentQuestionIndex === 0"> 上一题 </el-button>
          <el-button type="primary" @click="nextQuestion" :disabled="currentQuestionIndex === questions.length - 1"> 下一题 </el-button>
        </div>
      </el-card>

      <!-- 答题卡 -->
      <el-card class="answer-sheet">
        <template #header>
          <div class="card-header">
            <span>答题卡</span>
          </div>
        </template>

        <div class="answer-grid">
          <div
            v-for="(question, index) in questions"
            :key="question.id"
            :class="[
              'answer-item',
              {
                'active': index === currentQuestionIndex,
                'answered': isAnswered(question.id)
              }
            ]"
            @click="jumpToQuestion(index)"
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
            <span class="legend-box"></span>
            <span>未答</span>
          </div>
          <div class="legend-item">
            <span class="legend-box active"></span>
            <span>当前</span>
          </div>
        </div>

        <el-button type="success" class="submit-btn" @click="handleSubmit" :loading="submitting"> 交卷 </el-button>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Timer, Select, CloseBold } from '@element-plus/icons-vue';

// 类型定义
interface Question {
  id: number;
  question_type: string;
  question_title: string;
  options?: Record<string, string>;
  correct_answer: string;
  score: number;
  difficulty: string;
}

interface ExamInfo {
  title: string;
  totalScore: number;
  questionCount: number;
  examTime: number;
}

interface ExamResult {
  exam_id: number;
  student_id: number;
  start_time: string;
  answer_snapshot: Record<number, string | string[]>;
}

// 响应式数据
const examInfo = reactive<ExamInfo>({
  title: '语文基础知识测试',
  totalScore: 7,
  questionCount: 3,
  examTime: 60 // 分钟
});

const questions = ref<Question[]>([
  {
    id: 1,
    question_type: '1',
    question_title: '下列词语中加点字的读音，完全正确的一项是？',
    options: {
      'A': '惩(chéng)罚',
      'B': '应(yīng)届',
      'C': '参(cēn)差不齐',
      'D': '提(dī)防'
    },
    correct_answer: 'A',
    score: 2,
    difficulty: '1'
  },
  {
    id: 2,
    question_type: '3',
    question_title: '《朝花夕拾》是鲁迅先生唯一的一本散文集。',
    options: {
      'A': '正确',
      'B': '错误'
    },
    correct_answer: 'A',
    score: 2,
    difficulty: '1'
  },
  {
    id: 4,
    question_type: '2',
    question_title: '下列作家中，属于"唐宋八大家"的有？',
    options: {
      'A': '李白',
      'B': '韩愈',
      'C': '苏轼',
      'D': '杜甫',
      'E': '欧阳修'
    },
    correct_answer: 'B,C,E',
    score: 3,
    difficulty: '2'
  }
]);

const currentQuestionIndex = ref(0);
const answers = reactive<Record<number, string | string[]>>({});
const remainingTime = ref(examInfo.examTime * 60); // 转换为秒
const submitting = ref(false);
const startTime = ref(new Date().toISOString());

let timer: number | null = null;

// 计算属性
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);

// 方法
const getQuestionTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    '1': '单选题',
    '2': '多选题',
    '3': '判断题'
  };
  return typeMap[type] || '未知';
};

const getQuestionTypeTag = (type: string): string => {
  const tagMap: Record<string, string> = {
    '1': 'primary',
    '2': 'success',
    '3': 'warning'
  };
  return tagMap[type] || 'info';
};

const isAnswered = (questionId: number): boolean => {
  const answer = answers[questionId];
  if (Array.isArray(answer)) {
    return answer.length > 0;
  }
  return !!answer;
};

const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  }
};

const nextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++;
  }
};

const jumpToQuestion = (index: number) => {
  currentQuestionIndex.value = index;
};

const handleSubmit = async () => {
  // 检查是否有未答题
  const unansweredCount = questions.value.filter((q) => !isAnswered(q.id)).length;

  if (unansweredCount > 0) {
    try {
      await ElMessageBox.confirm(`还有 ${unansweredCount} 道题未作答，确定要交卷吗？`, '提示', {
        confirmButtonText: '确定交卷',
        cancelButtonText: '继续答题',
        type: 'warning'
      });
    } catch {
      return;
    }
  } else {
    try {
      await ElMessageBox.confirm('确定要提交试卷吗？提交后将不能修改答案。', '确认交卷', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      });
    } catch {
      return;
    }
  }

  submitting.value = true;

  // 构建提交数据
  const result: ExamResult = {
    exam_id: 1, // 实际应从路由或props获取
    student_id: 1, // 实际应从用户信息获取
    start_time: startTime.value,
    answer_snapshot: answers
  };

  try {
    // 这里应该调用API提交数据
    console.log('提交数据:', result);

    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 1000));

    ElMessage.success('交卷成功！');

    // 实际应该跳转到成绩页面
    // router.push('/exam/result')
  } catch (error) {
    ElMessage.error('交卷失败，请重试');
  } finally {
    submitting.value = false;
  }
};

const startTimer = () => {
  timer = window.setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--;

      // 剩余5分钟提醒
      if (remainingTime.value === 300) {
        ElMessage.warning('考试还剩5分钟，请注意时间！');
      }

      // 时间到自动交卷
      if (remainingTime.value === 0) {
        ElMessage.error('考试时间已到，自动交卷！');
        handleSubmit();
      }
    }
  }, 1000);
};

// 生命周期
onMounted(() => {
  startTimer();

  // 初始化多选题答案为数组
  questions.value.forEach((q) => {
    if (q.question_type === '2' && !answers[q.id]) {
      answers[q.id] = [];
    }
  });
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped lang="scss">
.exam-container {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

.exam-header {
  margin-bottom: 20px;

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .exam-info {
      h2 {
        margin: 0 0 10px 0;
        color: #303133;
      }

      .info-tags {
        display: flex;
        gap: 10px;
      }
    }
  }
}

.exam-content {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 20px;
  align-items: start;
}

.question-card {
  .question-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #ebeef5;

    .question-number {
      font-size: 18px;
      font-weight: bold;
      color: #409eff;
    }
  }

  .question-title {
    font-size: 16px;
    line-height: 1.8;
    color: #303133;
    margin-bottom: 25px;
    padding: 15px;
    background: #f5f7fa;
    border-radius: 4px;

    .title-text {
      font-weight: 500;
    }
  }

  .answer-options {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 30px;

    .answer-option {
      padding: 15px;
      border: 2px solid #ebeef5;
      border-radius: 8px;
      transition: all 0.3s;
      cursor: pointer;

      &:hover {
        border-color: #409eff;
        background: #ecf5ff;
      }

      :deep(.el-radio__label),
      :deep(.el-checkbox__label) {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 15px;
        width: 100%;
      }

      .option-label {
        font-weight: bold;
        color: #409eff;
        min-width: 20px;
      }

      .option-content {
        color: #606266;
        flex: 1;
      }
    }

    &.judge-options {
      flex-direction: row;
      justify-content: center;
      gap: 40px;

      .answer-option {
        min-width: 150px;
        justify-content: center;

        :deep(.el-radio__label) {
          justify-content: center;
          font-size: 16px;
          font-weight: 500;
        }
      }
    }
  }

  .question-navigation {
    display: flex;
    justify-content: space-between;
    padding-top: 20px;
    border-top: 1px solid #ebeef5;
  }
}

.answer-sheet {
  position: sticky;
  top: 20px;

  .card-header {
    font-weight: bold;
    font-size: 16px;
  }

  .answer-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
    margin-bottom: 20px;

    .answer-item {
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #dcdfe6;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.3s;
      background: white;

      &:hover {
        border-color: #409eff;
        transform: translateY(-2px);
        box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
      }

      &.answered {
        background: #67c23a;
        color: white;
        border-color: #67c23a;
      }

      &.active {
        background: #409eff;
        color: white;
        border-color: #409eff;
      }
    }
  }

  .answer-legend {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
    padding: 15px 0;
    border-top: 1px solid #ebeef5;
    border-bottom: 1px solid #ebeef5;

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;

      .legend-box {
        width: 20px;
        height: 20px;
        border: 2px solid #dcdfe6;
        border-radius: 4px;
        background: white;

        &.answered {
          background: #67c23a;
          border-color: #67c23a;
        }

        &.active {
          background: #409eff;
          border-color: #409eff;
        }
      }
    }
  }

  .submit-btn {
    width: 100%;
    height: 45px;
    font-size: 16px;
    font-weight: bold;
  }
}

@media (max-width: 1200px) {
  .exam-content {
    grid-template-columns: 1fr;

    .answer-sheet {
      position: static;
    }
  }
}
</style>
