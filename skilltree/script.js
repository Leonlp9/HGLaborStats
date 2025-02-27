//canvas
const canvas = document.getElementById('lines');
const ctx = canvas.getContext('2d');

//set canvas size to parent div size
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

//draw lines
function drawLine(x1, y1, x2, y2, percentFilled = 0) {

    percentFilled = Math.min(1, Math.max(0, percentFilled));

    //stroke size
    ctx.lineWidth = 10;
    //stroke color
    ctx.strokeStyle = '#080300';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    //draw filled line
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#11f713';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 + (x2 - x1) * percentFilled, y1 + (y2 - y1) * percentFilled);
    ctx.stroke();

    //fill the rest of the line
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#49494a';
    ctx.beginPath();
    ctx.moveTo(x1 + (x2 - x1) * percentFilled, y1 + (y2 - y1) * percentFilled);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function enableDragScroll(element) {
    let isDown = false;
    let startX;
    let scrollLeft;
    let startY;
    let scrollTop;

    element.addEventListener('mousedown', (e) => {
        isDown = true;
        element.classList.add('active');
        startX = e.pageX - element.offsetLeft;
        scrollLeft = element.scrollLeft;
        startY = e.pageY - element.offsetTop;
        scrollTop = element.scrollTop;
    });

    element.addEventListener('mouseleave', () => {
        isDown = false;
        element.classList.remove('active');
    });

    element.addEventListener('mouseup', () => {
        isDown = false;
        element.classList.remove('active');
    });

    element.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - element.offsetLeft;
        const walkX = (x - startX);
        element.scrollLeft = scrollLeft - walkX;

        const y = e.pageY - element.offsetTop;
        const walkY = (y - startY);
        element.scrollTop = scrollTop - walkY;
    });
}

let stats;
let heros = [];
let selectedHero = null;
let selectedTabIndex = 0;

async function fetchStats(uuid) {
    const response = await fetch(`https://api.hglabor.de/stats/ffa/${uuid}`);
    stats = await response.json();

    console.log(stats);

    document.getElementById('xp').innerText = stats.xp;
}

async function fetchHeros() {
    const herosNames = await fetch("https://api.hglabor.de/ffa/heroes");
    const herosJson = await herosNames.json();

    for (const heroName of herosJson) {
        const response = await fetch(`https://api.hglabor.de/ffa/hero/${heroName}`);
        const hero = await response.json();
        heros.push(hero);
    }

    selectedHero = heros[0];

    console.log(heros);

    createBottomTabs();
    createTopTabs();

    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get('uuid') || "202bd80d-1cae-4812-a028-42b0a478346e";

    fetchStats(uuid).then(() => {
        renderSkills();
    });
}

