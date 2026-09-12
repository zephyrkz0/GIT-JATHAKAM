document.addEventListener('DOMContentLoaded', () => {
    const inputSection = document.getElementById('input-section');
    const loadingSection = document.getElementById('loading-section');
    const resultSection = document.getElementById('result-section');
    
    const usernameInput = document.getElementById('github-username');
    const languageSelect = document.getElementById('language-select');
    const submitBtn = document.getElementById('submit-btn');
    const errorMsg = document.getElementById('error-message');
    
    const revealedText = document.getElementById('revealed-text');
    const audioContainer = document.getElementById('audio-container');
    const playAudioBtn = document.getElementById('play-audio-btn');
    const resetBtn = document.getElementById('reset-btn');

    let currentAudio = null;

    submitBtn.addEventListener('click', async () => {
        const username = usernameInput.value.trim();
        const language = languageSelect.value;

        if (!username) {
            showError('Please enter a GitHub username');
            return;
        }

        // 1. Hide input, show loading
        errorMsg.style.display = 'none';
        inputSection.style.display = 'none';
        loadingSection.style.display = 'block';

        try {
            // 2. Fetch data from backend
            const response = await fetch('/jaathakam', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, language })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to consult the stars');
            }

            // 3. Hide loading, show result
            loadingSection.style.display = 'none';
            resultSection.style.display = 'block';
            
            // 4. Start typing effect
            typeWriterEffect(data.text, data.audio);

        } catch (error) {
            loadingSection.style.display = 'none';
            inputSection.style.display = 'block';
            showError(error.message);
        }
    });

    resetBtn.addEventListener('click', () => {
        // Reset everything
        resultSection.style.display = 'none';
        revealedText.innerHTML = '';
        audioContainer.style.display = 'none';
        
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }
        
        usernameInput.value = '';
        inputSection.style.display = 'block';
    });

    function typeWriterEffect(text, audioDataUri) {
        revealedText.innerHTML = '';
        
        let i = 0;
        const speed = 40; // ms per character

        function type() {
            if (i < text.length) {
                revealedText.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                // Show audio button if TTS succeeded
                if (audioDataUri) {
                    audioContainer.style.display = 'block';
                    
                    // Setup audio player
                    playAudioBtn.onclick = () => {
                        if (currentAudio) {
                            currentAudio.pause();
                            currentAudio.currentTime = 0;
                        }
                        currentAudio = new Audio(audioDataUri);
                        currentAudio.play();
                    };
                }
            }
        }
        
        type();
    }

    function showError(msg) {
        errorMsg.textContent = msg;
        errorMsg.style.display = 'block';
    }
});
