<template>
  <v-container>
    <v-layout rows wrap align-center>
      <v-flex>
        <v-form>
          <h2>Please log in</h2>
          <v-text-field v-model="email" placeholder="email"></v-text-field>
          <v-text-field
            @keyup.enter.native="login"
            v-model="password"
            type="password"
            placeholder="password"
          ></v-text-field>
          <!-- <a href="/reset">forgot pasword</a> -->
          <v-btn color="#999" height="25px" class="loginBtn" @click="login">Login</v-btn>
        </v-form>
      </v-flex>
    </v-layout>
    <v-layout rows wrap class="text-center backgroundimage">
      <v-flex xs12>
        <v-btn
          color="#4267B2"
          height="25px"
          class="loginBtn"
          @click="$auth.loginWith('facebook')"
        >Facebook</v-btn>
      </v-flex>
      <!-- <v-flex xs12>
        <v-btn
          color="#CF4332"
          height="25px"
          class="loginBtn"
          @click="$auth.loginWith('google')"
        >Google</v-btn>
      </v-flex>-->
    </v-layout>
  </v-container>
</template>
<style lang="scss" scoped>
.loginBtn {
  height: 56px !important;
  width: 100%;
  max-width: 300px;
  margin-top: 10px;
  color: white;
  border-radius: 7px !important;
  // -webkit-box-shadow: 0px 20px 70px 0px rgba(111, 109, 255, 0.4);
  // -moz-box-shadow: 0px 20px 70px 0px rgba(111, 109, 255, 0.4);
  // box-shadow: 0px 20px 70px 0px rgba(111, 109, 255, 0.4);
}
</style>
<script>
export default {
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    login() {
      this.$auth.loginWith('local', {
        data: {
          email: this.email,
          password: this.password
        }
      })
    },
    async loginGoogle() {
      this.$auth.loginWith('google')
    }
  }
}
</script>
