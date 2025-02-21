//{
//     "version": 0,
//     "armor": [
//         "{\n    data: [],\n    palette: [],\n    count: 1,\n    id: \"minecraft:diamond_helmet\"\n}",
//         "{\n    data: [],\n    palette: [],\n    count: 1,\n    id: \"minecraft:diamond_chestplate\"\n}",
//         "{\n    data: [],\n    palette: [],\n    count: 1,\n    id: \"minecraft:diamond_leggings\"\n}",
//         "{\n    data: [],\n    palette: [],\n    count: 1,\n    id: \"minecraft:diamond_boots\"\n}"
//     ],
//     "offhand": [
//         "{\n    data: [],\n    palette: [],\n    count: 1,\n    id: \"minecraft:shield\"\n}"
//     ],
//     "main": [
//         "{\n    data: [],\n    palette: [],\n    components: {\n        \"minecraft:enchantments\": {\n            levels: {\n                \"minecraft:sharpness\": 1\n            }\n        }\n    },\n    count: 1,\n    id: \"minecraft:diamond_sword\"\n}",
//         "{\n    data: [],\n    palette: [],\n    components: {\n        \"minecraft:enchantments\": {\n            levels: {\n                \"minecraft:unbreaking\": 3\n            }\n        }\n    },\n    count: 1,\n    id: \"minecraft:diamond_axe\"\n}",
//         "{\n    data: [],\n    palette: [],\n    count: 6,\n    id: \"minecraft:golden_apple\"\n}",
//         "{\n    data: [],\n    palette: [],\n    count: 1,\n    id: \"minecraft:water_bucket\"\n}",
//         "{\n    data: [],\n    palette: [],\n    count: 1,\n    id: \"minecraft:lava_bucket\"\n}",
//         "{\n    data: [],\n    palette: [],\n    count: 64,\n    id: \"minecraft:cobblestone\"\n}",
//         "{\n    data: [],\n    palette: [],\n    count: 8,\n    id: \"minecraft:cobweb\"\n}",
//         "{\n    data: [],\n    palette: [],\n    components: {\n        \"minecraft:enchantments\": {\n            levels: {\n                \"minecraft:power\": 1,\n                \"minecraft:unbreaking\": 3\n            }\n        }\n    },\n    count: 1,\n    id: \"minecraft:bow\"\n}",
//         "{\n    data: [],\n    palette: [],\n    components: {\n        \"minecraft:enchantments\": {\n            levels: {\n                \"minecraft:piercing\": 1,\n                \"minecraft:unbreaking\": 3\n            }\n        }\n    },\n    count: 1,\n    id: \"minecraft:crossbow\"\n}",
//         "{\n    data: [],\n    palette: [],\n    count: 16,\n    id: \"minecraft:arrow\"\n}",
//         "EMPTY",
//         "EMPTY",
//         "EMPTY",
//         "EMPTY",
//         "{\n    data: [],\n    palette: [],\n    components: {\n        \"minecraft:enchantments\": {\n            levels: {\n                \"minecraft:efficiency\": 1,\n                \"minecraft:unbreaking\": 3\n            }\n        }\n    },\n    count: 1,\n    id: \"minecraft:diamond_pickaxe\"\n}",
//         "EMPTY",
//         "EMPTY",
//         "{\n    data: [],\n    palette: [],\n    components: {\n        \"minecraft:custom_name\": '{\"extra\":[{\"bold\":true,\"italic\":false,\"text\":\"Tracker\"}],\"text\":\"\"}'\n    },\n    count: 1,\n    id: \"minecraft:compass\"\n}",
//         "EMPTY",
//         "EMPTY",
//         "EMPTY",
//         "EMPTY",
//         "EMPTY",
//         "EMPTY",
//         "EMPTY",
//         "EMPTY",
//         "EMPTY",
//         "EMPTY",
//         "EMPTY",
//         "{\n    data: [],\n    palette: [],\n    count: 16,\n    id: \"minecraft:cooked_beef\"\n}",
//         "{\n    data: [],\n    palette: [],\n    count: 1,\n    id: \"minecraft:water_bucket\"\n}",
//         "{\n    data: [],\n    palette: [],\n    count: 1,\n    id: \"minecraft:lava_bucket\"\n}",
//         "{\n    data: [],\n    palette: [],\n    count: 64,\n    id: \"minecraft:oak_planks\"\n}",
//         "EMPTY",
//         "EMPTY",
//         "EMPTY"
//     ]
// }

