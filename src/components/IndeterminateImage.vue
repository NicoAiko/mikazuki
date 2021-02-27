<template>
  <v-img v-bind="{ ...$props, ...$attrs }">
    <template #placeholder>
      <div class="d-flex align-center justify-center fill-height">
        <v-progress-circular indeterminate color="grey lighten-5" />
      </div>
    </template>
  </v-img>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class IndeterminateImage extends Vue {}
</script>
