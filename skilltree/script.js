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
        "description": "Creates an airball that you dan ride on.",
        "windowBackground": "block/quartz_block_bottom.png"
    },
    "tornado": {
        "icon": "item/wind_charge.png",
        "name": "Tornado",
        "description": "Creates a tornado that pushes entities away.",
        "windowBackground": "block/quartz_block_bottom.png"
    },
    "air_ball": {
        "icon": "item/wind_charge.png",
        "name": "Air Ball",
        "description": "By making circular movements with the mouse, you can create an air ball that can be scaled by scrolling.",
        "windowBackground": "block/quartz_block_bottom.png"
    },
    "levitation": {
        "icon": "item/feather.png",
        "name": "Levitation",
        "description": "While holding the ability, you can glide.",
        "windowBackground": "block/quartz_block_bottom.png"
    },
    "spiritual_projection": {
        "icon": "item/wind_charge.png",
        "name": "Spiritual Projection",
        "description": "Spiritual Projection is a powerful Airbending ability. It allows the user to project their spirit out of their body.",
        "windowBackground": "block/quartz_block_bottom.png"
    },


    "earth_surf": {
        "icon": "item/iron_boots.png",
        "name": "Earth Surf",
        "description": "You can surf on the ground.",
        "windowBackground": "block/packed_mud.png"
    },
    "earth_column": {
        "icon": "block/stone.png",
        "name": "Earth Column",
        "description": "You can bend an earth column.",
        "windowBackground": "block/packed_mud.png"
    },
    "earth_push": {
        "icon": "block/dirt.png",
        "name": "Earth Push",
        "description": "You can strike a rock block an kick it on a direction.",
        "windowBackground": "block/packed_mud.png"
    },
    "earth_armor": {
        "icon": "item/iron_chestplate.png",
        "name": "Earth Armor",
        "description": "You can bend nearby rock blocks to you and use them as armor.",
        "windowBackground": "block/packed_mud.png"
    },
    "earth_trap": {
        "icon": "block/dirt.png",
        "name": "Earth Trap",
        "description": "You can create a trap that pulls entities into the ground.",
        "windowBackground": "block/packed_mud.png"
    },
    "seismic_sense": {
        "icon": "block/dirt.png",
        "name": "Seismic Sense",
        "description": "Seismic Sense is a basic Earthbending ability. It allows the user to sense vibrations in the earth.",
        "windowBackground": "block/packed_mud.png"
    },


    "healing": {
        "icon": "item/potion.png",
        "name": "Healing",
        "description": "Healing is a basic Waterbending ability. It allows the user to heal themselves or others.",
        "windowBackground": "block/ice.png"
    },
    "ice_shards": {
        "icon": "item/arrow.png",
        "name": "Ice Shards",
        "description": "You can shoot ice shards.",
        "windowBackground": "block/ice.png"
    },
    "water_bending": {
        "icon": "item/water_bucket.png",
        "name": "Water Bending",
        "description": "You can bend water by targeting water or plants.",
        "windowBackground": "block/ice.png"
    },
    "water_circle": {
        "icon": "item/heart_of_the_sea.png",
        "name": "Water Circle",
        "description": "Water Circle is a basic Waterbending ability. It allows the user to create a circle of water.",
        "windowBackground": "block/ice.png"
    },
    "water_forming": {
        "icon": "block/packed_ice.png",
        "name": "Water Forming",
        "description": "You must target water and hold the ability to create an ice bridge.",
        "windowBackground": "block/ice.png"
    },
    "water_pillar": {
        "icon": "item/water_bucket.png",
        "name": "Water Pillar",
        "description": "You must be in water to create a water pillar that you can control at will.",
        "windowBackground": "block/ice.png"
    },

    "max_duration_lasts": {
        "icon": "item/clock.png",
        "type": "task",
        "description": "The maximum time\nyou can hold the ability.",
        "valueUnit": "s"
    },
    "regeneration": {
        "icon": "item/potion.png",
        "type": "task",
        "description": "The amount of\nhealth regenerated."
    },
    "cooldown": {
        "icon": "item/clock.png",
        "type": "task",
        "description": "The time you must wait\nbefore you can use the ability again.",
        "valueUnit": "s"
    },
    "max_duration": {
        "icon": "item/clock.png",
        "type": "task",
        "description": "The maximum time\nyou can hold the ability.",
        "valueUnit": "s"
    },
    "water_pillar_start_boost": {
        "icon": "item/firework_rocket.png",
        "type": "task",
        "description": "How much you are boosted\nupwards when you use the ability."
    },
    "water_pillar_distance": {
        "icon": "item/spyglass.png",
        "type": "task",
        "description": "The distance you can move\nbefore your ability ends."
    },
    "radius": {
        "icon": "item/stone_shovel.png",
        "type": "task",
        "description": "The radius of effect\nfor this ability."
    },
    "speed": {
        "icon": "item/sugar.png",
        "type": "task",
        "description": "How fast you move\nwhile using the ability."
    },
    "step_height": {
        "icon": "item/spyglass.png",
        "type": "task",
        "description": "The maximum height\nof steps you can climb."
    },
    "knockback": {
        "icon": "item/stick.png",
        "type": "task",
        "description": "The force with which\nyou push entities away."
    },
    "slowness": {
        "icon": "item/honey_bottle.png",
        "type": "task",
        "description": "The amount of\nslowness applied."
    },
    "damage": {
        "icon": "item/diamond_sword.png",
        "type": "task",
        "description": "The amount of\ndamage dealt."
    },
    "height": {
        "icon": "item/slime_ball.png",
        "type": "task",
        "description": "The height affected\nby this ability."
    },
    "armor": {
        "icon": "item/diamond_chestplate.png",
        "type": "task",
        "description": "The amount of\nprotection provided."
    },
    "water_forming_max_blocks": {
        "icon": "block/ice.png",
        "type": "task",
        "description": "The maximum amount\nof water you can turn into ice."
    }
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
    skills.scrollTop = 0;

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

    //alle elemente mit der klasse skill löschen
    const skills = document.getElementById('skillsBackground').getElementsByClassName('skill');
    for (let i = skills.length - 1; i >= 0; i--) {
        skills[i].remove();
    }
    const skillNames = document.getElementById('skillsBackground').getElementsByClassName('skillName');
    for (let i = skillNames.length - 1; i >= 0; i--) {
        skillNames[i].remove();
    }

    //clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const selectedTabName = Object.keys(selectedHero.properties)[selectedTabIndex];

    placeSkill(selectedTabName, 0, 0, 0, 0, 1, translationsAndIcons[selectedTabName].name, 0);

    let properties = selectedHero.properties;

    //get all keys of properties
    let keys = Object.keys(properties);

    for (let propertyKey in properties[keys[selectedTabIndex]]) {
        let propertyElement = properties[keys[selectedTabIndex]][propertyKey];
        let userStats = stats.heroes[selectedHero.internalKey][keys[selectedTabIndex]];
        let id = propertyElement.name.toLowerCase().replace(/ /g, '_');

        //🔢 Ability Level Calculation:
        // The level is calculated using the formula:
        // level = cbrt(xp / levelScale)
        // The XP required for a level is:
        // xp = levelScale * level³
        // Higher levels require exponentially more XP.

        let experiencePoints = userStats ? userStats[id] ? userStats[id].experiencePoints : 0 : 0;
        let levelScale = propertyElement.levelScale;

        const maxLevel = propertyElement.maxLevel;

        const x = properties[keys[selectedTabIndex]].length / 2 - propertyKey - 1;

        for (let i = 0; i < maxLevel; i++) {
            let newXpNeeded = levelScale * Math.pow(i + 1, 3);

            placeSkill(id, x, i+1, (i === 0 ? 0 : x), i, experiencePoints / newXpNeeded, propertyElement.name, i + 1, propertyElement.baseValue, propertyElement.modifier);
        }
    }
}

