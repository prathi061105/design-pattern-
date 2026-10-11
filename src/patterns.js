/**
 * Smart Trip Planning System - Software Engineering Design Patterns Central Hub
 * 
 * Implemented GoF Design Patterns:
 * 1. Builder Pattern (Creational) - Constructs complex Itinerary objects step-by-step
 * 2. Factory Method Pattern (Creational) - Creates Transportation & Accommodation concrete services
 * 3. Decorator Pattern (Structural) - Dynamically layers travel protection & premium perks onto BaseTripPackage
 * 4. Facade Pattern (Structural) - Shields clients with a unified, simplified master API
 * 5. Strategy Pattern (Behavioral) - Interchangeable travel pacing algorithms (Relaxed, Balanced, Fast-Paced)
 * 6. Observer Pattern (Behavioral) - Reactive multi-subscriber notifications (BudgetHealth, Currency, Readiness, Toast)
 */

export * from './builder.js';
export * from './factory.js';
export * from './decorator.js';
export * from './facade.js';
export * from './strategy.js';
export * from './observer.js';
export * from './services.js';
