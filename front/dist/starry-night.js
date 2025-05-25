/** vibe coded with amazon Q */

function createStarrySky() {
    // Create SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    // z-index -10
    svg.style.zIndex = "-10";
    
    // Add defs section for filters and masks
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    
    // Create glow filter
    const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
    filter.setAttribute("id", "glow");
    filter.setAttribute("x", "-50%");
    filter.setAttribute("y", "-50%");
    filter.setAttribute("width", "200%");
    filter.setAttribute("height", "200%");
    
    const feGaussianBlur = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
    feGaussianBlur.setAttribute("stdDeviation", "2");
    feGaussianBlur.setAttribute("result", "coloredBlur");
    
    const feMerge = document.createElementNS("http://www.w3.org/2000/svg", "feMerge");
    const feMergeNode1 = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
    feMergeNode1.setAttribute("in", "coloredBlur");
    const feMergeNode2 = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
    feMergeNode2.setAttribute("in", "SourceGraphic");
    
    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);
    filter.appendChild(feGaussianBlur);
    filter.appendChild(feMerge);
    defs.appendChild(filter);
    
    // Create mask with gradient for center column
    const mask = document.createElementNS("http://www.w3.org/2000/svg", "mask");
    mask.setAttribute("id", "centerColumnMask");
    
    // Create gradient for mask
    const maskGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    maskGradient.setAttribute("id", "maskGradient");
    maskGradient.setAttribute("x1", "0%");
    maskGradient.setAttribute("y1", "0%");
    maskGradient.setAttribute("x2", "100%");
    maskGradient.setAttribute("y2", "0%");
    
    // Gradient stops for smooth transition
    const stops = [
        { offset: "0%", opacity: "1" },
        { offset: "20%", opacity: "0.1" },
        { offset: "80%", opacity: "0.1" },
        { offset: "100%", opacity: "1" }
    ];
    
    stops.forEach(stop => {
        const stopEl = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stopEl.setAttribute("offset", stop.offset);
        stopEl.setAttribute("stop-color", "white");
        stopEl.setAttribute("stop-opacity", stop.opacity);
        maskGradient.appendChild(stopEl);
    });
    
    defs.appendChild(maskGradient);
    
    // Create mask rectangle with gradient
    const maskRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    maskRect.setAttribute("x", "0");
    maskRect.setAttribute("y", "0");
    maskRect.setAttribute("width", "100%");
    maskRect.setAttribute("height", "100%");
    maskRect.setAttribute("fill", "url(#maskGradient)");
    
    mask.appendChild(maskRect);
    defs.appendChild(mask);
    
    svg.appendChild(defs);
    
    // Create container for all star layers
    const starsContainer = document.createElementNS("http://www.w3.org/2000/svg", "g");
    starsContainer.setAttribute("mask", "url(#centerColumnMask)");
    svg.appendChild(starsContainer);
    
    // Create more star field layers for better coverage
    const numLayers = 10; // Increased from 5 to 10 layers
    const layers = [];
    
    for (let i = 0; i < numLayers; i++) {
        const layer = document.createElementNS("http://www.w3.org/2000/svg", "g");
        starsContainer.appendChild(layer);
        layers.push(layer);
    }
    
    // Number of stars per layer
    const numStars = 80; // Slightly reduced per layer since we have more layers
    
    // Star colors with weighted probability (white has higher probability)
    function getStarColor() {
        // 70% chance for white, 30% chance for other colors
        if (Math.random() < 0.7) {
            return "#FFFFFF"; // white
        } else {
            const otherColors = [
                "#00FFFF", // cyan
                "#FFA500", // orange
                "#FFFF00", // yellow
                "#ADD8E6"  // light blue
            ];
            return otherColors[Math.floor(Math.random() * otherColors.length)];
        }
    }
    
    // Get star size with weighted probability (small has higher probability)
    function getStarRadius() {
        // Use exponential distribution to favor smaller stars
        const random = Math.random();
        const scale = 1.5;
        // Limit max size to 2px and min size to 0.5px
        return Math.min(2, Math.max(0.5, -Math.log(random) * scale));
    }
    
    // Generate stars for a layer
    function generateStars(layer, count, initialOpacity = 1) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        for (let i = 0; i < count; i++) {
            const starGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
            
            // Random position as offset from center
            // Use a wider distribution for stars to ensure they cover the screen even when small
            const offsetX = (Math.random() * window.innerWidth * 3) - (window.innerWidth * 1.5);
            const offsetY = (Math.random() * window.innerHeight * 3) - (window.innerHeight * 1.5);
            const radius = getStarRadius();
            const color = getStarColor();
            
            // Determine if this star should blink (only 5% chance)
            const shouldBlink = Math.random() < 0.05;
            
            // Create trail line
            const trail = document.createElementNS("http://www.w3.org/2000/svg", "line");
            trail.setAttribute("x1", centerX + offsetX);
            trail.setAttribute("y1", centerY + offsetY);
            trail.setAttribute("x2", centerX + offsetX);
            trail.setAttribute("y2", centerY + offsetY);
            trail.setAttribute("stroke", color);
            trail.setAttribute("stroke-width", radius * 0.8);
            trail.setAttribute("opacity", initialOpacity * 0.6);
            starGroup.appendChild(trail);
            
            // Create star (circle)
            const star = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            star.setAttribute("cx", centerX + offsetX);
            star.setAttribute("cy", centerY + offsetY);
            star.setAttribute("r", radius);
            star.setAttribute("fill", color);
            star.setAttribute("opacity", initialOpacity);
            star.classList.add("glow-filter");
            starGroup.appendChild(star);
            
            // Store blink info if applicable
            if (shouldBlink) {
                starGroup.dataset.blink = "true";
                starGroup.dataset.blinkSpeed = Math.random() * 0.03 * 0.3;
                starGroup.dataset.blinkPhase = Math.random() * Math.PI * 2;
            }
            
            // Store original position for animation
            starGroup.dataset.offsetX = offsetX;
            starGroup.dataset.offsetY = offsetY;
            starGroup.dataset.radius = radius;
            starGroup.dataset.color = color;
            
            layer.appendChild(starGroup);
        }
    }
    
    // Generate stars for all layers with initial scales
    const layerData = [];
    const maxScale = 2.0;
    const minScale = 0.1;
    
    // Create evenly distributed scales for layers
    for (let i = 0; i < numLayers; i++) {
        // Distribute scales evenly between min and max
        const scale = maxScale - ((maxScale - minScale) * i / numLayers);
        generateStars(layers[i], numStars);
        
        // Set initial scale for this layer
        setLayerScale(layers[i], scale, window.innerWidth / 2, window.innerHeight / 2);
        
        // Store layer data
        layerData.push({ layer: layers[i], scale: scale, opacity: 1.0 });
    }
    
    document.body.appendChild(svg);
    
    // Start the zoom animation
    animateInfinityTunnel(layerData, minScale, maxScale);
}

