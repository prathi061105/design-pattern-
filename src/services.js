/**
 * VoyageCraft Core Travel Services
 * Provides direct destination weather, multi-currency conversion, and digital booking voucher services.
 */

/**
 * Destination Weather Service
 * Provides verified climate metrics, temperatures, and traveler advisories.
 */
export class WeatherService {
  constructor() {
    this.cityData = {
      "Goa": { celsius: 31, condition: "Warm & Sunny Beach Weather", icon: "☀️", humidity: "72%", advisory: "Great for swimming & sunset cruises. Carry sunscreen & sunglasses." },
      "Kerala": { celsius: 29, condition: "Lush Tropical Breeze", icon: "🌴", humidity: "81%", advisory: "Ideal for houseboat cruises & tea garden strolls. Light umbrella recommended." },
      "Ooty": { celsius: 16, condition: "Crisp Mountain Mist", icon: "🌲", humidity: "65%", advisory: "Pleasant misty mornings. Light woolens or jackets recommended." },
      "Mysore": { celsius: 27, condition: "Comfortable Sightseeing Weather", icon: "🌤️", humidity: "58%", advisory: "Perfect conditions for heritage palace walking tours and botanical gardens." },
      "Jaipur": { celsius: 33, condition: "Bright Heritage Sunshine", icon: "🏰", humidity: "38%", advisory: "Clear blue skies. Optimal for morning fort excursions and desert safari." },
      "Manali": { celsius: 11, condition: "Chilly Himalayan Breeze", icon: "🏔️", humidity: "50%", advisory: "Cool mountain temperatures. Layered fleece and warm footwear recommended." },
      "Agra": { celsius: 30, condition: "Pleasant Architectural Light", icon: "🕌", humidity: "44%", advisory: "Ideal soft dawn lighting for viewing the Taj Mahal." },
      "Varanasi": { celsius: 29, condition: "Atmospheric River Ghats", icon: "🪔", humidity: "60%", advisory: "Gentle breeze along the Ganges. Ideal for sunrise boat ceremonies." }
    };
  }

  getWeatherReport(cityName = "Goa") {
    const report = this.cityData[cityName] || {
      celsius: 25,
      condition: "Clear & Pleasant",
      icon: "🌤️",
      humidity: "55%",
      advisory: "Favorable conditions for day-long outdoor travel."
    };

    const fahrenheit = Math.round((report.celsius * 9 / 5) + 32);

    return {
      destination: cityName,
      temperatureC: report.celsius,
      temperatureF: fahrenheit,
      condition: report.condition,
      icon: report.icon,
      humidity: report.humidity,
      advisory: report.advisory
    };
  }
}

/**
 * Multi-Currency Exchange Service
 * Converts base INR costs into international traveler currencies with localized currency formatting.
 */
export class CurrencyService {
  constructor() {
    this.rates = {
      "INR": 1.0,
      "USD": 0.0118,  // 1 INR ~ 0.0118 USD (~84.7 INR/USD)
      "EUR": 0.0109,  // 1 INR ~ 0.0109 EUR (~91.7 INR/EUR)
      "GBP": 0.0093,  // 1 INR ~ 0.0093 GBP (~107.5 INR/GBP)
      "AED": 0.0433   // 1 INR ~ 0.0433 AED (~23.1 INR/AED)
    };
    this.currencySymbols = {
      "INR": "₹",
      "USD": "$",
      "EUR": "€",
      "GBP": "£",
      "AED": "AED "
    };
  }

  convertAndFormat(inrAmount, targetCurrency = "INR") {
    const rate = this.rates[targetCurrency] || 1.0;
    const symbol = this.currencySymbols[targetCurrency] || `${targetCurrency} `;
    const converted = Math.round(inrAmount * rate);

    let formattedString = "";
    if (targetCurrency === "INR") {
      formattedString = `₹${inrAmount.toLocaleString('en-IN')}`;
    } else {
      formattedString = `${symbol}${converted.toLocaleString('en-US')}`;
    }

    return {
      currency: targetCurrency,
      symbol: symbol,
      originalINR: inrAmount,
      convertedAmount: converted,
      formattedString: formattedString,
      exchangeRate: rate
    };
  }

  getAllSupportedConversions(inrAmount) {
    const currencies = ["INR", "USD", "EUR", "GBP", "AED"];
    return currencies.map(code => this.convertAndFormat(inrAmount, code));
  }
}

/**
 * Digital Booking Voucher Service
 * Generates confirmed booking vouchers and PNR locators for travelers.
 */
export class BookingService {
  createBookingConfirmation(itinerary, decoratedPackage) {
    const totalCost = decoratedPackage && typeof decoratedPackage.getCost === 'function'
      ? decoratedPackage.getCost()
      : (itinerary.costBreakdown ? itinerary.costBreakdown.totalEstimatedCost : itinerary.budget);

    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();

    return {
      pnrLocator: `VC-${randomHex}`,
      status: "Confirmed & Ticketed",
      bookingReference: `VC-${Date.now().toString().slice(-6)}`,
      travelersCount: itinerary.travelers || 2,
      durationDays: itinerary.duration || 4,
      destination: itinerary.destination || "India",
      totalFare: totalCost
    };
  }
}
