import { HubConnectionBuilder, LogLevel } from '@aspnet/signalr'
import Vue from 'vue'

console.log('HubConnection Try')

Vue.prototype.$hubConnection = new HubConnectionBuilder()
 .withUrl('https://stray-watch-api.azurewebsites.net/chathub')
 .configureLogging(LogLevel.Information)
 .build()

//  .start()
//  .then(() => {
//   console.log('Connection success')
//  })
//  .catch(e => {
//   console.log('Connection failed ' + e)
//  })

Vue.prototype.$hubConnection.tryConnect = function() {
 return new Promise((resolve, reject) => {
  Vue.prototype.$hubConnection
   .start()
   .then(x => {
    resolve()
   })
   .catch(function(e) {
    console.log('Connection to hub failed ' + e)
    resolve()
   })
 })
}
