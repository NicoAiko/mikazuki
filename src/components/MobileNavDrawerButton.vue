<template>
  <v-btn
    v-if="isMobile"
    top
    :left="!$vuetify.rtl"
    :right="$vuetify.rtl"
    color="info"
    fab
    fixed
    small
    @click="drawer = true"
  >
    <v-icon>mdi-menu</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from 'vue-property-decorator';
import { isMobile } from '@/decorators';

@Component
export default class MobileNavDrawerButton extends Vue {
  @PropSync('value', Boolean) drawer!: boolean;
  @isMobile({ iPadMobile: true }) readonly isMobile!: boolean;
}
</script>
