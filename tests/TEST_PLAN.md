# Geminus.js - 测试方案

## 📋 测试覆盖范围

### **集成测试**（浏览器环境）
- 文件: `tests/browser-test.html`
- 覆盖:
  - ✅ DOM 操作
  - ✅ 实际 Fetch 请求
  - ✅ CSRF Token 读取/更新
  - ✅ 通知显示
  - ✅ 表单提交和验证
  - ✅ AJAX 操作

---

## 🚀 运行测试

### 浏览器测试

```bash
# 启动本地服务器
python -m http.server 8000
# 或 Node.js
npx http-server

# 打开浏览器
http://localhost:8000/tests/browser-test.html
```

**特点：**
- 🎨 图形化测试界面
- 🧪 单个测试可单独运行
- 📊 实时测试结果统计
- 🔍 完整的控制台输出
- ✓ 支持 Tabler Toast 等 DOM 操作

---

## 📊 测试用例详情

### **模块 1: Core HTTP Module**

| 测试项 | 描述 | 预期结果 |
|--------|------|--------|
| `test-http-1` | JSON 响应解析 | ✓ 正确解析 JSON 数据 |
| `test-http-2` | 网络错误处理 | ✓ 捕获错误对象 |
| `test-http-3` | 无效 URL 处理 | ✓ 返回错误 |

**覆盖的场景：**
```javascript
// 成功请求
{ response: Response, data: Object, error: null }

// 网络错误
{ response: null, data: null, error: Error }

// 非 JSON 响应
{ response: Response, data: null, error: null }
```

---

### **模块 2: CSRF Token Module**

| 测试项 | 描述 | 预期结果 |
|--------|------|--------|
| `test-csrf-1` | 从 meta 标签读取 CSRF | ✓ 获取 token 对象 |
| `test-csrf-2` | 更新 CSRF token | ✓ token 值改变 |

**HTML 页面需要：**
```html
<meta name="csrf-hash" content="token-value">
<meta name="csrf-name" content="csrf_test_name">
<!-- 或 -->
<input type="hidden" name="csrf_test_name" value="token-value">
```

---

### **模块 3: UI Adapter**

| 测试项 | 描述 | 预期结果 |
|--------|------|--------|
| `test-notif-1` | 显示成功通知 | ✓ Toast 出现 |
| `test-notif-2` | 显示错误通知 | ✓ 红色 Toast 出现 |
| `test-notif-3` | 自定义适配器 | ✓ 使用自定义实现 |

**支持的通知类型：**
- `success` - 绿色背景
- `info` - 蓝色背景
- `warning` - 黄色背景
- `danger` - 红色背景

---

### **模块 4: Form Submission**

| 测试项 | 描述 | 预期结果 |
|--------|------|--------|
| `test-form-1` | 表单绑定和事件 | ✓ 事件监听器已添加 |
| `test-form-2` | 表单携带 CSRF token | ✓ token 值正确 |
| `test-form-3` | 表单验证错误 | ✓ 显示字段错误信息 |
| `test-form-4` | 成功后跳转 | ✓ 触发重定向逻辑 |
| `test-form-5` | 成功后刷新 | ✓ 触发页面刷新逻辑 |

**测试场景：**
- ✓ 表单数据收集
- ✓ 文件上传处理
- ✓ 字段验证错误显示
- ✓ 提交前回调
- ✓ 成功后跳转或刷新

---

### **模块 5: AJAX Request**

| 测试项 | 描述 | 预期结果 |
|--------|------|--------|
| `test-ajax-1` | POST 请求 | ✓ 请求发送成功 |
| `test-ajax-2` | 确认对话框 | ✓ 弹出确认框 |
| `test-ajax-3` | Loading 状态 | ✓ 按钮禁用并显示 spinner |
| `test-ajax-4` | AJAX 跳转 | ✓ 触发重定向逻辑 |
| `test-ajax-5` | AJAX 刷新 | ✓ 触发页面刷新逻辑 |

**测试场景：**
- ✓ 各种 HTTP 方法 (GET, POST, PUT, DELETE, PATCH)
- ✓ 确认对话框
- ✓ Loading 状态管理
- ✓ 成功后跳转或刷新
- ✓ 错误处理和回调

---

## 🎯 浏览器测试界面功能

### 界面布局

1. **Test Controls** - 运行按钮和统计显示
2. **5 个测试模块** - 按功能分类
3. **Demo Forms** - 实际表单和按钮
4. **Test Console** - 实时日志输出

### 颜色编码