const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

function placeSkill(name, x, y, connectX, connectY, percentFilled = 0, abilityName, abilityLevel, baseValue = null, modifier = null) {
    const skillIcon = (translationsAndIcons[name] ? translationsAndIcons[name].icon : 'item/barrier.png');
    const skillType = (translationsAndIcons[name] ? translationsAndIcons[name].type ? translationsAndIcons[name].type : 'challenge' : 'challenge');
    const skillName = abilityName + ' ' + ( abilityLevel !== 0 ? romanNumerals[abilityLevel - 1] : '');
    const skillDescription = (translationsAndIcons[name] ? (translationsAndIcons[name].description ? translationsAndIcons[name].description : 'No description available') : 'No description available');
    const valueUnit = (translationsAndIcons[name] ? translationsAndIcons[name].valueUnit ? translationsAndIcons[name].valueUnit : '' : '');

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

    if (percentFilled >= 1) {
        skill.classList.add('obtained');
    }

    const icon = document.createElement('img');
    icon.src = '../' + skillIcon;
    skill.appendChild(icon);

    skills[0].appendChild(skill);

    //filled with "§a|" * percentFilled and the rest with "§8|" * (1 - percentFilled)
    let progressBar = "";
    for (let i = 0; i < 50; i++) {
        progressBar += i / 50 < percentFilled ? (percentFilled < 0.3 ? '§c|' : percentFilled < 0.7 ? '§e|' : '§a|') : '§7|';
    }

    let description = "[" + abilityName + ']\n\n' + skillDescription + '\n\n[Progress]\n' + progressBar + " §f" + Math.min(Math.round(percentFilled * 10000) / 100, 100) + '%'

    if (baseValue !== null && modifier !== null) {
        if (modifier.type === 'gg.norisk.heroes.common.ability.operation.AddValueTotal') {
            const steps = modifier.steps;
            let currentValue = baseValue;
            for (let i = 0; i < abilityLevel; i++) {
                currentValue += steps[i];
            }
            description += '\n\n' + Math.round(currentValue * 1000) / 1000 + valueUnit;
        }else if (modifier.type === 'gg.norisk.heroes.common.ability.operation.MultiplyBase') {
            const steps = modifier.steps;
            let currentValue = baseValue;
            currentValue *= steps[abilityLevel];
            description += '\n\n' + Math.round(currentValue * 1000) / 1000 + valueUnit;
        }
    }

    addTextTooltip(skill, description);

    //skill name above the skill
    const skillNameElement = document.createElement('div');
    skillNameElement.className = 'skillName';
    skillNameElement.style.left = x + 'px';
    skillNameElement.style.top = y - 40 + 'px';
    skillNameElement.innerText = skillName;
    skills[0].appendChild(skillNameElement);

}


fetchHeros().then();
enableDragScroll(document.getElementById('skills'));