const heros = [
    aang = {
        tabs: [
            air_scooter = {
                name: "Air Scooter",
                description: "Create an airball that you can ride on.",
                background: "url(../block/quartz_bricks.png)",
                icon: "url(../item/wind_charge.png)",
                skills: [
                    {
                        id: "max_duration",
                        name: "Max Duration",
                        description: "The maximin time you can hold the ability",
                        icon: "url(../item/clock.png)",
                    }
                ]
            },
            tornado = {
                name: "Tornado",
                description: "Hab das noch nicht ingame gesehen",
                background: "url(../block/white_wool.png)",
                icon: "url(../item/feather.png)",
            },
            air_ball = {
                name: "Air Ball",
                description: "By making circular movements with the mouse, you can create an air ball that can be scaled by scrolling.",
                background: "url(../block/raw_iron_block.png)",
                icon: "url(../item/wind_charge.png)",
            },
            levitation = {
                name: "Levitation",
                description: "While holding the ability, you can glide.",
                background: "url(../block/packed_ice.png)",
                icon: "url(../item/feather.png)",
            },
            spiritual_projection = {
                name: "Spiritual Projection",
                description: "Hab das noch nicht ingame gesehen",
                background: "url(../block/bricks.png)",
                icon: "url(../item/feather.png)",
            },
        ]
    },
    katara = {

    },
    toph = {

    },
]

function renderSkillTree(hero) {
    const tabs = hero.tabs;
    const tabsContainer = document.getElementById('tabs');
    const tabsOpenContainer = document.getElementById('tabs-open');
    const content = document.getElementById('content');
    const title = document.getElementById('title');
    const xp = document.getElementById('xp');

    // Clear existing tabs
    tabsContainer.innerHTML = '';
    tabsOpenContainer.innerHTML = '';
    xp.textContent = stats.xp;

    tabs.forEach((tab, index) => {
        // Create tab button
        const tabButton = document.createElement('button');
        tabButton.addEventListener('click', () => {
            openTab(index);
        });

        // Create tab icon
        const tabIcon = document.createElement('div');
        tabIcon.classList.add('icon');
        tabIcon.style.backgroundImage = tab.icon;
        tabButton.appendChild(tabIcon);

        tabsContainer.appendChild(tabButton);

        // Create open tab button
        const openTabButton = document.createElement('button');
        openTabButton.classList.add('open');
        openTabButton.addEventListener('click', () => {
            openTab(index);
        });

        const openTabIcon = document.createElement('div');
        openTabIcon.classList.add('icon');
        openTabIcon.style.backgroundImage = tab.icon;
        openTabButton.appendChild(openTabIcon);

        tabsOpenContainer.appendChild(openTabButton);
    });

    function openTab(index) {
        const selectedTab = tabs[index];
        title.querySelector('h1').innerText = selectedTab.name;
        title.querySelector('p').innerText = selectedTab.description;
        content.querySelector('div').style.backgroundImage = selectedTab.background;

        // Update tab visibility
        tabsOpenContainer.querySelectorAll('button').forEach((button, i) => {
            button.style.opacity = i === index ? '1' : '0';
        });
    }

    // Open the first tab by default
    openTab(0);
}

const urlParams = new URLSearchParams(window.location.search);
const uuid = urlParams.get('uuid');

let stats = null;
async function fetchStats() {
    const response = await fetch(`https://api.hglabor.de/stats/ffa/${uuid}`);
    stats = await response.json();
    console.log(stats);

    renderSkillTree(heros[0]);
}

fetchStats().then(() => {});



// Enable both horizontal and vertical scrolling with mouse drag
const content = document.getElementById('content');
let isDown = false;
let startX;
let scrollLeft;
let startY;
let scrollTop;

content.addEventListener('mousedown', (e) => {
    isDown = true;
    content.classList.add('active');
    startX = e.pageX - content.offsetLeft;
    scrollLeft = content.scrollLeft;
    startY = e.pageY - content.offsetTop;
    scrollTop = content.scrollTop;
});

content.addEventListener('mouseleave', () => {
    isDown = false;
    content.classList.remove('active');
});

content.addEventListener('mouseup', () => {
    isDown = false;
    content.classList.remove('active');
});

content.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - content.offsetLeft;
    const walkX = (x - startX);
    content.scrollLeft = scrollLeft - walkX;

    const y = e.pageY - content.offsetTop;
    const walkY = (y - startY);
    content.scrollTop = scrollTop - walkY;
});