async function getStats(uuid) {
    const response = await fetch(`https://api.hglabor.de/stats/ffa/${uuid}`);
    const data = await response.json();
    console.log(data);
    return data;
}

// Funktion, die den String in gültiges JSON transformiert
function fixJson(str) {
    // Ersetzt unquoted keys durch quoted keys
    let fixed = str.replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3');
    // Ersetzt Werte in einfachen Anführungszeichen durch gültige, doppelt-quote Strings
    fixed = fixed.replace(/:\s*'([^']*)'/g, (match, p1) => {
        return ': ' + JSON.stringify(p1);
    });
    return fixed;
}

async function renderInventory(uuid, lang = "de_de") {
    const itemData = await fetch(lang + ".json").then(response => response.json());
    const data = await getStats(uuid);
    try {
        const { main, offhand, armor } = data.inventory;
        armor.reverse();

        const hotbar = document.getElementById("hotbar");     // main slot 0-8
        const container = document.getElementById("container"); // main slot 9-35
        const offhandSlot = document.getElementById("offhand"); // offhand slot
        const armorSlots = document.getElementById("armor");     // armor slots

        // Container leeren
        [hotbar, container, offhandSlot, armorSlots].forEach(el => el.innerHTML = "");

        // Hilfsfunktion, die einen Array von Items in den gegebenen Container rendert
        function processItems(items, targetContainer) {
            items.forEach(item => {
                const slot = document.createElement("div");
                slot.classList.add("slot");

                if (item === "EMPTY") {
                    item = null;
                } else {
                    try {
                        const cleaned = item.replace(/\n/g, '').replace(/\s+/g, ' ');
                        const fixed = fixJson(cleaned);
                        item = JSON.parse(fixed);
                    } catch (e) {
                        console.error("Invalid JSON format for item:", item);
                        return;
                    }
                }

                if (item) {
                    const id = item.id.split(":")[1];

                    slot.style.backgroundImage = `url(item/${id}.png)`;

                    const image = document.createElement("img");
                    image.src = `item/${id}.png`;
                    image.alt = item.displayName || id;
                    image.onerror = () => slot.style.backgroundImage = `url(item/barrier.png)`;

                    slot.addEventListener("mouseover", (e) => {
                        const tooltip = document.createElement("div");
                        tooltip.classList.add("tooltip");

                        // Verwende den 'minecraft:custom_name'-Component, falls vorhanden
                        const rawName = item.components?.["minecraft:custom_name"] || getItemName(id, itemData) || id;

                        const nameElement = document.createElement("div");
                        // Wenn es ein Component (Formatierungscodes) ist, als HTML rendern
                        if (item.components?.["minecraft:custom_name"]) {
                            nameElement.innerHTML = convertMinecraftFormatting(rawName);
                        } else {
                            nameElement.textContent = rawName;
                        }
                        tooltip.appendChild(nameElement);

                        const idElement = document.createElement("div");
                        idElement.classList.add("id");
                        idElement.textContent = item.id;
                        tooltip.appendChild(idElement);

                        document.body.appendChild(tooltip);
                        slot._tooltip = tooltip;
                    });

                    // Tooltip folgt der Maus
                    slot.addEventListener("mousemove", (e) => {
                        if (slot._tooltip) {
                            slot._tooltip.style.left = (e.pageX + 10) + "px";
                            slot._tooltip.style.top = (e.pageY + 10) + "px";
                        }
                    });

                    // Tooltip entfernen, wenn die Maus das Slot verlässt
                    slot.addEventListener("mouseout", () => {
                        if (slot._tooltip) {
                            slot._tooltip.remove();
                            slot._tooltip = null;
                        }
                    });

                    if (parseInt(item.count) > 1) {
                        const amount = document.createElement("div");
                        amount.classList.add("amount");
                        amount.textContent = item.count;
                        slot.appendChild(amount);
                    }

                }
                targetContainer.appendChild(slot);
            });
        }


        // Aufteilen der Main-Liste in Hotbar (Slots 0-8) und Container (Slots 9-35)
        processItems(main.slice(0, 9), hotbar);
        processItems(main.slice(9), container);
        processItems(offhand, offhandSlot);
        processItems(armor, armorSlots);

        createSkin(uuid);
    } catch (e) {
        alert("Dieser Spieler hat sein Inventar noch nicht bearbeitet.");
        return;
    }
}

