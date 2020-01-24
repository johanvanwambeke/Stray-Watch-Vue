<template>
  <div>
    <div v-if="!editable">
      <v-card elevation="0">
        <v-flex pa-4>
          <h2 class="font-weight-light mb-4">{{ age }} {{ animal }}</h2>
          <v-layout cols wrap class="infoblock">
            <v-flex xs6>
              <p class="label" v-if="urgency != ''">urgency</p>
              <p class="font-weight-thin" v-if="urgency != ''">{{ urgency }}</p>
              <p v-if="behavior != ''" class="label">behavior</p>
              <p v-if="behavior != ''">{{ behavior }}</p>
              <p v-if="needs != ''" class="label">needs</p>
              <p class="body-2" v-if="needs != ''">{{ needs }}</p>
              <p v-if="captureStatus && captureStatus != ''" class="label">capture status</p>
              <p v-if="captureStatus && captureStatus != ''">{{ captureStatus }}</p>
              <p v-if="info != ''" class="label">Message</p>
              <p v-if="info != ''">{{ info }}</p>
            </v-flex>
            <v-flex xs6>
              <div v-if="needs == 'capture'">
                <p v-if="chip && chip != ''" class="label">chip</p>
                <p v-if="chip && chip != ''">{{ chip }}</p>
                <p v-if="color && color != ''" class="label">color</p>
                <p v-if="color && color != ''">{{ color }}</p>
                <p v-if="sterile" class="label">sterile</p>
                <p v-if="sterile">{{ sterile | booltranlate }}</p>
                <p v-if="vaccinated" class="label">vaccinated</p>
                <p v-if="vaccinated">{{ vaccinated | booltranlate }}</p>
                <p v-if="eartip" class="label">eartip</p>
                <p v-if="eartip">{{ eartip | booltranlate }}</p>
                <!-- <p class="label">healthCheck</p>
                <p>{{ healthCheck }}</p>-->
              </div>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-card>
    </div>
    <div v-if="editable">
      <v-flex>
        <v-select clearable dense flat solo v-model="species" :items="speciesList" label="Species"></v-select>
      </v-flex>
      <v-flex>
        <v-select clearable dense flat solo v-model="age" :items="ageLst" label="age"></v-select>
      </v-flex>
      <v-flex v-if="needs == 'medical'">
        <v-select
          clearable
          dense
          flat
          solo
          multiple
          chips
          v-model="medical"
          :items="medicalLst"
          label="Ailment"
        ></v-select>
      </v-flex>
      <v-flex>
        <v-select clearable dense flat solo v-model="urgency" :items="urgencyLst" label="Urgency"></v-select>
      </v-flex>
      <v-flex>
        <v-select
          clearable
          dense
          flat
          solo
          v-model="behavior"
          :items="behaviorLst"
          label="Behavior"
        ></v-select>
      </v-flex>
      <v-flex>
        <v-select clearable dense flat solo v-model="needs" :items="needsLst" label="Purpose"></v-select>
      </v-flex>
      <div
        v-if="needs == 'capture'"
        style="padding-left:20px;border-left:1px solid lightgrey;margin-bottom:20px"
      >
        <v-flex>
          <v-text-field v-model="chip" label="Chip"></v-text-field>
        </v-flex>
        <v-flex>
          <v-text-field v-model="color" label="Color"></v-text-field>
        </v-flex>
        <v-flex>
          <v-select
            clearable
            dense
            flat
            solo
            v-model="captureStatus"
            :items="captureStatusLst"
            label="Capture status"
          ></v-select>
        </v-flex>
        <!-- sterile -->
        <v-layout cols wrap>
          <v-flex xs6>
            <v-switch v-model="sterileDef" label="Sterilisation status is known"></v-switch>
          </v-flex>
          <v-flex xs6>
            <v-checkfilled
              v-if="sterileDef"
              :indeterminate="!sterileDef"
              v-model="sterile"
              label="Is sterile"
            ></v-checkfilled>
          </v-flex>
        </v-layout>
        <!-- vaccinated -->
        <v-layout cols wrap>
          <v-flex xs6>
            <v-switch v-model="vaccinatedDef" label="Vaccination status is known"></v-switch>
          </v-flex>
          <v-flex xs6>
            <v-checkfilled
              v-if="vaccinatedDef"
              :indeterminate="!vaccinatedDef"
              v-model="vaccinated"
              label="Is vaccinated"
            ></v-checkfilled>
          </v-flex>
        </v-layout>
        <!-- eartip -->
        <v-layout cols wrap>
          <v-flex xs6>
            <v-switch v-model="eartipDef" label="Eartip cut status is known"></v-switch>
          </v-flex>
          <v-flex xs6>
            <v-checkfilled
              v-if="eartipDef"
              :indeterminate="!eartipDef"
              v-model="eartip"
              label="The eartip is cut"
            ></v-checkfilled>
          </v-flex>
        </v-layout>
        <!-- healthCheck -->
        <!-- <v-layout cols wrap>
     <v-flex xs6>
      <v-switch v-model="healthcheckBit" label="Did healthcheck"></v-switch>
     </v-flex>
     <v-flex xs6>
      <v-date-picker v-model="healthCheck"></v-date-picker>
     </v-flex>
        </v-layout>-->
      </div>
      <v-flex>
        <v-textarea
          filled
          clearable
          counter
          dense
          no-resize
          auto-grow
          label="More info"
          v-model="info"
        ></v-textarea>
      </v-flex>
      <!-- <v-btn @click="getProfileAnimal"></v-btn> -->
    </div>
  </div>
