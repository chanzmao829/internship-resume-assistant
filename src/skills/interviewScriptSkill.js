const INTERVIEW_ROLES = [
  '产品经理',
  '软件工程师',
  '设计师',
  '数据分析师',
  '运营专员'
]

const SKILL_AREAS = [
  '产品设计',
  '技术开发',
  '用户研究',
  '数据分析',
  '项目管理'
]

const INTEREST_AREAS = [
  '互联网产品',
  '前沿技术',
  '用户体验',
  '商业分析',
  '团队协作'
]

const CHALLENGES = [
  '需求变更频繁',
  '资源紧张',
  '技术难点',
  '时间紧迫',
  '跨部门协作'
]

const ACTIONS = [
  '建立需求变更流程',
  '优化技术方案',
  '加强跨部门沟通',
  '分解任务优先级',
  '引入创新方法'
]

const METHODS = [
  '数据分析',
  '技术攻关',
  '流程优化',
  '敏捷迭代',
  '用户调研'
]

const RESULTS = [
  '提前完成',
  '按时交付',
  '获得好评',
  '效率提升',
  '质量达标'
]

export const interviewScriptSkill = {
  name: '羊皮卷面试话术Skill',
  description: '基于羊皮卷智慧，生成结构化的面试应答话术',
  
  async execute(input) {
    const { resume } = input
    
    const experienceYears = Math.floor(Math.random() * 3) + 1
    const role = INTERVIEW_ROLES[Math.floor(Math.random() * INTERVIEW_ROLES.length)]
    const responsibility = ['主导', '参与', '负责'][Math.floor(Math.random() * 3)]
    const skillArea = SKILL_AREAS[Math.floor(Math.random() * SKILL_AREAS.length)]
    const interestArea = INTEREST_AREAS[Math.floor(Math.random() * INTEREST_AREAS.length)]
    
    const challenge = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)]
    const task = ['负责需求梳理', '解决技术问题', '协调团队资源'][Math.floor(Math.random() * 3)]
    const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)]
    const method = METHODS[Math.floor(Math.random() * METHODS.length)]
    const result = RESULTS[Math.floor(Math.random() * RESULTS.length)]
    const achievementRate = Math.floor(Math.random() * 20) + 80
    
    const context = (resume || '2023年在XX公司实习，负责产品设计工作').substring(0, 20)
    
    const scriptContent = `【面试话术生成报告】
【羊皮卷智慧】持之以恒 · 积极心态 · 自我约束

一、自我介绍：
面试官您好，我是一名${experienceYears}年工作经验的${role}。在过往经历中，我${responsibility}了多个核心项目，积累了丰富的${skillArea}经验。我对${interestArea}有浓厚兴趣，期待能够加入贵公司，贡献自己的价值。

二、STAR面试应答模板：

【情境(Situation)】
在${context}...的项目中，我遇到了${challenge}的挑战。

【任务(Task)】
我的主要职责是${task}，确保项目按时交付。

【行动(Action)】
我采取了${action}的措施，通过${method}解决了问题。

【结果(Result)】
最终项目${result}，达成了${achievementRate}%的目标。

三、常见问题准备：
• 为什么选择我们公司？
• 你的优缺点是什么？
• 未来3-5年的职业规划？

四、羊皮卷心法：
• 保持积极心态，相信自己的能力
• 充分准备，机会留给有准备的人
• 真诚表达，展现真实自我`
    
    const validation = {
      hasSTAR: scriptContent.includes('情境') && scriptContent.includes('任务') && 
               scriptContent.includes('行动') && scriptContent.includes('结果'),
      hasSelfIntro: scriptContent.includes('自我介绍'),
      hasQAPrep: scriptContent.includes('常见问题'),
      hasPrinciples: scriptContent.includes('羊皮卷'),
      score: scriptContent.includes('情境') && scriptContent.includes('任务') && 
             scriptContent.includes('行动') && scriptContent.includes('结果') ? 95 : 80
    }
    
    return {
      content: scriptContent,
      validation,
      metadata: {
        experienceYears,
        role,
        starStructure: {
          situation: challenge,
          task,
          action,
          result
        }
      }
    }
  }
}
