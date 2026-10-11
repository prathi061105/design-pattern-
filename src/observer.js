/**
 * Smart Trip Planning System - Observer Design Pattern
 *
 * Pattern Classification: GoF Behavioral Design Pattern
 * GoF Intent: "Define a one-to-many dependency between objects so that when one object
 * changes state, all its dependents are notified and updated automatically."
 *
 * Components implemented:
 * 1. Observer Interface / Base Class: IObserver
 * 2. Subject / Observable: TripEventSubject
 * 3. Concrete Observers:
 *    - BudgetHealthObserver: Evaluates total cost against target budget and updates budget health UI.
 *    - CurrencyForexObserver: Synchronizes all monetary figures on the page upon currency conversion.
 *    - PackingReadinessObserver: Adapts packing items and readiness tips based on weather and activities.
 *    - NotificationToastObserver: Fires reactive visual toast messages for user actions and timeline updates.
 */

// -------------------------------------------------------------
// 1. OBSERVER INTERFACE
// -------------------------------------------------------------
export class IObserver {
  constructor(name = "AnonymousObserver") {
    this.name = name;
  }

  /**
   * Called by the Subject when a registered event occurs
   * @param {string} eventName - e.g. "COST_UPDATED", "CURRENCY_CHANGED", "ACTIVITY_MODIFIED", "STRATEGY_CHANGED"
   * @param {Object} eventData - payload containing changed properties
   * @param {Object} context - global trip state reference
   */
  update(eventName, eventData, context) {
    throw new Error("Method 'update()' must be implemented by concrete observer classes.");
  }
}

// -------------------------------------------------------------
// 2. SUBJECT / OBSERVABLE: TripEventSubject
// -------------------------------------------------------------
export class TripEventSubject {
  constructor() {
    this.observers = new Map(); // eventName -> Set of observers
    this.wildcardObservers = new Set(); // Observers subscribed to all events
  }

  /**
   * Register an observer for a specific event or all events ('*')
   * @param {string} eventName
   * @param {IObserver} observer
   */
  subscribe(eventName, observer) {
    if (!observer || typeof observer.update !== "function") {
      throw new Error("Subscriber must implement the update(eventName, eventData, context) method.");
    }
    if (eventName === "*") {
      this.wildcardObservers.add(observer);
      return;
    }
    if (!this.observers.has(eventName)) {
      this.observers.set(eventName, new Set());
    }
    this.observers.get(eventName).add(observer);
  }

  /**
   * Remove an observer
   */
  unsubscribe(eventName, observer) {
    if (eventName === "*") {
      this.wildcardObservers.delete(observer);
      return;
    }
    if (this.observers.has(eventName)) {
      this.observers.get(eventName).delete(observer);
    }
  }

  /**
   * Notify all interested observers with payload and context
   * @param {string} eventName
   * @param {Object} eventData
   * @param {Object} context
   */
  notify(eventName, eventData = {}, context = {}) {
    // Notify specific event subscribers
    if (this.observers.has(eventName)) {
      this.observers.get(eventName).forEach(obs => {
        try {
          obs.update(eventName, eventData, context);
        } catch (err) {
          console.error(`Error in observer '${obs.name}' for event '${eventName}':`, err);
        }
      });
    }

    // Notify wildcard subscribers
    this.wildcardObservers.forEach(obs => {
      try {
        obs.update(eventName, eventData, context);
      } catch (err) {
        console.error(`Error in wildcard observer '${obs.name}':`, err);
      }
    });
  }
}

// -------------------------------------------------------------
// 3. CONCRETE OBSERVER: BudgetHealthObserver
// Monitors whether customized expenses remain within user target limits
// -------------------------------------------------------------
export class BudgetHealthObserver extends IObserver {
  constructor(targetElementId = "budget-health-indicator") {
    super("BudgetHealthObserver");
    this.targetElementId = targetElementId;
  }

