let version = 0;
const $ = (id) => document.getElementById(id);

function updateUpscaleValue(value) {
    $("upscale-input").value = parseInt(value).toFixed(0);
}

function updateSliderValue(value) {
    const slider = $("upscale-slider");
    if (value >= slider.min && value <= slider.max) {
        slider.value = value;
        updateUpscaleValue(value);
    }
}

function updateXpValue(value) {
    $("xp-input").value = parseInt(value).toFixed(0);
}

function updateXpSliderValue(value) {
    const slider = $("xp-slider");
    if (value >= slider.min && value <= slider.max) {
        slider.value = value;
        updateXpValue(value);
    }
}

function setVersion(value) {
    //remove active class from all buttons
    document.querySelectorAll(".version-button").forEach((button) => {
        button.classList.remove("active");
    });

    // add active class to the specific button based on the version
    const clickedButton = document.querySelector(
        `.version-button[data-version="${value}"]`
    );
    if (clickedButton) {
        clickedButton.classList.add("active");
    }

    version = value;
}

document.addEventListener("DOMContentLoaded", () => {
    updateUpscaleValue($("upscale-slider").value);

    document.querySelectorAll(".version-button").forEach((button) => {
        button.addEventListener("click", (e) => {
            //remove active class from all buttons
            document
                .querySelectorAll(".version-button")
                .forEach((btn) => btn.classList.remove("active"));

            //add active class to the clicked button
            e.target.classList.add("active");

            //update the version based on the clicked button
            version = parseInt(e.target.getAttribute("data-version"));
        });
    });

    $("file-upload-button").addEventListener("click", function () {
        $("file-upload").click();
    });

    $("file-upload").addEventListener("change", async (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = async function () {
            const base64String = reader.result.split(",")[1];

            const bodyContent = {
                packName: file.name,
                packBufferString: base64String,
                xpPercent: $("xp-slider").value / 100,
                upscaleRate: Number($("upscale-slider").value),
            };

            const result = await window.electron.generateUI(bodyContent);

            if (result.success) {
                alert("Successfully Saved the UI");
            } else {
                alert("Error: " + result.message);
            }
        };

        reader.readAsDataURL(file);
    });
});
