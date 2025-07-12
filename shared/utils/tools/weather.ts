import { tool } from 'ai'
import { z } from 'zod'

export const weatherInputSchema = z.object({
  location: z.string().describe('The location to get the weather for')
})

export type WeatherInput = z.infer<typeof weatherInputSchema>

export const weatherOutputSchema = z.object({
  location: z.string(),
  temperature: z.number(),
  temperatureHigh: z.number(),
  temperatureLow: z.number(),
  condition: z.enum(['sunny', 'partly-cloudy', 'cloudy', 'rainy']),
  humidity: z.number(),
  windSpeed: z.number(),
  hourlyForecasts: z.array(z.object({
    hour: z.number(),
    temperature: z.number(),
    condition: z.enum(['sunny', 'partly-cloudy', 'cloudy', 'rainy'])
  }))
})

export type WeatherOutput = z.infer<typeof weatherOutputSchema>

function getLocationWeatherData(location: string): WeatherOutput {
  const locationHash = location.toLowerCase().split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)

  const baseTemp = 15 + Math.abs(locationHash % 20)
  const conditions = ['sunny', 'partly-cloudy', 'cloudy', 'rainy'] as const
  const condition = conditions[Math.abs(locationHash % conditions.length)]!

  const hourlyForecasts = []
  const startHour = new Date().getHours()

  for (let i = 0; i < 6; i++) {
    const hour = (startHour + i) % 24
    const tempVariation = Math.sin(i * 0.5) * 3
    const temp = Math.round(baseTemp + tempVariation + (Math.abs(locationHash + i) % 4) - 2)

    hourlyForecasts.push({
      hour,
      temperature: temp,
      condition: i < 3 ? condition : conditions[Math.abs(locationHash + i) % conditions.length]!
    })
  }

  return {
    location,
    temperature: baseTemp,
    temperatureHigh: baseTemp + Math.abs(locationHash % 5) + 2,
    temperatureLow: baseTemp - Math.abs(locationHash % 5) - 1,
    condition,
    humidity: 40 + Math.abs(locationHash % 40),
    windSpeed: 5 + Math.abs(locationHash % 20),
    hourlyForecasts
  }
}

export const weatherTool = tool({
  description: 'Get the weather in a location',
  inputSchema: weatherInputSchema,
  execute: async ({ location }) => {
    await new Promise(resolve => setTimeout(resolve, 1500))
    return getLocationWeatherData(location)
  }
})
