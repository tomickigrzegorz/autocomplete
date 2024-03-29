new Autocomplete("special-characters", {
  onSearch: ({ currentValue }) => {
    // local data
    const data = [
      { name: "Jörn Zaefferer" },
      { name: "Scott González" },
      { name: "Emmaline Köhler" },
      { name: "Marlene Möller" },
      { name: "Aloïs Jäger" },
      { name: "Haydn Günther" },
      { name: "Gertrude Kühn" },
    ];
    return data
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((element) => {
        // https://stackoverflow.com/a/37511463/10424385
        const elementNormalize = ConvertToAscii(element.name);
        const currentValueNormalize = ConvertToAscii(currentValue);

        return elementNormalize.match(new RegExp(currentValueNormalize, "i"));
      });
  },

  onResults: ({ matches }) =>
    matches.map((el) => `<li>${el.name}</li>`).join(""),
});

/**
 * Convert to ascii
 *
 * @param {String} string
 */
function ConvertToAscii(string) {
  // prettier-ignore
  const unicodeToAsciiMap = {
    Ⱥ: "A", Æ: "AE", Ꜻ: "AV", Ɓ: "B", Ƀ: "B", Ƃ: "B", Ƈ: "C", Ȼ: "C", Ɗ: "D", ǲ: "D", ǅ: "D", Đ: "D", Ƌ: "D", Ǆ: "DZ", Ɇ: "E", Ꝫ: "ET", Ƒ: "F", Ɠ: "G", Ǥ: "G", Ⱨ: "H", Ħ: "H", Ɨ: "I", Ꝺ: "D", Ꝼ: "F", Ᵹ: "G", Ꞃ: "R", Ꞅ: "S", Ꞇ: "T", Ꝭ: "IS", Ɉ: "J", Ⱪ: "K", Ꝃ: "K", Ƙ: "K", Ꝁ: "K", Ꝅ: "K", Ƚ: "L", Ⱡ: "L", Ꝉ: "L", Ŀ: "L", Ɫ: "L", ǈ: "L", Ł: "L", Ɱ: "M", Ɲ: "N", Ƞ: "N", ǋ: "N", Ꝋ: "O", Ꝍ: "O", Ɵ: "O", Ø: "O", Ƣ: "OI", Ɛ: "E", Ɔ: "O", Ȣ: "OU", Ꝓ: "P", Ƥ: "P", Ꝕ: "P", Ᵽ: "P", Ꝑ: "P", Ꝙ: "Q", Ꝗ: "Q", Ɍ: "R", Ɽ: "R", Ꜿ: "C", Ǝ: "E", Ⱦ: "T", Ƭ: "T", Ʈ: "T", Ŧ: "T", Ɐ: "A", Ꞁ: "L", Ɯ: "M", Ʌ: "V", Ꝟ: "V", Ʋ: "V", Ⱳ: "W", Ƴ: "Y", Ỿ: "Y", Ɏ: "Y", Ⱬ: "Z", Ȥ: "Z", Ƶ: "Z", Œ: "OE", ᴀ: "A", ᴁ: "AE", ʙ: "B", ᴃ: "B", ᴄ: "C", ᴅ: "D", ᴇ: "E", ꜰ: "F", ɢ: "G", ʛ: "G", ʜ: "H", ɪ: "I", ʁ: "R", ᴊ: "J", ᴋ: "K", ʟ: "L", ᴌ: "L", ᴍ: "M", ɴ: "N", ᴏ: "O", ɶ: "OE", ᴐ: "O", ᴕ: "OU", ᴘ: "P", ʀ: "R", ᴎ: "N", ᴙ: "R", ꜱ: "S", ᴛ: "T", ⱻ: "E", ᴚ: "R", ᴜ: "U", ᴠ: "V", ᴡ: "W", ʏ: "Y", ᴢ: "Z", ᶏ: "a", ẚ: "a", ⱥ: "a", æ: "ae", ꜻ: "av", ɓ: "b", ᵬ: "b", ᶀ: "b", ƀ: "b", ƃ: "b", ɵ: "o", ɕ: "c", ƈ: "c", ȼ: "c", ȡ: "d", ɗ: "d", ᶑ: "d", ᵭ: "d", ᶁ: "d", đ: "d", ɖ: "d", ƌ: "d", ı: "i", ȷ: "j", ɟ: "j", ʄ: "j", ǆ: "dz", ⱸ: "e", ᶒ: "e", ɇ: "e", ꝫ: "et", ƒ: "f", ᵮ: "f", ᶂ: "f", ɠ: "g", ᶃ: "g", ǥ: "g", ⱨ: "h", ɦ: "h", ħ: "h", ƕ: "hv", ᶖ: "i", ɨ: "i", ꝺ: "d", ꝼ: "f", ᵹ: "g", ꞃ: "r", ꞅ: "s", ꞇ: "t", ꝭ: "is", ʝ: "j", ɉ: "j", ⱪ: "k", ꝃ: "k", ƙ: "k", ᶄ: "k", ꝁ: "k", ꝅ: "k", ƚ: "l", ɬ: "l", ȴ: "l", ⱡ: "l", ꝉ: "l", ŀ: "l", ɫ: "l", ᶅ: "l", ɭ: "l", ł: "l", ſ: "s", ẜ: "s", ẝ: "s", ɱ: "m", ᵯ: "m", ᶆ: "m", ȵ: "n", ɲ: "n", ƞ: "n", ᵰ: "n", ᶇ: "n", ɳ: "n", ꝋ: "o", ꝍ: "o", ⱺ: "o", ø: "o", ƣ: "oi", ɛ: "e", ᶓ: "e", ɔ: "o", ᶗ: "o", ȣ: "ou", ꝓ: "p", ƥ: "p", ᵱ: "p", ᶈ: "p", ꝕ: "p", ᵽ: "p", ꝑ: "p", ꝙ: "q", ʠ: "q", ɋ: "q", ꝗ: "q", ɾ: "r", ᵳ: "r", ɼ: "r", ᵲ: "r", ᶉ: "r", ɍ: "r", ɽ: "r", ↄ: "c", ꜿ: "c", ɘ: "e", ɿ: "r", ʂ: "s", ᵴ: "s", ᶊ: "s", ȿ: "s", ɡ: "g", ᴑ: "o", ᴓ: "o", ᴝ: "u", ȶ: "t", ⱦ: "t", ƭ: "t", ᵵ: "t", ƫ: "t", ʈ: "t", ŧ: "t", ᵺ: "th", ɐ: "a", ᴂ: "ae", ǝ: "e", ᵷ: "g", ɥ: "h", ʮ: "h", ʯ: "h", ᴉ: "i", ʞ: "k", ꞁ: "l", ɯ: "m", ɰ: "m", ᴔ: "oe", ɹ: "r", ɻ: "r", ɺ: "r", ⱹ: "r", ʇ: "t", ʌ: "v", ʍ: "w", ʎ: "y", ᶙ: "u", ᵫ: "ue", ꝸ: "um", ⱴ: "v", ꝟ: "v", ʋ: "v", ᶌ: "v", ⱱ: "v", ⱳ: "w", ᶍ: "x", ƴ: "y", ỿ: "y", ɏ: "y", ʑ: "z", ⱬ: "z", ȥ: "z", ᵶ: "z", ᶎ: "z", ʐ: "z", ƶ: "z", ɀ: "z", œ: "oe", ₓ: "x"
  };
  const stringWithoutAccents = string
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
  return stringWithoutAccents.replace(
    /[^\u0000-\u007E]/g,
    (character) => unicodeToAsciiMap[character] || "",
  );
}
