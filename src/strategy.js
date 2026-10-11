/**
 * Smart Trip Planning System - Strategy Design Pattern
 *
 * Pattern Classification: GoF Behavioral Design Pattern
 * GoF Intent: "Define a family of algorithms, encapsulate each one, and make them interchangeable.
 * Strategy lets the algorithm vary independently from clients that use it."
 *
 * Strategies implemented:
 * 1. RelaxedLeisureStrategy - Slower mornings, 1-2 curated sights, dedicated afternoon rest/spa window.
 * 2. BalancedExplorerStrategy - Well-rounded schedule with ~3 key activities and balanced downtime.
 * 3. FastPacedAdventureStrategy - Sunrise starts, maximum sightseeing density (4-5 stops), high energy.
 */

// -------------------------------------------------------------
// 1. STRATEGY INTERFACE / BASE CLASS
// -------------------------------------------------------------
export class ItineraryStrategy {
  constructor(id, name, description, dailyIntensity, recommendedRestHours, walkingKm) {
    if (new.target === ItineraryStrategy) {
      throw new Error("Cannot instantiate abstract class ItineraryStrategy directly.");
    }
    this.id = id;
    this.name = name;
    this.description = description;
    this.dailyIntensity = dailyIntensity; // "Gentle", "Moderate", "High"
    this.recommendedRestHours = recommendedRestHours;
    this.walkingKm = walkingKm;
  }

  /**
   * Schedule activities for a given day according to this strategy's algorithm
   * @param {Object} params
   * @param {number} params.dayNumber
   * @param {number} params.totalDays
   * @param {string} params.destination
   * @param {string} params.accommodation
   * @param {string} params.transportation
   * @param {Array<{category: string, title: string}>} params.activitiesPool
   * @returns {{ morning: string, afternoon: string, evening: string, paceNote: string, tags: string[] }}
   */
  generateDaySchedule(params) {
    throw new Error("Method 'generateDaySchedule()' must be implemented by concrete strategies.");
  }

  /**
   * Return metadata and advice for this strategy
   */
  getStrategyMetrics() {
    return {
      id: this.id,
      name: this.name,
      intensity: this.dailyIntensity,
      restHours: this.recommendedRestHours,
      avgWalkingKm: this.walkingKm,
      description: this.description
    };
  }
}

// -------------------------------------------------------------
// 2. CONCRETE STRATEGY: RelaxedLeisureStrategy
// -------------------------------------------------------------
export class RelaxedLeisureStrategy extends ItineraryStrategy {
  constructor() {
    super(
      "Relaxed",
      "Relaxed & Leisure",
      "Unhurried schedule with late mornings, long meals, and dedicated afternoon downtime.",
      "Gentle (Low Pace)",
      4,
      "3-5 km/day"
    );
  }

  generateDaySchedule(params) {
    const { dayNumber, totalDays, destination, accommodation, transportation, activitiesPool } = params;
    const nextActivity = () => {
      if (activitiesPool && activitiesPool.length > 0) return activitiesPool.shift();
      return { category: "Scenic", title: `Explore tranquil garden viewpoints and cozy cafes in ${destination}` };
    };

    if (dayNumber === 1) {
      return {
        morning: `Late morning arrival in ${destination} via ${transportation}. Check in at ${accommodation}, unpack, and unwind with a welcome drink.`,
        afternoon: `Afternoon: 2-hour restful siesta followed by tea and light poolside relaxation at ${accommodation}.`,
        evening: `Evening: Scenic twilight stroll along scenic promenades and an unhurried dinner savoring regional specialties.`,
        paceNote: `Gentle start with plenty of downtime to recover from transit.`,
        tags: [`Late Start (10:00 AM)`, `Downtime Focus`, `Scenic Dining`]
      };
    }

    if (dayNumber === totalDays) {
      const act = nextActivity();
      return {
        morning: `Morning: Unrushed artisanal breakfast and a peaceful visit: ${act.title} (${act.category}).`,
        afternoon: `Afternoon: Late check-out, relaxed handicraft souvenir browsing, and quiet cafe break.`,
        evening: `Evening: Seamless transit departure via ${transportation}. Return home refreshed and recharged!`,
        paceNote: `Zero-rush departure schedule.`,
        tags: [`Leisurely Checkout`, `Light Sightseeing`]
      };
    }

    const mainAct = nextActivity();
    return {
      morning: `Morning (from 10:00 AM): ${mainAct.title} (${mainAct.category}) explored at a slow, pleasant tempo.`,
      afternoon: `Afternoon: Extended 2-hour lunch & afternoon rejuvenation break at ${accommodation} or local spa.`,
      evening: `Evening: Golden hour sunset drinks followed by leisurely candlelit dining and acoustic music.`,
      paceNote: `Maximum 1-2 visits today, allowing full immersion without fatigue.`,
      tags: [`1-2 Stops Only`, `2h Afternoon Rest`, `Golden Hour Stroll`]
    };
  }
}

