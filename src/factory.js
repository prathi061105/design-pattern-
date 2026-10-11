/**
 * Smart Trip Planning System - Factory Method Design Pattern
 * Developed for Software Engineering Project
 * 
 * Pattern Classification: Creational Design Pattern
 * GoF Definition: "Define an interface for creating an object, but let subclasses 
 * decide which class to instantiate. Factory Method lets a class defer 
 * instantiation to subclasses."
 */

// ============================================================================
// PART 1: TRANSPORTATION FACTORY METHOD HIERARCHY
// ============================================================================

/**
 * 1. ABSTRACT PRODUCT: TransportationService
 * Defines the common interface for all transportation products.
 */
export class TransportationService {
  constructor(name, baseFarePerPerson, transitSpeed, baggageAllowance, perks, icon) {
    if (this.constructor === TransportationService) {
      throw new Error("Abstract class 'TransportationService' cannot be instantiated directly.");
    }
    this.name = name;
    this.baseFarePerPerson = baseFarePerPerson;
    this.transitSpeed = transitSpeed;
    this.baggageAllowance = baggageAllowance;
    this.perks = perks || [];
    this.icon = icon || '🚗';
  }

  // Abstract cost calculation method to be implemented by concrete subclasses
  calculateCost(travelers) {
    throw new Error("Method 'calculateCost()' must be implemented by concrete subclass.");
  }

  getServiceDetails() {
    return {
      name: this.name,
      icon: this.icon,
      transitSpeed: this.transitSpeed,
      baggageAllowance: this.baggageAllowance,
      perks: this.perks,
      baseFarePerPerson: this.baseFarePerPerson
    };
  }
}

/**
 * 2. CONCRETE PRODUCTS: Specialized Transportation Products
 */
export class FlightTransportation extends TransportationService {
  constructor() {
    super(
      "Flight",
      6500,
      "Fastest (~1-2 hrs)",
      "15 kg Check-in + 7 kg Cabin",
      ["Express Priority Boarding", "Complimentary In-flight Snacks", "Window/Aisle Seat Selection"],
      "✈️"
    );
  }

  calculateCost(travelers) {
    return this.baseFarePerPerson * Math.max(1, travelers);
  }
}

export class TrainTransportation extends TransportationService {
  constructor() {
    super(
      "Train",
      2000,
      "Scenic & Comfortable (~8-12 hrs)",
      "Up to 40 kg per passenger",
      ["AC Sleeper / Chair Car Berths", "Scenic Panoramic Countryside Views", "Eco-friendly Low Carbon Journey"],
      "🚆"
    );
  }

  calculateCost(travelers) {
    return this.baseFarePerPerson * Math.max(1, travelers);
  }
}

export class BusTransportation extends TransportationService {
  constructor() {
    super(
      "Bus",
      1200,
      "Budget Overnight (~10-14 hrs)",
      "25 kg Stored Luggage",
      ["AC Multi-axle Volvo Sleeper", "USB Charging Ports & Recliner Seats", "Multiple Convenient City Boarding Points"],
      "🚌"
    );
  }

  calculateCost(travelers) {
    return this.baseFarePerPerson * Math.max(1, travelers);
  }
}

export class CarRentalTransportation extends TransportationService {
  constructor() {
    super(
      "Car",
      3000,
      "Flexible Road Trip",
      "Full Trunk Luggage Capacity",
      ["Private Chauffeur / Self-Drive Freedom", "Stop Anytime Along Highway Vista Points", "Door-to-Door Direct Transfer"],
      "🚗"
    );
  }

  calculateCost(travelers) {
    const vehicleCount = Math.ceil(Math.max(1, travelers) / 4);
    return (this.baseFarePerPerson * 2 * vehicleCount) + (400 * travelers);
  }
}

/**
 * 3. ABSTRACT CREATOR: TransportFactory
 * Declares the Factory Method (createTransportation) that returns an object of type TransportationService.
 */
export class TransportFactory {
  // THE FACTORY METHOD: Subclasses must override this method
  createTransportation() {
    throw new Error("Factory Method 'createTransportation()' must be implemented by concrete subclass.");
  }

