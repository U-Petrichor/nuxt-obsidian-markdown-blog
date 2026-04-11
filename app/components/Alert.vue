<template>
  <div class="alert" :style="{ 'border-color': color }">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const { color } = defineProps({
  color: {
    type: String,
    default: 'orange'
  }
})
</script>

<style scoped src="~/assets/styles/components/alert.css"></style>
