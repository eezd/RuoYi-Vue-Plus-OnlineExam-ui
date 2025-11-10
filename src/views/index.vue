<template>
  <div class="app-container home">
    <div class="student-home">
      <!-- 欢迎横幅 -->
      <div class="welcome-banner">
        <div class="welcome-content">
          <h1 class="welcome-title">
            <span class="wave-emoji">👋</span>
            欢迎，{{ userStore.$state.nickname }} 同学
          </h1>
          <p class="welcome-subtitle">祝你在考试中取得优异成绩！</p>
        </div>
        <div class="class-info">
          <el-tag type="primary" size="large" effect="plain">
            <i class="el-icon-school"></i>
            当前班级：{{ userStore.$state.deptName }}
          </el-tag>
        </div>
      </div>

      <!-- 统计卡片 -->
      <!-- <el-row :gutter="20" class="stats-row">
        <el-col :xs="24" :sm="12" :md="6">
          <div class="stat-card stat-primary">
            <div class="stat-icon">
              <i class="el-icon-document"></i>
            </div>
            <div class="stat-info">
              <p class="stat-value">{{ availableExamCount }}</p>
              <p class="stat-label">可参加考试</p>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <div class="stat-card stat-success">
            <div class="stat-icon">
              <i class="el-icon-check"></i>
            </div>
            <div class="stat-info">
              <p class="stat-value">{{ completedExamCount }}</p>
              <p class="stat-label">已完成考试</p>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <div class="stat-card stat-warning">
            <div class="stat-icon">
              <i class="el-icon-star-on"></i>
            </div>
            <div class="stat-info">
              <p class="stat-value">{{ recentAvgScore }}</p>
              <p class="stat-label">最近平均分</p>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <div class="stat-card stat-info">
            <div class="stat-icon">
              <i class="el-icon-trophy"></i>
            </div>
            <div class="stat-info">
              <p class="stat-value">{{ highestScore }}</p>
              <p class="stat-label">最高分</p>
            </div>
          </div>
        </el-col>
      </el-row> -->

      <!-- 可参加的考试列表 -->
      <!-- <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">
            <i class="el-icon-edit-outline"></i>
            可参加的考试
          </h2>
          <el-button type="primary" size="small" @click="handleViewAllExams"> 查看全部 <i class="el-icon-arrow-right"></i> </el-button>
        </div>
        <div class="exam-list">
          <el-empty v-if="availableExams.length === 0" description="暂无可参加的考试"></el-empty>
          <div v-else class="exam-grid">
            <div v-for="exam in availableExams" :key="exam.id" class="exam-card" @click="handleStartExam(exam)">
              <div class="exam-card-header">
                <el-tag :type="getExamTagType(exam.status)" size="small">
                  {{ exam.statusText }}
                </el-tag>
                <span class="exam-time">
                  <i class="el-icon-time"></i>
                  {{ exam.duration }}分钟
                </span>
              </div>
              <h3 class="exam-title">{{ exam.examName }}</h3>
              <div class="exam-info">
                <div class="info-item">
                  <i class="el-icon-document"></i>
                  <span>题目数：{{ exam.questionCount }}</span>
                </div>
                <div class="info-item">
                  <i class="el-icon-star-off"></i>
                  <span>总分：{{ exam.totalScore }}</span>
                </div>
              </div>
              <div class="exam-date">
                <i class="el-icon-date"></i>
                {{ exam.startTime }} ~ {{ exam.endTime }}
              </div>
              <el-button type="primary" class="start-btn" size="small"> 开始考试 <i class="el-icon-right"></i> </el-button>
            </div>
          </div>
        </div>
      </div> -->

      <!-- 最近考试成绩 -->
      <!-- <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">
            <i class="el-icon-data-line"></i>
            最近考试成绩
          </h2>
        </div>
        <el-table :data="recentResults" style="width: 100%" :header-cell-style="{ background: '#f5f7fa' }">
          <el-table-column prop="examName" label="考试名称" min-width="180">
            <template v-slot="scope">
              <div class="exam-name-cell">
                <i class="el-icon-document"></i>
                {{ scope.row.examName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="submitTime" label="考试时间" width="180">
            <template v-slot="scope">
              <i class="el-icon-time"></i>
              {{ scope.row.submitTime }}
            </template>
          </el-table-column>
          <el-table-column prop="userScore" label="得分" width="120" align="center">
            <template v-slot="scope">
              <el-tag :type="getScoreTagType(scope.row.userScore, scope.row.totalScore)">
                {{ scope.row.userScore }} / {{ scope.row.totalScore }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="correctRate" label="正确率" width="120" align="center">
            <template v-slot="scope">
              <el-progress :percentage="scope.row.correctRate" :color="getProgressColor(scope.row.correctRate)" :stroke-width="8"></el-progress>
            </template>
          </el-table-column>
          <el-table-column prop="examTime" label="用时" width="100" align="center">
            <template v-slot="scope"> {{ scope.row.examTime }}分钟 </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template v-slot="scope">
              <el-button type="text" size="small" @click="handleViewDetail(scope.row)"> 查看详情 </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div> -->
    </div>
    <el-divider />
  </div>
</template>

<script setup name="Index" lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user';

const userStore = useUserStore();

// 定义考试与成绩的数据类型
interface Exam {
  id: number;
  examName: string;
  status: 'ongoing' | 'upcoming' | 'ended';
  statusText: string;
  duration: number;
  questionCount: number;
  totalScore: number;
  startTime: string;
  endTime: string;
}

interface ExamResult {
  id: number;
  examName: string;
  submitTime: string;
  userScore: number;
  totalScore: number;
  correctRate: number;
  examTime: number;
}

// router
const router = useRouter();

// 学生信息
const studentName = ref('');
const currentClass = ref('');

// 统计数据
const availableExamCount = ref(0);
const completedExamCount = ref(0);
const recentAvgScore = ref(0);
const highestScore = ref(0);

// 可参加考试列表
const availableExams = ref<Exam[]>([]);

// 最近考试成绩
const recentResults = ref<ExamResult[]>([]);

// 加载页面数据
const loadData = () => {
  console.log(userStore.$state);
  studentName.value = '张三';

  currentClass.value = '2024级计算机1班';
  availableExamCount.value = 3;
  completedExamCount.value = 15;
  recentAvgScore.value = 85.5;
  highestScore.value = 96;

  // 模拟可参加考试数据
  availableExams.value = [
    {
      id: 1,
      examName: '数据结构期末考试',
      status: 'ongoing',
      statusText: '进行中',
      duration: 120,
      questionCount: 50,
      totalScore: 100,
      startTime: '2025-10-20 09:00',
      endTime: '2025-10-20 11:00'
    },
    {
      id: 2,
      examName: '算法设计与分析测验',
      status: 'upcoming',
      statusText: '即将开始',
      duration: 90,
      questionCount: 40,
      totalScore: 100,
      startTime: '2025-10-21 14:00',
      endTime: '2025-10-21 15:30'
    }
  ];

  // 模拟最近成绩数据
  recentResults.value = [
    {
      id: 1,
      examName: '操作系统原理测试',
      submitTime: '2025-10-15 10:30',
      userScore: 88,
      totalScore: 100,
      correctRate: 88,
      examTime: 85
    },
    {
      id: 2,
      examName: '计算机网络期中考试',
      submitTime: '2025-10-10 15:20',
      userScore: 92,
      totalScore: 100,
      correctRate: 92,
      examTime: 110
    }
  ];
};

// 开始考试
const handleStartExam = (exam: Exam) => {
  console.log('开始考试:', exam);
  // router.push({ path: '/online/exam', query: { examId: exam.id } })
};

// 查看全部考试
const handleViewAllExams = () => {
  console.log('查看全部考试');
  // router.push('/online')
};

// 查看成绩详情
const handleViewDetail = (row: ExamResult) => {
  console.log('查看详情:', row);
  // router.push({ path: '/online/result', query: { resultId: row.id } })
};

// 获取考试状态标签类型
const getExamTagType = (status: string) => {
  const typeMap: Record<string, string> = {
    ongoing: 'success',
    upcoming: 'warning',
    ended: 'info'
  };
  return typeMap[status] || 'info';
};

// 获取分数标签类型
const getScoreTagType = (score: number, total: number) => {
  const rate = (score / total) * 100;
  if (rate >= 90) return 'success';
  if (rate >= 80) return 'primary';
  if (rate >= 60) return 'warning';
  return 'danger';
};

// 获取进度条颜色
const getProgressColor = (percentage: number) => {
  if (percentage >= 90) return '#67c23a';
  if (percentage >= 80) return '#409eff';
  if (percentage >= 60) return '#e6a23c';
  return '#f56c6c';
};

// 生命周期钩子
onMounted(() => {
  loadData();
});
</script>

<style lang="scss" scoped>
.student-home {
  padding: 20px;
  background: #f0f2f5;
  min-height: calc(100vh - 84px);
}

// 欢迎横幅
.welcome-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 30px 40px;
  margin-bottom: 20px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

  .welcome-content {
    .welcome-title {
      font-size: 28px;
      font-weight: 600;
      margin: 0 0 8px 0;

      .wave-emoji {
        display: inline-block;
        animation: wave 1s ease-in-out infinite;
      }
    }

    .welcome-subtitle {
      font-size: 16px;
      opacity: 0.9;
      margin: 0;
    }
  }

  .class-info {
    ::v-deep .el-tag {
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      font-size: 14px;
      padding: 10px 20px;

      i {
        margin-right: 5px;
      }
    }
  }
}

@keyframes wave {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(20deg);
  }
  75% {
    transform: rotate(-15deg);
  }
}

// 统计卡片
.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  margin-bottom: 20px;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }

  .stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    margin-right: 16px;
  }

  .stat-info {
    flex: 1;

    .stat-value {
      font-size: 26px;
      font-weight: 600;
      margin: 0 0 4px 0;
    }

    .stat-label {
      font-size: 14px;
      color: #909399;
      margin: 0;
    }
  }

  &.stat-primary {
    .stat-icon {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .stat-value {
      color: #667eea;
    }
  }

  &.stat-success {
    .stat-icon {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
    }
    .stat-value {
      color: #f5576c;
    }
  }

  &.stat-warning {
    .stat-icon {
      background: linear-gradient(135deg, #fad961 0%, #f76b1c 100%);
      color: white;
    }
    .stat-value {
      color: #f76b1c;
    }
  }

  &.stat-info {
    .stat-icon {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      color: white;
    }
    .stat-value {
      color: #4facfe;
    }
  }
}

// 区块卡片
.section-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .section-title {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
      color: #303133;

      i {
        margin-right: 8px;
        color: #667eea;
      }
    }
  }
}

