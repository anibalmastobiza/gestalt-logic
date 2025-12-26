var CONFIG = {
    GOOGLE_SCRIPT_URL: 'YOUR_GOOGLE_SCRIPT_URL_HERE',
    PROLIFIC_REDIRECT_URL: 'https://app.prolific.com/submissions/complete?cc=XXXXXXXX',
    TOTAL_TRIALS: 8
};

var state = {
    participantId: null,
    prolificPid: null,
    studyId: null,
    sessionId: null,
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
        return '<polygon points="' + x + ',' + (y - half) + ' ' + (x + half) + ',' + y + ' ' + x + ',' + (y + half) + ' ' + (x - half) + ',' + y + '" fill="#6366f1"/>';
    } else if (shape === 'circle') {
        return '<circle cx="' + x + '" cy="' + y + '" r="' + half + '" fill="#6366f1"/>';
    } else if (shape === 'square') {
        return '<rect x="' + (x - half) + '" y="' + (y - half) + '" width="' + size + '" height="' + size + '" fill="#6366f1"/>';
    } else if (shape === 'triangle') {
        return '<polygon points="' + x + ',' + (y - half) + ' ' + (x + half) + ',' + (y + half) + ' ' + (x - half) + ',' + (y + half) + '" fill="#6366f1"/>';
    }
    return '';
}

function drawArrow(x1, y1, x2, y2, dashed) {
    var angle = Math.atan2(y2 - y1, x2 - x1);
    var length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    
    var shortenStart = 12;
    var shortenEnd = 12;
    
    var startX = x1 + Math.cos(angle) * shortenStart;
    var startY = y1 + Math.sin(angle) * shortenStart;
    var endX = x2 - Math.cos(angle) * shortenEnd;
    var endY = y2 - Math.sin(angle) * shortenEnd;
    
    var arrowSize = 6;
    var arrowAngle = Math.PI / 6;
    var arrow1X = endX - arrowSize * Math.cos(angle - arrowAngle);
    var arrow1Y = endY - arrowSize * Math.sin(angle - arrowAngle);
    var arrow2X = endX - arrowSize * Math.cos(angle + arrowAngle);
    var arrow2Y = endY - arrowSize * Math.sin(angle + arrowAngle);
    
    var dashAttr = dashed ? ' stroke-dasharray="4,4"' : '';
    var opacity = dashed ? '0.5' : '1';
    
    var svg = '<line x1="' + startX + '" y1="' + startY + '" x2="' + endX + '" y2="' + endY + '" stroke="#4a4a6a" stroke-width="2" opacity="' + opacity + '"' + dashAttr + '/>';
    svg += '<polygon points="' + endX + ',' + endY + ' ' + arrow1X + ',' + arrow1Y + ' ' + arrow2X + ',' + arrow2Y + '" fill="#4a4a6a" opacity="' + opacity + '"/>';
    
    return svg;
}

function drawStructure(structure, showConclusion) {
    var svg = '<svg class="structure-svg" viewBox="0 0 280 220">';
    
    var nodeMap = {};
    for (var n = 0; n < structure.nodes.length; n++) {
        nodeMap[structure.nodes[n].id] = structure.nodes[n];
    }
    
    for (var i = 0; i < structure.edges.length; i++) {
        var edge = structure.edges[i];
        var fromNode = nodeMap[edge.from];
        var toNode = nodeMap[edge.to];
        
        if (fromNode && toNode) {
            var isToConclusion = toNode.id === 'C';
            if (!showConclusion && isToConclusion) {
                svg += drawArrow(fromNode.x, fromNode.y, toNode.x, toNode.y - 10, true);
            } else {
                svg += drawArrow(fromNode.x, fromNode.y, toNode.x, toNode.y, edge.dashed);
            }
        }
    }
    
    for (var k = 0; k < structure.nodes.length; k++) {
        var node = structure.nodes[k];
        
        if (!showConclusion && node.id === 'C') {
            svg += '<text x="' + node.x + '" y="' + (node.y + 6) + '" text-anchor="middle" fill="#6366f1" font-size="28" font-weight="bold">?</text>';
        } else {
            svg += drawShape(node.x, node.y, node.shape, 20);
        }
    }
    
    svg += '</svg>';
    return svg;
}

function renderPhase1(trial) {
    var container = document.getElementById('trial-content');
    
    var html = '<div class="phase-label">Argument Structure</div>' +
        '<div class="structure-display">' +
        drawStructure(trial.structure, false) +
        '</div>' +
        '<p class="prediction-prompt">What shape should the conclusion (?) be?</p>' +
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
    
    var html = '<div class="phase-label">Full Argument</div>' +
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
        '<p class="rating-label">How satisfying is the argument structure?</p>' +
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
    var payload = {
        participantId: state.participantId,
        prolificPid: state.prolificPid,
        studyId: state.studyId,
        sessionId: state.sessionId,
        startTime: state.startTime,
        endTime: new Date().toISOString(),
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
    
    showScreen('debrief');
    
    setTimeout(function() {
        if (CONFIG.PROLIFIC_REDIRECT_URL !== 'https://app.prolific.com/submissions/complete?cc=XXXXXXXX') {
            window.location.href = CONFIG.PROLIFIC_REDIRECT_URL;
        }
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Gestalt Logic initialized');
    
    var urlParams = getUrlParams();
    state.prolificPid = urlParams.prolificPid;
    state.studyId = urlParams.studyId;
    state.sessionId = urlParams.sessionId;
    state.participantId = urlParams.prolificPid || generateId();
    
    document.getElementById('start-btn').addEventListener('click', function() {
        showScreen('consent');
    });
    
    var consentCheck = document.getElementById('consent-check');
    var consentBtn = document.getElementById('consent-btn');
    
    consentCheck.addEventListener('change', function() {
        consentBtn.disabled = !this.checked;
    });
    
    consentBtn.addEventListener('click', function() {
        state.startTime = new Date().toISOString();
        showScreen('instructions');
    });
    
    document.getElementById('start-trials-btn').addEventListener('click', function() {
        startTrials();
    });
    
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
