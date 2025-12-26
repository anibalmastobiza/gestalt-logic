var STIMULI = [
    {
        id: "S1",
        type: "symmetric",
        validity: "valid",
        elegance: "high",
        structure: {
            nodes: [
                {id: "P1", x: 140, y: 30, shape: "diamond"},
                {id: "P2", x: 80, y: 90, shape: "diamond"},
                {id: "P3", x: 200, y: 90, shape: "diamond"},
                {id: "C", x: 140, y: 160, shape: "diamond"}
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
                {id: "P2", x: 80, y: 90, shape: "circle"},
                {id: "P3", x: 200, y: 90, shape: "circle"},
                {id: "C", x: 140, y: 160, shape: "circle"}
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
        type: "asymmetric",
        validity: "valid",
        elegance: "low",
        structure: {
            nodes: [
                {id: "P1", x: 60, y: 30, shape: "square"},
                {id: "P2", x: 180, y: 50, shape: "triangle"},
                {id: "P3", x: 100, y: 110, shape: "circle"},
                {id: "C", x: 200, y: 160, shape: "square"}
            ],
            edges: [
                {from: "P1", to: "P3"},
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
        type: "asymmetric",
        validity: "invalid",
        elegance: "low",
        structure: {
            nodes: [
                {id: "P1", x: 50, y: 40, shape: "triangle"},
                {id: "P2", x: 150, y: 30, shape: "square"},
                {id: "P3", x: 220, y: 100, shape: "circle"},
                {id: "C", x: 80, y: 160, shape: "triangle"}
            ],
            edges: [
                {from: "P1", to: "C"},
                {from: "P2", to: "P3"}
            ]
        },
        content: {
            premises: [
                "The universe is vast and complex.",
                "Complex things require designers.",
                "Humans can appreciate beauty."
            ],
            conclusion: "Therefore, life has objective meaning."
        },
        conclusionShape: "triangle"
    },
    {
        id: "S5",
        type: "circular",
        validity: "valid",
        elegance: "medium",
        structure: {
            nodes: [
                {id: "P1", x: 140, y: 30, shape: "circle"},
                {id: "P2", x: 220, y: 100, shape: "circle"},
                {id: "P3", x: 180, y: 170, shape: "circle"},
                {id: "C", x: 80, y: 130, shape: "circle"}
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
                "Knowledge requires justified true belief.",
                "Justification depends on reliable processes.",
                "Reliability is established through past success."
            ],
            conclusion: "Therefore, knowledge is possible only with track records."
        },
        conclusionShape: "circle"
    },
    {
        id: "S6",
        type: "circular",
        validity: "invalid",
        elegance: "medium",
        structure: {
            nodes: [
                {id: "P1", x: 140, y: 30, shape: "square"},
                {id: "P2", x: 220, y: 100, shape: "square"},
                {id: "P3", x: 180, y: 170, shape: "square"},
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
        type: "convergent",
        validity: "valid",
        elegance: "high",
        structure: {
            nodes: [
                {id: "P1", x: 60, y: 30, shape: "triangle"},
                {id: "P2", x: 140, y: 30, shape: "triangle"},
                {id: "P3", x: 220, y: 30, shape: "triangle"},
                {id: "C", x: 140, y: 150, shape: "triangle"}
            ],
            edges: [
                {from: "P1", to: "C"},
                {from: "P2", to: "C"},
                {from: "P3", to: "C"}
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
        id: "S8",
        type: "divergent",
        validity: "invalid",
        elegance: "low",
        structure: {
            nodes: [
                {id: "P1", x: 140, y: 30, shape: "diamond"},
                {id: "C1", x: 60, y: 120, shape: "circle"},
                {id: "C2", x: 140, y: 140, shape: "square"},
                {id: "C3", x: 220, y: 120, shape: "triangle"}
            ],
            edges: [
                {from: "P1", to: "C1"},
                {from: "P1", to: "C2"},
                {from: "P1", to: "C3"}
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
