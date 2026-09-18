import sharp from "sharp";

const P = { green:"#0a6a39", deep:"#0a5135", ink:"#141816", cream:"#faf8f4", sage:"#e7efe9", sand:"#efe9e2", mist:"#f4f8f5" };

// Open Graph (text is appropriate here)
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${P.deep}"/><stop offset="1" stop-color="${P.green}"/></linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <g fill="none" stroke="#ffffff" stroke-opacity="0.13" stroke-width="1.5">
    <circle cx="980" cy="150" r="230"/><circle cx="980" cy="150" r="150"/>
  </g>
  <text x="88" y="250" font-family="Georgia, serif" font-size="66" fill="#ffffff">Gebelik &#38; Do&#287;um</text>
  <text x="88" y="336" font-family="Georgia, serif" font-size="66" fill="#ffffff" fill-opacity="0.82">TUSA Hastanesi</text>
  <rect x="88" y="392" width="86" height="3" fill="#ffffff" fill-opacity="0.55"/>
  <text x="88" y="466" font-family="Helvetica, Arial, sans-serif" font-size="27" fill="#ffffff" fill-opacity="0.80">Gebelik takibi, do&#287;um planlamas&#305; ve do&#287;um sonras&#305; takip</text>
  <text x="88" y="512" font-family="Helvetica, Arial, sans-serif" font-size="27" fill="#ffffff" fill-opacity="0.60">Tuzla / &#304;stanbul &#183; 0216 581 42 00</text>
</svg>`;
await sharp(Buffer.from(og)).jpeg({ quality: 88 }).toFile("public/images/og.jpg");
console.log("wrote og.jpg");