  update(eventName, eventData, context) {
    const itinerary = context.itinerary || {};
    const packageSummary = context.packageSummary || {};
    const targetBudget = Number(itinerary.budget) || 20000;
    const currentTotal = Number(packageSummary.totalCost) || Number(itinerary.costBreakdown?.totalEstimatedCost) || 0;

    const diff = targetBudget - currentTotal;
    const percentUsed = Math.round((currentTotal / targetBudget) * 100);

    let statusType = "safe"; // "safe" | "warning" | "exceeded"
    let statusText = "";
    let badgeColor = "#059669";
    let bgColor = "#ECFDF5";
    let borderColor = "#A7F3D0";

    if (diff >= 0) {
      if (percentUsed <= 85) {
        statusType = "safe";
        statusText = `Comfortably within target budget. ₹${diff.toLocaleString('en-IN')} unallocated (${percentUsed}% spent).`;
      } else {
        statusType = "warning";
        statusText = `Optimal budget utilization (${percentUsed}% allocated). Remaining buffer: ₹${diff.toLocaleString('en-IN')}.`;
        badgeColor = "#D97706";
        bgColor = "#FFFBEB";
        borderColor = "#FDE68A";
      }
    } else {
      statusType = "exceeded";
      const overBy = Math.abs(diff);
      statusText = `Current total exceeds initial budget target by ₹${overBy.toLocaleString('en-IN')} (${percentUsed}%). Consider adjusting add-ons or pacing.`;
      badgeColor = "#DC2626";
      bgColor = "#FEF2F2";
      borderColor = "#FECACA";
    }

    const el = document.getElementById(this.targetElementId);
    if (el) {
      el.style.display = "flex";
      el.style.background = bgColor;
      el.style.border = `1px solid ${borderColor}`;
      el.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; width: 100%;">
          <div style="font-size: 1.1rem;">${statusType === 'exceeded' ? '⚠️' : (statusType === 'warning' ? '💡' : '✅')}</div>
          <div style="flex: 1; min-width: 220px;">
            <div style="font-weight: 700; font-size: 0.88rem; color: ${badgeColor};">
              Budget Status: ${statusType.toUpperCase()}
            </div>
            <div style="font-size: 0.82rem; color: #374151; margin-top: 1px;">
              ${statusText}
            </div>
          </div>
          <div style="text-align: right; min-width: 120px;">
            <div style="font-size: 0.76rem; color: #6B7280;">Allocation</div>
            <div style="font-size: 0.95rem; font-weight: 800; color: ${badgeColor};">${percentUsed}%</div>
          </div>
        </div>
      `;
    }
  }
}

// -------------------------------------------------------------
// 4. CONCRETE OBSERVER: CurrencyForexObserver
// Synchronizes localized quotation outputs upon currency modification
// -------------------------------------------------------------
export class CurrencyForexObserver extends IObserver {
  constructor(currencyService, displayElementId = "converted-total-display") {
    super("CurrencyForexObserver");
    this.currencyService = currencyService;
    this.displayElementId = displayElementId;
  }

  update(eventName, eventData, context) {
    if (!this.currencyService) return;
    const currentTotal = context.packageSummary?.totalCost || context.itinerary?.costBreakdown?.totalEstimatedCost || 0;
    const targetCurrency = eventData.targetCurrency || context.currencyCode || "INR";

    const quote = this.currencyService.convertAndFormat(currentTotal, targetCurrency);
    const displayEl = document.getElementById(this.displayElementId);
    if (displayEl) {
      displayEl.textContent = quote.formattedString;
    }

    // Also update all currency-dependent data attributes if present
    const elements = document.querySelectorAll("[data-currency-format]");
    elements.forEach(elem => {
      const inrValue = Number(elem.getAttribute("data-inr-amount")) || 0;
      if (inrValue > 0) {
        const itemQuote = this.currencyService.convertAndFormat(inrValue, targetCurrency);
        elem.textContent = itemQuote.formattedString;
      }
    });
  }
}

// -------------------------------------------------------------
// 5. CONCRETE OBSERVER: PackingReadinessObserver
// Contextually recommends packing items based on destinations, weather, and schedule
// -------------------------------------------------------------
export class PackingReadinessObserver extends IObserver {
  constructor(containerElementId = "packing-advisor-container") {
    super("PackingReadinessObserver");
    this.containerElementId = containerElementId;
  }

  update(eventName, eventData, context) {
    const itinerary = context.itinerary || {};
    const weather = context.weather || {};
    const dest = itinerary.destination || "Destination";
    const pace = itinerary.pace || "Moderate";
    const attractions = Array.isArray(itinerary.attractions) ? itinerary.attractions : [];

    const items = [];

    // Weather-based items
    const tempC = weather.temperatureC || 26;
    if (tempC >= 28) {
      items.push({ icon: "☀️", name: "High-SPF Sunscreen & UV Sunglasses", reason: `Warm destination (${tempC}°C)` });
      items.push({ icon: "👕", name: "Breathable Cotton/Linen Outfits", reason: "Tropical comfort" });
    } else if (tempC <= 16) {
      items.push({ icon: "🧥", name: "Insulated Jacket & Thermal Layers", reason: `Cool climate (${tempC}°C)` });
      items.push({ icon: "🧣", name: "Woolen Scarf & Gloves", reason: "Morning/Evening chill" });
    } else {
      items.push({ icon: "🧥", name: "Light Cardigan or Windbreaker", reason: `Pleasant weather (${tempC}°C)` });
    }

    // Pacing items
    if (pace === "Packed") {
      items.push({ icon: "👟", name: "Cushioned Trekking/Walking Shoes", reason: "Active 12-16 km daily schedule" });
      items.push({ icon: "🔋", name: "High-Capacity 20,000mAh Power Bank", reason: "Full-day outdoor photography" });
    } else if (pace === "Relaxed") {
      items.push({ icon: "📖", name: "E-Reader / Book & Noise-Cancelling Audio", reason: "Dedicated leisure and cafe windows" });
      items.push({ icon: "🩴", name: "Comfortable Slip-ons / Resort Loungewear", reason: "Poolside and spa relaxation" });
    } else {
      items.push({ icon: "👟", name: "Versatile Walking Sneakers", reason: "Standard exploration pacing" });
    }

    // Attraction-based items
    if (attractions.includes("Beach") || dest === "Goa" || dest === "Andaman") {
      items.push({ icon: "🩱", name: "Quick-Dry Swimwear & Beach Towel", reason: "Waterfront activities" });
      items.push({ icon: "📱", name: "Waterproof Phone Pouch", reason: "Water sports & beach protection" });
    }
    if (attractions.includes("Adventure Sports") || attractions.includes("Mountains")) {
      items.push({ icon: "🎒", name: "Lightweight 15L Daypack", reason: "Day hikes and outdoor gear" });
    }
    if (attractions.includes("Museums") || attractions.includes("Culture")) {
      items.push({ icon: "🧦", name: "Modest Temple/Heritage Attire", reason: "Sacred sites and cultural entry" });
    }

    const container = document.getElementById(this.containerElementId);
    if (container) {
      container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
          <div>
            <h4 style="margin: 0; font-size: 1.05rem; font-weight: 800; color: var(--primary-blue-dark); display: flex; align-items: center; gap: 8px;">
              <span>🧳 Recommended Packing Checklist</span>
            </h4>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">
              Curated for <strong>${dest}</strong> (${tempC}°C, ${pace} pace)
            </div>
          </div>
          <span style="font-size: 0.78rem; font-weight: 700; color: #065F46; background: #ECFDF5; padding: 3px 10px; border-radius: 9999px; border: 1px solid #A7F3D0;">
            ${items.length} Travel Essentials
          </span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 10px;">
          ${items.map(it => `
            <div style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: rgba(255,255,255,0.8); border: 1px solid #E2E8F0; border-radius: 8px; font-size: 0.82rem;">
              <span style="font-size: 1.25rem;">${it.icon}</span>
              <div>
                <div style="font-weight: 700; color: var(--text-dark);">${it.name}</div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">${it.reason}</div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
  }
}

// -------------------------------------------------------------
// 6. CONCRETE OBSERVER: NotificationToastObserver
// Emits reactive visual notifications upon itinerary adjustments
// -------------------------------------------------------------
export class NotificationToastObserver extends IObserver {
  constructor(toastContainerId = "trip-toast-container") {
    super("NotificationToastObserver");
    this.toastContainerId = toastContainerId;
    this.ensureContainer();
  }

