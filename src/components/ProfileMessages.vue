<template>
  <v-layout rows wrap>
    <!-- <h2 class="font-weight-light">Chat history</h2> -->
    <!-- Chat history -->
    <v-flex class="chatHistoryCard" xs12 pa-2 mb-3>
      <div class="messageblock" v-for="(message, i) in messages " :key="i">
        <p style="margin-bottom:0px" class="username">{{ message.userName }}</p>
        <v-card elevation="0">
          <v-flex pa-1>
            <p class="body-2">{{ message.remark }}</p>
          </v-flex>
        </v-card>
      </div>
    </v-flex>
    <!-- chat box -->
    <client-only>
      <v-flex v-if="$auth.loggedIn" pa-2 xs12 class="messageblock">
        <v-textarea
          v-on:keyup.enter="createRemark"
          filled
          clearable
          counter
          dense
          no-resize
          v-model="remark"
          name="input-7-4"
          label="Join the conversation"
        ></v-textarea>
        <v-btn text style="margin:0px" @click="createRemark">Send</v-btn>
      </v-flex>
      <v-flex v-else>
        <v-btn small text to="/login">Log in to comment</v-btn>
      </v-flex>
    </client-only>
  </v-layout>
</template>
<style>
.chatHistoryCard {
  max-height: 400px;
  overflow-y: scroll;
  z-index: 10;
}
.username {
  color: rgb(206, 206, 206);
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