// -------------------------------------------------------------
// 3. CONCRETE STRATEGY: BalancedExplorerStrategy (Default)
// -------------------------------------------------------------
export class BalancedExplorerStrategy extends ItineraryStrategy {
  constructor() {
    super(
      "Moderate",
      "Balanced Explorer",
      "Optimal balance of iconic attractions, cultural discovery, and comfortable breaks.",
      "Balanced (Optimal)",
      2.5,
      "7-10 km/day"
    );
  }

  generateDaySchedule(params) {
    const { dayNumber, totalDays, destination, accommodation, transportation, activitiesPool } = params;
    const nextActivity = () => {
      if (activitiesPool && activitiesPool.length > 0) return activitiesPool.shift();
      return { category: "Culture", title: `Visit historic heritage landmarks and artisan bazaars in ${destination}` };
    };

    if (dayNumber === 1) {
      const act1 = nextActivity();
      return {
        morning: `Morning arrival via ${transportation}. Seamless check-in & orientation at ${accommodation}.`,
        afternoon: `Afternoon: ${act1.title} (${act1.category}), followed by lunch at an authentic local eatery.`,
        evening: `Evening: Orientation walk around central ${destination} followed by a welcome culinary experience.`,
        paceNote: `Balanced start blending essential arrivals with an afternoon highlight.`,
        tags: [`Arrival & Check-in`, `Orientation Walk`, `Local Dinner`]
      };
    }

    if (dayNumber === totalDays) {
      const act1 = nextActivity();
      return {
        morning: `Morning: ${act1.title} (${act1.category}) and panoramic skyline photo opportunities.`,
        afternoon: `Afternoon: Packing, farewell lunch, and curated souvenir shopping in local heritage markets.`,
        evening: `Evening: Transfer to transit terminal for return departure via ${transportation}. Safe travels!`,
        paceNote: `Structured final day with ample buffer before departure.`,
        tags: [`Final Highlights`, `Market Souvenirs`, `Departure Transit`]
      };
    }

    const actMorning = nextActivity();
    const actAfternoon = nextActivity();
    return {
      morning: `Morning (08:30 AM): ${actMorning.title} (${actMorning.category}) during prime morning light.`,
      afternoon: `Afternoon: Traditional lunch stop, followed by ${actAfternoon.title} (${actAfternoon.category}).`,
      evening: `Evening: Vibrant night street market tour, authentic tasting plates, and local entertainment.`,
      paceNote: `Balanced pacing with 2-3 primary highlights and built-in meal breathers.`,
      tags: [`2-3 Key Sights`, `Balanced Lunch Rest`, `Evening Bazaar`]
    };
  }
}

// -------------------------------------------------------------
// 4. CONCRETE STRATEGY: FastPacedAdventureStrategy
// -------------------------------------------------------------
export class FastPacedAdventureStrategy extends ItineraryStrategy {
  constructor() {
    super(
      "Packed",
      "Fast-Paced Adventure",
      "High-energy itinerary maximizing sightseeing, early sunrise starts, and action-packed stops.",
      "High Energy (Intensive)",
      1,
      "12-16 km/day"
    );
  }