let translationsAndIcons = {
    "aang": {
        "name": "§6§lAang",
        "description": "Aang is the last Airbender and the Avatar. He is a master of Airbending and has a strong connection to the spirit world.",
    },
    "katara": {
        "name": "§b§lKatara",
        "description": "Katara is a Waterbender from the Southern Water Tribe. She is a master of Waterbending and has a strong sense of justice.",
    },
    "toph": {
        "name": "§a§lToph",
        "description": "Toph is an Earthbender and the greatest Earthbender in the world. She is a master of Metalbending.",
    },

    "air_scooter": {
        "icon": "item/wind_charge.png",
        "name": "Air Scooter",
        "description": "Air Scooter is a basic Airbending ability. It allows the user to create a gust of wind that propels them forward.",
        "windowBackground": "block/quartz_block_bottom.png"
    },
    "tornado": {
        "icon": "item/string.png",
        "name": "Tornado",
        "description": "Tornado is a powerful Airbending ability. It allows the user to create a tornado that sucks in entities and blocks.",
        "windowBackground": "block/quartz_block_bottom.png"
    },
    "air_ball": {
        "icon": "item/wind_charge.png",
        "name": "Air Ball",
        "description": "Air Ball is a basic Airbending ability. It allows the user to create a ball of air that can be thrown at entities.",
        "windowBackground": "block/quartz_block_bottom.png"
    },
    "levitation": {
        "icon": "item/wind_charge.png",
        "name": "Levitation",
        "description": "Levitation is a basic Airbending ability. It allows the user to levitate in the air.",
        "windowBackground": "block/quartz_block_bottom.png"
    },
    "spiritual_projection": {
        "icon": "item/wind_charge.png",
        "name": "Spiritual Projection",
        "description": "Spiritual Projection is a powerful Airbending ability. It allows the user to project their spirit out of their body.",
        "windowBackground": "block/quartz_block_bottom.png"
    },


    "earth_surf": {
        "icon": "block/dirt.png",
        "name": "Earth Surf",
        "description": "Earth Surf is a basic Earthbending ability. It allows the user to surf on a block of earth.",
        "windowBackground": "block/dirt.png"
    },
    "earth_column": {
        "icon": "block/dirt.png",
        "name": "Earth Column",
        "description": "Earth Column is a basic Earthbending ability. It allows the user to create a column of earth.",
        "windowBackground": "block/dirt.png"
    },
    "earth_push": {
        "icon": "block/dirt.png",
        "name": "Earth Push",
        "description": "Earth Push is a basic Earthbending ability. It allows the user to push entities away.",
        "windowBackground": "block/dirt.png"
    },
    "earth_armor": {
        "icon": "block/dirt.png",
        "name": "Earth Armor",
        "description": "Earth Armor is a basic Earthbending ability. It allows the user to create armor out of earth.",
        "windowBackground": "block/dirt.png"
    },
    "earth_trap": {
        "icon": "block/dirt.png",
        "name": "Earth Trap",
        "description": "Earth Trap is a basic Earthbending ability. It allows the user to create a trap out of earth.",
        "windowBackground": "block/dirt.png"
    },
    "seismic_sense": {
        "icon": "block/dirt.png",
        "name": "Seismic Sense",
        "description": "Seismic Sense is a basic Earthbending ability. It allows the user to sense vibrations in the earth.",
        "windowBackground": "block/dirt.png"
    },


    "healing": {
        "icon": "item/diamond.png",
        "name": "Healing",
        "description": "Healing is a basic Waterbending ability. It allows the user to heal themselves or others.",
        "windowBackground": "block/ice.png"
    },
    "ice_shards": {
        "icon": "block/ice.png",
        "name": "Ice Shards",
        "description": "Ice Shards is a basic Waterbending ability. It allows the user to shoot shards of ice at entities.",
        "windowBackground": "block/ice.png"
    },
    "water_bending": {
        "icon": "item/diamond.png",
        "name": "Water Bending",
        "description": "Water Bending is a basic Waterbending ability. It allows the user to manipulate water.",
        "windowBackground": "block/ice.png"
    },
    "water_circle": {
        "icon": "item/diamond.png",
        "name": "Water Circle",
        "description": "Water Circle is a basic Waterbending ability. It allows the user to create a circle of water.",
        "windowBackground": "block/ice.png"
    },
    "water_forming": {
        "icon": "item/diamond.png",
        "name": "Water Forming",
        "description": "Water Forming is a basic Waterbending ability. It allows the user to form water into various shapes.",
        "windowBackground": "block/ice.png"
    },
    "water_pillar": {
        "icon": "item/diamond.png",
        "name": "Water Pillar",
        "description": "Water Pillar is a basic Waterbending ability. It allows the user to create a pillar of water.",
        "windowBackground": "block/ice.png"
    },
}

/**
 * Shows the properties of the selected hero
 */
