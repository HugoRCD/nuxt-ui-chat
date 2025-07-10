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
  <div class="sm:w-[550px] mx-auto bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 text-white">
    <div class="flex items-center justify-between mb-4">
      <div>
        <div class="flex items-center">
          <span class="text-5xl font-light mr-2">{{ Math.round(output?.temperature || 24) }}°</span>
          <span class="text-xl">C</span>
        </div>
        <div class="text-blue-100 mt-1">
          H:{{ output?.temperatureHigh || 26 }}° L:{{ output?.temperatureLow || 21 }}°
        </div>
      </div>
      <div class="text-6xl">
        {{ getWeatherIcon(output?.condition) }}
      </div>
    </div>
    <div class="mb-6 text-xl font-medium text-highlighted">
      {{ output?.location }}
    </div>

    <div class="grid grid-cols-6 gap-3 text-center">
      <div
        v-for="(forecast, index) in hourlyForecasts"
        :key="index"
        class="flex flex-col items-center"
      >
        <div class="text-xs text-blue-100 mb-1">
          {{ forecast.time }}
        </div>
        <div class="text-2xl mb-1">
          {{ forecast.icon }}
        </div>
        <div class="text-sm font-medium">
          {{ forecast.temp }}°
        </div>
      </div>
    </div>
  </div>
</template>
