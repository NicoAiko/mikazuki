<script lang="ts" src="./Reply.ts" />
<template>
  <v-container fluid>
    <div class="text-h6">{{ reply.user.name }} writes ({{ humanReadableCreatedAt }}):</div>
    <blockquote class="blockquote" v-html="reply.text"></blockquote>
  </v-container>
</template>