function createTopTabs() {
    const tabContainer = document.getElementById('window');

    //löscht alle tabs die nicht mehr gebraucht werden
    for (let i = 0; i < 10; i++) {
        if (document.getElementById('topTab' + i)) {
            document.getElementById('topTab' + i).remove();
        }
    }

    const tabCount = Object.keys(selectedHero.properties).length;
    for (let i = 0; i < tabCount; i++) {
        if (!document.getElementById('topTab' + i)) {
            const tab = document.createElement('div');
            tab.className = 'tab top' + (i === selectedTabIndex ? ' selected' : '') + (i === 0 ? ' left' : '');
            tab.style.left = `calc(100%/9.3*${i})`;
            tab.id = 'topTab' + i;

            if (translationsAndIcons[Object.keys(selectedHero.properties)[i]].icon.startsWith('item/')) {
                const tabIcon = document.createElement('img');
                tabIcon.src = '../' + translationsAndIcons[Object.keys(selectedHero.properties)[i]].icon;
                tabIcon.className = 'tabIcon';
                tab.appendChild(tabIcon);
            }else {
                const item3d = document.createElement("div");
                item3d.classList.add("item3d");
                for (let j = 0; j < 3; j++) {
                    const img = document.createElement("div");
                    img.style.backgroundImage = `url(../${translationsAndIcons[Object.keys(selectedHero.properties)[i]].icon})`;
                    img.style.backgroundSize = "cover";
                    item3d.appendChild(img);
                }
                tab.appendChild(item3d);
            }

            tab.addEventListener('click', () => {
                selectedTabIndex = i;
                createTopTabs();
                renderSkills();
                //playsound ui_click.wav
                const audio = new Audio('ui_klick.wav');
                audio.play();
            });

            tabContainer.appendChild(tab);

            addTextTooltip(tab, translationsAndIcons[Object.keys(selectedHero.properties)[i]].name);
        }else {
            document.getElementById('topTab' + i).classList.remove('selected');
            if (i === selectedTabIndex) {
                document.getElementById('topTab' + i).classList.add('selected');
            }
            document.getElementById('topTab' + i).getElementsByTagName('img')[0].src = '../' + translationsAndIcons[Object.keys(selectedHero.properties)[i]].icon;
        }
    }

    const titleText = document.getElementById('titleText');
    const subtitle = document.getElementById('subtitle');
    titleText.innerHTML = translationsAndIcons[Object.keys(selectedHero.properties)[selectedTabIndex]].name;
    subtitle.innerHTML = translationsAndIcons[Object.keys(selectedHero.properties)[selectedTabIndex]].description;

    document.getElementById('skillsBackground').style.backgroundImage = `url(../${translationsAndIcons[Object.keys(selectedHero.properties)[selectedTabIndex]].windowBackground})`;

    //skills auf x achse in mitte setzen vom scolling
    const skills = document.getElementById('skills');
    skills.scrollLeft = (skills.scrollWidth - skills.offsetWidth) / 2;

}

function createBottomTabs() {
    const tabContainer = document.getElementById('window');
    const tabCount = heros.length;
    for (let i = 0; i < tabCount; i++) {
        if (!document.getElementById('tab' + i)) {
            const tab = document.createElement('div');
            tab.className = 'tab bottom' + (heros[i] === selectedHero ? ' selected' : '') + (i === 0 ? ' left' : '');
            tab.style.left = `calc(100%/9.3*${i})`;
            tab.id = 'tab' + i;

            const tabIcon = document.createElement('img');
            tabIcon.src = heros[i].internalKey + '.png';
            tabIcon.className = 'tabIcon';
            tab.appendChild(tabIcon);

            tab.addEventListener('click', () => {
                selectedHero = heros[i];
                selectedTabIndex = 0;
                createBottomTabs();
                createTopTabs();
                renderSkills();
                //playsound ui_click.wav
                const audio = new Audio('ui_klick.wav');
                audio.play();
            });

            tabContainer.appendChild(tab);

            addTextTooltip(tab, translationsAndIcons[heros[i].internalKey].name);
        }else {
            document.getElementById('tab' + i).classList.remove('selected');
            if (heros[i] === selectedHero) {
                document.getElementById('tab' + i).classList.add('selected');
            }
        }
    }
}

