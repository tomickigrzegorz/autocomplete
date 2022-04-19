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
          .replace(/[\u0300-\u036f]/g, "");
        return elementNormalize.match(new RegExp(currentValue, "i"));
      });
  },

  onResults: ({ matches }) =>
    matches.map((el) => `<li>${el.name}</li>`).join(""),
});
