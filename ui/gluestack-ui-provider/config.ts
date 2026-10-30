// @ts-nocheck
import { vars } from 'nativewind';

// Raw color values - update these and they sync everywhere
export const colors = {
  light: {
    '--primary': '254 67 76',
    '--primary-foreground': '250 250 250',
    '--card': '255 253 248',
    '--secondary': '234 227 211',
    '--secondary-foreground': '23 23 23',
    '--background': '244 240 230',
    '--popover': '255 253 248',
    '--popover-foreground': '10 10 10',
    '--muted': '234 227 211',
    '--muted-foreground': '115 115 115',
    '--destructive': '231 0 11',
    '--foreground': '10 10 10',
    '--border': '230 222 206',
    '--input': '230 222 206',
    '--ring': '230 222 206',
    '--accent': '234 227 211',
    '--accent-foreground': '52 52 52',
  },
  dark: {
    '--primary-foreground': '23 23 23',
    '--primary': '255 245 245',
    '--card': '23 23 23',
    '--secondary': '38 38 38',
    '--secondary-foreground': '250 250 250',
    '--background': '10 10 10',
    '--popover': '23 23 23',
    '--popover-foreground': '250 250 250',
    '--muted': '38 38 38',
    '--muted-foreground': '161 161 161',
    '--destructive': '255 100 103',
    '--foreground': '250 250 250',
    '--border': '46 46 46',
    '--input': '46 46 46',
    '--accent': '38 38 38',
    '--accent-foreground': '250 250 250',
    '--ring': '115 115 115',
  },
};

// Config for nativewind vars() - used by provider
export const config = {
  light: vars(colors.light),
  dark: vars(colors.dark),
};
