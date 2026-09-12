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
    const API_BASE = (window.location.protocol === 'file:' || (window.location.port && window.location.port !== '3000')) ? 'http://localhost:3000' : '';

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
            const response = await fetch(`${API_BASE}/jaathakam`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, language })
            });

            const responseText = await response.text();
            
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseErr) {
                if (!response.ok) {
                    throw new Error(`Server error (${response.status}). Please ensure server is running.`);
                }
                throw new Error('Server connection was interrupted. Please try again.');
            }

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
            inputSection.style.display = 'flex';
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
        stopTempleAmbient();
        usernameInput.value = '';
        inputSection.style.display = 'flex';
    });

    // ---- Temple Ambient Sound Generator (Web Audio API) ----
    let ambientCtx = null;
    let ambientGain = null;
    let ambientInterval = null;

    function ensureAudioContext() {
        if (!ambientCtx || ambientCtx.state === 'closed') {
            ambientCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (ambientCtx.state === 'suspended') {
            ambientCtx.resume();
        }
    }

    async function startTempleAmbient() {
        try {
            ensureAudioContext();
            if (ambientCtx.state === 'suspended') {
                await ambientCtx.resume();
            }

            if (ambientInterval) {
                clearInterval(ambientInterval);
                ambientInterval = null;
            }

            ambientGain = ambientCtx.createGain();
            const now = ambientCtx.currentTime;
            ambientGain.gain.setValueAtTime(0.01, now);
            ambientGain.connect(ambientCtx.destination);

            // Smooth fade-in to an audible, soothing ambient volume level (~0.30)
            ambientGain.gain.exponentialRampToValueAtTime(0.30, now + 0.5);

            // Immediate resonant opening temple bell
            playBell(ambientCtx, ambientGain, 432, 0.45);

            setTimeout(() => {
                if (ambientCtx && ambientCtx.state === 'running') {
                    playBell(ambientCtx, ambientGain, 648, 0.35);
                }
            }, 650);

            // Natural temple bell interval loop
            ambientInterval = setInterval(() => {
                if (!ambientCtx || ambientCtx.state !== 'running') return;
                const rand = Math.random();
                if (rand < 0.35) {
                    // Deep resonant temple bell
                    playBell(ambientCtx, ambientGain, 216 + Math.random() * 40, 0.45);
                } else if (rand < 0.70) {
                    // Medium brass temple bell
                    playBell(ambientCtx, ambientGain, 432 + Math.random() * 160, 0.35);
                } else {
                    // Small clear chime
                    playBell(ambientCtx, ambientGain, 768 + Math.random() * 240, 0.25);
                }
            }, 2400 + Math.random() * 1200);
        } catch (e) {
            console.warn('Temple ambient audio warning:', e);
        }
    }

    function playBell(ctx, masterGain, freq, volume) {
        if (!ctx || ctx.state !== 'running') return;
        const now = ctx.currentTime;
        const bellGain = ctx.createGain();
        bellGain.connect(masterGain);

        // Fundamental tone
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(freq, now);

        // Metallic overtone (2.76x)
        const osc2 = ctx.createOscillator();
        const osc2Gain = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq * 2.76, now);

        // Upper shimmer overtone (5.4x)
        const osc3 = ctx.createOscillator();
        const osc3Gain = ctx.createGain();
        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(freq * 5.4, now);

        // Realistic bell envelope
        bellGain.gain.setValueAtTime(0.001, now);
        bellGain.gain.linearRampToValueAtTime(volume, now + 0.02);
        bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.6);

        osc2Gain.gain.setValueAtTime(0.4, now);
        osc2Gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

        osc3Gain.gain.setValueAtTime(0.18, now);
        osc3Gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);

        osc1.connect(bellGain);
        osc2.connect(osc2Gain);
        osc2Gain.connect(bellGain);
        osc3.connect(osc3Gain);
        osc3Gain.connect(bellGain);

        osc1.start(now);
        osc2.start(now);
        osc3.start(now);

        osc1.stop(now + 3.8);
        osc2.stop(now + 2.2);
        osc3.stop(now + 1.2);
    }

    function stopTempleAmbient() {
        if (ambientInterval) {
            clearInterval(ambientInterval);
            ambientInterval = null;
        }
        if (ambientCtx && ambientGain) {
            try {
                const now = ambientCtx.currentTime;
                ambientGain.gain.cancelScheduledValues(now);
                ambientGain.gain.setValueAtTime(ambientGain.gain.value, now);
                ambientGain.gain.linearRampToValueAtTime(0.0001, now + 1.2);
                setTimeout(() => {
                    if (ambientCtx && ambientCtx.state === 'running') {
                        ambientCtx.suspend();
                    }
                }, 1300);
            } catch (e) {
                console.warn('Error stopping ambient:', e);
            }
        }
    }

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
                    ensureAudioContext();

                    if (currentAudio) {
                        currentAudio.pause();
                        currentAudio.currentTime = 0;
                    }

                    if (generatedAudioUri) {
                        // Start ambient bells
                        startTempleAmbient();
                        currentAudio = new Audio(generatedAudioUri);
                        currentAudio.volume = 0.9;
                        currentAudio.onended = () => stopTempleAmbient();
                        currentAudio.play();
                        return;
                    }

                    if (isGeneratingAudio) return;
                    isGeneratingAudio = true;
                    
                    const originalText = playAudioBtn.textContent;
                    playAudioBtn.textContent = 'Summoning voice...';

                    try {
                        const response = await fetch(`${API_BASE}/tts`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ text, language })
                        });
                        
                        const data = await response.json();
                        
                        if (!response.ok) throw new Error(data.error);
                        
                        generatedAudioUri = data.audio;
                        
                        // Start ambient bells alongside TTS
                        startTempleAmbient();
                        currentAudio = new Audio(generatedAudioUri);
                        currentAudio.volume = 0.9;
                        currentAudio.onended = () => stopTempleAmbient();
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