  // An operation that relies on the product returned by the Factory Method
  bookTransport(travelers) {
    const transport = this.createTransportation();
    const totalCost = transport.calculateCost(travelers);
    return {
      service: transport,
      travelers: travelers,
      totalCost: totalCost,
      details: transport.getServiceDetails(),
      message: `${transport.icon} Booked ${transport.name} for ${travelers} passenger(s) - ₹${totalCost.toLocaleString('en-IN')}`
    };
  }
}

/**
 * 4. CONCRETE CREATORS: Specialized Factories overriding the Factory Method
 */
export class FlightTransportFactory extends TransportFactory {
  createTransportation() {
    return new FlightTransportation();
  }
}

export class TrainTransportFactory extends TransportFactory {
  createTransportation() {
    return new TrainTransportation();
  }
}

export class BusTransportFactory extends TransportFactory {
  createTransportation() {
    return new BusTransportation();
  }
}

export class CarRentalTransportFactory extends TransportFactory {
  createTransportation() {
    return new CarRentalTransportation();
  }
}

/**
 * Transport Factory Registry / Provider
 */
export class TransportationFactoryProvider {
  static getFactory(mode) {
    const normalized = String(mode || '').toLowerCase();
    if (normalized.includes('flight') || normalized.includes('air')) {
      return new FlightTransportFactory();
    }
    if (normalized.includes('train') || normalized.includes('rail')) {
      return new TrainTransportFactory();
    }
    if (normalized.includes('bus') || normalized.includes('volvo')) {
      return new BusTransportFactory();
    }
    if (normalized.includes('car') || normalized.includes('cab') || normalized.includes('drive')) {
      return new CarRentalTransportFactory();
    }
    // Default fallback
    return new FlightTransportFactory();
  }
}


// ============================================================================
// PART 2: ACCOMMODATION FACTORY METHOD HIERARCHY
// ============================================================================

/**
 * 1. ABSTRACT PRODUCT: AccommodationService
 * Defines the interface for lodging products.
 */
export class AccommodationService {
  constructor(name, ratePerNight, rating, amenities, icon) {
    if (this.constructor === AccommodationService) {
      throw new Error("Abstract class 'AccommodationService' cannot be instantiated directly.");
    }
    this.name = name;
    this.ratePerNight = ratePerNight;
    this.rating = rating;
    this.amenities = amenities || [];
    this.icon = icon || '🏨';
  }

  // Abstract cost calculation method
  calculateCost(durationNights, roomsCount) {
    throw new Error("Method 'calculateCost()' must be implemented by concrete subclass.");
  }

  getServiceDetails() {
    return {
      name: this.name,
      icon: this.icon,
      ratePerNight: this.ratePerNight,
      rating: this.rating,
      amenities: this.amenities
    };
  }
}

/**
 * 2. CONCRETE PRODUCTS: Specialized Accommodation Products
 */
export class BudgetHotelStay extends AccommodationService {
  constructor() {
    super(
      "Budget Hotel",
      1400,
      "3.8 / 5.0",
      ["Air-Conditioned Clean Rooms", "Complimentary High-Speed Wi-Fi", "Daily Housekeeping", "24/7 Front Desk Support"],
      "🏨"
    );
  }

  calculateCost(durationNights, roomsCount) {
    return this.ratePerNight * Math.max(1, durationNights) * Math.max(1, roomsCount);
  }
}

export class ThreeStarHotelStay extends AccommodationService {
  constructor() {
    super(
      "3-Star Hotel",
      3000,
      "4.3 / 5.0",
      ["Complimentary Buffet Breakfast", "Swimming Pool & Fitness Room", "Mini-bar & Electric Kettle", "Central Location"],
      "🏢"
    );
  }

  calculateCost(durationNights, roomsCount) {
    return this.ratePerNight * Math.max(1, durationNights) * Math.max(1, roomsCount);
  }
}

