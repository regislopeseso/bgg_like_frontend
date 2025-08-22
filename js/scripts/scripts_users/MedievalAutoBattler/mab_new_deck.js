function mab_new_deck() {
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

    self.MabContent = self.DOM.find("#mab-content-containers");

    self.NewDeck_CardCopies_OrderedList = self.DOM.find(
      "#ol-mab-new-deck-card-copies"
    );

    self.Containers = [];
    self.Containers[self.Containers.length] = self.Containers.MainMenu =
      self.DOM.find("#container-mab-main-menu");
    self.Containers[self.Containers.length] = self.Containers.NewDeck =
      self.DOM.find("#container-mab-new-deck");
    self.Containers[self.Containers.length] = self.Containers.ActiveDeck =
      self.DOM.find("#container-mab-active-deck");
    self.Containers[self.Containers.length] =
      self.Containers.NewDeck_CardCopiesSelect2 = self.Containers.NewDeck.find(
        "#container-add-mab-selectcard"
      );

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.ShowNewDeckContainer =
      self.Containers.ActiveDeck.find("#button-mab-new-deck-show-container");
    self.Buttons[self.Buttons.length] = self.Buttons.HideNewDeckContainer =
      self.Containers.NewDeck.find("#button-mab-new-deck-hide-container");
    self.Buttons[self.Buttons.length] = self.Buttons.AssignCardCopy =
      self.Containers.NewDeck.find("#button-mab-new-deck-assign-card-copy");
    self.Buttons[self.Buttons.length] = self.Buttons.NewDeck_ActivateDeck =
      self.Containers.NewDeck.find("#button-mab-new-deck-activate-new-deck");

    self.Inputs = [];
    self.Inputs[self.Inputs.length] = self.Inputs.NewDeckName =
      self.Containers.NewDeck.find("#input-mab-new-deck-deck-name");
    self.Inputs[self.Inputs.length] = self.Inputs.Select_NewDeckCardCopies =
      self.Containers.NewDeck.find("#select-mab-new-deck-card-copies-list");

    self.Fields = [];
    self.Fields[self.Fields.length] = self.Fields.NewDeckLevel =
      self.Containers.NewDeck.find("#span-mab-new-deck-decklevel");
    self.Fields[self.Fields.length] = self.Fields.NewDeckSize =
      self.Containers.NewDeck.find("#span-mab-new-deck-decksize");
    self.Fields[self.Fields.length] = self.Fields.NewDeckBalance =
      self.Containers.NewDeck.find("#span-mab-new-deck-deckbalance");
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
      "#button-mab-new-deck-unassign-card-copy",
      function () {
        let index = $(this).data("index");
        let assignedMabCardCopyId = $(this).data(
          "mab-new-deck-assigned-card-copy-id"
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
    self.toggleContainerVisibility(self.Containers.NewDeck);

    self.Inputs.NewDeckName.val(self.NewDeckName)
      .trigger("focus")
      .trigger("select");
  };
  self.newDeck_HideContainer = () => {
    self.toggleContainerVisibility(self.Containers.NewDeck);
  };

  self.NewDeck_Create = () => {
    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/addmabplayerdeck",
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
      url: `https://localhost:7081/users/showmabdeckdetails?MabDeckId=${self.NewDeckId}`,
      xhrFields: { withCredentials: true },
      success: function (response) {
        if (response.content == null) {
          self.sweetAlertError("Error", response.message);
          return;
        }

        self.newDeck_Refresh_InputsAndFieldsAndVariables();

        let newDeck = response.content;
        let newDeckId = newDeck.activeMabDeckId;
        let newDeckName = newDeck.activeMabDeckName;
        let newDeckLevel = newDeck.deckLevel;
        let newDeckSizeLimit = newDeck.mabDeckSizeLimit;
        let cardCopies = newDeck.mabCardCopies;
        let newDeckCurrentSize = cardCopies.length;

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

        cardCopies.forEach((mabCard) => {
          if (mabCard.mabCardType == "Neutral") countNeutralCardCopies++;
          if (mabCard.mabCardType == "Ranged") countRangedCardCopies++;
          if (mabCard.mabCardType == "Cavalry") countCalvaryCardCopies++;
          if (mabCard.mabCardType == "Infantry") countInfantryCardCopies++;
        });

        self.Fields.NewDeck_NeutralTypeCount.html(countNeutralCardCopies);
        self.Fields.NewDeck_RangedTypeCount.html(countRangedCardCopies);
        self.Fields.NewDeck_CavalryTypeCount.html(countCalvaryCardCopies);
        self.Fields.NewDeck_InfantryTypeCount.html(countInfantryCardCopies);

        if (newDeckCurrentSize <= 0) {
          self.NewDeck_CardCopies_OrderedList.html(
            `Add up to <span>${newDeckSizeLimit}</span> cards...`
          );
        } else {
          self.newDeck_CardCopies_BuildOrderedList(cardCopies);
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
      url: "https://localhost:7081/users/editmabdeckname",
      data: JSON.stringify({
        MabDeckId: self.NewDeckId,
        MabDeckName: editedDeckNewDeckName,
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
      url: "https://localhost:7081/users/deletemabdeck",
      data: JSON.stringify({
        MabDeckId: self.NewDeckId,
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
      url: "https://localhost:7081/users/activatemabdeck",
      data: JSON.stringify({
        MabDeckId: self.NewDeckId,
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
      `https://localhost:7081/users/listunassignedmabcardcopies?MabDeckId=${mabDeckId}`,
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
          id: item.mabCardCopyId,
          text: item.mabCardDescription,
        }));

        // Clear previous options and add empty one
        self.Inputs.Select_NewDeckCardCopies.empty().append(
          `<option></option>`
        );

        // Builds select2
        self.Inputs.Select_NewDeckCardCopies.select2({
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
      })
      .catch((err) => {
        self.sweetAlertError("Error fetching mab player cards:", err);
      });

    self.newDeck_CardCopiesList_Select2_Show();
  };
  self.newDeck_CardCopiesList_Select2_Show = () => {
    self.Containers.NewDeck_CardCopiesSelect2.removeClass("hide-div").addClass(
      "show-div"
    );
  };
  self.newDeck_CardCopiesList_Select2_Hide = () => {
    self.Containers.NewDeck_CardCopiesSelect2.removeClass("show-div").addClass(
      "hide-div"
    );
  };
  self.NewDeck_AssignCardCopy = (mabDeckId, mabCardCopyId) => {
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

        self.NewDeck_ShowDeckDetails(mabDeckId);
      },
      error: (err) => {
        self.sweetAlertError(err);
      },
      complete: () => {},
    });
  };
  self.NewDeck_UnassignCardCopy = (index, assignedCardCopyId) => {
    self.NewDeck_CardIds.splice(index, 1);

    self.NewDeck_CardCopies_OrderedList.find(
      `#li-mab-new-deck-${index}`
    ).remove();

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

        self.NewDeck_ShowDeckDetails();
      },
      error: (err) => {
        self.sweetAlertError(err);
      },
      complete: () => {},
    });
  };
  self.newDeck_CardCopies_BuildOrderedList = (playerCardCopies) => {
    playerCardCopies.forEach((card, Index) => {
      self.NewDeck_CardIds.push(card.mabCardId);

      let assignedCardCopyId = card.assignedMabCardCopyId;
      let cardName = card.mabCardName;
      let cardLvl = card.mabCardLevel;
      let cardType = card.mabCardType;
      let cardPower = card.mabCardPower;
      let cardUpperHand = card.mabCardUpperHand;

      let listItem = `
          <li id="li-mab-new-deck-${Index}" data-mab-new-deck-assigned-card-copy-id="${assignedCardCopyId}">
            <div class="d-flex flex-row align-items-center gap-2">
              <button
                id="button-mab-new-deck-unassign-card-copy"
                class="btn btn-outline-danger p-0 m-0"
                type="button"
                data-mab-new-deck-assigned-card-copy-id="${assignedCardCopyId}"
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
  new mab_new_deck();
});
