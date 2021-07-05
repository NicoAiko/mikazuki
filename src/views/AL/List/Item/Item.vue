<script lang="ts" src="./Item.ts" />
<template>
  <v-card class="al-item">
    <div class="image cover rounded" :style="`background-image: url(${cover})`"></div>

    <div class="details">
      <div class="title text-h6">{{ title }}</div>

      <div class="episode grey--text text--lighten-1 text-body-2">
        {{ episodeText }}
      </div>

      <div class="score">
        <v-icon small>mdi-star</v-icon>
        <span class="pl-1" style="vertical-align: middle">{{ score }}</span>
      </div>

      <div class="yet text-body-2 teal--text text--lighten-3" v-if="missingEpisodes">
        <span>{{ $tc('pages.aniList.list.missingEpisodes', missingEpisodes) }}</span>
      </div>

      <div class="next text-body-2 teal--text text--lighten-3" v-if="nextEpisode">
        <span v-if="isAiring"><v-icon left color="success">mdi-antenna</v-icon></span>
        <span style="vertical-align: middle">{{ $t('pages.aniList.list.nextAiringEpisode', nextEpisode) }}</span>
      </div>

      <div class="bar" v-if="mediaProgress">
        <v-progress-linear rounded :value="mediaProgress" color="warning darken-3" background-opacity="0" />
      </div>

      <div class="bar">
        <v-progress-linear class="rounded" :value="userProgress" color="success" />
      </div>
    </div>
  </v-card>
</template>
<style lang="scss" scoped src="./Item.scss" />
