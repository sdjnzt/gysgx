# 🚀 GitHub Pages 部署指南

## 📋 部署前准备

### 1. 修改配置文件
- ✅ 已修改 `package.json` 添加部署脚本
- ✅ 已修改路由为 `HashRouter` 兼容静态部署
- ✅ 已添加 `gh-pages` 依赖

### 2. 安装依赖
```bash
npm install
```

## 🔧 部署步骤

### 步骤1：修改homepage字段
在 `package.json` 中将 `homepage` 字段修改为您的实际GitHub信息：

```json
{
  "homepage": "https://你的GitHub用户名.github.io/你的仓库名"
}
```

**示例：**
- 如果您的GitHub用户名是 `john`
- 仓库名是 `srm-platform`
- 则设置为：`"https://john.github.io/srm-platform"`

### 步骤2：安装gh-pages包
```bash
npm install --save-dev gh-pages
```

### 步骤3：构建并部署
```bash
# 构建项目
npm run build

# 部署到GitHub Pages
npm run deploy
```

### 步骤4：配置GitHub仓库设置
1. 进入您的GitHub仓库
2. 点击 `Settings` 标签
3. 左侧菜单选择 `Pages`
4. Source 选择 `Deploy from a branch`
5. Branch 选择 `gh-pages` 分支
6. 点击 `Save`

## 🌐 访问您的应用

部署成功后，您可以通过以下URL访问：
```
https://你的GitHub用户名.github.io/你的仓库名
```

## ⚠️ 重要注意事项

### 1. 路由兼容性
- 已使用 `HashRouter` 替代 `BrowserRouter`
- URL格式：`https://域名/#/路径`
- 例如：`https://域名/#/srm/data-preprocessing`

### 2. 静态资源路径
- 确保所有图片、CSS、JS文件路径正确
- 相对路径会自动适配

### 3. 环境变量
- 生产环境变量需要以 `REACT_APP_` 开头
- 例如：`REACT_APP_API_URL`

## 🔄 更新部署

每次修改代码后，重新部署：
```bash
npm run deploy
```

## 🐛 常见问题解决

### 1. 页面显示404
- 检查 `homepage` 字段是否正确
- 确认GitHub Pages已启用
- 等待几分钟让部署生效

### 2. 路由不工作
- 确认使用 `HashRouter`
- 检查URL格式是否正确

### 3. 静态资源加载失败
- 检查文件路径
- 确认构建成功

## 📱 移动端适配

- 应用已使用Ant Design响应式组件
- 支持各种屏幕尺寸
- 建议在移动设备上测试

## 🎯 部署检查清单

- [ ] 修改 `package.json` 中的 `homepage` 字段
- [ ] 安装 `gh-pages` 依赖
- [ ] 执行 `npm run deploy`
- [ ] 配置GitHub仓库Pages设置
- [ ] 测试应用功能
- [ ] 检查移动端适配

---

**部署完成后，您的供应商关系管理平台就可以在GitHub Pages上运行了！** 🎉
