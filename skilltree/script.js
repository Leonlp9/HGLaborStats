//canvas
const canvas = document.getElementById('lines');
const ctx = canvas.getContext('2d');

//set canvas size to parent div size
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

//draw lines
function drawLine(x1, y1, x2, y2, percentFilled = 0) {

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

drawLine(50, 50, 50, 200, 0.0);
drawLine(100, 50, 100, 200, 0.2);
drawLine(150, 50, 150, 200, 0.4);
drawLine(300, 50, 200, 200, 0.6);
drawLine(300, 50, 400, 200, 0.8);
drawLine(400, 50, 500, 200, 1.0);

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

async function fetchStats(uuid) {
    const response = await fetch(`https://api.hglabor.de/stats/ffa/${uuid}`);
    stats = await response.json();

    //set xp
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

    selectedHero = heros[1];

    createBottomTabs();
    createTopTabs();
    console.log(heros);

    fetchStats("202bd80d-1cae-4812-a028-42b0a478346e").then();
}
let translationsAndIcons = {
    "air_scooter": {
        "icon": "item/wind_charge.png",
        "name": "Air Scooter",
        "description": "Air Scooter is a basic Airbending ability. It allows the user to create a gust of wind that propels them forward."
    },
    "tornado": {
        "icon": "item/string.png",
        "name": "Tornado",
        "description": "Tornado is a powerful Airbending ability. It allows the user to create a tornado that sucks in entities and blocks."
    },
    "air_ball": {
        "icon": "item/wind_charge.png",
        "name": "Air Ball",
        "description": "Air Ball is a basic Airbending ability. It allows the user to create a ball of air that can be thrown at entities."
    },
    "levitation": {
        "icon": "item/wind_charge.png",
        "name": "Levitation",
        "description": "Levitation is a basic Airbending ability. It allows the user to levitate in the air."
    },
    "spiritual_projection": {
        "icon": "item/wind_charge.png",
        "name": "Spiritual Projection",
        "description": "Spiritual Projection is a powerful Airbending ability. It allows the user to project their spirit out of their body."
    },


    "earth_surf": {
        "icon": "block/dirt.png",
        "name": "Earth Surf",
        "description": "Earth Surf is a basic Earthbending ability. It allows the user to surf on a block of earth."
    },
    "earth_column": {
        "icon": "block/dirt.png",
        "name": "Earth Column",
        "description": "Earth Column is a basic Earthbending ability. It allows the user to create a column of earth."
    },
    "earth_push": {
        "icon": "block/dirt.png",
        "name": "Earth Push",
        "description": "Earth Push is a basic Earthbending ability. It allows the user to push entities away."
    },
    "earth_armor": {
        "icon": "block/dirt.png",
        "name": "Earth Armor",
        "description": "Earth Armor is a basic Earthbending ability. It allows the user to create armor out of earth."
    },
    "earth_trap": {
        "icon": "block/dirt.png",
        "name": "Earth Trap",
        "description": "Earth Trap is a basic Earthbending ability. It allows the user to create a trap out of earth."
    },
    "seismic_sense": {
        "icon": "block/dirt.png",
        "name": "Seismic Sense",
        "description": "Seismic Sense is a basic Earthbending ability. It allows the user to sense vibrations in the earth."
    },


    "healing": {
        "icon": "item/diamond.png",
        "name": "Healing",
        "description": "Healing is a basic Waterbending ability. It allows the user to heal themselves or others."
    },
    "ice_shards": {
        "icon": "block/ice.png",
        "name": "Ice Shards",
        "description": "Ice Shards is a basic Waterbending ability. It allows the user to shoot shards of ice at entities."
    },
    "water_bending": {
        "icon": "item/diamond.png",
        "name": "Water Bending",
        "description": "Water Bending is a basic Waterbending ability. It allows the user to manipulate water."
    },
    "water_circle": {
        "icon": "item/diamond.png",
        "name": "Water Circle",
        "description": "Water Circle is a basic Waterbending ability. It allows the user to create a circle of water."
    },
    "water_forming": {
        "icon": "item/diamond.png",
        "name": "Water Forming",
        "description": "Water Forming is a basic Waterbending ability. It allows the user to form water into various shapes."
    },
    "water_pillar": {
        "icon": "item/diamond.png",
        "name": "Water Pillar",
        "description": "Water Pillar is a basic Waterbending ability. It allows the user to create a pillar of water."
    },
}

function createBottomTabs() {
    let tabIndex = 0;
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
                //playsound ui_click.wav
                const audio = new Audio('ui_klick.wav');
                audio.play();
            });

            tabContainer.appendChild(tab);
        }else {
            document.getElementById('tab' + i).classList.remove('selected');
            if (heros[i] === selectedHero) {
                document.getElementById('tab' + i).classList.add('selected');
            }
        }
    }
}

let selectedTabIndex = 0;
/**
 * Shows the properties of the selected hero
 */
function createTopTabs() {
    let topTabIndex = 0;
    const tabContainer = document.getElementById('window');

    const tabCount = Object.keys(selectedHero.properties).length;
    for (let i = 0; i < tabCount; i++) {
        if (!document.getElementById('topTab' + i)) {
            const tab = document.createElement('div');
            tab.className = 'tab top' + (i === selectedTabIndex ? ' selected' : '') + (i === 0 ? ' left' : '');
            tab.style.left = `calc(100%/9.3*${i})`;
            tab.id = 'topTab' + i;

            const tabIcon = document.createElement('img');
            tabIcon.src = '../' + translationsAndIcons[Object.keys(selectedHero.properties)[i]].icon;
            tabIcon.className = 'tabIcon';
            tab.appendChild(tabIcon);

            tab.addEventListener('click', () => {
                selectedTabIndex = i;
                createTopTabs();
                //playsound ui_click.wav
                const audio = new Audio('ui_klick.wav');
                audio.play();
            });

            tabContainer.appendChild(tab);
        }else {
            document.getElementById('topTab' + i).classList.remove('selected');
            if (i === selectedTabIndex) {
                document.getElementById('topTab' + i).classList.add('selected');
            }
            document.getElementById('topTab' + i).getElementsByTagName('img')[0].src = '../' + translationsAndIcons[Object.keys(selectedHero.properties)[i]].icon;
        }
    }

    //löscht alle tabs die nicht mehr gebraucht werden
    for (let i = tabCount; i < 10; i++) {
        if (document.getElementById('topTab' + i)) {
            document.getElementById('topTab' + i).remove();
        }
    }

    const titleText = document.getElementById('titleText');
    const subtitle = document.getElementById('subtitle');
    titleText.innerHTML = translationsAndIcons[Object.keys(selectedHero.properties)[selectedTabIndex]].name;
    subtitle.innerHTML = translationsAndIcons[Object.keys(selectedHero.properties)[selectedTabIndex]].description;
}

function renderSkills(){

}

fetchHeros().then();
enableDragScroll(document.getElementById('skills'));