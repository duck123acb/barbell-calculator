let barbell = 45

let plates = [45, 35, 25, 10, 5, 2.5]

class PlateStack {
    constructor(weight, number) {
        this.weight = weight;
        this.number = number;
    }
}

function CalculateWeights(weight) {
    let remainingWeight = weight - barbell;
    if (remainingWeight < 0) {
        console.log("Target weight is less than the barbell itself!");
        return [];
    }
    
    let result = [];
    let perSide = remainingWeight / 2;

    plates.forEach(plate => {
        let count = Math.floor(perSide / plate);
        if (count <= 0) {
            return;
        }

        result.push(new PlateStack(plate, count * 2));
        perSide -= count * plate;
    });

    if (perSide !== 0) {
        console.warn(`Could not match exact target with given plates. ${perSide} lbs leftover per side.`);
    }

    return result;
}