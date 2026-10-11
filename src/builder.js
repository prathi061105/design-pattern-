/**
 * Smart Trip Planning System - Builder & Factory Method Design Patterns
 * Developed for Software Engineering Project
 * 
 * Design Patterns Applied:
 * 1. Builder Pattern (GoF Creational): Constructs complex Itinerary objects step-by-step
 * 2. Factory Method Pattern (GoF Creational): Instantiates specialized Transportation & Accommodation services via dedicated creator hierarchies
 */

import {
  TransportationService,
  TransportFactory,
  FlightTransportFactory,
  TrainTransportFactory,
  BusTransportFactory,
  CarRentalTransportFactory,
  TransportationFactoryProvider,
  AccommodationService,
  AccommodationFactory,
  BudgetHotelFactory,
  ThreeStarHotelFactory,
  FiveStarHotelFactory,
  ResortStayFactory,
  AccommodationFactoryProvider
} from './factory.js';

// -------------------------------------------------------------
// 1. PRODUCT: Itinerary (Builder Pattern Product)
// Represents the complex composite object constructed by the builder
// -------------------------------------------------------------
export class Itinerary {
  constructor() {
    this.destination = '';
    this.destinationInfo = null;
    this.transportation = '';
    this.transportService = null; // Concrete Product created via Transportation Factory Method
    this.accommodation = '';
    this.accommodationService = null; // Concrete Product created via Accommodation Factory Method
    this.attractions = [];
    this.budget = 0;
    this.duration = 1;
    this.travelers = 1; // Number of members/travelers
    this.pace = 'Moderate'; // Default Pace: 'Relaxed', 'Moderate', or 'Packed'
    this.dayWisePlan = [];
    this.costBreakdown = {
      travelCost: 0,
      accommodationCost: 0,
      attractionsCost: 0,
      foodAndMiscCost: 0,
      totalEstimatedCost: 0
    };
    this.patternLog = []; // Tracks construction steps for pattern demonstration
    this.createdAt = new Date().toISOString();
  }

  addPatternLogStep(stepName, details) {
    this.patternLog.push({
      step: this.patternLog.length + 1,
      name: stepName,
      details: details,
      timestamp: new Date().toLocaleTimeString()
    });
  }

  getSummary() {
    return `${this.duration}-Day Trip for ${this.travelers} Traveler(s) to ${this.destination} via ${this.transportation} (${this.accommodation})`;
  }
}

// -------------------------------------------------------------
// 2. ABSTRACT BUILDER INTERFACE: TripBuilder
// Defines the abstract building steps required for constructing an Itinerary
// -------------------------------------------------------------
export class TripBuilder {
  reset() {
    throw new Error("Method 'reset()' must be implemented.");
  }
  setDestination(destination) {
    throw new Error("Method 'setDestination()' must be implemented.");
  }
  setTransportation(transportation) {
    throw new Error("Method 'setTransportation()' must be implemented.");
  }
  setAccommodation(accommodation) {
    throw new Error("Method 'setAccommodation()' must be implemented.");
  }
  setAttractions(attractions) {
    throw new Error("Method 'setAttractions()' must be implemented.");
  }
  setBudget(budget) {
    throw new Error("Method 'setBudget()' must be implemented.");
  }
  setDuration(duration) {
    throw new Error("Method 'setDuration()' must be implemented.");
  }
  setTravelers(travelers) {
    throw new Error("Method 'setTravelers()' must be implemented.");
  }
  setPace(pace) {
    throw new Error("Method 'setPace()' must be implemented.");
  }
  buildDayWisePlan() {
    throw new Error("Method 'buildDayWisePlan()' must be implemented.");
  }
  calculateCostBreakdown() {
    throw new Error("Method 'calculateCostBreakdown()' must be implemented.");
  }
  getResult() {
    throw new Error("Method 'getResult()' must be implemented.");
  }
}

