/**
 * Smart Trip Planning System - Decorator Design Pattern
 * Developed for Software Engineering Project
 * 
 * Pattern Classification: GoF Structural Design Pattern
 * GoF Definition: "Attach additional responsibilities to an object dynamically. 
 * Decorators provide a flexible alternative to subclassing for extending functionality."
 */

/**
 * 1. COMPONENT INTERFACE: TripPackageComponent
 * Defines the common interface for both the base trip package and all decorators.
 */
export class TripPackageComponent {
  getCost() {
    throw new Error("Method 'getCost()' must be implemented by concrete component.");
  }

  getAddons() {
    throw new Error("Method 'getAddons()' must be implemented by concrete component.");
  }

  getDecoratedPerks() {
    throw new Error("Method 'getDecoratedPerks()' must be implemented by concrete component.");
  }

  getPackageSummary() {
    throw new Error("Method 'getPackageSummary()' must be implemented by concrete component.");
  }
}

/**
 * 2. CONCRETE COMPONENT: BaseTripPackage
 * The primary object being decorated (wraps the Itinerary core cost and features).
 */
export class BaseTripPackage extends TripPackageComponent {
  constructor(itinerary) {
    super();
    this.itinerary = itinerary;
    this.baseCost = itinerary.costBreakdown ? itinerary.costBreakdown.totalEstimatedCost : (itinerary.budget || 25000);
    this.travelers = itinerary.travelers || 2;
    this.duration = itinerary.duration || 4;
  }

  getCost() {
    return this.baseCost;
  }

  getAddons() {
    return [];
  }

  getDecoratedPerks() {
    return [
      "Standard Itinerary Coordination",
      "Confirmed Booking Vouchers",
      "Route & Activity Timelines"
    ];
  }

  getPackageSummary() {
    return {
      baseCost: this.baseCost,
      totalCost: this.getCost(),
      addonsCost: 0,
      appliedDecorators: [],
      perks: this.getDecoratedPerks(),
      addonList: this.getAddons()
    };
  }
}

/**
 * 3. BASE DECORATOR: TripPackageDecorator
 * Maintains a reference to a TripPackageComponent object and defines an interface that conforms to Component's interface.
 */
export class TripPackageDecorator extends TripPackageComponent {
  constructor(tripPackage) {
    super();
    if (!tripPackage) {
      throw new Error("TripPackageDecorator requires a valid TripPackageComponent instance.");
    }
    this.wrappedPackage = tripPackage;
  }

  getCost() {
    return this.wrappedPackage.getCost();
  }

  getAddons() {
    return this.wrappedPackage.getAddons();
  }

  getDecoratedPerks() {
    return this.wrappedPackage.getDecoratedPerks();
  }

  getPackageSummary() {
    const summary = this.wrappedPackage.getPackageSummary();
    summary.totalCost = this.getCost();
    summary.perks = this.getDecoratedPerks();
    summary.addonList = this.getAddons();
    summary.addonsCost = summary.totalCost - summary.baseCost;
    return summary;
  }
}

/**
 * 4. CONCRETE DECORATOR 1: TravelInsuranceDecorator
 * Adds comprehensive medical emergency, flight delay, and baggage loss protection.
 */
export class TravelInsuranceDecorator extends TripPackageDecorator {
  constructor(tripPackage) {
    super(tripPackage);
    const travelers = tripPackage.travelers || (tripPackage.itinerary ? tripPackage.itinerary.travelers : 2);
    this.insuranceFee = 799 * Math.max(1, travelers);
  }

  getCost() {
    return super.getCost() + this.insuranceFee;
  }

  getAddons() {
    return [
      ...super.getAddons(),
      {
        id: 'travel_insurance',
        name: '🛡️ Comprehensive Travel Insurance',
        cost: this.insuranceFee,
        description: 'Cashless hospital coverage up to ₹5,00,000, flight delay reimbursement, and lost luggage guarantee.'
      }
    ];
  }

  getDecoratedPerks() {
    return [
      ...super.getDecoratedPerks(),
      '24/7 Global Medical & Baggage Assistance Hotline',
      'Instant Cashless Hospital Admission Cover'
    ];
  }

  getPackageSummary() {
    const summary = super.getPackageSummary();
    summary.appliedDecorators.push({
      pattern: 'Decorator',
      decoratorClass: 'TravelInsuranceDecorator',
      featureAdded: 'Medical & Luggage Insurance',
      additionalCost: this.insuranceFee
    });
    return summary;
  }
}

/**
 * 4. CONCRETE DECORATOR 2: CarbonOffsetDecorator
 * Adds eco-friendly certified carbon credit offsets to neutralize travel emissions.
 */
