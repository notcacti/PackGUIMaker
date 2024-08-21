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

    document.querySelectorAll(".version-button").forEach(button => {
        button.addEventListener("click", function() {
            //remove active class from all buttons
            document.querySelectorAll(".version-button").forEach(btn => btn.classList.remove("active"));

            //add active class to the clicked button
            this.classList.add("active");

            //update the version based on the clicked button
            version = parseInt(this.getAttribute("data-version"));
        });
    });
});

function setVersion(value) {
    //remove active class from all buttons
    document.querySelectorAll(".version-button").forEach((button) => {
        button.classList.remove("active");
    });

    // add active class to the specific button based on the version
    const clickedButton = document.querySelector(`.version-button[data-version="${value}"]`);
    if (clickedButton) {
        clickedButton.classList.add("active");
    }

    version = value;
}

document.getElementById('file-upload-button').addEventListener('click', function() {
    document.getElementById('file-upload').click();
});

