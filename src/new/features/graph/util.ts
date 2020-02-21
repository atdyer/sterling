import * as d3 from 'd3-color';

const POPPER_MODIFIERS = {
    preventOverflow: {
        enabled: false
    },
    hide: {
        enabled: false
    }
};

const DEFAULT_COLORS = ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5",
    "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39",
    "#ffc107", "#ff9800", "#ff5722", "#795548", "#607d8b",
    "#333333", "#777777", "#bbbbbb", "#ffffff"];

function background (color?: string | null): string | undefined {
    if (!color) return;
    const c = d3.color(color);
    return c ? c.hex() : undefined;
}

function foreground (color?: string | null): string | undefined {
    if (!color) return;
    const c = d3.color(color);
    if (!c) return;
    const rgb = c.rgb();
    return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000 > 125
        ? '#000000'
        : '#ffffff';
}

export {
    DEFAULT_COLORS,
    POPPER_MODIFIERS,
    background,
    foreground
}
