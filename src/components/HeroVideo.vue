<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const player = ref(null)
const pointerInside = ref(false)
const keyboardFocused = ref(false)
const autoplayBlocked = ref(false)
const fullscreen = ref(false)
const touchControls = window.matchMedia('(hover: none), (pointer: coarse)').matches
const connection = navigator.connection
// Choose once so resizing or rotating the screen does not restart the video.
const lightweight = window.matchMedia('(max-width: 760px)').matches
  || connection?.saveData
  || ['slow-2g', '2g'].includes(connection?.effectiveType)
const source = lightweight
  ? '/assets/company-introduction-web-720p-v1.mp4'
  : '/assets/company-introduction-web-1080p-v1.mp4'
const showControls = computed(() => pointerInside.value || keyboardFocused.value
  || touchControls || autoplayBlocked.value || fullscreen.value)

function revealControls(event) {
  if (event.pointerType !== 'touch') pointerInside.value = true
}

function updateFullscreen() {
  fullscreen.value = document.fullscreenElement === player.value
}

onMounted(() => {
  document.addEventListener('fullscreenchange', updateFullscreen)
  const video = player.value
  video.muted = true
  video.play().catch((error) => {
    // Keep native play controls available when the browser blocks autoplay.
    if (video.isConnected && error.name !== 'AbortError') autoplayBlocked.value = true
  })
})

onBeforeUnmount(() => document.removeEventListener('fullscreenchange', updateFullscreen))
</script>

<template>
  <video
    ref="player"
    class="hero-video"
    :src="source"
    poster="/assets/company-introduction.jpg"
    autoplay
    muted
    loop
    playsinline
    preload="auto"
    :controls="showControls"
    tabindex="0"
    :aria-label="locale === 'zh' ? '全品轩公司介绍视频' : 'Tripeer company introduction video'"
    @pointerenter="revealControls"
    @pointermove="revealControls"
    @pointerleave="pointerInside = false"
    @pointerdown="keyboardFocused = false"
    @focus="keyboardFocused = $event.target.matches(':focus-visible')"
    @keydown="keyboardFocused = true"
    @blur="keyboardFocused = false"
    @play="autoplayBlocked = false"
    @error="autoplayBlocked = true"
  >
    <a :href="source">{{ locale === 'zh' ? '下载公司介绍视频' : 'Download the company introduction video' }}</a>
  </video>
</template>
