<template>
  <div>
    <p>
      <v-chip color="primary" text-color="white">Tip</v-chip>
      {{tips[0]}}
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tips: [
        'Use pictures that show us different angles',
        'Show us how big the animal is',
        'Avoid animals that do not belong tot he profile'
      ]
    }
  },
  mounted() {}
}
</script>

<style>
</style>
