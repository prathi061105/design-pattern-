import { TripDirector, CustomizedTripBuilder } from './builder.js';
import { SmartTripPlannerFacade } from './facade.js';
import { TripDecoratorManager, BaseTripPackage, TravelInsuranceDecorator, CarbonOffsetDecorator, VIPConciergeDecorator, FlexibleCancellationDecorator } from './decorator.js';
import { WeatherService, CurrencyService, BookingService } from './services.js';
import {
  PacingStrategyContext,
  RelaxedLeisureStrategy,
  BalancedExplorerStrategy,
  FastPacedAdventureStrategy
} from './strategy.js';
import {
  TripEventSubject,
  BudgetHealthObserver,
  CurrencyForexObserver,
  PackingReadinessObserver,
  NotificationToastObserver
} from './observer.js';

// Expose patterns on window object for easy browser console exploration during lab / viva evaluations
if (typeof window !== 'undefined') {
  window.DesignPatterns = {
    // Structural Design Patterns
    SmartTripPlannerFacade,
    TripDecoratorManager,
    BaseTripPackage,
    TravelInsuranceDecorator,
    CarbonOffsetDecorator,
    VIPConciergeDecorator,
    FlexibleCancellationDecorator,
    // Creational Design Patterns
    TripDirector,
    CustomizedTripBuilder,
    // Behavioral Design Patterns
    PacingStrategyContext,
    RelaxedLeisureStrategy,
    BalancedExplorerStrategy,
    FastPacedAdventureStrategy,
    TripEventSubject,
    BudgetHealthObserver,
    CurrencyForexObserver,
    PackingReadinessObserver,
    NotificationToastObserver,
    // Core Services
    WeatherService,
    CurrencyService,
    BookingService
  };
}

/**
 * Smart Trip Planning System - Main Frontend UI Script
 * Handles form validation, interactive components, dynamic DOM updates,
 * and integration with the Builder Design Pattern engine.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Navbar links
  highlightActiveNavLink();

  // Page specific initializations
  if (document.getElementById('trip-planner-form')) {
    initPlannerForm();
  }

  if (document.getElementById('itinerary-output-container')) {
    initItineraryOutput();
  }

  // Destination quick selector on Home Page if present
  const destCards = document.querySelectorAll('.dest-card');
  destCards.forEach(card => {
    card.addEventListener('click', () => {
      const destName = card.getAttribute('data-dest');
      if (destName) {
        window.location.href = `planner.html?dest=${encodeURIComponent(destName)}`;
      }
    });
  });
});

/**
 * Highlight Active Navigation Bar Link
 */
function highlightActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Initialize Trip Planner Form Handlers
 */
function initPlannerForm() {
  const form = document.getElementById('trip-planner-form');
  const budgetSlider = document.getElementById('budget');
  const budgetBadge = document.getElementById('budget-value');
  const resetBtn = document.getElementById('reset-btn');
  const loadingOverlay = document.getElementById('loading-overlay');
  const destSelect = document.getElementById('destination');

  // Initialize a builder instance to query destination details
  const builderInstance = new CustomizedTripBuilder();

  // Helper function to update contextual destination preview card
  const updateDestinationPreview = (destName) => {
    const destCard = document.getElementById('destination-info-card');
    if (!destCard) return;

    const info = builderInstance.destinationDatabase[destName] || {
      state: "India",
      tagline: "Explore India",
      image: "/src/assets/images/travel_hero_bg_1785941212269.jpg",
      description: "An incredible travel destination filled with scenic landscapes, heritage, and unique cultural experiences.",
      baseCostPerDay: 3000
    };

    const imgEl = document.getElementById('dest-preview-img');
    const taglineEl = document.getElementById('dest-preview-tagline');
    const stateEl = document.getElementById('dest-preview-state');
    const titleEl = document.getElementById('dest-preview-title');
    const descEl = document.getElementById('dest-preview-desc');
    const costEl = document.getElementById('dest-preview-cost');

    if (imgEl && info.image) imgEl.src = info.image;
    if (taglineEl) taglineEl.textContent = info.tagline;
    if (stateEl) stateEl.textContent = info.state;
    if (titleEl) titleEl.textContent = destName;
    if (descEl) descEl.textContent = info.description;
    if (costEl) costEl.textContent = `₹${info.baseCostPerDay.toLocaleString('en-IN')}/day`;
  };

  // Check URL query string for pre-selected destination
  const urlParams = new URLSearchParams(window.location.search);
  const preDest = urlParams.get('dest');
  if (preDest && destSelect) {
    destSelect.value = preDest;
  }

  // Initial destination preview card update
  if (destSelect) {
    updateDestinationPreview(destSelect.value || 'Goa');

    // Update preview when user changes selected destination
    destSelect.addEventListener('change', (e) => {
      updateDestinationPreview(e.target.value);
    });

    // Also update preview when user hovers over select options or clicks dropdown
    destSelect.addEventListener('mousemove', (e) => {
      if (destSelect.value) {
        updateDestinationPreview(destSelect.value);
      }
    });
  }

  // Budget Slider live value update
  if (budgetSlider && budgetBadge) {
    const updateBudgetDisplay = () => {
      const val = Number(budgetSlider.value);
      budgetBadge.textContent = `₹${val.toLocaleString('en-IN')}`;
    };

    budgetSlider.addEventListener('input', updateBudgetDisplay);
    updateBudgetDisplay(); // initial run
  }

  // Form Reset Listener
  if (resetBtn && form) {
    resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      form.reset();
      if (budgetSlider && budgetBadge) {
        budgetSlider.value = 25000;
        budgetBadge.textContent = '₹25,000';
      }
      // Re-check default checkboxes
      const checkboxes = form.querySelectorAll('input[name="attractions"]');
      checkboxes.forEach((cb, idx) => {
        cb.checked = (idx === 0 || idx === 4); // default beach & adventure
      });
      // Reset pace radio to Moderate
      const moderateRadio = form.querySelector('input[name="pace"][value="Moderate"]');
      if (moderateRadio) moderateRadio.checked = true;

      // Update destination preview card back to selected
      if (destSelect) updateDestinationPreview(destSelect.value || 'Goa');
    });
  }

  // Form Submit Handler (Invokes Builder Pattern)
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Collect form data
      const destination = document.getElementById('destination').value;
      
      const transportRadio = form.querySelector('input[name="transport"]:checked');
      const transport = transportRadio ? transportRadio.value : 'Flight';

      const accommodation = document.getElementById('accommodation').value;

      const attractionsCheckboxes = form.querySelectorAll('input[name="attractions"]:checked');
      const attractions = Array.from(attractionsCheckboxes).map(cb => cb.value);

      if (attractions.length === 0) {
        alert("Please select at least one tourist attraction preference!");
        return;
      }

      const budget = Number(budgetSlider ? budgetSlider.value : 25000);
      const duration = Number(document.getElementById('duration').value);
      
      const travelersSelect = document.getElementById('travelers');
      const travelers = Number(travelersSelect ? travelersSelect.value : 2);

      const paceRadio = form.querySelector('input[name="pace"]:checked');
      const pace = paceRadio ? paceRadio.value : 'Moderate';

      const addonsCheckboxes = form.querySelectorAll('input[name="addons"]:checked');
      const addons = Array.from(addonsCheckboxes).map(cb => cb.value);

      const currencySelect = document.getElementById('currency');
      const targetCurrency = currencySelect ? currencySelect.value : 'INR';

      const formData = {
        destination,
        transport,
        accommodation,
        attractions,
        budget,
        duration,
        travelers,
        pace,
        addons,
        targetCurrency
      };

      // Show Loading Radar Overlay
      if (loadingOverlay) {
        loadingOverlay.classList.add('active');
      }

      // Execute Facade Pattern (orchestrates Builder, Factory Method, Decorator, Strategy, and Observer)
      setTimeout(() => {
        try {
          const facade = new SmartTripPlannerFacade();
          const masterPlan = facade.planAndBookCompleteTrip(formData);

          // Save master plan and core itinerary object into localStorage
          localStorage.setItem('smart_trip_master_plan', JSON.stringify(masterPlan));
          localStorage.setItem('smart_trip_itinerary', JSON.stringify(masterPlan.itinerary));

          // Redirect to Itinerary Output Page
          window.location.href = 'output.html';
        } catch (err) {
          console.error("Error generating trip master plan via Facade:", err);
          if (loadingOverlay) loadingOverlay.classList.remove('active');
          const errDiv = document.createElement('div');
          errDiv.textContent = "Failed to create itinerary. Please check form values and try again.";
          errDiv.style.cssText = "background: #FEE2E2; color: #991B1B; padding: 12px; border-radius: 8px; margin-top: 10px; font-weight: 600;";
          form.appendChild(errDiv);
        }
      }, 1200); // 1.2s smooth loading animation delay
    });
  }
}