// -------------------------------------------------------------
// 3. CONCRETE BUILDER: CustomizedTripBuilder
// Implements the TripBuilder interface to construct and assemble 
// parts of the Itinerary object step-by-step
// -------------------------------------------------------------
export class CustomizedTripBuilder extends TripBuilder {
  constructor() {
    super();
    this.itinerary = new Itinerary();
    this.destinationDatabase = {
      "Goa": {
        state: "Goa",
        tagline: "Pearl of the Orient & Beach Capital",
        image: "/src/assets/images/goa_beach_1785941223820.jpg",
        description: "Famous for sun-kissed beaches, vibrant nightlife, Portuguese heritage, and seafood delicacies.",
        baseCostPerDay: 3500,
        activitiesByCategory: {
          "Beach": ["Relax at Baga & Calangute Beaches", "Sunset View at Anjuna & Vagator Cliffs", "Palolem Beach & Silent Noise Party"],
          "Mountains": ["Chorla Ghats Nature Trail", "Dudhsagar Waterfall Trek"],
          "Museums": ["Goa State Museum Tour", "Museum of Christian Art in Old Goa", "Houses of Goa Museum"],
          "Parks": ["Salim Ali Bird Sanctuary Tour", "Mollem National Park Wildlife Safari"],
          "Adventure Sports": ["Scuba Diving & Snorkeling at Grande Island", "Parasailing & Jet Ski at Calangute", "White Water Rafting in Valpoi"],
          "Shopping": ["Anjuna Flea Market Shopping", "Mapusa Saturday Night Market", "Panjim Handloom & Handicrafts"]
        }
      },
      "Kerala": {
        state: "Kerala",
        tagline: "God's Own Country",
        image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
        description: "Known for serene backwaters, lush Munnar tea gardens, Ayurvedic retreats, and rich cultural arts.",
        baseCostPerDay: 4000,
        activitiesByCategory: {
          "Beach": ["Varkala Cliff Beach Walk", "Kovalam Lighthouse Beach Sunset"],
          "Mountains": ["Munnar Tea Gardens Tour", "Eravikulam National Park Anamudi View", "Wayanad Chembra Peak Hike"],
          "Museums": ["Hill Palace Museum Tripunithura", "Indo-Portuguese Museum Fort Kochi", "Teak Museum Nilambur"],
          "Parks": ["Periyar National Park Wildlife Boat Safari", "Silent Valley Rainforest Excursion"],
          "Adventure Sports": ["Bamboo Rafting in Periyar", "Kayaking through Backwater Canals", "Ziplining in Wayanad"],
          "Shopping": ["Spices & Tea Shopping in Munnar", "Kochi Mattancherry Antique Market", "Kasavu Handloom Saree Shopping"]
        }
      },
      "Ooty": {
        state: "Tamil Nadu",
        tagline: "Queen of Hill Stations",
        image: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80",
        description: "Nestled in the Nilgiri hills, featuring eucalyptus forests, toy train rides, and picturesque lake gardens.",
        baseCostPerDay: 3000,
        activitiesByCategory: {
          "Beach": ["Boating at Ooty Lake & Pykara Lake"],
          "Mountains": ["Doddabetta Peak Viewpoint", "Avalanche Lake & Emerald Valley Trek", "Nilgiri Mountain Railway Heritage Toy Train"],
          "Museums": ["Tea Factory & Tea Museum Tour", "Wax World Museum Ooty"],
          "Parks": ["Government Botanical Garden Walk", "Government Rose Garden Visit", "Sim's Park Coonoor"],
          "Adventure Sports": ["Mountain Biking in Pine Forests", "Trekking to Catherine Falls", "Horse Riding at Shooting Point"],
          "Shopping": ["Homemade Chocolates Shopping", "Essential Oils & Nilgiri Tea Purchase", "Charring Cross Local Market"]
        }
      },
      "Manali": {
        state: "Himachal Pradesh",
        tagline: "Valley of the Gods",
        image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
        description: "A Himalayan paradise surrounded by snow-capped peaks, pine forests, adventure sports, and ancient temples.",
        baseCostPerDay: 4500,
        activitiesByCategory: {
          "Beach": ["Riverside Walk along Beas River"],
          "Mountains": ["Solang Valley Snow Point", "Rohtang Pass Snow Scooter Ride", "Atal Tunnel & Sissu Valley Drive"],
          "Museums": ["Museum of Himachal Culture & Folk Art", "Naggar Castle Art Gallery"],
          "Parks": ["Van Vihar National Park Deodar Woods", "Great Himalayan National Park Tour"],
          "Adventure Sports": ["Paragliding in Solang Valley", "River Rafting in Beas River Cullu", "Ziplining & Skiing in Winter"],
          "Shopping": ["Mall Road Woolens Shopping", "Himachali Caps & Shawls Purchase", "Old Manali Hippie Handicrafts"]
        }
      },
      "Mysore": {
        state: "Karnataka",
        tagline: "City of Palaces & Heritage",
        image: "/src/assets/images/mysore_palace_card_1785943091013.jpg",
        description: "The royal cultural capital of Karnataka, world-famous for its majestic Palace, Dasara, and sandalwood.",
        baseCostPerDay: 2800,
        activitiesByCategory: {
          "Beach": ["KRS Dam Backwaters Sunset"],
          "Mountains": ["Chamundi Hill Temple Walk & Viewpoint", "BR Hills Day Excursion"],
          "Museums": ["Mysore Palace Architectural Tour", "Jayalakshmi Vilas Mansion Museum", "Rail Museum Mysore"],
          "Parks": ["Brindavan Gardens Musical Fountain Show", "Mysore Zoo (Sri Chamarajendra Zoological Gardens)"],
          "Adventure Sports": ["Go-Karting at Chamundi Track", "Micro Flight Joyrides over Mysore", "Water Sports at Varuna Lake"],
          "Shopping": ["Devaraja Market Spice & Incense Walk", "Mysore Silk Saree Showroom Shopping", "Mysore Pak Sweet Tasting"]
        }
      },
      "Jaipur": {
        state: "Rajasthan",
        tagline: "The Pink City of Royalty",
        image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
        description: "A historic wonderland of pink sandstone forts, opulent royal palaces, vibrant bazaars, and traditional folk culture.",
        baseCostPerDay: 3800,
        activitiesByCategory: {
          "Beach": ["Man Sagar Lake View of Jal Mahal"],
          "Mountains": ["Nahargarh Fort Hilltop Sunset View", "Jaigarh Fort & World's Largest Cannon Walk"],
          "Museums": ["City Palace Museum Collection", "Albert Hall Museum Visit", "Anokhi Museum of Hand Printing"],
          "Parks": ["Central Park Stroll", "Kanak Vrindavan Valley Gardens"],
          "Adventure Sports": ["Hot Air Balloon Ride over Amber Fort", "Jeep Safari in Jhalana Leopard Reserve", "Zip-lining at Flying Fox"],
          "Shopping": ["Johari Bazaar Gemstone & Jewelry Shopping", "Bapu Bazaar Mojari & Blue Pottery", "Chokhi Dhani Rajasthani Cultural Dinner"]
        }
      },
      "Shimla": {
        state: "Himachal Pradesh",
        tagline: "Pine Forests & Colonial Charm",
        image: "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1200&q=80",
        description: "Snow-peaked pine forests, colonial British architecture, scenic Ridge walks, and vibrant Mall Road shopping.",
        baseCostPerDay: 3600,
        activitiesByCategory: {
          "Beach": ["Riverside Picnic at Giri River"],
          "Mountains": ["Jakhoo Hill & Hanuman Temple Hike", "Kufri Snow Peak Excursion", "Chail Palace & World's Highest Cricket Ground"],
          "Museums": ["Viceregal Lodge Architecture Tour", "Himachal State Museum Walk"],
          "Parks": ["Annandale Ground & Heritage Park", "Glen Nature Trail Walk"],
          "Adventure Sports": ["Ice Skating at Shimla Rink", "Skiing at Narkanda Slopes", "Trekking to Shali Tibba"],
          "Shopping": ["Mall Road & Ridge Shopping Walk", "Lakkar Bazaar Wooden Handicrafts"]
        }
      },
      "Darjeeling": {
        state: "West Bengal",
        tagline: "Muscatel Tea & Himalayan Panorama",
        image: "https://images.unsplash.com/photo-1544634076-a196a1f457f8?auto=format&fit=crop&w=1200&q=80",
        description: "World-famous emerald tea gardens, stunning Kanchenjunga sunrise views, and historic Toy Train rides.",
        baseCostPerDay: 3400,
        activitiesByCategory: {
          "Beach": ["Teesta River Bank Sunset"],
          "Mountains": ["Tiger Hill Kanchenjunga Sunrise View", "Batasia Loop & Ghoom Monastery Visit", "Rock Garden & Ganga Maya Park Drive"],
          "Museums": ["Himalayan Mountaineering Institute", "Bengal Natural History Museum"],
          "Parks": ["Happy Valley Tea Estate Walk", "Padmaja Naidu Himalayan Zoological Park"],
          "Adventure Sports": ["Teesta River White Water Rafting", "Trek to Sandakphu Ridge", "Darjeeling Ropeway Cable Car Ride"],
          "Shopping": ["Chowrasta Mall Market", "Darjeeling Muscatel Tea Tasting & Purchase", "Tibetan Refugee Self Help Center"]
        }
      },
      "Rishikesh": {
        state: "Uttarakhand",
        tagline: "Yoga Capital & Adventure Hub",
        image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80",
        description: "Sacred Ganges riverbank ghats, thrilling white-water rafting, serene ashrams, and evening Ganga Aarti.",
        baseCostPerDay: 3100,
        activitiesByCategory: {
          "Beach": ["Ganges Riverbank Sandy Beach Relaxation"],
          "Mountains": ["Kunjapuri Temple Sunrise Hike", "Neer Garh Waterfall Trek"],
          "Museums": ["The Beatles Ashram Museum Tour", "Swarg Ashram Spiritual Library"],
          "Parks": ["Rajaji National Park Jungle Safari", "Neelkanth Mahadev Forest Trail"],
          "Adventure Sports": ["White Water Rafting on the Ganges", "Bungee Jumping at Jumpin Heights", "Giant Swing & Flying Fox"],
          "Shopping": ["Laxman Jhula Local Handicrafts Market", "Ayurvedic Oils & Yoga Accessories Shopping"]
        }
      },
      "Pondicherry": {
        state: "Puducherry",
        tagline: "French Riviera of the East",
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
        description: "Charming French Quarter streets, yellow colonial villas, quiet Promenade beach walks, and spiritual Auroville.",
        baseCostPerDay: 3200,
        activitiesByCategory: {
          "Beach": ["Rock Beach Promenade Walk", "Paradise Beach Boat Ride", "Serenity Beach Surfing"],
          "Mountains": ["Gingee Fort Day Trek Excursion"],
          "Museums": ["Pondicherry Museum French Antiquities", "Auroville Matrimandir Visitors Centre"],
          "Parks": ["Botanical Garden Stroll", "Ousteri Lake Bird Sanctuary"],
          "Adventure Sports": ["Scuba Diving at Temple Reef", "Surfing Lessons at Serenity Beach", "Kayaking in Chunnambar Backwaters"],
          "Shopping": ["Heritage French Quarter Craft Boutiques", "Handmade Paper & Incense Shopping at Auroshikha"]
        }
      },
      "Hampi": {
        state: "Karnataka",
        tagline: "UNESCO Boulders & Ancient Ruins",
        image: "/src/assets/images/hampi_ruins_card_1785943126638.jpg",
        description: "Surreal boulder-strewn landscapes, magnificent Vijayanagara temple architecture, and tranquil Tungabhadra sunsets.",
        baseCostPerDay: 2900,
        activitiesByCategory: {
          "Beach": ["Sanapur Lake Coracle Ride"],
          "Mountains": ["Matanga Hill Sunrise Trek", "Anjaneya Hill (Hanuman Temple) Sunset View"],
          "Museums": ["ASI Museum Hampi Bazaar", "Elephant Stables & Lotus Mahal Architecture Walk"],
          "Parks": ["Daroji Sloth Bear Sanctuary Safari", "Tungabhadra River Nature Walk"],
          "Adventure Sports": ["Boulder Climbing & Bouldering Tours", "Coracle Boat Rafting in Tungabhadra", "Scooter Exploration across Anegundi"],
          "Shopping": ["Hampi Bazaar Leather & Stone Crafts", "Hippie Island Bohemian Handicrafts"]
        }
      }
    };
  }

