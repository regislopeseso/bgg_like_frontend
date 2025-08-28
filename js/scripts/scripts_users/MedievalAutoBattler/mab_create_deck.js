function mab_create_deck() {
  let self = this;

  self.IsBuilt = false;

  self.NewDeckId = null;

  self.NewDeckName = "";

  self.EditedDeckName = "";

  self.NewDeckSize = null;

  self.NewDeckSizeLimit = null;

  self.NewDeck_SelectedCardCopyId = null;

  self.NewDeck_CardIds = [];

  self.loadReferences = () => {
    self.DOM = $("#dom-medieval-auto-battler");

    self.MabContent = self.DOM.find("#mab-containers-content");

    self.NewDeck_CardCopies_OrderedList = self.DOM.find(
      "#ol-mab-new-deck-card-copies"
    );

    self.Containers = [];
    self.Containers[self.Containers.length] = self.Containers.MainMenu =
      self.DOM.find("#container-mab-main-menu");
    self.Containers[self.Containers.length] = self.Containers.CreateDeck =
      self.DOM.find("#container-mab-create-deck");
    self.Containers[self.Containers.length] = self.Containers.ActiveDeck =
      self.DOM.find("#container-mab-active-deck");

    self.Blocks = [];
    self.Blocks[self.Blocks.length] =
      self.Blocks.CreateDeck_PlayerCardstSelect =
        self.Containers.CreateDeck.find(
          "#block-select-mab-create-deck-player-cards-list"
        );

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.ShowNewDeckContainer =
      self.Containers.ActiveDeck.find("#button-mab-create-deck-show-container");
    self.Buttons[self.Buttons.length] = self.Buttons.HideNewDeckContainer =
      self.Containers.CreateDeck.find("#button-mab-create-deck-hide-container");
    self.Buttons[self.Buttons.length] = self.Buttons.AssignCardCopy =
      self.Containers.CreateDeck.find(
        "#button-mab-create-deck-assign-player-card"
      );
    self.Buttons[self.Buttons.length] = self.Buttons.NewDeck_ActivateDeck =
      self.Containers.CreateDeck.find("#button-mab-create-deck-activate-deck");

    self.Inputs = [];
    self.Inputs[self.Inputs.length] = self.Inputs.NewDeckName =
      self.Containers.CreateDeck.find("#input-mab-create-deck-deckname");
    self.Inputs[self.Inputs.length] = self.Inputs.Select_NewDeckCardCopies =
      self.Containers.CreateDeck.find(
        "#select-mab-create-deck-player-cards-list"
      );

    self.Fields = [];
    self.Fields[self.Fields.length] = self.Fields.NewDeckLevel =
      self.Containers.CreateDeck.find("#span-mab-create-deck-decklevel");
    self.Fields[self.Fields.length] = self.Fields.NewDeckSize =
      self.Containers.CreateDeck.find("#span-mab-create-deck-decksize");
    self.Fields[self.Fields.length] = self.Fields.NewDeckBalance =
      self.Containers.CreateDeck.find("#span-mab-create-deck-deckbalance");
    self.Fields[self.Fields.length] = self.Fields.NewDeck_NeutralTypeCount =
      self.Fields.NewDeckBalance.find(".strong-mab-decks-neutral-type-count");
    self.Fields[self.Fields.length] = self.Fields.NewDeck_RangedTypeCount =
      self.Fields.NewDeckBalance.find(".span-mab-decks-ranged-type-count");
    self.Fields[self.Fields.length] = self.Fields.NewDeck_CavalryTypeCount =
      self.Fields.NewDeckBalance.find(".span-mab-decks-cavalry-type-count");
    self.Fields[self.Fields.length] = self.Fields.NewDeck_InfantryTypeCount =
      self.Fields.NewDeckBalance.find(".span-mab-decks-infantry-type-count");
  };

  self.loadEvents = () => {
    self.Buttons.ShowNewDeckContainer.on("click", (e) => {
      e.preventDefault();

      self.activeDeck_HideContainer();

      self.NewDeck_Create();
    });
    self.Buttons.HideNewDeckContainer.on("click", (e) => {
      self.NewDeck_DeleteDeck();
    });

    self.Inputs.Select_NewDeckCardCopies.on("select2:select", function (e) {
      const selectedData = e.params.data;

      self.NewDeck_SelectedCardCopyId = null;

      self.NewDeck_SelectedCardCopyId = selectedData.id;
    });

    self.Inputs.NewDeckName.on("blur", function () {
      self.EditedDeckName = $(this).val();

      self.NewDeck_EditDeckName();
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

        self.NewDeck_UnassignCardCopy(index, assignedMabCardCopyId);
      }
    );

    self.Buttons.AssignCardCopy.on("click", (e) => {
      e.preventDefault();

      self.NewDeck_AssignCardCopy(
        self.NewDeckId,
        self.NewDeck_SelectedCardCopyId
      );
    });
    self.Buttons.NewDeck_ActivateDeck.on("click", (e) => {
      e.preventDefault();

      self.NewDeck_ActivateDeck();
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

  self.newDeck_ShowContainer = () => {
    self.toggleContainerVisibility(self.Containers.CreateDeck);

    self.Inputs.NewDeckName.val(self.NewDeckName)
      .trigger("focus")
      .trigger("select");
  };
  self.newDeck_HideContainer = () => {
    self.toggleContainerVisibility(self.Containers.CreateDeck);
  };

  self.NewDeck_Create = () => {
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

        self.NewDeck_ShowDeckDetails(self.NewDeckId);

        self.newDeck_ShowContainer();
      },
      error: (err) => {
        self.sweetAlertError(err);
      },
      complete: () => {},
    });
  };

  self.newDeck_Refresh_InputsAndFieldsAndVariables = () => {
    self.NewDeckName = "";

    self.NewDeckSize = null;

    self.NewDeckSizeLimit = null;

    self.NewDeck_SelectedCardCopyId = null;

    self.NewDeck_CardIds = [];

    self.Inputs.NewDeckName.val();

    //self.Fields.NewDeckSize.html();

    self.Fields.NewDeckBalance.html();

    self.NewDeck_CardCopies_OrderedList.empty();

    self.newDeck_CardCopiesList_Select2_Hide();
  };
  self.NewDeck_ShowDeckDetails = () => {
    $.ajax({
      type: "GET",
      url: `https://localhost:7081/users/mabshowdeckdetails?Mab_DeckId=${self.NewDeckId}`,
      xhrFields: { withCredentials: true },
      success: function (response) {
        if (response.content == null) {
          self.sweetAlertError("Error", response.message);
          return;
        }

        self.newDeck_Refresh_InputsAndFieldsAndVariables();

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
          self.NewDeck_LoadUnassignedCardCopies();
        }

        self.Inputs.NewDeckName.val(newDeckName);

        self.Fields.NewDeckLevel.html(newDeckLevel);

        self.Fields.NewDeckSize.html(
          `${newDeckCurrentSize}/${newDeckSizeLimit}`
        );

        assignedCards.forEach((assignedCard) => {
          if (assignedCard.mab_CardType == "Neutral") countNeutralCardCopies++;
          if (assignedCard.mab_CardType == "Ranged") countRangedCardCopies++;
          if (assignedCard.mab_CardType == "Cavalry") countCalvaryCardCopies++;
          if (assignedCard.mab_CardType == "Infantry")
            countInfantryCardCopies++;
        });

        self.Fields.NewDeck_NeutralTypeCount.html(countNeutralCardCopies);
        self.Fields.NewDeck_RangedTypeCount.html(countRangedCardCopies);
        self.Fields.NewDeck_CavalryTypeCount.html(countCalvaryCardCopies);
        self.Fields.NewDeck_InfantryTypeCount.html(countInfantryCardCopies);

        if (newDeckCurrentSize <= 0) {
          self.NewDeck_CardCopies_OrderedList.html(
            `<div>Add up to <span>${newDeckSizeLimit}</span> cards...</div> `
          );
        } else {
          self.newDeck_PlayerCards_BuildOrderedList(assignedCards);
        }
      },
      error: function (xhr, status, error) {
        self.sweetAlertError(
          "Failed to fetch active deck details. Try again later."
        );
      },
      complete: function () {},
    });
  };
  self.NewDeck_EditDeckName = () => {
    let deckNewName = self.NewDeckName.trim().toLocaleLowerCase();
    let editedDeckNewDeckName = self.EditedDeckName.trim().toLocaleLowerCase();

    if (!editedDeckNewDeckName || editedDeckNewDeckName.length < 1) {
      self.sweetAlertError("Please fill the Mab Deck Name field!");

      return self.Inputs.NewDeckName.trigger("select");
    }

    if (editedDeckNewDeckName === deckNewName) {
      return;
    }

    $.ajax({
      type: "PUT",
      url: "https://localhost:7081/users/mabeditdeckname",
      data: JSON.stringify({
        Mab_DeckId: self.NewDeckId,
        Mab_DeckName: editedDeckNewDeckName,
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

        self.ActiveDeckName = self.Inputs.NewDeckName.val();
      },
      error: (err) => {
        self.sweetAlertError(err);
      },
      complete: () => {},
    });
  };
  self.NewDeck_DeleteDeck = () => {
    $.ajax({
      type: "DELETE",
      url: "https://localhost:7081/users/mab_deletedeck",
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
      },
      error: (err) => {
        sweetAlertError(err);
      },
    });
  };
  self.NewDeck_ActivateDeck = () => {
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

        self.sweetAlertSuccess(resp.message, "is now the active deck!");
      },
      error: (err) => {
        self.sweetAlertError(err);
      },
      complete: () => {},
    });
  };

  self.NewDeck_LoadUnassignedCardCopies = () => {
    if (
      self.Inputs.Select_NewDeckCardCopies.hasClass("select2-hidden-accessible")
    ) {
      self.Inputs.Select_NewDeckCardCopies.select2("destroy");
    }

    const mabDeckId = self.NewDeckId;

    fetch(
      `https://localhost:7081/users/mablistunassignedplayercards?Mab_DeckId=${mabDeckId}`,
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
        self.Inputs.Select_NewDeckCardCopies.empty().append(
          `<option></option>`
        );

        // Builds select2
        self.Inputs.Select_NewDeckCardCopies.select2({
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
      })
      .catch((err) => {
        self.sweetAlertError("Error fetching mab player cards:", err);
      });

    self.newDeck_CardCopiesList_Select2_Show();
  };
  self.newDeck_CardCopiesList_Select2_Show = () => {
    self.Blocks.CreateDeck_PlayerCardstSelect.removeClass("hide-div").addClass(
      "show-div"
    );
  };
  self.newDeck_CardCopiesList_Select2_Hide = () => {
    self.Blocks.CreateDeck_PlayerCardstSelect.removeClass("show-div").addClass(
      "hide-div"
    );
  };
  self.NewDeck_AssignCardCopy = (mabDeckId, mabPlayerCardId) => {
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

        self.NewDeck_ShowDeckDetails(mabDeckId);
      },
      error: (err) => {
        self.sweetAlertError(err);
      },
      complete: () => {},
    });
  };
  self.NewDeck_UnassignCardCopy = (index, assignedCardId) => {
    self.NewDeck_CardIds.splice(index, 1);

    self.NewDeck_CardCopies_OrderedList.find(
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

        self.NewDeck_ShowDeckDetails();
      },
      error: (err) => {
        self.sweetAlertError(err);
      },
      complete: () => {},
    });
  };
  self.newDeck_PlayerCards_BuildOrderedList = (playerCards) => {
    playerCards.forEach((card, Index) => {
      self.NewDeck_CardIds.push(card.mabCardId);

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

      self.NewDeck_CardCopies_OrderedList.append(listItem);
    });
  };

  self.activeDeck_HideContainer = () => {
    self.toggleContainerVisibility(self.Containers.ActiveDeck);
  };

  self.build = () => {
    if (self.IsBuilt === false) {
      self.NewDeckId = null;
      self.IsBuilt = true;
    }
    self.loadReferences();
    self.loadEvents();
  };

  self.build();
}

$(function () {
  new mab_create_deck();
});
