<template>
<div>
    <!-- <ImageSlider  class="mt-4" /> -->
    <!-- <MapBox class="mt-4"/> -->
    <v-container> 
      <h1>{{sentense}}</h1>   
      <v-flex v-if="profile.url">
        <img  :src="profile.url[0]" alt="" width="300">
      </v-flex>
      
       <v-flex>
        <p>{{profile.animal}}</p>         
      </v-flex>

      
       <v-flex>
          <v-select
            v-model="profile.age"
            :items="animalTypes"
            label="age"
          disabled
          ></v-select>
      </v-flex>


      <v-flex>
        <v-select
          v-model="profile.needs"
          :items="healthStatuses"
          label="Needs"
          disabled
        ></v-select>
      </v-flex>
      <v-flex>
          <v-select
            v-model="profile.medical"
            :items="purposes"
            label="Medical"
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
      <v-btn @click="loadProfile"></v-btn>
      <iframe 
        :src="`https://www.facebook.com/plugins/share_button.php?href=https%3A%2F%2Fapp.stray-watch.com%2Fprofile%2F${$route.params.id}&layout=button_count&size=large&appId=1985973471691447&width=84&height=28`"
        width="84" 
        height="28" 
        style="border:none;overflow:hidden" 
        scrolling="no" 
        frameborder="0" 
        allowTransparency="true" 
        allow="encrypted-media"></iframe>
    </v-container>
</div>
</template>

<script>
import ImageSlider from "~/components/ImageSlider.vue";
import MapBox from "~/components/MapBox.vue";
export default {
  async asyncData({ app, params, store, }){
    store.dispatch('profiles/getProfile', params.id )
  },
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
            'content': `${!this.profile.url?'':this.profile.url[0]}`
          },
        ],
        script: [
          { src: 'https://cdnjs.cloudflare.com/ajax/libs/exif-js/2.3.0/exif.js' },
          // { src: 'https://api.mapbox.com/mapbox-gl-js/v1.0.0/mapbox-gl.js' },
          // { src:'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.3.0/mapbox-gl-geocoder.min.js' },
        ],
        link:[
          {href:'https://api.mapbox.com/mapbox-gl-js/v1.0.0/mapbox-gl.css', rel:'stylesheet'},
          {href:'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.3.0/mapbox-gl-geocoder.css', rel:'stylesheet', type:'text/css'},
        ]
      }
    },
 data() {
    return {
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
      if(this.profile.animal === '') 
        return 'Please fill in the profile';
        return
        this.profile.animal +
        ' needs ' + this.profile.needs +
         ' ' + this.profile.urgency;
    },
    profile () {
      return this.$store.getters['profiles/profile']
    },
  },
  methods:{
    loadProfile(){
      
    }
  },
  created() {
    if (process.browser) {

    }
  }
}

  
</script>
