addedPlayerData("m", {
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        resetTime: new Decimal(0),
        total: new Decimal(0),
        best: new Decimal(0),
    }},

    color: "#22FF22",
    resource: "Dollars.",
    row: 1,
    name: "Dollars",

    layerShown() { return true },

    baseResource: "Apples",
    baseAmount() { return player.a.points.floor() },
    requires: new Decimal(10000),

    type: "normal",









})