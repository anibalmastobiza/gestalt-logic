var CONFIG = {
    GOOGLE_SCRIPT_URL: 'YOUR_GOOGLE_SCRIPT_URL_HERE',
    TOTAL_TRIALS: 8,
    COMPLETION_CODE_PREFIX: 'GL'
};

var state = {
    participantId: null,
    startTime: null,
    currentTrial: 0,
    trials: [],
    responses: [],
    postStudy: {}
};

function generateId() {
    return 'xxxx-xxxx'.replace(/x/g, function() {
        return Math.floor(Math.random() * 16).toString(16);
    });
}

function generateCompletionCode() {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var code = CONFIG.COMPLETION_CODE_PREFIX + '-';
    for (var i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

function getUrlParams() {
    var params = new URLSearchParams(window.location.search);
    return {
        prolificPid: params.get('PROLIFIC_PID'),
        studyId: params.get('STUDY_ID'),
        sessionId: params.get('SESSION_ID')
    };
}

function showScreen(screenId) {
    var screens = document.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) {
        screens[i].classList.remove('active');
    }
    var target = document.getElementById(screenId);
    if (target) {
        target.classList.add('active');
    }
    window.scrollTo(0, 0);
}

function drawShape(x, y, shape, size) {
    size = size || 16;
    var half = size / 2;
    
    if (shape === 'diamond') {
        return '<polygon points="' + x + ',' + (y - half) + ' ' + (x + half) + ',' + y + ' ' + x + ',' + (y + half) + ' ' + (x - half) + ',' + y + '" fill="currentColor"/>';
    } else if (shape === 'circle') {
        return '<circle cx="' + x + '" cy="' + y + '" r="' + half + '" fill="currentColor"/>';
    } else if (shape === 'square') {
        return '<rect x="' + (x - half) + '" y="' + (y - half) + '" width="' + size + '" height="' + size + '" fill="currentColor"/>';
    } else if (shape === 'triangle') {
        return '<polygon points="' + x + ',' + (y - half) + ' ' + (x + half) + ',' + (y + half) + ' ' + (x - half) + ',' + (y + half) + '" fill="currentColor"/>';
    }
    return '';
}

function drawStructure(structure, showConclusion) {
    var svg = '<svg class="structure-svg" viewBox="0 0 280 200">';
    
    // Draw edges
    for (var i = 0; i < structure.edges.length; i++) {
        var edge = structure.edges[i];
        var fromNode = null;
        var toNode = null;
        
        for (var j = 0; j < structure.nodes.length; j++) {
            if (structure.nodes[j].id === edge.from) fromNode = structure.nodes[j];
            if (structure.nodes[j].id === edge.to) toNode = structure.nodes[j];
        }
        
        if (fromNode && toNode) {
            if (!showConclusion && toNode.id === 'C') continue;
            
            var dashArray = edge.dashed ? 'stroke-dasharray="4"' : '';
            svg += '<line x1="' + fromNode.x + '" y1="' + fromNode.y + '" x2="' + toNode.x + '" y2="' + toNode.y + '" stroke="#4a4a5a" stroke-width="2" ' + dashArray + '/>';
        }
    }
    
    // Draw nodes
    for (var k = 0; k < structure.nodes.length; k++) {
        var node = structure.nodes[k];
        
        if (!showConclusion && node.id === 'C') {
            svg += '<text x="' + node.x + '" y="' + (node.y + 6) + '" text-anchor="middle" fill="#6366f1" font-size="24" font-weight="bold">?</text>';
        } else {
            svg += drawShape(node.x, node.y, node.shape, 20);
        }
    }
    
    svg += '</svg>';
    return svg;
}

function renderPhase1(trial) {
    var container = document.getElementById('trial-content');
    
    var html = '<div class="phase-label">Structure</div>' +
        '<div class="structure-display">' +
        drawStructure(trial.structure, false) +
        '</div>' +
        '<p class="prediction-prompt">What shape should the conclusion be?</p>' +
        '<div class="shape-options">' +
        '<button class="btn-shape" data-shape="diamond">' +
        '<svg viewBox="0 0 40 40"><polygon points="20,5 35,20 20,35 5,20" fill="currentColor"/></svg>' +
        '</button>' +
        '<button class="btn-shape" data-shape="circle">' +
        '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="14" fill="currentColor"/></svg>' +
        '</button>' +
        '<button class="btn-shape" data-shape="square">' +
        '<svg viewBox="0 0 40 40"><rect x="6" y="6" width="28" height="28" fill="currentColor"/></svg>' +
        '</button>' +
        '<button class="btn-shape" data-shape="triangle">' +
        '<svg viewBox="0 0 40 40"><polygon points="20,5 35,35 5,35" fill="currentColor"/></svg>' +
        '</button>' +
        '</div>' +
        '<div class="trial-actions">' +
        '<button class="btn btn-primary" id="phase1-next" disabled>Continue</button>' +
        '</div>';
    
    container.innerHTML = html;
    
    var selectedShape = null;
    var shapeButtons = document.querySelectorAll('.btn-shape');
    var nextBtn = document.getElementById('phase1-next');
    
    for (var i = 0; i < shapeButtons.length; i++) {
        shapeButtons[i].addEventListener('click', function() {
            for (var j = 0; j < shapeButtons.length; j++) {
                shapeButtons[j].classList.remove('selected');
            }
            this.classList.add('selected');
            selectedShape = this.getAttribute('data-shape');
            nextBtn.disabled = false;
        });
    }
    
    nextBtn.addEventListener('click', function() {
        state.responses[state.currentTrial] = {
            trialId: trial.id,
            type: trial.type,
            validity: trial.validity,
            elegance: trial.elegance,
            predictedShape: selectedShape,
            actualShape: trial.conclusionShape,
            predictionCorrect: selectedShape === trial.conclusionShape,
            phase1Time: Date.now()
        };
        renderPhase2(trial);
    });
}

function renderPhase2(trial) {
    var container = document.getElementById('trial-content');
    
    var premisesHtml = '';
    for (var i = 0; i < trial.content.premises.length; i++) {
        premisesHtml += '<p class="premise">' + trial.content.premises[i] + '</p>';
    }
    
    var html = '<div class="phase-label">Argument</div>' +
        '<div class="structure-display">' +
        drawStructure(trial.structure, true) +
        '</div>' +
        '<div class="argument-box">' +
        premisesHtml +
        '<p class="conclusion">' + trial.content.conclusion + '</p>' +
        '</div>' +
        '<div class="rating-group">' +
        '<p class="rating-label">How logically valid is this argument?</p>' +
        '<div class="rating-slider-container">' +
        '<div class="slider-labels"><span>Invalid</span><span>Valid</span></div>' +
        '<input type="range" class="slider" id="validity-slider" min="1" max="7" value="4">' +
        '<div class="slider-value" id="validity-value">4</div>' +
        '</div>' +
        '</div>' +
        '<div class="rating-group">' +
        '<p class="rating-label">How satisfying is the structure?</p>' +
        '<div class="rating-slider-container">' +
        '<div class="slider-labels"><span>Unsatisfying</span><span>Satisfying</span></div>' +
        '<input type="range" class="slider" id="satisfaction-slider" min="1" max="7" value="4">' +
        '<div class="slider-value" id="satisfaction-value">4</div>' +
        '</div>' +
        '</div>' +
        '<div class="trial-actions">' +
        '<button class="btn btn-primary" id="phase2-next">Next</button>' +
        '</div>';
    
    container.innerHTML = html;
    
    var validitySlider = document.getElementById('validity-slider');
    var validityValue = document.getElementById('validity-value');
    var satisfactionSlider = document.getElementById('satisfaction-slider');
    var satisfactionValue = document.getElementById('satisfaction-value');
    
    validitySlider.addEventListener('input', function() {
        validityValue.textContent = this.value;
    });
    
    satisfactionSlider.addEventListener('input', function() {
        satisfactionValue.textContent = this.value;
    });
    
    document.getElementById('phase2-next').addEventListener('click', function() {
        state.responses[state.currentTrial].validityRating = parseInt(validitySlider.value);
        state.responses[state.currentTrial].satisfactionRating = parseInt(satisfactionSlider.value);
        state.responses[state.currentTrial].phase2Time = Date.now();
        state.responses[state.currentTrial].totalTime = Date.now() - state.responses[state.currentTrial].phase1Time;
        
        state.currentTrial++;
        
        if (state.currentTrial >= CONFIG.TOTAL_TRIALS) {
            showScreen('post-study');
        } else {
            updateProgress();
            renderPhase1(state.trials[state.currentTrial]);
        }
    });
}

function updateProgress() {
    document.getElementById('trial-counter').textContent = (state.currentTrial + 1) + ' / ' + CONFIG.TOTAL_TRIALS;
    document.getElementById('trial-progress-bar').style.width = (state.currentTrial / CONFIG.TOTAL_TRIALS * 100) + '%';
}

function startTrials() {
    state.trials = getShuffledStimuli();
    state.currentTrial = 0;
    state.responses = [];
    showScreen('trial');
    updateProgress();
    renderPhase1(state.trials[0]);
}

function submitData() {
    var completionCode = generateCompletionCode();
    
    var payload = {
        participantId: state.participantId,
        startTime: state.startTime,
        endTime: new Date().toISOString(),
        completionCode: completionCode,
        trials: state.responses,
        postStudy: state.postStudy
    };
    
    if (CONFIG.GOOGLE_SCRIPT_URL !== 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
        fetch(CONFIG.GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).then(function() {
            console.log('Data submitted');
        }).catch(function(err) {
            console.error('Submit error:', err);
        });
    } else {
        console.log('Data:', payload);
    }
    
    document.getElementById('completion-code').textContent = completionCode;
    showScreen('debrief');
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Gestalt Logic initialized');
    
    // Start button
    document.getElementById('start-btn').addEventListener('click', function() {
        showScreen('consent');
    });
    
    // Consent
    var consentCheck = document.getElementById('consent-check');
    var consentBtn = document.getElementById('consent-btn');
    
    consentCheck.addEventListener('change', function() {
        consentBtn.disabled = !this.checked;
    });
    
    consentBtn.addEventListener('click', function() {
        var urlParams = getUrlParams();
        state.participantId = urlParams.prolificPid || generateId();
        state.startTime = new Date().toISOString();
        showScreen('instructions');
    });
    
    // Start trials
    document.getElementById('start-trials-btn').addEventListener('click', function() {
        startTrials();
    });
    
    // Post study form
    document.getElementById('post-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        var relianceInput = document.querySelector('input[name="reliance"]:checked');
        var expertiseInput = document.querySelector('input[name="expertise"]:checked');
        
        state.postStudy = {
            reliance: relianceInput ? relianceInput.value : '',
            expertise: expertiseInput ? expertiseInput.value : '',
            attention: document.getElementById('attention').value
        };
        
        submitData();
    });
});