function renderSkills(){
    console.log(selectedHero.properties);
    //{
    //     "healing": [
    //         {
    //             "type": "gg.norisk.heroes.common.ability.CooldownProperty",
    //             "baseValue": 90,
    //             "maxLevel": 4,
    //             "name": "Cooldown",
    //             "modifier": {
    //                 "type": "gg.norisk.heroes.common.ability.operation.AddValueTotal",
    //                 "steps": [
    //                     -10,
    //                     -10,
    //                     -10,
    //                     -10
    //                 ]
    //             },
    //             "levelScale": 315
    //         },
    //         {
    //             "type": "gg.norisk.heroes.common.ability.SingleUseProperty",
    //             "baseValue": 0,
    //             "maxLevel": 0,
    //             "name": "Use",
    //             "modifier": {
    //                 "type": "gg.norisk.heroes.common.ability.operation.MultiplyBase",
    //                 "steps": [
    //                     0
    //                 ]
    //             },
    //             "levelScale": 315
    //         },
    //         {
    //             "type": "gg.norisk.heroes.common.ability.NumberProperty",
    //             "baseValue": 0,
    //             "maxLevel": 2,
    //             "name": "Regeneration",
    //             "modifier": {
    //                 "type": "gg.norisk.heroes.common.ability.operation.AddValueTotal",
    //                 "steps": [
    //                     1,
    //                     1
    //                 ]
    //             },
    //             "levelScale": 315
    //         },
    //         {
    //             "type": "gg.norisk.heroes.common.ability.NumberProperty",
    //             "baseValue": 5,
    //             "maxLevel": 4,
    //             "name": "Max Duration Lasts",
    //             "modifier": {
    //                 "type": "gg.norisk.heroes.common.ability.operation.AddValueTotal",
    //                 "steps": [
    //                     1,
    //                     1,
    //                     1,
    //                     1
    //                 ]
    //             },
    //             "levelScale": 315
    //         }
    //     ],
    //     "water_pillar": [
    //         {
    //             "type": "gg.norisk.heroes.common.ability.CooldownProperty",
    //             "baseValue": 20,
    //             "maxLevel": 4,
    //             "name": "Cooldown",
    //             "modifier": {
    //                 "type": "gg.norisk.heroes.common.ability.operation.AddValueTotal",
    //                 "steps": [
    //                     -5,
    //                     -5,
    //                     -2,
    //                     -3
    //                 ]
    //             },
    //             "levelScale": 315
    //         },
    //         {
    //             "type": "gg.norisk.heroes.common.ability.SingleUseProperty",
    //             "baseValue": 0,
    //             "maxLevel": 0,
    //             "name": "Use",
    //             "modifier": {
    //                 "type": "gg.norisk.heroes.common.ability.operation.MultiplyBase",
    //                 "steps": [
    //                     0
    //                 ]
    //             },
    //             "levelScale": 315
    //         },
    //         {
    //             "type": "gg.norisk.heroes.common.ability.CooldownProperty",
    //             "baseValue": 10,
    //             "maxLevel": 5,
    //             "name": "Max Duration",
    //             "modifier": {
    //                 "type": "gg.norisk.heroes.common.ability.operation.AddValueTotal",
    //                 "steps": [
    //                     0.1,
    //                     0.4,
    //                     0.2,
    //                     0.8,
    //                     1.5,
    //                     1
    //                 ]
    //             },
    //             "levelScale": 315
    //         },
    //         {
    //             "type": "gg.norisk.heroes.common.ability.NumberProperty",
    //             "baseValue": 15,
    //             "maxLevel": 5,
    //             "name": "Water Pillar Distance",
    //             "modifier": {
    //                 "type": "gg.norisk.heroes.common.ability.operation.AddValueTotal",
    //                 "steps": [
    //                     3,
    //                     3,
    //                     3,
    //                     3,
    //                     3
    //                 ]
    //             },
    //             "levelScale": 315
    //         },
    //         {
    //             "type": "gg.norisk.heroes.common.ability.NumberProperty",
    //             "baseValue": 1,
    //             "maxLevel": 5,
    //             "name": "Water Pillar Start Boost",
    //             "modifier": {
    //                 "type": "gg.norisk.heroes.common.ability.operation.MultiplyBase",
    //                 "steps": [
    //                     1,
    //                     1.2,
    //                     1.4,
    //                     1.5,
    //                     1.8,
    //                     1.9
    //                 ]
    //             },
    //             "levelScale": 315
    //         }
    //     ],
    //     "water_bending": [
    //         {
    //             "type": "gg.norisk.heroes.common.ability.CooldownProperty",
    //             "baseValue": 10,
    //             "maxLevel": 5,
    //             "name": "Cooldown",
    //             "modifier": {
    //                 "type": "gg.norisk.heroes.common.ability.operation.AddValueTotal",
    //                 "steps": [
    //                     -1,
    //                     -1,
    //                     -1,
    //                     -1,
    //                     -1
    //                 ]
    //             },
    //             "levelScale": 315
    //         },
    //         {
    //             "type": "gg.norisk.heroes.common.ability.SingleUseProperty",
    //             "baseValue": 0,
    //             "maxLevel": 0,
    //             "name": "Use",
    //             "modifier": {
    //                 "type": "gg.norisk.heroes.common.ability.operation.MultiplyBase",
    //                 "steps": [
    //                     0
    //                 ]
    //             },
    //             "levelScale": 315
    //         },
    //         {
    //             "type": "gg.norisk.heroes.common.ability.CooldownProperty",
    //             "baseValue": 10,
    //             "maxLevel": 5,
    //             "name": "Max Duration",
    //             "modifier": {
    //                 "type": "gg.norisk.heroes.common.ability.operation.AddValueTotal",
    //                 "steps": [
    //                     2,
    //                     1,
    //                     0.5,
    //                     0.5,
    //                     1
    //                 ]
    //             },
    //             "levelScale": 315
    //         }
    //     ],
    //     "ice_shards": [
    //         {
    //             "type": "gg.norisk.heroes.common.ability.CooldownProperty",
    //             "baseValue": 26,
    //             "maxLevel": 4,
    //             "name": "Cooldown",
    //             "modifier": {
    //                 "type": "gg.norisk.heroes.common.ability.operation.AddValueTotal",
    //                 "steps": [
    //                     -2,
    //                     -2,
    //                     -2,
    //                     -2
    //                 ]
    //             },
    //             "levelScale": 315
    //         },
    //         {
    //             "type": "gg.norisk.heroes.common.ability.SingleUseProperty",
    //             "baseValue": 0,
    //             "maxLevel": 0,
    //             "name": "Use",
    //             "modifier": {
    //                 "type": "gg.norisk.heroes.common.ability.operation.MultiplyBase",
    //                 "steps": [
    //                     0
    //                 ]
    //             },
    //             "levelScale": 315
    //         },
    //         {
    //             "type": "gg.norisk.heroes.common.ability.CooldownProperty",
    //             "baseValue": 0.5,
    //             "maxLevel": 5,
    //             "name": "Max Duration",
    //             "modifier": {
    //                 "type": "gg.norisk.heroes.common.ability.operation.AddValueTotal",
    //                 "steps": [
    //                     0.25,
    //                     0.25,
    //                     0.25,
    //                     0.25,
    //                     0.25
    //                 ]
    //             },
    //             "levelScale": 315
    //         }
    //     ],
    //     "water_forming": [
    //         {
    //             "type": "gg.norisk.heroes.common.ability.CooldownProperty",
    //             "baseValue": 10,
    //             "maxLevel": 5,
    //             "name": "Cooldown",
    //             "modifier": {
    //                 "type": "gg.norisk.heroes.common.ability.operation.AddValueTotal",
    //                 "steps": [
    //                     -0.1,
    //                     -0.4,
    //                     -0.2,
    //                     -0.8,
    //                     -1.5,
    //                     -1
    //                 ]
    //             },
    //             "levelScale": 315
    //         },
    //         {
    //             "type": "gg.norisk.heroes.common.ability.SingleUseProperty",
    //             "baseValue": 0,
    //             "maxLevel": 0,
    //             "name": "Use",
    //             "modifier": {
    //                 "type": "gg.norisk.heroes.common.ability.operation.MultiplyBase",
    //                 "steps": [
    //                     0
    //                 ]
    //             },
    //             "levelScale": 315
    //         },
    //         {
    //             "type": "gg.norisk.heroes.common.ability.CooldownProperty",
    //             "baseValue": 10,
    //             "maxLevel": 5,
    //             "name": "Max Duration",
    //             "modifier": {
    //                 "type": "gg.norisk.heroes.common.ability.operation.AddValueTotal",
    //                 "steps": [
    //                     0.1,
    //                     0.4,
    //                     0.2,
    //                     0.8,
    //                     1.5,
    //                     1
    //                 ]
    //             },
    //             "levelScale": 315
    //         },
    //         {
    //             "type": "gg.norisk.heroes.common.ability.NumberProperty",
    //             "baseValue": 10,
    //             "maxLevel": 3,
    //             "name": "Water Forming Max Blocks",
    //             "modifier": {
    //                 "type": "gg.norisk.heroes.common.ability.operation.AddValueTotal",
    //                 "steps": [
    //                     5,
    //                     5,
    //                     5
    //                 ]
    //             },
    //             "levelScale": 315
    //         }
    //     ],
    //     "water_circle": [
    //         {
    //             "type": "gg.norisk.heroes.common.ability.CooldownProperty",
    //             "baseValue": 0,
    //             "maxLevel": 0,
    //             "name": "NoCooldown",
    //             "modifier": {
    //                 "type": "gg.norisk.heroes.common.ability.operation.MultiplyBase",
    //                 "steps": []
    //             },
    //             "levelScale": 315
    //         },
    //         {
    //             "type": "gg.norisk.heroes.common.ability.SingleUseProperty",
    //             "baseValue": 0,
    //             "maxLevel": 0,
    //             "name": "Use",
    //             "modifier": {
    //                 "type": "gg.norisk.heroes.common.ability.operation.MultiplyBase",
    //                 "steps": [
    //                     0
    //                 ]
    //             },
    //             "levelScale": 315
    //         },
    //         {
    //             "type": "gg.norisk.heroes.common.ability.NumberProperty",
    //             "baseValue": 1,
    //             "maxLevel": 5,
    //             "name": "Water Circle Sphere",
    //             "modifier": {
    //                 "type": "gg.norisk.heroes.common.ability.operation.AddValueTotal",
    //                 "steps": [
    //                     1,
    //                     1,
    //                     1,
    //                     1,
    //                     1,
    //                     3
    //                 ]
    //             },
    //             "levelScale": 315
    //         },
    //         {
    //             "type": "gg.norisk.heroes.common.ability.NumberProperty",
    //             "baseValue": 10,
    //             "maxLevel": 3,
    //             "name": "Water Circle Fall Distance",
    //             "modifier": {
    //                 "type": "gg.norisk.heroes.common.ability.operation.AddValueTotal",
    //                 "steps": [
    //                     20,
    //                     30,
    //                     40
    //                 ]
    //             },
    //             "levelScale": 315
    //         }
    //     ]
    // }

    //alle elemente mit der klasse skill löschen
    const skills = document.getElementById('skillsBackground').getElementsByClassName('skill');
    for (let i = skills.length - 1; i >= 0; i--) {
        skills[i].remove();
    }

    //clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    placeSkill('baseSkill', 0, 0, 0, 0, 0, true);

    let properties = selectedHero.properties;

    //get all keys of properties
    let keys = Object.keys(properties);

    for (let propertyKey in properties[keys[selectedTabIndex]]) {
        let propertyElement = properties[keys[selectedTabIndex]][propertyKey];
        let userStats = stats.heroes[selectedHero.internalKey][keys[selectedTabIndex]];
        let id = propertyElement.name.toLowerCase().replace(/ /g, '_');

        console.log(userStats, propertyElement, keys[selectedTabIndex])

        //🔢 Ability Level Calculation:
        // The level is calculated using the formula:
        // level = cbrt(xp / levelScale)
        // The XP required for a level is:
        // xp = levelScale * level³
        // Higher levels require exponentially more XP.

        //wenn userstats nicht existiert, dann hat der spieler dort 0 xp
        let experiencePoints = userStats ? userStats[id] ? userStats[id].experiencePoints : 0 : 0;
        let levelScale = propertyElement.levelScale;

        let level = Math.cbrt(experiencePoints / levelScale);
        let xp = Math.pow(level, 3);

        const maxLevel = propertyElement.maxLevel;

        const x = properties[keys[selectedTabIndex]].length / 2 - propertyKey - 1;

        for (let i = 0; i < maxLevel; i++) {
            placeSkill(id, x, i+1, (i === 0 ? 0 : x), i, xp - i, i < level);
        }
    }
}

