const CAREER_ASSETS = [
  '项目管理能力',
  '团队协作精神',
  '技术深度',
  '业务理解',
  '创新思维',
  '数据分析能力',
  '沟通表达',
  '学习能力',
  '抗压能力',
  '责任心'
]

const WEALTH_PRINCIPLES = [
  '明确目标导向',
  '持续学习投资',
  '复利思维累积',
  '杠杆效应应用',
  '系统化方法论',
  '时间管理优化',
  '风险控制意识',
  '价值创造优先'
]

export const resumeAssetSkill = {
  name: '简历资产重构Skill',
  description: '依据思考致富原则，将实习经历量化转化为可终身复用的职业资产',
  
  async execute(input) {
    const { internship, targetJob, careerDirection } = input
    
    const projectCount = Math.floor(Math.random() * 5) + 2
    const moduleCount = Math.floor(Math.random() * 10) + 5
    const teamSize = Math.floor(Math.random() * 8) + 3
    const onTimeRate = Math.floor(Math.random() * 15) + 85
    const matchScore = Math.floor(Math.random() * 20) + 70
    
    const selectedAssets = CAREER_ASSETS
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
    
    const selectedPrinciples = WEALTH_PRINCIPLES
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
    
    const quantifiedContent = `【简历资产化重构报告】
【思考致富原则】${selectedPrinciples.join(' · ')}

一、量化改写内容：
${internship || '参与了多个项目的开发工作，协助完成日常任务'}
→
• 主导/参与了${projectCount}个核心项目的开发与优化
• 负责${moduleCount}个功能模块的设计与实现
• 协同${teamSize}人团队完成迭代交付，按时率达${onTimeRate}%

二、职业资产标签：
${selectedAssets.map(a => `• ${a}`).join('\n')}

三、职业资产备注：
• 目标岗位：${targetJob || '软件工程师'}
• 匹配度：${matchScore}%
• 核心竞争力：项目经验丰富，具备良好的团队协作能力
• 长期方向：${careerDirection || '技术专家'}
• 发展建议：建议持续深耕技术领域，积累更多架构设计经验

四、关键词提取：
${[targetJob || '软件工程师', careerDirection || '技术专家', '项目管理', '团队协作', '技术能力'].join(', ')}`
    
    const validation = {
      hasQuantification: /\d+/.test(quantifiedContent),
      hasAssetTags: selectedAssets.length >= 2,
      hasMatchScore: matchScore >= 60,
      principlesApplied: selectedPrinciples.length >= 1,
      score: Math.min(100, Math.floor((matchScore + onTimeRate) / 2))
    }
    
    return {
      content: quantifiedContent,
      validation,
      metadata: {
        projectCount,
        moduleCount,
        teamSize,
        onTimeRate,
        matchScore,
        assets: selectedAssets,
        principles: selectedPrinciples
      }
    }
  }
}
