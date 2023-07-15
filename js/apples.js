addLayer("a", {
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        resetTime: new Decimal(0),
        total: new Decimal(0),
        best: new Decimal(0),
        lightP: new Decimal(0),
        earthA: new Decimal(0),
        waterD: new Decimal(0),
    }},

    color: "#FF0000",
    resource: "Apples.",
    row: 0,
    name: "Apples",

    baseResource: "Points",
    baseAmount() { return player.points.floor() },
    requires: new Decimal(10),

    type: "custom",
    getResetGain() {
        let pts = player.points
        if (player.points.lt(10)) return decimalZero

        let log = new Decimal(10)
        if (hasUpgrade("a", 62)) log = log.minus(upgradeEffect('a', 62))
        
        let init = pts.log(log).times(tmp.a.gainMult).pow(tmp.a.gainExp)
        return init.floor()
    },
    getNextAt() {
        let curr = tmp.a.getResetGain.plus(1).root(tmp.a.gainExp).div(tmp.a.gainMult)
        let log = new Decimal(10)
        if (hasUpgrade("a", 62)) log = log.minus(upgradeEffect('a', 62))

        let ga = new Decimal(log).pow(curr)

        if (ga.lt(10)) ga = new Decimal(10)
        return ga
    },
    canReset() {
        if (player.points.gte(10)) return true
    },
    prestigeNotify() {
        if (tmp.a.getResetGain.gte(1)) return true
    },

    gainMult() {
        let mult = decimalOne
        if (hasUpgrade("a", 61)) mult = mult.times(upgradeEffect("a", 61))
        if (hasUpgrade("a", 63)) mult = mult.times(upgradeEffect("a", 63))
        if (hasUpgrade("a", 71)) mult = mult.times(upgradeEffect("a", 71))
        if (hasUpgrade("a", 72)) mult = mult.times(upgradeEffect("a", 72))
        if (hasUpgrade("a", 73)) mult = mult.times(upgradeEffect("a", 73))

        if (hasUpgrade('a', 65)) mult = mult.times(tmp.a.treeFood)

        return mult
    },
    gainExp() {
        let exp = decimalOne
        if (hasUpgrade('a', 64)) exp = exp.add(0.005)
        if (hasUpgrade('a', 74)) exp = exp.add(0.005)

        return exp
    },

    layerShown() { return true },
    prestigeButtonText() {
        let gain = tmp.a.getResetGain
        let nextAt = tmp.a.getNextAt
        let time = player.a.resetTime


        let amt = "You can reset your Points<br>for <h2>" + formatWhole(gain) + " Apples.</h2>"
        let nxt = ""
        if (gain.lt(1000)) nxt = "<br>You need " + format(nextAt) + "<br>Points for the next one."
        let tme = "<br>They grow since " + format(time) + " seconds."
        return amt + nxt + tme
    },

    hotkeys: [
        {
            key: "a",
            description: "Press A to harvest those Apples!",
            onPress() { if (player.a.unlocked) doReset("a") },
        }
    ],

    update(diff) {
        //EA, WD, LP Production
        tmp.a.gainEA = decimalOne
        tmp.a.gainWD = decimalOne
        tmp.a.gainLP = decimalOne

        tmp.a.gainEA = tmp.a.gainEA.times(buyableEffect('a', 11)).times(buyableEffect('a', 12))
        tmp.a.gainWD = tmp.a.gainWD.times(buyableEffect('a', 21)).times(buyableEffect('a', 22))
        tmp.a.gainLP = tmp.a.gainLP.times(buyableEffect('a', 31)).times(buyableEffect('a', 32))

        if (hasUpgrade('a', 122)) tmp.a.gainEA = tmp.a.gainEA.times(upgradeEffect('a', 122))
        if (hasUpgrade('a', 122)) tmp.a.gainWD = tmp.a.gainWD.times(upgradeEffect('a', 122))
        if (hasUpgrade('a', 122)) tmp.a.gainLP = tmp.a.gainLP.times(upgradeEffect('a', 122))

        if (hasUpgrade('a', 65)) player.a.earthA = player.a.earthA.plus(tmp.a.gainEA.times(diff))
        if (hasUpgrade('a', 65)) player.a.waterD = player.a.waterD.plus(tmp.a.gainWD.times(diff))
        if (hasUpgrade('a', 65)) player.a.lightP = player.a.lightP.plus(tmp.a.gainLP.times(diff))

        let v1 = new Decimal(player.a.earthA).log10().add(1)
        let v2 = new Decimal(player.a.waterD).log10().add(1)
        let v3 = new Decimal(player.a.lightP).log10().add(1)
        tmp.a.treeFood = new Decimal(v1).add(v2).add(v3).log10().add(1)
        if (hasUpgrade('a', 124)) tmp.a.treeFood = tmp.a.treeFood.pow(1.1)

    },

    upgrades: {
        //POINTS 11-55
        11: {
            description: "+0.2 to Point Production for every upgrade bought in this layer.",
            cost: new Decimal(2),
            tooltip: "Formula : .2x",
            effect() {
                let eff = new Decimal(0.2).times(player.a.upgrades.length)
                if (hasUpgrade('a', 14)) return eff.times(1.1)
                else return eff },
        },
        12: {
            description: "The Apples you possess makes your Points come out faster from the Producer somehow...",
            cost: new Decimal(4),
            tooltip: "Formula: log(x+1)/3",
            effect() {
                let eff = new Decimal(player.a.points).add(1).log(10).div(3)
                if (hasUpgrade('a', 14)) return eff.times(1.1)
                else return eff},
            effectDisplay() { return "+" + format(upgradeEffect("a", 12), 3) + "/s"},
        },
        13: {
            description: "You notice it. Oh no. Oh fuck. It's an idle game D:! The longer the reset is, the more you produce! Oh God!",
            cost: new Decimal (8),
            tooltip: "Formula: sqrt(log(x+1))/4",
            effect() {
                let eff = new Decimal(player.a.resetTime).add(1).log10().sqrt().div(4)
                if (hasUpgrade('a', 14)) return eff.times(1.1)
                else return eff},
            effectDisplay() { return "+" + format(upgradeEffect("a", 13), 3) + "/s"},
        },
        14: {
            description: "The three previous upgrades are boosted by 10%.",
            cost: new Decimal (14),
        },
        15: {
            description: "Produce Points 25% faster!!!!!!!!!!! Multiplication!!!!!!!!!!!!",
            cost: new Decimal (22),
        },
        21: {
            description: "+1 to Point Production. Nothing more, nothing less.",
            cost: new Decimal(88),
            tooltip: "For huge stonks, every additive upgrades are applied before the multiplicative ones.",
            unlocked() {return hasUpgrade('a', 65)},
        },
        22: {
            description: "The upgrade above is applied a second time!",
            cost: new Decimal(150),
            unlocked() {return hasUpgrade('a', 65)},
        },
        23: {
            description: "Light Photons affect the mighty Producer.",
            cost: new Decimal(333),
            tooltip: "Formula: log100(x)",
            effect() { return new Decimal(player.a.lightP).log(100)},
            effectDisplay() { return "+" + format(upgradeEffect('a', 23),3) + "/s"},
            unlocked() {return hasUpgrade('a', 65)},
        },
        24: {
            description: "The Producer is 66.6% more efficient. Gasp!",
            cost: new Decimal(666),
            unlocked() {return hasUpgrade('a', 65)},
        },
        25: {
            description: "Tree Food bonus affects the Producer.",
            cost: new Decimal(888),
            effectDisplay() { return "*" + format(tmp.a.treeFood, 3)},
            unlocked() {return hasUpgrade('a', 65)},
        },

        //APPLES 61-115
        61: {
            title: "Let them grow",
            description: "Gain 10% more Apples for each upgrade bought in this layer.",
            cost: new Decimal(1),
            tooltip: "Formula: .1x+1",
            effect() { return new Decimal(0.1).times(player.a.upgrades.length).add(1) },
        },
        62: {
            title: "Already spitting at it",
            description: "Reduce the log's base in the Apples gain formula by 0.02 for each upgrade bought in this layer.",
            cost: new Decimal(4),
            tooltip: "Apples' formula: log10(x) Upgrade formula: .02x",
            effect() { return new Decimal(0.02).times(player.a.upgrades.length)}
        },
        63: {
            title: "They have to become ripe",
            description: "The more you wait patiently, the more you gain when you come back.",
            cost: new Decimal (9),
            tooltip: "Formula: log(x+1))/6+1",
            effect() { return new Decimal(player.a.resetTime).add(1).log10().div(6).add(1)},
            effectDisplay() { return "*" + format(upgradeEffect('a', 63), 3)}
        },
        64: {
            title: "Bigger Apples",
            description: "Apples' gain exponent gets upgraded. +0.005 to it.",
            cost: new Decimal (13),
        },
        65: {
            title: "Hunger needs to vanish",
            description: "Unlock a way to satisfy your screaming stomach.",
            cost: new Decimal(20),
        },
        71: {
            title: "Juicy!",
            description: "Apples' gain is better thanks to Water Droplets.",
            cost: new Decimal(111),
            tooltip: "Formula: (log(x+1)+1)^.333",
            effect() { return new Decimal(player.a.waterD).add(1).log10().add(1).pow(0.333)},
            effectDisplay() { return "*" + format(upgradeEffect('a', 71), 3)},
            unlocked() {return hasUpgrade('a', 65)},
        },
        72: {
            title: "Glowy!",
            description: "Apples' gain is boosted by your Light Photons.",
            cost: new Decimal(300),
            tooltip: "Formula: (log(x+1)+1)^.333",
            effect() { return new Decimal(player.a.lightP).add(1).log10().add(1).pow(0.333)},
            effectDisplay() { return "*" + format(upgradeEffect('a', 72), 3)},
            unlocked() {return hasUpgrade('a', 65)},
        },
        73: {
            title: "Dirty!",
            description: "Apples' gain is multiplied by Earth Atoms.",
            cost: new Decimal(500),
            tooltip: "Formula: (log(x+1)+1)^.333",
            effect() { return new Decimal(player.a.earthA).add(1).log10().add(1).pow(0.333)},
            effectDisplay() { return "*" + format(upgradeEffect('a', 73), 3)},
            unlocked() {return hasUpgrade('a', 65)},
        },
        74: {
            title: "Biggest Apples",
            description: "Apples' gain exponent gets better. +0.005 to it.",
            cost: new Decimal(800),
            unlocked() {return hasUpgrade('a', 65)},
        },
        75: {
            title: "The next step",
            description: "Become a capitalist.",
            cost: new Decimal(1000),
            unlocked() {return hasUpgrade('a', 65)},
        },

        //TREE FOOD 121-125
        121: {
            title: "Gluttony",
            description: "Unlock upgrades to get more Tree Food.",
            cost: new Decimal(30),
            unlocked() {return hasUpgrade('a', 65)},
        },
        122: {
            title: "Those numbers also go up",
            description: "Tree Food gain grows based on time since the last harvest.",
            cost: new Decimal(120),
            tooltip: "Formula: log2(x+2)",
            effect() { return new Decimal(player.a.resetTime).add(2).log2()},
            effectDisplay() { return "*" + format(upgradeEffect('a', 122), 3)},
            unlocked() {return hasUpgrade('a', 65)},
        },
        123: {
            title: "Gluttony II: Nutritionic Foodaloo",
            description: "Unlock upgrades once again to get more Tree Food.",
            cost: new Decimal(120),
            unlocked() {return hasUpgrade('a', 65)},
        },
        124: {
            title: "Vitamins",
            description: "Raise the Tree Food bonus to the 1.1th power.",
            cost: new Decimal(2000),
            unlocked() {return hasUpgrade('a', 65)},
        },
        125: {
            title: "Wooden Vacuum",
            description: "Tree Food gain is raised to a slowly-increasing power, which is based on Apples.",
            cost: new Decimal(5000),
            tooltip: "Formula: log(log2(x+1)+1)+1",
            effect() {return new Decimal(player.a.points.add(1)).log10().add(1).log2().add(1)},
            effectDisplay() { return "^" + format(upgradeEffect('a', 125), 3)},
            unlocked() {return hasUpgrade('a', 65)},
        },
    },

    buyables: {
        11: {
            unlocked() { return hasUpgrade('a', 121) },
            cost() { return new Decimal(2).pow(getBuyableAmount('a', 11)).times(10) },
            effect() { return new Decimal(0.5).times(getBuyableAmount('a', 11)).add(1) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
            player[this.layer].points = player[this.layer].points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            title: "Wiggly Worms",
            tooltip: "Cost Formula: 2^x*10<br>Effect Formula: .5^x+1",
            display() { return `${formatWhole(getBuyableAmount('a', 11))} opened cans<br>---<br>Free the worms... To let them die and decompose into earth for your own growth!! You nasty tree.<br>Each can you open adds 50% to EA gain.<br>Currently: *${format(buyableEffect('a', 11))}<br>---<br><h3>Cost: ${formatWhole(this.cost())} Apples.</h3>`},
        },
        21: {
            unlocked() { return hasUpgrade('a', 121) },
            cost() { return new Decimal(2).pow(getBuyableAmount('a', 21)).times(10) },
            effect() { return new Decimal(0.5).times(getBuyableAmount('a', 21)).add(1) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
            player[this.layer].points = player[this.layer].points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            title: "Long Straw",
            tooltip: "Cost Formula: 2^x*10<br>Effect Formula: .5x+1",
            display() { return `${formatWhole(getBuyableAmount('a', 21))} meters long<br>---<br>Sluuuuuuuuuuuuuuuuuuurp. Really can't stop drooling just thinking about waaaaater daaamnzzz.<br>Each meter adds 50% to WD gain, strangely.<br>Currently: *${format(buyableEffect('a', 21))}<br>---<br><h3>Cost: ${formatWhole(this.cost())} Apples.</h3>`},
        },
        31: {
            unlocked() { return hasUpgrade('a', 121) },
            cost() { return new Decimal(2).pow(getBuyableAmount('a', 31)).times(10) },
            effect() { return new Decimal(0.5).times(getBuyableAmount('a', 31)).add(1) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
            player[this.layer].points = player[this.layer].points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            title: "Solar Panels",
            tooltip: "Cost Formula: 2^x*10<br>Effect Formula: .5x+1",
            display() { return `${formatWhole(getBuyableAmount('a', 31))} panels on your bark<br>---<br>Wait, they don't work like this.<br>Each panel attached to your body adds 50% to LP gain.<br>Currently: *${format(buyableEffect('a', 31))}<br>---<br><h3>Cost: ${formatWhole(this.cost())} Apples.</h3>`},
        },
        12: {
            unlocked() { return hasUpgrade('a', 123) },
            cost() { return new Decimal(10).pow(getBuyableAmount('a', 12).add(3)) },
            effect() { return new Decimal(2).pow(getBuyableAmount('a', 12)) },
            canAfford() { return player.a.earthA.gte(this.cost()) },
            buy() {
            player.a.earthA = player.a.earthA.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            title: "Half-Atoms Mergers",
            tooltip: "Cost Formula: 10^(x+3)<br>Effect Formula: 2^x",
            display() { return `${formatWhole(getBuyableAmount('a', 12))} machines bought<br>---<br>Purchase machines which merge two halves into one whole atom. Yay! Artificial food!<br>Each Half-Atom Merger doubles EA gain.<br>Currently: *${format(buyableEffect('a', 12))}<br>---<br><h3>Cost: ${formatWhole(this.cost())} Earth Atoms.</h3>`},
        },
        22: {
            unlocked() { return hasUpgrade('a', 123) },
            cost() { return new Decimal(10).pow(getBuyableAmount('a', 22).add(3)) },
            effect() { return new Decimal(2).pow(getBuyableAmount('a', 22)) },
            canAfford() { return player.a.waterD.gte(this.cost()) },
            buy() {
            player.a.waterD = player.a.waterD.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            title: "Furnace",
            tooltip: "Cost Formula: 10^(x+3)<br>Effect Formula: 2^x",
            display() { return `${formatWhole(getBuyableAmount('a', 22))} ice cubes melted<br>---<br>Throw ice cubes in it to melt them and drink the boiling water.<br>Each melted cube doubles WD gain.<br>Currently: *${format(buyableEffect('a', 22))}<br>---<br><h3>Cost: ${formatWhole(this.cost())} Water Droplets.</h3>`},
        },
        32: {
            unlocked() { return hasUpgrade('a', 123) },
            cost() { return new Decimal(10).pow(getBuyableAmount('a', 32).add(3)) },
            effect() { return new Decimal(2).pow(getBuyableAmount('a', 32)) },
            canAfford() { return player.a.lightP.gte(this.cost()) },
            buy() {
            player.a.lightP = player.a.lightP.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            title: "Spotlights",
            tooltip: "Cost Formula: 10^(x+3)<br>Effect Formula: 2^x",
            display() { return `${formatWhole(getBuyableAmount('a', 32))} connected outlets<br>---<br>They produce photons I think... Yeah they do. Kind of.<br>Each spotlight you switch on doubles LP gain.<br>Currently: *${format(buyableEffect('a', 32))}<br>---<br><h3>Cost: ${formatWhole(this.cost())} Light Photons.</h3>`},
        },
    },

    tabFormat: [
        "main-display",
        "prestige-button",
        "resource-display",
        ["display-text", () => {return `A Multiplier: ${format(tmp.a.gainMult, 3)} | A Exponent: ${format(tmp.a.gainExp, 3)}`}],
        "blank",
        ["microtabs", "tabs"],
    ],
    microtabs: {
        tabs: {
            Upgrades: {
                content: [
                    "blank",
                    ["display-text", 'You can boost various things here, from various sources! All of that in exchange of Apples!'],
                    "blank",
                    ["microtabs", "upg"],
                ],
            },
            "Tree Food": {
                unlocked() { return hasUpgrade('a', 65)},
                content: [
                    "blank",
                    ["display-text", 'Consume tons of food, grow tons of Apples... Ain\'t I right, maybe?'],
                    "blank",
                    ["display-text", () => {return `All the food you gathered currently give ${format(tmp.a.treeFood, 3)} times more Apples :o!`}, {"color": "#ff0000"}],
                    ["display-text", 'Formula: log(log([EA]+1)+log([WD]+1)+log([LP]+1))', {"font-size": "12px", "color": "#666666"}],
                    "blank",
                    ["row", [["upgrade", "121"], ["upgrade", "122"], ["upgrade", "123"], ["upgrade", "124"], ["upgrade", "125"]]],
                    "blank",
                    "h-line",
                    "blank",
                    ["display-text", () => {return `There are ${formatWhole(player.a.earthA)} Earth Atoms lying around to eat.`}, {"color": "#592828", "font-size": "20px"}],
                    ["display-text", () => {return `(+${format(tmp.a.gainEA)}/s)`}, {"color": "#592828"}],
                    "blank",
                    ["row", [["buyable", "11"], ["buyable", "12"]]],
                    "blank",
                    ["display-text", () => {return `There are ${formatWhole(player.a.waterD)} Water Droplets in the pond next to you.`}, {"color": "#0000ff", "font-size": "20px"}],
                    ["display-text", () => {return `(+${format(tmp.a.gainWD)}/s)`}, {"color": "#0000ff"}],
                    "blank",
                    ["row", [["buyable", "21"], ["buyable", "22"]]],
                    "blank",
                    ["display-text", () => {return `There are ${formatWhole(player.a.lightP)} Light Photons to absorb to grow.`}, {"color": "#ffff00", "font-size": "20px"}],
                    ["display-text", () => {return `(+${format(tmp.a.gainLP)}/s)`}, {"color": "#ffff00"}],
                    "blank",
                    ["row", [["buyable", "31"], ["buyable", "32"]]],
                ],
            },
        },
        upg: {
            Points: {
                content: [
                    "blank",
                    ["row", [["upgrade", "11"], ["upgrade", "12"], ["upgrade", "13"], ["upgrade", "14"], ["upgrade", "15"]]],
                    ["row", [["upgrade", "21"], ["upgrade", "22"], ["upgrade", "23"], ["upgrade", "24"], ["upgrade", "25"]]],
                ],
            },
            Apples: {
                content: [
                    "blank",
                    ["row", [["upgrade", "61"], ["upgrade", "62"], ["upgrade", "63"], ["upgrade", "64"], ["upgrade", "65"]]],
                    ["row", [["upgrade", "71"], ["upgrade", "72"], ["upgrade", "73"], ["upgrade", "74"], ["upgrade", "75"]]],
                ],
            },
        },
    },
})