export class CarbonOffsetDecorator extends TripPackageDecorator {
  constructor(tripPackage) {
    super(tripPackage);
    const travelers = tripPackage.travelers || (tripPackage.itinerary ? tripPackage.itinerary.travelers : 2);
    const duration = tripPackage.duration || (tripPackage.itinerary ? tripPackage.itinerary.duration : 4);
    this.carbonFee = 199 * Math.max(1, travelers) * Math.max(1, Math.min(duration, 5));
  }

  getCost() {
    return super.getCost() + this.carbonFee;
  }

  getAddons() {
    return [
      ...super.getAddons(),
      {
        id: 'carbon_offset',
        name: '🌿 Eco-Traveler Carbon Neutral Offset',
        cost: this.carbonFee,
        description: 'Gold Standard certified carbon credits investing in Indian solar & reforestation projects.'
      }
    ];
  }

  getDecoratedPerks() {
    return [
      ...super.getDecoratedPerks(),
      'Official Green Travel Carbon-Neutral Certificate',
      'Tree Plantation Geo-Coordinates in Western Ghats'
    ];
  }

  getPackageSummary() {
    const summary = super.getPackageSummary();
    summary.appliedDecorators.push({
      pattern: 'Decorator',
      decoratorClass: 'CarbonOffsetDecorator',
      featureAdded: 'Green Carbon Offset Credits',
      additionalCost: this.carbonFee
    });
    return summary;
  }
}

/**
 * 4. CONCRETE DECORATOR 3: VIPConciergeDecorator
 * Adds a 24/7 on-demand personal travel butler and priority VIP reservation access.
 */
export class VIPConciergeDecorator extends TripPackageDecorator {
  constructor(tripPackage) {
    super(tripPackage);
    this.vipFee = 1499; // Flat convenience fee per itinerary
  }

  getCost() {
    return super.getCost() + this.vipFee;
  }

  getAddons() {
    return [
      ...super.getAddons(),
      {
        id: 'vip_concierge',
        name: '👑 VIP Concierge & Priority Access',
        cost: this.vipFee,
        description: 'Dedicated WhatsApp concierge for on-the-go changes, skip-the-line passes, and fine-dining reservations.'
      }
    ];
  }

  getDecoratedPerks() {
    return [
      ...super.getDecoratedPerks(),
      'Dedicated Personal WhatsApp Concierge Butler',
      'Priority Skip-the-Line Entry at Partner Monuments'
    ];
  }

  getPackageSummary() {
    const summary = super.getPackageSummary();
    summary.appliedDecorators.push({
      pattern: 'Decorator',
      decoratorClass: 'VIPConciergeDecorator',
      featureAdded: 'VIP Butler & Priority Access',
      additionalCost: this.vipFee
    });
    return summary;
  }
}

/**
 * 4. CONCRETE DECORATOR 4: FlexibleCancellationDecorator
 * Adds 100% money-back refund guarantee with zero questions asked.
 */
export class FlexibleCancellationDecorator extends TripPackageDecorator {
  constructor(tripPackage) {
    super(tripPackage);
    this.flexFee = 499;
  }

  getCost() {
    return super.getCost() + this.flexFee;
  }

  getAddons() {
    return [
      ...super.getAddons(),
      {
        id: 'flex_cancel',
        name: '🔄 100% Flexi-Refund Guarantee',
        cost: this.flexFee,
        description: 'Cancel up to 2 hours before trip kickoff for instant 100% refund without cancellation penalties.'
      }
    ];
  }

  getDecoratedPerks() {
    return [
      ...super.getDecoratedPerks(),
      'Zero-Fee Instant Trip Postponement / Date Change',
      '100% Money-back Guarantee to Original Payment Mode'
    ];
  }

  getPackageSummary() {
    const summary = super.getPackageSummary();
    summary.appliedDecorators.push({
      pattern: 'Decorator',
      decoratorClass: 'FlexibleCancellationDecorator',
      featureAdded: 'Full Refund Flexibility',
      additionalCost: this.flexFee
    });
    return summary;
  }
}

/**
 * Helper Decorator Factory / Chain Builder
 */
export class TripDecoratorManager {
  static applyDecorators(baseItinerary, selectedAddonIds = []) {
    let packageComponent = new BaseTripPackage(baseItinerary);

    if (selectedAddonIds.includes('travel_insurance')) {
      packageComponent = new TravelInsuranceDecorator(packageComponent);
    }
    if (selectedAddonIds.includes('carbon_offset')) {
      packageComponent = new CarbonOffsetDecorator(packageComponent);
    }
    if (selectedAddonIds.includes('vip_concierge')) {
      packageComponent = new VIPConciergeDecorator(packageComponent);
    }
    if (selectedAddonIds.includes('flex_cancel')) {
      packageComponent = new FlexibleCancellationDecorator(packageComponent);
    }

    return packageComponent;
  }
}
