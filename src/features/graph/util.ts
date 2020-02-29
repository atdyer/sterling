import * as d3 from 'd3-color';
import * as schemes from 'd3-scale-chromatic';

const POPPER_MODIFIERS = {
    preventOverflow: {
        enabled: false
    },
    hide: {
        enabled: false
    }
};

const COLOR_SCHEMES: [string, string[]][] = [
    ['Tableu', colors("4e79a7f28e2ce1575976b7b259a14fedc949af7aa1ff9da79c755fbab0ab")],
    ['Turbo', [0, 1, 2, 4, 5, 6, 7].map(i => turboScheme(i/8)).map(c => d3.rgb(c).hex())],
    ['Categorical', schemes.schemeCategory10.slice()],
    ['Accent', schemes.schemeAccent.slice()],
    ['Dark', schemes.schemeDark2.slice()],
    ['Pastel', schemes.schemePastel1.slice()],
    ['Paired', schemes.schemePaired.slice()]
];

const DEFAULT_COLORS = ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5",
    "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39",
    "#ffc107", "#ff9800", "#ff5722", "#795548", "#607d8b",
    "#333333", "#777777", "#bbbbbb", "#ffffff"];

function background (color?: string | null): string | undefined {
    if (!color) return;
    const c = d3.color(color);
    return c ? c.hex() : undefined;
}

function backgroundGradient (colors: string[]): string {
    if (!colors.length) return '';
    const percent = 100 / colors.length;
    const strings = colors.map((color, i) => `${color} ${i*percent}% ${(i+1)*percent}%`);
    return `linear-gradient(to right, ${strings.join(',')})`;
}

function colors (specifier: string): string[] {
    let n = specifier.length / 6 | 0, colors = new Array(n), i = 0;
    while (i < n) colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
    return colors;
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

function turboScheme (t: number): string {
    t = Math.max(0, Math.min(1, t));
    return "rgb("
        + Math.max(0, Math.min(255, Math.round(34.61 + t * (1172.33 - t * (10793.56 - t * (33300.12 - t * (38394.49 - t * 14825.05))))))) + ", "
        + Math.max(0, Math.min(255, Math.round(23.31 + t * (557.33 + t * (1225.33 - t * (3574.96 - t * (1073.77 + t * 707.56))))))) + ", "
        + Math.max(0, Math.min(255, Math.round(27.2 + t * (3211.1 - t * (15327.97 - t * (27814 - t * (22569.18 - t * 6838.66)))))))
        + ")";
}

export {
    COLOR_SCHEMES,
    DEFAULT_COLORS,
    POPPER_MODIFIERS,
    background,
    backgroundGradient,
    foreground
}
