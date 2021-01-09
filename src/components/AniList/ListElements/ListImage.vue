<template>
  <v-img
    :src="imageLink"
    height="250px"
    position="50% 35%"
    class="pointerCursor"
    @click.native="moveToDetails(aniListId)"
  >
    <template v-slot:placeholder>
      <v-layout fill-height align-center justify-center ma-0>
        <v-progress-circular indeterminate color="grey lighten-5" />
      </v-layout>
    </template>
    <v-container v-if="name" class="fluid fill-height d-flex align-end py-0 anime-image-container">
      <v-row :class="`${darkMode ? 'shadowed' : 'lightened'} ${isMobile ? 'titled-mobile' : 'titled'}`">
        <v-col cols="12">
          <span class="title">{{ name }}</span>
        </v-col>
        <v-spacer v-if="concatenatedStudios.length" />
        <v-col v-if="concatenatedStudios.length" cols="12" align-self="end">
          <span class="grey--text" :class="{ 'text--darken-4': !darkMode }">{{ concatenatedStudios }}</span>
        </v-col>
      </v-row>
    </v-container>
  </v-img>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { RawLocation } from 'vue-router';
import { IAniListMediaStudio, IAniListMediaStudioNode } from '../../../types';

@Component
export default class ListImage extends Vue {
  @Prop(String)
  imageLink!: string;

  @Prop(Number)
  aniListId!: number;

  @Prop(String)
  name!: string;

  @Prop()
  studios!: IAniListMediaStudio;

  get darkMode(): boolean {
    return this.$vuetify.theme.dark;
  }

  get isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  get concatenatedStudios(): string {
    if (!this.studios || !this.studios.nodes || !this.studios.nodes.length) {
      return '';
    }

    let animationStudios = this.studios.nodes
      .filter((item: IAniListMediaStudioNode) => item.isAnimationStudio)
      .map((item: IAniListMediaStudioNode) => item.name);

    if (!animationStudios.length) {
      animationStudios = this.studios.nodes.map((item: IAniListMediaStudioNode) => item.name);
    }

    return animationStudios[0];
  }

  moveToDetails(id: number) {
    const aniListId = id.toString();
    const location: RawLocation = { name: 'DetailView', params: { id: aniListId } };
    this.$router.push(location);
  }
}
</script>

<style lang="scss" scoped>
.pointerCursor {
  cursor: pointer;
}

.anime-image-container {
  & .titled {
    &.shadowed {
      background-color: rgba(0, 0, 0, 0.65);
    }
    &.lightened {
      background-color: rgba(255, 255, 255, 0.85);
    }

    position: absolute;
    bottom: 9px;
    width: 100%;
    max-height: 19%;

    transition: 0.25s ease-in-out;
  }

  & .titled-mobile {
    &.shadowed {
      background-color: rgba(0, 0, 0, 0.65);
    }
    &.lightened {
      background-color: rgba(255, 255, 255, 0.85);
    }

    position: absolute;
    bottom: 9px;
    width: 100%;

    transition: 0.25s ease-in-out;
  }

  &:hover > .titled {
    max-height: 75%;

    &.shadowed {
      background-color: rgba(0, 0, 0, 0.85);
    }
    &.lightened {
      background-color: rgba(255, 255, 255, 0.95);
    }
  }
}
</style>
