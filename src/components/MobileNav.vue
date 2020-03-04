<template>
  <div id="navbar" ref="navbar" class="d-flex justify-space-around">
    <a href="#home">
      <v-flex>
        <v-icon>home</v-icon>
        <p>Home</p>
      </v-flex>
    </a>
    <a href="#news">
      <v-icon>favorite</v-icon>
      <p>Like</p>
    </a>
    <a href="#contact">
      <v-icon>share</v-icon>
      <p>Share</p>
    </a>
    <a href="#contact">
      <v-icon>edit</v-icon>
      <p>Edit</p>
    </a>
  </div>
</template>

<script>
/* When the user scrolls down, hide the navbar. When the user scrolls up, show the navbar */
if (process.client) {
  var prevScrollpos = window.pageYOffset
  window.onscroll = function() {
    var currentScrollPos = window.pageYOffset
    if (prevScrollpos > currentScrollPos) {
      document.getElementById('navbar').style.top = '0'
    } else {
      document.getElementById('navbar').style.top = '-50px'
    }
    prevScrollpos = currentScrollPos
  }
}
export default {
  methods: {}
}
</script>

<style>
#navbar {
  background-color: rgb(255, 255, 255); /* Black background color */
  position: fixed; /* Make it stick/fixed */
  top: 0; /* Stay on top */
  width: 100%; /* Full width */
  transition: top 0.3s; /* Transition effect when sliding down (and up) */
  z-index: 10;
  border-top: solid rgb(228, 228, 228) 1px;

  -webkit-box-shadow: 0px 0px 3px 0px rgba(222, 222, 222, 1);
  -moz-box-shadow: 0px 0px 3px 0px rgba(222, 222, 222, 1);
  box-shadow: 0px 0px 3px 0px rgba(222, 222, 222, 1);
}

/* Style the navbar links */
#navbar a {
  float: left;
  display: block;
  color: rgb(53, 53, 53);
  text-align: center;
  padding: 10px;
  text-decoration: none;
  font-size: 9px;
  margin-bottom: -16px !important;
}

#navbar a:hover {
  color: rgb(151, 56, 56);
}
</style>