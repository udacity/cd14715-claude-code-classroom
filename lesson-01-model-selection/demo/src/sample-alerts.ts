/**
 * Sample Weather Alerts
 *
 * Different complexity levels to demonstrate model selection.
 */

export const ALERTS = {
  // Simple alert -> Use Haiku (fast & cheap)
  simple: `Temperature: 75°F, Sunny skies, Light breeze from the west.`,

  // Moderate alert -> Use Sonnet (balanced)
  moderate: `Severe thunderstorm warning: 60mph winds expected, 2-inch hail possible,
heavy rainfall 3-5 inches over the next 4 hours. Flash flooding likely in low-lying
areas. Seek shelter immediately. Power outages expected. Warning in effect until 8:00 PM EST.`,

  // Complex alert -> Use Opus (powerful reasoning)
  complex: `MULTI-HAZARD WEATHER ADVISORY: Complex weather system approaching.

Current: Temperature 45°F dropping rapidly. Barometric pressure falling.

72-hour forecast:
- Tonight: Freezing rain to sleet (0.5-1 inch)
- Tomorrow AM: Heavy snow (8-12 inches), winds 35-45 mph, gusts to 60 mph
- Tomorrow PM: Temperatures to -10°F, wind chill -35°F
- Day 3: Clearing but dangerously cold

Impacts: Livestock at extreme risk. Power grid stress expected.
All non-essential travel discouraged for 48+ hours.
This resembles the December 2022 bomb cyclone that caused $5.4B in damages.`,
};
