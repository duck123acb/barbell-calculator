let barbell = 45;

let plates = [];

class PlateStack {
    constructor(weight, number) {
        this.weight = weight;
        this.number = number;
    }
}

function calculateWeights(weight) {
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

function updatePlateList(plateValue, isChecked) {
	if (isChecked) {
		plates.push(plateValue);
		plates.sort((a, b) => b - a);
		return;
	}
	
	plates = plates.filter(p => p !== plateValue);
}

document.querySelectorAll('.plate input').forEach(input => {
	input.addEventListener('change', (event) => {
		updatePlateList(parseFloat(event.target.value), event.target.checked);
	});

	if (input.checked) {
		updatePlateList(parseFloat(input.value), event.target.checked;
	}
});