// Global references for behavioral pattern state management on the output page
let currentMasterPlan = null;
let currentStrategyContext = null;
let currentTripSubject = null;

const ALL_AVAILABLE_ADDONS = [
  {
    id: "travel_insurance",
    name: "Comprehensive Travel Insurance",
    cost: 1200,
    perk: "Emergency medical hospitalization up to ₹10 Lakhs & baggage delay protection",
    decoratorClass: "TravelInsuranceDecorator",
    description: "Covers trip interruption, emergency medical hospitalization, and lost baggage compensation."
  },
  {
    id: "carbon_offset",
    name: "Carbon Neutral Offset Contribution",
    cost: 450,
    perk: "Verified Gold Standard green reforestation & carbon credits",
    decoratorClass: "CarbonOffsetDecorator",
    description: "Invests in accredited solar farms and regional reforestation to offset 100% of transit emissions."
  },
  {
    id: "vip_concierge",
    name: "24/7 VIP Priority Concierge",
    cost: 2500,
    perk: "Dedicated personal travel manager on WhatsApp & airport lounge fast-track access",
    decoratorClass: "VIPConciergeDecorator",
    description: "Direct WhatsApp concierge for table bookings, airport transfers, and luggage assistance."
  },
  {
    id: "flex_cancel",
    name: "Zero-Deduction Flexi-Refund Protection",
    cost: 1800,
    perk: "100% full refund guarantee on hotel and transport cancellations up to 24 hours before trip",
    decoratorClass: "FlexibleCancellationDecorator",
    description: "Guarantees a no-questions-asked full cash refund in case of unexpected schedule changes."
  }
];

/**
 * Initialize Itinerary Output Page Renderer with Strategy and Observer Patterns
 */
function initItineraryOutput() {
  const container = document.getElementById('itinerary-output-container');
  if (!container) return;

  // Retrieve master plan or fallback itinerary from localStorage
  const storedMaster = localStorage.getItem('smart_trip_master_plan');
  let masterPlan = null;

  if (storedMaster) {
    try {
      masterPlan = JSON.parse(storedMaster);
    } catch (e) {
      console.error("Failed to parse stored master plan:", e);
    }
  }

  // Fallback if not found or direct page opening
  if (!masterPlan) {
    const storedItin = localStorage.getItem('smart_trip_itinerary');
    let baseItin = null;
    if (storedItin) {
      try { baseItin = JSON.parse(storedItin); } catch (e) {}
    }

    const facade = new SmartTripPlannerFacade();
    masterPlan = facade.planAndBookCompleteTrip({
      destination: (baseItin && baseItin.destination) || "Goa",
      transport: (baseItin && baseItin.transportation) || "Flight",
      accommodation: (baseItin && baseItin.accommodation) || "3-Star Hotel",
      attractions: (baseItin && baseItin.attractions) || ["Beach", "Adventure Sports", "Shopping"],
      budget: (baseItin && baseItin.budget) || 35000,
      duration: (baseItin && baseItin.duration) || 4,
      travelers: (baseItin && baseItin.travelers) || 2,
      pace: (baseItin && baseItin.pace) || "Moderate",
      addons: ["travel_insurance", "carbon_offset"],
      targetCurrency: "INR"
    });
  }

  currentMasterPlan = masterPlan;
  currentMasterPlan.currencyCode = currentMasterPlan.currencyCode || 'INR';

  // 1. Initialize Strategy Pattern Context
  currentStrategyContext = new PacingStrategyContext(masterPlan.itinerary.pace || "Moderate");

  // 2. Initialize Observer Pattern Subject & Concrete Observers
  currentTripSubject = new TripEventSubject();
  const budgetObserver = new BudgetHealthObserver('budget-health-indicator');
  const forexObserver = new CurrencyForexObserver(new CurrencyService(), 'converted-total-display');
  const packingObserver = new PackingReadinessObserver('packing-advisor-container');
  const toastObserver = new NotificationToastObserver('trip-toast-container');

  // Register Observer subscriptions
  currentTripSubject.subscribe('COST_UPDATED', budgetObserver);
  currentTripSubject.subscribe('ADDON_TOGGLED', budgetObserver);
  currentTripSubject.subscribe('PACING_CHANGED', budgetObserver);
  currentTripSubject.subscribe('ACTIVITY_MODIFIED', budgetObserver);

  currentTripSubject.subscribe('CURRENCY_CHANGED', forexObserver);
  currentTripSubject.subscribe('COST_UPDATED', forexObserver);

  currentTripSubject.subscribe('WEATHER_UPDATED', packingObserver);
  currentTripSubject.subscribe('PACING_CHANGED', packingObserver);
  currentTripSubject.subscribe('ACTIVITY_MODIFIED', packingObserver);

  currentTripSubject.subscribe('*', toastObserver);

  // Initial Full Render
  refreshAllOutputViews();
  renderAdaptedSubsystems(masterPlan);

  // Attach Action Button Handlers
  const downloadBtn = document.getElementById('download-btn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      window.print();
    });
  }

  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.location.href = 'planner.html';
    });
  }
}