export class FiveStarHotelStay extends AccommodationService {
  constructor() {
    super(
      "5-Star Hotel",
      8500,
      "4.9 / 5.0",
      ["Executive Luxury Suite", "Multi-Cuisine Fine Dining & Lounge", "Full-Service Ayurvedic & Swedish Spa", "Dedicated 24/7 Personal Butler"],
      "⭐"
    );
  }

  calculateCost(durationNights, roomsCount) {
    return this.ratePerNight * Math.max(1, durationNights) * Math.max(1, roomsCount);
  }
}

export class ResortStay extends AccommodationService {
  constructor() {
    super(
      "Resort",
      6000,
      "4.7 / 5.0",
      ["Private Beachfront / Valley View", "Infinity Horizon Pool & Sunbeds", "Campfire & Evening Folk Music", "Rejuvenation Wellness Pavilion"],
      "🌴"
    );
  }

  calculateCost(durationNights, roomsCount) {
    return this.ratePerNight * Math.max(1, durationNights) * Math.max(1, roomsCount);
  }
}

/**
 * 3. ABSTRACT CREATOR: AccommodationFactory
 * Declares the Factory Method (createAccommodation).
 */
export class AccommodationFactory {
  // THE FACTORY METHOD: Subclasses must override this method
  createAccommodation() {
    throw new Error("Factory Method 'createAccommodation()' must be implemented by concrete subclass.");
  }

  // An operation that relies on the product returned by the Factory Method
  reserveStay(durationNights, roomsCount) {
    const accommodation = this.createAccommodation();
    const totalCost = accommodation.calculateCost(durationNights, roomsCount);
    return {
      service: accommodation,
      durationNights: durationNights,
      roomsCount: roomsCount,
      totalCost: totalCost,
      details: accommodation.getServiceDetails(),
      message: `${accommodation.icon} Reserved ${accommodation.name} for ${durationNights} night(s), ${roomsCount} room(s) - ₹${totalCost.toLocaleString('en-IN')}`
    };
  }
}

/**
 * 4. CONCRETE CREATORS: Specialized Factories overriding the Factory Method
 */
export class BudgetHotelFactory extends AccommodationFactory {
  createAccommodation() {
    return new BudgetHotelStay();
  }
}

export class ThreeStarHotelFactory extends AccommodationFactory {
  createAccommodation() {
    return new ThreeStarHotelStay();
  }
}

export class FiveStarHotelFactory extends AccommodationFactory {
  createAccommodation() {
    return new FiveStarHotelStay();
  }
}

export class ResortStayFactory extends AccommodationFactory {
  createAccommodation() {
    return new ResortStay();
  }
}

/**
 * Accommodation Factory Registry / Provider
 */
export class AccommodationFactoryProvider {
  static getFactory(accommodation) {
    const normalized = String(accommodation || '').toLowerCase();
    if (normalized.includes('5-star') || normalized.includes('five') || normalized.includes('luxury')) {
      return new FiveStarHotelFactory();
    }
    if (normalized.includes('resort') || normalized.includes('villa')) {
      return new ResortStayFactory();
    }
    if (normalized.includes('budget') || normalized.includes('hostel') || normalized.includes('guest')) {
      return new BudgetHotelFactory();
    }
    // Default to 3-Star Hotel
    return new ThreeStarHotelFactory();
  }
}

// Global window registration for compatibility
if (typeof window !== 'undefined') {
  window.SmartTripFactory = {
    TransportationService,
    FlightTransportation,
    TrainTransportation,
    BusTransportation,
    CarRentalTransportation,
    TransportFactory,
    FlightTransportFactory,
    TrainTransportFactory,
    BusTransportFactory,
    CarRentalTransportFactory,
    TransportationFactoryProvider,
    AccommodationService,
    BudgetHotelStay,
    ThreeStarHotelStay,
    FiveStarHotelStay,
    ResortStay,
    AccommodationFactory,
    BudgetHotelFactory,
    ThreeStarHotelFactory,
    FiveStarHotelFactory,
    ResortStayFactory,
    AccommodationFactoryProvider
  };
}
