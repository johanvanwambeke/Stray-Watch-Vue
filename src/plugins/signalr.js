import { HubConnectionBuilder, LogLevel } from '@aspnet/signalr'
import Vue from 'vue'

Vue.prototype.$hubConnection = new HubConnectionBuilder()
 .withUrl('https://localhost:44352/chathub')
 .configureLogging(LogLevel.Information)
 .build()

Vue.prototype.$hubConnection.start().catch(function(e) {
 console.log('Connection to hub failed ' + e)
})
