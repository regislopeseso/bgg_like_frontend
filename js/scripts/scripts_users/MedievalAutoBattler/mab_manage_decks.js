function mab_manage_decks() {
  let self = this;

  self.IsBuilt = false;

  self.ActiveDeckId = null;
  self.ActiveDeckName = "";
  self.ActiveDeckSize = null;
  self.ActiveDeckSizeLimit = null;
  self.ActiveDeck_SelectedPlayerCardId = null;
  self.ActiveDeck_AssignedCardIds = [];

  self.NewDeckId = null;
  self.NewDeckName = "";
  self.EditedDeckName = "";
  self.NewDeckSize = null;
  self.NewDeckSizeLimit = null;
  self.NewDeck_SelectedCardCopyId = null;
  self.NewDeck_CardIds = [];

  self.general_LoadReferences = () => {
    self.DOM = $("#dom-medieval-auto-battler");

    self.Containers = [];
    self.Containers[self.Containers.length] = self.Containers.MainMenu =
      self.DOM.find("#container-mab-main-menu");

    self.OrderedLists = [];
    self.Blocks = [];
    self.Fields = [];
    self.Buttons = [];
    self.Inputs = [];
    self.Selects = [];
    self.Fields = [];
  };
  self.activeDeck_LoadReferences = () => {
    self.Containers[self.Containers.length] = self.Containers.ActiveDeck =
      self.DOM.find("#container-mab-active-deck");

    self.OrderedLists[self.OrderedLists.length] =
      self.OrderedLists.ActiveDeck_AssignedCards =
        self.Containers.ActiveDeck.find("#ol-mab-active-deck-assigned-cards");

    self.Blocks[self.Blocks.length] = self.Blocks.ActiveDeck_Select_Decks =
      self.Containers.ActiveDeck.find("#block-select-mab-active-deck-decks");
    self.Blocks[self.Blocks.length] =
      self.Blocks.ActiveDeck_Select_UnassignedPlayerCards =
        self.Containers.ActiveDeck.find(
          "#block-select-mab-active-deck-unassigned-player-cards"
        );

    self.Buttons[self.Buttons.length] = self.Buttons.ActiveDeck_ShowContainer =
      self.DOM.find("#button-mab-active-deck-show-container");
    self.Buttons[self.Buttons.length] = self.Buttons.ActiveDeck_HideContainer =
      self.Containers.ActiveDeck.find("#button-mab-active-deck-hide-container");
    self.Buttons[self.Buttons.length] = self.Buttons.ActiveDeck_DeleteDeck =
      self.Containers.ActiveDeck.find("#button-mab-active-deck-delete-deck");
    self.Buttons[self.Buttons.length] = self.Buttons.ActiveDeck_ChangeName =
      self.Containers.ActiveDeck.find("#button-mab-active-deck-change-name");

    self.Inputs[self.Inputs.length] = self.Inputs.ActiveDeck_DeckName =
      self.Containers.ActiveDeck.find("#input-mab-active-deck-deckname");

    self.Selects[self.Selects.length] = self.Selects.ActiveDeck_Decks =
      self.Containers.ActiveDeck.find("#select-mab-active-deck-decks");
    self.Selects[self.Selects.length] =
      self.Selects.ActiveDeck_UnassignedPlayerCards =
        self.Containers.ActiveDeck.find(
          "#select-mab-active-deck-unassigned-player-cards"
        );

    self.Fields = [];
    self.Fields[self.Fields.length] = self.Fields.ActiveDeck_DeckLevel =
      self.Containers.ActiveDeck.find("#span-mab-active-deck-decklevel");
    self.Fields[self.Fields.length] = self.Fields.ActiveDeck_DeckSize =
      self.Containers.ActiveDeck.find("#span-mab-active-deck-decksize");
    self.Fields[self.Fields.length] = self.Fields.ActiveDeck_DeckBalance =
      self.Containers.ActiveDeck.find("#span-mab-active-deck-deckbalance");
    self.Fields[self.Fields.length] = self.Fields.ActiveDeck_NeutralTypeCount =
      self.Containers.ActiveDeck.find(".strong-mab-decks-neutral-type-count");
    self.Fields[self.Fields.length] = self.Fields.ActiveDeck_RangedTypeCount =
      self.Containers.ActiveDeck.find(".span-mab-decks-ranged-type-count");
    self.Fields[self.Fields.length] = self.Fields.ActiveDeck_CavalryTypeCount =
      self.Containers.ActiveDeck.find(".span-mab-decks-cavalry-type-count");
    self.Fields[self.Fields.length] = self.Fields.ActiveDeck_InfantryTypeCount =
      self.Containers.ActiveDeck.find(".span-mab-decks-infantry-type-count");

    self.ActiveDeck_DeckBalanceChart = self.Containers.ActiveDeck.find(
      "#canvas-active-mab-deck-deckbalance-chart"
    );
  };
  self.createDeck_LoadReferences = () => {
    self.Containers[self.Containers.length] = self.Containers.CreateDeck =
      self.DOM.find("#container-mab-create-deck");

    self.OrderedLists[self.OrderedLists.length] =
      self.OrderedLists.CreateDeck_AssignedCards =
        self.Containers.CreateDeck.find("#ol-mab-create-deck-player-cards");

    self.Blocks[self.Blocks.length] =
      self.Blocks.CreateDeck_Select_UnassignedPlayerCards =
        self.Containers.CreateDeck.find(
          "#block-select-mab-create-deck-unassigned-player-cards"
        );

    self.Buttons[self.Buttons.length] = self.Buttons.CreateDeck_ShowContainer =
      self.Containers.ActiveDeck.find("#button-mab-create-deck-show-container");
    self.Buttons[self.Buttons.length] = self.Buttons.CreateDeck_HideContainer =
      self.Containers.CreateDeck.find("#button-mab-create-deck-hide-container");
    self.Buttons[self.Buttons.length] = self.Buttons.CreateDeck_Confirm =
      self.Containers.CreateDeck.find("#button-mab-create-deck-confirm");
    self.Buttons[self.Buttons.length] =
      self.Buttons.CreateDeck_ConfirmAndActivateDeck =
        self.Containers.CreateDeck.find(
          "#button-mab-create-deck-activate-deck"
        );

    self.Inputs[self.Inputs.length] = self.Inputs.CreateDeck_DeckName =
      self.Containers.CreateDeck.find("#input-mab-create-deck-deckname");

    self.Selects[self.Selects.length] =
      self.Selects.CreateDeck_UnassignedPlayerCards =
        self.Containers.CreateDeck.find(
          "#select-mab-create-deck-player-cards-list"
        );

    self.Fields[self.Fields.length] = self.Fields.CreateDeck_DeckLevel =
      self.Containers.CreateDeck.find("#span-mab-create-deck-decklevel");
    self.Fields[self.Fields.length] = self.Fields.CreateDeck_DeckSize =
      self.Containers.CreateDeck.find("#span-mab-create-deck-decksize");
    self.Fields[self.Fields.length] = self.Fields.CreateDeck_DeckBalance =
      self.Containers.CreateDeck.find("#span-mab-create-deck-deckbalance");
    self.Fields[self.Fields.length] = self.Fields.CreateDeck_NeutralTypeCount =
      self.Fields.CreateDeck_DeckBalance.find(
        ".strong-mab-decks-neutral-type-count"
      );
    self.Fields[self.Fields.length] = self.Fields.CreateDeck_RangedTypeCount =
      self.Fields.CreateDeck_DeckBalance.find(
        ".span-mab-decks-ranged-type-count"
      );
    self.Fields[self.Fields.length] = self.Fields.CreateDeck_CavalryTypeCount =
      self.Fields.CreateDeck_DeckBalance.find(
        ".span-mab-decks-cavalry-type-count"
      );
    self.Fields[self.Fields.length] = self.Fields.CreateDeck_InfantryTypeCount =
      self.Fields.CreateDeck_DeckBalance.find(
        ".span-mab-decks-infantry-type-count"
      );
  };

  self.activeDeck_LoadEvents = () => {
    self.Buttons.ActiveDeck_ShowContainer.on("click", (e) => {
      e.preventDefault();

      self.mainMenu_HideContainer();

      self.ActiveDeck_ShowDeckDetails(true);
    });
    self.Buttons.ActiveDeck_HideContainer.on("click", (e) => {
      e.preventDefault();

      self.activeDeck_HideContainer();

      self.mainMenu_ShowContainer();

      setTimeout(() => {
        self.activeDeck_Refresh_InputsAndFieldsAndVariables();
      }, 300);
    });

    self.Buttons.ActiveDeck_ChangeName.on("click", (e) => {
      e.preventDefault();
      self.ActiveDeck_EditDeckName();
    });
    self.Inputs.ActiveDeck_DeckName.on("input change", () => {
      self.checkFormFilling();
    });

    // Binding the event after inserting into DOM
    $(document).on(
      "click",
      ".button-mab-active-deck-unassign-player-card",
      function () {
        let index = $(this).data("index");

        let assignedCardId = $(this).data("mab-active-deck-assigned-card-id");

        self.ActiveDeck_UnassignPlayerCard(index, assignedCardId);
      }
    );
    self.Selects.ActiveDeck_UnassignedPlayerCards.on("select2:select", (e) => {
      const selectedData = e.params.data;

      self.ActiveDeck_SelectedPlayerCardId = null;

      self.ActiveDeck_SelectedPlayerCardId = selectedData.id;

      self.ActiveDeck_AssignPlayerCard(
        self.ActiveDeckId,
        self.ActiveDeck_SelectedPlayerCardId
      );
    });

    self.Selects.ActiveDeck_Decks.on("select2:select", (e) => {
      const selectedData = e.params.data;

      self.ActiveDeckId = selectedData.id;

      //self.ActiveDeckName = selectedData.text;

      self.ActiveDeck_ActivateDeck();
    });
    self.Buttons.ActiveDeck_DeleteDeck.on("click", (e) => {
      e.preventDefault();

      self
        .sweetAlertWaning(
          "Current Active Deck will be deleted!",
          "To confirm please hit refresh now"
        )
        .then((isConfirmed) => {
          if (isConfirmed === true) {
            self.ActiveDeck_DeleteDeck();
          }
        });
    });
  };
  self.createDeck_LoadEvents = () => {
    self.Buttons.CreateDeck_ShowContainer.on("click", (e) => {
      e.preventDefault();

      self.CreateDeck_Create();
    });
    self.Buttons.CreateDeck_HideContainer.on("click", (e) => {
      e.preventDefault();

      self.CreateDeck_DeleteCreatedDeck();
    });

    self.Inputs.CreateDeck_DeckName.on("blur", function () {
      self.EditedDeckName = $(this).val();

      self.CreateDeck_EditDeckName();
    });
    // Binding the event after inserting into DOM
    $(document).on(
      "click",
      "#button-mab-create-deck-unassign-player-card",
      function () {
        let index = $(this).data("index");
        let assignedMabCardCopyId = $(this).data(
          "mab-create-deck-assigned-card-id"
        );

        self.CreateDeck_UnassignPlayerCard(index, assignedMabCardCopyId);
      }
    );
    self.Selects.CreateDeck_UnassignedPlayerCards.on(
      "select2:select",
      function (e) {
        const selectedData = e.params.data;

        self.NewDeck_SelectedCardCopyId = null;

        self.NewDeck_SelectedCardCopyId = selectedData.id;

        self.CreateDeck_AssignPlayerCard(
          self.NewDeckId,
          self.NewDeck_SelectedCardCopyId
        );
      }
    );

    self.Buttons.CreateDeck_Confirm.on("click", (e) => {
      e.preventDefault();

      self.createDeck_HideContainer();
      self.ActiveDeck_ShowDeckDetails(true);
    });

    self.Buttons.CreateDeck_ConfirmAndActivateDeck.on("click", (e) => {
      e.preventDefault();

      self.CreateDeck_ActivateNewDeck();
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
  self.sweetAlertWaning = (title_text, message_text) => {
    return Swal.fire({
      position: "center",
      confirmButtonText: "Confirm delete deck!",
      icon: "warning",
      toast: "true",
      theme: "bulma",
      title: title_text,
      text: message_text || "",
      showConfirmButton: true,
      showCancelButton: true, // optional, if you want an extra button
      allowOutsideClick: true,
      allowEscapeKey: true,
    }).then((result) => {
      return result.isConfirmed === true;
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
  self.mainMenu_ShowContainer = () => {
    self.toggleContainerVisibility(self.Containers.MainMenu);
  };
  self.mainMenu_HideContainer = () => {
    self.toggleContainerVisibility(self.Containers.MainMenu);
  };
  self.activeDeck_ShowContainer = () => {
    self.toggleContainerVisibility(self.Containers.ActiveDeck);
  };
  self.activeDeck_HideContainer = () => {
    self.toggleContainerVisibility(self.Containers.ActiveDeck);
  };
  self.createDeck_ShowContainer = () => {
    self.toggleContainerVisibility(self.Containers.CreateDeck);

    self.Inputs.CreateDeck_DeckName.val(self.NewDeckName)
      .trigger("focus")
      .trigger("select");
  };
  self.createDeck_HideContainer = () => {
    self.toggleContainerVisibility(self.Containers.CreateDeck);
  };

  self.activeDeck_Refresh_InputsAndFieldsAndVariables = () => {
    self.ActiveDeckId = null;

    self.ActiveDeckName = "";

    self.ActiveDeckSize = null;

    self.ActiveDeckSizeLimit = null;

    self.ActiveDeck_SelectedPlayerCardId = null;

    self.ActiveDeck_AssignedCardIds = [];

    self.Inputs.ActiveDeck_DeckName.val();

    self.Fields.ActiveDeck_DeckLevel.html();

    self.Fields.ActiveDeck_DeckSize.html();

    self.Fields.ActiveDeck_DeckBalance.html();

    self.OrderedLists.ActiveDeck_AssignedCards.empty();

    self.activeDeck_UnassignedPlayerCards_Select2_Hide();
  };
  self.ActiveDeck_ShowDeckDetails = (newDeckSelected) => {
    $.ajax({
      type: "GET",
      url: `https://localhost:7081/users/mabshowdeckdetails`,
      xhrFields: { withCredentials: true },
      success: function (response) {
        if (!response.content) {
          self.sweetAlertError("Error", response.message);

          return;
        }

        self.activeDeck_Refresh_InputsAndFieldsAndVariables();

        let activeDeck = response.content;
        let activeDeckId = activeDeck.mab_DeckId;
        let activeDeckName = activeDeck.mab_DeckName;
        let activeDeckLevel = activeDeck.mab_DeckLevel;
        let activeDeckSizeLimit = activeDeck.mab_DeckSizeLimit;
        let assignedCards = activeDeck.mab_AssignedCards;
        let activeDeckCurrentSize = assignedCards.length;

        let countNeutralCardCopies = 0;
        let countRangedCardCopies = 0;
        let countCalvaryCardCopies = 0;
        let countInfantryCardCopies = 0;

        self.ActiveDeckId = activeDeckId;
        self.ActiveDeckName = activeDeckName;
        self.ActiveDeckSize = activeDeckCurrentSize;
        self.ActiveDeckSizeLimit = activeDeckSizeLimit;

        if (activeDeckCurrentSize < activeDeckSizeLimit) {
          self.OrderedLists.ActiveDeck_AssignedCards.html(
            `<div>Add up to <span>${activeDeckSizeLimit}</span> cards...</div> `
          );
          self.ActiveDeck_LoadUnassignedCards();
        }

        self.Fields.ActiveDeck_DeckLevel.html(activeDeckLevel);

        self.Fields.ActiveDeck_DeckSize.html(
          `${activeDeckCurrentSize}/${activeDeckSizeLimit}`
        );

        assignedCards.forEach((mabCard) => {
          let cardType = mabCard.mab_CardType;

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
              self.sweetAlertError("Inform a valid action");
              break;
          }
        });

        self.Fields.ActiveDeck_NeutralTypeCount.html(countNeutralCardCopies);
        self.Fields.ActiveDeck_RangedTypeCount.html(countRangedCardCopies);
        self.Fields.ActiveDeck_CavalryTypeCount.html(countCalvaryCardCopies);
        self.Fields.ActiveDeck_InfantryTypeCount.html(countInfantryCardCopies);

        self.activeDeck_AssignedCards_BuildOrderedList(assignedCards);

        self.activeDeck_buildChart(
          countNeutralCardCopies,
          countRangedCardCopies,
          countCalvaryCardCopies,
          countInfantryCardCopies
        );

        if (self.IsBuilt === false || newDeckSelected === true) {
          self.Inputs.ActiveDeck_DeckName.val(activeDeckName)
            .trigger("focus")
            .trigger("select");
          self.ActiveDeck_LoadPlayerDecks();
        }
      },
      error: function (xhr, status, error) {
        self.sweetAlertError(
          "Failed to fetch active deck details. Try again later."
        );
      },
    });
  };
  self.ActiveDeck_EditDeckName = () => {
    let activeDeckNewName = self.Inputs.ActiveDeck_DeckName.val().trim();

    if (!activeDeckNewName || activeDeckNewName.length < 1) {
      self.sweetAlertError("Please fill the Mab Deck Name field!");

      return self.Inputs.ActiveDeck_DeckName.trigger("select");
    }

    if (activeDeckNewName === self.ActiveDeckName) {
      return;
    }

    $.ajax({
      type: "PUT",
      url: "https://localhost:7081/users/mabeditdeckname",
      data: JSON.stringify({
        Mab_DeckId: self.ActiveDeckId,
        Mab_DeckNewName: activeDeckNewName,
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

        self.ActiveDeckName = self.Inputs.ActiveDeck_DeckName.val();

        self.ActiveDeck_ShowDeckDetails(true);
        self.sweetAlertSuccess(resp.message);
      },
      error: (err) => {
        self.sweetAlertError(err);
      },
      complete: () => {},
    });
  };

  self.checkFormFilling = () => {
    const inputValue = self.Inputs.ActiveDeck_DeckName.val().trim();

    if (inputValue.length === 0) {
      self.Buttons.ActiveDeck_ChangeName.attr("disabled", true);
    } else {
      self.Buttons.ActiveDeck_ChangeName.attr("disabled", false);
    }
  };

  self.ActiveDeck_LoadPlayerDecks = () => {
    self.DOM.loadcontent("charge-contentloader");

    if (self.Selects.ActiveDeck_Decks.hasClass("select2-hidden-accessible")) {
      self.Selects.ActiveDeck_Decks.select2("destroy");
    }

    // Fetch the mab player cards and their count from the backend
    fetch(`https://localhost:7081/users/mablistdecks`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.content) {
          sweetAlertError("Failed to load mab player decks:", data.message);
          return;
        }

        const mabDeck = data.content.map((item) => ({
          id: item.mab_DeckId,
          text: item.mab_DeckName,
        }));

        // Clear previous options and add empty one
        self.Selects.ActiveDeck_Decks.empty();

        // If there's a current deck, add it as selected
        if (self.ActiveDeckName) {
          const currentDeck = mabDeck.find(
            (a) => a.text === self.ActiveDeckName
          );

          if (currentDeck) {
            self.Selects.ActiveDeck_Decks.append(
              new Option(currentDeck.text, currentDeck.id, true, true)
            );
          }
        }

        // Builds select2
        // Initialize select2
        self.Selects.ActiveDeck_Decks.select2({
          data: mabDeck,
          dropdownParent: self.DOM,
          placeholder: "Select a deck",
          allowClear: false,
          theme: "classic",
          width: "50%",
          templateSelection: (data) => {
            if (!data.id) return data.text;
            return $("<strong>").text(data.text);
          },
        });

        if (self.Containers.ActiveDeck.hasClass("show-div") === true) {
          return;
        }

        self.activeDeck_ShowContainer();
      })
      .then(() => {
        self.DOM.loadcontent("demolish-contentloader");
      })
      .catch((err) => {
        sweetAlertError("Error fetching mab player decks!");
      });
  };

  self.ActiveDeck_ActivateDeck = () => {
    $.ajax({
      type: "PUT",
      url: "https://localhost:7081/users/mabactivatedeck",
      data: JSON.stringify({
        Mab_DeckId: self.ActiveDeckId,
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

        self.sweetAlertSuccess(resp.message, "is now the active deck!");

        self.ActiveDeck_ShowDeckDetails(true);
      },
      error: (err) => {
        self.sweetAlertError(err);
      },
      complete: () => {},
    });
  };
  self.ActiveDeck_DeleteDeck = () => {
    $.ajax({
      type: "DELETE",
      url: "https://localhost:7081/users/mabdeletedeck",
      data: JSON.stringify({
        Mab_DeckId: self.ActiveDeckId,
      }),
      contentType: "application/json",
      xhrFields: {
        withCredentials: true,
      },
      success: (resp) => {
        if (!resp.content) {
          sweetAlertError(resp.message);

          return;
        }

        self.ActiveDeck_ShowDeckDetails(true);
      },
      error: (err) => {
        sweetAlertError(err);
      },
    });
  };

  self.ActiveDeck_LoadUnassignedCards = () => {
    if (
      self.Selects.ActiveDeck_UnassignedPlayerCards.hasClass(
        "select2-hidden-accessible"
      )
    ) {
      self.Selects.ActiveDeck_UnassignedPlayerCards.select2("destroy");
    }

    // Fetch the mab player cards and their count from the backend
    fetch(
      `https://localhost:7081/users/mablistunassignedplayercards?Mab_DeckId=${self.ActiveDeckId}`,
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

        const mabUnassignedCards = data.content.map((item) => ({
          id: item.mab_PlayerCardId,
          text: item.mab_CardDescription,
        }));

        // Clear previous options and add empty one
        self.Selects.ActiveDeck_UnassignedPlayerCards.empty().append(
          `<option></option>`
        );

        // Builds select2
        self.Selects.ActiveDeck_UnassignedPlayerCards.select2({
          data: mabUnassignedCards,
          dropdownParent: self.DOM,
          placeholder: "Select a card copy for your deck...",
          allowClear: true,
          theme: "classic",
          width: "100%",
          templateSelection: (data) => {
            if (!data.id) return data.text;
            return $("<strong>").text(data.text);
          },
        });

        // Opens select2
        self.Selects.ActiveDeck_UnassignedPlayerCards.trigger("change").select2(
          "open"
        );
      })
      .catch((err) => {
        sweetAlertError("Error fetching mab unassigned cards:", err);
      });

    self.activeDeck_UnassignedPlayerCards_Select2_Show();
  };
  self.activeDeck_UnassignedPlayerCards_Select2_Show = () => {
    self.Blocks.ActiveDeck_Select_UnassignedPlayerCards.removeClass(
      "hide-div"
    ).addClass("show-div");
  };
  self.activeDeck_UnassignedPlayerCards_Select2_Hide = () => {
    self.Blocks.ActiveDeck_Select_UnassignedPlayerCards.removeClass(
      "show-div"
    ).addClass("hide-div");
  };
  self.ActiveDeck_AssignPlayerCard = (mabDeckId, mabPlayerCardId) => {
    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/mabassignplayercard",
      data: JSON.stringify({
        Mab_DeckId: mabDeckId,
        Mab_PlayerCardId: mabPlayerCardId,
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

        self.ActiveDeck_ShowDeckDetails(false);
      },
      error: (err) => {
        self.sweetAlertError(err);
      },
      complete: () => {},
    });
  };
  self.ActiveDeck_UnassignPlayerCard = (index, assignedCardId) => {
    self.ActiveDeck_AssignedCardIds.splice(index, 1);

    self.OrderedLists.ActiveDeck_AssignedCards.find(
      `#li-mab-active-deck-${index}`
    ).remove();

    $.ajax({
      type: "DELETE",
      url: "https://localhost:7081/users/mabunassignplayercard",
      data: JSON.stringify({
        Mab_AssignedCardId: assignedCardId,
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

        self.ActiveDeck_ShowDeckDetails(false);
      },
      error: (err) => {
        self.sweetAlertError(err);
      },
      complete: () => {},
    });
  };
  self.activeDeck_AssignedCards_BuildOrderedList = (assignedCards) => {
    assignedCards.forEach((card, index) => {
      self.ActiveDeck_AssignedCardIds.push(card.mab_AssignedCardId);

      let assignedCardId = card.mab_AssignedCardId;
      let cardName = card.mab_CardName;
      let cardLvl = card.mab_CardLevel;
      let cardType = card.mab_CardType;
      let cardPower = card.mab_CardPower;
      let cardUpperHand = card.mab_CardUpperHand;

      let listItem = `
          <li id="li-mab-active-deck-${index}"">
            <div class="d-flex flex-row align-items-center gap-2">
              <button               
                class="btn btn-outline-danger p-0 m-0 button-mab-active-deck-unassign-player-card"
                type="button"
                data-mab-active-deck-assigned-card-id="${assignedCardId}"
                data-index="${index}"
              >
                <i class="fa-solid fa-xmark p-1 m-0"></i>
              </button>

              <strong class="mab-card-name p-0 m-0">${cardName}</strong>

              <img
                src="/images/icons/io_arrow_right.svg"
                class="bi bi-arrow p-0 m-0"
              />

              <div>
                <span>L</span>evel: <strong>${cardLvl}</strong>,
                <span>T</span>ype: <strong>${cardType}</strong>,
                <span>P</span>ower: <strong>${cardPower}</strong>,
                <span>U</span>pper <span>H</span>and:
                <strong>${cardUpperHand}</strong>
              </div>
            </div>
          </li>
          `;

      self.OrderedLists.ActiveDeck_AssignedCards.append(listItem);
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
            rootStyles.getPropertyValue("--reddish"),
            rootStyles.getPropertyValue("--yellowish"),
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
                  rootStyles.getPropertyValue("--reddish"),
                  rootStyles.getPropertyValue("--yellowish"),
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
                  rootStyles.getPropertyValue("--reddish"),
                  rootStyles.getPropertyValue("--yellowish"),
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
      self.ActiveDeck_DeckBalanceChart,
      chartConfigs
    );
  };

  self.CreateDeck_Create = () => {
    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/mabcreatedeck",
      xhrFields: {
        withCredentials: true,
      },
      success: (resp) => {
        if (!resp.content) {
          self.sweetAlertError(resp.message);

          return;
        }

        self.NewDeckId = resp.content.newMabDeckId;
        self.NewDeckName = resp.content.newMabDeckName;

        self.CreateDeck_ShowDeckDetails();
      },
      error: (err) => {
        self.sweetAlertError(err);
      },
      complete: () => {},
    });
  };
  self.createDeck_Refresh_InputsAndFieldsAndVariables = () => {
    self.NewDeckName = "";

    self.NewDeckSize = null;

    self.NewDeckSizeLimit = null;

    self.NewDeck_SelectedCardCopyId = null;

    self.NewDeck_CardIds = [];

    self.Inputs.CreateDeck_DeckName.empty();

    self.Fields.CreateDeck_DeckSize.empty();

    self.Fields.CreateDeck_DeckBalance.empty();

    self.OrderedLists.CreateDeck_AssignedCards.empty();

    self.createDeck_UnassignedPlayerCards_Select2_Hide();
  };
  self.CreateDeck_ShowDeckDetails = () => {
    $.ajax({
      type: "GET",
      url: `https://localhost:7081/users/mabshowdeckdetails?Mab_DeckId=${self.NewDeckId}`,
      xhrFields: { withCredentials: true },
      success: function (response) {
        if (!response.content) {
          self.sweetAlertError("Error", response.message);
          return;
        }

        self.createDeck_Refresh_InputsAndFieldsAndVariables();

        let newDeck = response.content;
        let newDeckId = newDeck.mab_DeckId;
        let newDeckName = newDeck.mab_DeckName;
        let newDeckLevel = newDeck.mab_DeckLevel;
        let newDeckSizeLimit = newDeck.mab_DeckSizeLimit;
        let assignedCards = newDeck.mab_AssignedCards;
        let newDeckCurrentSize = assignedCards.length;

        let countNeutralCardCopies = 0;
        let countRangedCardCopies = 0;
        let countCalvaryCardCopies = 0;
        let countInfantryCardCopies = 0;

        self.NewDeckId = newDeckId;
        self.NewDeckName = newDeckName;
        self.NewDeckSize = newDeckCurrentSize;
        self.NewDeckSizeLimit = newDeckSizeLimit;

        if (newDeckCurrentSize < newDeckSizeLimit) {
          self.OrderedLists.CreateDeck_AssignedCards.html(
            `<div>Add up to <span>${newDeckSizeLimit}</span> cards...</div> `
          );
          self.CreateDeck_LoadUnassignedPlayerCards();
        }

        self.Inputs.CreateDeck_DeckName.val(newDeckName);

        self.Fields.CreateDeck_DeckLevel.html(newDeckLevel);

        self.Fields.CreateDeck_DeckSize.html(
          `${newDeckCurrentSize}/${newDeckSizeLimit}`
        );

        assignedCards.forEach((assignedCard) => {
          let cardType = assignedCard.mab_CardType;

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
              self.sweetAlertError("Inform a valid action");
              break;
          }
        });

        self.Fields.CreateDeck_NeutralTypeCount.html(countNeutralCardCopies);
        self.Fields.CreateDeck_RangedTypeCount.html(countRangedCardCopies);
        self.Fields.CreateDeck_CavalryTypeCount.html(countCalvaryCardCopies);
        self.Fields.CreateDeck_InfantryTypeCount.html(countInfantryCardCopies);

        if (newDeckCurrentSize != 0) {
          self.createDeck_PlayerCards_BuildOrderedList(assignedCards);
        }

        if (self.Containers.CreateDeck.hasClass("show-div")) {
          return;
        }

        self.createDeck_PlayerCards_BuildOrderedList(assignedCards);

        if (self.Containers.CreateDeck.hasClass("show-div") === true) {
          return;
        }

        self.activeDeck_HideContainer();

        self.createDeck_ShowContainer();
      },
      error: function (xhr, status, error) {
        self.sweetAlertError(
          "Failed to fetch active deck details. Try again later."
        );
      },
      complete: function () {},
    });
  };
  self.CreateDeck_EditDeckName = () => {
    let deckNewName = self.NewDeckName.trim().toLocaleLowerCase();
    let editedDeckNewDeckName = self.EditedDeckName.trim().toLocaleLowerCase();

    if (!editedDeckNewDeckName || editedDeckNewDeckName.length < 1) {
      self.sweetAlertError("Please fill the Mab Deck Name field!");

      return self.Inputs.CreateDeck_DeckName.trigger("select");
    }

    if (editedDeckNewDeckName === deckNewName) {
      return;
    }

    $.ajax({
      type: "PUT",
      url: "https://localhost:7081/users/mabeditdeckname",
      data: JSON.stringify({
        Mab_DeckId: self.NewDeckId,
        Mab_DeckNewName: editedDeckNewDeckName,
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

        self.NewDeckName = self.Inputs.CreateDeck_DeckName.val();
      },
      error: (err) => {
        self.sweetAlertError(err);
      },
      complete: () => {},
    });
  };
  self.CreateDeck_ActivateNewDeck = () => {
    $.ajax({
      type: "PUT",
      url: "https://localhost:7081/users/mabactivatedeck",
      data: JSON.stringify({
        Mab_DeckId: self.NewDeckId,
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

        self.createDeck_HideContainer();
        self.ActiveDeck_ShowDeckDetails(true);
        self.sweetAlertSuccess(resp.message, "is now the active deck!");
      },
      error: (err) => {
        self.sweetAlertError(err);
      },
      complete: () => {},
    });
  };
  self.CreateDeck_DeleteCreatedDeck = () => {
    $.ajax({
      type: "DELETE",
      url: "https://localhost:7081/users/mabdeletedeck",
      data: JSON.stringify({
        Mab_DeckId: self.NewDeckId,
      }),
      contentType: "application/json",
      xhrFields: {
        withCredentials: true,
      },
      success: (resp) => {
        if (!resp.content) {
          sweetAlertError(resp.message);

          return;
        }

        self.createDeck_HideContainer();

        //self.ActiveDeck_ShowDeckDetails(false);
        self.activeDeck_ShowContainer();
      },
      error: (err) => {
        sweetAlertError(err);
      },
    });
  };
  self.CreateDeck_LoadUnassignedPlayerCards = () => {
    if (
      self.Selects.CreateDeck_UnassignedPlayerCards.hasClass(
        "select2-hidden-accessible"
      )
    ) {
      self.Selects.CreateDeck_UnassignedPlayerCards.select2("destroy");
    }

    fetch(
      `https://localhost:7081/users/mablistunassignedplayercards?Mab_DeckId=${self.NewDeckId}`,
      {
        method: "GET",
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.content) {
          self.sweetAlertError(
            "Failed to load mab player cards:",
            data.message
          );
          return;
        }

        const mabPlayerCards = data.content.map((item) => ({
          id: item.mab_PlayerCardId,
          text: item.mab_CardDescription,
        }));

        // Clear previous options and add empty one
        self.Selects.CreateDeck_UnassignedPlayerCards.empty().append(
          `<option></option>`
        );

        // Builds select2
        self.Selects.CreateDeck_UnassignedPlayerCards.select2({
          data: mabPlayerCards,
          dropdownParent: self.DOM,
          placeholder: "Select a card for your deck...",
          allowClear: true,
          theme: "classic",
          width: "100%",
          templateSelection: (data) => {
            if (!data.id) return data.text;
            return $("<strong>").text(data.text);
          },
        });

        // Opens select2
        self.Selects.CreateDeck_UnassignedPlayerCards.trigger("change").select2(
          "open"
        );
      })
      .catch((err) => {
        self.sweetAlertError("Error fetching mab player cards:", err);
      });

    self.createDeck_UnassignedPlayerCards_Select2_Show();
  };
  self.createDeck_UnassignedPlayerCards_Select2_Show = () => {
    self.Blocks.CreateDeck_Select_UnassignedPlayerCards.removeClass(
      "hide-div"
    ).addClass("show-div");
  };
  self.createDeck_UnassignedPlayerCards_Select2_Hide = () => {
    self.Blocks.CreateDeck_Select_UnassignedPlayerCards.removeClass(
      "show-div"
    ).addClass("hide-div");
  };
  self.createDeck_PlayerCards_BuildOrderedList = (playerCards) => {
    playerCards.forEach((card, Index) => {
      self.NewDeck_CardIds.push(card.mab_AssignedCardId);

      let assignedCardId = card.mab_AssignedCardId;
      let cardName = card.mab_CardName;
      let cardLvl = card.mab_CardLevel;
      let cardType = card.mab_CardType;
      let cardPower = card.mab_CardPower;
      let cardUpperHand = card.mab_CardUpperHand;

      let listItem = `
          <li id="li-mab-create-deck-${Index}" data-mab-create-deck-assigned-card-id="${assignedCardId}">
            <div class="d-flex flex-row align-items-center gap-2">
              <button
                id="button-mab-create-deck-unassign-player-card"
                class="btn btn-outline-danger p-0 m-0"
                type="button"
                data-mab-create-deck-assigned-card-id="${assignedCardId}"
                data-index="${Index}"
              >
                <i class="fa-solid fa-xmark p-1 m-0"></i>
              </button>

              <strong class="p-0 m-0">${cardName}</strong>

              <img
                src="/images/icons/io_arrow_right.svg"
                class="bi bi-arrow p-0 m-0"
              />

              <div>
                <span>L</span>evel: <strong>${cardLvl}</strong>,
                <span>T</span>ype: <strong>${cardType}</strong>,
                <span>P</span>ower: <strong>${cardPower}</strong>,
                <span>U</span>pper <span>H</span>and:
                <strong>${cardUpperHand}</strong>
              </div>
            </div>
          </li>
          `;

      self.OrderedLists.CreateDeck_AssignedCards.append(listItem);
    });
  };
  self.CreateDeck_AssignPlayerCard = (mabDeckId, mabPlayerCardId) => {
    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/mabassignplayercard",
      data: JSON.stringify({
        Mab_DeckId: mabDeckId,
        Mab_PlayerCardId: mabPlayerCardId,
      }),
      contentType: "application/json",
      xhrFields: {
        withCredentials: true,
      },
      success: (resp) => {
        if (!resp.content) {
          self.sweetAlertError("Failed to assign player card", resp.message);
          return;
        }

        self.CreateDeck_ShowDeckDetails();
      },
      error: (err) => {
        self.sweetAlertError(err);
      },
      complete: () => {},
    });
  };
  self.CreateDeck_UnassignPlayerCard = (index, assignedCardId) => {
    self.NewDeck_CardIds.splice(index, 1);

    self.OrderedLists.CreateDeck_AssignedCards.find(
      `#li-mab-new-deck-${index}`
    ).remove();

    $.ajax({
      type: "DELETE",
      url: "https://localhost:7081/users/mabunassignplayercard",
      data: JSON.stringify({
        Mab_AssignedMabCardId: assignedCardId,
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

        self.CreateDeck_ShowDeckDetails();
      },
      error: (err) => {
        self.sweetAlertError(err);
      },
      complete: () => {},
    });
  };

  self.loadReferences = () => {
    self.general_LoadReferences();
    self.activeDeck_LoadReferences();
    self.createDeck_LoadReferences();
  };
  self.loadEvents = () => {
    self.activeDeck_LoadEvents();
    self.createDeck_LoadEvents();
  };
  self.build = () => {
    if (!self.IsBuilt) {
      self.IsBuilt = true;
    }
    self.loadReferences();
    self.loadEvents();
  };

  self.build();
}

$(function () {
  new mab_manage_decks();
});
