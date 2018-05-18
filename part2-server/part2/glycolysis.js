document.addEventListener("DOMContentLoaded", function() {
  var cy = cytoscape({
    container: document.getElementById("cy"),
    elements: GlyElements,
    style: [
      {
        selector: "node",
        style: {
          label: "data(molecule)",
          width: "200px",
          height: "200px",
          color: "blue",
          "font-size": "26px",
          "text-halign": "right",
          "text-valign": "center",
          "background-opacity": 0,
          "background-image": "data(image)",
          "background-fit": "contain",
          "background-clip": "none"
        }
      },
      {
        selector: "edge",
        style: {
          "curve-style": "bezier",
          label: "data(enzyme)",
          "text-background-color": "yellow",
          "text-background-opacity": 0.4,
          width: "6px",
          "target-arrow-shape": "triangle",
          "control-point-step-size": "140px"
        }
      }
    ],

    layout: {
      name: "grid",
      fit: false,
      columns: 2,
      avoidOverlap: true,
      avoidOverlapPadding: 80,
      position: function(ele) {
        if (ele.data("molecule") === "DHAP") {
          return { row: ele.id() - 1, col: 1 };
        }
        return { row: ele.id(), col: 0 };
      }
    }
  });

  cy.autolock(true);

  function panIn(target) {
    cy.animate({
      fit: {
        eles: target,
        padding: 200
      },
      duration: 700,
      easing: "ease",
      queue: true
    });
  }

  function findSucessor(selected) {
    var connectedNodes;
    if (selected.isEdge()) {
      connectedNodes = selected.target();
    } else {
      connectedNodes = selected.outgoers().nodes();
    }
    var sucessor = connectedNodes.max(function(ele) {
      return Number(ele.id());
    });
    return sucessor.ele;
  }

  function advanceByButton(previous) {
    previous.unselect();
    var nextSelect = findSucessor(previous);
    if (previous.id() === cy.nodes("#6").id()) {
      nextSelect = cy.nodes("#0");
    }
    nextSelect.select();
    panIn(nextSelect);
  }

  var advanceButton = document.getElementById("advance");
  advanceButton.addEventListener("click", function() {
    var previous = cy.$(":selected");
    advanceByButton(previous);
  });

  cy.on("tap", "node", function(event) {
    // acts as advanceByButton for manually selected nodes
    var target = event.target;
    cy.nodes().unselect();
    target.select();
    panIn(target);
    // open Wikipedia for node info
    window.open(target.data("url"));
  });

  var startNode = cy.$('node[molecule = "Glucose"]');
  startNode.select();
  panIn(startNode);
});