// Helper function to set initial scale for a layer
function setLayerScale(layer, scale, centerX, centerY) {
    const starGroups = layer.querySelectorAll('g');
    starGroups.forEach(group => {
        const offsetX = parseFloat(group.dataset.offsetX);
        const offsetY = parseFloat(group.dataset.offsetY);
        const x = centerX + (offsetX * scale);
        const y = centerY + (offsetY * scale);
        
        const star = group.querySelector('circle');
        star.setAttribute("cx", x);
        star.setAttribute("cy", y);
        
        const trail = group.querySelector('line');
        trail.setAttribute("x1", x);
        trail.setAttribute("y1", y);
        trail.setAttribute("x2", x);
        trail.setAttribute("y2", y);
    });
}

// Infinity tunnel animation function
function animateInfinityTunnel(layers, minScale, maxScale) {
    const baseZoomSpeed = 0.002;
    const exponent = 2; // Exponential curve factor
    const fadeOutThreshold = minScale + 0.1; // When to start fading out (scale value)
    const fadeInDuration = 0.3; // How long the fade in takes in scale units
    const trailFactor = 0.05; // How long the trails are (higher = longer)
    
    function animate() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        // Update each layer
        for (let i = 0; i < layers.length; i++) {
            // Calculate exponential zoom speed based on current scale
            // As scale increases (stars get closer), they move faster
            const normalizedScale = (layers[i].scale - minScale) / (maxScale - minScale);
            const speedMultiplier = Math.pow(normalizedScale + 0.5, exponent);
            const currentZoomSpeed = baseZoomSpeed * speedMultiplier;
            
            // Decrease scale factor - stars move away from viewer
            layers[i].scale -= currentZoomSpeed;
            
            // Calculate opacity based on scale
            // Fade in when new (large scale)
            if (layers[i].scale > maxScale - fadeInDuration) {
                layers[i].opacity = (maxScale - layers[i].scale) / fadeInDuration;
            } 
            // Fade out when approaching min scale
            else if (layers[i].scale < fadeOutThreshold) {
                layers[i].opacity = (layers[i].scale - minScale) / (fadeOutThreshold - minScale);
            } 
            // Full opacity in the middle
            else {
                layers[i].opacity = 1;
            }
            
            // If layer reaches min scale, reset it
            if (layers[i].scale <= minScale) {
                // Reset layer when it reaches min zoom
                layers[i].scale = maxScale;
                layers[i].opacity = 0; // Start fully transparent
                
                // Regenerate stars for this layer
                const layer = layers[i].layer;
                while (layer.firstChild) {
                    layer.removeChild(layer.firstChild);
                }
                
                // Create new stars with trails
                for (let j = 0; j < 80; j++) {
                    const starGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
                    
                    // Use a wider distribution for stars to ensure they cover the screen even when small
                    const offsetX = (Math.random() * window.innerWidth * 3) - (window.innerWidth * 1.5);
                    const offsetY = (Math.random() * window.innerHeight * 3) - (window.innerHeight * 1.5);
                    const radius = Math.min(2, Math.max(0.5, -Math.log(Math.random()) * 1.5));
                    
                    let color;
                    if (Math.random() < 0.7) {
                        color = "#FFFFFF";
                    } else {
                        const colors = ["#00FFFF", "#FFA500", "#FFFF00", "#ADD8E6"];
                        color = colors[Math.floor(Math.random() * colors.length)];
                    }
                    
                    // Create trail line
                    const trail = document.createElementNS("http://www.w3.org/2000/svg", "line");
                    trail.setAttribute("x1", centerX + (offsetX * layers[i].scale));
                    trail.setAttribute("y1", centerY + (offsetY * layers[i].scale));
                    trail.setAttribute("x2", centerX + (offsetX * layers[i].scale));
                    trail.setAttribute("y2", centerY + (offsetY * layers[i].scale));
                    trail.setAttribute("stroke", color);
                    trail.setAttribute("stroke-width", radius * 0.8);
                    trail.setAttribute("opacity", "0");
                    starGroup.appendChild(trail);
                    
                    // Create star (circle)
                    const star = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                    star.setAttribute("cx", centerX + (offsetX * layers[i].scale));
                    star.setAttribute("cy", centerY + (offsetY * layers[i].scale));
                    star.setAttribute("r", radius);
                    star.setAttribute("fill", color);
                    star.setAttribute("opacity", "0");
                    star.classList.add("glow-filter");
                    starGroup.appendChild(star);
                    
                    // Determine if this star should blink (only 5% chance)
                    const shouldBlink = Math.random() < 0.05;
                    
                    starGroup.dataset.offsetX = offsetX;
                    starGroup.dataset.offsetY = offsetY;
                    starGroup.dataset.radius = radius;
                    starGroup.dataset.color = color;
                    
                    // Add blink properties if applicable
                    if (shouldBlink) {
                        starGroup.dataset.blink = "true";
                        starGroup.dataset.blinkSpeed = Math.random() * 0.03 * 0.3;
                        starGroup.dataset.blinkPhase = Math.random() * Math.PI * 2;
                    }
                    
                    layer.appendChild(starGroup);
                }
            }
            
            // Update stars in this layer
            const starGroups = layers[i].layer.querySelectorAll('g');
            starGroups.forEach((group, index) => {
                const offsetX = parseFloat(group.dataset.offsetX);
                const offsetY = parseFloat(group.dataset.offsetY);
                
                // Calculate current position
                const x = centerX + (offsetX * layers[i].scale);
                const y = centerY + (offsetY * layers[i].scale);
                
                // Get the star and trail elements
                const star = group.querySelector('circle');
                const trail = group.querySelector('line');
                
                // Update star position
                star.setAttribute("cx", x);
                star.setAttribute("cy", y);
                
                // Apply blinking effect if this star should blink
                let finalOpacity = layers[i].opacity;
                if (group.dataset.blink === "true") {
                    const blinkSpeed = parseFloat(group.dataset.blinkSpeed);
                    const blinkPhase = parseFloat(group.dataset.blinkPhase);
                    // Sine wave oscillation for smooth blinking
                    // Adjust the wave to be 95% on, 5% off with very subtle dimming
                    const wave = Math.sin(Date.now() * blinkSpeed + blinkPhase);
                    // Only dim when wave is in the lowest 5% of its cycle, and dim less
                    const blinkFactor = wave < -0.9 ? 0.7 + 0.3 * (wave + 1) : 1.0;
                    finalOpacity *= blinkFactor;
                }
                
                star.setAttribute("opacity", Math.max(0, Math.min(1, finalOpacity)));
                
                // Calculate trail length based on speed
                const trailLength = speedMultiplier * trailFactor * layers[i].scale;
                
                // Calculate trail start position (in front of the star since direction is reversed)
                const trailStartX = x + (offsetX * trailLength);
                const trailStartY = y + (offsetY * trailLength);
                
                // Update trail
                trail.setAttribute("x1", trailStartX);
                trail.setAttribute("y1", trailStartY);
                trail.setAttribute("x2", x);
                trail.setAttribute("y2", y);
                trail.setAttribute("opacity", Math.max(0, Math.min(0.6, finalOpacity * 0.6)));
            });
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Generate the starry sky when the page loads
window.addEventListener("load", createStarrySky);

// Handle window resize
window.addEventListener("resize", () => {
    const oldSvg = document.querySelector("svg");
    if (oldSvg) {
        oldSvg.remove();
    }
    createStarrySky();
});