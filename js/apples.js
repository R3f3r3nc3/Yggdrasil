addLayer("a", {
    name: "Apples", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        earthQuality: new Decimal(0),
        waterAmount: new Decimal(0),
        sunLight: new Decimal(0),
    }},

    color: "#FF0000",
    requires: new Decimal(5), // Can be a function that takes requirement increases into account
    resource: "Apples.", // Name of prestige currency
    baseResource: "Points.", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.2, // Prestige currency exponent

    // inflation lays here
    gainMult() { // Calculate the multiplier for main currency from bonuses
        base = new Decimal(1)
        multi = new Decimal(1)
        expo = new Decimal(1)

        if (hasUpgrade('a', 62)) base = base.add(1)

        if (hasUpgrade('a', 61)) multi = multi.times(1.1)
        if (hasUpgrade('a', 63)) multi = multi.times(1.2)
        if (hasUpgrade('a', 64)) multi = multi.times(upgradeEffect('a', 64))
        
        mult = base.mul(multi).pow(expo)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        base = new Decimal(1)
        multi = new Decimal(1)
        expo = new Decimal(1)


        
        exp = base.mul(multi).pow(expo)
        return exp
    },


    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "a", description: "A: Reset for some Apples.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},

    resetDescription: "Reset all your Points for ",

    onPrestige() {
        
    },

    update(diff) {
        if (hasUpgrade('a', 65)) return
            player.a.earthQuality = new Decimal(1).times(diff)
            player.a.waterAmount = new Decimal(1).times(diff)
            player.a.sunLight = new Decimal(1).times(diff)
    },

    upgrades: {
        // Points Upgrades (11 - 55 (5 rows & 5 columns))
        11: {
            description: "+1 to Point gain.",
            cost: new Decimal(4),
        },
        12: {
            description: "+2 to Point gain.",
            cost: new Decimal(9),
        },
        13: {
            description: "Obtain 50% more Points.",
            cost: new Decimal(20),
        },
        14: {
            description: "All A upgrades boosts Points by 5% additively.",
            cost: new Decimal(33),
            effect() {
                return new Decimal(player.a.upgrades.length).mul(0.05).add(1)
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"*"
            },
            tooltip: "Formula:<br>x*0.05+1",
        },
        15: {
            description: "Points boost themselves.",
            cost: new Decimal(50),
            effect() {
                return new Decimal(player.points).pow(0.5).pow(0.5).add(1)
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"+"
            },
            tooltip: "Formula:<br>sqrt(sqrt(x))+1",
        },
        // Apples Upgrades (61 - 105 (5 rows & 5 columns))
        61: {
            title: "Tasty!",
            description: "Gain 10% more Apples.",
            cost: new Decimal(2),
        },
        62: {
            title: "Red Apples",
            description: "Gain 1 more Apple each reset.",
            cost: new Decimal(7),
        },
        63: {
            title: "Juicy!!",
            description: "Gain the same multiplicator as the first upgrade :D but twice as strong!",
            cost: new Decimal(16),
        },
        64: {
            title: "Slightly Bigger",
            description: "Points affect A gain.",
            cost: new Decimal(40),
            effect() {
                return new Decimal(player.points).div(10).pow(0.75).div(10).add(1)
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"*"
            },
            tooltip: "Formula:<br>(((x/10)^0.75)/10)+1",
        },
        65: {
            title: "Hungry!!!",
            description: "Unlock two new tabs, full of new content!",
            cost: new Decimal(88),
        },
        // Tree Food Ups. (111 - 164 (6 rows & 4 columns))
    },

    buyables: {
        // EQ (11 & 12)
        // WA (21 & 22)
        // SL (31 & 32)
        // Ap (13, 23 & 33)
    },

    tabFormat: {
        "Points Upgrades": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                ["display-text",
                    function() { return "The upgrades here are used to boost your Points gain."},
                ],
                "blank",
                ["row", [["upgrade", 11], ["upgrade", 12], ["upgrade", 13], ["upgrade", 14], ["upgrade", 15]]]
            ],
        },
        "Apples Upgrades": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                ["display-text",
                    function() { return "Here, the upgrades upgrade (upgradeception) your Apples gain."},
                ],
                "blank",
                ["row", [["upgrade", 61], ["upgrade", 62], ["upgrade", 63], ["upgrade", 64], ["upgrade", 65]]]
            ],
        },
        "Tree Food": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                ["display-text",
                    function() { return "Feed yourself ((deep lore warning) yes, you're the tree) with Earth, Water and Sun to produce more Apples! By the way, sorry for the emptiness here, need to get rid of it fast I know."},
                ],
            ],
            unlocked() {
                return (hasUpgrade('a', 65))
            },
        },
        "Buyables": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                ["display-text",
                    function() { return "Click the big squares for little bonuses. Wait, you need an update for this."},
                ],
                "blank",
                "buyables",
            ],
            unlocked() {
                return (hasUpgrade('a', 65))
            },
        },
    },
})
