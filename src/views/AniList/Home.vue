<template>
  <v-main>
    <div class="d-flex flex-column">
      <v-card v-if="isAuthenticated" flat style="background: transparent">
        <v-card-text class="background" :style="`background-image: url(${currentUser.bannerImage})`">
          <v-container fluid>
            <v-row>
              <v-col cols="8" sm="6" md="4" lg="3" xl="2">
                <ProfileImage />
              </v-col>

              <v-col cols="4" sm="3" offset="0" offset-sm="2" offset-md="5" offset-lg="6" offset-xl="7">
                <v-img
                  class="pointer-on-hover"
                  :src="require('@/assets/logos/Ko-fi-Support-Button.png')"
                  @click="openSupportPage"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
      <v-container v-if="isAuthenticated" class="fill-height" style="flex-grow: 1" fluid>
        <v-card-text>
          <v-row>
            <v-col cols="12" xl="6">
              <Activities />
            </v-col>

            <v-col cols="12" xl="6">
              <v-row>
                <v-col cols="12" xl="6">
                  <v-card>
                    <v-card-text>
                      <v-row>
                        <v-col>
                          <div class="title text-center">
                            {{ currentUser.statistics.anime.count }}
                            <div class="caption">
                              {{ $t('pages.aniList.home.activities.statistics.totalAnime') }}
                            </div>
                          </div>
                        </v-col>

                        <v-col>
                          <div class="title text-center">
                            {{ daysWatched }}
                            <div class="caption">
                              {{ $t('pages.aniList.home.activities.statistics.daysWatched') }}
                            </div>
                          </div>
                        </v-col>

                        <v-col>
                          <div class="title text-center">
                            {{ animeMeanScore }}
                            <div class="caption">
                              {{ $t('pages.aniList.home.activities.statistics.meanScore') }}
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>

                    <v-card-actions class="grey px-4" :class="[$vuetify.theme.dark ? 'darken-4' : 'lighten-4']">
                      <v-row>
                        <v-col
                          cols="4"
                          v-for="(item, index) in animeSliderLabels"
                          :key="`anime_activity_slider_${index}`"
                          :class="{
                            'text-left': !$vuetify.rtl ? index === 0 : index === 2,
                            'text-center': index === 1,
                            'text-right': !$vuetify.rtl ? index === 2 : index === 0,
                          }"
                          class="my-0 py-0"
                        >
                          {{ item }}
                        </v-col>
                        <v-col cols="12" class="pb-0 mb-0">
                          <v-progress-linear height="12" rounded :value="animeDaysPercentage" />
                        </v-col>
                      </v-row>
                    </v-card-actions>
                  </v-card>
                </v-col>

                <v-col cols="12" xl="6">
                  <v-card>
                    <v-card-text>
                      <v-row>
                        <v-col>
                          <div class="title text-center">
                            {{ currentUser.statistics.manga.count }}
                            <div class="caption">
                              {{ $t('pages.aniList.home.activities.statistics.totalManga') }}
                            </div>
                          </div>
                        </v-col>

                        <v-col>
                          <div class="title text-center">
                            {{ currentUser.statistics.manga.chaptersRead }}
                            <div class="caption">
                              {{ $t('pages.aniList.home.activities.statistics.chaptersRead') }}
                            </div>
                          </div>
                        </v-col>

                        <v-col>
                          <div class="title text-center">
                            {{ mangaMeanScore }}
                            <div class="caption">
                              {{ $t('pages.aniList.home.activities.statistics.meanScore') }}
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>

                    <v-card-actions class="grey px-4" :class="[$vuetify.theme.dark ? 'darken-4' : 'lighten-4']">
                      <v-row>
                        <v-col
                          cols="4"
                          v-for="(item, index) in mangaSliderLabels"
                          :key="`manga_activity_slider_${index}`"
                          :class="{
                            'text-left': !$vuetify.rtl ? index === 0 : index === 2,
                            'text-center': index === 1,
                            'text-right': !$vuetify.rtl ? index === 2 : index === 0,
                          }"
                          class="my-0 py-0"
                        >
                          {{ item }}
                        </v-col>
                        <v-col cols="12" class="pb-0 mb-0">
                          <v-progress-linear height="12" rounded :value="chaptersReadPercentage" />
                        </v-col>
                      </v-row>
                    </v-card-actions>
                  </v-card>
                </v-col>

                <v-col cols="12">
                  <v-card>
                    <v-card-title>{{ $t('pages.aniList.home.activities.statistics.activityHistory') }}</v-card-title>

                    <v-card-text>
                      <v-sparkline
                        :value="activityHistoryValues"
                        :show-labels="true"
                        :gradient="['#2196f3']"
                        line-width="1"
                        smooth="5"
                        :label-size="4"
                        padding="12"
                        stroke-linecap="round"
                        type="bar"
                        :color="darkMode ? 'white' : 'black'"
                      >
                        <template v-slot:label="item">
                          {{ activityHistoryDates[item.index] }}: {{ item.value }}
                        </template>
                      </v-sparkline>
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12">
                  <v-card>
                    <v-card-title>{{ $t('pages.aniList.home.activities.statistics.genreOverview') }}</v-card-title>

                    <v-card-text>
                      <v-sparkline
                        :value="genreOverviewValues"
                        :show-labels="true"
                        :gradient="['#2196f3']"
                        line-width="1"
                        smooth="5"
                        label-size="3.5"
                        padding="12"
                        stroke-linecap="round"
                        type="bar"
                        :color="darkMode ? 'white' : 'black'"
                      >
                        <template v-slot:label="item">
                          {{ genreOverviewLabels[item.index] }}: {{ item.value }}
                        </template>
                      </v-sparkline>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-container>
      <v-card v-if="!isAuthenticated" style="flex-grow: 1" tile>
        <v-card-title primary-title>
          <div>
            <div class="headline">
              {{ $t('alerts.unauthenticated') }}
            </div>
            <span class="subheading">{{ $t('pages.aniList.home.howToAuthenticate.header') }}</span>
          </div>
        </v-card-title>
        <v-card-text>
          <div class="body-2">
            <p v-for="(item, index) in howToAuthenticateText" :key="index">
              {{ item }}
            </p>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-main>
