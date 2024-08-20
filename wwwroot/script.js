let version = 0;

function updateUpscaleValue(value) {
    document.getElementById("upscale-input").value = parseInt(value).toFixed(0);
}

function updateSliderValue(value) {
    const slider = document.getElementById("upscale-slider");
    if (value >= slider.min && value <= slider.max) {
        slider.value = value;
        updateUpscaleValue(value);
    }
}

function updateXpValue(value) {
    document.getElementById("xp-input").value = parseInt(value).toFixed(0);
}

function updateXpSliderValue(value) {
    const slider = document.getElementById("xp-slider");
    if (value >= slider.min && value <= slider.max) {
        slider.value = value;
        updateXpValue(value);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    updateUpscaleValue(document.getElementById("upscale-slider").value);
});

function setVersion(value) {
    document
        .querySelectorAll(".version-buttons-container div")
        .forEach((div) => {
            div.classList.remove("active");
        });

    const clickedDiv =
        value === 1
            ? document.getElementById("bedrock")
            : document.getElementById("java");
    clickedDiv.classList.add("active");

    version = value;
}
