# 项目介绍
<div align="center">
    <a href="https://github.com/MarSeventh/CloudFlare-ImgBed">
        <img width="80%" alt="logo" src="/images/guide/banner.png"/>
    </a>
    <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 5px; margin-top: 20px; margin-bottom: 20px;">
        <a href="https://github.com/MarSeventh/CloudFlare-ImgBed/blob/main/LICENSE"><img src="https://img.shields.io/github/license/MarSeventh/CloudFlare-ImgBed" alt="License" /></a>
        <a href="https://github.com/MarSeventh/CloudFlare-ImgBed/releases"><img src="https://img.shields.io/github/release/MarSeventh/CloudFlare-ImgBed" alt="latest version" /></a>
        <a href="https://hub.docker.com/r/marseventh/cloudflare-imgbed"><img src="https://img.shields.io/docker/pulls/marseventh/cloudflare-imgbed" alt="Docker Pulls" /></a>
        <a href="https://github.com/MarSeventh/CloudFlare-ImgBed/stargazers"><img src="https://img.shields.io/github/stars/MarSeventh/CloudFlare-ImgBed" alt="Stars" /></a>
        <a href="https://github.com/MarSeventh/CloudFlare-ImgBed/network/members"><img src="https://img.shields.io/github/forks/MarSeventh/CloudFlare-ImgBed" alt="Forks" /></a>
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

- **前端界面**：基于 Vue 3 和 Element Plus，支持响应式设计、深色模式及中英文切换
- **后端 API**：Cloudflare Pages Functions 与 Workers 使用 Serverless 运行时；Docker 使用 Node.js 和 Hono 原生服务
- **存储层**：支持多种存储后端（Telegram、R2、S3、Discord、Hugging Face、WebDAV）
- **数据层**：Cloudflare 部署支持 KV 或 D1，Docker 使用本地 SQLite，并可使用本地文件系统替代 R2
- **图片处理**：Cloudflare Worker 使用 Images binding，Docker 使用 Sharp；Pages Functions 不支持该功能
- **部署方式**：支持 Cloudflare Pages、Cloudflare Workers、Docker 多种部署方式


## 版本历史

### v2.x 重大更新

- 🎨 响应式管理与上传界面，支持深色模式、中英文切换和自定义背景
- 📁 目录、标签、筛选、批量操作及递归文件夹上传
- 🗄️ 接入 Telegram、R2、S3、Discord、Hugging Face 和 WebDAV 等存储后端
- ⚡ 多渠道负载均衡、容量限制、失败切换和大文件分块上传
- 🌐 完整的上传、读取、删除、列出、随机图和 Token 管理 API，以及 WebDAV 服务
- 🖼️ Worker 与 Docker 支持通过 URL 参数处理图片尺寸
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

<a href="https://www.star-history.com/?repos=MarSeventh%2FCloudFlare-ImgBed%2CMarSeventh%2FSanyue-ImgHub&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=MarSeventh/CloudFlare-ImgBed%2CMarSeventh/Sanyue-ImgHub&type=date&theme=dark&legend=top-left&sealed_token=sAw_e7kRryMASKC9b3AqORk8leSZgKYTuCvYqOzqsyOmTse-00LgwOS4FtG75lHuCuxsyd-TPlyV3BieLloGaM-3M2AlLeQt2g1_Kczjm0UZdqnvVKRCR2J9oqdE0_XEKFMmOMLG_Loz8Bz3-JPKwiMyTjKM0LRRLm2TjGA73QSrTuOsRAqwj6F7LAVf" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=MarSeventh/CloudFlare-ImgBed%2CMarSeventh/Sanyue-ImgHub&type=date&legend=top-left&sealed_token=sAw_e7kRryMASKC9b3AqORk8leSZgKYTuCvYqOzqsyOmTse-00LgwOS4FtG75lHuCuxsyd-TPlyV3BieLloGaM-3M2AlLeQt2g1_Kczjm0UZdqnvVKRCR2J9oqdE0_XEKFMmOMLG_Loz8Bz3-JPKwiMyTjKM0LRRLm2TjGA73QSrTuOsRAqwj6F7LAVf" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=MarSeventh/CloudFlare-ImgBed%2CMarSeventh/Sanyue-ImgHub&type=date&legend=top-left&sealed_token=sAw_e7kRryMASKC9b3AqORk8leSZgKYTuCvYqOzqsyOmTse-00LgwOS4FtG75lHuCuxsyd-TPlyV3BieLloGaM-3M2AlLeQt2g1_Kczjm0UZdqnvVKRCR2J9oqdE0_XEKFMmOMLG_Loz8Bz3-JPKwiMyTjKM0LRRLm2TjGA73QSrTuOsRAqwj6F7LAVf" />
 </picture>
</a>

喜欢项目的话，希望您能给个免费的 star✨✨✨，非常感谢！
