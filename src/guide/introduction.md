# 项目介绍
<div align="center">
    <a href="https://github.com/MarSeventh/CloudFlare-ImgBed">
        <img class="project-banner project-banner-light" width="80%" alt="CloudFlare ImgBed 动画 Logo" src="/images/guide/animated-banner-light.apng" />
        <img class="project-banner project-banner-dark" width="80%" alt="CloudFlare ImgBed 动画 Logo" src="/images/guide/animated-banner-dark.apng" />
    </a>
    <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 5px; margin-top: 20px; margin-bottom: 20px;">
        <a href="https://github.com/MarSeventh/CloudFlare-ImgBed/blob/main/LICENSE"><img src="https://img.shields.io/github/license/MarSeventh/CloudFlare-ImgBed" alt="License" /></a>
        <a href="https://github.com/MarSeventh/CloudFlare-ImgBed/releases"><img src="https://img.shields.io/github/release/MarSeventh/CloudFlare-ImgBed" alt="latest version" /></a>
        <a href="https://hub.docker.com/r/marseventh/cloudflare-imgbed"><img src="https://img.shields.io/docker/pulls/marseventh/cloudflare-imgbed" alt="Docker Pulls" /></a>
        <a href="https://github.com/MarSeventh/CloudFlare-ImgBed/stargazers"><img src="https://img.shields.io/github/stars/MarSeventh/CloudFlare-ImgBed" alt="Stars" /></a>
        <a href="https://github.com/MarSeventh/CloudFlare-ImgBed/network/members"><img src="https://img.shields.io/github/forks/MarSeventh/CloudFlare-ImgBed" alt="Forks" /></a>
        <a href="https://t.me/sanyue_club"><img src="https://img.shields.io/badge/-Sanyue-26A5E4?logo=telegram&logoColor=white" alt="Telegram Sanyue" /></a>
        <a href="https://atomgit.com/MarSeventh/CloudFlare-ImgBed"><img src="https://atomgit.com/MarSeventh/CloudFlare-ImgBed/star/badge.svg" alt="G-star" /></a>
    </div>
    <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 5px;">
        <a href="https://trendshift.io/repositories/14324" target="_blank"><img src="https://trendshift.io/api/badge/repositories/14324" alt="GitHub Trending" width="250" /></a>
        <a href="https://hellogithub.com/repository/MarSeventh/CloudFlare-ImgBed" target="_blank"><img src="https://api.hellogithub.com/v1/widgets/recommend.svg?rid=71d65ace215945b0909d4c75c31b9fcb&claim_uid=6DsuqF4hInJWerv&theme=neutral" alt="Featured｜HelloGitHub" width="250" /></a>
    </div>
</div>

CloudFlare ImgBed 是一个支持 Docker 与 Serverless 部署的开源图床和文件托管方案，可将 Telegram、Discord、Cloudflare R2、S3 兼容存储、Hugging Face 和 WebDAV 等后端统一接入一个管理界面。项目提供上传、读取、目录与标签管理、身份认证、内容审查、HTTP API、WebDAV 和公开浏览等能力，适用于个人图床、网站资源管理和轻量文件分发。

<div style="position: relative; padding: 30% 45%;">
    <iframe 
        src="//player.bilibili.com/player.html?bvid=BV1y3WGe4EGh&page=1" 
        scrolling="no" 
        border="0" 
        frameborder="no" 
        framespacing="0" 
        allowfullscreen="true" 
        style="position: absolute; width: 100%; height: 100%; left: 0; top: 0;"
    ></iframe>
</div>

## 效果展示
![海报](/images/guide/poster.png)
![上传界面](/images/guide/upload.png)

<details>
    <summary>更多界面展示</summary>

![登录界面](/images/guide/login.png)
![上传中界面](/images/guide/uploading.png)
![控制台界面](/images/guide/dashboard.png)
![用户管理](/images/guide/cusmanager.png)
![系统设置](/images/guide/sysconfig.png)

</details>

## 技术架构

![CloudFlare ImgBed 技术架构：多端接入、多平台运行时、数据库兼容、统一存储渠道与可扩展 AI 能力](/images/guide/architecture.apng)

> **一次构建，全域运行：融合存算解耦、智能容灾路由与 AI 原生管线的下一代媒体引擎。**

- **同构内核，全域部署**：单一应用核心无缝跨越 Serverless（Pages / Workers）与容器化环境（Docker），底层持久化底座按需自适应挂载 KV、D1 或 SQLite。
- **控制面与数据面解耦**：元数据管理与二进制文件载荷彻底分离，通过独立的可插拔适配器驱动，实现极致的存储扩展性与零侵入迁移。
- **智能路由，高可用容灾**：内置多渠道动态路由引擎，原生支持流量负载均衡与故障自动降级兜底（Failover），确保极端场景下的服务连续性。
- **AI 原生工作流**：将大模型能力深度织入文件生命周期，支持自定义模型接入、Prompt 编排与结构化结果输出，让图床从“静态存储”进化为“智能资产中枢”。

## 版本历史

### v2.x 重大更新

- 🎨 响应式管理与上传界面，支持深色模式、中英文切换和自定义背景
- 📁 目录、标签、筛选、批量操作及递归文件夹上传
- 🗄️ 接入 Telegram、R2、S3、Discord、Hugging Face 和 WebDAV 等存储后端
- ⚡ 多渠道负载均衡、容量限制、失败切换和大文件分块上传
- 🌐 完整的上传、读取、删除、列出、随机图和 Token 管理 API，以及 WebDAV 服务
- 🖼️ 支持通过 URL 参数缩放、裁剪或拉伸图片
- 🔐 认证系统安全加固：PBKDF2 密码哈希、HttpOnly Cookie 会话管理
- 🔑 API Token 支持细分权限、过期时间和自动删除
- ☁️ 支持 Cloudflare Pages、Workers 和 Docker，分别使用 KV/D1 或 SQLite 数据层

### v1.x 功能基础

- 🚀 基础文件上传和管理功能
- 🔐 身份认证和权限控制
- 🎨 自定义界面和配置
- 📡 完整的 API 接口

## 开源协议

本项目采用 [MIT 开源协议](https://github.com/MarSeventh/CloudFlare-ImgBed/blob/main/LICENSE)，您可以：

- ✅ 商业使用
- ✅ 修改和分发
- ✅ 私人使用
- ✅ 专利使用

但需要保留原作者在包括但不限于前后端代码和其他文件在内的所有副本或重要部分中的版权声明。

## Star History

<a href="https://github.com/MarSeventh/CloudFlare-ImgBed">
 <img class="star-history-light" alt="Star-History" src="https://api.star-history.com/svg?repos=marseventh%2Fcloudflare-imgbed,marseventh/sanyue-imghub&amp;type=Date" />
 <img class="star-history-dark" alt="Star-History" src="https://api.star-history.com/svg?repos=marseventh%2Fcloudflare-imgbed,marseventh/sanyue-imghub&amp;type=Date&amp;theme=dark" />
</a>

喜欢项目的话，希望您能给个免费的 star✨✨✨，非常感谢！
