<template>
 <v-layout cols wrap class="d-flex justify-space-between">
  <p v-if="!editable && IsSelected(i)" v-for="(button, i) in choices">
   <v-icon>{{ button.iconName }}</v-icon>
   <span>{{ button.text }}</span>
  </p>
  <v-btn
   class="btnstyle"
   style="width:100px!important"
   v-if="editable"
   :class="{ setBorder: IsSelected(i) }"
   :style="IsSelected(i) ? 'background-color:#FFF' : ''"
   @click="setActive(button.value)"
   outlined
   small
   text
   v-for="(button, i) in choices"
   :key="i"
   :color="IsSelected(i) ? '#111' : '#777'"
  >
   {{ button.text }}
   <v-icon
    v-if="button.ico"
    right
    small
    :color="IsSelected(i) ? '#111' : '#777'"
   >
    {{ button.iconName }}
   </v-icon>
  </v-btn>
 </v-layout>
</template>
<style scoped>
.btnstyle {
 width: 200px !important;
 text-transform: none !important;
 font-weight: 400 !important;
 height: 40px !important;
}
.setBorder {
 border: solid 1px rgb(145, 145, 145) !important;
}
</style>
<script>
export default {
 props: { choices: Array, initalValue: Boolean, editable: true },
 event: ['change'],
 data() {
  return {
   selected: null
  }
 },
 watch: {
  initalValue: {
   immediate: true,
   handler(newVal, oldVal) {
    this.setActive(newVal)
   }
  }
 },
 computed: {
  selectedIcon() {
   var res = this.choices.filter(x => x.value === this.selected).icon
   console.log(res)
   return res
  }
 },
 methods: {
  IsSelected(nr) {
   if (this.choices === null) return false
   return this.selected === this.choices[nr].value
  },
  setActive(val) {
   this.selected = val
   this.$emit('select', val)
  }
 }
}
</script>
