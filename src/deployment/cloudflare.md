# Cloudflare Pages 部署

Cloudflare Pages 是推荐的部署方式，提供免费托管、全球 CDN 加速和无需服务器维护的优势。


## 📂 第一步：Fork 项目

1. 访问 [CloudFlare ImgBed 项目](https://github.com/MarSeventh/CloudFlare-ImgBed)
2. 点击右上角的 "Fork" 按钮
3. 选择您的 GitHub 账户
4. 确认 Fork 完成

## 🏗️ 第二步：创建 Pages 项目

### 2.1 访问 Cloudflare Dashboard

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 选择左侧菜单的 "计算和AI" -> "Workers & Pages"
3. 点击 "创建应用程序"
4. 在最下方 `Looking to deploy Pages? ` 选择 "Get started"
5. 在 "导入现有 Git 存储库" 处点击 "开始使用"

![创建 Pages 项目](/images/deployment/pages-create.png)
![创建 Pages 项目](/images/deployment/pages-create-1.png)

### 2.2 连接 GitHub 仓库

1. 如果首次使用，需要授权 Cloudflare 访问 GitHub
2. 选择您 Fork 的 `CloudFlare-ImgBed` 仓库
3. 点击 "开始设置"

### 2.3 配置项目设置

| 配置项 | 值 | 说明 |
|--------|----|----|
| 项目名称 | `cloudflare-imgbed`（或自定义） | 项目标识符 |
| 生产分支 | `main` | 生产环境分支 |
| 构建命令 | `npm install` | **重要：v2.0 新构建命令** |
| 构建输出目录 | `/` | 保持默认 |

![配置项目设置](/images/deployment/pages-build-config.png)

::: warning 重要提醒
v2.0 版本的构建命令已变更为 `npm install`，请确保使用正确的构建命令。
:::

### 2.4 部署项目

1. 点击 "保存并部署"
2. 等待首次部署完成（约 2-3 分钟）

## 🗄️ 第三步：配置数据库

数据库用于存储文件元数据，是必需的组件，可选数据库为 `KV` 数据库和 `D1` 数据库。两者对比如下表所示，根据自己使用场景**从其中选择一种配置即可**。

| 特点 | KV 数据库 | D1 数据库 |
|------|-----------|-----------|
| 读写性能 | 高 | 较低 |
| 免费额度 | 少 | 多 |

::: tip 重要提示
KV 数据库和 D1 数据库**只需要配置其中一个**即可，不需要同时配置两个！建议根据上表选择适合自己的数据库类型。
:::

### 3.1 KV 数据库配置

#### 创建 KV 命名空间

1. 在 Cloudflare Dashboard 中选择 "存储和数据库"
2. 点击 "Workers KV"
3. 点击 "创建实例"
4. 输入命名空间名称：`img_url`（建议使用此名称）
5. 点击 "创建"

![创建 KV 命名空间](/images/deployment/kv-create.png)
![创建 KV 命名空间](/images/deployment/kv-create-1.png)

#### 绑定 KV 到项目

1. 返回您的 Pages 项目
2. 选择 "设置" → "绑定"
3. 点击 "添加" → "KV 命名空间"
4. 填写绑定信息：
   - **变量名称**：`img_url`（必须是这个名称）
   - **KV 命名空间**：选择刚创建的命名空间
5. 点击 "保存"

::: warning 注意
绑定 KV 时，变量名称必须为 `img_url`，这是项目预设的变量名，填错会出现无法进入管理界面等情况。
:::

### 3.2 D1 数据库配置

#### 创建 D1 数据库

1. 在 Cloudflare Dashboard 中选择 "存储和数据库"
2. 点击 "D1 SQL 数据库"
3. 点击 "创建数据库"
4. 输入数据库名称：`img_d1`（建议使用此名称）
5. 点击 "创建"

#### 初始化 D1 数据库

1. 创建完成后，点击进入数据库详情页
2. 选择 "控制台" 选项卡
3. 在 SQL 输入框中粘贴并执行注释区域以下的内容（见[项目仓库](https://github.com/MarSeventh/CloudFlare-ImgBed/blob/main/database/init.sql)）
4. 点击 "执行"

#### 绑定 D1 到项目

1. 返回您的 Pages 项目
2. 选择 "设置" → "绑定"
3. 点击 "添加" → "D1 数据库"
4. 填写绑定信息：
   - **变量名称**：`img_d1`（必须是这个名称）
   - **D1 数据库**：选择刚创建的数据库
5. 点击 "保存"

## 🔄 第四步：重新部署

绑定数据库后需要重新部署以生效：

1. 进入项目的 "部署" 页面
2. 找到最新的部署记录
3. 点击右侧的 "..." 菜单
4. 选择 "重试部署"
5. 等待部署完成

![重新部署](/images/deployment/redeploy.png)

## 🚀 下一步

至此已经完成项目在 Cloudflare Pages 的部署，但是尚未添加存储渠道，添加存储渠道和进行其他设置的方式请参考 [配置说明](/deployment/configuration#🗂%EF%B8%8F-存储渠道配置)。

