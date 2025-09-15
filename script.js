let barbell;
let plates = [];

let weightDisplay = document.querySelector("#weight-display");
let weightInput = document.querySelector("#weight-input")
let barbellWeightDropdown = document.querySelector("#barbell-weight");

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

function updatePlateList(plateWeight, isChecked) {
	if (isChecked) {
		plates.push(plateWeight);
		plates.sort((a, b) => b - a);
		return;
	}
	
	plates = plates.filter(p => p !== plateWeight);
}
function updateWeightDisplay(weight) {
    weightDisplay.textContent = weight + " lbs";
}
function updateBarbellWeight(weight) {
    barbell = weight;
    updateWeightDisplay(barbell);
}
function updateUI() {
    let weight = weightInput.value;
    let weightStack = calculateWeights(weight);
    updateWeightDisplay(weight);
}

document.querySelector("#calculate-btn").addEventListener("click", updateUI);
weightInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter")
        return;
    
    updateUI();
});
barbellWeightDropdown.addEventListener("change", (event) => {
    updateBarbellWeight(parseFloat(event.target.value));
});
document.querySelectorAll(".plate-label input").forEach(input => {
	input.addEventListener("change", (event) => {
		updatePlateList(parseFloat(event.target.value), event.target.checked);
	});

	if (input.checked) {
		updatePlateList(parseFloat(input.value), input.checked);
	}
});
updateBarbellWeight(barbellWeightDropdown.value);
