// // Inside page components
// this.$OneSignal.push(() => {
//  this.$OneSignal.isPushNotificationsEnabled((isEnabled) => {
//   if (isEnabled) {
//    console.log('Push notifications are enabled!')
//   } else {
//    console.log('Push notifications are not enabled yet.')
//   }
//  })
// })

// // Using window and array form
// window.$OneSignal.push(['addListenerForNotificationOpened', (data) => {
//  console.log('Received NotificationOpened:', data)
// }]);
