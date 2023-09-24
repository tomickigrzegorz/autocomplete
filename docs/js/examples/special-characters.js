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
        const elementNormalize = element.name
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "");

        const currentValueNormalize = currentValue
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "");

        return elementNormalize.match(new RegExp(currentValueNormalize, "i"));
      });
  },

  onResults: ({ matches }) =>
    matches.map((el) => `<li>${el.name}</li>`).join(""),
});
