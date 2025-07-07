const textarea1 = document.getElementById("contenttext");
textarea1.addEventListener("input", () => {
    if (textarea1.value.trim() !== "") {
        textarea1.classList.add("active");
    } else {
        textarea1.classList.remove("active");
    }
});

const inputFile = document.getElementById("photoInput");

inputFile.addEventListener("change", () => {
    const hasFiles = inputFile.files.length > 0;

    const label = document.getElementById("photo-box");
    label.classList.toggle("active", hasFiles);

    const label2 = document.getElementById("photoCount");
    label2.classList.toggle("active", hasFiles);

    const icon = document.getElementById("photoicon");
    if (hasFiles) {
        icon.src = "../static/images/challenges/img5.svg";
    } else {
        icon.src = "../static/images/challenges/img6.svg";
    }
});

const photoInput = document.getElementById("photoInput");
const preview = document.getElementById("preview");
const photoCount = document.getElementById("photoCount");
const addfeedbtn = document.getElementById("addfeed");
const contentInput = document.getElementById("contenttext");

let selectedFiles = [];

photoInput.addEventListener("change", () => {
    const newFiles = Array.from(photoInput.files);
    selectedFiles = selectedFiles.concat(newFiles).slice(0, 4);

    preview.innerHTML = "";

    photoCount.textContent = `${selectedFiles.length}/4`;

    selectedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement("img");
            img.src = e.target.result;
            preview.appendChild(img);
        };
        reader.readAsDataURL(file);
    });

    photoInput.value = "";
    checkInputs();
});

function checkInputs() {
    const hasPhotos = selectedFiles.length > 0;
    const hasContent = contentInput.value.trim() !== "";

    const allFilled = hasPhotos && hasContent;
    addfeedbtn.disabled = !allFilled;

    if (allFilled) {
        addfeedbtn.classList.add("enabled");
        addfeedbtn.classList.remove("disabled");
    } else {
        addfeedbtn.classList.add("disabled");
        addfeedbtn.classList.remove("enabled");
    }
}

contentInput.addEventListener("input", checkInputs);