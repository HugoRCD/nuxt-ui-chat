import { tool } from 'ai'
import { z } from 'zod'

export const weatherTool = tool({
  description: 'Get the weather in a location',
  inputSchema: z.object({
    location: z.string().describe('The location to get the weather for')
  }),
  execute: async ({ location }) => {
    await new Promise(resolve => setTimeout(resolve, 1500))

    const locationData = getLocationWeatherData(location)

    return {
      location,
      temperature: locationData.temperature,
      temperatureHigh: locationData.temperatureHigh,
      temperatureLow: locationData.temperatureLow,
      condition: locationData.condition,
      humidity: locationData.humidity,
      windSpeed: locationData.windSpeed,
      hourlyForecasts: locationData.hourlyForecasts
    }
  }
})

function getLocationWeatherData(location: string) {
  const locationHash = location.toLowerCase().split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)

  const baseTemp = 15 + Math.abs(locationHash % 20)
  const conditions = ['sunny', 'partly-cloudy', 'cloudy', 'rainy']
  const condition = conditions[Math.abs(locationHash % conditions.length)]

  const hourlyForecasts = []
  const startHour = new Date().getHours()

  for (let i = 0; i < 6; i++) {
    const hour = (startHour + i) % 24
    const tempVariation = Math.sin(i * 0.5) * 3
    const temp = Math.round(baseTemp + tempVariation + (Math.abs(locationHash + i) % 4) - 2)

    hourlyForecasts.push({
      hour,
      temperature: temp,
      condition: i < 3 ? condition : conditions[Math.abs(locationHash + i) % conditions.length]
    })
  }

  return {
    temperature: baseTemp,
    temperatureHigh: baseTemp + Math.abs(locationHash % 5) + 2,
    temperatureLow: baseTemp - Math.abs(locationHash % 5) - 1,
    condition,
    humidity: 40 + Math.abs(locationHash % 40),
    windSpeed: 5 + Math.abs(locationHash % 20),
    hourlyForecasts
  }
}
