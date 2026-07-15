const AI_CLICHES = [
  '性格开朗',
  '工作认真负责',
  '具有良好的团队协作能力',
  '熟练使用',
  '能够快速适应',
  '积极主动',
  '善于沟通',
  '吃苦耐劳',
  '责任心强',
  '有较强的学习能力'
]

const QUANTIFICATION_KEYWORDS = [
  '个', '次', '%', '人', '天', '周', '月', '年',
  '增长', '提升', '优化', '节省', '完成', '达成'
]

const POSITIVE_SIGNALS = [
  '项目', '负责', '主导', '设计', '开发', '实现',
  '优化', '改进', '分析', '调研', '策划', '执行'
]

export const hrRiskDetectSkill = {
  name: 'HR简历风控检测Skill',
  description: '识别简历中的AI套话、无量化经历，输出风险报告与匹配分数',
  
  async execute(input) {
    const { resume, targetJob = '' } = input
    
    const resumeContent = resume || '本人性格开朗，工作认真负责，具有良好的团队协作能力。熟练使用各种办公软件，能够快速适应新环境。'
    
    const detectedClichés = AI_CLICHES.filter(cliché => resumeContent.includes(cliché))
    const hasQuantification = QUANTIFICATION_KEYWORDS.some(keyword => resumeContent.includes(keyword)) || /\d+/.test(resumeContent)
    const positiveSignalCount = POSITIVE_SIGNALS.filter(signal => resumeContent.includes(signal)).length
    
    const clichéRisk = detectedClichés.length > 3 ? '高' : detectedClichés.length > 1 ? '中' : '低'
    const quantificationRisk = hasQuantification ? '低' : '高'
    
    let matchScore = 60
    
    if (detectedClichés.length === 0) matchScore += 20
    else if (detectedClichés.length <= 2) matchScore += 10
    
    if (hasQuantification) matchScore += 15
    
    if (positiveSignalCount >= 5) matchScore += 10
    else if (positiveSignalCount >= 3) matchScore += 5
    
    if (targetJob && resumeContent.toLowerCase().includes(targetJob.toLowerCase())) {
      matchScore += 10
    }
    
    matchScore = Math.min(100, Math.max(0, matchScore))
    
    let report = `【HR简历风控检测报告】

一、AI套话检测：
${detectedClichés.length > 0 ? `⚠️ 检测到${detectedClichés.length}处AI套话/模板化表达` : '✅ 未检测到明显的AI套话'}
风险等级：${clichéRisk}
${detectedClichés.length > 0 ? `\n检测到的套话示例：\n${detectedClichés.join('\n')}` : ''}

二、量化经历检测：
${hasQuantification ? '✅ 包含量化数据支撑' : '⚠️ 缺乏量化数据支撑'}
风险等级：${quantificationRisk}
${!hasQuantification ? '\n建议：在描述工作经历时加入具体数字，如项目规模、完成时间、达成效果等' : ''}

三、积极信号分析：
检测到${positiveSignalCount}个积极行动词汇
${positiveSignalCount >= 3 ? '✅ 行动导向明确' : '⚠️ 行动描述较少'}

四、人岗匹配评分：
${matchScore}分

五、综合风险等级：${matchScore >= 80 ? '低' : matchScore >= 60 ? '中' : '高'}

六、优化建议：
${detectedClichés.length > 0 ? '• 用具体事例替代抽象形容词\n' : ''}${!hasQuantification ? '• 加入量化成果数据\n' : ''}• 使用STAR法则结构化描述经历\n• 突出个人独特价值和差异化优势`
    
    const validation = {
      hasMatchScore: true,
      matchScore,
      clichéCount: detectedClichés.length,
      hasQuantification,
      positiveSignals: positiveSignalCount,
      riskLevel: matchScore >= 80 ? '低' : matchScore >= 60 ? '中' : '高'
    }
    
    return {
      content: report,
      validation,
      metadata: {
        matchScore,
        detectedClichés,
        hasQuantification,
        positiveSignalCount,
        riskLevel: validation.riskLevel
      }
    }
  }
}
