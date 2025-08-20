function mab_active_deck() {
  let self = this;
  self.IsBuilt = false;

  self.ActiveDeckId = null;
  self.ActiveDeckName = "";
  self.ActiveDeckSize = null;

  self.ActiveDeckSizeLimit = null;

  self.ActiveDeck_SelectedCardCopyId = null;

  self.ActiveDeck_CardIds = [];

  self.loadReferences = () => {
    self.DOM = $("#dom-medieval-auto-battler");

    self.CardCopies_OrderedList = self.DOM.find(
      "#ol-active-mab-deck-card-copies-list"
    );

    self.DeckBalanceChart = self.DOM.find(
      "#canvas-active-mab-deck-deckbalance-chart"
    );

    self.Containers = [];
    self.Containers[self.Containers.length] = self.Containers.MainMenu =
      self.DOM.find("#container-mab-main-menu");
    self.Containers[self.Containers.length] = self.Containers.ActiveDeck =
      self.DOM.find("#container-mab-active-deck");
    self.Containers[self.Containers.length] = self.Containers.NewDeck =
      self.DOM.find("#container-mab-new-deck");

    self.DivSelect2_CardCopies = self.Containers.ActiveDeck.find(
      "#div-active-mab-deck-select-container"
    );

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.ShowActiveDeckContainer =
      self.DOM.find("#button-mab-active-deck-show-container");
    self.Buttons[self.Buttons.length] = self.Buttons.HideActiveDeckContainer =
      self.Containers.ActiveDeck.find("#button-mab-active-deck-hide-container");
    self.Buttons[self.Buttons.length] = self.Buttons.EditActiveDeckName =
      self.Containers.ActiveDeck.find("#button-mab-active-deck-edit-deck-name");
    self.Buttons[self.Buttons.length] =
      self.Buttons.EditActiveDeckName_Confirm = self.Containers.ActiveDeck.find(
        "#button-active-mab-deck-confirm-new-deck-name"
      );
    self.Buttons[self.Buttons.length] = self.Buttons.EditActiveDeckName_Cancel =
      self.Containers.ActiveDeck.find(
        "#button-mab-active-deck-cancel-deck-name-change"
      );
    self.Buttons[self.Buttons.length] =
      self.Buttons.AssignCardCopy_ToActiveDeck =
        self.Containers.ActiveDeck.find(
          "#button-mab-active-deck-assign-card-copy"
        );
    self.Buttons[self.Buttons.length] = self.Buttons.HideNewDeckContainer =
      self.Containers.NewDeck.find("#button-mab-new-deck-hide-container");

    self.Inputs = [];
    self.Inputs[self.Inputs.length] = self.Inputs.ActiveDeckName =
      self.Containers.ActiveDeck.find("#input-mab-active-deck-name");
    self.Inputs[self.Inputs.length] = self.Inputs.Select_ActiveDeckCardCopies =
      self.Containers.ActiveDeck.find(
        "#select-mab-active-deck-card-copies-list"
      );

    self.Fields = [];
    self.Fields[self.Fields.length] = self.Fields.ActiveDeckSize =
      self.Containers.ActiveDeck.find("#span-mab-active-deck-decksize");
    self.Fields[self.Fields.length] = self.Fields.ActiveDeckBalance =
      self.Containers.ActiveDeck.find("#span-mab-active-deck-deckbalance");
    self.Fields[self.Fields.length] = self.Fields.ActiveDeck_NeutralTypeCount =
      self.Containers.ActiveDeck.find(".strong-mab-decks-neutral-type-count");
    self.Fields[self.Fields.length] = self.Fields.ActiveDeck_RangedTypeCount =
      self.Containers.ActiveDeck.find(".span-mab-decks-ranged-type-count");
    self.Fields[self.Fields.length] = self.Fields.ActiveDeck_InfantryTypeCount =
      self.Containers.ActiveDeck.find(".span-mab-decks-cavalry-type-count");
    self.Fields[self.Fields.length] = self.Fields.ActiveDeck_InfantryTypeCount =
      self.Containers.ActiveDeck.find(".span-mab-decks-infantry-type-count");
  };

  self.loadEvents = () => {
    self.Buttons.ShowActiveDeckContainer.on("click", (e) => {
      e.preventDefault();

      self.mainMenu_HideContainer();

      self.activeDeck_ShowContainer();
    });
    self.Buttons.HideActiveDeckContainer.on("click", (e) => {
      e.preventDefault();

      self.activeDeck_HideContainer();

      self.mainMenu_ShowContainer();

      setTimeout(() => {
        self.refresh_InputsAndFieldsAndVariables();

        self.reset_EditDeckName_ButtonsAndInput();
      }, 300);
    });

    self.Buttons.EditActiveDeckName.on("click", (e) => {
      e.preventDefault();

      self.Inputs.ActiveDeckName.prop("readonly", false)
        .removeClass("current-data")
        .trigger("select");

      self.Buttons.EditActiveDeckName.prop("disabled", true);

      self.Buttons.EditActiveDeckName_Cancel.prop("disabled", false);

      self.Buttons.EditActiveDeckName_Confirm.prop("disabled", false);
    });
    self.Inputs.ActiveDeckName.on("input change", () => {
      self.checkFormFilling();
    });
    self.Buttons.EditActiveDeckName_Confirm.on("click", (e) => {
      e.preventDefault();

      self.ActiveDeck_EditDeckName();
    });
    self.Buttons.EditActiveDeckName_Cancel.on("click", (e) => {
      e.preventDefault();

      self.reset_EditDeckName_ButtonsAndInput();
    });

    // Binding the event after inserting into DOM
    $(document).on("click", ".button-unassign-mab-card-copy", function () {
      let index = $(this).data("index");
      let assignedMabCardCopyId = $(this).data("assigned-mab-card-copy-id");

      let mabDeckId = self.ActiveDeckId;

      self.ActiveDeck_UnassignCardCopy(index, assignedMabCardCopyId, mabDeckId);
    });
    self.Inputs.Select_ActiveDeckCardCopies.on("select2:select", function (e) {
      const selectedData = e.params.data;

      self.ActiveDeck_SelectedCardCopyId = null;

      self.ActiveDeck_SelectedCardCopyId = selectedData.id;
    });
    self.Buttons.AssignCardCopy_ToActiveDeck.on("click", (e) => {
      e.preventDefault();

      const mabDeckId = self.ActiveDeckId;
      const mabCardCopyId = self.ActiveDeck_SelectedCardCopyId;

      self.ActiveDeck_AssignCardCopy(mabDeckId, mabCardCopyId, true);
    });
  };

  self.sweetAlertSuccess = (title_text, message_text) => {
    Swal.fire({
      position: "center",
      confirmButtonText: "OK!",
      icon: "success",
      theme: "bulma",
      title: title_text,
      text: message_text || "",
      showConfirmButton: false,
      timer: 1500,
    });
  };
  self.sweetAlertError = (title_text, message_text) => {
    Swal.fire({
      position: "center",
      cancelButtonText: "close",
      icon: "error",
      theme: "bulma",
      title: title_text,
      text: message_text || "",
      showConfirmButton: false,
      showCancelButton: true,
      didOpen: () => {
        // Attach keydown listener
        document.addEventListener("keydown", self.closeOnAnyKey);
      },
      willClose: () => {
        // Clean up listener when modal closes
        document.removeEventListener("keydown", self.closeOnAnyKey);
      },
    });
  };
  self.closeOnAnyKey = () => {
    Swal.close();
  };

  self.toggleContainerVisibility = (div) => {
    self.Containers.forEach((container) => {
      container.addClass("hide-div");
    });

    div.hasClass("show-div")
      ? div.removeClass("show-div").addClass("hide-div")
      : div.removeClass("hide-div").addClass("show-div");
  };

  self.activeDeck_ShowContainer = () => {
    self.toggleContainerVisibility(self.Containers.ActiveDeck);

    self.ActiveDeck_ShowDeckDetails();
  };
  self.activeDeck_HideContainer = () => {
    self.toggleContainerVisibility(self.Containers.ActiveDeck);
  };

  self.refresh_InputsAndFieldsAndVariables = () => {
    self.ActiveDeckId = null;
    self.ActiveDeckName = "";

    self.ActiveDeckSize = 0;

    self.ActiveDeckSizeLimit = null;

    self.ActiveDeck_SelectedCardCopyId = null;

    self.ActiveDeck_CardIds = [];

    self.Inputs.ActiveDeckName.val();

    self.Fields.ActiveDeckSize.html();

    self.Fields.ActiveDeckBalance.html();

    self.CardCopies_OrderedList.empty();

    self.CardCopyList_Select2_Hide();
  };
  self.ActiveDeck_ShowDeckDetails = () => {
    $.ajax({
      type: "GET",
      url: `https://localhost:7081/users/showmabplayerdeckdetails`,
      xhrFields: { withCredentials: true },
      success: function (response) {
        if (!response.content) {
          self.sweetAlertError("Error", response.message);

          return;
        }

        self.refresh_InputsAndFieldsAndVariables();

        let activeDeck = response.content;
        let activeDeckId = activeDeck.activeMabDeckId;
        let activeDeckName = activeDeck.activeMabDeckName;
        let activeDeckSizeLimit = activeDeck.mabDeckSizeLimit;
        let activeMabCardCopies = activeDeck.mabCardCopies;
        let activeDeckCurrentSize = activeMabCardCopies.length;
        let countNeutralCardCopies = 0;
        let countRangedCardCopies = 0;
        let countCalvaryCardCopies = 0;
        let countInfantryCardCopies = 0;

        self.ActiveDeckId = activeDeckId;
        self.ActiveDeckName = activeDeckName;
        self.ActiveDeckSize = activeDeckCurrentSize;
        self.ActiveDeckSizeLimit = activeDeckSizeLimit;

        if (activeDeckCurrentSize < activeDeckSizeLimit) {
          self.ActiveDeck_LoadUnassignedCardCopies();
        }

        self.Inputs.ActiveDeckName.val(activeDeckName);

        self.Fields.ActiveDeckSize.html(
          `${activeDeckCurrentSize}/${activeDeckSizeLimit}`
        );

        activeMabCardCopies.forEach((mabCard) => {
          let cardType = mabCard.mabCardType;

          switch (cardType) {
            case "Neutral":
              countNeutralCardCopies++;
              break;
            case "Ranged":
              countRangedCardCopies++;
              break;
            case "Cavalry":
              countCalvaryCardCopies++;
              break;
            case "Infantry":
              countInfantryCardCopies++;
              break;
            default:
              sweetAlertError("Inform a valid action");
              break;
          }
        });

        self.Fields.ActiveDeck_NeutralTypeCount.html(countNeutralCardCopies);
        self.Fields.ActiveDeck_RangedTypeCount.html(countRangedCardCopies);
        self.Fields.ActiveDeck_InfantryTypeCount.html(countCalvaryCardCopies);
        self.Fields.ActiveDeck_InfantryTypeCount.html(countInfantryCardCopies);

        self.activeDeck_buildCardCopiesList(
          activeMabCardCopies,
          self.CardCopies_OrderedList
        );

        self.activeDeck_buildChart(
          countNeutralCardCopies,
          countRangedCardCopies,
          countCalvaryCardCopies,
          countInfantryCardCopies
        );
      },
      error: function (xhr, status, error) {
        self.sweetAlertError(
          "Failed to fetch active deck details. Try again later."
        );
      },
    });
  };
  self.ActiveDeck_EditDeckName = () => {
    let activeMabDeckNewName = self.Inputs.ActiveDeckName.val().trim();

    if (!activeMabDeckNewName || activeMabDeckNewName.length < 1) {
      self.sweetAlertError("Please fill the Mab Deck Name field!");

      return self.Inputs.ActiveDeckName.trigger("select");
    }

    if (
      activeMabDeckNewName.toLowerCase().trim() ===
      self.ActiveDeckName.toLowerCase().trim()
    ) {
      self.reset_EditDeckName_ButtonsAndInput();
      return;
    }

    $.ajax({
      type: "PUT",
      url: "https://localhost:7081/users/editactivemabdeckname",
      data: JSON.stringify({
        ActiveMabDeckNewName: activeMabDeckNewName,
      }),
      contentType: "application/json",
      xhrFields: {
        withCredentials: true,
      },
      success: (resp) => {
        if (!resp.content) {
          self.sweetAlertError(resp.message);
          return;
        }

        self.ActiveDeckName = self.Inputs.ActiveDeckName.val();

        self.sweetAlertSuccess(resp.message);

        self.reset_EditDeckName_ButtonsAndInput();
      },
      error: (err) => {
        self.sweetAlertError(err);
      },
      complete: () => {},
    });
  };

  self.checkFormFilling = () => {
    const inputValue = self.Inputs.ActiveDeckName.val().trim();

    if (inputValue.length === 0) {
      self.Buttons.EditActiveDeckName_Confirm.attr("disabled", true);
    } else {
      self.Buttons.EditActiveDeckName_Confirm.attr("disabled", false);
    }
  };
  self.reset_EditDeckName_ButtonsAndInput = () => {
    const deckName = self.Inputs.ActiveDeckName.val().trim();

    self.Inputs.ActiveDeckName.val("");

    setTimeout(() => {
      self.Inputs.ActiveDeckName.val(deckName)
        .prop("readonly", true)
        .addClass("current-data")
        .blur();
    }, 1);

    self.Buttons.EditActiveDeckName.prop("disabled", false);

    self.Buttons.EditActiveDeckName_Confirm.prop("disabled", true);

    self.Buttons.EditActiveDeckName_Cancel.prop("disabled", true);
  };

  self.activeDeck_buildCardCopiesList = (playerMabCardCopies, olDiv) => {
    playerMabCardCopies.forEach((card, Index) => {
      self.ActiveDeck_CardIds.push(card.mabCardId);

      let assignedMabCardCopyId = card.assignedMabCardCopyId;
      let mabCardName = card.mabCardName;
      let mabCardLvl = card.mabCardLevel;
      let mabCardType = card.mabCardType;
      let mabCardPower = card.mabCardPower;
      let mabCardUpperHand = card.mabCardUpperHand;

      let listItem = `
          <li id="li-mab-${Index}" data-assigned-mab-card-copy-id="${assignedMabCardCopyId}">
            <div class="d-flex flex-row align-items-center gap-2">
              <button
                class="button-unassign-mab-card-copy btn btn-outline-danger p-0 m-0"
                type="button"
                data-assigned-mab-card-copy-id="${assignedMabCardCopyId}"
                data-index="${Index}"
              >
                <i class="fa-solid fa-xmark p-1 m-0"></i>
              </button>

              <strong class="mab-card-name p-0 m-0">${mabCardName}</strong>

              <img
                src="/images/icons/io_arrow_right.svg"
                class="bi bi-arrow p-0 m-0"
              />

              <div class="mab-card-data">
                <span>L</span>evel: <strong>${mabCardLvl}</strong>,
                <span>T</span>ype: <strong>${mabCardType}</strong>,
                <span>P</span>ower: <strong>${mabCardPower}</strong>,
                <span>U</span>pper <span>H</span>and:
                <strong>${mabCardUpperHand}</strong>
              </div>
            </div>
          </li>
          `;

      olDiv.append(listItem);
    });
  };
  self.CardCopyList_Select2_Hide = () => {
    self.DivSelect2_CardCopies.removeClass("show-div").addClass("hide-div");
  };

  self.ActiveDeck_AssignCardCopy = (mabDeckId, mabCardCopyId) => {
    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/assignmabcardcopy",
      data: JSON.stringify({
        MabDeckId: mabDeckId,
        MabCardCopyId: mabCardCopyId,
      }),
      contentType: "application/json",
      xhrFields: {
        withCredentials: true,
      },
      success: (resp) => {
        if (!resp.content) {
          self.sweetAlertError("Failed to activated card", resp.message);
          return;
        }

        self.ActiveDeck_ShowDeckDetails();
      },
      error: (err) => {
        self.sweetAlertError(err);
      },
      complete: () => {},
    });
  };
  self.ActiveDeck_UnassignCardCopy = (index, assignedCardCopyId) => {
    self.ActiveDeck_CardIds.splice(index, 1);

    self.CardCopies_OrderedList.find(`#li-mab-${index}`).remove();

    $.ajax({
      type: "DELETE",
      url: "https://localhost:7081/users/unassignmabcardcopy",
      data: JSON.stringify({
        AssignedMabCardCopyId: assignedCardCopyId,
      }),
      contentType: "application/json",
      xhrFields: {
        withCredentials: true,
      },
      success: (resp) => {
        if (!resp.content) {
          self.sweetAlertError("Failed to deactivated card", resp.message);
          return;
        }

        self.ActiveDeck_ShowDeckDetails();
      },
      error: (err) => {
        self.sweetAlertError(err);
      },
      complete: () => {},
    });
  };
  self.activeDeck_buildChart = (countNtl, countRng, countCav, countInf) => {
    let dynamicLabel = [];
    let countTypes = [];

    if (countNtl >= 0) {
      dynamicLabel.push("Neutral");
      countTypes.push(countNtl);
    }
    if (countRng >= 0) {
      dynamicLabel.push("Ranged");
      countTypes.push(countRng);
    }
    if (countCav >= 0) {
      dynamicLabel.push("Cavalry");
      countTypes.push(countCav);
    }
    if (countInf >= 0) {
      dynamicLabel.push("Infantry");
      countTypes.push(countInf);
    }

    const rootStyles = getComputedStyle(document.documentElement);

    const chartData = {
      labels: [...dynamicLabel],
      datasets: [
        {
          label: "Cards count",
          data: [...countTypes],
          borderWidth: 1,
          backgroundColor: [
            rootStyles.getPropertyValue("--text-color"),
            rootStyles.getPropertyValue("--greenish"),
            rootStyles.getPropertyValue("--yellowish"),
            rootStyles.getPropertyValue("--reddish"),
          ],
          borderColor: rootStyles.getPropertyValue("--second-bg-color"),
          borderWidth: 1,
          hoverBorderColor: rootStyles.getPropertyValue("--text-color"),
          hoverBorderWidth: 3,
          hoverOffset: 60,
        },
      ],
    };

    const angleLines = {
      id: "angleLines",
      afterDatasetsDraw(chart) {
        const {
          ctx,
          scales: { r },
        } = chart;
        const xCenter = r.xCenter;
        const yCenter = r.yCenter;
        const drawingArea = r.drawingArea;

        chart.getDatasetMeta(0).data.forEach((dataPoint) => {
          ctx.save();
          ctx.translate(xCenter, yCenter);
          ctx.rotate(dataPoint.endAngle + Math.PI * 0.5);
          ctx.beginPath();
          ctx.strokeStyle = rootStyles.getPropertyValue("--second-bg-color");
          ctx.lineWidth = 15;
          ctx.moveTo(0, 0);
          ctx.lineTo(0, -drawingArea - 50);
          ctx.stroke();
          ctx.restore();
        });
      },
    };

    const chartConfigs = {
      type: "polarArea",
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false, // hides default chart legend
          },

          tooltip: {
            enabled: true,
            position: "customTop",
            backgroundColor: rootStyles.getPropertyValue("--second-bg-color"),
            borderColor: rootStyles.getPropertyValue("--text-color"),
            borderWidth: 1,
            padding: 10,
            caretSize: 0,
            cornerRadius: 5,
            titleFont: {
              family: "Anta",
              size: 16,
              weight: "bold",
            },
            bodyColor: rootStyles.getPropertyValue("--text-color"),
            bodyFont: {
              family: "Anta",
              size: 14,
              weight: "normal",
            },
            callbacks: {
              label: function (context) {
                return `Cards count: ${context.formattedValue}`;
              },

              beforeTitle: function (tooltipItems) {
                const colors = [
                  rootStyles.getPropertyValue("--text-color"),
                  rootStyles.getPropertyValue("--greenish"),
                  rootStyles.getPropertyValue("--yellowish"),
                  rootStyles.getPropertyValue("--reddish"),
                ];
                const index =
                  tooltipItems[0].dataIndex !== undefined
                    ? tooltipItems[0].dataIndex
                    : 0;

                // Set the titleColor dynamically
                this.options.titleColor = colors[index] || colors[0];

                return []; // Return empty array to prevent duplication
              },
            },
          },
        },
        scales: {
          r: {
            afterTickToLabelConversion: (ctx) => {
              ctx.ticks = ctx.ticks.filter((tick) => tick.value >= -1);
            },
            min: 0,
            max: self.ActiveDeckSizeLimit,
            grid: {
              display: true,
              color: rootStyles.getPropertyValue("--second-bg-color"),
              lineWidth: 15,
            },
            ticks: {
              display: true,
              color: rootStyles.getPropertyValue("--text-color"),
              stepSize: 1,
              showLabelBackdrop: true,
              backdropPadding: { x: 1, y: 1 },
              backdropColor: "rgb( 51, 58, 72)",
              backdropBorderColor: rootStyles.getPropertyValue("--text-color"),
              tickBorderDash: 50,
              z: 99,
              font: {
                family: "Anta",
                size: 15,
                weight: "bold",
              },
            },
            border: {
              dash: [50, 0], // dashed line pattern
            },

            pointLabels: {
              display: true,
              color: function (context) {
                // context.index gives the label index
                const colors = [
                  rootStyles.getPropertyValue("--text-color"),
                  rootStyles.getPropertyValue("--greenish"),
                  rootStyles.getPropertyValue("--yellowish"),
                  rootStyles.getPropertyValue("--reddish"),
                ];
                return colors[context.index % colors.length];
              },
              centerPointLabels: true,
              font: {
                family: "Anta",
                size: 15,
                weight: "bold",
              },
            },
          },
        },
        layout: {
          padding: 100,
        },
      },
      plugins: [
        angleLines,
        {
          id: "customTopTooltip",
          beforeInit(chart, args, options) {
            // Register a new positioner
            Chart.Tooltip.positioners.customTop = function (
              elements,
              eventPosition
            ) {
              return {
                x: chart.chartArea.left,
                y: chart.chartArea.top - 20,
              };
            };
          },
        },
      ],
    };

    if (self.MabDeckBalanceChartInstance) {
      self.MabDeckBalanceChartInstance.destroy();
    }
    self.MabDeckBalanceChartInstance = new Chart(
      self.DeckBalanceChart,
      chartConfigs
    );
  };
  self.ActiveDeck_LoadUnassignedCardCopies = () => {
    if (
      self.Inputs.Select_ActiveDeckCardCopies.hasClass(
        "select2-hidden-accessible"
      )
    ) {
      self.Inputs.Select_ActiveDeckCardCopies.select2("destroy");
    }

    const mabDeckId = self.ActiveDeckId;

    // Fetch the mab player cards and their count from the backend
    fetch(
      `https://localhost:7081/users/listunassignedmabcardcopies?MabDeckId=${mabDeckId}`,
      {
        method: "GET",
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.content) {
          sweetAlertError("Failed to load mab player cards:", data.message);
          return;
        }

        const mabPlayerCards = data.content.map((item) => ({
          id: item.mabCardCopyId,
          text: item.mabCardDescription,
        }));

        // Clear previous options and add empty one
        self.Inputs.Select_ActiveDeckCardCopies.empty().append(
          `<option></option>`
        );

        // Builds select2
        self.Inputs.Select_ActiveDeckCardCopies.select2({
          data: mabPlayerCards,
          dropdownParent: self.DOM,
          placeholder: "Select a card",
          allowClear: true,
          theme: "classic",
          width: "100%",
          templateSelection: (data) => {
            if (!data.id) return data.text;
            return $("<strong>").text(data.text);
          },
        });

        // Opens select2
        self.Inputs.Select_ActiveDeckCardCopies.trigger("change").select2(
          "open"
        );
      })
      .catch((err) => {
        sweetAlertError("Error fetching mab player cards:", err);
      });

    self.DivSelect2_CardCopies.removeClass("hide-div").addClass("show-div");
  };

  self.mainMenu_ShowContainer = () => {
    self.toggleContainerVisibility(self.Containers.MainMenu);
  };
  self.mainMenu_HideContainer = () => {
    self.toggleContainerVisibility(self.Containers.MainMenu);
  };

  self.build = () => {
    self.loadReferences();
    self.loadEvents();
  };

  self.build();
}

$(function () {
  new mab_active_deck();
});
