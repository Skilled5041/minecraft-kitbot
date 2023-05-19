export const rgbToHex = (r: number, g: number, b: number) => {
    if (r > 255 || g > 255 || b > 255 || r < 0 || g < 0 || b < 0) throw new Error("Invalid RGB colour.");
    return Number("0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1));
};