  reset() {
    this.itinerary = new Itinerary();
    this.itinerary.addPatternLogStep(
      "1. Builder Reset",
      "Initialized a fresh Itinerary product object in CustomizedTripBuilder."
    );
  }

  setDestination(destination) {
    this.itinerary.destination = destination;
    const info = this.destinationDatabase[destination] || {
      state: "India",
      tagline: "Explore Beautiful India",
      image: "/src/assets/images/travel_hero_bg_1785941212269.jpg",
      description: "An incredible destination filled with culture, sightseeing, and scenic landscapes.",
      baseCostPerDay: 3000,
      activitiesByCategory: {}
    };
    this.itinerary.destinationInfo = info;
    this.itinerary.addPatternLogStep(
      "2. Set Destination",
      `Set destination to '${destination}' (${info.tagline}). Loaded destination-specific meta & assets.`
    );
  }

  setTransportation(transportation) {
    // FACTORY METHOD CREATIONAL PATTERN:
    // Uses TransportationFactoryProvider to obtain a Concrete Factory (FlightTransportFactory, TrainTransportFactory, etc.)
    // and invokes the Factory Method 'createTransportation()' to instantiate the Concrete Product.
    const factory = TransportationFactoryProvider.getFactory(transportation);
    const transportProduct = factory.createTransportation();

    this.itinerary.transportService = transportProduct;
    this.itinerary.transportation = transportProduct.name;
    this.itinerary.addPatternLogStep(
      "3. Factory Method: Create Transportation Product",
      `Invoked '${factory.constructor.name}.createTransportation()'. Instantiated Concrete Product '${transportProduct.constructor.name}' with base fare ₹${transportProduct.baseFarePerPerson}/person and transit speed '${transportProduct.transitSpeed}'.`
    );
  }

