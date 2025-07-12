<script setup lang="ts">
const props = defineProps<{
  part: WeatherToolUIPart
}>()

const hourlyForecasts = computed(() => {
  if (!props.part.output?.hourlyForecasts) return []

  return props.part.output.hourlyForecasts.map(forecast => ({
    time: formatHour(forecast.hour),
    temp: forecast.temperature,
    icon: getWeatherIcon(forecast.condition)
  }))
})

function formatHour(hour: number): string {
  if (hour === 0) return '12AM'
  if (hour === 12) return '12PM'
  if (hour < 12) return `${hour}AM`
  return `${hour - 12}PM`
}

function getWeatherIcon(condition?: string): string {
  const icons: Record<string, string> = {
    'sunny': 'i-lucide-sun',
    'partly-cloudy': 'i-lucide-cloud-sun',
    'cloudy': 'i-lucide-cloud',
    'rainy': 'i-lucide-cloud-rain',
    'snowy': 'i-lucide-snowflake',
    'foggy': 'i-lucide-cloud-fog'
  }

  return icons[condition || 'sunny'] || 'i-lucide-sun'
}

function getConditionText(condition?: string): string {
  const texts: Record<string, string> = {
    'sunny': 'Sunny',
    'partly-cloudy': 'Partly Cloudy',
    'cloudy': 'Cloudy',
    'rainy': 'Rainy',
    'snowy': 'Snowy',
    'foggy': 'Foggy'
  }

  return texts[condition || 'sunny'] || 'Sunny'
}
</script>

<template>
  <div v-if="part.state === 'output-available'" class="w-[480px] bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl px-5 py-4 text-highlighted shadow dark:shadow-lg">
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-baseline gap-1">
        <span class="text-4xl font-light">{{ Math.round(part.output.temperature || 0) }}°</span>
        <span class="text-base text-highlighted/80 mt-1">C</span>
      </div>
      <div class="text-right">
        <div class="text-base font-medium mb-1">
          {{ part.output.location || 'Unknown' }}
        </div>
        <div class="text-xs text-highlighted/70">
          H:{{ Math.round(part.output.temperatureHigh || 0) }}° L:{{ Math.round(part.output.temperatureLow || 0) }}°
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <UIcon
          :name="getWeatherIcon(part.output.condition)"
          class="size-6 text-white"
        />
        <div class="text-sm font-medium">
          {{ getConditionText(part.output.condition) }}
        </div>
      </div>

      <div class="flex gap-3 text-xs">
        <div class="flex items-center gap-1">
          <UIcon name="i-lucide-droplets" class="size-3 text-blue-200" />
          <span>{{ part.output.humidity || 0 }}%</span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="i-lucide-wind" class="size-3 text-blue-200" />
          <span>{{ part.output.windSpeed || 0 }} km/h</span>
        </div>
      </div>
    </div>

    <div v-if="hourlyForecasts.length > 0" class="flex items-center justify-between">
      <div
        v-for="(forecast, index) in hourlyForecasts"
        :key="index"
        class="flex flex-col items-center gap-1.5"
      >
        <div class="text-xs text-highlighted/70 font-medium">
          {{ forecast.time }}
        </div>
        <UIcon
          :name="forecast.icon"
          class="size-5 text-white"
        />
        <div class="text-xs font-medium">
          {{ forecast.temp }}°
        </div>
      </div>
    </div>

    <div v-else class="flex items-center justify-center py-3">
      <div class="text-xs text-highlighted/70">
        No hourly forecast available
      </div>
    </div>
  </div>

  <div v-else-if="part.state === 'input-available'" class="w-[480px] bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl px-5 py-4 text-highlighted shadow dark:shadow-lg">
    <div class="flex items-center justify-center py-6">
      <div class="text-center">
        <UIcon
          name="i-lucide-cloud-sun"
          class="size-8 text-white mx-auto mb-2"
        />
        <div class="text-sm">
          Loading weather data...
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="part.state === 'output-error'" class="w-[480px] bg-gradient-to-br from-red-500 to-red-700 rounded-xl px-5 py-4 text-highlighted shadow dark:shadow-lg">
    <div class="flex items-center justify-center py-6">
      <div class="text-center">
        <UIcon
          name="i-lucide-alert-triangle"
          class="size-8 text-white mx-auto mb-2"
        />
        <div class="text-sm">
          Can't get weather data, please try again later
        </div>
      </div>
    </div>
  </div>
</template>
