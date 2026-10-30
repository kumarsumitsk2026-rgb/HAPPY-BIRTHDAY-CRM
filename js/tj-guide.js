/* =================================================================
   tj-guide.js  —  Tom & Jerry Step-by-Step Celebration Guide
   Hand-drawn inline SVG characters that change pose at each step.
   Inspired by the Tom & Jerry Valentine image (Tom with flowers &
   big heart, Jerry with heart balloon).
   At the finale: Jerry gives CRM AALI a flower bouquet. 🌸
   ================================================================= */

(function () {
  'use strict';

  /* ---------------------------------------------------------------
     SVG BUILDING BLOCKS
     All coordinates local; call with <g transform="translate(x,y)">
  --------------------------------------------------------------- */

  /**
   * Tom the Cat  (grey; body ≈ 104 px wide × 160 px tall)
   * o.lArm / o.rArm  = rotation angle of that arm around its pivot
   *   (SVG clockwise: +120 ≈ arm up-left; -120 ≈ arm up-right)
   * o.mood  = 'happy' | 'big' | 'calm'
   * o.eyesClosed = bool
   * o.extra = extra SVG appended inside the group
   */
  function tom(o) {
    o = o || {};
    var la = o.lArm !== undefined ? o.lArm :   0;
    var ra = o.rArm !== undefined ? o.rArm :   0;
    var ll = o.lLeg !== undefined ? o.lLeg :  10;
    var rl = o.rLeg !== undefined ? o.rLeg : -10;
    var m  = o.mood || 'happy';

    var mouth = m === 'big'  ? 'M40,68 Q52,82 64,68' :
                m === 'calm' ? 'M46,68 Q52,70 58,68' :
                               'M43,68 Q52,76 61,68';
    var eyeRy = m === 'big' ? 8 : 7;

    var eyeSVG = o.eyesClosed ? (
      '<ellipse cx="43" cy="52" rx="7" ry="5" fill="#cfc0b0"/>' +
      '<path d="M36,51 Q43,58 50,51" fill="none" stroke="#7a7a8a" stroke-width="2.2" stroke-linecap="round"/>' +
      '<ellipse cx="61" cy="52" rx="7" ry="5" fill="#cfc0b0"/>' +
      '<path d="M54,51 Q61,58 68,51" fill="none" stroke="#7a7a8a" stroke-width="2.2" stroke-linecap="round"/>'
    ) : (
      '<ellipse cx="43" cy="50" rx="6" ry="' + eyeRy + '" fill="#ffd030"/>' +
      '<ellipse cx="61" cy="50" rx="6" ry="' + eyeRy + '" fill="#ffd030"/>' +
      '<circle cx="44" cy="52" r="3.5" fill="#222"/>' +
      '<circle cx="62" cy="52" r="3.5" fill="#222"/>' +
      '<circle cx="43" cy="49" r="1.2" fill="white"/>' +
      '<circle cx="61" cy="49" r="1.2" fill="white"/>'
    );

    return [
      // Legs (drawn behind body)
      '<ellipse cx="39" cy="140" rx="10" ry="17" fill="#8b9aaa" transform="rotate(' + ll + ',39,128)"/>',
      '<ellipse cx="65" cy="140" rx="10" ry="17" fill="#8b9aaa" transform="rotate(' + rl + ',65,128)"/>',
      // Feet (white)
      '<ellipse cx="36" cy="153" rx="14" ry="7" fill="white"/>',
      '<ellipse cx="66" cy="153" rx="14" ry="7" fill="white"/>',
      // Body
      '<ellipse cx="52" cy="108" rx="22" ry="32" fill="#8b9aaa"/>',
      // Tummy
      '<ellipse cx="52" cy="103" rx="14" ry="23" fill="#c0ccda"/>',
      // Arms (pivots: left=28,90  right=76,90)
      '<g transform="rotate(' + la + ',28,90)"><ellipse cx="28" cy="108" rx="9" ry="18" fill="#8b9aaa"/></g>',
      '<g transform="rotate(' + ra + ',76,90)"><ellipse cx="76" cy="108" rx="9" ry="18" fill="#8b9aaa"/></g>',
      // Head
      '<ellipse cx="52" cy="55" rx="28" ry="26" fill="#8b9aaa"/>',
      // Ears
      '<polygon points="27,35 33,12 46,35" fill="#8b9aaa"/>',
      '<polygon points="58,35 71,12 77,35" fill="#8b9aaa"/>',
      '<polygon points="30,33 34,17 44,33" fill="#e8a0b0"/>',
      '<polygon points="60,33 70,17 74,33" fill="#e8a0b0"/>',
      // Face cream area
      '<ellipse cx="52" cy="60" rx="18" ry="17" fill="#cfc0b0"/>',
      // Eyes
      eyeSVG,
      // Nose
      '<ellipse cx="52" cy="65" rx="4" ry="3" fill="#e07878"/>',
      // Whiskers
      '<line x1="32" y1="62" x2="47" y2="64" stroke="#9a9aaa" stroke-width="1.2"/>',
      '<line x1="32" y1="67" x2="47" y2="67" stroke="#9a9aaa" stroke-width="1.2"/>',
      '<line x1="57" y1="64" x2="72" y2="62" stroke="#9a9aaa" stroke-width="1.2"/>',
      '<line x1="57" y1="67" x2="72" y2="67" stroke="#9a9aaa" stroke-width="1.2"/>',
      // Mouth
      '<path d="' + mouth + '" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round"/>',
      // Bow tie (classic Tom look)
      '<polygon points="46,80 42,85 46,90 50,85" fill="#cc2020"/>',
      '<polygon points="58,80 54,85 58,90 62,85" fill="#cc2020"/>',
      '<circle cx="52" cy="85" r="3.5" fill="#ff5050"/>',
      // Extra SVG (props held in hands, etc.)
      o.extra || ''
    ].join('');
  }

  /**
   * Jerry the Mouse  (brown; body ≈ 75 px wide × 140 px tall)
   * o.lArm / o.rArm  = rotation around pivot (left=10,88  right=46,88)
   */
  function jerry(o) {
    o = o || {};
    var la = o.lArm !== undefined ? o.lArm :   0;
    var ra = o.rArm !== undefined ? o.rArm :   0;
    var ll = o.lLeg !== undefined ? o.lLeg :   6;
    var rl = o.rLeg !== undefined ? o.rLeg :  -6;
    var m  = o.mood || 'happy';
    var mouthY = m === 'big' ? 72 : 67;
    var eyeR   = m === 'big' ? 5 : 4;

    var eyeSVG = o.eyesClosed ? (
      '<ellipse cx="21" cy="50" rx="5" ry="4" fill="#e8c080"/>' +
      '<path d="M16,49 Q21,55 26,49" fill="none" stroke="#7a7a8a" stroke-width="1.8" stroke-linecap="round"/>' +
      '<ellipse cx="35" cy="50" rx="5" ry="4" fill="#e8c080"/>' +
      '<path d="M30,49 Q35,55 40,49" fill="none" stroke="#7a7a8a" stroke-width="1.8" stroke-linecap="round"/>'
    ) : (
      '<circle cx="21" cy="48" r="' + eyeR + '" fill="#222"/>' +
      '<circle cx="35" cy="48" r="' + eyeR + '" fill="#222"/>' +
      '<circle cx="20" cy="47" r="1.5" fill="white"/>' +
      '<circle cx="34" cy="47" r="1.5" fill="white"/>'
    );

    return [
      // Legs
      '<ellipse cx="20" cy="122" rx="8" ry="13" fill="#c07838" transform="rotate(' + ll + ',20,112)"/>',
      '<ellipse cx="36" cy="122" rx="8" ry="13" fill="#c07838" transform="rotate(' + rl + ',36,112)"/>',
      // Feet
      '<ellipse cx="18" cy="132" rx="11" ry="5" fill="#c07838"/>',
      '<ellipse cx="36" cy="132" rx="11" ry="5" fill="#c07838"/>',
      // Body
      '<ellipse cx="28" cy="100" rx="15" ry="24" fill="#c07838"/>',
      // Tummy
      '<ellipse cx="28" cy="97" rx="9" ry="17" fill="#e8b870"/>',
      // Arms (pivots: left=10,88  right=46,88)
      '<g transform="rotate(' + la + ',10,88)"><ellipse cx="10" cy="103" rx="7" ry="16" fill="#c07838"/></g>',
      '<g transform="rotate(' + ra + ',46,88)"><ellipse cx="46" cy="103" rx="7" ry="16" fill="#c07838"/></g>',
      // Head
      '<ellipse cx="28" cy="52" rx="21" ry="20" fill="#c07838"/>',
      // Ears (big round — classic Jerry)
      '<circle cx="11" cy="35" r="14" fill="#c07838"/>',
      '<circle cx="11" cy="35" r="10" fill="#e89898"/>',
      '<circle cx="45" cy="35" r="14" fill="#c07838"/>',
      '<circle cx="45" cy="35" r="10" fill="#e89898"/>',
      // Face
      '<ellipse cx="28" cy="56" rx="14" ry="13" fill="#e8c080"/>',
      // Eyes
      eyeSVG,
      // Nose
      '<ellipse cx="28" cy="59" rx="3" ry="2.2" fill="#e03030"/>',
      // Mouth
      '<path d="M23,63 Q28,' + mouthY + ' 33,63" fill="none" stroke="#555" stroke-width="1.5" stroke-linecap="round"/>',
      o.extra || ''
    ].join('');
  }

  /* ---------------------------------------------------------------
     PROP HELPERS  (drawn in absolute SVG coordinates per pose)
  --------------------------------------------------------------- */

  // Glowing light bulb
  function lightbulb(cx, cy) {
    return [
      '<ellipse cx="' + cx + '" cy="' + cy + '" rx="18" ry="20" fill="#fff9a0" stroke="#ffd030" stroke-width="2.5"/>',
      '<rect x="' + (cx - 8) + '" y="' + (cy + 17) + '" width="16" height="9" rx="3" fill="#bbb"/>',
      '<line x1="' + (cx - 4) + '" y1="' + (cy + 26) + '" x2="' + (cx - 4) + '" y2="' + (cy + 34) + '" stroke="#888" stroke-width="2"/>',
      '<line x1="' + (cx + 4) + '" y1="' + (cy + 26) + '" x2="' + (cx + 4) + '" y2="' + (cy + 34) + '" stroke="#888" stroke-width="2"/>',
      // Glow rays
      '<line x1="' + cx + '" y1="' + (cy - 24) + '" x2="' + cx + '" y2="' + (cy - 30) + '" stroke="#ffd030" stroke-width="2.5" stroke-linecap="round"/>',
      '<line x1="' + (cx + 23) + '" y1="' + (cy - 12) + '" x2="' + (cx + 28) + '" y2="' + (cy - 16) + '" stroke="#ffd030" stroke-width="2.5" stroke-linecap="round"/>',
      '<line x1="' + (cx - 23) + '" y1="' + (cy - 12) + '" x2="' + (cx - 28) + '" y2="' + (cy - 16) + '" stroke="#ffd030" stroke-width="2.5" stroke-linecap="round"/>',
      '<line x1="' + (cx + 24) + '" y1="' + cy + '" x2="' + (cx + 30) + '" y2="' + cy + '" stroke="#ffd030" stroke-width="2.5" stroke-linecap="round"/>',
      '<line x1="' + (cx - 24) + '" y1="' + cy + '" x2="' + (cx - 30) + '" y2="' + cy + '" stroke="#ffd030" stroke-width="2.5" stroke-linecap="round"/>'
    ].join('');
  }

  // Lit match stick
  function matchStick(x1, y1, x2, y2) {
    return [
      '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="#8b5e2b" stroke-width="3.5" stroke-linecap="round"/>',
      '<ellipse cx="' + x2 + '" cy="' + (y2 - 4) + '" rx="6" ry="9" fill="#ffaa20"/>',
      '<ellipse cx="' + x2 + '" cy="' + (y2 - 3) + '" rx="4" ry="6" fill="#fff060"/>',
      '<ellipse cx="' + x2 + '" cy="' + (y2 - 2) + '" rx="2" ry="3" fill="white"/>'
    ].join('');
  }

  // Flower bouquet (like in the uploaded photo)
  function flowerBouquet(cx, cy) {
    return [
      // Stem
      '<line x1="' + cx + '" y1="' + (cy + 10) + '" x2="' + cx + '" y2="' + (cy + 62) + '" stroke="#3a8a18" stroke-width="3.5" stroke-linecap="round"/>',
      // Leaf
      '<ellipse cx="' + (cx - 10) + '" cy="' + (cy + 42) + '" rx="11" ry="5" fill="#4aaa20" transform="rotate(-38,' + (cx - 10) + ',' + (cy + 42) + ')"/>',
      // Back petals
      '<ellipse cx="' + cx + '" cy="' + (cy - 14) + '" rx="7" ry="12" fill="#ff9ec8"/>',
      '<ellipse cx="' + cx + '" cy="' + (cy + 14) + '" rx="7" ry="12" fill="#ff9ec8"/>',
      '<ellipse cx="' + (cx - 14) + '" cy="' + cy + '" rx="12" ry="7" fill="#ff9ec8"/>',
      '<ellipse cx="' + (cx + 14) + '" cy="' + cy + '" rx="12" ry="7" fill="#ff9ec8"/>',
      // Diagonal petals
      '<ellipse cx="' + (cx - 10) + '" cy="' + (cy - 10) + '" rx="9" ry="11" fill="#ffb8d8" transform="rotate(-45,' + (cx - 10) + ',' + (cy - 10) + ')"/>',
      '<ellipse cx="' + (cx + 10) + '" cy="' + (cy - 10) + '" rx="9" ry="11" fill="#ffb8d8" transform="rotate(45,' + (cx + 10) + ',' + (cy - 10) + ')"/>',
      '<ellipse cx="' + (cx - 10) + '" cy="' + (cy + 10) + '" rx="9" ry="11" fill="#ffb8d8" transform="rotate(45,' + (cx - 10) + ',' + (cy + 10) + ')"/>',
      '<ellipse cx="' + (cx + 10) + '" cy="' + (cy + 10) + '" rx="9" ry="11" fill="#ffb8d8" transform="rotate(-45,' + (cx + 10) + ',' + (cy + 10) + ')"/>',
      // Flower center
      '<circle cx="' + cx + '" cy="' + cy + '" r="10" fill="#ffd030"/>',
      '<circle cx="' + cx + '" cy="' + cy + '" r="6"  fill="#ff9900"/>',
      // Small dot seeds
      '<circle cx="' + (cx - 2) + '" cy="' + (cy - 2) + '" r="1.5" fill="#cc6600"/>',
      '<circle cx="' + (cx + 2) + '" cy="' + (cy - 2) + '" r="1.5" fill="#cc6600"/>',
      '<circle cx="' + cx + '" cy="' + (cy + 3) + '" r="1.5" fill="#cc6600"/>'
    ].join('');
  }

  // Rolled scroll / letter
  function scroll(x, y, angle) {
    var t = 'rotate(' + (angle || 0) + ',' + (x + 18) + ',' + (y + 25) + ')';
    return [
      '<g transform="' + t + '">',
      '<rect x="' + x + '" y="' + y + '" width="38" height="50" rx="4" fill="#fff9e0" stroke="#e8c060" stroke-width="2"/>',
      '<rect x="' + (x - 4) + '" y="' + (y - 2) + '" width="8" height="54" rx="4" fill="#e8d080"/>',
      '<rect x="' + (x + 34) + '" y="' + (y - 2) + '" width="8" height="54" rx="4" fill="#e8d080"/>',
      '<line x1="' + (x + 6) + '" y1="' + (y + 12) + '" x2="' + (x + 30) + '" y2="' + (y + 12) + '" stroke="#ddd" stroke-width="1.5"/>',
      '<line x1="' + (x + 6) + '" y1="' + (y + 20) + '" x2="' + (x + 30) + '" y2="' + (y + 20) + '" stroke="#ddd" stroke-width="1.5"/>',
      '<line x1="' + (x + 6) + '" y1="' + (y + 28) + '" x2="' + (x + 30) + '" y2="' + (y + 28) + '" stroke="#ddd" stroke-width="1.5"/>',
      '<text x="' + (x + 9) + '" y="' + (y + 11) + '" font-size="11">❤️</text>',
      '</g>'
    ].join('');
  }

  // Mini birthday cake (for cake step)
  function miniCake(cx, cy) {
    return [
      // Cake body
      '<rect x="' + (cx - 24) + '" y="' + (cy + 8) + '" width="48" height="38" rx="5" fill="#d4a07a"/>',
      // Frosting layer
      '<rect x="' + (cx - 24) + '" y="' + (cy - 4) + '" width="48" height="18" rx="5" fill="#f8f8f8"/>',
      '<ellipse cx="' + cx + '" cy="' + (cy - 4) + '" rx="24" ry="7" fill="#f8f8f8"/>',
      // Frosting drips
      '<ellipse cx="' + (cx - 12) + '" cy="' + (cy + 4) + '" rx="4" ry="5" fill="#f8f8f8"/>',
      '<ellipse cx="' + cx + '" cy="' + (cy + 5) + '" rx="4" ry="5" fill="#f8f8f8"/>',
      '<ellipse cx="' + (cx + 12) + '" cy="' + (cy + 4) + '" rx="4" ry="5" fill="#f8f8f8"/>',
      // Pink dots
      '<circle cx="' + (cx - 10) + '" cy="' + (cy + 18) + '" r="3" fill="#ff7aa8"/>',
      '<circle cx="' + cx + '" cy="' + (cy + 22) + '" r="3" fill="#ff7aa8"/>',
      '<circle cx="' + (cx + 10) + '" cy="' + (cy + 18) + '" r="3" fill="#ff7aa8"/>',
      // Candle
      '<rect x="' + (cx - 4) + '" y="' + (cy - 24) + '" width="8" height="24" rx="2" fill="#ffccaa"/>',
      // Flame
      '<ellipse cx="' + cx + '" cy="' + (cy - 28) + '" rx="5" ry="7" fill="#ffaa20"/>',
      '<ellipse cx="' + cx + '" cy="' + (cy - 26) + '" rx="3" ry="4" fill="#fff060"/>',
      '<ellipse cx="' + cx + '" cy="' + (cy - 24) + '" rx="1.5" ry="2.5" fill="white"/>'
    ].join('');
  }

  // Bunting banner string + flags
  function bunting() {
    return [
      '<path d="M14,16 Q105,4 196,16" stroke="#ffd030" stroke-width="2" fill="none"/>',
      '<polygon points="24,16 38,16 31,30" fill="#ff7aa8"/>',
      '<polygon points="50,10 64,10 57,24" fill="#8b6cf0"/>',
      '<polygon points="76,6 90,6 83,20" fill="#ffd030"/>',
      '<polygon points="102,4 116,4 109,18" fill="#4cc9f0"/>',
      '<polygon points="128,6 142,6 135,20" fill="#ff7aa8"/>',
      '<polygon points="154,10 168,10 161,24" fill="#8b6cf0"/>',
      '<polygon points="180,14 194,14 187,28" fill="#ffd030"/>'
    ].join('');
  }

  /* ---------------------------------------------------------------
     POSES  (viewBox 0 0 210 175)
     Tom group translate ≈ (4, 8–18)
     Jerry group translate ≈ (110–120, 20–30)
  --------------------------------------------------------------- */

  var POSES = {

    /* 1 — intro: both waving */
    intro: {
      bubble: '🎁 Turn on the lights!',
      content: function () {
        return [
          '<g transform="translate(4,10)">', tom({ lArm: 140, rArm: 0, mood: 'happy' }), '</g>',
          '<g transform="translate(112,24)">', jerry({ lArm: 0, rArm: -138, mood: 'big' }), '</g>',
          '<text x="158" y="22" font-size="18" fill="#ffd030">✨</text>',
          '<text x="2" y="22" font-size="16" fill="#ff7aa8">🌟</text>',
          '<text x="84" y="14" font-size="14" fill="#8b6cf0">🎉</text>'
        ].join('');
      }
    },

    /* 2 — turn on lights: Tom points at bulb */
    turn_on: {
      bubble: '💡 Let there be light!',
      content: function () {
        return [
          lightbulb(108, 28),
          '<g transform="translate(4,10)">', tom({ lArm: 10, rArm: -148, mood: 'happy' }), '</g>',
          // Fingertip hint circle at raised arm's approximate end
          '<circle cx="96" cy="64" r="5" fill="#cfc0b0"/>',
          '<g transform="translate(114,32)">', jerry({ lArm: 0, rArm: 0, mood: 'big' }), '</g>'
        ].join('');
      }
    },

    /* 3 — music: dancing, arms spread wide */
    play: {
      bubble: '🎵 Dance time!',
      content: function () {
        return [
          '<g transform="translate(4,10)">', tom({ lArm: 95, rArm: -95, mood: 'big' }), '</g>',
          '<text x="78" y="34" font-size="22" fill="#8b6cf0">♪</text>',
          '<text x="98" y="18" font-size="20" fill="#ff7aa8">♫</text>',
          '<text x="153" y="38" font-size="18" fill="#ffd030">♪</text>',
          '<g transform="translate(112,24)">', jerry({ lArm: 90, rArm: -90, mood: 'big' }), '</g>'
        ].join('');
      }
    },

    /* 4 — banner/decorate: holding bunting ends */
    bannar_coming: {
      bubble: '🎊 Let\'s decorate!',
      content: function () {
        return [
          bunting(),
          '<g transform="translate(4,18)">', tom({ lArm: 138, rArm: 0, mood: 'happy' }), '</g>',
          '<circle cx="20" cy="65" r="4.5" fill="#cfc0b0"/>',
          '<g transform="translate(116,24)">', jerry({ lArm: 132, rArm: 0, mood: 'big' }), '</g>',
          '<circle cx="120" cy="70" r="3.5" fill="#c07838"/>'
        ].join('');
      }
    },

    /* 5 — balloons flying: both arms up holding strings */
    balloons_flying: {
      bubble: '🎈 Fly, balloons, fly!',
      content: function () {
        return [
          // Balloon shapes
          '<ellipse cx="36" cy="18" rx="16" ry="18" fill="#ff7aa8"/>',
          '<line x1="36" y1="36" x2="40" y2="80" stroke="#888" stroke-width="1.5"/>',
          '<ellipse cx="72" cy="12" rx="15" ry="17" fill="#8b6cf0"/>',
          '<line x1="72" y1="29" x2="66" y2="80" stroke="#888" stroke-width="1.5"/>',
          '<ellipse cx="148" cy="16" rx="14" ry="16" fill="#ffd030"/>',
          '<line x1="148" y1="32" x2="142" y2="80" stroke="#888" stroke-width="1.5"/>',
          '<ellipse cx="182" cy="24" rx="13" ry="15" fill="#4cc9f0"/>',
          '<line x1="182" y1="39" x2="174" y2="80" stroke="#888" stroke-width="1.5"/>',
          '<g transform="translate(4,20)">', tom({ lArm: 138, rArm: -138, mood: 'big' }), '</g>',
          '<g transform="translate(114,28)">', jerry({ lArm: 132, rArm: -132, mood: 'big' }), '</g>'
        ].join('');
      }
    },

    /* 6 — cake: excited at cake */
    cake_fadein: {
      bubble: '🎂 Birthday cake!',
      content: function () {
        return [
          '<g transform="translate(2,12)">', tom({ lArm: 22, rArm: -22, mood: 'big' }), '</g>',
          miniCake(105, 100),
          '<g transform="translate(118,24)">', jerry({ lArm: 22, rArm: -22, mood: 'big' }), '</g>'
        ].join('');
      }
    },

    /* 7 — light candle: Tom holds a lit match */
    light_candle: {
      bubble: '🕯️ Light the candle!',
      content: function () {
        return [
          '<g transform="translate(4,10)">', tom({ lArm: 10, rArm: -142, mood: 'happy' }), '</g>',
          // Match in raised right hand (approximate arm-tip position)
          matchStick(86, 78, 106, 44),
          '<g transform="translate(114,28)">', jerry({ lArm: 20, rArm: 20, mood: 'big' }), '</g>',
          '<text x="152" y="20" font-size="14" fill="#ffd030">✨</text>'
        ].join('');
      }
    },

    /* 8 — make a wish: eyes closed, serene */
    wish_message: {
      bubble: '✨ Close your eyes & wish!',
      content: function () {
        return [
          '<g transform="translate(4,10)">', tom({ lArm: 28, rArm: -28, mood: 'calm', eyesClosed: true }), '</g>',
          '<text x="76" y="28" font-size="16">⭐</text>',
          '<text x="96" y="14" font-size="13">✨</text>',
          '<text x="60" y="12" font-size="11">🌟</text>',
          '<g transform="translate(114,22)">', jerry({ lArm: 24, rArm: -24, mood: 'calm', eyesClosed: true }), '</g>'
        ].join('');
      }
    },

    /* 9 — balloons spell / story message: Jerry reads scroll */
    story: {
      bubble: '💌 A message for you...',
      content: function () {
        return [
          '<g transform="translate(4,10)">', tom({ lArm: 14, rArm: -14, mood: 'happy' }), '</g>',
          '<g transform="translate(112,20)">', jerry({ lArm: 10, rArm: -136, mood: 'happy' }), '</g>',
          // Scroll at Jerry's raised right hand (approx absolute position)
          scroll(160, 48, -14)
        ].join('');
      }
    },

    /* 10 — FINALE: Jerry gives flower, Tom shows big heart */
    finale: {
      bubble: '🌸 Happy Birthday CRM AALI! ❤️',
      content: function () {
        return [
          // Tom in back: both arms raised holding a big heart
          '<g transform="translate(2,14)">', tom({ lArm: 138, rArm: -138, mood: 'big' }), '</g>',
          // Big red heart above Tom
          '<text x="30" y="22" font-size="32">❤️</text>',
          // Jerry in front: right arm raised, holding flower bouquet
          '<g transform="translate(110,16)">', jerry({ lArm: 10, rArm: -148, mood: 'big' }), '</g>',
          // Flower bouquet at Jerry's raised arm tip (absolute ≈ x=178, y=20)
          flowerBouquet(178, 20),
          // Sparkles
          '<text x="2"   y="14" font-size="14">✨</text>',
          '<text x="84"  y="8"  font-size="15">💖</text>'
        ].join('');
      }
    }

  };

  /* ---------------------------------------------------------------
     GUIDE DOM ELEMENT
  --------------------------------------------------------------- */

  var guideEl, bubbleEl, svgWrapEl, inited = false;

  function init() {
    if (inited) return;
    inited = true;

    guideEl = document.createElement('div');
    guideEl.id = 'tj-guide';
    guideEl.className = 'tj-guide';
    guideEl.style.display = 'none';

    bubbleEl = document.createElement('div');
    bubbleEl.className = 'tj-bubble';

    svgWrapEl = document.createElement('div');
    svgWrapEl.className = 'tj-svg-wrap';

    guideEl.appendChild(bubbleEl);
    guideEl.appendChild(svgWrapEl);
    document.body.appendChild(guideEl);
  }

  /* ---------------------------------------------------------------
     PUBLIC API
  --------------------------------------------------------------- */

  function setPose(key) {
    init();
    var pose = POSES[key];
    if (!pose) return;
    bubbleEl.textContent = pose.bubble;
    var html = typeof pose.content === 'function' ? pose.content() : '';
    svgWrapEl.innerHTML =
      '<svg viewBox="0 0 210 175" xmlns="http://www.w3.org/2000/svg">' +
      html +
      '</svg>';
    guideEl.style.display = 'block';
  }

  function hide() {
    if (guideEl) guideEl.style.display = 'none';
  }

  window.TJGuide = { setPose: setPose, hide: hide };

  // Auto-init on DOM ready
  if (document.readyState !== 'loading') { init(); }
  else { document.addEventListener('DOMContentLoaded', init); }

}());

