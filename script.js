
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

async function renderInventory(uuid) {
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

renderInventory("202bd80d-1cae-4812-a028-42b0a478346e").then(() => console.log("done"));

document.getElementById("load").addEventListener("click", () => {
    const uuid = document.getElementById("uuid").value;
    renderInventory(uuid).then(() => console.log("done"));
});
