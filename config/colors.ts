import color from 'chroma-js';

const COLOR__INFO = "#0275d8";
const COLOR__WARNING = "#f99b2f";
const COLOR__DANGER = "#ff4527";
const COLOR__SUCCESS = "#5cb85c";
const COLOR__MAIN = "#171D3D";

const COLOR__FONT = "#292b2c";
const COLOR__FADE = "#c6c6c6";

const CONST__GAP = "10px"

// /* CSS HEX */
// --rich-black-fogra-29: #070d0fff;
// --red: #eb1405ff;
// --dark-orange: #f98901ff;
// --middle-yellow: #ffeb14ff;
// --erin: #00fa2eff;
// --blue: #001dfaff;
// --razzle-dazzle-rose: #ff42d0ff;

// /* CSS HSL */
// --rich-black-fogra-29: hsla(195, 36%, 4%, 1);
// --red: hsla(4, 96%, 47%, 1);
// --dark-orange: hsla(33, 99%, 49%, 1);
// --middle-yellow: hsla(55, 100%, 54%, 1);
// --erin: hsla(131, 100%, 49%, 1);
// --blue: hsla(233, 100%, 49%, 1);
// --razzle-dazzle-rose: hsla(315, 100%, 63%, 1);

const mkPastel = (c: string) => color(c).brighten(1.5).desaturate(1.5).hex();
/* SCSS HEX */
const COLOR__AUTONOMY_1 = mkPastel("#eb1405");
const COLOR__AUTONOMY_2 = mkPastel("#f98901");
const COLOR__AUTONOMY_3 = mkPastel("#8d5235");
const COLOR__AUTONOMY_4 = mkPastel("#2089dc");
const COLOR__AUTONOMY_5 = mkPastel("#4caf50");


export {
  COLOR__AUTONOMY_1,
  COLOR__AUTONOMY_2,
  COLOR__AUTONOMY_3,
  COLOR__AUTONOMY_4,
  COLOR__AUTONOMY_5,
  COLOR__INFO,
  COLOR__WARNING,
  COLOR__DANGER,
  COLOR__SUCCESS,
  COLOR__MAIN,
  COLOR__FONT,
  COLOR__FADE,
  CONST__GAP
}