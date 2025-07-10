<script setup lang="ts">
const { model, models } = useLLM()
</script>

<template>
  <USelectMenu
    v-model="model"
    :items="models"
    variant="ghost"
    class="hover:bg-default focus:bg-default data-[state=open]:bg-default"
    :ui="{
      trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
    }"
  />
</template>