</template>
<style scoped>
.label {
  color: gray;
  margin-bottom: -2px;
  font-size: 12px;
}
.infoblock {
  font-size: 18px;
}
</style>
<script>
import { mapState } from 'vuex'
import moment from 'moment'
export default {
  data() {
    return {
      healthcheckBit: false,
      email: 'default@ce.com',
      ageLst: ['< 1 year', 'junior', 'adult', 'senior', 'unsure'],
      needsLst: [
        'capture',
        'fosterhome',
        'funding',
        'adoption',
        'finding new owner',
        'medical',
        'feeding',
        'driver'
      ],
      medicalLst: ['skin condition', 'broken bones', 'bleeding', 'tumors'],
      urgencyLst: [
        'immediatly ',
        'in 1 day',
        'in 2 days',
        '1 to 3 weeks',
        'in 1 month',
        'longer'
      ],
      behaviorLst: [
        'shy',
        'scared',
        'happy',
        'playfull',
        'growl',
        'agressive',
        'unknown'
      ],
      captureStatusLst: [
        'stray',
        'cought',
        'released',
        're-homed',
        'shelter',
        'fostor home'
      ]
    }
  },
  props: {
    editable: true
  },
  filters: {
    booltranlate(value) {
      return value == null ? 'unknown' : value ? 'yes' : 'no'
    }
  },
  methods: {},
  computed: {
    ...mapState({
      speciesList: state => state.profiles.speciesList
    }),
    healthCheck: {
      get() {
        console.log(
          moment(this.$store.state.profiles.healthCheck).format('YYYY-MM-DD')
        )
        return
        moment(this.$store.state.profiles.healthCheck).format('YYYY-MM-DD')
      },
      set(value) {
        this.$store.commit('profiles/healthCheck', value)
      }
    },
    eartipDef: {
      get() {
        return this.eartip == null ? false : true
      },
      set(value) {
        this.$store.commit('profiles/eartip', value == true ? true : null)
      }
    },
    eartip: {
      get() {
        return this.$store.state.profiles.eartip
      },
      set(value) {
        this.$store.commit('profiles/eartip', value)
      }
    },
    vaccinatedDef: {
      get() {
        return this.vaccinated == null ? false : true
      },
      set(value) {
        this.$store.commit('profiles/vaccinated', value == true ? true : null)
      }
    },
    vaccinated: {
      get() {
        return this.$store.state.profiles.vaccinated
      },
      set(value) {
        this.$store.commit('profiles/vaccinated', value)
      }
    },
    sterileDef: {
      get() {
        return this.sterile == null ? false : true
      },
      set(value) {
        this.$store.commit('profiles/sterile', value == true ? true : null)
      }
    },
    sterile: {
      get() {
        return this.$store.state.profiles.sterile
      },
      set(value) {
        this.$store.commit('profiles/sterile', value)
      }
    },
    captureStatus: {
      get() {
        return this.$store.state.profiles.captureStatus
      },
      set(value) {
        this.$store.commit('profiles/captureStatus', value)
      }
    },
    color: {
      get() {
        return this.$store.state.profiles.color
      },
      set(value) {
        this.$store.commit('profiles/color', value)
      }
    },
    chip: {
      get() {
        return this.$store.state.profiles.chip
      },
      set(value) {
        this.$store.commit('profiles/chip', value)
      }
    },
    species: {
      get() {
        return this.$store.state.profiles.species
      },
      set(value) {
        this.$store.commit('profiles/species', value)
      }
    },
    age: {
      get() {
        return this.$store.state.profiles.age
      },
      set(value) {
        this.$store.commit('profiles/age', value)
      }
    },
    needs: {
      get() {
        return this.$store.state.profiles.needs
      },
      set(value) {
        this.$store.commit('profiles/needs', value)
      }
    },
    medical: {
      get() {
        return this.$store.state.profiles.medical
      },
      set(value) {
        this.$store.commit('profiles/medical', value)
      }
    },
    urgency: {
      get() {
        return this.$store.state.profiles.urgency
      },
      set(value) {
        this.$store.commit('profiles/urgency', value)
      }
    },
    behavior: {
      get() {
        return this.$store.state.profiles.behavior
      },
      set(value) {
        this.$store.commit('profiles/behavior', value)
      }
    },
    info: {
      get() {
        return this.$store.state.profiles.info
      },
      set(value) {
        this.$store.commit('profiles/setInfo', value)
      }
    },
    longLat: {
      get() {
        return this.$store.state.profiles.longLat
      }
    }
  }
}
</script>