  setAccommodation(accommodation) {
    // FACTORY METHOD CREATIONAL PATTERN:
    // Uses AccommodationFactoryProvider to obtain a Concrete Factory (BudgetHotelFactory, ThreeStarHotelFactory, etc.)
    // and invokes the Factory Method 'createAccommodation()' to instantiate the Concrete Product.
    const factory = AccommodationFactoryProvider.getFactory(accommodation);
    const accommodationProduct = factory.createAccommodation();

    this.itinerary.accommodationService = accommodationProduct;
    this.itinerary.accommodation = accommodationProduct.name;
    this.itinerary.addPatternLogStep(
      "4. Factory Method: Create Accommodation Product",
      `Invoked '${factory.constructor.name}.createAccommodation()'. Instantiated Concrete Product '${accommodationProduct.constructor.name}' with nightly room rate ₹${accommodationProduct.ratePerNight} and rating '${accommodationProduct.rating}'.`
    );
  }

  setAttractions(attractions) {
    this.itinerary.attractions = Array.isArray(attractions) ? attractions : [];
    this.itinerary.addPatternLogStep(
      "5. Set Attractions",
      `Attached preference categories: [${this.itinerary.attractions.join(', ')}].`
    );
  }

  setBudget(budget) {
    this.itinerary.budget = Number(budget) || 15000;
    this.itinerary.addPatternLogStep(
      "6. Set Travel Budget",
      `Assigned total target user budget limit: ₹${this.itinerary.budget.toLocaleString('en-IN')}.`
    );
  }

