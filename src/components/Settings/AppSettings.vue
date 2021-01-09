<template>
  <v-container fluid class="py-0">
    <div class="headline">{{ $t('menus.settings.appSettings') }}</div>
    <v-row>
      <v-col cols="12" md="5" order="2">
        <v-row dense>
          <v-col cols="12">
            <v-switch
              v-model="_darkMode"
              :label="$t('pages.settings.appSettings.darkMode')"
              class="mt-0 pt-0"
              hide-details
              dense
            />
          </v-col>

          <v-col cols="12">
            <div class="text-subtitle-1 font-weight-bold">
              {{ $t('pages.settings.appSettings.navigationActiveItemColour') }}
            </div>
            <v-chip-group v-model="_navigationDrawerListItemColor" column mandatory active-class="primary--text">
              <v-chip small value="auto">
                <v-icon left small :color="darkMode ? 'white' : 'black'" v-text="'mdi-circle'" />
                {{ $t('misc.colours.automatic') }}
              </v-chip>
              <v-chip small value="black">
                <v-icon left small color="black" v-text="'mdi-circle'" />
                {{ $t('misc.colours.black') }}
              </v-chip>
              <v-chip small value="white">
                <v-icon left small color="white" v-text="'mdi-circle'" />
                {{ $t('misc.colours.white') }}
              </v-chip>
            </v-chip-group>
          </v-col>

          <v-col cols="12">
            <div class="text-subtitle-1 font-weight-bold">
              {{ $t('pages.settings.appSettings.navigationBackgroundBrightness') }}
            </div>
            <v-slider
              v-model="_brightness"
              thumb-label
              inverse-label
              hide-details
              :label="`${_brightness}%`"
              :min="0"
              :max="100"
            />
          </v-col>

          <v-col cols="12">
            <div class="text-subtitle-1 font-weight-bold">
              {{ $t('pages.settings.appSettings.navigationBackgroundBlurriness') }}
            </div>
            <v-slider
              v-model="_blurriness"
              thumb-label
              inverse-label
              hide-details
              :label="`${_blurriness}px`"
              :min="0"
              :max="20"
            />
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" md="7" order="1">
        <v-row dense>
          <v-col cols="12">
            <div class="text-subtitle-1 font-weight-bold">
              {{ $t('pages.settings.appSettings.chooseLanguage') }}
            </div>
            <v-select v-model="_language" :items="languages" hide-details menu-props="auto, offset-y" class="py-1 ma-0">
              <template #item="{ item }">
                <v-icon v-if="item.flag" :class="item.flag" :left="!$vuetify.rtl" :right="$vuetify.rtl" />
                {{ item.text }}
              </template>

              <template #selection="{ item }">
                <v-icon v-if="item.flag" :class="item.flag" :left="!$vuetify.rtl" :right="$vuetify.rtl" small />
                {{ item.text }}
              </template>
            </v-select>
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="_refreshRate"
              type="number"
              :min="5"
              :rules="[intervalRangeRule]"
              :label="$t('pages.settings.aniList.refreshRate')"
              :suffix="$t('pages.settings.aniList.refreshRateSuffix')"
              :hint="$t('pages.settings.aniList.refreshRateHint')"
              persistent-hint
            />
          </v-col>

          <v-col cols="12">
            <div class="text-subtitle-1 font-weight-bold">
              {{ $t('pages.settings.appSettings.initialListItemAmount') }}
            </div>
            <v-slider
              v-model="_initialListItemAmount"
              :label="`${_initialListItemAmount}`"
              thumb-label
              inverse-label
              hide-details
              :step="1"
              :min="5"
              :max="100"
            />
          </v-col>

          <v-col cols="12">
            <div class="text-subtitle-1 font-weight-bold">
              {{ $t('pages.settings.appSettings.listAnimationActivity.headline') }}
            </div>
            <div class="text-subtitle-2">{{ $t('pages.settings.appSettings.listAnimationActivity.subtitle') }}</div>
            <v-chip-group v-model="_forceDisableAnimationAmount" column mandatory active-class="primary--text">
              <v-chip filter small :value="-1">{{ $t('misc.status.disabled') }}</v-chip>
              <v-chip filter small :value="0">{{ $t('misc.status.all') }}</v-chip>
              <v-chip filter small :value="200">200</v-chip>
              <v-chip filter small :value="300">300</v-chip>
              <v-chip filter small :value="500">500</v-chip>
            </v-chip-group>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Getter } from '@/decorators';

