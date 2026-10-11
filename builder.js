import {
  Itinerary,
  TripBuilder,
  CustomizedTripBuilder,
  TripDirector,
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
} from './src/builder.js';

export {
  Itinerary,
  TripBuilder,
  CustomizedTripBuilder,
  TripDirector,
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
