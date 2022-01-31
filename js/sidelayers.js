addLayer("ac", {
    name: "Achievements",
    symbol: "★",
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},

    color: "#FFFF00",                       // The color for this layer, which affects many elements.
    resource: "Achievements.",            // The name of this layer's main prestige resource.
    row: "side",                                 // The row this layer is on (0 is the first row).

    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(10),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "none",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).


    layerShown() { return true },          // Returns a bool for if this layer's node should be visible in the tree.

    tooltip() { return "Achievements"},

    achievements: {
        11: {
            name: "Enough for an upgrade",
            tooltip: "Have EXACTLY 2 Apples.",
            done() {
                if (player.a.points.eq(2)) return true
            },
        },
        12: {
            name: "Not many for an incremental",
            tooltip: "Reach 100 Points.",
            done() {
                if (player.points >= 100) return true
            },
        },
        13: {
            name: "Feeding = Boost",
            tooltip: "Unlock Tree Food.",
            done() {
                if (hasUpgrade('a', 65)) return true
            }
        }
    },

    tabFormat: {
        "Act I": {
            content: [
                "blank",
                ["display-text",
                    function() { return "Achievements are useless in this game. They're there to mostly guide you through the adventure or just to flex. Swag B)." },
                ],
                "blank",
                "blank",
                ["row", [["achievement", 11], ["achievement", 12], ["achievement", 13]]],
            ],
        },
    },
})