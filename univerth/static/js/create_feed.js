import { loadNavbar } from "./main.js";

window.addEventListener("DOMContentLoaded", async () => {
    // navbar 불러오기
    loadNavbar(".challenge-container");
});

const form = document.getElementById("feedForm");
form.addEventListener("submit", (e) => {
    e.preventDefault();  
});


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
        icon.src = icon.dataset.iconAdded;
    } else {
        icon.src = icon.dataset.iconNone;
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
    selectedFiles = selectedFiles.concat(newFiles).slice(0, 2);

    preview.innerHTML = "";

    photoCount.textContent = `${selectedFiles.length}/2`;

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

function getCSRFToken() {
    return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
}

addfeedbtn.addEventListener("click", async () => {
    const formData = new FormData();

    selectedFiles.forEach(file => {
        formData.append("image", file);
    })
    formData.append("content", contentInput.value);

    try {
        const response = await fetch(window.location.pathname, {
            method: "POST",
            headers: {
                "X-CSRFToken": getCSRFToken()
            },
            body: formData
        });
        
        if (response.redirected) {
            alert("피드가 등록되었습니다.");
            window.location.href = response.url;
        }
        else {
            alert("업로드를 실패하였습니다.");
        }
    }
    catch (err) {
        alert("오류가 발생하였습니다.");
    }
});