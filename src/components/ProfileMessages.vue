<template>
 <v-layout rows wrap>
  <v-flex xs12>
   <h1>Profile messages</h1>
  </v-flex>
  <v-flex xs12>
   <div v-for="(message, i) in messages" :key="i">
    <p>{{ message.userName }}</p>
    <v-card>
     <v-flex pa-1>
      <p>{{ message.remark }}</p>
     </v-flex>
    </v-card>
   </div>
  </v-flex>
  <v-flex xs12>
   <input type="text" v-model="remark" />
   <v-btn @click="createRemark"></v-btn>
  </v-flex>
 </v-layout>
</template>
<style></style>
<script>
export default {
 data() {
  return {
   profileId: 120,
   messages: [],
   remark: 'Some new text'
  }
 },
 mounted() {
  this.$store
   .dispatch('messages/get', 120)
   .then(res => {
    this.messages = res
    console.log(res)
   })
   .catch(err => {
    console.log(err)
   })
 },
 methods: {
  createRemark() {
   var msg = {
    remark: this.remark,
    profileId: 120
   }
   this.$store.dispatch('messages/create', msg)
   this.messages.push(msg)
  }
 }
}
</script>
