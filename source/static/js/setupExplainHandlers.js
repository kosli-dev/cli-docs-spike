
const setupExplainHandlers = (scope, pairs) => {

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

  // ====================================================
  // When you click on an attestation

  const $$ = (selector) => {
    return $(selector, scope);
  };

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

  // ====================================================
  // When you click yml/commentary

  const setupHandler = (dee, dum, lp) => {
    //const kind = dee;
    $$(`.${dee} .${lp}`).hover(function() {
      const $line = $(this);
      const classes = $line.attr('class').split(/\s+/);
      $.each(classes, function(_index, name) {
        //console.log(`name=${name}`);
        if (!["line", "para", "lit", "n"].includes(name)) {
          //console.log(`name=${name} inside the if`);

          // Highlight attestation
          $attestations.removeClass('lit');
          $$(`.attest[data-name='${name}']`).addClass('lit');

          const highlight = (name, inner_kind, inner_lp) => {
            //console.log(`highlight(${name}, ${inner_kind})`);
            $$(`.${inner_kind} .${inner_lp}`).removeClass('lit');
            const nodes = $$(`.${inner_kind} .${name}`);
            //console.log(`count=${nodes.length}`);
            nodes.addClass('lit');
            if (inner_kind != dee) {
              // See NOTE: in scrollIntoView()
              const behaviour = (inner_kind == dum) ? "smooth" : "instant";
              scrollIntoView(nodes, behaviour);
            }
          };

          highlight(name, 'template-yml', 'line');
          highlight(name, 'template-yml-commentary', 'para');
          highlight(name, 'ci-yml', 'line');
          highlight(name, 'ci-yml-commentary', 'para');
        }
      });
    });
  };

  for (const [yml, commentary] of pairs) {
    //console.log(`yml=${yml}`);
    //console.log(`commentary=${commentary}`);
    setupHandler(yml, commentary, 'line');
    setupHandler(commentary, yml, 'para');
  }
};