</template>

<script lang="ts">
import moment from 'moment';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import Activities from '@/components/AniList/Activities.vue';
import ProfileImage from '@/components/AniList/ProfileImage.vue';
import { IAniListSession } from '@/types';

@Component({
  components: {
    Activities,
    ProfileImage,
  },
  computed: {
    ...mapGetters('app', ['darkMode']),
    ...mapGetters('userSettings', ['session', 'isAuthenticated']),
  },
})
export default class Home extends Vue {
  readonly darkMode!: boolean;
  readonly session!: IAniListSession;
  readonly isAuthenticated!: boolean;

  get currentUser() {
    return this.session.user;
  }

  get howToAuthenticateText() {
    const howToAuthenticate = this.$t('pages.aniList.home.howToAuthenticate.text');

    return howToAuthenticate.valueOf() as string[];
  }

  get genreOverviewValues() {
    return this.currentUser.statistics.anime.genres.slice(0, 10).map((item) => item.count);
  }

  get genreOverviewLabels() {
    return this.currentUser.statistics.anime.genres.slice(0, 10).map((item) => item.genre);
  }

  get activityHistoryItems() {
    const history = this.currentUser.stats.activityHistory;
    const timestamp = moment().subtract(15, 'days').unix();

    const relevantItems = history.filter((item) => item.date >= timestamp);

    if (relevantItems.length !== 15) {
      let dateSubstract = 1;
      while (dateSubstract <= 15) {
        const checkDate = moment().subtract(dateSubstract, 'days');
        const dateExists = relevantItems.some((item) => {
          const date = moment(item.date, 'X');

          return date.date() === checkDate.date();
        });

        if (!dateExists) {
          const index = relevantItems.findIndex((item) => {
            return moment(item.date, 'X').isAfter(checkDate);
          });
          if (index <= 0) {
            dateSubstract++;
            continue;
          }

          relevantItems.splice(index, 0, { date: checkDate.unix(), amount: 0, level: 1 });
        }

        dateSubstract++;
      }
    }

    return relevantItems;
  }

  get activityHistoryValues() {
    return this.activityHistoryItems.map((item) => item.amount);
  }