/**
 * Re-renders all interactive views when user customizes schedule or packages
 */
function refreshAllOutputViews() {
  if (!currentMasterPlan) return;

  renderItineraryDetails(currentMasterPlan.itinerary, currentMasterPlan.packageSummary, currentMasterPlan);
  renderPacingStrategySelector(currentMasterPlan, currentStrategyContext, currentTripSubject);
  renderDecoratedAddons(currentMasterPlan.packageSummary, currentMasterPlan.itinerary, currentTripSubject);

  // Sync summary tile for pace
  const paceVal = document.getElementById('sum-pace');
  if (paceVal) {
    paceVal.textContent = currentStrategyContext.getStrategy().name;
  }

  // Trigger Observer event notifications
  const totalCost = currentMasterPlan.packageSummary?.totalCost || currentMasterPlan.itinerary?.costBreakdown?.totalEstimatedCost || currentMasterPlan.itinerary.budget;
  const context = {
    itinerary: currentMasterPlan.itinerary,
    packageSummary: currentMasterPlan.packageSummary,
    weather: currentMasterPlan.weather,
    currencyCode: currentMasterPlan.currencyCode || 'INR'
  };

  currentTripSubject.notify('COST_UPDATED', { newTotal: totalCost }, context);
  currentTripSubject.notify('WEATHER_UPDATED', {}, context);

  // Keep localStorage updated with current changes
  try {
    localStorage.setItem('smart_trip_master_plan', JSON.stringify(currentMasterPlan));
    localStorage.setItem('smart_trip_itinerary', JSON.stringify(currentMasterPlan.itinerary));
  } catch (e) {}
}

/**
 * Render Live Travel Services
 * 1. Destination Weather Forecast & Advisories
 * 2. Multi-Currency Conversion
 * 3. Verified Travel Booking Voucher
 */
function renderAdaptedSubsystems(masterPlan) {
  const weather = masterPlan.weather || {
    destination: "India",
    temperatureC: 28,
    temperatureF: 82,
    condition: "Sunny & Pleasant",
    icon: "☀️",
    humidity: "65%",
    advisory: "Favorable conditions for day-long outdoor sightseeing."
  };

  const currency = masterPlan.currency || {
    currency: "INR",
    symbol: "₹",
    formattedString: "₹25,000",
    convertedAmount: 25000
  };

  const bookingTicket = masterPlan.bookingTicket || {
    pnrLocator: "VC-STP782",
    status: "Confirmed & Ticketed",
    bookingReference: "VC-918231"
  };

  const packageSummary = masterPlan.packageSummary || { totalCost: 25000 };

  // 1. Weather Card Render
  const weatherCard = document.getElementById('output-weather-card');
  if (weatherCard) {
    weatherCard.innerHTML = `
      <div style="font-size: 2.2rem; line-height: 1;">${weather.icon}</div>
      <div style="flex: 1; min-width: 0;">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap;">
          <div style="font-weight: 800; color: var(--text-dark); font-size: 1.05rem;">
            ${weather.temperatureC}°C <span style="font-size: 0.8rem; font-weight: 500; color: var(--text-muted);">(${weather.temperatureF}°F)</span>
          </div>
          <span style="background: #EFF6FF; color: #1D4ED8; font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 9999px;">
            Live Weather
          </span>
        </div>
        <div style="font-size: 0.82rem; font-weight: 600; color: var(--primary-blue-dark); margin-top: 2px;">
          ${weather.condition} &bull; Humidity: ${weather.humidity}
        </div>
        <div style="font-size: 0.76rem; color: var(--text-muted); margin-top: 3px; line-height: 1.3;">
          💡 ${weather.advisory}
        </div>
      </div>
    `;
  }

  // 2. Currency Switcher Card Render
  const currencyCard = document.getElementById('output-currency-card');
  if (currencyCard) {
    currencyCard.innerHTML = `
      <div>
        <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
          <span style="font-weight: 700; color: #831843; font-size: 0.85rem;">Total Trip Quotation</span>
        </div>
        <div id="converted-total-display" style="font-size: 1.35rem; font-weight: 800; color: #9D174D; margin-top: 2px;">
          ${currency.formattedString}
        </div>
      </div>
      <div>
        <label for="currency-switcher-select" style="font-size: 0.72rem; color: var(--text-muted); display: block; margin-bottom: 2px;">Convert Currency:</label>
        <select id="currency-switcher-select" class="form-select" style="padding: 5px 10px; font-size: 0.82rem; width: auto; font-weight: 600;">
          <option value="INR" ${currency.currency === 'INR' ? 'selected' : ''}>INR (₹)</option>
          <option value="USD" ${currency.currency === 'USD' ? 'selected' : ''}>USD ($)</option>
          <option value="EUR" ${currency.currency === 'EUR' ? 'selected' : ''}>EUR (€)</option>
          <option value="GBP" ${currency.currency === 'GBP' ? 'selected' : ''}>GBP (£)</option>
          <option value="AED" ${currency.currency === 'AED' ? 'selected' : ''}>AED (AED)</option>
        </select>
      </div>
    `;

    const currencySwitchSelect = document.getElementById('currency-switcher-select');
    if (currencySwitchSelect) {
      currencySwitchSelect.addEventListener('change', (e) => {
        const targetCode = e.target.value;
        if (currentMasterPlan) currentMasterPlan.currencyCode = targetCode;
        if (currentTripSubject) {
          currentTripSubject.notify('CURRENCY_CHANGED', { targetCurrency: targetCode }, {
            itinerary: masterPlan.itinerary,
            packageSummary: masterPlan.packageSummary,
            weather: masterPlan.weather
          });
        }
      });
    }
  }

  // 3. Digital Booking Ticket Card Render
  const gdsCard = document.getElementById('output-gds-card');
  if (gdsCard) {
    gdsCard.innerHTML = `
      <div>
        <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
          <span style="font-weight: 700; color: #1E3A8A; font-size: 0.85rem;">Booking Confirmation</span>
        </div>
        <div style="font-size: 0.95rem; font-weight: 800; color: #1E40AF; margin-top: 2px;">
          PNR: <span style="font-family: monospace; background: #DBEAFE; padding: 2px 6px; border-radius: 4px; font-size: 0.95rem;">${bookingTicket.pnrLocator}</span>
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">Ref: ${bookingTicket.bookingReference}</div>
      </div>
      <div style="text-align: right;">
        <span style="background: #DCFCE7; color: #15803D; font-size: 0.75rem; font-weight: 800; padding: 3px 8px; border-radius: 6px; display: inline-block;">
          ✓ ${bookingTicket.status}
        </span>
      </div>
    `;
  }
}

