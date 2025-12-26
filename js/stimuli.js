var STIMULI = [
    {
        id: "S1",
        type: "symmetric",
        validity: "valid",
        elegance: "high",
        structure: {
            nodes: [
                {id: "P1", x: 140, y: 30, shape: "diamond"},
                {id: "P2", x: 70, y: 100, shape: "diamond"},
                {id: "P3", x: 210, y: 100, shape: "diamond"},
                {id: "C", x: 140, y: 170, shape: "diamond"}
            ],
            edges: [
                {from: "P1", to: "P2"},
                {from: "P1", to: "P3"},
                {from: "P2", to: "C"},
                {from: "P3", to: "C"}
            ]
        },
        content: {
            premises: [
                "All rational beings have moral worth.",
                "Humans are rational beings.",
                "Whatever has moral worth deserves respect."
            ],
            conclusion: "Therefore, humans deserve respect."
        },
        conclusionShape: "diamond"
    },
    {
        id: "S2",
        type: "symmetric",
        validity: "invalid",
        elegance: "high",
        structure: {
            nodes: [
                {id: "P1", x: 140, y: 30, shape: "circle"},
                {id: "P2", x: 70, y: 100, shape: "circle"},
                {id: "P3", x: 210, y: 100, shape: "circle"},
                {id: "C", x: 140, y: 170, shape: "circle"}
            ],
            edges: [
                {from: "P1", to: "P2"},
                {from: "P1", to: "P3"},
                {from: "P2", to: "C"},
                {from: "P3", to: "C"}
            ]
        },
        content: {
            premises: [
                "Some scientists believe in free will.",
                "Some scientists are determinists.",
                "Determinists deny free will."
            ],
            conclusion: "Therefore, science disproves free will."
        },
        conclusionShape: "circle"
    },
    {
        id: "S3",
        type: "linear",
        validity: "valid",
        elegance: "medium",
        structure: {
            nodes: [
                {id: "P1", x: 140, y: 25, shape: "square"},
                {id: "P2", x: 140, y: 85, shape: "square"},
                {id: "P3", x: 140, y: 145, shape: "square"},
                {id: "C", x: 140, y: 205, shape: "square"}
            ],
            edges: [
                {from: "P1", to: "P2"},
                {from: "P2", to: "P3"},
                {from: "P3", to: "C"}
            ]
        },
        content: {
            premises: [
                "If an action maximizes well-being, it is morally right.",
                "Donating to effective charities maximizes well-being.",
                "We ought to do what is morally right."
            ],
            conclusion: "Therefore, we ought to donate to effective charities."
        },
        conclusionShape: "square"
    },
    {
        id: "S4",
        type: "broken",
        validity: "invalid",
        elegance: "low",
        structure: {
            nodes: [
                {id: "P1", x: 70, y: 40, shape: "triangle"},
                {id: "P2", x: 210, y: 40, shape: "square"},
                {id: "P3", x: 210, y: 120, shape: "circle"},
                {id: "C", x: 70, y: 170, shape: "triangle"}
            ],
            edges: [
                {from: "P1", to: "C"},
                {from: "P2", to: "P3"},
                {from: "P3", to: "C", dashed: true}
            ]
        },
        content: {
            premises: [
                "The universe is vast and complex.",
                "Complex things often have causes.",
                "Humans can appreciate beauty."
            ],
            conclusion: "Therefore, life has objective meaning."
        },
        conclusionShape: "triangle"
    },
    {
        id: "S5",
        type: "convergent",
        validity: "valid",
        elegance: "high",
        structure: {
            nodes: [
                {id: "P1", x: 60, y: 40, shape: "triangle"},
                {id: "P2", x: 140, y: 40, shape: "triangle"},
                {id: "P3", x: 220, y: 40, shape: "triangle"},
                {id: "M", x: 140, y: 110, shape: "triangle"},
                {id: "C", x: 140, y: 175, shape: "triangle"}
            ],
            edges: [
                {from: "P1", to: "M"},
                {from: "P2", to: "M"},
                {from: "P3", to: "M"},
                {from: "M", to: "C"}
            ]
        },
        content: {
            premises: [
                "Consciousness cannot be reduced to physical processes.",
                "Mental states have causal power.",
                "Subjective experience is irreducible."
            ],
            conclusion: "Therefore, physicalism is incomplete."
        },
        conclusionShape: "triangle"
    },
    {
        id: "S6",
        type: "circular",
        validity: "invalid",
        elegance: "medium",
        structure: {
            nodes: [
                {id: "P1", x: 140, y: 35, shape: "square"},
                {id: "P2", x: 220, y: 100, shape: "square"},
                {id: "P3", x: 180, y: 175, shape: "square"},
                {id: "C", x: 80, y: 130, shape: "square"}
            ],
            edges: [
                {from: "P1", to: "P2"},
                {from: "P2", to: "P3"},
                {from: "P3", to: "C"},
                {from: "C", to: "P1", dashed: true}
            ]
        },
        content: {
            premises: [
                "This statement is either true or false.",
                "If true, then truth is relative.",
                "If false, then there are absolute truths."
            ],
            conclusion: "Therefore, truth is both relative and absolute."
        },
        conclusionShape: "square"
    },
    {
        id: "S7",
        type: "hierarchical",
        validity: "valid",
        elegance: "high",
        structure: {
            nodes: [
                {id: "P1", x: 80, y: 30, shape: "circle"},
                {id: "P2", x: 200, y: 30, shape: "circle"},
                {id: "M1", x: 80, y: 100, shape: "circle"},
                {id: "M2", x: 200, y: 100, shape: "circle"},
                {id: "C", x: 140, y: 170, shape: "circle"}
            ],
            edges: [
                {from: "P1", to: "M1"},
                {from: "P2", to: "M2"},
                {from: "M1", to: "C"},
                {from: "M2", to: "C"}
            ]
        },
        content: {
            premises: [
                "Knowledge requires justified true belief.",
                "Justification depends on reliable processes.",
                "Reliability is established through evidence."
            ],
            conclusion: "Therefore, knowledge requires evidence."
        },
        conclusionShape: "circle"
    },
    {
        id: "S8",
        type: "scattered",
        validity: "invalid",
        elegance: "low",
        structure: {
            nodes: [
                {id: "P1", x: 140, y: 30, shape: "diamond"},
                {id: "P2", x: 60, y: 90, shape: "circle"},
                {id: "P3", x: 220, y: 110, shape: "triangle"},
                {id: "C", x: 140, y: 175, shape: "square"}
            ],
            edges: [
                {from: "P1", to: "P2"},
                {from: "P1", to: "P3"},
                {from: "P2", to: "C", dashed: true},
                {from: "P3", to: "C", dashed: true}
            ]
        },
        content: {
            premises: [
                "Ancient philosophers discussed virtue.",
                "Modern science studies the brain.",
                "People disagree about ethics."
            ],
            conclusion: "Therefore, morality is innate to humans."
        },
        conclusionShape: "square"
    }
];

function shuffleArray(array) {
    var arr = array.slice();
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

function getShuffledStimuli() {
    return shuffleArray(STIMULI);
}