  get activityHistoryDates() {
    return this.activityHistoryItems.map((item) =>
      moment(item.date, 'X').format(this.$t('misc.dates.dayMonthNumeric') as string)
    );
  }

  get daysWatched() {
    const { minutesWatched } = this.currentUser.statistics.anime;

    return (minutesWatched / 1440).toFixed(1);
  }

  get animeDaysPercentage() {
    const { minutesWatched } = this.currentUser.statistics.anime;
    const daysWatched = minutesWatched / 1440;

    const over = daysWatched - this.getAnimeDaysWatchedMin;
    const under = this.getAnimeDaysWatchedMax - this.getAnimeDaysWatchedMin;

    return (over / under) * 100;
  }

  get chaptersReadPercentage() {
    const { chaptersRead } = this.currentUser.statistics.manga;

    const over = chaptersRead - this.getMangaChapterMin;
    const under = this.getMangaChapterMax - this.getMangaChapterMin;

    return (over / under) * 100;
  }

  get animeMeanScore() {
    const { meanScore } = this.currentUser.statistics.anime;

    return meanScore.toFixed(1);
  }

  get mangaMeanScore() {
    const { meanScore } = this.currentUser.statistics.manga;

    return meanScore.toFixed(1);
  }

  get getMangaChapterMax() {
    const { chaptersRead } = this.currentUser.statistics.manga;
    let closestThousand = 1000;

    while (closestThousand < chaptersRead) {
      closestThousand += 1000;
    }

    return closestThousand;
  }

  get getMangaChapterMiddle() {
    const { chaptersRead } = this.currentUser.statistics.manga;
    let closestThousand = 1000;

    while (closestThousand < chaptersRead) {
      closestThousand += 1000;
    }

    return closestThousand - 500;
  }

  get getMangaChapterMin() {
    const { chaptersRead } = this.currentUser.statistics.manga;

    if (chaptersRead <= 1000) {
      return 0;
    } else {
      let closestThousand = 1000;

      while (closestThousand < chaptersRead) {
        closestThousand += 1000;
      }

      return closestThousand - 1000;
    }
  }

  get getAnimeDaysWatchedMax() {
    const daysWatched = this.currentUser.statistics.anime.minutesWatched / 1440;

    if (daysWatched > 100 && daysWatched <= 500) {
      let closestHundred = 500;

      while (daysWatched / closestHundred < 1 && closestHundred !== 0) {
        closestHundred -= 100;
      }

      return closestHundred + 100;
    } else if (daysWatched > 500) {
      return daysWatched * 3;
    } else {
      return 100;
    }
  }

  get getAnimeDaysWatchedMiddle() {
    const daysWatched = this.currentUser.statistics.anime.minutesWatched / 1440;

    if (daysWatched > 100 && daysWatched <= 500) {
      let closestHundred = 500;

      while (daysWatched / closestHundred < 1 && closestHundred !== 0) {
        closestHundred -= 100;
      }

      return closestHundred + 50;
    } else if (daysWatched > 500) {
      return daysWatched;
    } else {
      return 50;
    }
  }

  get getAnimeDaysWatchedMin() {
    const daysWatched = this.currentUser.statistics.anime.minutesWatched / 1440;

    if (daysWatched > 100 && daysWatched <= 500) {
      let closestHundred = 500;

      while (daysWatched / closestHundred < 1 && closestHundred !== 0) {
        closestHundred -= 100;
      }

      return closestHundred;
    } else if (daysWatched > 500) {
      return 500;
    } else {
      return 0;
    }
  }

  get mangaSliderLabels() {
    return [this.getMangaChapterMin, this.getMangaChapterMiddle, this.getMangaChapterMax];
  }

  get animeSliderLabels() {
    return [this.getAnimeDaysWatchedMin, this.getAnimeDaysWatchedMiddle, this.getAnimeDaysWatchedMax];
  }

  openSupportPage(): void {
    window.open('https://ko-fi.com/nicoaiko', '_blank');
  }
}
</script>

<style lang="scss" scoped>
.background {
  background-size: cover;
}
.pointer-on-hover:hover {
  cursor: pointer;
}
</style>
