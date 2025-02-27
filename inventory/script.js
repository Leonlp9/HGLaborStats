
async function getStats(uuid, mode) {
    const response = await fetch(`https://api.hglabor.de/ffa/inventory/${uuid}/${mode}`);
    try {
        const data = await response.json();
        return data;
    }catch (e) {
        const main = Array(36).fill("EMPTY");

        main[22] = '{\n    "data": [],\n    "palette": [],\n    "components": {\n        "minecraft:custom_name": \'{"extra":[{"bold":true,"italic":false,"text":"Der Spieler hat für diesen Modus<br>sein Inventar noch nicht bearbeitet."}],"text":""}\'\n    },\n    "count": 1,\n    "id": "minecraft:barrier"\n}';

        return {
            main: main,
            offhand: ["EMPTY"],
            armor: ["EMPTY", "EMPTY", "EMPTY", "EMPTY"]
        };
    }
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

async function renderInventory(uuid, mode, lang = "de_de") {
    const itemData = await fetch(lang + ".json").then(response => response.json());
    const data = await getStats(uuid, mode);
    try {
        const { main, offhand, armor } = data;
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

                    slot.style.backgroundImage = `url(../item/${id}.png)`;

                    const image = document.createElement("img");
                    image.src = `../item/${id}.png`;
                    image.alt = item.displayName || id;
                    image.onerror = () => {

                        const renderBlocks2d = ["cobweb"];

                        if (renderBlocks2d.includes(id)) {
                            slot.style.background = `url(../block/${id}.png)`;
                            slot.style.backgroundSize = "cover";
                        }else {
                            slot.style.background = "transparent";
                            //erstelle 3D Item aus 3 Bildern
                            const item3d = document.createElement("div");
                            item3d.classList.add("item3d");
                            for (let i = 0; i < 3; i++) {
                                const img = document.createElement("div");
                                img.style.backgroundImage = `url(../block/${id}.png)`;
                                img.style.backgroundSize = "cover";
                                item3d.appendChild(img);
                            }
                            slot.appendChild(item3d);
                        }


                    }

                    addHoverEffect(slot, item, id, itemData);

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
        // alert("Dieser Spieler hat sein Inventar noch nicht bearbeitet.");
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
    return data["item.minecraft." + id] || data["block.minecraft." + id] || id;
}

//get uuid from url parameter
const urlParams = new URLSearchParams(window.location.search);
const uuid = urlParams.get('uuid');
const lang = urlParams.get('lang') || "de_de";
const mode = urlParams.get('mode') || "UHC";
renderInventory(uuid, mode, lang).then(() => console.log("done"));
