<template>
  <v-layout pa-4 rows wrap style="position:relative;width:100%">
    <!-- chat box -->
    <client-only>
      <v-flex v-if="$auth.loggedIn" xs12 class="messageblock">
        <p style="margin:0px" class="username">Shift-Enter to type multiple lines</p>
        <v-textarea
          style="white-space: pre-wrap;"
          solo
          rows="1"
          flat
          dense
          outlined
          hide-details="auto"
          no-resize
          auto-grow
          @keydown.enter.exact.prevent
          @keyup.enter.exact="createRemark"
          v-model="remark"
          name="input-7-4"
        ></v-textarea>
        <v-btn dense text class="send-button" @click="createRemark">Send</v-btn>
      </v-flex>
      <v-flex v-else>
        <v-btn small text to="/login">Log in to comment</v-btn>
      </v-flex>
    </client-only>
    <!-- <h2 class="font-weight-light">Chat history</h2> -->
    <!-- Chat history -->
    <v-flex class="chatHistoryCard" xs12 mt-3>
      <div class="messageblock" v-for="(message, i) in messages" :key="i">
        <p style="margin-bottom:0px" class="username">{{ message.userName }}</p>
        <v-card elevation="0">
          <v-flex pa-1>
            <p class="body-2" style="white-space: pre-wrap;">{{ message.remark }}</p>
          </v-flex>
        </v-card>
      </div>
    </v-flex>
  </v-layout>
</template>
<style lang="scss" >
.force-overflow {
  min-height: 450px;
}

.messageblock {
  position: relative;
}
.send-button {
  margin: 0px;
  position: absolute;
  bottom: 2px;
  right: 2px;
  color: rgb(90, 90, 90);
}
</style>
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
        this.messages.unshift({
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
