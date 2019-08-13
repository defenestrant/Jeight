import * as R from "ramda"

export const curryAndFlip = fn => R.flip(R.curry(fn))

// source: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
const hexToRgb = hex => {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
     ] : null;
  }

// source: https://stackoverflow.com/questions/9733288/how-to-programmatically-calculate-the-contrast-ratio-between-two-colors
const luminanace = (r, g, b) => {
    const a = [r, g, b].map(v => {
        v /= 255
        return v <= 0.03928
            ? v / 12.92
            : Math.pow( (v + 0.055) / 1.055, 2.4 )
    })
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
}

const contrast = (rgb1, rgb2) => (luminanace(rgb1[0], rgb1[1], rgb1[2]) + 0.05) / (luminanace(rgb2[0], rgb2[1], rgb2[2]) + 0.05)
const contrastHex = (hex1, hex2) => contrast(hexToRgb(hex1), hexToRgb(hex2))

const getRandomColor = () => {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

const getHighContrastRandomColor = color =>
{
    let newColor = getRandomColor()
    while(contrastHex(color, newColor) < 6)
    {
        newColor = getRandomColor()
    }
    return newColor
}

const generateRandomBit = () => Math.round(Math.random())

export const generateTwoHighContrastRandomColors = () =>
{
    let hex1 = getRandomColor()
    let hex2 = getRandomColor()
    let tries = 0
    while(tries <= 20 && contrastHex(hex1, hex2) < 5)
    {
        hex2 = getRandomColor()
        tries++
        if(tries == 20)
        {
            hex1 = getRandomColor()
            tries = 0
        }
    }

    return generateRandomBit() ? [hex2, hex1] : [hex1, hex2]
}

console.log("HEX CONVERSION: ", hexToRgb("#C332D7"))

console.log("CONTRAST: ", contrastHex("#C332D7", "#A845CE"))