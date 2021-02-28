<script lang="ts" src="./Activity.ts" />
<style lang="scss" src="./Activity.scss"></style>
<template>
  <v-card class="card">
    <div class="image cover rounded" :style="`background-image: url(${activity.media.coverImage.extraLarge})`"></div>

    <div class="details d-flex flex-column">
      <v-card-title class="align-start">
        <v-img max-width="50" max-height="50" :src="activity.user.avatar.large" class="rounded-lg" />
        <span class="pl-2">{{ activity.user.name }}</span>

        <v-spacer />
        <div class="text-caption">
          {{ humanReadableCreatedAt }}
        </div>
      </v-card-title>

      <v-card-text>
        {{
          $t(`pages.aniList.home.activities.${translateStatus}`, [
            activity.media.title.userPreferred,
            activity.progress,
          ])
        }}
      </v-card-text>

      <v-spacer />

      <v-card-actions>
        <v-btn text :color="activity.isLiked ? 'pink' : ''" :loading="loadingLike" @click="onToggleLikeClick">
          <v-icon v-if="activity.isLiked" left>mdi-heart</v-icon>
          <v-icon v-else left>mdi-heart-outline</v-icon>

          {{ activity.likeCount }}
        </v-btn>

        <v-btn text :loading="loadingReply" @click="onReplyClick">
          <v-icon left>mdi-message-outline</v-icon>
          {{ activity.replyCount }}
        </v-btn>

        <v-btn text :color="activity.isSubscribed ? 'orange' : ''" :loading="loadingSubscribe">
          <v-icon v-if="activity.isSubscribed" left>mdi-bell</v-icon>
          <v-icon v-else left>mdi-bell-outline</v-icon>
          SUBSCRIBE
        </v-btn>
      </v-card-actions>
    </div>
  </v-card>
</template>
