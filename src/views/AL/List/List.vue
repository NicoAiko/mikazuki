<script lang="ts" src="./List.ts" />
<template>
  <v-main>
    <v-container fluid>
      <v-row dense>
        <v-col cols="12" md="6" lg="4" xl="3" v-for="(listItem, index) in listData" :key="index">
          <list-item :item="listItem" />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
