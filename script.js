let player;
let loopCount = 1;
let currentLoop = 0;
const HISTORY_KEY = 'you_loop_history';

const playButton = document.getElementById('play-button');
const urlInput = document.getElementById('youtube-url');
const loopInput = document.getElementById('loop-count');
const statusText = document.getElementById('status-text');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history');

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    loadHistory();
    clearHistoryBtn.addEventListener('click', clearHistory);
});

/**
 * Extracts video ID from a YouTube URL.
 * @param {string} url 
 * @returns {string|null}
 */
function extractVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

/**
 * Initializes the YouTube player.
 * @param {string} videoId 
 * @param {number} loops 
 */
function initPlayer(videoId, loops) {
    if (player) {
        player.destroy();
    }

    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
            'autoplay': 1,
            'controls': 1,
            'rel': 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
        }
    });
    
    loopCount = loops;
    currentLoop = 1;
    
    // Add to history
    addToHistory(videoId);
}

function onPlayerReady(event) {
    statusText.innerText = `Playing loop ${currentLoop} of ${loopCount}`;
    event.target.playVideo();
}

function onPlayerStateChange(event) {
    // YT.PlayerState.PLAYING = 1
    // YT.PlayerState.ENDED = 0
    if (event.data === YT.PlayerState.ENDED) {
        if (currentLoop < loopCount) {
            currentLoop++;
            statusText.innerText = `Playing loop ${currentLoop} of ${loopCount}`;
            player.playVideo();
        } else {
            statusText.innerText = "Finished all loops.";
            currentLoop = 0;
        }
    }
}

function onPlayerError(event) {
    let errorMessage = "An unknown error occurred.";
    
    switch(event.data) {
        case 2:
            errorMessage = "Error 2: Invalid parameter (Check the URL).";
            break;
        case 5:
            errorMessage = "Error 5: Content cannot be played in HTML5.";
            break;
        case 100:
            errorMessage = "Error 100: Video not found.";
            break;
        case 101:
        case 150:
            errorMessage = "Error 101/150: Video owner does not allow embedding.";
            break;
        case 153:
            errorMessage = "Error 153: Missing Referer header. (Run via local server!)";
            break;
        default:
            errorMessage = `Error ${event.data}: Unknown player error.`;
    }
    
    statusText.innerText = errorMessage;
    console.error(`YouTube API Error: ${event.data}`, event);
}

/**
 * Saves video ID to localStorage history.
 * @param {string} videoId 
 */
function addToHistory(videoId) {
    let history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    
    // Prevent duplicates in immediate sequence, but allow if it's a new session of the same video
    // Or simply: always add and then filter unique for the display
    history.unshift({
        id: videoId,
        timestamp: Date.now()
    });

    // Keep only the last 20 items
    history = history.slice(0, 20);
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    renderHistory();
}

/**
 * Renders the history list from localStorage.
 */
function renderHistory() {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    historyList.innerHTML = '';

    if (history.length === 0) {
        historyList.innerHTML = '<li style="color: #666; text-align: center; padding: 1rem;">No recent loops</li>';
        return;
    }

    history.forEach(item => {
        const li = document.createElement('li');
        li.className = 'history-item';
        
        const img = document.createElement('img');
        img.src = `https://img.youtube.com/vi/${item.id}/default.jpg`;
        img.alt = 'Video thumbnail';

        const info = document.createElement('div');
        info.className = 'history-info';
        info.innerText = `Video ID: ${item.id}`;

        li.appendChild(img);
        li.appendChild(info);
        
        li.addEventListener('click', () => {
            urlInput.value = `https://www.youtube.com/watch?v=${item.id}`;
            loopInput.value = 1;
            playButton.click();
        });

        historyList.appendChild(li);
    });
}

function loadHistory() {
    renderHistory();
}

function clearHistory() {
    if (confirm('Clear your video history?')) {
        localStorage.removeItem(HISTORY_KEY);
        renderHistory();
    }
}

playButton.addEventListener('click', () => {
    const url = urlInput.value.trim();
    const loops = parseInt(loopInput.value, 10);

    if (!url) {
        alert("Please enter a YouTube URL");
        return;
    }

    if (isNaN(loops) || loops < 1) {
        alert("Please enter a valid number of loops (at least 1)");
        return;
    }

    const videoId = extractVideoId(url);
    if (videoId) {
        statusText.innerText = "Loading video...";
        initPlayer(videoId, loops);
    } else {
        alert("Invalid YouTube URL");
        statusText.innerText = "Invalid URL. Please try again.";
    }
});
