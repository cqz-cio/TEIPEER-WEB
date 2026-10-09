<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { PhPlay as Play } from '@phosphor-icons/vue'
import { midAutumn2026, midAutumnAssets } from '../content/mid-autumn-2026.js'

const { locale } = useI18n()
const story = computed(() => midAutumn2026[locale.value] || midAutumn2026.zh)
const video = ref(null)
const hasPlayed = ref(false)
const playbackFailed = ref(false)

async function playVideo() {
  playbackFailed.value = false
  try {
    await video.value?.play()
  } catch (error) {
    if (error.name !== 'AbortError') playbackFailed.value = true
  }
}

function onPlay() {
  hasPlayed.value = true
  playbackFailed.value = false
}
</script>

<template>
  <article class="knowledge-shell mid-autumn-story" aria-labelledby="mid-autumn-title">
    <div class="mid-autumn-layout">
      <header class="mid-autumn-heading">
        <p class="mid-autumn-category">{{ story.category }}</p>
        <h2 id="mid-autumn-title">{{ story.title }}</h2>
        <p class="mid-autumn-subtitle">{{ story.subtitle }}</p>
      </header>

      <p class="mid-autumn-intro">{{ story.intro }}</p>

      <figure class="mid-autumn-video">
        <div class="mid-autumn-player">
          <video
            ref="video"
            :src="midAutumnAssets.video"
            :poster="midAutumnAssets.videoPoster"
            :aria-label="story.videoLabel"
            width="720"
            height="1280"
            controls
            playsinline
            preload="none"
            @play="onPlay"
            @error="playbackFailed = true"
          >
            <a :href="midAutumnAssets.video">{{ story.openVideo }}</a>
          </video>
          <button
            v-if="!hasPlayed && !playbackFailed"
            type="button"
            class="mid-autumn-play"
            :aria-label="story.playLabel"
            @click="playVideo"
          ><Play :size="38" weight="fill" aria-hidden="true" /></button>
        </div>
        <figcaption>{{ hasPlayed ? story.videoPlayingCaption : story.videoCaption }}</figcaption>
        <p v-if="playbackFailed" class="mid-autumn-video-error" role="status">
          {{ story.videoError }} <a :href="midAutumnAssets.video">{{ story.openVideo }}</a>
        </p>
      </figure>

      <div class="mid-autumn-body">
        <section class="mid-autumn-section" aria-labelledby="mid-autumn-gathering">
          <h3 id="mid-autumn-gathering">{{ story.gatheringTitle }}</h3>
          <p>{{ story.gathering }}</p>
        </section>
        <section class="mid-autumn-section" aria-labelledby="mid-autumn-games">
          <h3 id="mid-autumn-games">{{ story.gamesTitle }}</h3>
          <p>{{ story.gamesIntro }}<strong>{{ story.riddlesLabel }}</strong>{{ story.riddles }}</p>
          <p><strong>{{ story.seedsLabel }}</strong>{{ story.seeds }}<strong>{{ story.ringsLabel }}</strong>{{ story.rings }}</p>
        </section>
        <section class="mid-autumn-section" aria-labelledby="mid-autumn-together">
          <h3 id="mid-autumn-together">{{ story.togetherTitle }}</h3>
          <p>{{ story.together }}</p>
        </section>
      </div>
    </div>

    <section class="mid-autumn-closing" aria-labelledby="mid-autumn-closing-title">
      <figure class="mid-autumn-poster">
        <img :src="midAutumnAssets.festivalPoster" :alt="story.posterAlt" width="941" height="1672" loading="lazy" decoding="async" />
        <figcaption>{{ story.posterCaption }}</figcaption>
      </figure>
      <div class="mid-autumn-wishes">
        <h3 id="mid-autumn-closing-title">{{ story.closingTitle }}</h3>
        <p>{{ story.closing }}</p>
        <p>{{ story.future }}</p>
        <p class="mid-autumn-blessing">{{ story.wishes }}</p>
      </div>
    </section>
  </article>
</template>

