// Global audio control
let bgMusic = document.getElementById('bgMusic');

// Set audio settings and start playing
if (bgMusic) {
    bgMusic.volume = 0.5;
    
    // Try to play immediately
    const playPromise = bgMusic.play();
    
    // Handle autoplay restrictions
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log("Autoplay was prevented:", error);
            // Show play button if autoplay was prevented
            const playButton = document.createElement('button');
            playButton.textContent = 'Play Music';
            playButton.style.position = 'fixed';
            playButton.style.bottom = '20px';
            playButton.style.right = '20px';
            playButton.style.zIndex = '2000';
            playButton.style.padding = '10px 20px';
            playButton.style.borderRadius = '5px';
            playButton.style.border = 'none';
            playButton.style.background = '#ff69b4';
            playButton.style.color = 'white';
            playButton.style.cursor = 'pointer';
            
            playButton.onclick = () => {
                bgMusic.play().then(() => playButton.remove())
                    .catch(e => console.log("Playback failed:", e));
            };
            
            document.body.appendChild(playButton);
        });
    }
    
    // Ensure audio continues playing when tab is in background
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            bgMusic.play().catch(e => console.log("Playback failed:", e));
        }
    });
}

// Function to handle audio playback
const playAudio = () => {
    if (!bgMusic) return;
    
    // Reset audio to start if it's at the end
    if (bgMusic.ended) {
        bgMusic.currentTime = 0;
    }
    
    // Try to play the audio
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log("Playback failed:", error);
        });
    }
};

// Make elements draggable with touch support
function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    // For mouse events
    element.onmousedown = dragMouseDown;
    // For touch events
    element.ontouchstart = dragTouchStart;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // Get the mouse cursor position at startup
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // Call a function whenever the cursor moves
        document.onmousemove = elementDrag;
    }

    function dragTouchStart(e) {
        e = e || window.event;
        e.preventDefault();
        // Get the touch position at startup
        const touch = e.touches[0] || e.changedTouches[0];
        pos3 = touch.clientX;
        pos4 = touch.clientY;
        document.ontouchend = closeDragElement;
        document.ontouchmove = elementDragTouch;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // Calculate the new cursor position
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // Set the element's new position
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function elementDragTouch(e) {
        e = e || window.event;
        e.preventDefault();
        const touch = e.touches[0] || e.changedTouches[0];
        // Calculate the new touch position
        pos1 = pos3 - touch.clientX;
        pos2 = pos4 - touch.clientY;
        pos3 = touch.clientX;
        pos4 = touch.clientY;
        // Set the element's new position
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // Stop moving when mouse/touch is released
        document.onmouseup = null;
        document.onmousemove = null;
        document.ontouchend = null;
        document.ontouchmove = null;
    }
}

