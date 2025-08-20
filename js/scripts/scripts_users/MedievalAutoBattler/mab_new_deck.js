function mab_new_deck() {
  let self = this;
  self.IsBuilt = false;

  self.isActiveDeckMode = true;

  self.MabDeck_CurrentDeckSize = 0;
  self.MabPlayer_MabDeck = {
    MabDeckId: null,
    MabDeckName: "",
  };

  self.MabDeck_DeckSizeLimit = null;

  self.SelectedMabCardCopyId = null;
  self.MabDeck_CardIds = [];

  self.loadReferences = () => {
    self.DOM = $("#dom-medieval-auto-battler");

    self.MabContent = self.DOM.find("#mab-content-containers");

    self.AddMabDeck_CardCopiesList = self.DOM.find(
      "#ol-add-mab-deck-cardcopieslist"
    );

    self.Containers = [];
    self.Containers[self.Containers.length] = self.Containers.MainMenu =
      self.DOM.find("#container-mab-main-menu");
    self.Containers[self.Containers.length] = self.Containers.NewDeck =
      self.DOM.find("#container-mab-new-deck");
    self.Containers[self.Containers.length] = self.Containers.ActiveDeck =
      self.DOM.find("#container-mab-active-deck");

    self.Containers.AddMabDeck_CardCopiesSelect2 = self.DOM.find(
      "#container-add-mab-selectcard"
    );

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.ShowNewDeckContainer =
      self.Containers.ActiveDeck.find("#button-mab-new-deck-show-container");
    self.Buttons[self.Buttons.length] = self.Buttons.HideNewDeckContainer =
      self.Containers.NewDeck.find("#button-mab-new-deck-hide-container");
    self.Buttons[self.Buttons.length] = self.Buttons.AssignCardCopy =
      self.Containers.NewDeck.find("#button-mab-new-deck-assign-card-copyy");
    self.Buttons[self.Buttons.length] = self.Buttons.ConfirmNewDeck =
      self.Containers.NewDeck.find("#button-mab-new-deck-confirm-new-deck");

    self.Inputs = [];
    self.Inputs[self.Inputs.length] = self.Inputs.NewDeckName = self.DOM.find(
      "#input-mab-new-deck-deck-name"
    );
    self.Inputs[self.Inputs.length] = self.Inputs.Select_NewDeckCardCopies =
      self.DOM.find("#select-mab-new-deck-card-copies-list");

    self.Fields = [];
    self.Fields[self.Fields.length] = self.Fields.NewDeckSize = self.DOM.find(
      "#span-mab-new-deck-deck-decksize"
    );
    self.Fields[self.Fields.length] = self.Fields.NewDeckBalance =
      self.DOM.find("#span-mab-new-deck-deckbalance");
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
    self.Buttons.OpenStartNewCampaign_Form.on("click", (e) => {
      e.preventDefault();

      self.mabMainMenu_Close();

      self.startNewMabCampaign_OpenForm();
    });
    self.Inputs.MabCampaignDifficulty_Easy.on("click", (e) => {
      self.paintLabel("easy");
    });
    self.Inputs.MabCampaignDifficulty_Medium.on("click", (e) => {
      self.paintLabel("medium");
    });
    self.Inputs.MabCampaignDifficulty_Hard.on("click", (e) => {
      self.paintLabel("hard");
    });
    self.Buttons.StartNewMabCampaign.on("click", (e) => {
      e.preventDefault();

      self.StartMabCampaign();
    });
    self.Buttons.CloseStartNewCampaign_Form.on("click", (e) => {
      e.preventDefault();

      self.startNewMabCampaign_CloseForm();

      self.mabMainMenu_Open();
    });

    self.Buttons.ContinueMabCampaign.on("click", (e) => {
      e.preventDefault();

      self.ContinueMabCampaign();
    });

    self.Buttons.ActiveMabDeck_ShowContainer.on("click", (e) => {
      e.preventDefault();

      self.mabMainMenu_Close();

      self.activeMabDeck_ShowContainer();
    });
    self.Buttons.ActiveMabDeck_EditDeckName.on("click", (e) => {
      e.preventDefault();

      self.Inputs.ActiveDeck_DeckName.prop("readonly", false)
        .removeClass("current-data")
        .addClass("new-data")
        .trigger("select");

      self.Buttons.ActiveMabDeck_EditDeckName.prop("disabled", true);
      self.Buttons.ActiveMabDeck_UndoDeckNameChange.prop("disabled", false);
      self.Buttons.ActiveMabDeck_ConfirmNewDeckName.prop("disabled", false);
    });
    self.Buttons.ActiveMabDeck_ConfirmNewDeckName.on("click", (e) => {
      e.preventDefault();

      self.ActiveMabDeck_EditDeckName();
    });
    self.Buttons.ActiveMabDeck_UndoDeckNameChange.on("click", (e) => {
      e.preventDefault();

      self.activeMabDeck_RestoreDeckName();
    });
    // Binding the event after inserting into DOM
    $(document).on("click", ".button-unassign-mab-card-copy", function () {
      let index = $(this).data("index");
      let assignedMabCardCopyId = $(this).data("assigned-mab-card-copy-id");

      let mabDeckId = self.MabPlayer_MabDeck.MabDeckId;

      self.UnassignMabCardCopy(index, assignedMabCardCopyId, mabDeckId);
    });
    self.Inputs.ActiveMabDeck_SelectCardCopy.on("select2:select", function (e) {
      const selectedData = e.params.data;

      self.SelectedMabCardCopyId = null;

      self.SelectedMabCardCopyId = selectedData.id;
    });
    self.Buttons.ActiveMabDeck_AssignCardCopy.on("click", (e) => {
      e.preventDefault();

      const mabDeckId = self.MabPlayer_MabDeck.MabDeckId;
      const mabCardCopyId = self.SelectedMabCardCopyId;

      self.AssignMabCardCopy(mabDeckId, mabCardCopyId, true);
    });
    self.Buttons.ActiveDeck_HideContainer.on("click", (e) => {
      e.preventDefault();

      self.activeMabDeck_HideContainer();

      self.mabMainMenu_Open();
    });

    self.Buttons.ShowNewDeckContainer.on("click", (e) => {
      e.preventDefault();

      self.activeMabDeck_HideContainer();

      self.AddMabDeck_AddNewDeck();
    });
    self.Inputs.Select_NewDeckCardCopies.on("select2:select", function (e) {
      const selectedData = e.params.data;

      self.SelectedMabCardCopyId = null;

      self.SelectedMabCardCopyId = selectedData.id;
    });
    self.Buttons.AssignCardCopy.on("click", (e) => {
      e.preventDefault();

      const mabDeckId = self.MabPlayer_MabDeck.MabDeckId;

      self.AddMabDeck_AssignCardCopy(mabDeckId, self.SelectedMabCardCopyId);
    });
    self.Buttons.HideNewDeckContainer.on("click", (e) => {
      e.preventDefault();

      self.addMabDeck_CloseForm();

      self.activeMabDeck_ShowContainer();
    });

    self.Buttons.OpenCampaignStats.on("click", (e) => {
      e.preventDefault();

      self.mabMainMenu_Close();

      self.MabCampaignStats_Open();
    });
    self.Buttons.EditMabPlayerNickname.on("click", (e) => {
      e.preventDefault();

      self.Inputs.Stats_NewNickname.prop("readonly", false)
        .removeClass("current-data")
        .addClass("new-data")
        .trigger("select");

      self.Buttons.EditMabPlayerNickname.prop("disabled", true).addClass(
        "current-data"
      );

      self.Buttons.ConfirmEditMabPlayerNickName.prop(
        "disabled",
        false
      ).removeClass("current-data");
    });
    self.Buttons.ConfirmEditMabPlayerNickName.on("click", (e) => {
      e.preventDefault();

      self.EditMabPlayerNickName();
    });
    self.Buttons.CloseCampaignStats.on("click", (e) => {
      e.preventDefault();

      self.mabCampaignStats_Close();

      self.mabMainMenu_Open();
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

  self.addMabDeck_OpenForm = () => {
    self.toggleContainerVisibility(self.Containers.NewDeck);

    self.Inputs.NewDeckName.val(self.MabPlayer_MabDeck.MabDeckName)
      .trigger("focus")
      .trigger("select");

    self.AddMabDeck_CardCopySelect2_Show();
  };
  self.AddMabDeck_AddNewDeck = () => {
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

        self.MabPlayer_MabDeck = {
          MabDeckId: resp.content.newMabDeckId,
          MabDeckName: resp.content.newMabDeckName,
        };

        self.AddMabDeck_ShowDeckDetails(self.MabPlayer_MabDeck.MabDeckId);

        self.addMabDeck_OpenForm();
      },
      error: (err) => {
        self.sweetAlertError(err);
      },
      complete: () => {},
    });
  };
  self.AddMabDeck_LoadUnassignedCardCopies = () => {
    if (
      self.Inputs.ActiveMabDeck_SelectCardCopy.hasClass(
        "select2-hidden-accessible"
      )
    ) {
      self.Inputs.ActiveMabDeck_SelectCardCopy.select2("destroy");
    }

    const mabDeckId = self.MabPlayer_MabDeck.MabDeckId;

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
        self.Inputs.ActiveMabDeck_SelectCardCopy.empty().append(
          `<option></option>`
        );

        // Builds select2
        self.Inputs.ActiveMabDeck_SelectCardCopy.select2({
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
        self.Inputs.ActiveMabDeck_SelectCardCopy.trigger("change").select2(
          "open"
        );
      })
      .catch((err) => {
        self.sweetAlertError("Error fetching mab player cards:", err);
      });

    self.Containers.ActiveMabDeck_CardCopiesSelect2.removeClass(
      "hide-div"
    ).addClass("show-div");
  };

  self.addMabDeck_buildCardCopiesList = (playerMabCardCopies, olDiv) => {
    playerMabCardCopies.forEach((card, Index) => {
      self.MabDeck_CardIds.push(card.mabCardId);

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
  self.MabCardCopySelection_Hide = () => {
    self.Containers.ActiveMabDeck_CardCopiesSelect2.removeClass(
      "show-div"
    ).addClass("hide-div");
  };

  self.AddMabDeck_ShowDeckDetails = (mabDeckId) => {
    $.ajax({
      type: "GET",
      url: `https://localhost:7081/users/showmabplayerdeckdetails?MabDeckId=${mabDeckId}`,
      xhrFields: { withCredentials: true },
      success: function (response) {
        if (response.content == null) {
          self.sweetAlertError("Error", response.message);
          return;
        }

        self.Inputs.NewDeckName.val();
        self.Fields.NewDeckSize.html();
        self.Fields.NewDeckBalance.html();
        self.AddMabDeck_CardCopiesList.empty();
        self.MabDeck_CardIds = [];
        self.MabDeck_DeckSizeLimit = null;
        self.AddMabDeck_CardCopySelect2_Hide();

        let playerMabDeck = response.content;

        self.MabPlayer_MabDeck = {
          MabDeckId: playerMabDeck.activeMabDeckId,
          MabDeckName: playerMabDeck.activeMabDeckName,
        };

        let mabDeckName = self.MabPlayer_MabDeck.MabDeckName;
        let playerMabCardCopies = playerMabDeck.mabCardCopies;
        let countNeutralCardCopies = 0;
        let countRangedCardCopies = 0;
        let countCalvaryCardCopies = 0;
        let countInfantryCardCopies = 0;
        let mabDeckBalance = "";
        let mabPlayerDeckSize = playerMabCardCopies.length;
        self.MabDeck_DeckSizeLimit = playerMabDeck.mabDeckSizeLimit;

        self.MabDeck_CurrentDeckSize = mabPlayerDeckSize;
        if (self.MabDeck_CurrentDeckSize < self.MabDeck_DeckSizeLimit) {
          self.AddMabDeck_CardCopySelect2_Show();
        }

        self.Inputs.NewDeckName.val(mabDeckName);

        self.Fields.NewDeckSize.html(
          `${mabPlayerDeckSize}/${self.MabDeck_DeckSizeLimit}`
        );

        playerMabCardCopies.forEach((mabCard) => {
          if (mabCard.mabCardType == "Neutral") countNeutralCardCopies++;
          if (mabCard.mabCardType == "Ranged") countRangedCardCopies++;
          if (mabCard.mabCardType == "Cavalry") countCalvaryCardCopies++;
          if (mabCard.mabCardType == "Infantry") countInfantryCardCopies++;
        });

        self.Fields.NewDeck_NeutralTypeCount.html(countNeutralCardCopies);
        self.Fields.NewDeck_RangedTypeCount.html(countRangedCardCopies);
        self.Fields.NewDeck_CavalryTypeCount.html(countCalvaryCardCopies);
        self.Fields.NewDeck_InfantryTypeCount.html(countInfantryCardCopies);

        if (mabPlayerDeckSize <= 0) {
          self.AddMabDeck_CardCopiesList.html(
            `Add up to <span>${self.MabDeck_DeckSizeLimit}</span> cards...`
          );
        } else {
          self.addMabDeck_buildCardCopiesList(
            playerMabCardCopies,
            self.AddMabDeck_CardCopiesList
          );
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
  self.AddMabDeck_AssignCardCopy = (mabDeckId, mabCardCopyId) => {
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

        self.AddMabDeck_ShowDeckDetails(mabDeckId);
      },
      error: (err) => {
        self.sweetAlertError(err);
      },
      complete: () => {},
    });
  };
  self.addMabDeck_buildCardCopiesList = (playerMabCardCopies, olDiv) => {
    playerMabCardCopies.forEach((card, Index) => {
      self.MabDeck_CardIds.push(card.mabCardId);

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
  self.AddMabDeck_CardCopySelect2_Show = () => {
    if (
      self.Inputs.Select_NewDeckCardCopies.hasClass("select2-hidden-accessible")
    ) {
      self.Inputs.Select_NewDeckCardCopies.select2("destroy");
    }

    self.Containers.AddMabDeck_CardCopiesSelect2.removeClass(
      "hide-div"
    ).addClass("show-div");

    // Fetch the mab player cards and their count from the backend
    fetch(`https://localhost:7081/users/listmabplayercardcopies`, {
      method: "GET",
      credentials: "include",
    })
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
  };
  self.AddMabDeck_CardCopySelect2_Hide = () => {
    self.Containers.AddMabDeck_CardCopiesSelect2.removeClass(
      "show-div"
    ).addClass("hide-div");
  };
  self.addMabDeck_CloseForm = () => {
    self.toggleContainerVisibility(self.Containers.NewDeck);
  };

  self.mabMainMenu_Open = () => {
    self.toggleContainerVisibility(self.Containers.MainMenu);
  };
  self.mabMainMenu_Close = () => {
    self.toggleContainerVisibility(self.Containers.MainMenu);
  };

  self.build = () => {
    self.loadReferences();
    self.loadEvents();
  };

  self.build();
}

$(function () {
  new mab_new_deck();
});