- 🟢 **绿色** - 测试通过
- 🔴 **红色** - 测试失败
- 🟡 **黄色** - 测试运行中
- ⚪ **灰色** - 待运行

### 快捷操作

| 按钮 | 功能 |
|------|------|
| Run All Tests | 执行全部测试 |
| Run Core Tests | 仅执行核心测试 |
| Clear Console | 清空日志 |
| Run（每个测试旁） | 单独运行该测试 |

---

## 📈 测试报告示例

```
=== Running all tests ===
[14:23:45] ✓ Test http-1 passed
[14:23:46] ✓ Test http-2 passed
[14:23:47] ✓ Test http-3 passed
[14:23:48] ✓ Test csrf-1 passed
[14:23:49] ✓ Test csrf-2 passed
[14:23:50] ✓ Test notif-1 passed
[14:23:51] ✓ Test notif-2 passed
[14:23:52] ✓ Test notif-3 passed
[14:23:53] ✓ Test form-1 passed
[14:23:54] ✓ Test form-2 passed
[14:23:55] ✓ Test ajax-1 passed
[14:23:56] ✓ Test ajax-2 passed
[14:23:57] ✓ Test ajax-3 passed
=== All tests completed ===

Passed: 13 | Failed: 0 | Total: 13
```

---

## ✅ 手动测试清单

### 表单提交测试

- [ ] 输入有效数据，提交成功
- [ ] 输入无效数据，显示字段错误
- [ ] 错误消息正确定位到错误字段
- [ ] 自动滚动到第一个错误字段
- [ ] 提交按钮禁用和恢复
- [ ] 成功通知显示
- [ ] 指定 redirectUrl 时自动跳转
- [ ] 指定 reloadAfterSuccess 时页面刷新

### AJAX 操作测试

- [ ] 点击删除按钮，显示确认对话框
- [ ] 确认删除，请求发送，加载状态显示
- [ ] 操作成功，通知显示，页面刷新或跳转
- [ ] 操作取消，通知不显示
- [ ] 网络错误，错误通知显示

### CSRF 安全测试

- [ ] 页面初始化时读取 CSRF token
- [ ] 每次请求都携带 CSRF token
- [ ] 服务端返回新 token 时自动更新
- [ ] 表单和 AJAX 请求都包含 CSRF token

### 通知测试

- [ ] 成功通知显示绿色
- [ ] 错误通知显示红色
- [ ] 通知自动关闭（3 秒后）
- [ ] 点击关闭按钮，通知立即关闭
- [ ] 自定义适配器正常工作

---

## 🔗 集成测试端点

如需真实测试，后端需提供以下端点：

```
POST   /api/users              - 创建用户（表单提交）
GET    /api/users/:id          - 获取用户
POST   /api/items/status       - 切换状态（AJAX）
DELETE /api/items/:id          - 删除项目（AJAX）
```

### 响应格式

**成功 (200-299):**
```json
{
  "message": "操作成功",
  "data": { /* 业务数据 */ },
  "csrf": {
    "name": "csrf_test_name",
    "hash": "新的token值"
  }
}
```

**失败 (4xx-5xx):**
```json
{
  "message": "验证失败",
  "errors": {
    "username": "用户名是必需的",
    "email": "无效的邮箱格式"
  }
}
```

---

## 🐛 常见问题

### Q: 测试页面打开时，通知没有显示？
**A:** 确保已加载 Bootstrap/Tabler CSS 和 JS：
```html
<link href="https://cdn.jsdelivr.net/npm/tabler@1.4.0/dist/css/tabler.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/@tabler/core@1.4.0/dist/js/tabler.min.js"></script>
```

### Q: CSRF token 测试失败？
**A:** 确保 HTML 包含 CSRF meta 标签：
```html
<meta name="csrf-hash" content="token-value">
<meta name="csrf-name" content="csrf_test_name">
```

### Q: 表单提交没有反应？
**A:** 
1. 检查表单 `action` 属性
2. 确保服务器可访问
3. 检查浏览器控制台是否有错误

---

## 📚 相关文件

- `README.md` - 库的完整文档
- `lib/index.js` - 主入口，导出所有 API
- `tests/browser-test.html` - 浏览器集成测试

---

## 总结

| 测试方式 | 优点 | 适用场景 |
|--------|------|--------|
| **浏览器测试** | 图形化、直观、支持 DOM | 开发和集成测试 |
| **手动测试** | 全面、可发现边界情况 | 发布前验证 |

两种方式结合使用，可确保库的质量和稳定性！
