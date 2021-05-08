<script lang="ts" src="./MangaStats.ts" />
<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols>
          <div class="text-h6 text-center">
            {{ currentUser.statistics.manga.count }}
            <div class="text-caption">
              {{ $t('pages.aniList.home.activities.statistics.totalManga') }}
            </div>
          </div>
        </v-col>

        <v-col cols>
          <div class="text-h6 text-center">
            {{ currentUser.statistics.manga.chaptersRead }}
            <div class="text-caption">
              {{ $t('pages.aniList.home.activities.statistics.chaptersRead') }}
            </div>
          </div>
        </v-col>

        <v-col cols>
          <div class="text-h6 text-center">
            {{ mangaMeanScore }}
            <div class="text-caption">
              {{ $t('pages.aniList.home.activities.statistics.meanScore') }}
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>