document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("file-input");
    const playButton = document.getElementById("play-button");
    const stopButton = document.getElementById("stop-button");
    const resetButton = document.getElementById("reset-button");
    const sliderContainer = document.getElementById("sliders");

    let audioContext;
    let audioSource;
    let audioBuffer;
    let analyser;
    let gainNodes = [];
    let isPlaying = false;
    let currentTime = 0; // Save the current playback position
    let startTime = 0; // Track when playback started

    const frequencies = [30, 60, 125, 250, 500, 1000, 2000, 4000, 8000, 16000, 20000];
    const maxGain = 150; // Amplify up to 5x

    const createSliders = () => {
        frequencies.forEach((freq, index) => {
            const sliderWrapper = document.createElement("div");
            sliderWrapper.className = "slider-wrapper";

            const label = document.createElement("label");
            label.textContent = `${freq} Hz`;
            label.className = "slider-label";

            const slider = document.createElement("input");
            slider.type = "range";
            slider.min = "-30";
            slider.max = "30";
            slider.value = "0";
            slider.className = "slider";
            slider.dataset.index = index;

            const valueInput = document.createElement("input");
            valueInput.type = "number";
            valueInput.min = "-30";
            valueInput.max = "30";
            valueInput.value = "0";
            valueInput.className = "slider-value";
            valueInput.dataset.index = index;

            slider.addEventListener("input", (event) => {
                const index = event.target.dataset.index;
                const value = event.target.value;
                gainNodes[index].gain.value = value;
                valueInput.value = value;
            });

            valueInput.addEventListener("input", (event) => {
                const index = event.target.dataset.index;
                const value = event.target.value;
                gainNodes[index].gain.value = value;
                slider.value = value;
            });

            sliderWrapper.appendChild(label);
            sliderWrapper.appendChild(slider);
            sliderWrapper.appendChild(valueInput);
            sliderContainer.appendChild(sliderWrapper);
        });
    };

    const toggleAudio = () => {
        if (!audioBuffer) return;
        if (isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
        isPlaying = !isPlaying;
        updateButtonState();
    };

    const updateButtonState = () => {
        playButton.textContent = isPlaying ? "Pause" : "Play";
    };

    const stopAudio = () => {
        if (audioSource) {
            audioSource.stop();
            audioSource.disconnect();
            isPlaying = false;
            currentTime = 0; // Reset playback position
            updateButtonState();
        }
    };

    const playAudio = () => {
        if (!audioBuffer) return;
        audioSource = audioContext.createBufferSource();
        audioSource.buffer = audioBuffer;
        audioSource.connect(gainNodes[0]);
        audioSource.start(0, currentTime); // Start playback from the saved position
        startTime = audioContext.currentTime - currentTime; // Update playback start time
        audioSource.onended = () => (isPlaying = false);
    };

    const pauseAudio = () => {
        if (audioSource) {
            currentTime = audioContext.currentTime - startTime; // Save current playback position
            audioSource.stop();
        }
    };

    const resetEqualizer = () => {
        gainNodes.forEach((node) => (node.gain.value = 0));
        document.querySelectorAll(".slider").forEach((slider) => (slider.value = 0));
        document.querySelectorAll(".slider-value").forEach((input) => (input.value = 0));
    };

    fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileURL = URL.createObjectURL(file);
            loadAudio(fileURL);
        }
    });

    const loadAudio = (url) => {
        if (audioContext) audioContext.close();
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        fetch(url)
            .then((response) => response.arrayBuffer())
            .then((data) => audioContext.decodeAudioData(data))
            .then((buffer) => {
                audioBuffer = buffer;
                createAnalyser();
                createEqualizer();
            });
    };

    const createAnalyser = () => {
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
    };

    const createEqualizer = () => {
        gainNodes = frequencies.map((freq) => {
            const filter = audioContext.createBiquadFilter();
            filter.type = "peaking";
            filter.frequency.value = freq;
            filter.Q.value = 1;
            filter.gain.value = 0;
            return filter;
        });

        gainNodes.reduce((prev, curr) => {
            prev.connect(curr);
            return curr;
        });

        gainNodes[gainNodes.length - 1].connect(analyser);
        analyser.connect(audioContext.destination);
    };

    playButton.addEventListener("click", toggleAudio);
    stopButton.addEventListener("click", stopAudio);
    resetButton.addEventListener("click", resetEqualizer);

    createSliders();
});
