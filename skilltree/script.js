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
        "icon": "item/wind_charge.png",
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
        "icon": "item/potion.png",
        "name": "Healing",
        "description": "Healing is a basic Waterbending ability. It allows the user to heal themselves or others.",
        "windowBackground": "block/ice.png"
    },
    "ice_shards": {
        "icon": "item/arrow.png",
        "name": "Ice Shards",
        "description": "Ice Shards is a basic Waterbending ability. It allows the user to shoot shards of ice at entities.",
        "windowBackground": "block/ice.png"
    },
    "water_bending": {
        "icon": "item/water_bucket.png",
        "name": "Water Bending",
        "description": "Water Bending is a basic Waterbending ability. It allows the user to manipulate water.",
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
        "description": "Water Forming is a basic Waterbending ability. It allows the user to form water into various shapes.",
        "windowBackground": "block/ice.png"
    },
    "water_pillar": {
        "icon": "item/water_bucket.png",
        "name": "Water Pillar",
        "description": "Water Pillar is a basic Waterbending ability. It allows the user to create a pillar of water.",
        "windowBackground": "block/ice.png"
    },

    "max_duration_lasts": {
        "icon": "item/clock.png",
        "type": "task",
    },
    "regeneration": {
        "icon": "item/potion.png",
        "type": "task",
    },
    "cooldown": {
        "icon": "item/clock.png",
        "type": "task",
    },
    "max_duration": {
        "icon": "item/clock.png",
        "type": "task",
    },
    "water_pillar_start_boost": {
        "icon": "item/firework_rocket.png",
        "type": "task",
    },
    "water_pillar_distance": {
        "icon": "item/spyglass.png",
        "type": "task",
    },
    "radius": {
        "icon": "item/spyglass.png",
        "type": "task",
    },
    "speed": {
        "icon": "item/sugar.png",
        "type": "task",
    },
    "step_height": {
        "icon": "item/spyglass.png",
        "type": "task",
    },
    "knockback": {
        "icon": "item/stick.png",
        "type": "task",
    },
    "slowness": {
        "icon": "item/honey_bottle.png",
        "type": "task",
    },
    "damage": {
        "icon": "item/diamond_sword.png",
        "type": "task",
    },
    "height": {
        "icon": "item/slime_ball.png",
        "type": "task",
    },
    "armor": {
        "icon": "item/diamond_chestplate.png",
        "type": "task",
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

    placeSkill(selectedTabName, 0, 0, 0, 0, 0, true, translationsAndIcons[selectedTabName].name, 0);

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

        //wenn userstats nicht existiert, dann hat der spieler dort 0 xp
        let experiencePoints = userStats ? userStats[id] ? userStats[id].experiencePoints : 0 : 0;
        let levelScale = propertyElement.levelScale;

        let level = Math.cbrt(experiencePoints / levelScale);
        let xp = Math.pow(level, 3);

        const maxLevel = propertyElement.maxLevel;

        const x = properties[keys[selectedTabIndex]].length / 2 - propertyKey - 1;

        for (let i = 0; i < maxLevel; i++) {
            placeSkill(id, x, i+1, (i === 0 ? 0 : x), i, xp - i, i < level, propertyElement.name, i + 1);
        }
    }
}

const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

function placeSkill(name, x, y, connectX, connectY, percentFilled = 0, obtained = false, abilityName, abilityLevel) {
    const skillIcon = (translationsAndIcons[name] ? translationsAndIcons[name].icon : 'item/barrier.png');
    const skillType = (translationsAndIcons[name] ? translationsAndIcons[name].type ? translationsAndIcons[name].type : 'challenge' : 'challenge');
    const skillName = abilityName + ' ' + ( abilityLevel !== 0 ? romanNumerals[abilityLevel - 1] : '');
    const skillDescription = (translationsAndIcons[name] ? translationsAndIcons[name].description : 'No description available');

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