import { loadNavbar } from "./main.js";

document.addEventListener('DOMContentLoaded', () => {
    const name = document.querySelector('.name');
    const address = document.querySelector('.address');
    const tags = document.querySelector('.tags');
    const add_btn = document.querySelector('.add_btn');
    const input_tags = document.querySelector('.input_tags');
    const tag_box = document.querySelector('.tag_box');
    const cencel = document.querySelector('.cencel');
    const check = document.querySelector('.check');
    const back = document.querySelector('.back');

    function updateInputBorder(input) {
        if (input.value.trim() !== "") {
            input.style.border = "1px solid #2CD7A6";
        } else {
            input.style.border = "";
        }
    }

    function checkInputs() {
        if (
            name.value.trim() !== '' &&
            address.value.trim() !== '' &&
            tags.value.trim() !== ''
        ) {
            add_btn.style.backgroundColor = "#2CD7A6";
        } else {
            add_btn.style.backgroundColor = "";
        }
    }

    [name, address, tags].forEach(input => {
        input.addEventListener('input', () => {
            updateInputBorder(input);
            checkInputs();
        });
    });

    tags.addEventListener('focus', () => {
        tag_box.style.display = 'block';
    });

    tags.addEventListener('click', () => {
    tag_box.style.display = 'block';
    });

    input_tags.addEventListener('click', () => {
    tag_box.style.display = 'block';
});

    cencel.addEventListener('click', () => {
        tag_box.style.display = 'none';
        tags.value = '';
        updateInputBorder(tags);
        checkInputs();

        tagButtons.forEach(button => {
        button.classList.remove('active');
    });
    });

    const tagButtons = document.querySelectorAll('.tag_box button:not(.cencel):not(.check)');

    tagButtons.forEach(button => {
        button.addEventListener('click', e => {
            e.preventDefault();
            let tagText = button.textContent.trim().replace(/^#\s*/, '');
            let currentTags = tags.value.split(',').map(t => t.trim()).filter(t => t.length > 0);

            if (button.classList.contains('active')) {
                button.classList.remove('active');
                currentTags = currentTags.filter(t => t !== tagText);
            } else {
                button.classList.add('active');
                currentTags.push(tagText);
            }

            tags.value = currentTags.join(', ');
            updateInputBorder(tags);
            checkInputs();
        });
    });

    check.addEventListener('click', () => {
        tag_box.style.display = 'none';
    });

    back.addEventListener('click', () => {
        window.location.href = 'map.html';
    });
});

document.querySelector('.tag_box').style.display = 'block';

const tags = document.getElementById("tags");
const tag_box = document.querySelector(".tag_box");

tags.addEventListener("focus", () => {
    console.log("태그 인풋 클릭됨!");
    tag_box.style.display = "block";
});