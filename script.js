let barbell;
let plates = [];

let weightDisplay = document.querySelector("#weight-display");
let weightInput = document.querySelector("#weight-input")
let barbellWeightDropdown = document.querySelector("#barbell-weight");
let barbellSides = document.querySelectorAll(".barbell-side");
let barbellDisplay = document.querySelector("#barbell");

class PlateStack {
    constructor(weight, number) {
        this.weight = weight;
        this.number = number;
    }
}

function calculateWeights(weight) {
    let remainingWeight = weight - barbell;

    if (remainingWeight < 0)
        return {error: "Target weight is less than the barbell itself!"};
    
    let result = [];
    let perSide = remainingWeight / 2;

    plates.forEach(plate => {
        let count = Math.floor(perSide / plate);
        if (count <= 0) {
            return;
        }

        result.push(new PlateStack(plate, count));
        perSide -= count * plate;
    });

    if (perSide !== 0) {
        return {
            error: `Could not match exact target with given plates. ${perSide} lbs leftover per side.`,
            plates: result
        }
    }

    return { plates: result };
}


function updatePlateList(plateWeight, isChecked) {
	if (isChecked) {
		plates.push(plateWeight);
		plates.sort((a, b) => b - a);
		return;
	}
	
	plates = plates.filter(p => p !== plateWeight);
}

function updateBarbellWeight(weight) {
    barbell = weight;
    let message = barbell + " lbs";
    weightDisplay.textContent = message;
    barbellDisplay.title = message;
}

function updateUI() {
    let weight = weightInput.value;
    let result = calculateWeights(weight);

    if (result.plates) {
        weightDisplay.textContent = weight + " lbs";
        
        barbellSides.forEach(side => {
            side.innerHTML = "";

            result.plates.forEach(plateStack => {
                for (let i = 0; i < plateStack.number; i++) {
                    const plate = document.createElement("div");
                    plate.classList.add("plate-shape", `plate-${plateStack.weight}`);
                    
                    plate.title = `${plateStack.weight} lbs`;
                    if (plateStack.weight === 1) // removing the 's' from lbs if its only 1 lb
                        plate.title = plate.title.slice(0, -1);

                    side.appendChild(plate);
                }
            });
        });

    }
    if (result.error)
        weightDisplay.textContent = result.error;
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