// Create stickers in the letter container
function createStickers(container) {
    const stickerImages = [
        'img/cat1.webp',
        'img/cat2.gif',
        'img/cat3.webp',
        'img/cat4.gif',
        'img/cat4.webp',
        'img/cat5.webp'
    ];
    
    // Create 6-10 stickers
    const numStickers = Math.floor(Math.random() * 5) + 6;
    
    for (let i = 0; i < numStickers; i++) {
        const sticker = document.createElement('img');
        // Randomly select an image
        const randomImage = stickerImages[Math.floor(Math.random() * stickerImages.length)];
        sticker.src = randomImage;
        sticker.className = 'sticker';
        
        // Random rotation between -15 and 15 degrees
        const rotation = Math.floor(Math.random() * 30) - 15;
        sticker.style.transform = `rotate(${rotation}deg)`;
        
        // Random position within the container
        const maxX = container.offsetWidth - 100; // 100px less than container width
        const maxY = container.offsetHeight - 100; // 100px less than container height
        const randomX = Math.max(0, Math.floor(Math.random() * maxX));
        const randomY = Math.max(0, Math.floor(Math.random() * maxY));
        
        sticker.style.left = `${randomX}px`;
        sticker.style.top = `${randomY}px`;
        
        // Random size between 60px and 120px
        const size = Math.floor(Math.random() * 60) + 60;
        sticker.style.width = `${size}px`;
        sticker.style.height = 'auto';
        
        // Add hover effect
        sticker.addEventListener('mouseenter', () => {
            sticker.style.zIndex = '20';
        });
        
        sticker.addEventListener('mouseleave', () => {
            sticker.style.zIndex = '10';
        });
        
        // Make draggable
        makeDraggable(sticker);
        
        // Add to container
        container.appendChild(sticker);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const nameInput = document.getElementById('nameInput');
    const enterBtn = document.getElementById('enterBtn');
    const loginContainer = document.getElementById('login-container');
    const errorContainer = document.getElementById('error-container');
    const messageContainer = document.getElementById('message-container');
    const letterContainer = document.getElementById('letter-container');
    const letter = document.getElementById('letter');
    const timestamp = document.getElementById('timestamp');
    bgMusic = document.getElementById('bgMusic');
    
    // Set current timestamp for the error page
    const now = new Date();
    timestamp.textContent = now.toLocaleString();

    // Handle Enter key press on input
    nameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            validateAndProceed();
        }
    });

    // Handle button click
    enterBtn.addEventListener('click', validateAndProceed);

    // Main validation and transition function
    function validateAndProceed() {
        const name = nameInput.value.trim();
        
        if (name.toLowerCase() === 'wela') {
            // Hide login container
            loginContainer.classList.add('hidden');
            
            // Show error container
            errorContainer.classList.remove('hidden');
            
            // After 5 seconds, transition to the message
            setTimeout(() => {
                // Start fading out error message
                errorContainer.style.opacity = '0';
                
                // Show message container with pink background
                messageContainer.classList.remove('hidden');
                messageContainer.style.opacity = '1';
                
                // Initialize and ensure music continues playing
                if (bgMusic) {
                    // Make sure volume is set
                    bgMusic.volume = 0.5;
                    
                    // Try to ensure continuous playback
                    const ensurePlayback = () => {
                        if (bgMusic.paused) {
                            console.log('Ensuring music continues to play...');
                            const playPromise = bgMusic.play();
                            if (playPromise !== undefined) {
                                playPromise.then(() => {
                                    isPlaying = true;
                                    console.log('Playback resumed successfully');
                                }).catch(error => {
                                    console.log('Playback error:', error);
                                    showPlayButton();
                                });
                            }
                        }
                    };
                    
                    // Set up event listeners for playback control
                    bgMusic.addEventListener('play', () => {
                        isPlaying = true;
                        lastPlayTime = Date.now();
                        console.log('Music started playing');
                    });
                    
                    bgMusic.addEventListener('pause', () => {
                        console.log('Music was paused');
                        if (!document.hidden) {
                            setTimeout(ensurePlayback, 300);
                        }
                    });
                    
                    bgMusic.addEventListener('ended', () => {
                        console.log('Music ended, restarting...');
                        bgMusic.currentTime = 0;
                        setTimeout(ensurePlayback, 100);
                    });
                    
                    // Handle page visibility changes
                    document.addEventListener('visibilitychange', () => {
                        if (!document.hidden) {
                            console.log('Page became visible, resuming playback...');
                            setTimeout(ensurePlayback, 300);
                        }
                    });
                    
                    // Set up periodic check
                    const playbackCheck = setInterval(() => {
                        if (bgMusic.paused && !document.hidden) {
                            ensurePlayback();
                        }
                    }, 2000);
                    
                    // Clean up on page unload
                    window.addEventListener('beforeunload', () => {
                        clearInterval(playbackCheck);
                    });
                    
                    // Initial playback attempt
                    ensurePlayback();
                }
                
                // Start showing messages
                showMessages();
                
                // Hide error container after transition
                setTimeout(() => {
                    errorContainer.classList.add('hidden');
                    errorContainer.style.opacity = '1';
                }, 1000);
                
            }, 5000);
        } else {
            alert('Incorrect name. Please try again.');
            nameInput.value = '';
            nameInput.focus();
        }
    }

    // Function to show messages in sequence
    function showMessages() {
        // Start music 500ms before the first message
        setTimeout(() => {
            if (bgMusic) {
                bgMusic.volume = 0.5;
                const playPromise = bgMusic.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log("Initial playback failed:", error);
                        showPlayButton();
                    });
                }
            }
        }, 1000);

        const messages = [
            { id: 'message1', text: 'Or is it?', delay: 1500, duration: 5000 },
            { id: 'message2', text: 'They say August 1 is when you celebrate or appreciate your girlfriend.', delay: 8000, duration: 6000 },
            { id: 'message3', text: 'Why can\'t it be every day of the 365 days we have?', delay: 17000, duration: 7000 },
            { id: 'message4', text: 'Either way, happy girlfriend\'s day!', delay: 26000, duration: 6000, isNeon: true }
        ];

        messages.forEach(msg => {
            setTimeout(() => {
                const element = document.getElementById(msg.id);
                element.textContent = msg.text;
                element.style.opacity = '1';
                
                if (msg.isNeon) {
                    element.classList.add('neon');
                }
                
                // Hide the message after its duration
                setTimeout(() => {
                    element.style.opacity = '0';
                    
                    // If this is the last message, show 404 error
                    if (msg.id === 'message4') {
                        setTimeout(() => {
                            messageContainer.style.opacity = '0';
                            
                            // Show 404 error
                            setTimeout(() => {
                                errorContainer.querySelector('h1').textContent = '404 Not Found';
                                errorContainer.querySelector('p').textContent = 'The requested URL was not found on this server.';
                                errorContainer.classList.remove('hidden');
                                errorContainer.style.opacity = '1';
                                
                                // Wait 4 seconds before hiding 404 and showing final message
                                setTimeout(() => {
                                    errorContainer.style.opacity = '0';
                                    
                                    setTimeout(() => {
                                        errorContainer.classList.add('hidden');
                                        
                                        // Create and show "Just kidding" message after a pause
                                        const justKidding = document.createElement('p');
                                        justKidding.textContent = 'Just kidding, eto na talaga';
                                        justKidding.style.color = 'white';
                                        justKidding.style.fontFamily = "'Poppins', sans-serif";
                                        justKidding.style.fontSize = '2.3em';
                                        justKidding.style.fontWeight = '600';
                                        justKidding.style.opacity = '0';
                                        justKidding.style.transition = 'opacity 2s';
                                        justKidding.style.textAlign = 'center';
                                        justKidding.style.width = '100%';
                                        justKidding.style.position = 'absolute';
                                        justKidding.style.top = '50%';
                                        justKidding.style.left = '50%';
                                        justKidding.style.transform = 'translate(-50%, -50%)';
                                        justKidding.style.textTransform = 'uppercase';
                                        justKidding.style.letterSpacing = '1px';
                                        justKidding.style.textShadow = '1px 1px 2px rgba(0,0,0,0.3)';
                                        
                                        messageContainer.innerHTML = '';
                                        messageContainer.style.opacity = '1';
                                        messageContainer.appendChild(justKidding);
                                        
                                        // Fade in slowly after a pause
                                        setTimeout(() => {
                                            justKidding.style.opacity = '1';
                                            
                                            // Ensure music keeps playing
                                            bgMusic.play().catch(e => console.log("Background music play error:", e));
                                            
                                            // Wait, then fade out and show letter
                                            setTimeout(() => {
                                                justKidding.style.opacity = '0';
                                                
                                                // Show letter with a small delay
                                                setTimeout(() => {
                                                    // Ensure music keeps playing
                                                    if (bgMusic && bgMusic.paused) {
                                                        bgMusic.play().catch(e => console.log("Music resume error:", e));
                                                    }
                                                    
                                                    // Clear any existing content
                                                    messageContainer.innerHTML = '';
                                                    
                                                    // Create a new container for the letter
                                                    const newLetterContainer = document.createElement('div');
                                                    newLetterContainer.id = 'letter-container';
                                                    newLetterContainer.classList.remove('hidden');
                                                    newLetterContainer.style.opacity = '1';
                                                    
                                                    // Create sticker container
                                                    const stickerContainer = document.createElement('div');
                                                    stickerContainer.id = 'sticker-container';
                                                    newLetterContainer.appendChild(stickerContainer);
                                                    
                                                    // Clone the letter element
                                                    const newLetter = letter.cloneNode(true);
                                                    newLetter.style.transform = 'scale(0)';
                                                    
                                                    // Add to DOM
                                                    newLetterContainer.appendChild(newLetter);
                                                    document.body.appendChild(newLetterContainer);
                                                    
                                                    // Ensure music keeps playing
                                                    setTimeout(playAudio, 100);
                                                    
                                                    // Animate letter appearance
                                                    setTimeout(() => {
                                                        newLetter.style.transform = 'scale(1)';
                                                        
                                                        // Create stickers after letter appears
                                                        setTimeout(() => {
                                                            createStickers(stickerContainer);
                                                        }, 300);
                                                        
                                                        // Final music play check
                                                        setTimeout(playAudio, 500);
                                                    }, 100);
                                                }, 1000);
                                            }, 4000);
                                        }, 1000);
                                    }, 500);
                                }, 2000);
                            }, 1000);
                        }, 1000);
                    }
                }, msg.duration);
                
            }, msg.delay);
        });
    }
});
