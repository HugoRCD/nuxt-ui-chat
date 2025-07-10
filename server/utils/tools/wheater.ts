import { tool } from 'ai'
import { z } from 'zod'

export const weatherTool = tool({
  description: 'Get the weather in a location',
  inputSchema: z.object({
    location: z.string().describe('The location to get the weather for')
  }),
  execute: async ({ location }) => {
    const baseTemp = 15 + Math.floor(Math.random() * 20) // 15-35°C
    const conditions = ['sunny', 'partly-cloudy', 'cloudy', 'rainy']
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)]

    return {
      location,
      temperature: baseTemp,
      temperatureHigh: baseTemp + Math.floor(Math.random() * 5) + 2,
      temperatureLow: baseTemp - Math.floor(Math.random() * 5) - 1,
      condition: randomCondition,
      humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
      windSpeed: Math.floor(Math.random() * 20) + 5 // 5-25 km/h
    }
  }
})
