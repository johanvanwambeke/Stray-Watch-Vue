<template>
  <div style="position:relative;width:100%">
    <div v-if="!edit">
      <v-btn
        v-if="editable"
        style="position:absolute;top:10px;right:10px;z-index:100"
        icon
        @click="edit = !edit"
      >
        <v-icon color="gray">edit</v-icon>
      </v-btn>

      <v-flex pa-4>
        <!-- <h3 class="font-weight-light mb-4">Species: {{ profile.species }}</h3> -->
        <v-layout cols wrap class="infoblock">
          <v-flex xs12>
            <!-- name -->
            <p v-if="profile.name && profile.name != ''" class="label">name</p>
            <p v-if="profile.name && profile.name != ''">{{ profile.name }}</p>
            <!-- species-->
            <p v-if="profile.species && profile.species != ''" class="label">species</p>
            <p v-if="profile.species && profile.species != ''">{{ profile.species }}</p>
            <!-- age -->
            <p v-if="age && age != ''" class="label">age</p>
            <p v-if="age && age != ''">{{ age }}</p>
            <!-- chip -->
            <p v-if="profile.chip && profile.chip != ''" class="label">chip</p>
            <p v-if="profile.chip && profile.chip != ''">{{ profile.chip }}</p>
            <!-- sex -->
            <p class="label">Sex</p>
            <choiceBox
              :editable="false"
              v-bind:initalValue="sexState"
              @select="setSex"
              v-bind:choices="sexChoices"
            ></choiceBox>

            <!-- info -->
            <p v-if="profile.info != ''" class="label">Message</p>
            <p v-if="profile.info != ''" style=" white-space: pre-wrap;">{{ profile.info }}</p>
            <!-- created by -->
            <p
              class="text-right"
              style="font-size:9px;margin:0px"
            >created by {{ profile.createdBy }}</p>
            <!-- created on -->
            <p class="text-right" style="font-size:9px;margin:0px">{{ createdFormat }}</p>
          </v-flex>
        </v-layout>
      </v-flex>
    </div>
    <v-flex v-if="edit" pa-4>
      <v-btn style="position:absolute;top:10px;right:10px;z-index:100" icon @click="updateProfile">
        <v-icon color="gray">save</v-icon>
      </v-btn>
      <v-flex>
        <!-- species -->
        <p class="editlabel">Species</p>
        <v-flex>
          <v-select
            solo
            flat
            dense
            outlined
            hide-details="auto"
            :value="profile.species"
            @change="setSpecies($event)"
            :items="speciesList"
          ></v-select>
        </v-flex>
        <!-- name -->
        <p class="editlabel">Name</p>
        <v-layout style="position:relative">
          <v-text-field
            solo
            flat
            dense
            outlined
            hide-details="auto"
            :value="profile.name"
            @change="setName($event)"
          ></v-text-field>
          <v-btn small class="insideText" text @click="setRandomName">Random</v-btn>
        </v-layout>
        <!-- sex -->
        <p class="editlabel">Sex</p>
        <choiceBox
          :editable="true"
          v-bind:initalValue="sexState"
          @select="setSex"
          v-bind:choices="sexChoices"
        ></choiceBox>
      </v-flex>
      <v-layout>
        <p class="editlabel">
          Approximate age
          <span
            class="editlabel"
            style="cursor:point"
            @click="ageBirtdayToggle = !ageBirtdayToggle"
          >or birthday</span>
        </p>
      </v-layout>
      <v-layout cols wrap v-if="!ageBirtdayToggle" class="d-flex justify-space-between">
        <div class="timeblock text-center">
          <v-btn small text @click="addTime(-1, 'years')">
            <v-icon color="#AAA">mdi-plus</v-icon>
          </v-btn>
          <p style="margin-bottom:4px">{{ years }} years</p>
          <v-btn small text @click="addTime(1, 'years')">
            <v-icon color="#AAA">mdi-minus</v-icon>
          </v-btn>
        </div>
        <div class="timeblock text-center">
          <v-btn small text @click="addTime(-1, 'months')">
            <v-icon color="#AAA">mdi-plus</v-icon>
          </v-btn>
          <p style="margin-bottom:4px">{{ months }} months</p>
          <v-btn small text @click="addTime(1, 'months')">
            <v-icon color="#AAA">mdi-minus</v-icon>
          </v-btn>
        </div>
        <div class="timeblock text-center">
          <v-btn small text @click="addTime(-1, 'days')">
            <v-icon color="#AAA">mdi-plus</v-icon>
          </v-btn>
          <p style="margin-bottom:4px">{{ days }} days</p>
          <v-btn small text @click="addTime(1, 'days')">
            <v-icon color="#AAA">mdi-minus</v-icon>
          </v-btn>
        </div>
      </v-layout>
      <v-flex v-else>
        <v-menu offset-y :close-on-content-click="false">
          <template v-slot:activator="{ on }">
            <v-btn small text v-on="on">
              {{ profile.birthday }}
              <v-icon>expand_more</v-icon>
            </v-btn>
          </template>

          <v-date-picker :value="profile.birthday" @change="setBirthday($event)"></v-date-picker>
        </v-menu>
      </v-flex>
      <p class="editlabel">Chip number</p>
      <v-flex>
        <v-text-field
          solo
          flat
          dense
          outlined
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
          hide-details="auto"
          no-resize
          auto-grow
          :value="profile.info"
          @change="setInfo($event)"
          style="white-space: pre-wrap;"
        ></v-textarea>
      </v-flex>
    </v-flex>
  </div>
