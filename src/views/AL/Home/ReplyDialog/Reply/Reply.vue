<script lang="ts" src="./Reply.ts" />
<template>
  <div>
    <v-card flat>
      <v-card-title class="pa-2">
        {{ reply.user.name }}
        <v-spacer />
        <span class="text-body-1">{{ humanReadableCreatedAt }}</span>
      </v-card-title>

      <v-card-text class="blockquote" v-html="reply.text"></v-card-text>
    </v-card>

    <v-divider />
  </div>
</template>
