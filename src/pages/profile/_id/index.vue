<template>
    <v-container> 
      <h1>{{sentense}}</h1>   
      <v-flex>
        <img :src="profile.imageUrl" alt="" width="300">
      </v-flex>
      <!-- {{store.state.profiles.profile.imageUrl}} -->
      <v-flex>
        <v-select
          v-model="profile.health"
          :items="healthStatuses"
          label="Health"
          disabled
        ></v-select>
      </v-flex>
       <v-flex>
          <v-select
            v-model="profile.animal"
            :items="animalTypes"
            label="Animal"
          disabled
          ></v-select>
      </v-flex>
      <v-flex>
          <v-select
            v-model="profile.purpose"
            :items="purposes"
            label="Purpose"
          disabled
          ></v-select>
      </v-flex>
      <v-flex>
          <v-select
            v-model="profile.urgency"
            :items="urgencies"
            label="Urgency"
          disabled
          ></v-select>
      </v-flex>
      <v-flex>
        <v-textarea
          outline
          label="More info"
          v-model="profile.info"
          disabled
        ></v-textarea>
      </v-flex>
      <iframe src="https://www.facebook.com/plugins/share_button.php?href=https%3A%2F%2Fapp.stray-watch.com%2F&layout=button&size=small&appId=350257052296222&width=59&height=20" width="59" height="20" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media"></iframe>
    </v-container>
</template>

<script>
export default {
  async asyncData({ app, params, store, }){
    console.log('asyncData')
    var oets = await store.dispatch('profiles/getProfile', params.id )
    return {
      profile:{
        ...oets
      }
    }
  },
  // middleware:'getProfile',
  head () {
      return {
        title:this.sentense,
        meta: [
          {
            'property':  'og:title',
            'content':  `${this.sentense}`,
          },
          {
            'property':  'og:description',
            'content': `${this.profile.info}`.replace(/<\/?[^>]+(>|$)/g, ""),
          },
          {
            'property':  'og:image',
            'content': `${this.profile.imageUrl}`
          },
        ],
      }
    },
 data() {
    return {
      profile:{},
      animalTypes:['cat', 'dog'],
      purposes:['fosterhome','funding', 'adoption','new owner','Medical assistance', 'feeding'],
      urgencies:['immediatly ','in 1 day', 'in 2 days','in 1 week','in 1 month '],
      healthStatuses:['healthy ','in treatment', 'untreated'],
    }
  },
  mounted(){
    // this.$store.dispatch('profiles/getProfile', this.$route.query.id );
  },
  components: {
    // GoogleMap
  },
  computed:{
    sentense(){
      if(this.profile.animal === '') return 'Please fill in the profile';
      return this.profile.health + ' ' +
       this.profile.animal +
        ' needs ' + this.profile.purpose +
         ' ' + this.profile.urgency;
    },
    // profile () {
    //   // return this.$store.getters['profiles/profile']
    // },
  },
  methods:{
  },
  created() {
    if (process.browser) {

    }
  }
}

  
</script>
