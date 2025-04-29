import { TollFeeCalculator } from './calculator.js';
import { Car } from './vehicle.js';

// Exampel
const calculator = new TollFeeCalculator();
const vehicle = new Car('ABC123');

// Exempel
const dates = [
  new Date('2024-04-28T06:15:00+02:00'), // Sunday (fee-free)
  new Date('2024-04-29T07:30:00+02:00'), // Monday morning (22 SEK)
  new Date('2024-04-29T08:15:00+02:00'), // Monday morning (16 SEK, within 60 minutes of previous)
  new Date('2024-04-29T14:45:00+02:00'), // Monday afternoon (9 SEK)
];

const totalFee = calculator.calculateTollFee(vehicle, dates);
console.log(`Total toll fee: ${totalFee} SEK`);