<style scoped>
.mid-autumn-story { padding-block: 56px 12px; }
.mid-autumn-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(0, 1fr);
  grid-template-areas: 'heading video' 'intro video' 'body video';
  column-gap: 52px;
  row-gap: 28px;
  align-items: start;
}
.mid-autumn-heading { grid-area: heading; }
.mid-autumn-category { margin: 0 0 16px; color: var(--orange-dark); font-size: 16px; font-weight: 650; }
.mid-autumn-heading h2 { margin: 0; color: var(--navy); font-size: clamp(32px, 3.6vw, 52px); font-weight: 750; line-height: 1.3; letter-spacing: -.025em; }
.mid-autumn-subtitle { margin: 12px 0 0; color: #526074; font-size: clamp(20px, 2.12vw, 30px); line-height: 1.5; }
.mid-autumn-heading::after { content: ''; display: block; width: 40px; height: 3px; margin-top: 26px; background: var(--orange); }
.mid-autumn-intro { grid-area: intro; margin: 0; }
.mid-autumn-intro,
.mid-autumn-body p { color: #526074; font-size: 20px; line-height: 1.95; overflow-wrap: anywhere; }
.mid-autumn-body { grid-area: body; display: grid; gap: 38px; }
.mid-autumn-section h3 { margin: 0 0 18px; padding-left: 22px; border-left: 4px solid var(--orange); color: var(--navy); font-size: 28px; font-weight: 750; line-height: 1.3; }
.mid-autumn-section p { margin: 0; }
.mid-autumn-section p + p { margin-top: 24px; }
.mid-autumn-section strong { color: #26354d; font-weight: 700; }
.mid-autumn-video { grid-area: video; min-width: 0; width: 100%; margin: 40px 0 0; }
.mid-autumn-player { position: relative; width: 100%; background: #172033; }
.mid-autumn-player video { display: block; width: 100%; height: auto; aspect-ratio: 9 / 16; object-fit: contain; }
.mid-autumn-player video:fullscreen { width: 100%; height: 100%; background: #000; }
.mid-autumn-play { position: absolute; left: 50%; top: 50%; display: grid; place-items: center; width: 88px; height: 88px; padding: 0 0 0 5px; transform: translate(-50%, -50%); border: 3px solid #fff; border-radius: 50%; color: #fff; background: rgba(14, 24, 40, .24); box-shadow: 0 2px 16px rgba(0, 0, 0, .15); transition: background .2s ease; }
.mid-autumn-play:hover { background: rgba(14, 24, 40, .55); }
.mid-autumn-play:focus-visible { outline: 3px solid var(--orange); outline-offset: 5px; }
.mid-autumn-video figcaption,
.mid-autumn-poster figcaption { margin-top: 14px; color: #637085; font-size: 17px; line-height: 1.6; text-align: center; }
.mid-autumn-video-error { margin: 14px 0 0; color: #526074; font-size: 15px; }
.mid-autumn-video-error a { color: var(--navy); text-decoration: underline; }
.mid-autumn-closing { display: grid; grid-template-columns: minmax(220px, .88fr) minmax(0, 1.35fr); align-items: center; gap: 9%; margin-top: 42px; padding: 42px 6%; background: #f5f7fa; }
.mid-autumn-poster { min-width: 0; margin: 0; }
.mid-autumn-poster img { width: 100%; height: auto; }
.mid-autumn-wishes h3 { margin: 0 0 46px; color: var(--navy); font-size: clamp(28px, 3vw, 44px); font-weight: 750; line-height: 1.4; }
.mid-autumn-wishes h3::before { content: ''; display: block; width: 56px; height: 4px; margin-bottom: 32px; background: var(--orange); }
.mid-autumn-wishes p { margin: 0; color: #526074; font-size: 21px; line-height: 1.95; }
.mid-autumn-wishes p + p { margin-top: 38px; }
.mid-autumn-wishes .mid-autumn-blessing { color: #c84e00; font-weight: 650; }

@media (max-width: 1100px) and (min-width: 761px) {
  .mid-autumn-layout { column-gap: 34px; row-gap: 24px; }
  .mid-autumn-category { font-size: 14px; }
  .mid-autumn-intro, .mid-autumn-body p { font-size: 17px; }
  .mid-autumn-section h3 { font-size: 23px; padding-left: 16px; }
  .mid-autumn-body { gap: 30px; }
  .mid-autumn-closing { gap: 6%; padding: 34px 5%; }
  .mid-autumn-wishes h3 { margin-bottom: 26px; font-size: 30px; }
  .mid-autumn-wishes p { font-size: 17px; }
  .mid-autumn-wishes p + p { margin-top: 24px; }
}

@media (max-width: 760px) {
  .mid-autumn-story { padding-block: 28px 8px; }
  .mid-autumn-layout { grid-template-columns: minmax(0, 1fr); grid-template-areas: 'heading' 'intro' 'video' 'body'; gap: 24px; }
  .mid-autumn-category { margin-bottom: 12px; font-size: 14px; }
  .mid-autumn-heading h2 { font-size: 29px; line-height: 1.4; }
  .mid-autumn-subtitle { margin-top: 10px; font-size: 19px; line-height: 1.55; }
  .mid-autumn-heading::after { width: 32px; margin-top: 20px; }
  .mid-autumn-intro, .mid-autumn-body p { font-size: 16px; line-height: 1.9; }
  .mid-autumn-video { width: min(100%, 282px); margin: 0 auto; }
  .mid-autumn-play { width: 64px; height: 64px; border-width: 2px; }
  .mid-autumn-play svg { width: 28px; height: 28px; }
  .mid-autumn-video figcaption, .mid-autumn-poster figcaption { margin-top: 10px; font-size: 14px; }
  .mid-autumn-body { gap: 30px; }
  .mid-autumn-section h3 { margin-bottom: 15px; padding-left: 14px; border-left-width: 3px; font-size: 22px; }
  .mid-autumn-section p + p { margin-top: 20px; }
  .mid-autumn-closing { grid-template-columns: minmax(0, 1fr); gap: 30px; margin-top: 32px; padding: 24px 20px 30px; }
  .mid-autumn-poster { width: min(100%, 282px); margin-inline: auto; }
  .mid-autumn-wishes h3 { margin-bottom: 24px; font-size: 25px; }
  .mid-autumn-wishes h3::before { width: 36px; height: 3px; margin-bottom: 18px; }
  .mid-autumn-wishes p { font-size: 16px; line-height: 1.9; }
  .mid-autumn-wishes p + p { margin-top: 24px; }
}

@media (max-width: 360px) {
  .mid-autumn-heading h2 { font-size: 26px; }
  .mid-autumn-subtitle { font-size: 18px; }
  .mid-autumn-section h3 { font-size: 20px; }
  .mid-autumn-closing { padding-inline: 16px; }
}
</style>