  setDuration(duration) {
    this.itinerary.duration = Math.max(1, Math.min(10, Number(duration) || 3));
    this.itinerary.addPatternLogStep(
      "7. Set Trip Duration",
      `Set travel timeframe to ${this.itinerary.duration} Day(s).`
    );
  }

  setTravelers(travelers) {
    this.itinerary.travelers = Math.max(1, Math.min(20, Number(travelers) || 1));
    this.itinerary.addPatternLogStep(
      "8. Set Travelers Count",
      `Set group size to ${this.itinerary.travelers} Traveler(s).`
    );
  }

  setPace(pace) {
    const validPaces = ['Relaxed', 'Moderate', 'Packed'];
    this.itinerary.pace = validPaces.includes(pace) ? pace : 'Moderate';
    
    const paceDescriptions = {
      'Relaxed': 'Fewer activities with high leisure & downtime',
      'Moderate': 'Balanced schedule with ~2 key activities per day',
      'Packed': 'High energy with maximum 3+ activities & sightseeing'
    };

    this.itinerary.addPatternLogStep(
      "8. Set Itinerary Pace",
      `Configured itinerary pace as '${this.itinerary.pace}' (${paceDescriptions[this.itinerary.pace]}).`
    );
  }

  buildDayWisePlan() {
    const days = [];
    const dest = this.itinerary.destination;
    const info = this.itinerary.destinationInfo;
    const selectedAttractions = this.itinerary.attractions;
    const totalDays = this.itinerary.duration;
    const pace = this.itinerary.pace || 'Moderate';

    // Collect all activities matching user preference categories
    let pool = [];
    selectedAttractions.forEach(cat => {
      if (info.activitiesByCategory && info.activitiesByCategory[cat]) {
        info.activitiesByCategory[cat].forEach(act => pool.push({ category: cat, title: act }));
      }
    });

    // Fallback activities if pool is short
    const defaultActivities = [
      { category: "Sightseeing", title: `Explore local heritage spots & vibrant markets in ${dest}` },
      { category: "Cuisine", title: `Sample authentic regional delicacies & local street food` },
      { category: "Relaxation", title: `Leisurely evening stroll and local sunset viewpoint` },
      { category: "Culture", title: `Cultural music/dance performance & souvenir shopping` },
      { category: "Nature", title: `Scenic sunrise photo walk and nature photography` },
      { category: "Adventure", title: `Local sightseeing & scenic viewpoints near ${dest}` }
    ];

    const getNextActivity = () => {
      if (pool.length > 0) return pool.shift();
      const randomIndex = Math.floor(Math.random() * defaultActivities.length);
      return defaultActivities[randomIndex];
    };

    for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
      let morning, afternoon, evening;
      let highlights = [];

      if (pace === 'Relaxed') {
        // Relaxed Pace: 1 main activity per day, emphasis on downtime and unhurried meals
        if (dayNum === 1) {
          morning = `Arrival in ${dest} via ${this.itinerary.transportation}, check-in at ${this.itinerary.accommodation}. Unpack & relax.`;
          afternoon = `Afternoon: Leisurely lunch & resort/hotel relaxation.`;
          evening = `Evening: Peaceful welcome dinner & gentle twilight walk in ${dest}.`;
          highlights = [`Check-in @ ${this.itinerary.accommodation}`, `Pace: Relaxed (Downtime focus)`];
        } else if (dayNum === totalDays) {
          let actLast = getNextActivity();
          morning = `Morning: ${actLast.title} (${actLast.category}) at your own leisure.`;
          afternoon = `Afternoon: Unhurried hotel checkout and souvenir shopping.`;
          evening = `Evening: Departure from ${dest} via ${this.itinerary.transportation}. Safe journey home!`;
          highlights = [`Final Souvenirs`, `Pace: Relaxed` ];
        } else {
          let actMain = getNextActivity();
          if (dayNum % 2 === 0) {
            morning = `Morning: ${actMain.title} (${actMain.category}) at a relaxed pace.`;
            afternoon = `Afternoon: Free time, local cafe lounging, and spa/pool relaxation.`;
            evening = `Evening: Scenic sunset viewpoint & quiet local dinner.`;
          } else {
            morning = `Morning: Sleeping in, leisurely breakfast & pool/lounge downtime.`;
            afternoon = `Afternoon: ${actMain.title} (${actMain.category}).`;
            evening = `Evening: Relaxed dining & local night market stroll in ${dest}.`;
          }
          highlights = [`1 Key Activity Today`, `Pace: Relaxed (Unhurried)`];
        }
      } else if (pace === 'Packed') {
        // Packed Pace: 3+ activities per day, high energy sightseeing
        if (dayNum === 1) {
          morning = `Early arrival in ${dest} via ${this.itinerary.transportation}, express check-in at ${this.itinerary.accommodation}.`;
          let act1 = getNextActivity();
          let act2 = getNextActivity();
          afternoon = `Afternoon: ${act1.title} (${act1.category}) followed by ${act2.title} (${act2.category}).`;
          evening = `Evening: Orientation city tour, welcome dinner, & vibrant night market walk.`;
          highlights = [`Express Check-in`, `2 Afternoon Tours`, `Pace: Packed (High Energy)`];
        } else if (dayNum === totalDays) {
          let act1 = getNextActivity();
          let act2 = getNextActivity();
          morning = `Morning: Early sunrise photo tour & ${act1.title} (${act1.category}).`;
          afternoon = `Afternoon: ${act2.title} (${act2.category}) & fast-track souvenir market walk.`;
          evening = `Evening: Hotel checkout & departure from ${dest} via ${this.itinerary.transportation}.`;
          highlights = [`Sunrise Tour`, `2 Main Sightseeing Spots`, `Pace: Packed` ];
        } else {
          let actA = getNextActivity();
          let actB = getNextActivity();
          let actC = getNextActivity();
          morning = `Morning: Early start for ${actA.title} (${actA.category}).`;
          afternoon = `Afternoon: Guided tour of ${actB.title} (${actB.category}) & quick local lunch.`;
          evening = `Evening: ${actC.title} (${actC.category}) & night cultural performance.`;
          highlights = [`3 Full Activities Today`, `Pace: Packed (Action-Packed)`];
        }
      } else {
        // Moderate Pace: ~2 activities per day (Default balanced schedule)
        if (dayNum === 1) {
          morning = `Arrival in ${dest} via ${this.itinerary.transportation}, check-in at ${this.itinerary.accommodation}.`;
          let act1 = getNextActivity();
          afternoon = `Afternoon: ${act1.title} (${act1.category}).`;
          evening = `Evening: Welcome dinner & orientation stroll in city center.`;
          highlights = [`Check-in @ ${this.itinerary.accommodation}`, `Pace: Moderate (Balanced)`];
        } else if (dayNum === totalDays) {
          let actLast = getNextActivity();
          morning = `Morning: ${actLast.title} (${actLast.category}) & hotel breakfast.`;
          afternoon = `Afternoon: Last-minute souvenir shopping and hotel checkout.`;
          evening = `Departure from ${dest} via ${this.itinerary.transportation}. Safe journey home!`;
          highlights = [`Final Sightseeing`, `Pace: Moderate` ];
        } else {
          let actA = getNextActivity();
          let actB = getNextActivity();
          morning = `Morning: ${actA.title} (${actA.category}).`;
          afternoon = `Afternoon: Lunch break followed by ${actB.title} (${actB.category}).`;
          evening = `Evening: Relaxation, local street food tasting, and vibrant night vibe in ${dest}.`;
          highlights = [`2 Activities Today`, `Pace: Moderate (Balanced)`];
        }
      }

      days.push({
        day: dayNum,
        title: dayNum === 1 ? "Arrival & Orientation" : (dayNum === totalDays ? "Final Sightseeing & Departure" : `Exploration - Day ${dayNum} (${pace})`),
        morning,
        afternoon,
        evening,
        highlights: highlights
      });
    }

