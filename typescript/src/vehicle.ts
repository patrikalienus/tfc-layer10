import { VehicleType } from './calculator';

export abstract class Vehicle {
    protected registrationNumber: string;
    protected type: VehicleType;

    constructor(registrationNumber: string, type: VehicleType) {
        this.registrationNumber = registrationNumber;
        this.type = type;
    }

    public getType(): VehicleType {
        return this.type;
    }

    public getRegistrationNumber(): string {
        return this.registrationNumber;
    }
}

export class Car extends Vehicle {
    constructor(registrationNumber: string) {
        super(registrationNumber, 'Car');
    }
}

export class Motorbike extends Vehicle {
    constructor(registrationNumber: string) {
        super(registrationNumber, 'Motorbike');
    }
}