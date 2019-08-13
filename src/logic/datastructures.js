const R = require("ramda")

// example of the target: "the docmap"
// has one example prop doc "hallo"
const docmap = {
    // doc
    "hallo": {
        count: 5,
        cases: { //wordMap
            "Hallo": 4,
            "hallo": 1,
            "hallO": 10
        },
        followedBy: {
            "ruben": 3
        },
        joyDirStr: "L0L1R3L0"
    },
    "kallo": {
        count: 10,
        cases: { //wordMap
        },
        followedBy: {
            "ballo": 3
        },
        joyDirStr: "L0L1R3L0"
    }
}

// example of the target: "the docmap"
// has one example prop doc "hallo"
const languagepack = {
    // baseDoc
    "hallo": {
        count: 5,
        followedBy: [ //max5
            "ruben",
        ],
        joyDirStr: "L0L1R3L0"
    }
}


    
