<template>
  <div>
    <div v-if="!editable">
      <h1 class="mb-4">{{sentense}}</h1>
      <p v-if="info">Message: {{info}}</p>
    </div>
    <div v-if="editable">
      <h1 class="mb-4">{{sentense}}</h1>
      <v-flex>
        <v-select box v-model="animal" :items="animalLst" label="Animal"></v-select>
      </v-flex>
      <v-flex>
        <v-select box v-model="age" :items="ageLst" label="age"></v-select>
      </v-flex>
      <v-flex>
        <v-select box v-model="needs" :items="needsLst" label="Purpose"></v-select>
      </v-flex>
      <v-flex v-if="needs=='medical'">
        <v-select box multiple chips v-model="medical" :items="medicalLst" label="Ailment"></v-select>
      </v-flex>
      <v-flex>
        <v-select box v-model="urgency" :items="urgencyLst" label="Urgency"></v-select>
      </v-flex>
      <v-flex>
        <v-select box v-model="behavior" :items="behaviorLst" label="Behavior"></v-select>
      </v-flex>
      <v-flex>
        <v-textarea box label="More info" v-model="info"></v-textarea>
      </v-flex>
      <!-- <v-btn @click="getProfileAnimal"></v-btn> -->
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      email: 'default@ce.com',
      animalLst: ['cat', 'dog'],
      ageLst: ['< 1 year', 'junior', 'adult', 'senior', 'unsure'],
      needsLst: [
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
      ]
    }
  },
  props: {
    editable: true
  },
  methods: {
    getProfileAnimal() {
      // return this.$store.state.profiles.animal
      console.log(this.$store.getters['profiles/animal'])
    }
  },
  computed: {
    animal: {
      get() {
        return this.$store.state.profiles.animal
      },
      set(value) {
        this.$store.commit('profiles/animal', value)
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
      },
      set(value) {
        this.$store.commit('profiles/setlongLat', value)
      }
    },
    sentense() {
      if (this.animal === '') return 'Please fill in the profile'
      return (
        this.behavior +
        ' ' +
        this.age +
        ' ' +
        this.animal +
        ' needs ' +
        this.needs
      )
    }
  }
}
</script>
