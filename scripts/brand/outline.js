// Converte "SmartBar" (Arial Bold) em curvas — os SVGs de mockup não dependem de fonte instalada.
const opentype = require("opentype.js");
const fs = require("fs");
const b = fs.readFileSync("C:/Windows/Fonts/arialbd.ttf"); const font = opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
const SIZE = 146.6, X = 294.5, Y = 192.5;
const opt = { kerning: true };
const smart = font.getPath("Smart", X, Y, SIZE, opt).toPathData(2);
const off = font.getAdvanceWidth("SmartBar", SIZE, opt) - font.getAdvanceWidth("Bar", SIZE, opt);
const bar = font.getPath("Bar", X + off, Y, SIZE, opt).toPathData(2);
const end = X + font.getAdvanceWidth("SmartBar", SIZE, opt);
fs.writeFileSync(__dirname + "/text-paths.json", JSON.stringify({ smart, bar }));
console.log("largura do texto:", (end - X).toFixed(1), "px (navegador: 659,6; referência: 667) · fim em x =", end.toFixed(1));