function createSkin(uuid) {
    let skinViewer = new skinview3d.SkinViewer({
        canvas: document.getElementById("skin_container"),
        width: 300,
        height: 400,
        skin: "https://mc-heads.net/skin/" + uuid
    });

    skinViewer.camera.position.set(0, 0, 45);
    skinViewer.animation = new skinview3d.IdleAnimation();
    skinViewer.controls.enableRotate = false;
    skinViewer.controls.enableZoom = false;

    document.addEventListener("mousemove", function (e) {
        const rect = skinViewer.canvas.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Differenz vom Canvaszentrum, normalisiert auf den Bereich [-1, 1]
        const diffX = (mouseX - centerX) / (rect.width / 2);
        const diffY = (mouseY - centerY) / (rect.height / 2);

        // Berechne den (normalisierten) Abstand vom Zentrum
        const distance = Math.sqrt(diffX * diffX + diffY * diffY);
        // Dämpfungsfaktor: Bei weiter entfernten Mauspositionen wird die Rotation reduziert
        const damping = 1 / (1 + distance);

        // Maximale Rotationswinkel (in Radiant)
        const maxAngleX = Math.PI / 6;   // ca. 30° horizontal
        const maxAngleY = Math.PI / 16;  // ca. 11.25° vertikal

        // Zielwinkel in horizontaler und vertikaler Richtung (mit Dämpfung)
        const angleX = -diffX * maxAngleX * damping;
        const angleY = diffY * maxAngleY * damping * 2;

        const cameraDistance = 45;
        // Berechne die neue Kameraposition (vereinfachte Kugelkoordinaten)
        const newX = cameraDistance * Math.sin(angleX) * Math.cos(angleY);
        const newY = cameraDistance * Math.sin(angleY);
        const newZ = cameraDistance * Math.cos(angleX) * Math.cos(angleY);

        skinViewer.camera.position.set(newX, newY, newZ);
    });
}

function getItemName(id, data) {
    return data["item.minecraft." + id] || id;
}

//get uuid from url parameter
const urlParams = new URLSearchParams(window.location.search);
const uuid = urlParams.get('uuid');
const lang = urlParams.get('lang') || "de_de";
renderInventory(uuid, lang).then(() => console.log("done"));

function convertMinecraftFormatting(component) {
    let html = "";
    const colorMapping = {
        'black': '#000000',
        'dark_blue': '#0000AA',
        'dark_green': '#00AA00',
        'dark_aqua': '#00AAAA',
        'dark_red': '#AA0000',
        'dark_purple': '#AA00AA',
        'gold': '#FFAA00',
        'gray': '#AAAAAA',
        'dark_gray': '#555555',
        'blue': '#5555FF',
        'green': '#55FF55',
        'aqua': '#55FFFF',
        'red': '#FF5555',
        'light_purple': '#FF55FF',
        'yellow': '#FFFF55',
        'white': '#FFFFFF'
    };

    if (typeof component === "string") {
        component = JSON.parse(component);
    }

    const text = component.text || "";
    console.log(component);

    if (component.extra) {
        component.extra.forEach(extra => {
            html += convertMinecraftFormatting(extra);
        });
    }

    let classes = [];
    if (component.bold) classes.push("bold");
    if (component.italic) classes.push("italic");
    if (component.underlined) classes.push("underlined");
    if (component.strikethrough) classes.push("strikethrough");

    html += `<span class="${classes.join(" ")}" style="color: ${colorMapping[component.color] || component.color || "inherit"}">${text}</span>`;


    return html;
}