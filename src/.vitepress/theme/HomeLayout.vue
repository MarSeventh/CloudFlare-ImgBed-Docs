<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import HomeVisual from './HomeVisual.vue'

const { lang } = useData()
const copy = computed(() => lang.value.startsWith('en') ? {
  eyebrow: 'OPEN SOURCE. YOUR OWN SPACE.',
  benefits: ['Self-hosted', 'Multiple storage channels', 'Made for sharing'],
  storage: 'YOUR STORAGE, CONNECTED',
  featuresLabel: 'THOUGHTFULLY CONNECTED',
  featuresTitle: 'From upload to sharing. All in one place.',
  featuresDescription: 'A flexible home for your files, with the tools to keep everything in order.',
  allFeatures: 'Explore all features',
  closingLabel: 'MAKE ROOM FOR YOUR NEXT MOMENT',
  closingTitle: 'Your files. Your space. Your way.',
  closingDescription: 'Choose your storage and start building your own file hosting space.',
  closingAction: 'Get started',
  guide: '/en/guide/quick-start',
  features: '/en/guide/features',
  visual: 'Every moment, connected.'
} : {
  eyebrow: '开源，自在，属于你。',
  benefits: ['自主部署', '多渠道存储', '随心分享'],
  storage: '连接你熟悉的存储',
  featuresLabel: 'THOUGHTFULLY CONNECTED',
  featuresTitle: '从上传到分享，一切井然有序。',
  featuresDescription: '灵活的存储，顺手的管理，让每一份文件都有自己的位置。',
  allFeatures: '探索全部功能',
  closingLabel: 'MAKE ROOM FOR YOUR NEXT MOMENT',
  closingTitle: '你的文件，你的空间，你来定义。',
  closingDescription: '选择喜欢的存储方式，开始搭建属于自己的文件托管空间。',
  closingAction: '即刻开始',
  guide: '/guide/quick-start',
  features: '/guide/features',
  visual: '每一份精彩，自在相连。'
})

const providers: { name: string; icon: string; darkIcon?: string }[] = [
  { name: 'Telegram', icon: 'telegram' },
  { name: 'Cloudflare R2', icon: 'cloudflare' },
  { name: 'S3', icon: 'aws', darkIcon: 'aws-dark' },
  { name: 'Discord', icon: 'discord' },
  { name: 'Hugging Face', icon: 'hugging-face' },
  { name: 'WebDAV', icon: 'webdav' }
]
</script>

<template>
  <DefaultTheme.Layout>
    <template #home-hero-info-before>
      <p class="home-eyebrow"><span aria-hidden="true" />{{ copy.eyebrow }}</p>
    </template>

    <template #home-hero-image>
      <HomeVisual :caption="copy.visual" />
    </template>

    <template #home-hero-actions-after>
      <ul class="home-benefits" :aria-label="lang.startsWith('en') ? 'Highlights' : '产品亮点'">
        <li v-for="benefit in copy.benefits" :key="benefit">
          <svg aria-hidden="true" viewBox="0 0 16 16"><path d="m4 8 2.5 2.5L12 5" /></svg>
          {{ benefit }}
        </li>
      </ul>
    </template>

    <template #home-features-before>
      <div class="home-section-wrap">
        <div class="home-storage">
          <p>{{ copy.storage }}</p>
          <ul>
            <li v-for="provider in providers" :key="provider.icon">
              <span class="home-storage-icon" :class="`storage-icon-${provider.icon}`" aria-hidden="true">
                <img
                  class="home-storage-logo"
                  :class="{ 'home-storage-logo-light': provider.darkIcon }"
                  :src="withBase(`/images/providers/${provider.icon}.svg`)"
                  alt=""
                  width="24"
                  height="24"
                />
                <img
                  v-if="provider.darkIcon"
                  class="home-storage-logo home-storage-logo-dark"
                  :src="withBase(`/images/providers/${provider.darkIcon}.svg`)"
                  alt=""
                  width="24"
                  height="24"
                />
              </span>
              <span>{{ provider.name }}</span>
            </li>
          </ul>
        </div>
        <div class="home-section-heading">
          <div>
            <p class="home-section-label">{{ copy.featuresLabel }}</p>
            <h2>{{ copy.featuresTitle }}</h2>
            <p class="home-section-description">{{ copy.featuresDescription }}</p>
          </div>
          <a class="home-text-link" :href="withBase(copy.features)">
            {{ copy.allFeatures }} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </template>

    <template #home-features-after>
      <div class="home-section-wrap">
        <section class="home-closing">
          <div>
            <p class="home-section-label">{{ copy.closingLabel }}</p>
            <h2>{{ copy.closingTitle }}</h2>
            <p>{{ copy.closingDescription }}</p>
          </div>
          <a class="home-start-link" :href="withBase(copy.guide)">
            {{ copy.closingAction }} <span aria-hidden="true">→</span>
          </a>
        </section>
      </div>
    </template>
  </DefaultTheme.Layout>
</template>