/**
 * Render Interactive Decorated Add-on Packages (Decorator Pattern)
 */
function renderDecoratedAddons(packageSummary, itinerary, subject = null) {
  const container = document.getElementById('output-addons-container');
  if (!container || !packageSummary) return;

  const appliedDecorators = Array.isArray(packageSummary.appliedDecorators) ? packageSummary.appliedDecorators : [];
  const perks = Array.isArray(packageSummary.perks) ? packageSummary.perks : [];

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; border-bottom: 1px solid rgba(180, 83, 9, 0.15); padding-bottom: 10px;">
      <div>
        <h3 style="font-size: 1.15rem; font-weight: 800; color: #92400E; margin: 0; display: flex; align-items: center; gap: 8px;">
          <span>🛡️ Trip Protection & Package Add-ons</span>
        </h3>
        <p style="font-size: 0.82rem; color: #B45309; margin: 3px 0 0 0;">
          Select optional travel coverage, carbon offsetting, and concierge assistance for your holiday.
        </p>
      </div>
      <span style="background: #FEF3C7; color: #92400E; border: 1px solid #FDE68A; font-size: 0.76rem; font-weight: 800; padding: 4px 12px; border-radius: 9999px;">
        +₹${(packageSummary.addonsCost || 0).toLocaleString('en-IN')} Add-ons
      </span>
    </div>

    <!-- Interactive Decorated Add-ons Grid with Checkbox Toggles -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; margin-bottom: 14px;">
      ${ALL_AVAILABLE_ADDONS.map(addon => {
        const isApplied = appliedDecorators.some(d => d.decoratorClass === addon.decoratorClass || d.name === addon.name);
        return `
          <label style="
            display: flex;
            align-items: flex-start;
            gap: 12px;
            background: ${isApplied ? '#FFFBEB' : '#FFFFFF'};
            border: 2px solid ${isApplied ? '#FDE68A' : '#E2E8F0'};
            border-radius: 10px;
            padding: 14px;
            cursor: pointer;
            box-shadow: ${isApplied ? '0 2px 8px rgba(180, 83, 9, 0.08)' : 'none'};
            transition: all 0.2s ease;
          ">
            <input type="checkbox" class="addon-toggle-cb" data-addon-id="${addon.id}" ${isApplied ? 'checked' : ''} style="width: 18px; height: 18px; margin-top: 2px; cursor: pointer; accent-color: #B45309;" />
            <div style="flex: 1;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                <strong style="color: #78350F; font-size: 0.9rem;">${addon.name}</strong>
                <span style="font-weight: 800; color: #92400E; font-size: 0.88rem; white-space: nowrap;">+₹${addon.cost.toLocaleString('en-IN')}</span>
              </div>
              <p style="font-size: 0.8rem; color: #92400E; margin: 5px 0 6px 0; line-height: 1.35;">
                ${addon.description}
              </p>
              <div style="font-size: 0.72rem; color: #78350F; background: rgba(254, 243, 199, 0.8); padding: 3px 6px; border-radius: 4px; display: inline-block;">
                • ${addon.perk}
              </div>
            </div>
          </label>
        `;
      }).join('')}
    </div>

    <!-- Active Package Perks Strip -->
    ${perks.length > 0 ? `
      <div style="background: #FEF3C7; border-radius: 8px; padding: 10px 14px; font-size: 0.82rem; color: #78350F;">
        <strong>Included Travel Benefits:</strong>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px;">
          ${perks.map(perk => `<span style="background: rgba(255,255,255,0.85); border: 1px solid #FCD34D; padding: 3px 8px; border-radius: 6px; font-weight: 600;">✓ ${perk}</span>`).join('')}
        </div>
      </div>
    ` : `
      <div style="background: #F8FAFC; border: 1px dashed #CBD5E1; border-radius: 8px; padding: 8px 12px; font-size: 0.8rem; color: var(--text-muted);">
        💡 Select any add-on above to attach protection guarantees or VIP services to your booking.
      </div>
    `}
  `;

  // Attach toggle listeners (Decorator pattern)
  if (subject) {
    container.querySelectorAll('.addon-toggle-cb').forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        const addonId = checkbox.getAttribute('data-addon-id');
        const addonDef = ALL_AVAILABLE_ADDONS.find(a => a.id === addonId);
        if (addonDef) {
          if (!Array.isArray(packageSummary.appliedDecorators)) {
            packageSummary.appliedDecorators = [];
          }
          const existingIndex = packageSummary.appliedDecorators.findIndex(
            d => d.decoratorClass === addonDef.decoratorClass || d.name === addonDef.name
          );
          const wasActive = existingIndex >= 0;
          if (wasActive) {
            const removed = packageSummary.appliedDecorators.splice(existingIndex, 1)[0];
            const costDiff = removed.additionalCost || addonDef.cost || 0;
            packageSummary.addonsCost = Math.max(0, (packageSummary.addonsCost || 0) - costDiff);
            packageSummary.totalCost = Math.max(0, (packageSummary.totalCost || 0) - costDiff);
            packageSummary.activeAddon = packageSummary.appliedDecorators.length > 0;
          } else {
            packageSummary.appliedDecorators.push({
              decoratorClass: addonDef.decoratorClass,
              name: addonDef.name,
              additionalCost: addonDef.cost,
              perk: addonDef.perk
            });
            packageSummary.addonsCost = (packageSummary.addonsCost || 0) + addonDef.cost;
            packageSummary.totalCost = (packageSummary.totalCost || 0) + addonDef.cost;
            packageSummary.activeAddon = true;
          }

          subject.notify("ADDON_TOGGLED", {
            addonName: addonDef.name,
            active: !wasActive,
            newTotal: packageSummary.totalCost
          }, {
            itinerary: currentMasterPlan.itinerary,
            packageSummary: packageSummary,
            weather: currentMasterPlan.weather
          });
          subject.notify("COST_UPDATED", { newTotal: packageSummary.totalCost }, {
            itinerary: currentMasterPlan.itinerary,
            packageSummary: packageSummary,
            weather: currentMasterPlan.weather
          });

          refreshAllOutputViews();
        }
      });
    });
  }
}

/**
 * Render Itinerary Details into HTML DOM
 */
function renderItineraryDetails(itinerary, packageSummary = null, masterPlan = null) {
  const info = itinerary.destinationInfo || {};
  const totalCostWithAddons = packageSummary ? packageSummary.totalCost : (itinerary.costBreakdown ? itinerary.costBreakdown.totalEstimatedCost : itinerary.budget);

  // Destination Header
  const destNameEl = document.getElementById('output-dest-name');
  if (destNameEl) destNameEl.textContent = itinerary.destination;

  const destTaglineEl = document.getElementById('output-dest-tagline');
  if (destTaglineEl) destTaglineEl.textContent = info.tagline || 'Custom Travel Itinerary';

  const destDescEl = document.getElementById('output-dest-desc');
  if (destDescEl) destDescEl.textContent = info.description || '';

  const heroImgEl = document.getElementById('output-hero-img');
  if (heroImgEl && info.image) {
    heroImgEl.src = info.image;
    heroImgEl.alt = `${itinerary.destination} Background`;
  }

  // Summary Tiles
  const modeVal = document.getElementById('sum-transport');
  if (modeVal) modeVal.textContent = itinerary.transportation;

  const accVal = document.getElementById('sum-accommodation');
  if (accVal) accVal.textContent = itinerary.accommodation;

  const budgetVal = document.getElementById('sum-budget');
  if (budgetVal) budgetVal.textContent = `₹${(itinerary.budget || 0).toLocaleString('en-IN')}`;

  const durationVal = document.getElementById('sum-duration');
  if (durationVal) durationVal.textContent = `${itinerary.duration} Days`;

  const travelersVal = document.getElementById('sum-travelers');
  const travelersCount = itinerary.travelers || 1;
  if (travelersVal) travelersVal.textContent = `${travelersCount} ${travelersCount === 1 ? 'Person' : 'Persons'}`;

  const paceVal = document.getElementById('sum-pace');
  if (paceVal) paceVal.textContent = itinerary.pace || 'Moderate';

  // Selected Attraction Chips
  const attractionsContainer = document.getElementById('output-attractions-chips');
  if (attractionsContainer && Array.isArray(itinerary.attractions)) {
    attractionsContainer.innerHTML = itinerary.attractions.map(attr => 
      `<span class="dest-tag" style="font-size: 0.85rem; padding: 6px 14px;">${attr}</span>`
    ).join(' ');
  }

  // Day-wise Timeline Render with Custom Activity Additions
  const timelineContainer = document.getElementById('output-timeline-list');
  if (timelineContainer && Array.isArray(itinerary.dayWisePlan)) {
    timelineContainer.innerHTML = itinerary.dayWisePlan.map(day => `
      <div class="glass-card day-card" style="position: relative;">
        <div class="day-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
          <div>
            <span class="day-number">Day ${day.day}</span>
            <span class="day-title">${day.title}</span>
          </div>
          <button type="button" class="btn btn-secondary add-stop-btn no-print" data-day="${day.day}" style="padding: 4px 10px; font-size: 0.78rem; display: inline-flex; align-items: center; gap: 4px; background: #FFFFFF; border-color: #CBD5E1;">
            <span>+ Add Activity</span>
          </button>
        </div>
        <div class="day-schedule">
          <div class="schedule-block">
            <span class="schedule-time">🌅 Morning:</span>
            <span class="schedule-desc">${day.morning}</span>
          </div>
          <div class="schedule-block">
            <span class="schedule-time">☀️ Afternoon:</span>
            <span class="schedule-desc">${day.afternoon}</span>
          </div>
          <div class="schedule-block">
            <span class="schedule-time">🌙 Evening:</span>
            <span class="schedule-desc">${day.evening}</span>
          </div>

          ${Array.isArray(day.customActivities) && day.customActivities.length > 0 ? `
            <div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed #CBD5E1;">
              <div style="font-size: 0.75rem; font-weight: 700; color: var(--primary-blue-dark); text-transform: uppercase; margin-bottom: 6px;">
                Custom Additions (${day.customActivities.length}):
              </div>
              <div style="display: flex; flex-direction: column; gap: 6px;">
                ${day.customActivities.map((act, idx) => `
                  <div style="display: flex; align-items: center; justify-content: space-between; background: #EEF2FF; border: 1px solid #C7D2FE; border-radius: 6px; padding: 6px 12px; font-size: 0.82rem;">
                    <span style="font-weight: 600; color: #3730A3;">
                      • ${act.title}
                      <span style="font-weight: 400; font-size: 0.74rem; opacity: 0.8; margin-left: 4px;">(${act.category || 'Sightseeing'})</span>
                    </span>
                    <button type="button" class="remove-stop-btn no-print" data-day="${day.day}" data-index="${idx}" style="background: none; border: none; color: #6366F1; cursor: pointer; font-size: 0.9rem; padding: 0 4px;" title="Remove this stop">✕</button>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `).join('');

    // Wire Add Stop buttons
    timelineContainer.querySelectorAll('.add-stop-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const dayNum = Number(btn.getAttribute('data-day'));
        const suggestions = [
          "Sunset Boat Cruise",
          "Heritage Latin Quarter Walk",
          "Artisan Spice Plantation Tour",
          "Local Street Food Crawl",
          "Panoramic Viewpoint Visit",
          "Scenic Coastal Cycling"
        ];
        const randomPick = suggestions[Math.floor(Math.random() * suggestions.length)];
        const inputTitle = prompt(`Add a custom activity to Day ${dayNum}:\n(e.g., "${randomPick}")`, randomPick);

        if (inputTitle && inputTitle.trim()) {
          const day = itinerary.dayWisePlan?.find(d => d.day === dayNum);
          if (day) {
            if (!Array.isArray(day.customActivities)) day.customActivities = [];
            day.customActivities.push({
              title: inputTitle.trim(),
              category: "Custom Activity"
            });
            if (currentTripSubject) {
              currentTripSubject.notify("ACTIVITY_MODIFIED", {
                dayNumber: dayNum,
                action: "added",
                title: inputTitle.trim()
              }, {
                itinerary: currentMasterPlan.itinerary,
                packageSummary: currentMasterPlan.packageSummary,
                weather: currentMasterPlan.weather
              });
            }
            refreshAllOutputViews();
          }
        }
      });
    });

    // Wire Remove Stop buttons
    timelineContainer.querySelectorAll('.remove-stop-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const dayNum = Number(btn.getAttribute('data-day'));
        const index = Number(btn.getAttribute('data-index'));
        const day = itinerary.dayWisePlan?.find(d => d.day === dayNum);
        if (day && Array.isArray(day.customActivities) && day.customActivities[index]) {
          const removed = day.customActivities.splice(index, 1)[0];
          if (currentTripSubject) {
            currentTripSubject.notify("ACTIVITY_MODIFIED", {
              dayNumber: dayNum,
              action: "removed",
              title: removed?.title || "activity"
            }, {
              itinerary: currentMasterPlan.itinerary,
              packageSummary: currentMasterPlan.packageSummary,
              weather: currentMasterPlan.weather
            });
          }
          refreshAllOutputViews();
        }
      });
    });
  }

  // Cost Breakdown Render
  const costs = itinerary.costBreakdown || {};
  const costGrid = document.getElementById('output-cost-grid');
  if (costGrid) {
    const isWithinBudget = totalCostWithAddons <= (itinerary.budget || Infinity);
    const roomsCount = Math.ceil(travelersCount / 2);
    const perPersonCost = Math.round(totalCostWithAddons / travelersCount);
    const durationDays = itinerary.duration || 1;
    const addonsCost = packageSummary ? (packageSummary.addonsCost || 0) : 0;

    const budgetStatusBadge = isWithinBudget 
      ? `<div style="grid-column: 1 / -1; background: #e6fffa; border: 1px solid #38b2ac; border-radius: 8px; padding: 12px 16px; display: flex; align-items: center; gap: 10px; color: #234e52; font-size: 0.9rem; font-weight: 600; margin-bottom: 8px;">
          <span>✅ <strong>Budget Guarantee:</strong> Total package cost for ${travelersCount} traveler(s) (₹${totalCostWithAddons.toLocaleString('en-IN')}) is 100% within your target budget (₹${(itinerary.budget || 0).toLocaleString('en-IN')}).</span>
         </div>`
      : '';

    const optimizationNoteHtml = costs.isBudgetOptimized && costs.optimizationMessage
      ? `<div style="grid-column: 1 / -1; background: #fffaf0; border: 1px solid #dd6b20; border-radius: 8px; padding: 10px 14px; color: #7b341e; font-size: 0.85rem; font-weight: 500;">
          💡 <strong>Note:</strong> ${costs.optimizationMessage}
         </div>`
      : '';

    // Itemized details fallback calculations
    const att = costs.attractionsDetails || {
      entryTickets: Math.round((costs.attractionsCost || 0) * 0.45),
      guidedTours: Math.round((costs.attractionsCost || 0) * 0.30),
      activityPermits: Math.round((costs.attractionsCost || 0) * 0.25)
    };

    const food = costs.foodDetails || {
      breakfast: Math.round((costs.foodAndMiscCost || 0) * 0.25),
      lunch: Math.round((costs.foodAndMiscCost || 0) * 0.35),
      dinner: Math.round((costs.foodAndMiscCost || 0) * 0.30),
      snacksBeverages: Math.round((costs.foodAndMiscCost || 0) * 0.10)
    };

    const trans = costs.transportDetails || {
      mainTransit: Math.round((costs.travelCost || 0) * 0.80),
      localCommute: Math.round((costs.travelCost || 0) * 0.20),
      mode: itinerary.transportation || 'Transit'
    };

    const acc = costs.accommodationDetails || {
      nightlyRoomRate: Math.round((costs.accommodationCost || 0) / (durationDays * roomsCount)),
      totalRooms: roomsCount,
      totalNights: durationDays,
      stayType: itinerary.accommodation || 'Hotel'
    };

    const daily = costs.dailyPerPerson || {
      foodPerDayPerson: Math.round((costs.foodAndMiscCost || 0) / (durationDays * travelersCount)),
      sightseeingPerDayPerson: Math.round((costs.attractionsCost || 0) / (durationDays * travelersCount)),
      totalDailyPerson: Math.round(((costs.foodAndMiscCost || 0) + (costs.attractionsCost || 0)) / (durationDays * travelersCount))
    };

    costGrid.innerHTML = `
      ${budgetStatusBadge}
      <div class="cost-item">
        <div class="cost-label">✈️ Transport (${travelersCount} Return ${travelersCount === 1 ? 'Ticket' : 'Tickets'})</div>
        <div class="cost-val">₹${(costs.travelCost || 0).toLocaleString('en-IN')}</div>
      </div>
      <div class="cost-item">
        <div class="cost-label">🏨 Accommodation (${durationDays} Nights, ${roomsCount} ${roomsCount === 1 ? 'Room' : 'Rooms'})</div>
        <div class="cost-val">₹${(costs.accommodationCost || 0).toLocaleString('en-IN')}</div>
      </div>
      <div class="cost-item">
        <div class="cost-label">🎟️ Sightseeing & Activities (${travelersCount} ${travelersCount === 1 ? 'Person' : 'Persons'})</div>
        <div class="cost-val">₹${(costs.attractionsCost || 0).toLocaleString('en-IN')}</div>
      </div>
      <div class="cost-item">
        <div class="cost-label">🍲 Food & Daily Meals (${travelersCount} ${travelersCount === 1 ? 'Person' : 'Persons'})</div>
        <div class="cost-val">₹${(costs.foodAndMiscCost || 0).toLocaleString('en-IN')}</div>
      </div>

      ${addonsCost > 0 ? `
        <div class="cost-item" style="background: #FFFBEB; border-color: #FDE68A;">
          <div class="cost-label" style="color: #92400E; font-weight: 700;">
            🛡️ Trip Protection & Add-ons
            <span style="display: block; font-size: 0.78rem; font-weight: 500; color: #B45309;">Insurance, Carbon Offsets, VIP Butler</span>
          </div>
          <div class="cost-val" style="color: #92400E;">+₹${addonsCost.toLocaleString('en-IN')}</div>
        </div>
      ` : ''}

      <div class="cost-item" style="grid-column: 1 / -1; background: var(--primary-blue-light); border-color: var(--primary-blue);">
        <div class="cost-label" style="color: var(--primary-blue-dark); font-weight: 800; font-size: 1.05rem;">
          💰 Grand Total Package Cost (${travelersCount} ${travelersCount === 1 ? 'Traveler' : 'Travelers'})
          <span style="display: block; font-size: 0.85rem; font-weight: 600; opacity: 0.85; margin-top: 2px;">(~₹${perPersonCost.toLocaleString('en-IN')} per person for ${durationDays} days)</span>
        </div>
        <div class="cost-val" style="color: var(--primary-blue-dark); font-size: 1.55rem; font-weight: 800;">₹${totalCostWithAddons.toLocaleString('en-IN')}</div>
      </div>
      ${optimizationNoteHtml}

      <!-- Detailed Itemized Expense Breakdown Container -->
      <div style="grid-column: 1 / -1; margin-top: 16px; background: rgba(255, 255, 255, 0.95); border: 1px solid rgba(0, 0, 0, 0.08); border-radius: 12px; padding: 22px;">
        <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-dark); margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          Detailed Itemized Cost Breakdown
        </h4>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
          <!-- 1. Sightseeing & Activities -->
          <div style="background: var(--bg-neutral); padding: 16px; border-radius: 10px; border: 1px solid #E5E7EB;">
            <div style="font-weight: 700; color: var(--primary-blue-dark); font-size: 0.95rem; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
              <span>🎟️ Sightseeing & Activities</span>
              <span style="font-weight: 800; color: var(--text-dark);">₹${(costs.attractionsCost || 0).toLocaleString('en-IN')}</span>
            </div>
            <ul style="font-size: 0.85rem; color: var(--text-muted); list-style: none; padding: 0; display: flex; flex-direction: column; gap: 6px;">
              <li style="display: flex; justify-content: space-between;">
                <span>• Monument & Attraction Passes</span>
                <strong>₹${att.entryTickets.toLocaleString('en-IN')}</strong>
              </li>
              <li style="display: flex; justify-content: space-between;">
                <span>• Guided Tours & Local Guides</span>
                <strong>₹${att.guidedTours.toLocaleString('en-IN')}</strong>
              </li>
              <li style="display: flex; justify-content: space-between;">
                <span>• Activity Permits & Entry Fees</span>
                <strong>₹${att.activityPermits.toLocaleString('en-IN')}</strong>
              </li>
              <li style="display: flex; justify-content: space-between; border-top: 1px dashed #CBD5E1; padding-top: 6px; margin-top: 4px; color: var(--text-dark); font-weight: 600;">
                <span>Daily Activity / Person</span>
                <span>₹${daily.sightseeingPerDayPerson.toLocaleString('en-IN')} / day</span>
              </li>
            </ul>
          </div>

          <!-- 2. Food & Daily Meals -->
          <div style="background: var(--bg-neutral); padding: 16px; border-radius: 10px; border: 1px solid #E5E7EB;">
            <div style="font-weight: 700; color: var(--primary-blue-dark); font-size: 0.95rem; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
              <span>🍲 Food & Dining Expenses</span>
              <span style="font-weight: 800; color: var(--text-dark);">₹${(costs.foodAndMiscCost || 0).toLocaleString('en-IN')}</span>
            </div>
            <ul style="font-size: 0.85rem; color: var(--text-muted); list-style: none; padding: 0; display: flex; flex-direction: column; gap: 6px;">
              <li style="display: flex; justify-content: space-between;">
                <span>• Daily Morning Breakfasts</span>
                <strong>₹${food.breakfast.toLocaleString('en-IN')}</strong>
              </li>
              <li style="display: flex; justify-content: space-between;">
                <span>• Afternoon Lunches & Meals</span>
                <strong>₹${food.lunch.toLocaleString('en-IN')}</strong>
              </li>
              <li style="display: flex; justify-content: space-between;">
                <span>• Evening Dinners & Dining Out</span>
                <strong>₹${food.dinner.toLocaleString('en-IN')}</strong>
              </li>
              <li style="display: flex; justify-content: space-between;">
                <span>• Local Snacks, Tea & Beverages</span>
                <strong>₹${food.snacksBeverages.toLocaleString('en-IN')}</strong>
              </li>
              <li style="display: flex; justify-content: space-between; border-top: 1px dashed #CBD5E1; padding-top: 6px; margin-top: 4px; color: var(--text-dark); font-weight: 600;">
                <span>Daily Food / Person</span>
                <span>₹${daily.foodPerDayPerson.toLocaleString('en-IN')} / day</span>
              </li>
            </ul>
          </div>

          <!-- 3. Transport & Commute -->
          <div style="background: var(--bg-neutral); padding: 16px; border-radius: 10px; border: 1px solid #E5E7EB;">
            <div style="font-weight: 700; color: var(--primary-blue-dark); font-size: 0.95rem; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
              <span>✈️ Transportation & Commute</span>
              <span style="font-weight: 800; color: var(--text-dark);">₹${(costs.travelCost || 0).toLocaleString('en-IN')}</span>
            </div>
            <ul style="font-size: 0.85rem; color: var(--text-muted); list-style: none; padding: 0; display: flex; flex-direction: column; gap: 6px;">
              <li style="display: flex; justify-content: space-between;">
                <span>• Intercity Transit (${trans.mode})</span>
                <strong>₹${trans.mainTransit.toLocaleString('en-IN')}</strong>
              </li>
              <li style="display: flex; justify-content: space-between;">
                <span>• Local City Taxis, Auto & Transfers</span>
                <strong>₹${trans.localCommute.toLocaleString('en-IN')}</strong>
              </li>
              <li style="display: flex; justify-content: space-between; border-top: 1px dashed #CBD5E1; padding-top: 6px; margin-top: 4px; color: var(--text-dark); font-weight: 600;">
                <span>Round-Trip Cost / Person</span>
                <span>₹${Math.round((costs.travelCost || 0) / travelersCount).toLocaleString('en-IN')}</span>
              </li>
            </ul>
          </div>

          <!-- 4. Accommodation & Stay -->
          <div style="background: var(--bg-neutral); padding: 16px; border-radius: 10px; border: 1px solid #E5E7EB;">
            <div style="font-weight: 700; color: var(--primary-blue-dark); font-size: 0.95rem; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
              <span>🏨 Accommodation & Stay</span>
              <span style="font-weight: 800; color: var(--text-dark);">₹${(costs.accommodationCost || 0).toLocaleString('en-IN')}</span>
            </div>
            <ul style="font-size: 0.85rem; color: var(--text-muted); list-style: none; padding: 0; display: flex; flex-direction: column; gap: 6px;">
              <li style="display: flex; justify-content: space-between;">
                <span>• Stay Tier</span>
                <strong>${acc.stayType}</strong>
              </li>
              <li style="display: flex; justify-content: space-between;">
                <span>• Rooms Required</span>
                <strong>${acc.totalRooms} Room(s)</strong>
              </li>
              <li style="display: flex; justify-content: space-between;">
                <span>• Estimated Room Rate</span>
                <strong>₹${acc.nightlyRoomRate.toLocaleString('en-IN')} / night</strong>
              </li>
              <li style="display: flex; justify-content: space-between; border-top: 1px dashed #CBD5E1; padding-top: 6px; margin-top: 4px; color: var(--text-dark); font-weight: 600;">
                <span>Total Nights Booked</span>
                <span>${acc.totalNights} Night(s)</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Per Person Daily Summary Bar -->
        <div style="margin-top: 16px; background: #F0F7FF; border: 1px solid #BFDBFE; border-radius: 8px; padding: 12px 16px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; font-size: 0.88rem; color: #1E40AF;">
          <div>
            <strong>💡 Per-Person Daily Allowance:</strong> 
            Daily Meals: <strong>₹${daily.foodPerDayPerson.toLocaleString('en-IN')}</strong> | Daily Sightseeing: <strong>₹${daily.sightseeingPerDayPerson.toLocaleString('en-IN')}</strong>
          </div>
          <div style="font-weight: 700;">
            Total Daily Spend: <span style="font-size: 1rem; color: #1E3A8A;">₹${daily.totalDailyPerson.toLocaleString('en-IN')} / person / day</span>
          </div>
        </div>
      </div>
    `;
  }
}

/**
 * Render Dynamic Travel Pacing Strategy Switcher (Strategy Pattern)
 */
function renderPacingStrategySelector(masterPlan, strategyContext, subject = null) {
  const card = document.getElementById('output-pacing-strategy-card');
  if (!card || !strategyContext) return;

  const currentStrategy = strategyContext.getStrategy();
  const allStrategies = [
    {
      key: "Relaxed",
      name: "Relaxed & Leisure",
      badge: "Gentle",
      badgeBg: "#DCFCE7",
      badgeColor: "#15803D",
      icon: "🧘",
      walking: "3-5 km/day",
      rest: "4 hrs rest",
      desc: "Unhurried mornings, longer meals, and dedicated afternoon downtime."
    },
    {
      key: "Moderate",
      name: "Balanced Explorer",
      badge: "Balanced",
      badgeBg: "#DBEAFE",
      badgeColor: "#1E40AF",
      icon: "⚖️",
      walking: "6-9 km/day",
      rest: "2-3 hrs rest",
      desc: "Optimal balance between sightseeing and comfortable downtime."
    },
    {
      key: "Fast",
      name: "Fast-Paced Adventure",
      badge: "Active",
      badgeBg: "#FEF3C7",
      badgeColor: "#B45309",
      icon: "⚡",
      walking: "10-14 km/day",
      rest: "1 hr rest",
      desc: "Sunrise starts, high sightseeing density, and packed activity schedule."
    }
  ];

  card.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; border-bottom: 1px solid #E2E8F0; padding-bottom: 10px;">
      <div>
        <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--primary-blue-dark); margin: 0; display: flex; align-items: center; gap: 8px;">
          <span>🏃 Daily Travel Pace</span>
        </h3>
        <p style="font-size: 0.82rem; color: var(--text-muted); margin: 3px 0 0 0;">
          Select your travel style to adjust sightseeing density, walking distance, and scheduled downtime.
        </p>
      </div>
      <span style="background: #EEF2FF; color: #4F46E5; border: 1px solid #C7D2FE; font-size: 0.76rem; font-weight: 800; padding: 4px 12px; border-radius: 9999px;">
        Active: ${currentStrategy.name}
      </span>
    </div>

    <!-- Strategy Options Cards -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px;">
      ${allStrategies.map(strat => {
        const isActive = currentStrategy.id === strat.key || currentStrategy.name.includes(strat.key);
        return `
          <button type="button" class="pacing-strategy-btn no-print" data-strategy-key="${strat.key}" style="
            display: flex;
            flex-direction: column;
            text-align: left;
            padding: 14px;
            background: ${isActive ? '#F0F9FF' : '#FFFFFF'};
            border: 2px solid ${isActive ? '#38BDF8' : '#E2E8F0'};
            border-radius: 10px;
            cursor: pointer;
            box-shadow: ${isActive ? '0 2px 8px rgba(56, 189, 248, 0.15)' : 'none'};
            transition: all 0.2s ease;
          ">
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 6px;">
              <span style="font-size: 1.2rem;">${strat.icon} <strong style="font-size: 0.95rem; color: #0F172A; margin-left: 4px;">${strat.name}</strong></span>
              <span style="background: ${strat.badgeBg}; color: ${strat.badgeColor}; font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 6px;">
                ${isActive ? '✓ Active' : strat.badge}
              </span>
            </div>
            <p style="font-size: 0.8rem; color: #64748B; margin: 0 0 8px 0; line-height: 1.35; flex: 1;">
              ${strat.desc}
            </p>
            <div style="display: flex; gap: 8px; font-size: 0.72rem; color: #475569; border-top: 1px dashed #E2E8F0; padding-top: 6px; width: 100%;">
              <span>🚶 ${strat.walking}</span>
              <span>•</span>
              <span>🛌 ${strat.rest}</span>
            </div>
          </button>
        `;
      }).join('')}
    </div>
  `;

  // Attach Strategy Switch Click Listeners (Strategy pattern)
  if (subject) {
    card.querySelectorAll('.pacing-strategy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-strategy-key');
        if (currentStrategy.id === key) return;

        strategyContext.setStrategy(key);
        strategyContext.regeneratePlan(masterPlan.itinerary);
        const activeStrategy = strategyContext.getStrategy();

        subject.notify("PACING_CHANGED", {
          newPacingKey: key,
          newPacingName: activeStrategy.name,
          intensity: activeStrategy.dailyIntensity
        }, {
          itinerary: masterPlan.itinerary,
          packageSummary: masterPlan.packageSummary,
          weather: masterPlan.weather
        });
        subject.notify("ACTIVITY_MODIFIED", {}, {
          itinerary: masterPlan.itinerary,
          packageSummary: masterPlan.packageSummary,
          weather: masterPlan.weather
        });

        refreshAllOutputViews();
      });
    });
  }
}

/**
 * Architecture & Design Patterns Inspector Section
 * Removed from UI per user request
 */
function renderAllFivePatternsInspector(masterPlan) {
  // Architecture inspector section completely removed from UI per user request
}