    this.itinerary.dayWisePlan = days;
    this.itinerary.addPatternLogStep(
      "9. Build Day-Wise Plan",
      `Generated custom ${totalDays}-day schedule tailored for '${pace}' pace with ${selectedAttractions.length} preference categories.`
    );
  }

  calculateCostBreakdown() {
    const duration = this.itinerary.duration;
    const travelers = Math.max(1, this.itinerary.travelers || 1);
    const rooms = Math.ceil(travelers / 2);
    const targetBudget = this.itinerary.budget;
    let mode = this.itinerary.transportation;
    let acc = this.itinerary.accommodation;

    // Standard transport multipliers per person (return trip)
    const transportCostsPerPerson = {
      Flight: 6500,
      Train: 2000,
      Bus: 1200,
      Car: 3000
    };

    // Standard accommodation per room night (approx 2 persons per room)
    const accCostsPerRoomNight = {
      "Budget Hotel": 1400,
      "3-Star Hotel": 3000,
      "5-Star Hotel": 8500,
      "Resort": 6000
    };

    let travelCost = this.itinerary.transportService
      ? this.itinerary.transportService.calculateCost(travelers)
      : (transportCostsPerPerson[mode] || 2200) * travelers;

    let accommodationCost = this.itinerary.accommodationService
      ? this.itinerary.accommodationService.calculateCost(duration, rooms)
      : (accCostsPerRoomNight[acc] || 2500) * duration * rooms;

    let attractionsCost = this.itinerary.attractions.length * 350 * duration * travelers;
    let foodAndMiscCost = 700 * duration * travelers;

    const totalRaw = travelCost + accommodationCost + attractionsCost + foodAndMiscCost;
    let isOptimized = false;
    let optimizationMessage = "";

    // If unconstrained estimate exceeds target budget, optimize selections and cost allocations
    if (totalRaw > targetBudget) {
      isOptimized = true;

      // 1. Adjust transport mode if too expensive for total budget using Factory Method
      if (travelCost >= targetBudget * 0.5) {
        if (targetBudget <= 12000) {
          const busFactory = new BusTransportFactory();
          this.itinerary.transportService = busFactory.createTransportation();
          mode = `${this.itinerary.transportService.name} (Budget Saver Rate)`;
          travelCost = Math.min(this.itinerary.transportService.calculateCost(travelers), Math.floor(targetBudget * 0.32));
        } else {
          const trainFactory = new TrainTransportFactory();
          this.itinerary.transportService = trainFactory.createTransportation();
          mode = `${this.itinerary.transportService.name} (Value Saver Rate)`;
          travelCost = Math.floor(targetBudget * 0.35);
        }
        this.itinerary.transportation = mode;
      }

      // 2. Adjust accommodation tier if too expensive for budget using Factory Method
      if (accommodationCost >= targetBudget * 0.45) {
        const budgetStayFactory = new BudgetHotelFactory();
        this.itinerary.accommodationService = budgetStayFactory.createAccommodation();
        acc = `${this.itinerary.accommodationService.name} (Budget Saver Stay)`;
        this.itinerary.accommodation = acc;
        accommodationCost = Math.min(this.itinerary.accommodationService.calculateCost(duration, rooms), Math.floor(targetBudget * 0.35));
      }

      // 3. Allocate remaining budget for daily activities & meals
      let remainingBudget = targetBudget - travelCost - accommodationCost;

      if (remainingBudget > 800) {
        attractionsCost = Math.floor(remainingBudget * 0.45);
        foodAndMiscCost = remainingBudget - attractionsCost;
      } else {
        // Strict proportional scaling if remaining is tight
        const factor = targetBudget / totalRaw;
        travelCost = Math.floor(travelCost * factor);
        accommodationCost = Math.floor(accommodationCost * factor);
        attractionsCost = Math.floor(attractionsCost * factor);
        foodAndMiscCost = targetBudget - (travelCost + accommodationCost + attractionsCost);
      }

      optimizationMessage = `Budget-Optimized Plan: Rates tailored for ${travelers} traveler(s) within your ₹${targetBudget.toLocaleString('en-IN')} target budget.`;
    }

    const totalEstimatedCost = travelCost + accommodationCost + attractionsCost + foodAndMiscCost;

    // Itemized sub-breakdown details calculation
    const attractionsDetails = {
      entryTickets: Math.round(attractionsCost * 0.45),
      guidedTours: Math.round(attractionsCost * 0.30),
      activityPermits: Math.round(attractionsCost * 0.25)
    };

    const foodDetails = {
      breakfast: Math.round(foodAndMiscCost * 0.25),
      lunch: Math.round(foodAndMiscCost * 0.35),
      dinner: Math.round(foodAndMiscCost * 0.30),
      snacksBeverages: Math.round(foodAndMiscCost * 0.10)
    };

    const transportDetails = {
      mainTransit: Math.round(travelCost * 0.80),
      localCommute: Math.round(travelCost * 0.20),
      mode: mode
    };

    const accommodationDetails = {
      nightlyRoomRate: Math.round(accommodationCost / (duration * rooms)),
      totalRooms: rooms,
      totalNights: duration,
      stayType: acc
    };

    const dailyPerPerson = {
      foodPerDayPerson: Math.round(foodAndMiscCost / (duration * travelers)),
      sightseeingPerDayPerson: Math.round(attractionsCost / (duration * travelers)),
      totalDailyPerson: Math.round((foodAndMiscCost + attractionsCost) / (duration * travelers))
    };

    this.itinerary.costBreakdown = {
      travelCost,
      accommodationCost,
      attractionsCost,
      foodAndMiscCost,
      totalEstimatedCost,
      isBudgetOptimized: isOptimized,
      optimizationMessage,
      targetBudget,
      travelers,
      rooms,
      attractionsDetails,
      foodDetails,
      transportDetails,
      accommodationDetails,
      dailyPerPerson,
      transportServiceDetails: this.itinerary.transportService ? this.itinerary.transportService.getServiceDetails() : null,
      accommodationServiceDetails: this.itinerary.accommodationService ? this.itinerary.accommodationService.getServiceDetails() : null
    };

    this.itinerary.addPatternLogStep(
      "10. Calculate & Optimize Cost Breakdown",
      isOptimized
        ? `Applied Smart Budget Constraint for ${travelers} traveler(s): Standard estimate (₹${totalRaw.toLocaleString('en-IN')}) exceeded target budget (₹${targetBudget.toLocaleString('en-IN')}). Re-calculated options via Factory Method to fit ₹${totalEstimatedCost.toLocaleString('en-IN')} within your budget.`
        : `Computed itemized estimates for ${travelers} traveler(s) using Factory Method products. Total: ₹${totalEstimatedCost.toLocaleString('en-IN')} is fully within your ₹${targetBudget.toLocaleString('en-IN')} target budget.`
    );
  }

  getResult() {
    this.itinerary.addPatternLogStep(
      "11. Finalize Product",
      "Completed step-by-step assembly via TripBuilder. Returning fully configured Itinerary composite object."
    );
    return this.itinerary;
  }
}

