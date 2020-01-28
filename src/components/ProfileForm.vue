<template>
  <div>
    <div v-if="!editable">
      <v-card elevation="0">
        <v-flex pa-4>
          <h2 class="font-weight-light mb-4">{{ profile.species }}</h2>
          <v-layout cols wrap class="infoblock">
            <v-flex xs12>
              <!-- name -->
              <p v-if="profile.name && profile.name != ''" class="label">name</p>
              <p v-if="profile.name && profile.name != ''">{{ profile.name }}</p>
              <!-- chip -->
              <p v-if="profile.chip && profile.chip != ''" class="label">chip</p>
              <p v-if="profile.chip && profile.chip != ''">{{ profile.chip }}</p>
              <!-- info -->
              <p v-if="profile.info != ''" class="label">Message</p>
              <p v-if="profile.info != ''">{{ profile.info }}</p>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-card>
    </div>
    <div v-if="editable">
      <v-flex>
        <p class="editlabel">Name</p>
        <v-text-field
          solo
          flat
          dense
          outlined
          clearable
          hide-details="auto"
          :value="profile.name"
          @change="setName($event)"
        ></v-text-field>
      </v-flex>
      <p class="editlabel">Species</p>
      <v-flex>
        <v-select
          solo
          flat
          dense
          outlined
          clearable
          hide-details="auto"
          :value="profile.species"
          @change="setSpecies($event)"
          :items="speciesList"
        ></v-select>
      </v-flex>
      <p class="editlabel">Chip number</p>
      <v-flex>
        <v-text-field
          solo
          flat
          dense
          outlined
          clearable
          hide-details="auto"
          :value="profile.chip"
          @change="setChip($event)"
        ></v-text-field>
      </v-flex>
      <p class="editlabel">Info</p>
      <v-flex>
        <v-textarea
          solo
          flat
          dense
          outlined
          clearable
          hide-details="auto"
          no-resize
          counter
          auto-grow
          :value="profile.info"
          @change="setInfo($event)"
        ></v-textarea>
      </v-flex>
    </div>
  </div>
</template>
<style scoped>
.label {
  color: gray;
  margin-bottom: -2px;
  font-size: 12px;
}
.editlabel {
  color: gray;
  margin-top: 8px;
  margin-bottom: -2px;
  font-size: 12px;
}
.infoblock {
  font-size: 18px;
}
</style>
<script>
import { mapState } from 'vuex'
import { mapMutations } from 'vuex'
import moment from 'moment'
export default {
  data() {
    return {}
  },
  methods: {
    ...mapMutations({
      setSpecies: 'profiles/setSpecies',
      setInfo: 'profiles/setInfo',
      setName: 'profiles/setName',
      setChip: 'profiles/setChip'
    })
  },
  computed: {
    ...mapState({
      speciesList: state => state.profiles.speciesList,
      profile: state => state.profiles.profile
    })
  },
  props: {
    editable: true
  },
  filters: {
    booltranlate(value) {
      return value == null ? 'unknown' : value ? 'yes' : 'no'
    }
  }
}
</script>
