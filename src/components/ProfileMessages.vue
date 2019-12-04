<template>
  <v-layout rows wrap>
    <v-flex xs12>
      <h1>Profile messages</h1>
    </v-flex>
    <v-flex xs12>
      <div class="messageblock" v-for="(message, i) in messages" :key="i">
        <p class="username">{{ message.userName }}</p>
        <v-card mb-2>
          <v-flex pa-1>
            <p>{{ message.remark }}</p>
          </v-flex>
        </v-card>
      </div>
    </v-flex>
    <v-flex mt-3 xs12 class="messageblock">
      <v-textarea
        style="max-width:600px"
        solo
        v-model="remark"
        name="input-7-4"
        label="Join the conversation"
      ></v-textarea>
      <v-btn @click="createRemark">react</v-btn>
    </v-flex>
  </v-layout>
</template>
<style>
.username {
  color: rgb(116, 116, 116);
  margin: 0px;
  font-size: 10px;
}
.messageblock {
  max-width: 600px;
  margin-left: 10%;
}
</style>
<script>
export default {
  data() {
    return {
      messages: [],
      remark: ''
    }
  },
  mounted() {
    this.getLatestRemarks()
  },
  methods: {
    getLatestRemarks() {
      this.$store
        .dispatch('messages/get', this.$route.params.id)
        .then(res => {
          this.messages = res
        })
        .catch(err => {
          console.log(err)
        })
    },
    createRemark() {
      var msg = {
        remark: this.remark,
        profileId: parseInt(this.$route.params.id)
      }
      this.$store.dispatch('messages/create', msg).then(res => {
        this.getLatestRemarks()
      })
    }
  }
}
</script>
