const PLATE_GAP_MAX = 100;
const PLATE_GAP_MIN = 20;
const PLATE_GAP_DECAY_FACTOR = 0.04;

const barbellOptions = [
    { lbs: 45, kg: 20 },
    { lbs: 35, kg: 15 },
    { lbs: 15, kg: 7 }
]
const plateOptions = [
    { lbs: 55, kg: 25 },
    { lbs: 45, kg: 20},
    { lbs: 35, kg: 15 },
    { lbs: 25, kg: 10 },
    { lbs: 10, kg: 5 },
    { lbs: 5, kg: 2.5 },
    { lbs: 2.5, kg: 1.25 },
    { lbs: 1, kg: 0.5 },
    { lbs: 0.5, kg: 0.25 }
]

let barbell;
let useablePlates = [];
let units = "lbs";

const weightDisplay = document.querySelector("#weight-display");
const weightInput = document.querySelector("#weight-input")
const barbellWeightDropdown = document.querySelector("#barbell-weight");
const barbellSides = document.querySelectorAll(".barbell-side");
const barbellDisplay = document.querySelector("#barbell");
const kgToggle = document.querySelector("#kg-toggle");
const plateLabels = document.querySelectorAll(".plate-label");

class PlateStack {
    constructor(weight, number) {
        this.weight = weight;
        this.number = number;
    }
}

function setUnits() {
    // weight dropdown
    Array.from(barbellWeightDropdown.children).forEach((option, i) => {
        const weight = barbellOptions[i][units]; 

        option.value = weight;
        option.textContent = weight + " " + units;
    });

    const selectedIndex = barbellWeightDropdown.selectedIndex;
    const newBarbellWeight = barbellOptions[selectedIndex][units];
    updateBarbellWeight(newBarbellWeight);

    // plates
    plateLabels.forEach((label, i) => {
        const weight = plateOptions[i][units];
        const message = weight + " " + units

        label.querySelector("input").value = weight;
        label.querySelector(".plate-shape").title = message;
        label.querySelector(".plate-text").textContent = message;
    });
}

function calculateWeights(weight) {
    let remainingWeight = weight - barbell;

    if (remainingWeight < 0)
        return {error: "Target weight is less than the barbell itself!"};
    
    let result = [];
    let perSide = remainingWeight / 2;

    useablePlates.forEach(plate => {
        let count = Math.floor(perSide / plate);
        if (count <= 0) {
            return;
        }

        result.push(new PlateStack(plate, count));
        perSide -= count * plate;
    });

    if (perSide !== 0) {
        return {
            error: `Could not match exact target with given plates. ${perSide} ${units} leftover per side.`,
            plates: result
        }
    }

    return { plates: result };
}


function updatePlateList(plateWeight, isChecked) {
	if (isChecked) {
		useablePlates.push(plateWeight);
		useablePlates.sort((a, b) => b - a);
		return;
	}
	
	useablePlates = useablePlates.filter(p => p !== plateWeight);
}

function updateBarbellWeight(weight) {
    barbell = weight;
    let message = barbell + " " + units;
    weightDisplay.textContent = message;
    barbellDisplay.title = message;
}

function updateUI() {
    let weight = weightInput.value;
    let result = calculateWeights(weight);
	console.log(weight, result);
    if (result.plates) {
        weightDisplay.textContent = weight  + " " + units;
        
        barbellSides.forEach(side => {
            side.innerHTML = "";

            result.plates.forEach(plateStack => {
                for (let i = 0; i < plateStack.number; i++) {
                    const plate = document.createElement("div");
                    plate.classList.add("plate-shape", `plate-${plateStack.weight}`);
                    
                    plate.title = plateStack.weight + " " + units;
                    if (plateStack.weight === 1 && units === "lbs") // removing the 's' from lbs if its only 1 lb
                        plate.title = plate.title.slice(0, -1);

                    side.appendChild(plate);
                }
            });
        });


        const sideWidth = barbellSides[0].offsetWidth;
        const barWidth = barbellDisplay.offsetWidth; // theoretically i think it could change
        const stackPercent = (sideWidth / barWidth) * 100;

        let gapValue = PLATE_GAP_MAX * Math.exp(-PLATE_GAP_DECAY_FACTOR * stackPercent); // exponential decay with stackPercent
        gapValue = Math.max(PLATE_GAP_MIN, Math.min(PLATE_GAP_MAX, gapValue)); // clamp value
        barbellDisplay.style.gap = `${gapValue}%`;
    }
    if (result.error) {
        weightDisplay.textContent = result.error;
	barbellSides.forEach(side => {
	    side.innerHTML = "";
	});
    }
}

kgToggle.addEventListener("click", () => {
    weightInput.value = "";
    updateUI();

    if (units === "lbs") {
        units = "kg";
        kgToggle.textContent = "Switch to lbs";
    }
    else {
        units = "lbs";
        kgToggle.textContent = "Switch to kg"
    }

    setUnits();
    plateLabels.forEach(plateLabel => { // might be hacky??
        let input = plateLabel.querySelector("input");
        updatePlateList(parseFloat(input.value), input.checked);
    });
});
document.querySelector("#calculate-btn").addEventListener("click", updateUI);
weightInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter")
        return;

    updateUI();
});
barbellWeightDropdown.addEventListener("change", (event) => {
    updateBarbellWeight(parseFloat(event.target.value));
});
plateLabels.forEach(plateLabel => {
    let input = plateLabel.querySelector("input");
	input.addEventListener("change", (event) => {
		updatePlateList(parseFloat(event.target.value), event.target.checked);
	});

	if (input.checked) {
		updatePlateList(parseFloat(input.value), input.checked);
	}
});
updateBarbellWeight(barbellWeightDropdown.value);
