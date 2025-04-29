import { TollFeeCalculator, VehicleType } from './calculator';
import { Car, Vehicle } from './vehicle';

/**
 * Full disclosure: I vibe-coded this as it's just here to more easily show the logic working as intended.
 */


/**
 * User interface class for the toll fee calculator.
 * Handles all user interactions and displays the calculation results.
 */
class TollCalculatorUI {
    private calculator: TollFeeCalculator;
    private passages: HTMLDivElement;
    private addButton: HTMLButtonElement;
    private calculateButton: HTMLButtonElement;
    private resultDiv: HTMLDivElement;
    private feeAmount: HTMLDivElement;
    private vehicleSelect: HTMLSelectElement;

    /**
     * Initializes the UI components and sets up event listeners.
     * Called when the page loads.
     */
    constructor() {
        this.calculator = new TollFeeCalculator();
        this.passages = document.getElementById('passages-list') as HTMLDivElement;
        this.addButton = document.getElementById('add-passage') as HTMLButtonElement;
        this.calculateButton = document.getElementById('calculate') as HTMLButtonElement;
        this.resultDiv = document.getElementById('result') as HTMLDivElement;
        this.feeAmount = document.getElementById('fee-amount') as HTMLDivElement;
        this.vehicleSelect = document.getElementById('vehicle-type') as HTMLSelectElement;

        this.addButton.addEventListener('click', () => this.addPassage());
        this.calculateButton.addEventListener('click', () => this.calculateFee());
    }

    /**
     * Creates a vehicle instance based on the selected vehicle type.
     * 
     * @returns A new vehicle instance
     */
    private createVehicle(): Vehicle {
        const type = this.vehicleSelect.value as VehicleType;
        switch (type) {
            case 'Car':
            case 'Lorry':
            case 'Bus':
                return new Car('TEST123'); // All these types use the same toll rates as Car
            case 'Motorbike':
            case 'Tractor':
            case 'Emergency':
            case 'Diplomat':
                return new Car('TEST123'); // These are toll-free, but we still need a vehicle instance
            default:
                throw new Error(`Unsupported vehicle type: ${type}`);
        }
    }

    /**
     * Adds a new passage input field to the form.
     * Each passage consists of:
     * - A datetime input field
     * - A remove button
     * Passages can be added dynamically by the user.
     */
    private addPassage() {
        const passageDiv = document.createElement('div');
        passageDiv.className = 'flex items-center space-x-4';
        
        const datetime = document.createElement('input');
        datetime.type = 'datetime-local';
        datetime.className = 'flex-grow px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500';
        datetime.required = true;
        
        const removeButton = document.createElement('button');
        removeButton.innerHTML = '&times;';
        removeButton.className = 'bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600 transition-colors flex items-center justify-center text-xl';
        removeButton.addEventListener('click', () => passageDiv.remove());
        
        passageDiv.appendChild(datetime);
        passageDiv.appendChild(removeButton);
        this.passages.appendChild(passageDiv);
    }

    /**
     * Calculates and displays the toll fees.
     * The process:
     * 1. Collects all passage times
     * 2. Groups them by day
     * 3. Calculates fees for each day separately
     * 4. Displays the results in the UI
     */
    private calculateFee() {
        const datetimeInputs = this.passages.querySelectorAll('input[type="datetime-local"]');
        const dates = Array.from(datetimeInputs)
            .map(input => new Date((input as HTMLInputElement).value))
            .filter(date => !isNaN(date.getTime())); // Filter out invalid dates

        if (dates.length === 0) {
            alert('Please add at least one valid passage time.');
            return;
        }

        const vehicle = this.createVehicle();
        
        // Group dates by day
        const datesByDay = dates.reduce((acc, date) => {
            const dayKey = date.toLocaleDateString();
            if (!acc[dayKey]) {
                acc[dayKey] = [];
            }
            acc[dayKey].push(date);
            return acc;
        }, {} as Record<string, Date[]>);

        // Calculate fee for each day
        const dailyFees = Object.entries(datesByDay).map(([day, dayDates]) => {
            const fee = this.calculator.calculateTollFee(vehicle, dayDates);
            return { day, fee };
        });

        // Display results
        this.resultDiv.classList.remove('hidden');
        this.feeAmount.innerHTML = dailyFees
            .map(({ day, fee }) => `<div class="mb-2">${day}: <span class="font-bold">${fee} SEK</span></div>`)
            .join('');
    }
}

/**
 * Initializes the toll calculator UI when the page loads.
 * Creates a new instance of TollCalculatorUI and sets up the interface.
 */
document.addEventListener('DOMContentLoaded', () => {
    new TollCalculatorUI();
}); 