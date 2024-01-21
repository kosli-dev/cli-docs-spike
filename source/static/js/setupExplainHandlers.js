
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

      const highlight = (name, kind) => {
            $$(`.${kind} .line`).removeClass('lit');
            const nodes = $$(`.${kind} .${name}`);
            nodes.each(function() { $(this).addClass('lit'); });
            scrollIntoView(nodes, "instant");
      };

      // Highlight only that attestation
      $attestations.removeClass('lit');
      $attest.addClass('lit');

      // And the lines in the yml/commentary for that attestation
      const name = $attest.data("name");

      highlight(name, 'template-yml');
      highlight(name, 'template-yml-commentary');
      highlight(name, 'ci-yml');
      highlight(name, 'ci-yml-commentary');
    });
  });

  // ====================================================
  // When you click yml/commentary

  const setupHandler = (dee, dum) => {
    const kind = dee;
    $$(`.${kind} .line`).hover(function() {
      const $line = $(this);
      const classes = $line.attr('class').split(/\s+/);
      $.each(classes, function(_index, name) {
        //console.log(`name=${name}`);
        if (!["line", "lit", "n"].includes(name)) {
          //console.log(`name=${name} inside the if`);

          // Highlight attestation
          $attestations.removeClass('lit');
          $$(`.attest[data-name='${name}']`).addClass('lit');

          const highlight = (name, inner_kind) => {
            //console.log(`highlight(${name}, ${inner_kind})`);
            $$(`.${inner_kind} .line`).removeClass('lit');
            const nodes = $$(`.${inner_kind} .${name}`);
            //console.log(`count=${nodes.length}`);
            nodes.addClass('lit');
            if (inner_kind != kind) {
              // See NOTE: in scrollIntoView()
              const behaviour = (inner_kind == dum) ? "smooth" : "instant";
              scrollIntoView(nodes, behaviour);
            }
          };

          highlight(name, 'template-yml');
          highlight(name, 'template-yml-commentary');
          highlight(name, 'ci-yml');
          highlight(name, 'ci-yml-commentary');
        }
      });
    });
  };

  for (const [dee, dum] of pairs) {
    console.log(`dee=${dee}`);
    console.log(`dum=${dum}`);
    setupHandler(dee, dum);
    setupHandler(dum, dee);
  }
};
