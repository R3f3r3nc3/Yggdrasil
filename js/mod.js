let modInfo = {
	name: "Yggdrasil",
	id: "yggthetree",
	author: "Reference (Reference#6426)",
	pointsName: "Points.",
	modFiles: ["apples.js", "sidelayers.js", "tree.js"],

	discordName: "Mark who consumes a mic",
	discordLink: "https://youtu.be/tJtoUnuirUw",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 0.25,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.001 - α",
	name: "Getting the first Alpha-ed Apples",
}

let changelog = `<h1>Changelog:</h1><br><br>
	<h2 style='color: #ff0000'>==ALPHA==</h2><br><br>
	<h3 style='color: #ffac00'>v0.001</h3><br>
	<h3 style='text-decoration: underline'>Getting the first Alpha-ed Apples</h3><br><br>
		- New Layer : A [Apples].<br>
		- New Side-Layer : ★ [Achievements].<br>
		- 10 Upgrades.<br>
		- 3 Achievements.<br>
		<p style='font-size: 75%'>Endgame: 88 Apples.</p>`

let winText = `You have made so much Apples! Need a trophy?`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)

	if (hasUpgrade('a', 11)) gain = gain.add(1)
	if (hasUpgrade('a', 12)) gain = gain.add(2)
	if (hasUpgrade('a', 13)) gain = gain.times(1.5)
	if (hasUpgrade('a', 14)) gain = gain.times(upgradeEffect('a', 14))
	if (hasUpgrade('a', 15)) gain = gain.add(upgradeEffect('a', 15))

	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	"<p style='font-size: 75%'>Offline Time Limit: 15 minutes.</p>",
	"<p style='text-decoration: underline'>Endgame: 88 Apples.</p>",
]

// Determines when the game "ends"
function isEndgame() {
	return player.a.points.gte(new Decimal("88"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}