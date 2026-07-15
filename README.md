# 实习生简历助手

打造可终身复用的职业简历资产，找准长期择业方向，拿下实习offer。

## 功能特性

- **简历资产化重构**：依据思考致富原则，量化改写实习经历，增加职业资产标签
- **面试话术模块**：基于羊皮卷智慧，生成结构化自我介绍+STAR面试应答
- **HR简历检测**：识别AI套话、无量化经历，输出风险报告与匹配分数
- **求职流水线**：一键执行全流程，自动生成完整求职资料
- **可视化仪表盘**：人岗匹配评分展示

## 技术栈

- Vue 3 + Composition API
- Element Plus
- Vite
- Font Awesome Icons

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 部署到 GitHub Pages

1. 将项目推送到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages
3. 选择 `gh-pages` 分支作为源

部署后访问地址：`https://<username>.github.io/<repo-name>/`

## 项目结构

```
src/
├── skills/           # 自定义TRAE Skill模块
│   ├── resumeAssetSkill.js
│   ├── interviewScriptSkill.js
│   └── hrRiskDetectSkill.js
├── App.vue           # 主应用组件
├── main.js           # 入口文件
└── style.css         # 全局样式
```

## 许可证

MIT License
