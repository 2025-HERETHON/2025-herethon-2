const textarea1 = document.getElementById("name");
textarea1.addEventListener("input", () => {
    if (textarea1.value.trim() !== "") {
    textarea1.classList.add("active");
    } else {
    textarea1.classList.remove("active");
    }
});

const textarea2 = document.getElementById("creater_name");
textarea2.addEventListener("input", () => {
    if (textarea2.value.trim() !== "") {
    textarea2.classList.add("active");
    } else {
    textarea2.classList.remove("active");
    }
});

const textarea3 = document.getElementById("challenge_detail");
textarea3.addEventListener("input", () => {
    if (textarea3.value.trim() !== "") {
    textarea3.classList.add("active");
    } else {
    textarea3.classList.remove("active");
    }
});

const inputs = [
    document.getElementById("name"),
    document.getElementById("creater_name"),
    document.getElementById("challenge_detail")
];
const addGroupbtn = document.getElementById("add_group");

function checkInputs() {
    const allFilled = inputs.every(input => input.value.trim() !== "");
    addGroupbtn.disabled = !allFilled;

    if (allFilled) {
    addGroupbtn.classList.add("enabled");
    addGroupbtn.classList.remove("disabled");
    } else {
    addGroupbtn.classList.add("disabled");
    addGroupbtn.classList.remove("enabled");
    }
}

inputs.forEach(input => {
    input.addEventListener("input", () => {
        checkInputs();
    });
});