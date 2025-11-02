(function() {
    'use strict';
    
    let autoPlayEnabled = true;
    let autoScrollEnabled = true;
    let videoSpeedEnabled = true;
    let videoSpeed = 16; // Default 16x speed
    
    // Load saved state
    chrome.storage.sync.get(['autoPlayEnabled', 'autoScrollEnabled', 'videoSpeedEnabled', 'videoSpeed'], function(result) {
        autoPlayEnabled = result.autoPlayEnabled !== false;
        autoScrollEnabled = result.autoScrollEnabled !== false;
        videoSpeedEnabled = result.videoSpeedEnabled !== false;
        videoSpeed = result.videoSpeed || 16;
    });
    
    // Listen for toggle messages
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === 'toggleAutoPlay') {
            autoPlayEnabled = request.enabled;
        }
        if (request.action === 'toggleAutoScroll') {
            autoScrollEnabled = request.enabled;
        }
        if (request.action === 'toggleVideoSpeed') {
            videoSpeedEnabled = request.enabled;
            setVideoSpeed();
        }
        if (request.action === 'setVideoSpeed') {
            videoSpeed = request.speed;
            setVideoSpeed();
        }
    });
    
    function findNextButton() {
        console.log('GFG: Looking for next button...');
        
        // Show all buttons and links on page for debugging
        const allButtons = document.querySelectorAll('button, a, [role="button"], div[onclick], span[onclick]');
        console.log('GFG: Found', allButtons.length, 'clickable elements');
        
        allButtons.forEach((btn, index) => {
            const text = btn.textContent.trim();
            if (text.length > 0 && text.length < 100) {
                console.log(`Button ${index}:`, text, btn);
            }
        });
        
        // Try different search patterns
        const patterns = [
            'next',
            '>>',
            '»',
            'next >>',
            'next»',
            'continue',
            'forward'
        ];
        
        for (const pattern of patterns) {
            for (const btn of allButtons) {
                const text = btn.textContent.toLowerCase().trim();
                if (text.includes(pattern.toLowerCase()) && btn.offsetParent) {
                    console.log('GFG: Found match for pattern "' + pattern + '":', btn, 'Text:', text);
                    return btn;
                }
            }
        }
        
        // Try by class names
        const classSelectors = [
            '[class*="next"]',
            '[class*="forward"]',
            '[class*="continue"]',
            '[id*="next"]'
        ];
        
        for (const selector of classSelectors) {
            const elements = document.querySelectorAll(selector);
            for (const el of elements) {
                if (el.offsetParent && (el.tagName === 'BUTTON' || el.tagName === 'A' || el.onclick)) {
                    console.log('GFG: Found by selector "' + selector + '":', el);
                    return el;
                }
            }
        }
        
        console.log('GFG: No next button found');
        return null;
    }
    
    function setupAutoPlay() {
        const video = document.querySelector('video');
        if (!video) {
            console.log('GFG Auto Play: No video found');
            return;
        }
        
        console.log('GFG Auto Play: Video found, setting up auto-play and speed');
        
        // Set video speed
        setVideoSpeed();
        
        // Remove existing listeners to avoid duplicates
        const videos = document.querySelectorAll('video');
        videos.forEach(v => {
            v.removeEventListener('ended', handleVideoEnd);
            v.addEventListener('ended', handleVideoEnd);
        });
    }
    
    function setVideoSpeed() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            if (videoSpeedEnabled) {
                video.playbackRate = videoSpeed;
                console.log('GFG: Set video speed to', videoSpeed + 'x');
            } else {
                video.playbackRate = 1;
                console.log('GFG: Reset video speed to 1x');
            }
        });
    }
    
    function handleVideoEnd() {
        console.log('GFG Auto Play: Video ended');
        
        if (!autoPlayEnabled) {
            console.log('GFG Auto Play: Auto-play disabled');
            return;
        }
        
        setTimeout(() => {
            const nextBtn = findNextButton();
            if (nextBtn) {
                nextBtn.click();
            }
        }, 10);
    }
    
    // Auto-scroll and mark as read for articles
    function setupAutoScroll() {
        if (!autoScrollEnabled) return;
        
        console.log('GFG Auto Scroll: Checking page type...');
        console.log('Current URL:', window.location.href);
        
        // Better article detection for GFG
        const hasVideo = document.querySelector('video');
        const isVideoPage = window.location.href.includes('/videos/') || hasVideo;
        const isArticle = window.location.href.includes('geeksforgeeks.org') && !isVideoPage;
        
        if (isArticle) {
            console.log('GFG Auto Scroll: Article page detected, starting auto-scroll');
            
            // Start scrolling immediately
            setTimeout(() => {
                startAutoScroll();
            }, 10);
        } else {
            console.log('GFG Auto Scroll: Not an article page');
        }
    }
    
    function startAutoScroll() {
        let scrollInterval = setInterval(() => {
            if (!autoScrollEnabled) {
                clearInterval(scrollInterval);
                return;
            }
            
            window.scrollBy(0, 20); // Very fast scroll - 20px
            
            // Check if reached bottom
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
                clearInterval(scrollInterval);
                
                // Instant actions
                const markReadBtn = findMarkAsReadButton();
                if (markReadBtn) {
                    markReadBtn.click();
                    
                    // Almost instant next button
                    setTimeout(() => {
                        const nextBtn = findNextButton();
                        if (nextBtn) nextBtn.click();
                    }, 10);
                } else {
                    // Instant next button
                    const nextBtn = findNextButton();
                    if (nextBtn) nextBtn.click();
                }
            }
        }, 10); // Ultra fast scroll - every 10ms
    }
    
    function findMarkAsReadButton() {
        const selectors = [
            'button[class*="mark"]',
            'button[class*="read"]',
            'a[class*="mark"]',
            'a[class*="read"]',
            '.mark-read',
            '.mark-as-read',
            '#mark-read'
        ];
        
        for (const selector of selectors) {
            const btn = document.querySelector(selector);
            if (btn && btn.offsetParent !== null) {
                return btn;
            }
        }
        
        // Search by text
        const allElements = document.querySelectorAll('button, a, div[role="button"]');
        for (const element of allElements) {
            const text = element.textContent.toLowerCase().trim();
            if (text.includes('mark') && text.includes('read')) {
                return element;
            }
        }
        
        return null;
    }
    
    // Initialize
    function init() {
        console.log('GFG: Initializing...');
        console.log('Current URL:', window.location.href);
        
        // Always try to setup video auto-play first
        setupAutoPlay();
        
        // Monitor for new videos and apply speed
        setInterval(() => {
            setVideoSpeed();
        }, 2000);
        
        // Instant setup
        setTimeout(() => {
            setupAutoScroll();
        }, 10);
    }
    
    // Wait for page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Re-initialize on navigation and DOM changes
    let initTimeout;
    const observer = new MutationObserver(() => {
        clearTimeout(initTimeout);
        initTimeout = setTimeout(() => {
            console.log('GFG: Re-initializing due to DOM change');
            setupAutoPlay();
            setupAutoScroll();
        }, 2000);
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Also listen for URL changes (for SPA navigation)
    let currentUrl = window.location.href;
    setInterval(() => {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            console.log('GFG: URL changed, re-initializing');
            setTimeout(() => {
                setupAutoPlay();
                setupAutoScroll();
            }, 3000);
        }
    }, 1000);
    
    // Manual trigger for testing
    window.gfgAutoPlayTest = () => {
        console.log('GFG Auto Play: Manual test triggered');
        const nextBtn = findNextButton();
        if (nextBtn) {
            console.log('Found button:', nextBtn);
            nextBtn.click();
        } else {
            console.log('No button found');
        }
    };
    
    window.gfgAutoScrollTest = () => {
        console.log('GFG Auto Scroll: Manual test triggered');
        setupAutoScroll();
    };
})();