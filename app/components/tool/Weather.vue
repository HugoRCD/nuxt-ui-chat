<script setup lang="ts">
interface WeatherOutput {
  location?: string
  temperature?: number
  temperatureHigh?: number
  temperatureLow?: number
  condition?: string
  humidity?: number
  windSpeed?: number
}

const props = defineProps<{
  output?: WeatherOutput
}>()

const hourlyForecasts = computed(() => {
  const baseTemp = props.output?.temperature || 24
  const hours = ['9PM', '10PM', '11PM', '12AM', '1AM', '2AM']

  return hours.map((time, index) => ({
    time,
    temp: Math.round(baseTemp - index * 0.5 + Math.random() * 2 - 1),
    icon: getWeatherIcon('sunny')
  }))
})

function getWeatherIcon(condition?: string): string {
  const icons: Record<string, string> = {
    'sunny': '☀️',
    'partly-cloudy': '⛅',
    'cloudy': '☁️',
    'rainy': '🌧️',
    'snowy': '❄️',
    'foggy': '🌫️'
  }

  return icons[condition || 'sunny'] || '☀️'
}
</script>

<template>
  <div class="w-[550px] bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl px-6 py-4 text-highlighted shadow-lg">
    <div class="flex items-start justify-between mb-6">
      <div class="flex items-baseline gap-1">
        <span class="text-6xl font-light">{{ Math.round(output?.temperature || 24) }}°</span>
        <span class="text-lg text-highlighted mt-2">C</span>
      </div>
      <div class="text-right">
        <div class="text-lg font-medium mb-1">
          {{ output?.location || 'Nice' }}
        </div>
        <div class="text-sm text-highlighted">
          H:{{ output?.temperatureHigh || 30 }}° L:{{ output?.temperatureLow || 25 }}°
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between">
      <div
        v-for="(forecast, index) in hourlyForecasts"
        :key="index"
        class="flex flex-col items-center gap-2"
      >
        <div class="text-xs text-highlighted font-medium">
          {{ forecast.time }}
        </div>
        <div class="text-3xl">
          {{ forecast.icon }}
        </div>
        <div class="text-sm font-medium">
          {{ forecast.temp }}°
        </div>
      </div>
    </div>
  </div>
</template>
