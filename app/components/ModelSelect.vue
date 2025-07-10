<script setup lang="ts">
const { model, models } = useLLM()
</script>

<template>
  <USelectMenu
    v-model="model"
    :items="models"
    variant="ghost"
    :icon="model.icon"
    class="hover:bg-default focus:bg-default data-[state=open]:bg-default"
    :ui="{
      content: 'min-w-fit',
      trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
    }"
  >
    <template #item-trailing="{ item }">
      <span class="text-sm text-muted">{{ item.company }}</span>
    </template>
  </USelectMenu>
</template>
