<template>
  <v-layout rows wrap>
    <v-flex xs12 mb-3 v-if="messages.length > 0">
      <div class="messageblock" v-for="(message, i) in messages" :key="i">
        <p class="username">{{ message.userName }}</p>
        <v-card mb-2>
          <v-flex pa-1>
            <p>{{ message.remark }}</p>
          </v-flex>
        </v-card>
      </div>
    </v-flex>
    <client-only>
      <v-flex v-if="$auth.loggedIn" xs12 class="messageblock">
        <v-textarea
          v-on:keyup.enter="createRemark"
          solo
          v-model="remark"
          name="input-7-4"
          label="Join the conversation"
        ></v-textarea>
        <v-btn flat style="margin:0px" @click="createRemark">Send</v-btn>
      </v-flex>
      <v-flex v-else>
        <v-btn small flat to="/login">Log in to comment</v-btn>
      </v-flex>
    </client-only>
  </v-layout>
</template>
<style>
.username {
  color: rgb(116, 116, 116);
  margin: 0px;
  font-size: 10px;
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
  props: {
    dispose: true
  },
  watch: {
    dispose: function(val) {
      if (val) {
        this.$hubConnection.invoke(
          'LeaveGroup',
          this.$route.params.id,
          'Johan Van Wambeke'
        )
      }
    }
  },
  mounted() {
    this.$hubConnected.then(() => {
      this.$hubConnection.on('ReceiveMessage', payload => {
        this.messages.push({
          remark: payload.message,
          userName: payload.user
        })
      })
      this.$hubConnection.invoke(
        'JoinGroup',
        this.$route.params.id,
        'Johan Van Wambeke'
      )
    })
    console.log(this.$auth.user)
  },
  methods: {
    createRemark() {
      var msg = {
        remark: this.remark,
        profileId: parseInt(this.$route.params.id)
      }
      this.$hubConnection.invoke(
        'SendMessageToGroup',
        this.$route.params.id,
        this.remark,
        this.$auth.getToken('local')
      )
      this.remark = ''
    }
  }
}
</script>
