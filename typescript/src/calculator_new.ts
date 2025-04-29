import { Vehicle } from './vehicle';

/**
 * Currently only 'Car' is implemented.
 */
export type VehicleType = 'Motorbike' | 'Tractor' | 'Emergency' | 'Diplomat' | 'Lorry' | 'Bus' | 'Car';

/**
 * List of vehicle types that are exempt from toll fees.
 * These vehicles can pass through toll stations without being charged.
 */
const TollFreeVehicles: readonly VehicleType[] = [
    'Motorbike',
    'Tractor',
    'Emergency',
    'Diplomat'
] as const;

/**
 * Main calculator class that handles all toll fee calculations.
 * Needs Time of passage, Vehicle type. Day of week, Special dates (holidays, July)
 */
export class TollFeeCalculator {
    /**
     * Calculates the total toll fee.
     * Implements the 60-minute rule and maximum daily fee cap.
     * 
     * @param vehicle - The vehicle passing through the toll
     * @param dates - Array of passage times for the day
     * @returns Total toll fee for the day (capped at 60 SEK)
     */
    public calculateTollFee(vehicle: Vehicle, dates: Date[]): number {
        if (dates.length === 0) return 0;
        
        // Sort dates chronologically
        const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
        let intervalStart = sortedDates[0];
        let totalFee = 0;
        let highestFeeInInterval = 0;

        for (const date of sortedDates) {
            const minutes = Math.floor((date.getTime() - intervalStart.getTime()) / (1000 * 60));
            const currentFee = this.getTollFeeForPassage(date, vehicle);
            
            console.log(`Date: ${date.toLocaleString()}, Fee: ${currentFee}`);

            // Set which fee to add.
            if (minutes <= 60) {
                highestFeeInInterval = Math.max(highestFeeInInterval, currentFee);
                console.log(`Within 60 minutes, highest fee so far: ${highestFeeInInterval}`);
            } else {
                totalFee += highestFeeInInterval;
                console.log(`New interval, adding ${highestFeeInInterval} to total (now ${totalFee})`);
                highestFeeInInterval = currentFee;
                intervalStart = date;
            }
        }
        
        totalFee += highestFeeInInterval;
        console.log(`Final total: ${totalFee}`);
        return Math.min(totalFee, 60);
    }

    /**
     * Checks if a vehicle is exempt from toll fees.
     * 
     * @param vehicle - The vehicle to check
     * @returns true if the vehicle is toll-free, false otherwise
     */
    private isTollFreeVehicle(vehicle: Vehicle): boolean {
        if (!vehicle) return false;
    
        const vehicleType = vehicle.getType();
        return Object.values(TollFreeVehicles).includes(vehicleType);
    }
    
    /**
     * Determines the toll fee for a single passage based on the time of day.
     * Implements fee schedule from Transportstyrelsen.
     * 
     * @param date - The date and time of passage
     * @param vehicle - The vehicle passing through
     * @returns The toll fee for the passage
     */
    private getTollFeeForPassage(date: Date, vehicle: Vehicle): number {
        if (this.isTollFreeDate(date) || this.isTollFreeVehicle(vehicle)) {
            return 0;
        }

        // Use local time
        const hour = date.getHours();
        const minute = date.getMinutes();
    
        if (hour === 6 && minute >= 0 && minute <= 29) return 9;    // 06:00–06:29
        else if (hour === 6 && minute >= 30 && minute <= 59) return 16;  // 06:30–06:59
        else if (hour === 7 && minute >= 0 && minute <= 59) return 22;  // 07:00–07:59
        else if (hour === 8 && minute >= 0 && minute <= 29) return 16;  // 08:00–08:29
        else if (hour >= 8 && hour <= 14) return 9;  // 08:30–14:59
        else if (hour === 15 && minute >= 0 && minute <= 29) return 16;  // 15:00–15:29
        else if (hour === 15 && minute >= 30) return 22;  // 15:30–15:59
        else if (hour === 16) return 22;  // 16:00–16:59
        else if (hour === 17 && minute >= 0 && minute <= 59) return 16;  // 17:00–17:59
        else if (hour === 18 && minute >= 0 && minute <= 29) return 9;  // 18:00–18:29
        else return 0;  // 18:30–05:59
    }
    
    /**
     * Checks if a date is toll-free.
     * Dates are toll-free on:
     * - Weekends (Saturday and Sunday)
     * - The month of July
     * - Public holidays
     * 
     * @param date - The date to check
     * @returns true if the date is toll-free, false otherwise
     */
    private isTollFreeDate(date: Date): boolean {
        // Use local time
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) return true; // Sunday or Saturday
    
        const month = date.getMonth();
        if (month === 6) return true; // July
    
        const year = date.getFullYear();
        const day = date.getDate();
    
        // Check for holidays
        const holidays = [
            [0, 1],
            [4, 1],
            [5, 6],
            [10, 2],
            [11, 24],
            [11, 25],
            [11, 26],
            [11, 31]
        ];
    
        return holidays.some(([m, d]) => month === m && day === d);
    }

    /**
     * Calculates the date of Easter for a given year.
     * 
     * @param year - The year to calculate Easter for
     * @returns The date of Easter Sunday
     */
    private calculateEaster(year: number): Date {
        // This is Gauss's Easter algorithm. I don't know how this works, but it does and everyone uses it so...
        
        const a = year % 19;
        const b = Math.floor(year / 100);
        const c = year % 100;
        const d = Math.floor(b / 4);
        const e = b % 4;
        const f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3);
        const h = (19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4);
        const k = c % 4;
        const l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);
        const month = Math.floor((h + l - 7 * m + 114) / 31);
        const day = ((h + l - 7 * m + 114) % 31) + 1;
        
        return new Date(year, month - 1, day);
    }
}