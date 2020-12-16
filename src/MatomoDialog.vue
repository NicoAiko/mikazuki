<template>
  <v-dialog :value="true" persistent max-width="800">
    <v-card>
      <v-card-title>{{ $t('dataPrivacy.headline') }}</v-card-title>

      <v-card-text class="pb-0">
        <v-btn text @click="switchVersion">
          <v-icon left>{{ englishVersion ? 'mdi-chevron-down' : 'mdi-chevron-right' }}</v-icon>
          ENGLISH
        </v-btn>

        <v-btn text @click="switchVersion">
          <v-icon left>{{ germanVersion ? 'mdi-chevron-down' : 'mdi-chevron-right' }}</v-icon>
          DEUTSCH
        </v-btn>
      </v-card-text>

      <v-expand-transition>
        <v-card-text v-show="englishVersion">
          <blockquote class="blockquote">
            Mikazuki is not obliged but wants to inform the user that certain data is saved on their device for the
            application to work.<br />
            Mikazuki also wants to collect certain <span class="font-italic">anonymised</span> data from you which you
            can deny!<br /><br />

            This includes solely the following points:
            <v-list>
              <v-list-item>Country (Can be denied by opting out.)</v-list-item>
              <v-list-item>First visit or revisit of the page (Can be denied by opting out.)</v-list-item>
              <v-list-item
                >Used pages on Mikazuki and amount of time spent here (Can be denied by opting out.)</v-list-item
              >
              <v-list-item>Web Browser (incl. Version of Browser) (Mandatory data)</v-list-item>
              <v-list-item>Operating System (Mandatory data)</v-list-item>
            </v-list>

            In the hopeful case you allow Mikazuki to collect usage data, you will receive a cookie so Mikazuki knows
            that you've already given your consent.<br /><br />

            Now, there might be the question to why Mikazuki wants to collect this data?<br />
            The answer is easy.<br />
            Statistics about usages. Right now, Mikazuki can't measure, how many people use Mikazuki as well as the
            amount of time users spend on Mikazuki.<br /><br />
            This data will help Mikazuki to prioritize and improve tasks to improve Mikazuki as a whole.<br />
            You are free to decline consent to this <span class="font-italic">anonymised</span> collection of data.<br /><br />

            Your data is NOT being sold or used in any way but collection for statistics.
          </blockquote>

          <blockquote class="blockquote">
            For clarification: Mandatory data is not saved by Mikazuki (or nicoaiko.de) but the Web hoster.<br />
            For additional data, please read the Data Privacy information on
            <a href="https://www.mikazuki.moe/#/privacy">https://www.mikazuki.moe/#/privacy</a>
          </blockquote>
        </v-card-text>
      </v-expand-transition>

      <v-expand-transition>
        <v-card-text v-show="germanVersion">
          <blockquote class="blockquote">
            Mikazuki möchte den Benutzer darauf hinweisen, dass, damit die Applikation voll funktionstüchtig ist, Daten
            im Browser-Speicher (Local Storage) gespeichert werden.<br />
            Mikazuki möchte ebenfalls bestimmte <span class="font-italic">anonymisierte</span> Daten speichern. Dies
            können Sie ablehnen!<br /><br />

            Folgende Daten möchte, oder wird, Mikazuki sammeln:
            <v-list>
              <v-list-item>Land (Kann über Opt-Out abgelehnt werden.)</v-list-item>
              <v-list-item>Erster Besuch oder Wiederbesuch der Seite (Kann über Opt-Out abgelehnt werden.)</v-list-item>
              <v-list-item
                >Benutzte Mikazuki-Seiten und verbrachte Zeit (Kann über Opt-Out abgelehnt werden.)</v-list-item
              >
              <v-list-item>Internet-Browser (sowie Version des Browsers) (Standard-Daten)</v-list-item>
              <v-list-item>Betriebssystem (Standard-Daten)</v-list-item>
            </v-list>

            In der Hoffnung, dass Sie Mikazuki erlauben, die oben genannten Daten zu sammeln, erhalten Sie einen
            Browser-Cookie, damit Mikazuki weiß, dass Sie die Seite bereits einmal besucht haben und ihre Erlaubnis zur
            Datensammlung erteilt/verweigert haben.<br /><br />

            Nun stellt sich die Frage, warum Mikazuki überhaupt Daten sammeln möchte?<br />
            Die Antwort ist leicht.<br />
            Zum Anlegen von Statistiken. Aktuell kann Mikazuki nur in geringen Maßen Statistiken aufstellen, wie viele
            Benutzer Mikazuki tatsächlich hat und wie viel Zeit Benutzer auf Mikazuki verbringen.<br /><br />
            Diese Daten sollen Mikazuki helfen, neue Anforderungen und Aufgaben besser zu priorisieren und Abläufe,
            sowie Mikazuki selbst zu verbessern.<br />
            Sie können der Sammlung dieser <span class="font-italic">anonymisierten</span> Daten (Daten, die mit Opt-Out
            beschrieben sind!) widersprechen.<br /><br />

            Ihre Daten werden weder verkauft noch sonst in einer Art verwendet, außer zur Verbesserung und Aufstellung
            von Statistiken über Mikazuki.
          </blockquote>

          <blockquote class="blockquote">
            Zur Klarheit: Oben als "Standard-Daten" angegebene Punkte werden nicht von Mikazuki selbst, sondern vom
            Web-Hoster, über den Mikazuki.moe läuft, erhoben. Für weitere Informationen zum Datenschutz von
            Mikazuki.moe, besuchen Sie bitte
            <a href="https://www.mikazuki.moe/#/privacy">https://www.mikazuki.moe/#/privacy</a>.
          </blockquote>
        </v-card-text>
      </v-expand-transition>

      <v-card-actions>
        <v-btn color="success" block @click="giveConsent">
          <v-icon left>mdi-check</v-icon>
          {{ $t('dataPrivacy.acceptAll') }}
        </v-btn>
      </v-card-actions>

      <v-card-actions>
        <v-btn color="secondary" block @click="denyConsent">
          <v-icon left>mdi-close</v-icon>
          {{ $t('dataPrivacy.onlyMandatory') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class MatomoDialog extends Vue {
  englishVersion = true;
  germanVersion = false;

  switchVersion() {
    if (this.englishVersion) {
      this.englishVersion = !this.englishVersion;
      setTimeout(() => (this.germanVersion = !this.englishVersion), 500);
    } else {
      this.germanVersion = !this.germanVersion;
      setTimeout(() => (this.englishVersion = !this.germanVersion), 500);
    }
  }

  giveConsent() {
    try {
      this.$matomo.rememberConsentGiven();
      this.$matomo.trackPageView();
      this.$store.commit('userSettings/setMatomoConsent', true);
    } catch (e) {
      alert('Consent could not be given! Please check your AdBlocker data and allow [piwik.]nicoaiko.de as source!');
    }
  }

  denyConsent() {
    this.$store.commit('userSettings/setMatomoConsent', false);
  }
}
</script>
