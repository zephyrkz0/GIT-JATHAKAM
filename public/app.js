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

    // Creative segmented language pill toggle
    const langPills = document.querySelectorAll('.lang-pill');
    langPills.forEach(pill => {
        pill.addEventListener('click', () => {
            langPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            languageSelect.value = pill.dataset.lang;
        });
    });

    // Allow Enter key to submit
    usernameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            submitBtn.click();
        }
    });

    submitBtn.addEventListener('click', async () => {
        const username = usernameInput.value.trim();
        const language = languageSelect.value;

        if (!username) {
            showError('Maryadhakk username enter chei');
            return;
        }

        // 1. Hide input, show loading
        errorMsg.style.display = 'none';
        inputSection.style.display = 'none';
        loadingSection.style.display = 'flex';

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
            typeWriterEffect(data.text, language);

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

    function typeWriterEffect(text, language) {
        revealedText.innerHTML = '';
        
        let i = 0;
        const speed = 40; // ms per character
        let generatedAudioUri = null;
        let isGeneratingAudio = false;

        function type() {
            if (i < text.length) {
                revealedText.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                // Show audio button
                audioContainer.style.display = 'block';
                
                // Setup audio player
                playAudioBtn.onclick = async () => {
                    if (currentAudio) {
                        currentAudio.pause();
                        currentAudio.currentTime = 0;
                    }

                    if (generatedAudioUri) {
                        currentAudio = new Audio(generatedAudioUri);
                        currentAudio.play();
                        return;
                    }

                    if (isGeneratingAudio) return;
                    isGeneratingAudio = true;
                    
                    const originalText = playAudioBtn.textContent;
                    playAudioBtn.textContent = 'Summoning voice...';

                    try {
                        const response = await fetch('/tts', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ text, language })
                        });
                        
                        const data = await response.json();
                        
                        if (!response.ok) throw new Error(data.error);
                        
                        generatedAudioUri = data.audio;
                        currentAudio = new Audio(generatedAudioUri);
                        currentAudio.play();
                    } catch (err) {
                        console.error('Failed to play audio:', err);
                        alert('Could not generate audio right now.');
                    } finally {
                        playAudioBtn.textContent = originalText;
                        isGeneratingAudio = false;
                    }
                };
            }
        }
        
        type();
    }

    function showError(msg) {
        errorMsg.textContent = msg;
        errorMsg.style.display = 'block';
    }
});