  ensureContainer() {
    let container = document.getElementById(this.toastContainerId);
    if (!container) {
      container = document.createElement("div");
      container.id = this.toastContainerId;
      container.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 99999;
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-width: 360px;
        pointer-events: none;
      `;
      document.body.appendChild(container);
    }
    return container;
  }

  update(eventName, eventData, context) {
    let message = "";
    let icon = "🔔";
    let themeBg = "#1E293B";

    switch (eventName) {
      case "PACING_CHANGED":
        message = `Pacing switched to '${eventData.newPacingName}'. Timeline updated.`;
        icon = "🧭";
        themeBg = "#047857";
        break;
      case "CURRENCY_CHANGED":
        message = `Currency changed to ${eventData.targetCurrency}. Fares refreshed.`;
        icon = "💱";
        themeBg = "#B45309";
        break;
      case "ADDON_TOGGLED":
        message = `${eventData.addonName} ${eventData.active ? 'added to' : 'removed from'} package.`;
        icon = eventData.active ? "🛡️" : "🗑️";
        themeBg = eventData.active ? "#065F46" : "#4B5563";
        break;
      case "ACTIVITY_MODIFIED":
        if (eventData.action === "added") {
          message = `Added "${eventData.title}" to Day ${eventData.dayNumber}`;
          icon = "📍";
          themeBg = "#1E40AF";
        } else if (eventData.action === "removed") {
          message = `Removed stop from Day ${eventData.dayNumber}`;
          icon = "🗑️";
          themeBg = "#4B5563";
        } else {
          message = `Schedule updated for Day ${eventData.dayNumber || ''}`;
          icon = "📅";
          themeBg = "#1E293B";
        }
        break;
      case "COST_UPDATED":
        return; // Silent update for cost recalculations, budget observer handles UI
      default:
        message = eventData.message || `Itinerary updated.`;
    }

    this.showToast(message, icon, themeBg);
  }

  showToast(message, icon = "ℹ️", bgColor = "#1E293B") {
    const container = this.ensureContainer();
    const toast = document.createElement("div");
    toast.style.cssText = `
      background: ${bgColor};
      color: #FFFFFF;
      padding: 10px 16px;
      border-radius: 8px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
      font-size: 0.85rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
      opacity: 0;
      transform: translateY(12px);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: auto;
    `;
    toast.innerHTML = `
      <span style="font-size: 1.1rem;">${icon}</span>
      <span style="line-height: 1.3;">${message}</span>
    `;

    container.appendChild(toast);

    // Fade-in
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0)";
    });

    // Auto fade-out
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(8px)";
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 250);
    }, 3200);
  }
}