function placeSkill(name, x, y, connectX, connectY, percentFilled = 0, obtained = false) {
    const skillIcon = (translationsAndIcons[name] ? translationsAndIcons[name].icon : 'item/barrier.png');
    const skillType = (translationsAndIcons[name] ? translationsAndIcons[name].type : 'task');
    const skillName = (translationsAndIcons[name] ? translationsAndIcons[name].name : 'Unknown');
    const skillDescription = (translationsAndIcons[name] ? translationsAndIcons[name].description : 'Unknown');

    const skills = document.getElementById('skillsBackground').getElementsByTagName('div');
    const skill = document.createElement('div');
    skill.className = 'skill ' + skillType;

    //calculate new x and y. x 0 is in the middle of the element, and both ist must be multiplied by 20
    x = x * 150 + skills[0].offsetWidth / 2;
    y = (y + 0.5) * 150;

    connectX = connectX * 150 + skills[0].offsetWidth / 2;
    connectY = (connectY + 0.5) * 150;

    skill.style.left = x + 'px';
    skill.style.top = y + 'px';

    if (connectX !== undefined && connectY !== undefined) {
        drawLine(connectX, connectY, x, y, percentFilled);
    }

    if (obtained) {
        skill.classList.add('obtained');
    }

    const icon = document.createElement('img');
    icon.src = '../' + skillIcon;
    skill.appendChild(icon);

    skills[0].appendChild(skill);

    addTextTooltip(skill, skillName + '\n\n' + skillDescription);
}


fetchHeros().then();
enableDragScroll(document.getElementById('skills'));