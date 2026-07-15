<template>
  <div class="app-container">
    <header class="app-header">
      <div class="header-content">
        <h1 class="product-name">实习生简历助手</h1>
        <p class="product-slogan">打造可终身复用的职业简历资产，找准长期择业方向，拿下实习offer</p>
      </div>
    </header>

    <main class="app-main">
      <div class="flow-card">
        <div class="card-header">
          <h2 class="card-title">求职流水线</h2>
        </div>
        <div class="card-body">
          <p class="card-description">输入实习经历与目标JD，一键完成简历优化、面试话术、风控检测全流程</p>
          <div class="form-group">
            <label>实习经历</label>
            <textarea v-model="flowForm.internship" placeholder="请输入实习经历，例如：在XX公司实习期间负责产品设计工作..." rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>目标JD</label>
            <textarea v-model="flowForm.targetJD" placeholder="请粘贴目标岗位JD内容..." rows="3"></textarea>
          </div>
          <button class="action-btn" @click="runFullFlow" :disabled="flowLoading">
            <span v-if="flowLoading" class="loading-icon"><i class="fas fa-spinner fa-spin"></i></span>
            {{ flowLoading ? '执行中...' : '一键执行全流程' }}
          </button>
          
          <div v-if="flowLoading" class="progress-container">
            <div class="progress-header">
              <span>流程进度</span>
              <span class="progress-percent">{{ flowProgress }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: flowProgress + '%' }"></div>
            </div>
            <div class="progress-steps">
              <div v-for="(step, index) in flowSteps" :key="index" 
                   class="progress-step" :class="{ active: flowCurrentStep >= index, done: flowCurrentStep > index }">
                <span class="step-icon"><i :class="step.icon"></i></span>
                <span class="step-label">{{ step.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card-wrapper">
        <div class="app-card">
          <div class="card-header">
            <h2 class="card-title">简历资产化重构</h2>
            <div v-if="result1Validation" class="validation-badge" :class="result1Validation.score >= 80 ? 'pass' : 'warning'">
              校验评分：{{ result1Validation.score }}分
            </div>
          </div>
          <div class="card-body">
            <p class="card-description">根据实习经历、意向岗位、长期职业方向，自动量化改写简历内容，增加职业资产备注</p>
            <div class="form-group">
              <label>实习经历</label>
              <textarea v-model="form1.internship" placeholder="请输入实习经历，例如：在XX公司实习期间负责产品设计工作..." rows="3"></textarea>
            </div>
            <div class="form-group">
              <label>意向岗位</label>
              <input v-model="form1.targetJob" type="text" placeholder="请输入意向岗位，例如：产品经理">
            </div>
            <div class="form-group">
              <label>长期职业方向</label>
              <input v-model="form1.careerDirection" type="text" placeholder="请输入长期职业方向，例如：互联网产品管理">
            </div>
            <button class="action-btn" @click="generateModule1" :disabled="loading1">
              <span v-if="loading1" class="loading-icon"><i class="fas fa-spinner fa-spin"></i></span>
              {{ loading1 ? '生成中...' : '生成' }}
            </button>
            <div v-if="result1" class="result-area">
              <div class="result-header">
                <span>生成结果</span>
                <div class="result-actions">
                  <button class="copy-btn" @click="copyResult(result1)">
                    <i class="fas fa-copy"></i> 复制
                  </button>
                </div>
              </div>
              <pre class="result-text">{{ result1 }}</pre>
            </div>
          </div>
        </div>

        <div class="app-card">
          <div class="card-header">
            <h2 class="card-title">面试话术模块</h2>
            <div v-if="result2Validation" class="validation-badge" :class="result2Validation.score >= 90 ? 'pass' : 'warning'">
              STAR校验：{{ result2Validation.hasSTAR ? '完整' : '不完整' }}
            </div>
          </div>
          <div class="card-body">
            <p class="card-description">读取简历内容，生成自我介绍+STAR面试应答话术</p>
            <div class="form-group">
              <label>简历内容</label>
              <textarea v-model="form2.resume" placeholder="请粘贴简历内容..." rows="5"></textarea>
            </div>
            <button class="action-btn" @click="generateModule2" :disabled="loading2">
              <span v-if="loading2" class="loading-icon"><i class="fas fa-spinner fa-spin"></i></span>
              {{ loading2 ? '生成中...' : '生成' }}
            </button>
            <div v-if="result2" class="result-area">
              <div class="result-header">
                <span>生成结果</span>
                <div class="result-actions">
                  <button class="copy-btn" @click="copyResult(result2)">
                    <i class="fas fa-copy"></i> 复制
                  </button>
                </div>
              </div>
              <pre class="result-text">{{ result2 }}</pre>
            </div>
          </div>
        </div>

        <div class="app-card">
          <div class="card-header">
            <h2 class="card-title">HR简历检测</h2>
          </div>
          <div class="card-body">
            <p class="card-description">识别简历里AI套话、无量化经历，输出风险报告与匹配分数</p>
            <div class="form-group">
              <label>简历内容</label>
              <textarea v-model="form3.resume" placeholder="请粘贴简历内容..." rows="5"></textarea>
            </div>
            <button class="action-btn" @click="generateModule3" :disabled="loading3">
              <span v-if="loading3" class="loading-icon"><i class="fas fa-spinner fa-spin"></i></span>
              {{ loading3 ? '检测中...' : '检测' }}
            </button>
            <div v-if="result3" class="result-area">
              <div class="result-header">
                <span>检测报告</span>
                <div class="result-actions">
                  <button class="copy-btn" @click="copyResult(result3)">
                    <i class="fas fa-copy"></i> 复制
                  </button>
                </div>
              </div>
              <pre class="result-text">{{ result3 }}</pre>
              <div v-if="result3Validation" class="dashboard-container">
                <div class="dashboard-header">人岗匹配评分</div>
                <div class="dashboard">
                  <svg viewBox="0 0 100 100" class="score-circle">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#E7E9EC" stroke-width="8"/>
                    <circle cx="50" cy="50" r="40" fill="none" :stroke="getScoreColor(result3Validation.matchScore)" 
                            stroke-width="8" stroke-linecap="round"
                            :stroke-dasharray="`${result3Validation.matchScore * 2.51} 251`"
                            transform="rotate(-90 50 50)"/>
                  </svg>
                  <div class="score-value">{{ result3Validation.matchScore }}</div>
                  <div class="score-label">分</div>
                </div>
                <div class="risk-badge" :class="result3Validation.riskLevel">
                  风险等级：{{ result3Validation.riskLevel }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="hasResults" class="export-card">
          <button class="action-btn" @click="exportAllResults">
            <i class="fas fa-file-download"></i> 导出完整资料MD文件
          </button>
        </div>
      </div>
    </main>

    <footer class="app-footer">
      <p>轻量化AI Demo · 基于TRAE开发</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { resumeAssetSkill } from './skills/resumeAssetSkill.js'
import { interviewScriptSkill } from './skills/interviewScriptSkill.js'
import { hrRiskDetectSkill } from './skills/hrRiskDetectSkill.js'

const form1 = reactive({
  internship: '',
  targetJob: '',
  careerDirection: ''
})

const form2 = reactive({
  resume: ''
})

const form3 = reactive({
  resume: ''
})

const flowForm = reactive({
  internship: '',
  targetJD: ''
})

const loading1 = ref(false)
const loading2 = ref(false)
const loading3 = ref(false)
const flowLoading = ref(false)
const flowProgress = ref(0)
const flowCurrentStep = ref(-1)

const flowSteps = [
  { label: '简历资产化', icon: 'fas fa-file-alt' },
  { label: '面试话术', icon: 'fas fa-comments' },
  { label: 'HR风控检测', icon: 'fas fa-shield-alt' }
]

const result1 = ref('')
const result2 = ref('')
const result3 = ref('')

const result1Validation = ref(null)
const result2Validation = ref(null)
const result3Validation = ref(null)

const hasResults = computed(() => result1.value || result2.value || result3.value)

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function getScoreColor(score) {
  if (score >= 80) return '#6486B5'
  if (score >= 60) return '#E5C07B'
  return '#E06C75'
}

async function generateModule1() {
  loading1.value = true
  result1.value = ''
  result1Validation.value = null
  
  await delay(1500)
  
  const input = {
    internship: form1.internship,
    targetJob: form1.targetJob,
    careerDirection: form1.careerDirection
  }
  
  const output = await resumeAssetSkill.execute(input)
  result1.value = output.content
  result1Validation.value = output.validation
  
  loading1.value = false
}

async function generateModule2() {
  loading2.value = true
  result2.value = ''
  result2Validation.value = null
  
  await delay(1500)
  
  const input = {
    resume: form2.resume
  }
  
  const output = await interviewScriptSkill.execute(input)
  result2.value = output.content
  result2Validation.value = output.validation
  
  loading2.value = false
}

async function generateModule3() {
  loading3.value = true
  result3.value = ''
  result3Validation.value = null
  
  await delay(1500)
  
  const input = {
    resume: form3.resume,
    targetJob: form1.targetJob
  }
  
  const output = await hrRiskDetectSkill.execute(input)
  result3.value = output.content
  result3Validation.value = output.validation
  
  loading3.value = false
}

async function runFullFlow() {
  flowLoading.value = true
  flowProgress.value = 0
  flowCurrentStep.value = 0
  
  await delay(500)
  
  flowProgress.value = 10
  flowCurrentStep.value = 0
  
  form1.internship = flowForm.internship
  form1.targetJob = flowForm.targetJD.substring(0, 20) || '软件工程师'
  form1.careerDirection = '职业发展'
  
  await delay(1000)
  flowProgress.value = 30
  
  const output1 = await resumeAssetSkill.execute({
    internship: flowForm.internship,
    targetJob: form1.targetJob,
    careerDirection: form1.careerDirection
  })
  result1.value = output1.content
  result1Validation.value = output1.validation
  
  flowProgress.value = 40
  flowCurrentStep.value = 1
  
  await delay(1000)
  flowProgress.value = 60
  
  form2.resume = flowForm.internship
  
  const output2 = await interviewScriptSkill.execute({
    resume: flowForm.internship
  })
  result2.value = output2.content
  result2Validation.value = output2.validation
  
  flowProgress.value = 70
  flowCurrentStep.value = 2
  
  await delay(1000)
  flowProgress.value = 90
  
  form3.resume = flowForm.internship
  
  const output3 = await hrRiskDetectSkill.execute({
    resume: flowForm.internship,
    targetJob: flowForm.targetJD
  })
  result3.value = output3.content
  result3Validation.value = output3.validation
  
  flowProgress.value = 100
  flowCurrentStep.value = 3
  
  await delay(500)
  
  flowLoading.value = false
}

async function copyResult(text) {
  try {
    await navigator.clipboard.writeText(text)
    const originalTitle = document.title
    document.title = '已复制!'
    setTimeout(() => {
      document.title = originalTitle
    }, 1500)
  } catch (err) {
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    const originalTitle = document.title
    document.title = '已复制!'
    setTimeout(() => {
      document.title = originalTitle
    }, 1500)
  }
}

function exportAllResults() {
  const timestamp = new Date().toISOString().split('T')[0]
  const content = `# 求职准备资料 - ${timestamp}

## 一、简历资产化重构报告

${result1.value || '暂无数据'}

---

## 二、面试话术报告

${result2.value || '暂无数据'}

---

## 三、HR简历风控检测报告

${result3.value || '暂无数据'}

---

*Generated by 实习生简历助手 - 轻量化AI Demo*
`
  
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `求职准备资料_${timestamp}.md`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  const originalTitle = document.title
  document.title = '已导出!'
  setTimeout(() => {
    document.title = originalTitle
  }, 1500)
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  padding: 80px 40px 48px;
}

.header-content {
  max-width: 680px;
  margin: 0;
}

.product-name {
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 20px;
  letter-spacing: 0.01em;
  line-height: 1.2;
}

.product-slogan {
  font-size: 1.125rem;
  color: #888;
  font-weight: 400;
  line-height: 1.7;
}

.app-main {
  flex: 1;
  padding: 0 40px 80px;
  max-width: 680px;
  width: 100%;
}

.card-wrapper {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.flow-card {
  border-radius: 4px;
  border: 1px solid var(--border-color);
  background: #FFFFFF;
  margin-bottom: 32px;
}

.app-card {
  border-radius: 4px;
  border: 1px solid var(--border-color);
  background: #FFFFFF;
}

.card-header {
  padding: 24px 24px 16px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--text-color);
  line-height: 1.2;
}

.validation-badge {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 3px;
}

.validation-badge.pass {
  background-color: #E8F5E9;
  color: #2E7D32;
}

.validation-badge.warning {
  background-color: #FFF3E0;
  color: #E65100;
}

.card-body {
  padding: 24px;
}

.card-description {
  color: #888;
  font-size: 0.9375rem;
  line-height: 1.7;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 8px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.9375rem;
  font-family: var(--font-family-cn), var(--font-family-en);
  color: var(--text-color);
  background: #FFFFFF;
  resize: vertical;
  line-height: 1.6;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #A0A0A0;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--accent-color);
}

.action-btn {
  background-color: #6486B5;
  color: #FFFFFF;
  border: none;
  border-radius: 4px;
  padding: 10px 24px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-family: var(--font-family-cn), var(--font-family-en);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.action-btn:hover:not(:disabled) {
  background-color: #5575A0;
}

.action-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-icon {
  font-size: 0.875rem;
}

.progress-container {
  margin-top: 20px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.8125rem;
  color: #888;
  margin-bottom: 8px;
}

.progress-percent {
  font-weight: 500;
  color: var(--accent-color);
}

.progress-bar {
  height: 6px;
  background-color: #F0F1F3;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #6486B5;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.step-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #F0F1F3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: #A0A0A0;
  transition: all 0.2s ease;
}

.progress-step.active .step-icon {
  background-color: #6486B5;
  color: #FFFFFF;
}

.progress-step.done .step-icon {
  background-color: #6486B5;
  color: #FFFFFF;
}

.step-label {
  font-size: 0.75rem;
  color: #888;
}

.result-area {
  margin-top: 20px;
  padding: 16px;
  background-color: #FAFAF8;
  border-radius: 4px;
  border: 1px solid var(--border-color);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color);
}

.result-actions {
  display: flex;
  gap: 8px;
}

.copy-btn {
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 4px 12px;
  font-size: 0.8125rem;
  color: var(--text-color);
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease;
  font-family: var(--font-family-cn), var(--font-family-en);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.copy-btn:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.result-text {
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--text-color);
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  font-family: var(--font-family-cn), var(--font-family-en);
}

.dashboard-container {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.dashboard-header {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 12px;
}

.dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.score-circle {
  width: 120px;
  height: 120px;
}

.score-value {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-color);
  margin-top: -40px;
}

.score-label {
  font-size: 0.875rem;
  color: #888;
}

.risk-badge {
  margin-top: 12px;
  font-size: 0.8125rem;
  padding: 4px 12px;
  border-radius: 3px;
  text-align: center;
}

.risk-badge.低 {
  background-color: #E8F5E9;
  color: #2E7D32;
}

.risk-badge.中 {
  background-color: #FFF3E0;
  color: #E65100;
}

.risk-badge.高 {
  background-color: #FFEBEE;
  color: #C62828;
}

.export-card {
  text-align: center;
  padding: 24px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  background: #FFFFFF;
}

.app-footer {
  padding: 24px 40px;
  border-top: 1px solid var(--border-color);
  background: #FFFFFF;
}

.app-footer p {
  font-size: 0.8125rem;
  color: #A0A0A0;
  line-height: 1.7;
}

@media (min-width: 1024px) {
  .app-header {
    padding: 100px 80px 60px;
  }

  .header-content {
    max-width: 720px;
  }

  .product-name {
    font-size: 2.75rem;
    margin-bottom: 24px;
  }

  .product-slogan {
    font-size: 1.25rem;
  }

  .app-main {
    padding: 0 80px 100px;
    max-width: 720px;
  }

  .card-wrapper {
    gap: 40px;
  }

  .flow-card {
    margin-bottom: 40px;
  }

  .card-header {
    padding: 28px 28px 20px;
  }

  .card-body {
    padding: 28px;
  }

  .card-description {
    font-size: 1rem;
    margin-bottom: 24px;
  }

  .action-btn {
    padding: 12px 28px;
    font-size: 1rem;
  }

  .app-footer {
    padding: 28px 80px;
  }
}
</style>
