<script lang="ts" src="./AnimeStats.ts" />
<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols>
          <div class="text-h6 text-center">
            {{ currentUser.statistics.anime.count }}
            <div class="text-caption">
              {{ $t('pages.aniList.home.activities.statistics.totalAnime') }}
            </div>
          </div>
        </v-col>

        <v-col cols>
          <div class="text-h6 text-center">
            {{ daysWatched }}
            <div class="text-caption">
              {{ $t('pages.aniList.home.activities.statistics.daysWatched') }}
            </div>
          </div>
        </v-col>

        <v-col cols>
          <div class="text-h6 text-center">
            {{ animeMeanScore }}
            <div class="text-caption">
              {{ $t('pages.aniList.home.activities.statistics.meanScore') }}
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>