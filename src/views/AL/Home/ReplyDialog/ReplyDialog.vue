<script lang="ts" src="./ReplyDialog.ts" />
<template>
  <v-dialog max-width="1000" :value="show" @click:outside="onCancelClick" @keydown.esc="onCancelClick">
    <v-card v-if="activity">
      <v-card-title>
        Replies to {{ activity.user.name }}'s activity about {{ activity.media.title.userPreferred }}

        <v-spacer />

        {{ humanReadableCreatedAt }}
      </v-card-title>

      <v-card-text>
        <template v-if="!activity.replies.length"> Currently no replies </template>

        <reply v-for="reply in activity.replies" :key="reply.id" :reply="reply" />
      </v-card-text>

      <v-card-text>
        <v-textarea v-model="replyText" hide-details label="Reply text" placeholder="Write reply here..."></v-textarea>
      </v-card-text>

      <v-card-actions>
        <v-btn text @click="onCancelClick">Cancel</v-btn>
        <v-spacer />
        <v-btn text color="success" :disabled="!replyText.trim().length" @click="onSubmitClick">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
