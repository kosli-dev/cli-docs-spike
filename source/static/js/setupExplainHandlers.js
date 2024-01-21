
var setupExplainHandlers = (scope) => {

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

  // When you click on an attestation

  const $attestations = $$(".attest");

  $attestations.each(function() {
    const $attest = $(this);
    $attest.hover(function() {

      const highlight = (name, kind, lp) => {
        $$(`.${kind} .${lp}`).removeClass('lit');
        const nodes = $$(`.${kind} .${name}`);
        nodes.each(function() { $(this).addClass('lit'); });
        scrollIntoView(nodes, "instant");
      };

      // Highlight only that attestation
      $attestations.removeClass('lit');
      $attest.addClass('lit');

      // And the lines in the yml/commentary for that attestation
      const name = $attest.data("name");

      highlight(name, 'template-yml', 'line');
      highlight(name, 'template-yml-commentary', 'para');
      highlight(name, 'ci-yml', 'line');
      highlight(name, 'ci-yml-commentary', 'para');
    });
  });

  // When you click yml/commentary

  const setupHandler = (dee, dum, lp) => {
    $$(`.${dee} .${lp}`).hover(function() {
      const $line = $(this);
      const classes = $line.attr('class').split(/\s+/);
      $.each(classes, function(_index, name) {
        if (!["line", "para", "lit", "n"].includes(name)) {

          // Highlight the attestation
          $attestations.removeClass('lit');
          $$(`.attest[data-name='${name}']`).addClass('lit');

          const highlight = (name, inner_kind, inner_lp) => {
            $$(`.${inner_kind} .${inner_lp}`).removeClass('lit');
            const nodes = $$(`.${inner_kind} .${name}`);
            nodes.addClass('lit');
            if (inner_kind != dee) {
              // See NOTE: in scrollIntoView()
              const behaviour = (inner_kind == dum) ? "smooth" : "instant";
              scrollIntoView(nodes, behaviour);
            }
          };

          // Highlight all yml/commentary
          highlight(name, 'template-yml', 'line');
          highlight(name, 'template-yml-commentary', 'para');
          highlight(name, 'ci-yml', 'line');
          highlight(name, 'ci-yml-commentary', 'para');
        }
      });
    });
  };

  const pairs = [
    ["template-yml", "template-yml-commentary"],
    ["ci-yml", "ci-yml-commentary"]
  ]
  for (const [yml, commentary] of pairs) {
    // Auto-scroll from lhs yml content to rhs commentary
    setupHandler(yml, commentary, 'line');
    // Auto-scroll from rhs commentary to lhs yml
    setupHandler(commentary, yml, 'para');
  }
};
