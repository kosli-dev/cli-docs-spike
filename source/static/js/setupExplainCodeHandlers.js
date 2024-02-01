
var setupExplainCodeHandlers = (scope, codePairs) => {

  // Helpers

  const scrollIntoView = (nodes, behaviour) => {
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
    if (nodes.length > 0) {
      const $first = nodes.first();
      // NOTE: Multiple behaviour:"smooth") calls cause problems.
      // Eg see https://bugs.chromium.org/p/chromium/issues/detail?id=1142270
      // The calling code must pass only _one_ behaviour="smooth"
      $first.get(0).scrollIntoView({
        behavior: behaviour, // See NOTE
        block: "center",     // Vertical
        inline: "start"      // Horizontal
      });
    }
  };

  const $$ = (selector) => {
    return $(selector, scope);
  };

  // -----------------------------------------------
  // When you click on an attestation

  const $attestations = $$(".attest");

  $attestations.each(function() {
    const $attest = $(this);
    $attest.hover(function() {

      const highlight = (kind, lp, name) => {
        $$(`.${kind} .${lp}`).removeClass('lit');
        const nodes = $$(`.${kind} .${name}`);
        nodes.each(function() { $(this).addClass('lit'); });
        scrollIntoView(nodes, "instant");
      };

      // Highlight only that attestation
      $attestations.removeClass('lit');
      $attest.addClass('lit');

      // And the lines in the code/commentary for that attestation
      const name = $attest.data("name");

      for (const [code, commentary] of codePairs) {
        highlight(code, 'line', name);
        highlight(commentary, 'para', name);
      }
    });
  });

  // -----------------------------------------------
  // When you click code/commentary

  const setupHandler = (dee, dum, lp) => {
    $$(`.${dee} .${lp}`).hover(function() {
      const $line = $(this);
      const classes = $line.attr('class').split(/\s+/);
      $.each(classes, function(_index, cssName) {
        if (!["line", "para", "lit", "n"].includes(cssName)) {

          // Highlight the attestation
          $attestations.removeClass('lit');
          $$(`.attest[data-name='${cssName}']`).addClass('lit');

          const highlight = (inner_kind, inner_lp) => {
            $$(`.${inner_kind} .${inner_lp}`).removeClass('lit');
            const nodes = $$(`.${inner_kind} .${cssName}`);
            nodes.addClass('lit');
            if (inner_kind != dee) {
              // See NOTE: in scrollIntoView()
              const behaviour = (inner_kind == dum) ? "smooth" : "instant";
              scrollIntoView(nodes, behaviour);
            }
          };

          // Highlight all code/commentary
          for (const [code, commentary] of codePairs) {
            highlight(code, 'line');
            highlight(commentary, 'para');
          }
        }
      });
    });
  };

  for (const [code, commentary] of codePairs) {
    // Auto-scroll commentary from code
    setupHandler(code, commentary, 'line');
    // Auto-scroll commentary to code
    setupHandler(commentary, code, 'para');
  }
};
