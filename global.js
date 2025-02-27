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

function formatMinecraftColorCodes(text) {
    const colorMapping = {
        '0': '#000000',
        '1': '#0000AA',
        '2': '#00AA00',
        '3': '#00AAAA',
        '4': '#AA0000',
        '5': '#AA00AA',
        '6': '#FFAA00',
        '7': '#AAAAAA',
        '8': '#555555',
        '9': '#5555FF',
        'a': '#55FF55',
        'b': '#55FFFF',
        'c': '#FF5555',
        'd': '#FF55FF',
        'e': '#FFFF55',
        'f': '#FFFFFF'
    };

    let result = "";
    let openTags = [];
    const regex = /§([0-9a-fk-or])/ig;
    let index = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
        // Append text preceding the current formatting code.
        result += text.substring(index, match.index);
        const code = match[1].toLowerCase();

        if (code === 'r') {
            // Reset: close all open spans.
            while (openTags.length) {
                result += "</span>";
                openTags.pop();
            }
        } else if (colorMapping[code]) {
            // New color code: close previous color spans.
            while (openTags.length > 0 && openTags[openTags.length - 1].type === 'color') {
                result += "</span>";
                openTags.pop();
            }
            // Open a new color span.
            result += `<span style="color: ${colorMapping[code]}">`;
            openTags.push({ type: 'color' });
        } else {
            // Format codes ('k', 'l', 'm', 'n', 'o') get applied to the current style.
            let className = "";
            switch (code) {
                case 'l':
                    className = "bold";
                    break;
                case 'o':
                    className = "italic";
                    break;
                case 'n':
                    className = "underlined";
                    break;
                case 'm':
                    className = "strikethrough";
                    break;
                // 'k' (obfuscated) and other unsupported codes are ignored or could be handled separately.
                default:
                    break;
            }
            if (className) {
                result += `<span class="${className}">`;
                openTags.push({ type: 'format' });
            }
        }
        index = regex.lastIndex;
    }
    // Append any remaining text.
    result += text.substring(index);
    // Close any remaining open spans.
    while (openTags.length) {
        result += "</span>";
        openTags.pop();
    }
    return result;
}

// Helper function to add common tooltip event handlers
function addTooltip(hoveringOnElement, tooltipCreator) {
    function showTooltip(e) {
        const tooltip = tooltipCreator();
        tooltip.classList.add("tooltip");
        document.body.appendChild(tooltip);
        hoveringOnElement._tooltip = tooltip;
    }

    function moveTooltip(e) {
        if (hoveringOnElement._tooltip) {
            const tooltip = hoveringOnElement._tooltip;
            const tooltipWidth = tooltip.offsetWidth;
            const tooltipHeight = tooltip.offsetHeight;
            const pageWidth = window.innerWidth;
            const pageHeight = window.innerHeight;
            let left = e.pageX + 10;
            let top = e.pageY + 10;

            if (left + tooltipWidth > pageWidth) {
                left = e.pageX - tooltipWidth - 10;
            }
            if (top + tooltipHeight > pageHeight) {
                top = e.pageY - tooltipHeight - 10;
            }

            if (left < 0) {
                left = 0;
            }
            if (top < 0) {
                top = 0;
            }

            tooltip.style.left = left + "px";
            tooltip.style.top = top + "px";
        }
    }

    function hideTooltip() {
        if (hoveringOnElement._tooltip) {
            hoveringOnElement._tooltip.remove();
            hoveringOnElement._tooltip = null;
        }
    }

    hoveringOnElement.addEventListener("mouseover", showTooltip);
    hoveringOnElement.addEventListener("mousemove", moveTooltip);
    hoveringOnElement.addEventListener("mouseout", hideTooltip);

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.removedNodes.forEach(removed => {
          if (removed === hoveringOnElement) {
            if (hoveringOnElement._tooltip) {
              hoveringOnElement._tooltip.remove();
              hoveringOnElement._tooltip = null;
            }
            observer.disconnect();
          }
        });
      });
    });

    if (hoveringOnElement.parentNode) {
      observer.observe(hoveringOnElement.parentNode, { childList: true });
    }
}

// Refactored addHoverEffect using addTooltip
function addHoverEffect(hoveringOnElement, item, id, itemData) {
    addTooltip(hoveringOnElement, function () {
        const tooltip = document.createElement("div");

        const rawName = item.components?.["minecraft:custom_name"] || getItemName(id, itemData) || id;
        const nameElement = document.createElement("div");
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

        return tooltip;
    });
}

// Refactored addTextTooltip using addTooltip
function addTextTooltip(hoveringOnElement, text) {
    addTooltip(hoveringOnElement, function () {
        const tooltip = document.createElement("div");
        text.split("\n").forEach(line => {
            const lineElement = document.createElement("div");
            lineElement.innerHTML = formatMinecraftColorCodes(line);
            tooltip.appendChild(lineElement);
        });
        return tooltip;
    });
}