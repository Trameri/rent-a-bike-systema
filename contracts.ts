export type Bike = { id: string; barcode: string; };
export type Contract = {
    id: string;
    bikes: Bike[];
    startTime: Date;
    endTime?: Date;
    price: number;
    paid: boolean;
    tariffType: "hourly" | "daily";
};

export function addBikeToContract(contract: Contract, bike: Bike) {
    contract.bikes.push(bike);
}

export function removeBikeFromContract(contract: Contract, bikeId: string) {
    contract.bikes = contract.bikes.filter(b => b.id !== bikeId);
}

export function changeBikeInContract(contract: Contract, oldBikeId: string, newBike: Bike) {
    removeBikeFromContract(contract, oldBikeId);
    addBikeToContract(contract, newBike);
}

export function calculatePrice(contract: Contract, currentTime: Date): number {
    const hours = Math.ceil((currentTime.getTime() - contract.startTime.getTime()) / 3600000);
    const hourlyRate = 5;
    const dailyRate = 25;
    let price = hours * hourlyRate;
    if (price > dailyRate) price = dailyRate;
    return price;
}