// -------------------------------------------------------------
// 4. DIRECTOR: TripDirector (Builder Pattern Director)
// Controls the step-by-step construction sequence using a builder instance
// -------------------------------------------------------------
export class TripDirector {
  constructor(builder = new CustomizedTripBuilder()) {
    this.builder = builder;
  }

  setBuilder(builder) {
    this.builder = builder;
  }

  constructTrip(formData) {
    if (!formData) {
      throw new Error("Form data is required to construct trip.");
    }

    // Step-by-step director workflow execution
    this.builder.reset();
    this.builder.setDestination(formData.destination || 'Goa');
    this.builder.setTransportation(formData.transport || 'Flight');
    this.builder.setAccommodation(formData.accommodation || '3-Star Hotel');
    this.builder.setAttractions(formData.attractions || ['Beach', 'Adventure Sports']);
    this.builder.setBudget(formData.budget || 25000);
    this.builder.setDuration(formData.duration || 4);
    this.builder.setTravelers(formData.travelers || 2);
    this.builder.setPace(formData.pace || 'Moderate');
    this.builder.buildDayWisePlan();
    this.builder.calculateCostBreakdown();

    return this.builder.getResult();
  }
}

// Re-export Factory Method classes for comprehensive design pattern access
export {
  TransportationService,
  TransportFactory,
  FlightTransportFactory,
  TrainTransportFactory,
  BusTransportFactory,
  CarRentalTransportFactory,
  TransportationFactoryProvider,
  AccommodationService,
  AccommodationFactory,
  BudgetHotelFactory,
  ThreeStarHotelFactory,
  FiveStarHotelFactory,
  ResortStayFactory,
  AccommodationFactoryProvider
};

// Attach to window object for global non-module compatibility if accessed directly
if (typeof window !== 'undefined') {
  window.SmartTripBuilder = {
    Itinerary,
    TripBuilder,
    CustomizedTripBuilder,
    TripDirector
  };

  window.SmartTripFactory = {
    TransportationService,
    TransportFactory,
    FlightTransportFactory,
    TrainTransportFactory,
    BusTransportFactory,
    CarRentalTransportFactory,
    TransportationFactoryProvider,
    AccommodationService,
    AccommodationFactory,
    BudgetHotelFactory,
    ThreeStarHotelFactory,
    FiveStarHotelFactory,
    ResortStayFactory,
    AccommodationFactoryProvider
  };
}
