<script lang="ts" src="./ProfileImage.ts"></script>
<template>
  <div class="flex flex-column fill-height">
    <v-card flat class="transparent">
      <v-avatar size="128">
        <v-img :src="avatarUrl" :alt="username">
          <template #placeholder>
            <div class="grow fill-height align-center justify-center">
              <v-progress-circular indeterminate color="grey lighten-5" />
            </div>
          </template>
        </v-img>
      </v-avatar>
    </v-card>

    <div class="text-h6 text-center">{{ username }}</div>
  </div>
</template>
