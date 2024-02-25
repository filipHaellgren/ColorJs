function Color(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
}

Color.prototype.rgb = function() {
    return `rgb(${this.r},${this.g},${this.b})`;
};

Color.prototype.hex = function() {
    let rHex = this.r.toString(16).padStart(2, '0');
    let gHex = this.g.toString(16).padStart(2, '0');
    let bHex = this.b.toString(16).padStart(2, '0');
    return `#${rHex}${gHex}${bHex}`;
};

Color.prototype.rgba = function(a) {
    return `rgba(${this.r},${this.g},${this.b},${a})`;
};

Color.prototype.hsl = function() {
    let r = this.r / 255;
    let g = this.g / 255;
    let b = this.b / 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return `hsl(${h}, ${s}%, ${l}%)`;
};

document.addEventListener('DOMContentLoaded', function() {
    let updateColorBtn = document.getElementById('updateColorBtn');

    updateColorBtn.addEventListener('click', function() {
        let rgbInput = document.getElementById('rgbInput').value;
        let hexInput = document.getElementById('hexInput').value;
        let rgbaInput = document.getElementById('rgbaInput').value;
        let hslInput = document.getElementById('hslInput').value;

        let newColor;

        if (rgbInput) {
            let rgbValues = rgbInput.split(',').map(val => parseInt(val));
            newColor = new Color(rgbValues[0], rgbValues[1], rgbValues[2]);
        }

        if (hexInput) {
            // Convert Hex to RGB
            let hex = hexInput.replace('#', '');
            let r = parseInt(hex.substring(0, 2), 16);
            let g = parseInt(hex.substring(2, 4), 16);
            let b = parseInt(hex.substring(4, 6), 16);
            newColor = new Color(r, g, b);
        }

        if (rgbaInput) {
            let rgbaValues = rgbaInput.split(',').map(val => parseFloat(val));
            newColor = new Color(rgbaValues[0], rgbaValues[1], rgbaValues[2]);
        }

        if (hslInput) {
            // Convert HSL to RGB
            let hslValues = hslInput.match(/\d+/g).map(val => parseInt(val));
            let h = hslValues[0] / 360;
            let s = hslValues[1] / 100;
            let l = hslValues[2] / 100;

            if (s === 0) {
                newColor = new Color(l * 255, l * 255, l * 255);
            } else {
                let hue2rgb = function hue2rgb(p, q, t) {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1 / 6) return p + (q - p) * 6 * t;
                    if (t < 1 / 2) return q;
                    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                };

                let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                let p = 2 * l - q;
                let r = hue2rgb(p, q, h + 1 / 3) * 255;
                let g = hue2rgb(p, q, h) * 255;
                let b = hue2rgb(p, q, h - 1 / 3) * 255;

                newColor = new Color(r, g, b);
            }
        }

        if (newColor) {
            document.body.style.backgroundColor = newColor.rgb();
        }
    });
});
