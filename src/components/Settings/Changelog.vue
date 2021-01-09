<template>
  <v-container fluid class="py-0 force-ltr">
    <div class="text-h5 pb-4">
      {{ $t('menus.settings.changelog') }}
    </div>
    <v-expansion-panels accordion flat>
      <v-expansion-panel v-for="([version, text], idx) in renderedChangelogs" :key="`item_${idx}`">
        <v-expansion-panel-header>{{ version }}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <div class="changelog-wrapper" v-html="text" />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MarkdownIt from 'markdown-it';
import markdownChangelog from '@/../CHANGELOG.md';

@Component
export default class Changelog extends Vue {
  renderedChangelogs: [string, string][] = [];
  changelogs: string[] = [];

  created() {
    const md = new MarkdownIt({
      html: false,
      linkify: true,
      typographer: true,
    });

    const renderFunction = (tokens: any, idx: any, options: any, env: any, self: any) => {
      return self.renderToken(tokens, idx, options);
    };

    const defaultRender = md.renderer.rules.link_open || renderFunction;

    md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
      const aIndex = tokens[idx].attrIndex('target');

      if (aIndex < 0) {
        tokens[idx].attrPush(['target', '_blank']);
      } else {
        (tokens[idx].attrs as any)[aIndex][1] = '_blank';
      }

      return defaultRender(tokens, idx, options, env, self);
    };

    const changelogMap = new Map<string, string>();
    this.changelogs = markdownChangelog.split('---');
    this.changelogs.forEach((item) => {
      const matches = item.trim().match(/^##\s(v\d\.\d\.\d).*/);
      if (!matches?.length) {
        return;
      }

      const [, version] = matches;
      const textWithoutVersion = item.replace(`## ${version}`, '').trim();
      const rendered = md.render(textWithoutVersion);

      changelogMap.set(version, rendered);
    });

    this.renderedChangelogs = Array.from(changelogMap.entries());
  }
}
</script>

<style lang="scss">
.changelog-wrapper {
  padding: 0 8px;

  hr {
    margin: 20px 0;
  }

  details {
    summary {
      &:focus {
        outline: none;
      }
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