</template>
<style scoped>
.insideText {
  position: absolute;
  right: 5px;
  top: 5px;
  color: gray;
  text-transform: none !important;
  font-weight: 400 !important;
  z-index: 10;
}
.timeblock {
  border: 1px solid rgb(161, 161, 161);
  border-radius: 5px;
  padding: 5px 0px;
  background-color: white;
  width: 100%;
  max-width: 100px;
  min-width: 80px;
}
.label {
  color: gray;
  margin-bottom: -2px;
  font-size: 12px;
}
.editlabel {
  color: gray;
  margin-top: 10px;
  margin-bottom: 4px;
  font-size: 12px;
}
.infoblock {
  font-size: 18px;
}
</style>
<script>
import { mapState, mapMutations } from 'vuex'
import moment from 'moment'
import choiceBox from '../components/ChoiceBoxes'
export default {
  data() {
    return {
      ageBirtdayToggle: false,
      edit: false,
      sexChoices: [
        {
          value: true,
          text: 'Male',
          ico: true,
          iconName: 'mdi-gender-male'
        },
        {
          value: false,
          text: 'Female',
          ico: true,
          iconName: 'mdi-gender-female'
        },
        {
          value: null,
          text: 'Unknown',
          ico: false
        }
      ]
    }
  },
  mounted() {
    // store.dispatch('profiles/getProfile', this.$route.params.id)
    this.edit = this.editing
  },
  props: {
    editable: false,
    editing: false
  },
  components: {
    choiceBox
  },
  methods: {
    ...mapMutations({
      setSpecies: 'profiles/setSpecies',
      setInfo: 'profiles/setInfo',
      setName: 'profiles/setName',
      setChip: 'profiles/setChip',
      setBirthday: 'profiles/setBirthday',
      setSex: 'profiles/setSex'
    }),
    setRandomName() {
      this.$store.dispatch('profiles/setRandomName')
    },
    addTime(duration, unit) {
      var birthday = moment(this.profile.birthday)
      birthday.add(duration, unit)
      var today = moment(new Date())
      if (today.diff(birthday, 'days') < 0)
        this.setBirthday(today.format('YYYY-MM-DD'))
      else this.setBirthday(birthday.format('YYYY-MM-DD'))
    },
    async updateProfile() {
      this.$store
        .dispatch('profiles/updateProfile')
        .then(profileId => {
          //  this.$router.push({ path: '/profile/view/' + this.$route.params.id })
          this.edit = false
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  computed: {
    ...mapState({
      speciesList: state => state.profiles.speciesList,
      profile: state => state.profiles.profile
    }),
    sexState() {
      return this.profile.sex
    },
    createdFormat() {
      return moment(this.profile.created).format('LLLL')
    },
    years() {
      var a = moment(new Date())
      var b = moment(this.profile.birthday)
      var years = a.diff(b, 'year')
      return years
    },
    months() {
      var a = moment(new Date())
      var b = moment(this.profile.birthday)
      var years = a.diff(b, 'year')
      b.add(years, 'years')
      var months = a.diff(b, 'months')
      b.add(months, 'months')
      return months
    },
    days() {
      var a = moment(new Date())
      var b = moment(this.profile.birthday)
      var years = a.diff(b, 'year')
      b.add(years, 'years')
      var months = a.diff(b, 'months')
      b.add(months, 'months')
      var days = a.diff(b, 'days')
      return days
    },
    age() {
      var a = moment(new Date())
      var b = moment(this.profile.birthday)
      var years = a.diff(b, 'year')
      b.add(years, 'years')
      var months = a.diff(b, 'months')
      b.add(months, 'months')
      var days = a.diff(b, 'days')
      return (
        (years > 0 ? years + ' years ' : '') +
        (months > 0 ? months + ' months ' : '') +
        (days > 0 ? days + ' days ' : '')
      )
    }
  },
  filters: {
    booltranlate(value) {
      return value == null ? 'unknown' : value ? 'yes' : 'no'
    }
  }
}
</script>
