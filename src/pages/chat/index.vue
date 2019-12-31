<template>
  <div>
    <h1>Helo</h1>
    <div v-for="(msg, i) in messagelist" :key="i">
      <p style="font-size:9px">{{ msg.user }}</p>
      <p>{{ msg.message }}</p>
    </div>
    <div>
      <v-text-field v-on:keyup.enter="sendMessage" v-model="message"></v-text-field>
      <v-btn dark @click="sendMessage"></v-btn>
    </div>
  </div>
</template>
<script>
import { HubConnectionBuilder, LogLevel } from '@aspnet/signalr'
let connection = new HubConnectionBuilder()
  .withUrl('https://localhost:44352/chathub')
  .build()
export default {
  data() {
    return {
      messagelist: [],
      message: ''
    }
  },
  mounted() {
    connection.on('ReceiveMessage', payload => {
      this.messagelist.push(payload)
      console.log(payload)
    })

    //   connection.on('SendMessage', data => {
    //    console.log(data)
    //   })

    connection
      .start()
      .then(() => connection.invoke('SendMessage', 'Hello', 'asd'))
  },
  methods: {
    sendMessage() {
      connection.invoke('SendMessage', 'Johan', this.message)
      this.message = ''
    }
  }
}
</script>
