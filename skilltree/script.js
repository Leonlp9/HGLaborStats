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
                        position: { x: -2, y: 3 },
                        challengeType: "task",
                        requirements: [
                            {
                                id: "max_duration",
                                value: 1,
                            }
                        ],
                    }
                ],
                position: { x: 0, y: 1 },
                challengeType: "challenge",
            },
            tornado = {
                name: "Tornado",
                description: "Hab das noch nicht ingame gesehen",
                background: "url(../block/white_wool.png)",
                icon: "url(../item/feather.png)",
                skills: [

                ],
                position: { x: 0, y: 1 },
                challengeType: "challenge",
            },
            air_ball = {
                name: "Air Ball",
                description: "By making circular movements with the mouse, you can create an air ball that can be scaled by scrolling.",
                background: "url(../block/raw_iron_block.png)",
                icon: "url(../item/wind_charge.png)",
                skills: [

                ],
                position: { x: 0, y: 1 },
                challengeType: "challenge",
            },
            levitation = {
                name: "Levitation",
                description: "While holding the ability, you can glide.",
                background: "url(../block/packed_ice.png)",
                icon: "url(../item/feather.png)",
                skills: [

                ],
                position: { x: 0, y: 1 },
                challengeType: "challenge",

            },
            spiritual_projection = {
                name: "Spiritual Projection",
                description: "Hab das noch nicht ingame gesehen",
                background: "url(../block/bricks.png)",
                icon: "url(../item/feather.png)",
                skills: [

                ],
                position: { x: 0, y: 1 },
                challengeType: "challenge",
            },
        ]
    },
    katara = {

    },
    toph = {

    },
]

const urlParams = new URLSearchParams(window.location.search);
const uuid = urlParams.get('uuid');

let stats = null;

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

        content.scrollLeft = content.scrollWidth / 2 - content.clientWidth / 2;
        content.scrollTop = 0;

        document.getElementById("skills").innerHTML = '';
        placeSkill(selectedTab);
        selectedTab.skills.forEach(skill => {
            placeSkill(skill);
        });
    }

    function placeSkill(skill) {
        const skillElement = document.createElement('div');
        skillElement.classList.add('skill');
        skillElement.style.left = `calc(50% + ${skill.position.x * 50}px)`;
        skillElement.style.top = `${skill.position.y * 50 + 50}px`;
        skillElement.classList.add(skill.challengeType);

        //skill title
        const skillTitle = document.createElement('div');
        skillTitle.classList.add('title');
        skillTitle.innerText = skill.name;
        skillElement.appendChild(skillTitle);

        const skillIcon = document.createElement('div');
        skillIcon.classList.add('icon');
        skillIcon.style.backgroundImage = skill.icon;
        skillElement.appendChild(skillIcon);

        document.getElementById("skills").appendChild(skillElement);
    }

    openTab(0);

}
async function fetchStats() {
    const response = await fetch(`https://api.hglabor.de/stats/ffa/${uuid}`);
    stats = await response.json();
    console.log(stats);

    renderSkillTree(heros[0]);
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

fetchStats().then(() => {});

enableDragScroll(document.getElementById('content'));