import { HubConnectionBuilder, LogLevel } from '@aspnet/signalr'
import Vue from 'vue'

export default function({ app }) {
 Vue.prototype.$hubConnected = new Promise((resolve, reject) => {
  // Provide methods to connect/disconnect from the SignalR hub
  let startedPromise = null
  let manuallyClosed = false
  let jwtToken = null
  //  if (app.$auth.loggedIn) {
  //   jwtToken = app.$auth.getToken('local')
  //  }

  var connection = new HubConnectionBuilder()
   // .withUrl('https://stray-watch-api.azurewebsites.net/chathub')
   .withUrl(
    'https://localhost:44352/chathub'
    // jwtToken ? { accessTokenFactory: () => jwtToken } : null
   )
   .configureLogging(LogLevel.Information)
   .build()

  Vue.prototype.$hubConnection = connection

  function start() {
   startedPromise = connection.start().catch(err => {
    console.error('Failed to connect with hub', err)
    return new Promise((resolve, reject) =>
     setTimeout(
      () =>
       start()
        .then(resolve)
        .catch(reject),
      5000
     )
    )
   })
   return startedPromise
  }
  connection.onclose(() => {
   if (!manuallyClosed) start()
  })

  // Start everything
  manuallyClosed = false
  start().then(d => {
   resolve()
  })
 })
}
