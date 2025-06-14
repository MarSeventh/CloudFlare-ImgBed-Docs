# 手动部署

如果Cloudflare的**有限访问次数**不能满足你的需求，并且你拥有自己的服务器，可以参照本节的教程在服务器上模拟Cloudflare的环境，并开放对应的端口访问服务。

::: warning 注意
由于服务器操作系统、硬件版本复杂多样，相关教程**无法确保适合每一位用户**，遇到报错请尽量利用搜索引擎解决，无法解决也可以提issue寻求帮助。
:::

## 📂 前置要求

- 拥有一台可以正常访问的Linux/Windows服务器
- 服务器已安装Node.js环境（推荐v22.5.1版本）
- 具备基本的命令行操作能力

## 🚀 部署步骤

### 1. 安装Node.js

安装服务器操作系统对应的`node.js`，经测试`v22.5.1`版本可以正常使用。


### 2. 获取项目代码

```bash
# 克隆项目仓库
git clone https://github.com/MarSeventh/CloudFlare-ImgBed.git
cd CloudFlare-ImgBed
```

### 3. 安装依赖

切换到项目根目录，运行`npm install`，安装所需依赖：

```bash
npm install
```

### 4. 创建配置文件

在项目根目录下新建`wrangler.toml`配置文件，其内容为项目名称，环境变量等。

```toml
name = "cloudflare-imgbed"
compatibility_date = "2024-07-24"

# 如果需要设置环境变量，可以在这里添加
# [vars]
# AUTH_CODE = "your_auth_code"
# TG_BOT_TOKEN = "your_bot_token"
# TG_CHAT_ID = "your_chat_id"
```

详情参见官方文档：[Configuration - Wrangler (cloudflare.com)](https://developers.cloudflare.com/workers/wrangler/configuration/)

### 5. 启动服务

在项目根目录下运行`npm run start`：

```bash
npm run start
```

正常启动后，控制台输出类似如下内容：

```
⎔ Starting local server...
⎔ Using namespace binding img_url
⎔ Using R2 binding img_r2
✅ Ready on http://localhost:8080
```

![服务启动成功](/images/deployment/manual-console.png)

至此，正常情况下项目已经成功部署。程序默认运行在`8080`端口上。


## ⚙️ 自定义配置

### 修改端口

如需修改端口，可在`package.json`中修改`start`脚本的`port`参数：

```json
"scripts": {
    "ci-test": "concurrently --kill-others \"npm start\" \"wait-on http://localhost:8080 && mocha\"",
    "test": "mocha",
    "start": "npx wrangler pages dev ./ --kv \"img_url\" --r2 \"img_r2\" --port 8080 --persist-to ./data"
}
```

将`--port 8080`修改为你想要的端口号。


### 持久化数据

数据将自动保存在项目目录下的`./data`文件夹中，确保该目录有足够的读写权限。

## 🚀 下一步

至此项目已通过手动方式完成部署，默认支持 Cloudflare R2 存储渠道，添加其他存储渠道和进行其他设置的方式请参考 [配置说明](/deployment/configuration#🗂%EF%B8%8F-存储渠道配置)。