/**
 * Smart Trip Planning System - Facade Design Pattern
 * Developed for Software Engineering Project
 * 
 * Pattern Classification: GoF Structural Design Pattern
 * GoF Definition: "Provide a unified interface to a set of interfaces in a subsystem. 
 * Facade defines a higher-level interface that makes the subsystem easier to use."
 * 
 * Subsystems Coordinated by SmartTripPlannerFacade:
 * 1. Builder Subsystem: TripDirector, TripBuilder, CustomizedTripBuilder, Itinerary
 * 2. Factory Method Subsystem: TransportationFactoryProvider, AccommodationFactoryProvider, and Concrete Services
 * 3. Decorator Subsystem: BaseTripPackage, TravelInsuranceDecorator, CarbonOffsetDecorator, VIPConciergeDecorator, FlexibleCancellationDecorator
 * 4. Strategy Subsystem: PacingStrategyContext, RelaxedLeisureStrategy, BalancedExplorerStrategy, FastPacedAdventureStrategy
 * 5. Observer Subsystem: TripEventSubject, BudgetHealthObserver, PackingReadinessObserver, NotificationToastObserver
 * 6. Core Travel Services: WeatherService, CurrencyService, BookingService
 */

import { CustomizedTripBuilder, TripDirector } from './builder.js';
import { TripDecoratorManager } from './decorator.js';
import { WeatherService, CurrencyService, BookingService } from './services.js';
import { PacingStrategyContext } from './strategy.js';
import { TripEventSubject } from './observer.js';

export class SmartTripPlannerFacade {
  constructor() {
    // 1. Initialize Builder Subsystem
    this.builder = new CustomizedTripBuilder();
    this.director = new TripDirector(this.builder);

    // 2. Initialize Travel Services
    this.weatherService = new WeatherService();
    this.currencyService = new CurrencyService();
    this.bookingService = new BookingService();

    // 3. Initialize Behavioral Subsystems (Strategy & Observer)
    this.strategyContext = new PacingStrategyContext("Moderate");
    this.eventSubject = new TripEventSubject();
  }

  /**
   * High-level Unified Facade API:
   * Orchestrates the entire trip generation pipeline across design patterns in one simple call!
   *
   * @param {Object} formData
   * @param {string} formData.destination - e.g. "Goa", "Kerala"
   * @param {string} formData.transport - "Flight", "Train", "Bus", "Car Rental"
   * @param {string} formData.accommodation - "Budget Hotel", "3-Star Hotel", "5-Star Luxury Hotel", "Resort"
   * @param {string[]} formData.attractions - e.g. ["Beach", "Adventure Sports"]
   * @param {number} formData.budget - target budget in INR
   * @param {number} formData.duration - days (1 to 10)
   * @param {number} formData.travelers - number of persons (1 to 10)
   * @param {string} formData.pace - "Relaxed", "Moderate", "Packed"
   * @param {string[]} [formData.addons] - Decorator IDs: ["travel_insurance", "carbon_offset", "vip_concierge", "flex_cancel"]
   * @param {string} [formData.targetCurrency] - Currency code: "INR", "USD", "EUR", "GBP", "AED"
   */
  planAndBookCompleteTrip(formData) {
    const facadeLog = [];
    const timestamp = new Date().toLocaleTimeString();

    // Step 1 [FACADE]: Coordinate Builder Subsystem & Factory Method Subsystem
    facadeLog.push({
      subsystem: "Builder & Factory Method",
      action: "Delegating construction to TripDirector & CustomizedTripBuilder. Factory Method instantiates Transportation & Accommodation products.",
      timestamp
    });
    const constructedItinerary = this.director.constructTrip(formData);

    // Step 2 [FACADE]: Coordinate Decorator Subsystem for Optional Protection & Premium Enhancements
    const selectedAddons = Array.isArray(formData.addons) ? formData.addons : [];
    facadeLog.push({
      subsystem: "Decorator",
      action: `Applying dynamic decorators for ${selectedAddons.length} selected add-on packages. Wrapping BaseTripPackage dynamically.`,
      timestamp
    });
    const decoratedPackageComponent = TripDecoratorManager.applyDecorators(constructedItinerary, selectedAddons);
    const packageSummary = decoratedPackageComponent.getPackageSummary();

    // Step 3 [FACADE]: Destination Weather Service
    facadeLog.push({
      subsystem: "Weather Service",
      action: `Retrieving destination climate telemetry and travel advisory for ${formData.destination || 'Goa'}.`,
      timestamp
    });
    const weatherReport = this.weatherService.getWeatherReport(formData.destination || 'Goa');

    // Step 4 [FACADE]: Multi-Currency Forex Service
    facadeLog.push({
      subsystem: "Currency Service",
      action: `Converting total costs into international currency exchange quotes.`,
      timestamp
    });
    const multiCurrencyQuotes = this.currencyService.getAllSupportedConversions(packageSummary.totalCost);
    const activeCurrency = formData.targetCurrency || 'INR';
    const activeCurrencyQuote = this.currencyService.convertAndFormat(packageSummary.totalCost, activeCurrency);

    // Step 5 [FACADE]: Confirmed Digital Reservation Service
    facadeLog.push({
      subsystem: "Booking Service",
      action: `Generating digital booking confirmation voucher and verified PNR locator.`,
      timestamp
    });
    const bookingVoucher = this.bookingService.createBookingConfirmation(constructedItinerary, decoratedPackageComponent);

    // Step 6 [FACADE]: Coordinate Strategy Subsystem for Pacing & Daily Scheduling Algorithm
    const requestedPace = formData.pace || "Moderate";
    this.strategyContext.setStrategy(requestedPace);
    this.strategyContext.regeneratePlan(constructedItinerary);
    facadeLog.push({
      subsystem: "Strategy",
      action: `Executed '${this.strategyContext.getStrategy().name}' algorithm for daily pacing and intervals.`,
      timestamp
    });

    // Step 7 [FACADE]: Assemble Comprehensive Unified Master Object
    return {
      // Core Product from Builder Pattern
      itinerary: constructedItinerary,

      // Decorated Component from Decorator Pattern
      packageSummary: packageSummary,

      // Travel Feeds & Vouchers
      weather: weatherReport,
      currency: activeCurrencyQuote,
      allCurrencies: multiCurrencyQuotes,
      bookingTicket: bookingVoucher,

      // Behavioral Subsystem State (Strategy Pattern)
      pacingStrategy: this.strategyContext.getStrategy().getStrategyMetrics(),
      strategyKey: requestedPace,

      // Facade Orchestration Metadata
      facadeExecution: {
        pattern: "Facade",
        facadeClass: "SmartTripPlannerFacade",
        timestamp: new Date().toISOString(),
        orchestratedSubsystems: [
          "Builder Pattern (Creational - Itinerary assembly)",
          "Factory Method Pattern (Creational - Transport & Accommodation concrete creation)",
          "Decorator Pattern (Structural - Add-on package layering)",
          "Facade Pattern (Structural - Unified orchestration interface)",
          "Strategy Pattern (Behavioral - Interchangeable travel pacing algorithms)",
          "Observer Pattern (Behavioral - Reactive UI notifications & state synchronization)"
        ],
        steps: facadeLog
      }
    };
  }

  /**
   * Facade utility: quickly convert an amount to any currency code
   */
  convertCurrency(inrAmount, currencyCode) {
    return this.currencyService.convertAndFormat(inrAmount, currencyCode);
  }

  /**
   * Facade utility: retrieve real-time destination weather
   */
  getDestinationWeather(destination) {
    return this.weatherService.getWeatherReport(destination);
  }
}