// 考试列表
.exam-list {
  .exam-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
  }

  .exam-card {
    border: 1px solid #e4e7ed;
    border-radius: 10px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;

    &:hover {
      border-color: #667eea;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
      transform: translateY(-2px);
    }

    .exam-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .exam-time {
        font-size: 13px;
        color: #909399;

        i {
          margin-right: 4px;
        }
      }
    }

    .exam-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 12px 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .exam-info {
      display: flex;
      gap: 16px;
      margin-bottom: 12px;

      .info-item {
        font-size: 13px;
        color: #606266;

        i {
          margin-right: 4px;
          color: #909399;
        }
      }
    }

    .exam-date {
      font-size: 13px;
      color: #909399;
      margin-bottom: 16px;

      i {
        margin-right: 4px;
      }
    }

    .start-btn {
      width: 100%;
    }
  }
}

// 表格样式
.exam-name-cell {
  i {
    margin-right: 6px;
    color: #667eea;
  }
}

::v-deep .el-table {
  th {
    font-weight: 600;
  }
}

// 响应式
@media (max-width: 768px) {
  .welcome-banner {
    flex-direction: column;
    text-align: center;

    .class-info {
      margin-top: 16px;
    }
  }

  .exam-grid {
    grid-template-columns: 1fr !important;
  }
}
</style>
