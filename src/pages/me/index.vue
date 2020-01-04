<template>
  <h1>{{ $auth.user }}</h1>
</template>
<script>
export default {
  mounted() {
    console.log('logedin?')
    console.log(this.$store.state.auth.loggedIn)
  }
}
</script>
