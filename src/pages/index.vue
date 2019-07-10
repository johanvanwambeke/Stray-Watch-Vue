<template>
  <div class="container">
    <h1
      style="text-align:center;margin-top:10%;margin-bottom:15px;font-size:3em"
      :color="mainColor"
    >{{appName}}</h1>
    <h2
      style="text-align:center; padding-left: 15%; padding-right:15%"
      :color="mainColor"
    >Help a stray animal in three simple steps</h2>
    <div style="height:30px;width:100%"></div>
    <div class="stepBlock" v-for="step in steps">
      <div class="circle">
        <div class="icon">
          <v-icon :color="mainColor">{{step.icon}}</v-icon>
        </div>
        <div class="smallcircle">{{step.number}}</div>
      </div>
      <div>
        <h2 class="stepH2">{{step.title}}</h2>
      </div>
    </div>
    <div class="buttonblock">
      <v-btn class="mainButton" block depressed :color="accentColor" to="profile">Help an animal</v-btn>
      <v-btn class="mainButton" block depressed outline color="white" to="web">About {{appName}}</v-btn>
    </div>
  </div>
</template>

<style scoped>
.buttonblock {
  margin-top: 50px;
  width: 100%;
  text-align: center;
}

.container {
  background-color: var(--background-color);
  height: 100vh;
  color: var(--main-color);
  padding: 40px;
}
.stepBlock {
  width: 100%;
  height: 80px;
  display: flex;
}
.circle {
  /* font-size: 12px; */
  color: var(--main-color);
  background-color: white;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  position: relative;
}
.stepH2 {
  color: var(--main-color);
  flex: 1;
  margin-left: 10px;
  margin-top: 15px;
}
.icon {
  width: 24px;
  height: 24px;
  margin: 18px;
}
.smallcircle {
  background-color: white;
  border-radius: 50%;
  border: solid 1.5px var(--main-color);
  height: 22px;
  width: 22px;
  position: absolute;
  bottom: -3px;
  right: -3px;
  text-align: center;
  font-weight: 800;
}
.mainButton {
  color: white;
  border-radius: 10px;
  height: 40px;
}
</style>

<script>
import config from '@/config.js'
export default {
  layout: 'empty',
  data() {
    return {
      appName: config.settings.appName,
      accentColor: config.colors.accentColor,
      mainColor: config.colors.mainColor,
      backgroundColor: config.colors.backgroundColor,

      steps: [
        {
          icon: 'camera_alt',
          number: 1,
          title: 'Take profile pictures'
        },
        {
          icon: 'place',
          number: 2,
          title: 'Share animal location'
        },
        {
          icon: 'info',
          number: 3,
          title: 'Share animal info'
        }
      ]
    }
  },
  mounted() {}
}
</script>
