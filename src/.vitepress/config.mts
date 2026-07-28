import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'CloudFlare ImgBed',
  description: '🗂️开源文件托管解决方案，基于 Cloudflare Pages，支持 Telegram Bot 、 Cloudflare R2 、S3 等多种存储渠道',
  
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'keywords', content: 'CloudFlare,图床,文件托管,Telegram,R2,S3,开源' }],
    ['meta', { property: 'og:title', content: 'CloudFlare ImgBed - 开源文件托管解决方案' }],
    ['meta', { property: 'og:description', content: '基于 Cloudflare Pages 的免费开源图床解决方案' }],
  ],

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN'
    },
    en: {
      label: 'English',
      lang: 'en-US',
      title: 'CloudFlare ImgBed',
      description: '🗂️Open source file hosting solution based on Cloudflare Pages, supporting Telegram Bot, Cloudflare R2, S3 and other storage channels',      
      themeConfig: {
        logo: '/logo.png',
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Document', link: '/en/guide/introduction' },
          { text: 'About', link: '/en/about/contribute' }
        ],
        sidebar: [
          {
            text: 'Project Overview',
            collapsed: false,
            items: [
              { text: 'Introduction', link: '/en/guide/introduction' },
              { text: 'Quick Start', link: '/en/guide/quick-start' },
              { text: 'Features', link: '/en/guide/features' },
              { text: 'Update Logs', link: '/en/guide/update-log' },
              { text: 'TODO List', link: '/en/guide/todolist' }
            ]
          },
          {
            text: 'Deployment',
            collapsed: false,
            items: [
              { text: 'Prerequisites', link: '/en/deployment/prerequisites' },
              { text: 'Cloudflare Pages Deployment', link: '/en/deployment/pages' },
              { text: 'Cloudflare Workers Deployment', link: '/en/deployment/worker' },
              { text: 'Docker Deployment', link: '/en/deployment/docker' },
              { text: 'Manual Deployment', link: '/en/deployment/manual' },
              { text: 'Version Update', link: '/en/deployment/update' },
              { text: 'Configuration', link: '/en/deployment/configuration' }
            ]
          },
          {
            text: 'API Documentation',
            collapsed: true,
            items: [
              { text: 'Basic Introduction', link: '/en/api/index' },
              { text: 'Upload API', link: '/en/api/upload' },
              { text: 'Read API', link: '/en/api/file' },
              { text: 'Delete API', link: '/en/api/delete' },
              { text: 'List API', link: '/en/api/list' },
              { text: 'Random Image API', link: '/en/api/random' },
              { text: 'Token Management API', link: '/en/api/token' },
              { text: 'WebDAV', link: '/en/api/webdav' }
            ]
          },
          {
            text: 'Q&A',
            collapsed: true,
            items: [
              { text: 'Frequently Asked Questions', link: '/en/qa/' }
            ]
          },
          {
            text: 'About',
            collapsed: false,
            items: [
              { text: 'Contribute', link: '/en/about/contribute' },
              { text: 'Thanks', link: '/en/about/thanks' },
              { text: 'Ecosystem', link: '/en/about/ecosystem' },
              { text: 'Contact Us', link: '/en/about/contact' }
            ]
          }
        ],
        footer: {
          message: 'Released under the MIT License',
          copyright: 'Copyright © 2024 MarSeventh'
        },
        editLink: {
          pattern: 'https://github.com/MarSeventh/CloudFlare-ImgBed-Docs/edit/main/src/:path',
          text: 'Edit this page on GitHub'
        },
        lastUpdated: {
          text: 'Last updated',
          formatOptions: {
            dateStyle: 'short',
            timeStyle: 'medium'
          }
        }
      }
    }
  },
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: '首页', link: '/' },
      { text: '文档', link: '/guide/introduction' },
      { text: '关于', link: '/about/contribute' }
    ],    
    sidebar: [
      {
        text: '项目速览',
        collapsed: false,
        items: [
          { text: '介绍', link: '/guide/introduction' },
          { text: '快速开始', link: '/guide/quick-start' },
          { text: '功能特性', link: '/guide/features' },
          { text: '更新日志', link: '/guide/update-log' },
          { text: '开发计划', link: '/guide/todolist' }
        ]
      },
      {
        text: '部署指南',
        collapsed: false,
        items: [
          { text: '前期准备', link: '/deployment/prerequisites' },
          { text: 'Cloudflare Pages 部署', link: '/deployment/pages' },
          { text: 'Cloudflare Workers 部署', link: '/deployment/worker' },
          { text: 'Docker 部署', link: '/deployment/docker' },
          { text: '手动部署', link: '/deployment/manual' },
          { text: '版本更新', link: '/deployment/update' },
          { text: '配置说明', link: '/deployment/configuration' }
        ]
      },
      {
        text: 'API 文档',
        collapsed: true,
        items: [
          { text: '基本介绍', link: '/api/index' },
          { text: '上传 API', link: '/api/upload' },
          { text: '读取 API', link: '/api/file' },
          { text: '删除 API', link: '/api/delete' },
          { text: '列出 API', link: '/api/list' },
          { text: '随机图 API', link: '/api/random' },
          { text: 'Token 管理 API', link: '/api/token' },
          { text: 'WebDAV', link: '/api/webdav' }
        ]
      },
      {
        text: 'Q&A',
        collapsed: true,
        items: [
          { text: '常见问题', link: '/qa/' }
        ]
      },
      {
        text: '关于',
        collapsed: false,
        items: [
          { text: '贡献', link: '/about/contribute' },
          { text: '致谢', link: '/about/thanks' },
          { text: '生态建设', link: '/about/ecosystem' },
          { text: '联系我们', link: '/about/contact' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/MarSeventh/CloudFlare-ImgBed' }
    ],

    footer: {
      message: '基于 MIT 许可发布',
      copyright: 'Copyright © 2024 MarSeventh'
    },

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/MarSeventh/CloudFlare-ImgBed-Docs/edit/main/src/:path',
      text: '在 GitHub 上编辑此页'
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    }
  }
})
