<script lang="ts" src="./Home.ts"></script>
<style lang="scss" scoped src="./Home.scss"></style>
<template>
  <v-main>
    <div class="background" :style="backgroundStyles">
      <v-container fluid class="px-16 pb-4 pt-6">
        <v-row>
          <v-col cols="auto" align-self="center">
            <profile-image />
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-main>
</template>
