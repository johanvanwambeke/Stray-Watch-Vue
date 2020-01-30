<template>
  <div>
    <div v-if="!editable">
      <v-card elevation="0">
        <v-flex pa-4>
          <h3 class="font-weight-light mb-4">Species: {{ profile.species }}</h3>
          <v-layout cols wrap class="infoblock">
            <v-flex xs12>
              <!-- name -->
              <p v-if="profile.name && profile.name != ''" class="label">name</p>
              <p v-if="profile.name && profile.name != ''">{{ profile.name }}</p>
              <!-- age -->
              <p v-if="age && age != ''" class="label">age</p>
              <p v-if="age && age != ''">{{ age }}</p>
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
      <!-- <p class="editlabel">Approximate date of birth</p>
      <v-flex>
        <v-menu :value="birthdayPickerState" offset-y :close-on-content-click="false">
          <template v-slot:activator="{ on }">
            <v-btn outlined small text v-on="on">
              {{profile.birthday}}
              <v-icon>expand_more</v-icon>
            </v-btn>
          </template>

          <v-date-picker :value="profile.birthday" @change="setBirthdayClick($event)"></v-date-picker>
        </v-menu>
      </v-flex>-->
      <p class="editlabel">Approximate age</p>
      <v-layout>
        <div style="margin:10px;" class="text-center">
          <p>{{years}} years</p>
          <v-btn outlined small text @click="addTime(-1,'years')">+</v-btn>
          <v-btn outlined small text @click="addTime(1,'years')">-</v-btn>
        </div>
        <div style="margin:10px" class="text-center">
          <p>{{months}} months</p>
          <v-btn outlined small text @click="addTime(-1,'months')">+</v-btn>
          <v-btn outlined small text @click="addTime(1,'months')">-</v-btn>
        </div>
        <div style="margin:10px" class="text-center">
          <p>{{days}} days</p>
          <v-btn outlined small text @click="addTime(-1,'days')">+</v-btn>
          <v-btn outlined small text @click="addTime(1,'days')">-</v-btn>
        </div>
      </v-layout>
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
    return {
      birthdayPickerState: false
    }
  },
  methods: {
    ...mapMutations({
      setSpecies: 'profiles/setSpecies',
      setInfo: 'profiles/setInfo',
      setName: 'profiles/setName',
      setChip: 'profiles/setChip',
      setBirthday: 'profiles/setBirthday'
    }),
    // setBirthdayClick($event) {
    //   console.log('close the menu')
    //   this.birthdayPickerState = false
    //   this.setBirthday($event)
    // },
    addTime(duration, unit) {
      var birthday = moment(this.profile.birthday)
      birthday.add(duration, unit)
      var today = moment(new Date())
      if (today.diff(birthday, 'days') < 0)
        this.setBirthday(today.format('YYYY-MM-DD'))
      else this.setBirthday(birthday.format('YYYY-MM-DD'))
    }
  },
  computed: {
    ...mapState({
      speciesList: state => state.profiles.speciesList,
      profile: state => state.profiles.profile
    }),
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
