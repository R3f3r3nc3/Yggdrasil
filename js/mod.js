let modInfo = {
	name: "Yggdrasil, the big-ass tree",
	id: "yggthetree",
	author: "R3f3r3nc3 (referenceii)",
	pointsName: "Points.",
	modFiles: ["apples.js", "money.js", "sidelayers.js", "tree.js"],

	discordName: "Mark feels better now :)",
	discordLink: "https://youtu.be/QrPUi_NyJg0",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 24,  // In hours
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = decimalOne

	if (hasUpgrade("a", 11)) gain = gain.add(upgradeEffect("a", 11))
	if (hasUpgrade("a", 12)) gain = gain.add(upgradeEffect("a", 12))
	if (hasUpgrade("a", 13)) gain = gain.add(upgradeEffect("a", 13))
	if (hasUpgrade('a', 21)) gain = gain.add(1)
	if (hasUpgrade('a', 22)) gain = gain.add(upgradeEffect('a', 12))
	if (hasUpgrade('a', 23)) gain = gain.add(upgradeEffect('a', 23))
	if (hasUpgrade("a", 15)) gain = gain.mul(1.25)
	if (hasUpgrade('a', 24)) gain = gain.mul(1.666)

	if (hasUpgrade('a', 25)) gain = gain.mul(tmp.a.treeFood)

	

	return gain
}

// Set your version in num and name
let VERSION = {
	num: "0.001",
	name: "Preparing the harvesting.",
}

let changelog = `
	<h3 style='color: #ffac00'>v0.100</h3><br>
	<h3 style='text-decoration: underline'>Preparing the harvesting.</h3><br><br>
		- New Layer : A [Apples].<br>
		- Added Tree Food.<br>
		- Added 25 Upgrades & 6 Buyables.<br>
		<p style='font-size: 75%'>Endgame: 10000 Apples.</p>`

let winText = `The doctors are very far away.`

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


// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	"<p style='text-decoration: underline'>Endgame: 10000 Apples.</p>",
]

// Determines when the game "ends"
function isEndgame() {
	if (player.a.points.gte(10000)) return true
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