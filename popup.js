document.addEventListener('DOMContentLoaded', function() {
    const playToggle = document.getElementById('autoPlayToggle');
    const scrollToggle = document.getElementById('autoScrollToggle');
    const speedToggle = document.getElementById('videoSpeedToggle');
    const speedSelect = document.getElementById('speedSelect');
    const status = document.getElementById('status');
    
    // Load saved state
    chrome.storage.sync.get(['autoPlayEnabled', 'autoScrollEnabled', 'videoSpeedEnabled', 'videoSpeed'], function(result) {
        playToggle.checked = result.autoPlayEnabled !== false;
        scrollToggle.checked = result.autoScrollEnabled !== false;
        speedToggle.checked = result.videoSpeedEnabled !== false;
        speedSelect.value = result.videoSpeed || 16;
        updateStatus();
    });
    
    // Handle auto-play toggle
    playToggle.addEventListener('change', function() {
        const enabled = playToggle.checked;
        chrome.storage.sync.set({autoPlayEnabled: enabled});
        
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'toggleAutoPlay',
                enabled: enabled
            });
        });
        
        updateStatus();
    });
    
    // Handle auto-scroll toggle
    scrollToggle.addEventListener('change', function() {
        const enabled = scrollToggle.checked;
        chrome.storage.sync.set({autoScrollEnabled: enabled});
        
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'toggleAutoScroll',
                enabled: enabled
            });
        });
        
        updateStatus();
    });
    
    // Handle video speed toggle
    speedToggle.addEventListener('change', function() {
        const enabled = speedToggle.checked;
        chrome.storage.sync.set({videoSpeedEnabled: enabled});
        
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'toggleVideoSpeed',
                enabled: enabled
            });
        });
        
        updateStatus();
    });
    
    // Handle speed selection
    speedSelect.addEventListener('change', function() {
        const speed = parseInt(speedSelect.value);
        chrome.storage.sync.set({videoSpeed: speed});
        
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'setVideoSpeed',
                speed: speed
            });
        });
        
        updateStatus();
    });
    
    function updateStatus() {
        const features = [];
        if (playToggle.checked) features.push('Auto-play');
        if (scrollToggle.checked) features.push('Auto-scroll');
        if (speedToggle.checked) features.push(speedSelect.value + 'x Speed');
        status.textContent = features.length ? features.join(' & ') + ' enabled' : 'All features disabled';
    }
});