<script setup lang="ts">
import { withBase } from 'vitepress'

defineProps<{ caption: string }>()
</script>

<template>
  <!-- A decorative diagram; the supported providers are also listed as text below. -->
  <div class="home-visual" aria-hidden="true">
    <div class="visual-grid" />
    <div class="visual-orbit orbit-outer" />
    <div class="visual-orbit orbit-inner" />
    <svg class="visual-connections" viewBox="0 0 480 420" fill="none">
      <path d="M240 204 100 112M240 204 382 138M240 204 352 306" />
      <circle cx="154" cy="148" r="3" />
      <circle cx="323" cy="165" r="3" />
      <circle cx="300" cy="259" r="3" />
    </svg>
    <div class="visual-logo">
      <img :src="withBase('/logo.png')" alt="" width="124" height="124" fetchpriority="high" />
    </div>
    <div class="visual-node node-telegram">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="m20.7 4.2-3.2 15.1c-.2 1.1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.2.3-.4.5-.9.5l.4-5 9.1-8.2c.4-.4-.1-.6-.6-.2L5.1 13l-4.8-1.5c-1-.3-1-1 .2-1.5L19.3 2.8c.9-.3 1.7.2 1.4 1.4Z" /></svg>
      <span>Telegram</span>
    </div>
    <div class="visual-node node-r2"><span class="node-mark">R2</span><span>Cloudflare</span></div>
    <div class="visual-node node-s3"><span class="node-mark">S3</span><span>Storage</span></div>
    <div class="visual-caption"><span />{{ caption }}</div>
    <span class="visual-spark spark-one" />
    <span class="visual-spark spark-two" />
  </div>
</template>

<style scoped>
.home-visual {
  position: relative;
  width: 480px;
  height: 420px;
  flex: none;
}

.visual-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(var(--vp-c-divider) 1px, transparent 1px);
  background-size: 22px 22px;
  mask-image: radial-gradient(ellipse, #000 15%, transparent 68%);
}

.visual-orbit {
  position: absolute;
  top: 49%;
  left: 50%;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 13%, transparent);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.orbit-outer { width: 364px; height: 364px; }
.orbit-inner { width: 258px; height: 258px; border-style: dashed; }

.visual-connections { position: absolute; inset: 0; width: 100%; height: 100%; }
.visual-connections path { stroke: var(--vp-c-brand-1); stroke-opacity: .2; stroke-dasharray: 4 6; }
.visual-connections circle { fill: var(--vp-c-brand-1); opacity: .45; }

.visual-logo {
  position: absolute;
  top: 124px;
  left: 160px;
  display: grid;
  place-items: center;
  width: 160px;
  height: 160px;
  border: 1px solid color-mix(in srgb, var(--vp-c-bg) 80%, transparent);
  border-radius: 40px;
  background: color-mix(in srgb, var(--vp-c-bg) 76%, transparent);
  box-shadow: 0 24px 64px -20px #7765c23d, inset 0 0 24px #ffffff26;
  backdrop-filter: blur(12px);
  transform: rotate(-7deg);
  animation: logo-float 7s ease-in-out infinite;
}

.visual-logo img { object-fit: contain; transform: rotate(7deg); }

.visual-node {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 12px 16px;
  border: 1px solid color-mix(in srgb, var(--vp-c-divider) 80%, transparent);
  border-radius: 15px;
  color: var(--vp-c-text-1);
  background: color-mix(in srgb, var(--vp-c-bg) 88%, transparent);
  box-shadow: 0 8px 28px -12px #44396d24;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(8px);
}

.node-telegram { top: 87px; left: 24px; transform: rotate(-6deg); }
.node-telegram svg { width: 21px; height: 21px; color: #329ac5; }
.node-r2 { top: 112px; right: 11px; transform: rotate(5deg); }
.node-s3 { right: 37px; bottom: 83px; transform: rotate(-4deg); }
.node-mark { font-size: 15px; font-weight: 750; letter-spacing: -.5px; color: #c77a17; }
.node-s3 .node-mark { color: var(--vp-c-brand-1); }

.visual-caption {
  position: absolute;
  bottom: 22px;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  color: var(--vp-c-text-2);
  font-size: 12px;
  letter-spacing: .04em;
}

.visual-caption > span { width: 5px; height: 5px; border-radius: 50%; background: var(--vp-c-brand-1); }
.visual-spark { position: absolute; width: 6px; height: 6px; border-radius: 50%; background: #b696ed; }
.spark-one { left: 76px; bottom: 106px; }
.spark-two { top: 49px; right: 143px; width: 4px; height: 4px; background: #65bee0; }

@keyframes logo-float {
  0%, 100% { transform: translateY(0) rotate(-7deg); }
  50% { transform: translateY(-7px) rotate(-5deg); }
}

@media (prefers-reduced-motion: reduce) {
  .visual-logo { animation: none; }
}
</style>
