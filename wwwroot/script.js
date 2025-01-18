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
                xpPercentString: ($("xp-slider").value / 100).toString(),
                upscaleRateString: $("upscale-slider").value,
            };

            try {
                const response = await fetch("/api/genUi", {
                    method: "POST",
                    body: JSON.stringify(bodyContent),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.status === 500) {
                    alert(
                        "Something happened while generating the UI.\nRefresh and try again."
                    );
                    return;
                }
                try {
                    const blob = await response.blob();
                    const imageUrl = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = imageUrl;
                    link.download = `${file.name}_ui.png`;

                    // this line is required for Firefox.
                    document.body.appendChild(link);

                    link.click();

                    URL.revokeObjectURL(imageUrl);

                    document.body.removeChild(link);
                } catch (err) {
                    alert("Unable to download UI");
                }
            } catch (error) {
                console.error("Error while making UI:", error);
            }
        };

        reader.readAsDataURL(file);
    });
});