  generateDaySchedule(params) {
    const { dayNumber, totalDays, destination, accommodation, transportation, activitiesPool } = params;
    const nextActivity = () => {
      if (activitiesPool && activitiesPool.length > 0) return activitiesPool.shift();
      return { category: "Adventure", title: `Thrilling panoramic viewpoints & hidden backstreets in ${destination}` };
    };

    if (dayNumber === 1) {
      const act1 = nextActivity();
      const act2 = nextActivity();
      return {
        morning: `Early morning arrival via ${transportation}. Express bag drop at ${accommodation} and immediate exploration of ${act1.title}.`,
        afternoon: `Afternoon: Power lunch on-the-go followed by ${act2.title} (${act2.category}).`,
        evening: `Evening: Fast-track sunset trek, night photography walk, and bustling night-market exploration.`,
        paceNote: `High-velocity arrival day maximizing every available hour.`,
        tags: [`Express Bag Drop`, `Instant Sightseeing`, `Night Walk`]
      };
    }

    if (dayNumber === totalDays) {
      const act1 = nextActivity();
      const act2 = nextActivity();
      return {
        morning: `Early sunrise check-out: ${act1.title} (${act1.category}) before tour crowds arrive.`,
        afternoon: `Afternoon: ${act2.title} (${act2.category}) followed by rapid-fire souvenir buying.`,
        evening: `Evening: Late express departure via ${transportation}. Packed with incredible memories!`,
        paceNote: `Action-dense right up to terminal boarding.`,
        tags: [`Sunrise Departure`, `Double Sights`, `Express Departure`]
      };
    }

    const actMorning = nextActivity();
    const actMidday = nextActivity();
    const actAfternoon = nextActivity();
    return {
      morning: `Early Morning (07:00 AM): Sunrise vista followed by ${actMorning.title} (${actMorning.category}).`,
      afternoon: `Afternoon: Fast lunch & line-bypass entry to ${actMidday.title}, followed by ${actAfternoon.title}.`,
      evening: `Evening: High-energy night safari, river cruise, or vibrant nightlife hub in ${destination}.`,
      paceNote: `Packed 4+ stops per day for maximum coverage and adventure.`,
      tags: [`Sunrise 07:00 AM`, `4+ Daily Sights`, `Active Nightlife`]
    };
  }
}

// -------------------------------------------------------------
// 5. STRATEGY CONTEXT: PacingStrategyContext
// Manages a reference to the active Strategy and delegates schedule generation
// -------------------------------------------------------------
export class PacingStrategyContext {
  constructor(initialStrategyKey = "Moderate") {
    this.strategies = {
      "Relaxed": new RelaxedLeisureStrategy(),
      "Moderate": new BalancedExplorerStrategy(),
      "Packed": new FastPacedAdventureStrategy()
    };
    this.currentStrategy = this.strategies[initialStrategyKey] || this.strategies["Moderate"];
  }

  /**
   * Set strategy by instance or by identifier
   * @param {ItineraryStrategy|string} strategyOrKey
   */
  setStrategy(strategyOrKey) {
    if (typeof strategyOrKey === "string") {
      const found = this.strategies[strategyOrKey];
      if (found) {
        this.currentStrategy = found;
      } else {
        console.warn(`Strategy key '${strategyOrKey}' not found. Defaulting to Moderate.`);
        this.currentStrategy = this.strategies["Moderate"];
      }
    } else if (strategyOrKey instanceof ItineraryStrategy) {
      this.currentStrategy = strategyOrKey;
    }
  }

  getStrategy() {
    return this.currentStrategy;
  }

  getAllStrategies() {
    return Object.values(this.strategies);
  }

  /**
   * Delegate scheduling execution to current active strategy
   */
  executeStrategy(params) {
    return this.currentStrategy.generateDaySchedule(params);
  }

  /**
   * Re-generate an entire day-wise plan for an existing itinerary using the active strategy
   * @param {Object} itinerary
   */
  regeneratePlan(itinerary) {
    const totalDays = itinerary.duration || 3;
    const dest = itinerary.destination || "Goa";
    const info = itinerary.destinationInfo || {};
    const attractions = itinerary.attractions || [];

    // Clone activity pool so the strategy can pick
    let pool = [];
    attractions.forEach(cat => {
      if (info.activitiesByCategory && info.activitiesByCategory[cat]) {
        info.activitiesByCategory[cat].forEach(act => pool.push({ category: cat, title: act }));
      }
    });

    const newDays = [];
    for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
      const schedule = this.executeStrategy({
        dayNumber: dayNum,
        totalDays: totalDays,
        destination: dest,
        accommodation: itinerary.accommodation,
        transportation: itinerary.transportation,
        activitiesPool: pool
      });

      // Maintain any user-added custom activities if previously modified
      const existingDay = (itinerary.dayWisePlan && itinerary.dayWisePlan[dayNum - 1]) || null;
      const customActivities = (existingDay && Array.isArray(existingDay.customActivities))
        ? existingDay.customActivities
        : [];

      newDays.push({
        day: dayNum,
        title: `Day ${dayNum}: ${schedule.paceNote || schedule.morning.slice(0, 45) + '...'}`,
        morning: schedule.morning,
        afternoon: schedule.afternoon,
        evening: schedule.evening,
        tags: schedule.tags || [],
        customActivities: customActivities,
        strategyApplied: this.currentStrategy.name
      });
    }

    itinerary.dayWisePlan = newDays;
    itinerary.pace = this.currentStrategy.id;
    return newDays;
  }
}
