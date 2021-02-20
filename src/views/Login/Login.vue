<script lang="ts" src="./Login.ts" />
<template>
  <v-main>
    <v-container class="fill-height grow justify-center">
      <v-card width="600">
        <v-card-title>Welcome to Mikazuki!</v-card-title>
        <v-card-subtitle>{{ $t('alerts.unauthenticated') }}</v-card-subtitle>
        <v-card-text>Click on Login below to navigate to AniList.co and authenticate to use Mikazuki.</v-card-text>

        <v-card-text>
          <v-btn color="primary darken-3" block @click="onLoginClick">
            <v-icon left>mdi-login</v-icon>
            {{ $t('actions.login') }}
          </v-btn>

          <v-container v-if="loginFailed">
            <v-alert type="error" text icon="mdi-alert-octagon-outline">
              <div>The app noticed that you tried to login.</div>
              <div>It seems that it failed! Please try again.</div>
              <div>
                If it still doesn't work, please try to reach out to our Discord or write an issue on our GitHub
                repository.
              </div>
            </v-alert>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-menu offset-y max-height="300">
            <template #activator="{ on }">
              <v-btn text v-on="on">
                <v-icon left>mdi-earth</v-icon>
                {{ $t('pages.settings.appSettings.chooseLanguage') }}
              </v-btn>
            </template>

            <v-list dense>
              <v-list-item
                v-for="(language, index) in languages"
                :key="index"
                dense
                :class="_language === language.value && 'v-list-item--active'"
                @click="onChangeLanguageClick(language)"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ language.title }}</v-list-item-title>
                  <v-list-item-subtitle>{{ language.subtitle }}</v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action v-if="_language === language.value">
                  <v-icon>mdi-check</v-icon>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-main>
</template>