@Component
export default class AppSettings extends Vue {
  @Getter('app') readonly darkMode!: boolean;
  @Getter('app') readonly language!: string;
  @Getter('app') readonly navigationDrawerListItemColor!: string;
  @Getter('app') readonly navigationDrawerBackgroundBrightness!: number;
  @Getter('app') readonly navigationDrawerBackgroundBlurriness!: number;
  @Getter('app') readonly listItemStartAmount!: number;
  @Getter('app') readonly listItemForceDisableAnimationAmount!: number;
  @Getter('userSettings') readonly refreshRate!: number;

  intervalRangeRule(value: string): boolean | string {
    const valAsNumber = Number(value);

    return valAsNumber && valAsNumber >= 5 && valAsNumber <= 300
      ? true
      : this.$t('pages.settings.aniList.refreshRateRule').toString();
  }

  get _darkMode(): boolean {
    return this.darkMode;
  }
  set _darkMode(value: boolean) {
    this.$store.commit('app/setDarkMode', value);
  }
  get _navigationDrawerListItemColor(): string {
    return this.navigationDrawerListItemColor;
  }
  set _navigationDrawerListItemColor(value: string) {
    this.$store.commit('app/setNavigationDrawerListItemColor', value);
  }

  _updateTimer: NodeJS.Timeout | null = null;
  get _brightness(): number {
    return this.navigationDrawerBackgroundBrightness;
  }
  set _brightness(value: number) {
    if (this.$data._updateTimer) {
      clearTimeout(this.$data._updateTimer);
    }
    this.$data._updateTimer = setTimeout(() => {
      this.$store.commit('app/setNavigationDrawerBackgroundBrightness', value);
    }, 250);
  }

  _blurUpdateTimer: NodeJS.Timeout | null = null;
  get _blurriness(): number {
    return this.navigationDrawerBackgroundBlurriness;
  }
  set _blurriness(value: number) {
    if (this.$data._blurUpdateTimer) {
      clearTimeout(this.$data._blurUpdateTimer);
    }
    this.$data._blurUpdateTimer = setTimeout(() => {
      this.$store.commit('app/setNavigationDrawerBackgroundBlurriness', value);
    }, 250);
  }

  get _language(): string {
    return this.language;
  }
  set _language(value: string) {
    this.$store.commit('app/setLanguage', value);
  }

  get languages(): Array<{ value: string; flag: string | null; text: string }> {
    const { messages } = this.$i18n;
    return Object.entries(messages).map(([key, value]) => {
      const locale = key;
      const original = value.originalReading.toString();
      const english = value.englishReading.toString();
      const flag = value.flag?.toString() || null;
      return {
        value: locale,
        flag: flag ? `flag-icon flag-icon-${flag}` : null,
        text: `${original} (${english})`,
      };
    });
  }

  get _initialListItemAmount(): number {
    return this.listItemStartAmount;
  }
  set _initialListItemAmount(value: number) {
    this.$store.commit('app/setListItemStartAmount', value);
  }

  get _forceDisableAnimationAmount(): number {
    return this.listItemForceDisableAnimationAmount;
  }
  set _forceDisableAnimationAmount(value: number) {
    this.$store.commit('app/setListItemForceDisableAnimationAmount', value);
  }

  get _refreshRate(): number {
    return this.refreshRate;
  }
  set _refreshRate(value: number) {
    if (!value || value < 5 || value > 300) {
      return;
    }

    this.$store.commit('userSettings/setRefreshRate', value);
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  grid-auto-rows: minmax(120px, auto);
}
</style>
