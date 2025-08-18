function medieval_auto_battler() {
  let self = this;
  self.IsBuilt = false;

  self.MabPlayer_ActiveDeck_DeckSize = 0;
  self.MabPlayer_MabDeck = {};
  self.MabPlayer_ActiveDeck_DeckId = null;
  self.MabPlayer_ActiveDeck_DeckName = "";
  self.MabDeck_DeckSizeLimit = null;

  self.SelectedMabCardCopyId = null;
  self.MabDeck_CardIds = [];

  self.loadReferences = () => {
    self.DOM = $("#dom-medieval-auto-battler");

    self.MabContent = self.DOM.find("#mab-content");

    self.MabMenu = self.DOM.find("#mab-menu");

    self.StartNewMabCampaign_Form = self.DOM.find(
      "#form-mab-start-new-campaign"
    );

    self.ActiveMabDeck_CardCopiesList = self.DOM.find(
      "#ol-active-mab-deck-cardcopieslist"
    );
    self.AddMabDeck_CardCopiesList = self.DOM.find(
      "#ol-add-mab-deck-cardcopieslist"
    );

    self.ActoveMabDeck_DeckBalanceChart = self.DOM.find(
      "#canvas-active-mab-deck-deckbalancechart"
    );

    self.Containers = [];
    self.Containers[self.Containers.length] =
      self.Containers.StartNewMabCampaign = self.DOM.find(
        "#container-mab-start-new-campaign-form"
      );
    self.Containers.ManageMabPlayerDecks = self.DOM.find(
      "#container-manage-mab-player-decks"
    );

    self.Containers.ManageDecks_SelectNewMabCard = self.DOM.find(
      "#div-select-manage-mab-deck"
    );
    self.Containers.AddMabPlayerDeck = self.DOM.find("#container-add-mab-deck");
    self.Containers.MabCampaignStats = self.DOM.find(
      "#container-mab-campaign-stats"
    );

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.OpenStartNewCampaign_Form =
      self.DOM.find("#button-mab-start-new-campaign");
    self.Buttons[self.Buttons.length] = self.Buttons.StartNewMabCampaign =
      self.DOM.find("#confirm-mab-start-new-campaign");
    self.Buttons[self.Buttons.length] =
      self.Buttons.CloseStartNewCampaign_Form = self.DOM.find(
        "#button-mab-start-new-campain-close-form"
      );

    self.Buttons[self.Buttons.length] = self.Buttons.ContinueMabCampaign =
      self.DOM.find("#button-continue-mab-campaign");

    self.Buttons[self.Buttons.length] = self.Buttons.OpenManageMabPlayerDecks =
      self.DOM.find("#button-open-manage-mab-player-decks");
    self.Buttons[self.Buttons.length] = self.Buttons.EditActiveMabDeckName =
      self.DOM.find("#button-edit-active-mab-deck-name");
    self.Buttons[self.Buttons.length] =
      self.Buttons.ConfirmActiveMabDeckNewName = self.DOM.find(
        "#button-confirm-active-mab-deck-new-name"
      );
    self.Buttons[self.Buttons.length] =
      self.Buttons.CancelActiveMabDeckNewName = self.DOM.find(
        "#button-cancel-active-mab-deck-new-name"
      );
    self.Buttons[self.Buttons.length] = self.Buttons.ActivateMabCardCopy =
      self.DOM.find("#button-activate-mabcardcopy");
    self.Buttons[self.Buttons.length] = self.Buttons.OpenAddMabDeck =
      self.DOM.find("#button-open-add-mab-deck");
    self.Buttons[self.Buttons.length] = self.Buttons.CloseAddMabDeck =
      self.DOM.find("#button-add-mab-deck-close-form");

    self.Buttons[self.Buttons.length] = self.Buttons.CloseManageMabPlayerDecks =
      self.DOM.find("#button-close-manage-mab-player-decks");

    self.Buttons[self.Buttons.length] = self.Buttons.EditMabPlayerNickname =
      self.DOM.find("#button-edit-mab-player-nickname");
    self.Buttons[self.Buttons.length] =
      self.Buttons.ConfirmEditMabPlayerNickName = self.DOM.find(
        "#button-confirm-edit-mab-player-nickname"
      );
    self.Buttons[self.Buttons.length] =
      self.Buttons.CancelEditMabPlayerNickName = self.DOM.find(
        "#button-cancel-edit-mab-player-nickname"
      );

    self.Buttons[self.Buttons.length] = self.Buttons.AddMabDeck_AddCardCopy =
      self.DOM.find("#button-add-mab-deck-addcardcopy");
    self.Buttons[self.Buttons.length] = self.Buttons.AddMabDeck_ConfirmAddDeck =
      self.DOM.find("#button-add-mab-deck-confirmadddeck");

    self.Buttons[self.Buttons.length] = self.Buttons.OpenCampaignStats =
      self.DOM.find("#button-mab-show-campaign-stats");
    self.Buttons[self.Buttons.length] = self.Buttons.CloseCampaignStats =
      self.DOM.find("#button-mab-close-campaign-stats");

    self.Inputs = [];
    self.Inputs[self.Inputs.length] = self.Inputs.MabPlayer_Nickname =
      self.DOM.find("#mab-campaign-player-nickname");
    self.Inputs[self.Inputs.length] = self.Inputs.MabCampaignDifficulty_Easy =
      self.DOM.find("#mab-campaign-difficulty-easy");
    self.Inputs[self.Inputs.length] = self.Inputs.MabCampaignDifficulty_Medium =
      self.DOM.find("#mab-campaign-difficulty-medium");
    self.Inputs[self.Inputs.length] = self.Inputs.MabCampaignDifficulty_Hard =
      self.DOM.find("#mab-campaign-difficulty-hard");

    self.Inputs[self.Inputs.length] = self.Inputs.ActiveDeck_DeckName =
      self.DOM.find("#mab-active-deck-name");
    self.Inputs.ActiveMabDeck_SelectCardCopy = self.DOM.find(
      "#input-select-manage-mab-deck-selectedcard"
    );

    self.Inputs[self.Inputs.length] = self.Inputs.AddMabDeck_DeckName =
      self.DOM.find("#input-add-mab-deck-deckname");
    self.Inputs[self.Inputs.length] = self.Inputs.AddMabDeck_SelectCardCopy =
      self.DOM.find("#input-add-mab-deck-cardselection");

    self.Inputs[self.Inputs.length] = self.Inputs.Stats_NewNickname =
      self.DOM.find("#mab-stats-player-new-nickname");
    self.Inputs[self.Inputs.length] = self.Inputs.Stats_Level =
      self.DOM.find("#mab-stats-level");
    self.Inputs[self.Inputs.length] = self.Inputs.Stats_GoldStash =
      self.DOM.find("#mab-stats-gold-stash");
    self.Inputs[self.Inputs.length] = self.Inputs.Stats_BattlesCount =
      self.DOM.find("#mab-stats-battles-count");
    self.Inputs[self.Inputs.length] = self.Inputs.Stats_BattlesWon =
      self.DOM.find("#mab-stats-battles-won");
    self.Inputs[self.Inputs.length] = self.Inputs.Stats_BattlesLost =
      self.DOM.find("#mab-stats-battles-lost");
    self.Inputs[self.Inputs.length] = self.Inputs.Stats_BoostersOpened =
      self.DOM.find("#mab-stats-boosters-opened");
    self.Inputs[self.Inputs.length] = self.Inputs.Stats_BoostersOpened =
      self.DOM.find("#mab-stats-boosters-opened");

    self.Fields = [];
    self.Fields[self.Fields.length] = self.Fields.ActiveMabDeck_DeckSize =
      self.DOM.find("#span-active-mab-deck-decksize");
    self.Fields[self.Fields.length] = self.Fields.ActiveMabDeck_DeckBalance =
      self.DOM.find("#span-active-mab-deck-deckbalance");
    self.Fields[self.Fields.length] =
      self.Fields.ActiveMabDecks_NeutralTypeCount =
        self.Fields.ActiveMabDeck_DeckBalance.find(
          ".strong-manage-mab-decks-neutral-type-count"
        );
    self.Fields[self.Fields.length] =
      self.Fields.ActiveMabDeck_RangedTypeCount =
        self.Fields.ActiveMabDeck_DeckBalance.find(
          ".span-manage-mab-decks-ranged-type-count"
        );
    self.Fields[self.Fields.length] =
      self.Fields.ActiveMabDeck_CavalryTypeCount =
        self.Fields.ActiveMabDeck_DeckBalance.find(
          ".span-manage-mab-decks-cavalry-type-count"
        );
    self.Fields[self.Fields.length] =
      self.Fields.ActiveMabDeck_InfantryTypeCount =
        self.Fields.ActiveMabDeck_DeckBalance.find(
          ".span-manage-mab-decks-infantry-type-count"
        );

    self.Fields[self.Fields.length] = self.Fields.AddMabDeck_DeckSize =
      self.DOM.find("#span-add-mab-deck-decksize");
    self.Fields[self.Fields.length] = self.Fields.AddMabDeck_DeckBalance =
      self.DOM.find("#span-add-mab-deck-deckbalance");
    self.Fields[self.Fields.length] = self.Fields.AddMabDeck_NeutralTypeCount =
      self.Fields.AddMabDeck_DeckBalance.find(
        ".strong-manage-mab-decks-neutral-type-count"
      );
    self.Fields[self.Fields.length] = self.Fields.AddMabDeck_RangedTypeCount =
      self.Fields.AddMabDeck_DeckBalance.find(
        ".span-manage-mab-decks-ranged-type-count"
      );
    self.Fields[self.Fields.length] = self.Fields.AddMabDeck_CavalryTypeCount =
      self.Fields.AddMabDeck_DeckBalance.find(
        ".span-manage-mab-decks-cavalry-type-count"
      );
    self.Fields[self.Fields.length] = self.Fields.AddMabDeck_InfantryTypeCount =
      self.Fields.AddMabDeck_DeckBalance.find(
        ".span-manage-mab-decks-infantry-type-count"
      );

    self.Imgs = [];
    self.Imgs[self.Imgs.length] = self.Imgs.Trophy_AllCardsCollected =
      self.DOM.find("#allcardscollected-trophy");
    self.Imgs[self.Imgs.length] = self.Imgs.Trophy_AllNpcsDefeated =
      self.DOM.find("#allnpcsdefeated-trophy");

    self.DifficultyLabels = [];
    self.DifficultyLabels[self.DifficultyLabels.length] =
      self.DifficultyLabels.Easy = self.DOM.find(
        "#text-mab-campaign-difficulty-easy"
      );
    self.DifficultyLabels[self.DifficultyLabels.length] =
      self.DifficultyLabels.Medium = self.DOM.find(
        "#text-mab-campaign-difficulty-medium"
      );
    self.DifficultyLabels[self.DifficultyLabels.length] =
      self.DifficultyLabels.Hard = self.DOM.find(
        "#text-mab-campaign-difficulty-hard"
      );
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

    self.Buttons.OpenManageMabPlayerDecks.on("click", (e) => {
      e.preventDefault();

      self.mabMainMenu_Close();

      self.manageMabPlayerDecks_Open();
    });
    self.Buttons.EditActiveMabDeckName.on("click", (e) => {
      e.preventDefault();

      self.Inputs.ActiveDeck_DeckName.prop("readonly", false)
        .removeClass("current-data")
        .addClass("new-data")
        .trigger("select");

      self.Buttons.EditActiveMabDeckName.prop("disabled", true);
      self.Buttons.CancelActiveMabDeckNewName.prop("disabled", false);
      self.Buttons.ConfirmActiveMabDeckNewName.prop("disabled", false);
    });
    self.Buttons.ConfirmActiveMabDeckNewName.on("click", (e) => {
      e.preventDefault();

      self.EditActiveMabDeckName();
    });
    self.Buttons.CancelActiveMabDeckNewName.on("click", (e) => {
      e.preventDefault();

      self.restoreMabDeckNameInput();
    });
    // Binding the event after inserting into DOM
    $(document).on("click", ".button-mab-deactivate-cardcopy", function () {
      let index = $(this).data("index");
      let mabCardCopyId = $(this).data("mab-card-copy-id");
      self.DeactivateMabCardCopy(
        index,
        mabCardCopyId,
        self.MabPlayer_ActiveDeck_DeckId
      );
    });
    self.Inputs.ActiveMabDeck_SelectCardCopy.on("select2:select", function (e) {
      const selectedData = e.params.data;

      self.SelectedMabCardCopyId = null;

      self.SelectedMabCardCopyId = selectedData.id;
    });
    self.Buttons.ActivateMabCardCopy.on("click", (e) => {
      e.preventDefault();

      self.ActivateMabCardCopy(self.SelectedMabCardCopyId);
    });
    self.Buttons.CloseManageMabPlayerDecks.on("click", (e) => {
      e.preventDefault();

      self.manageMabPlayerDecks_Close();

      self.mabMainMenu_Open();
    });

    self.Buttons.OpenAddMabDeck.on("click", (e) => {
      e.preventDefault();

      self.manageMabPlayerDecks_Close();

      self.AddMabPlayerDeck();
    });

    self.Inputs.AddMabDeck_SelectCardCopy.on("select2:select", function (e) {
      const selectedData = e.params.data;

      self.SelectedMabCardCopyId = null;

      self.SelectedMabCardCopyId = selectedData.id;
    });
    self.Buttons.AddMabDeck_AddCardCopy.on("click", (e) => {
      self.ActivateMabCardCopy(self.SelectedMabCardCopyId);
    });
    self.Buttons.CloseAddMabDeck.on("click", (e) => {
      e.preventDefault();

      self.addMabDeckForm_Close();

      self.manageMabPlayerDecks_Open();
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

  function sweetAlertSuccess(title_text, message_text) {
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
  }
  function sweetAlertError(title_text, message_text) {
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
        document.addEventListener("keydown", closeOnAnyKey);
      },
      willClose: () => {
        // Clean up listener when modal closes
        document.removeEventListener("keydown", closeOnAnyKey);
      },
    });
  }
  function closeOnAnyKey() {
    Swal.close();
  }

  self.toggleVisibility = (div) => {
    self.Containers.forEach((container) => {
      container.addClass("hide-div");
    });

    div.hasClass("show-div")
      ? div.removeClass("show-div").addClass("hide-div")
      : div.removeClass("hide-div").addClass("show-div");
  };

  self.mabMainMenu_Open = () => {
    self.toggleVisibility(self.MabMenu);
  };
  self.mabMainMenu_Close = () => {
    self.toggleVisibility(self.MabMenu);
  };

  self.startNewMabCampaign_OpenForm = () => {
    self.toggleVisibility(self.Containers.StartNewMabCampaign);
    self.Inputs.MabPlayer_Nickname.trigger("focus");
  };
  self.paintLabel = (difficulty) => {
    self.DifficultyLabels.Easy.removeClass("paint-green");
    self.DifficultyLabels.Medium.removeClass("paint-yellow");
    self.DifficultyLabels.Hard.removeClass("paint-red");

    switch (difficulty) {
      case "medium":
        self.DifficultyLabels.Medium.addClass("paint-yellow");
        return;
      case "hard":
        self.DifficultyLabels.Hard.addClass("paint-red");
        return;
      default:
        self.DifficultyLabels.Easy.addClass("paint-green");
        return;
    }
  };
  self.StartMabCampaign = () => {
    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/startmabcampaign",
      data: self.StartNewMabCampaign_Form.serialize(),
      xhrFields: {
        withCredentials: true,
      },
      success: (response) => {
        if (!response.content) {
          sweetAlertError(response.message);
          return;
        }

        self.TriggerMabBattle();
      },
      error: (err) => {
        sweetAlertError(err);
      },
      complete: () => {
        // Re-enable button
        submitBtn.attr("disabled", true).text(originalBtnText);
      },
    });
  };
  self.TriggerMabBattle = () => {};
  self.startNewMabCampaign_CloseForm = () => {
    self.Inputs.MabPlayer_Nickname.val("");

    self.toggleVisibility(self.Containers.StartNewMabCampaign);
  };

  self.manageMabPlayerDecks_Open = () => {
    self.toggleVisibility(self.Containers.ManageMabPlayerDecks);

    self.ShowMabPlayer_ActiveDeckDetails();
  };
  self.ShowMabPlayer_ActiveDeckDetails = () => {
    //! Corrigir este endpoint!
    $.ajax({
      type: "GET",
      url: `https://localhost:7081/users/showmabplayerdeckdetails`,
      xhrFields: { withCredentials: true },
      success: function (response) {
        if (response.content == null) {
          sweetAlertError("Error", response.message);
          return;
        }

        self.Inputs.ActiveDeck_DeckName.val();
        self.Fields.ActiveMabDeck_DeckSize.html();
        self.Fields.ActiveMabDeck_DeckBalance.html();
        self.ActiveMabDeck_CardCopiesList.empty();
        self.MabDeck_CardIds = [];
        self.MabPlayer_ActiveDeck_DeckSize = 0;
        self.MabDeck_DeckSizeLimit = null;
        self.MabCardCopySelection_Hide();

        let activeMabDeck = response.content;

        self.MabPlayer_ActiveDeck_DeckId = activeMabDeck.activeMabDeckId;

        self.MabPlayer_ActiveDeck_DeckName = activeMabDeck.activeMabDeckName;

        let activeMabCardCopies = activeMabDeck.mabCardCopies;
        let countNeutralCardCopies = 0;
        let countRangedCardCopies = 0;
        let countCalvaryCardCopies = 0;
        let countInfantryCardCopies = 0;
        let mabDeckBalance = "";
        self.MabDeck_DeckSizeLimit = activeMabDeck.mabDeckSizeLimit;

        self.MabPlayer_ActiveDeck_DeckSize = activeMabCardCopies.length;
        if (self.MabPlayer_ActiveDeck_DeckSize < self.MabDeck_DeckSizeLimit) {
          self.MabCardCopySelection_DisplayForEditDeck();
        }

        self.Inputs.ActiveDeck_DeckName.val(
          self.MabPlayer_ActiveDeck_DeckName
        ).css("color", "var(--main-color)");

        self.Fields.ActiveMabDeck_DeckSize.html(
          `${self.MabPlayer_ActiveDeck_DeckSize}/${self.MabDeck_DeckSizeLimit}`
        );

        activeMabCardCopies.forEach((mabCard) => {
          if (mabCard.mabCardType == "Neutral") countNeutralCardCopies++;
          if (mabCard.mabCardType == "Ranged") countRangedCardCopies++;
          if (mabCard.mabCardType == "Cavalry") countCalvaryCardCopies++;
          if (mabCard.mabCardType == "Infantry") countInfantryCardCopies++;
        });

        self.Fields.ActiveMabDecks_NeutralTypeCount.html(
          countNeutralCardCopies
        );
        self.Fields.ActiveMabDeck_RangedTypeCount.html(countRangedCardCopies);
        self.Fields.ActiveMabDeck_CavalryTypeCount.html(countCalvaryCardCopies);
        self.Fields.ActiveMabDeck_InfantryTypeCount.html(
          countInfantryCardCopies
        );

        self.buildMabCardCopiesList(
          activeMabCardCopies,
          self.ActiveMabDeck_CardCopiesList
        );

        self.buildMabDeckBalanceChart(
          countNeutralCardCopies,
          countRangedCardCopies,
          countCalvaryCardCopies,
          countInfantryCardCopies
        );
      },
      error: function (xhr, status, error) {
        sweetAlertError(
          "Failed to fetch active deck details. Try again later."
        );
      },
      complete: function () {},
    });
  };
  self.EditActiveMabDeckName = () => {
    let activeMabDeckNewName = self.Inputs.ActiveDeck_DeckName.val().trim();

    if (!activeMabDeckNewName || activeMabDeckNewName.length < 1) {
      sweetAlertError("Please fill the Mab Deck Name field!");

      return self.Inputs.ActiveDeck_DeckName.trigger("select");
    }

    if (
      activeMabDeckNewName.toLowerCase().trim() ===
      self.MabPlayer_ActiveDeck_DeckName.toLowerCase().trim()
    ) {
      self.restoreMabDeckNameInput();
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
          sweetAlertError(resp.message);
          return;
        }

        self.MabPlayer_ActiveDeck_DeckName =
          self.Inputs.ActiveDeck_DeckName.val();

        sweetAlertSuccess(resp.message);

        self.restoreMabDeckNameInput();
      },
      error: (err) => {
        sweetAlertError(err);
      },
      complete: () => {},
    });
  };
  self.restoreMabDeckNameInput = () => {
    self.Inputs.ActiveDeck_DeckName.val("");

    setTimeout((e) => {
      self.Inputs.ActiveDeck_DeckName.val(self.MabPlayer_ActiveDeck_DeckName)
        .prop("readonly", true)
        .removeClass("new-data")
        .addClass("current-data")
        .blur();
    }, 10);

    self.Buttons.EditActiveMabDeckName.prop("disabled", false);

    self.Buttons.ConfirmActiveMabDeckNewName.prop("disabled", true);

    self.Buttons.CancelActiveMabDeckNewName.prop("disabled", true);
  };
  self.buildMabCardCopiesList = (playerMabCardCopies, olDiv) => {
    self.ActiveMabDeck_CardCopiesList.html("");
    self.AddMabDeck_CardCopiesList.html("");

    playerMabCardCopies.forEach((card, Index) => {
      self.MabDeck_CardIds.push(card.mabCardId);

      let mabCardCopyId = card.mabCardCopyId;
      let mabCardName = card.mabCardName;
      let mabCardLvl = card.mabCardLevel;
      let mabCardType = card.mabCardType;
      let mabCardPower = card.mabCardPower;
      let mabCardUpperHand = card.mabCardUpperHand;

      let listItem = `
          <li id="li-mab-${Index}" data-mab-card-copy-id="${mabCardCopyId}">
            <div class="d-flex flex-row align-items-center gap-2">
              <button
                class="button-mab-deactivate-cardcopy btn btn-outline-danger p-0 m-0"
                type="button"
                data-mab-card-copy-id="${mabCardCopyId}"
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
  self.DeactivateMabCardCopy = (index, mabCardCopyId) => {
    self.MabDeck_CardIds.splice(index, 1);

    self.ActiveMabDeck_CardCopiesList.find(`#li-mab-${index}`).remove();

    $.ajax({
      type: "PUT",
      url: "https://localhost:7081/users/deactivatemabcardcopy",
      data: JSON.stringify({
        MabCardCopyId: mabCardCopyId,
      }),
      contentType: "application/json",
      xhrFields: {
        withCredentials: true,
      },
      success: (resp) => {
        if (!resp.content) {
          sweetAlertError("Failed to deactivated card", resp.message);
          return;
        }

        self.ShowMabPlayer_ActiveDeckDetails();
      },
      error: (err) => {
        sweetAlertError(err);
      },
      complete: () => {},
    });
  };
  self.ActivateMabCardCopy = (mabCardCopyId) => {
    $.ajax({
      type: "PUT",
      url: "https://localhost:7081/users/activatemabcardcopy",
      data: JSON.stringify({
        MabCardCopyId: mabCardCopyId,
        ActiveMabDeckId: self.MabPlayer_ActiveDeck_DeckId,
      }),
      contentType: "application/json",
      xhrFields: {
        withCredentials: true,
      },
      success: (resp) => {
        if (!resp.content) {
          sweetAlertError("Failed to activated card", resp.message);
          return;
        }

        self.ShowMabPlayer_ActiveDeckDetails();
      },
      error: (err) => {
        sweetAlertError(err);
      },
      complete: () => {},
    });
  };
  self.MabCardCopySelection_DisplayForEditDeck = () => {
    if (
      self.Inputs.ActiveMabDeck_SelectCardCopy.hasClass(
        "select2-hidden-accessible"
      )
    ) {
      self.Inputs.ActiveMabDeck_SelectCardCopy.select2("destroy");
    }

    // Fetch the mab player cards and their count from the backend
    fetch(
      `https://localhost:7081/users/listinactivemabcardcopies?ActiveMabDeckId=${self.MabPlayer_ActiveDeck_DeckId}`,
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
        sweetAlertError("Error fetching mab player cards:", err);
      });

    self.Containers.ManageDecks_SelectNewMabCard.removeClass(
      "hide-div"
    ).addClass("show-div");
  };
  self.buildMabDeckBalanceChart = (countNtl, countRng, countCav, countInf) => {
    let dynamicLabel = [];
    let countTypes = [];

    if (countNtl > 0) {
      dynamicLabel.push("Neutral");
      countTypes.push(countNtl);
    }
    if (countRng > 0) {
      dynamicLabel.push("Ranged");
      countTypes.push(countRng);
    }
    if (countCav > 0) {
      dynamicLabel.push("Cavalry");
      countTypes.push(countCav);
    }
    if (countInf > 0) {
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
            max: self.MabDeck_DeckSizeLimit,
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
                y: chart.chartArea.top + 15,
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
      self.ActoveMabDeck_DeckBalanceChart,
      chartConfigs
    );
  };
  self.MabCardCopySelection_Hide = () => {
    self.Containers.ManageDecks_SelectNewMabCard.removeClass(
      "show-div"
    ).addClass("hide-div");
  };

  self.addMabDeckForm_Open = () => {
    self.toggleVisibility(self.Containers.AddMabPlayerDeck);

    self.Inputs.AddMabDeck_DeckName.val(self.MabPlayer_MabDeck.MabDeckName)
      .trigger("focus")
      .trigger("select");

    self.MabCardCopySelection_DisplayForNewDeck();
  };
  self.AddMabPlayerDeck = () => {
    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/addmabplayerdeck",
      xhrFields: {
        withCredentials: true,
      },
      success: (resp) => {
        if (!resp.content) {
          sweetAlertError(resp.message);

          return;
        }

        self.MabPlayer_MabDeck = {
          newMabDeckId: resp.content.newMabDeckId,
          MabDeckName: resp.content.newMabDeckName,
        };

        self.ShowMabPlayer_DeckDetails(self.MabPlayer_MabDeck.newMabDeckId);

        self.addMabDeckForm_Open();
      },
      error: (err) => {
        sweetAlertError(err);
      },
      complete: () => {},
    });
  };
  self.ShowMabPlayer_DeckDetails = (mabDeckId) => {
    //! Corrigir este endpoint!
    $.ajax({
      type: "GET",
      url: `https://localhost:7081/users/showmabplayerdeckdetails?MabDeckId=${mabDeckId}`,
      xhrFields: { withCredentials: true },
      success: function (response) {
        if (response.content == null) {
          sweetAlertError("Error", response.message);
          return;
        }

        self.Inputs.AddMabDeck_DeckName.val();
        self.Fields.AddMabDeck_DeckSize.html();
        self.Fields.AddMabDeck_DeckBalance.html();
        self.AddMabDeck_CardCopiesList.empty();
        self.MabDeck_CardIds = [];
        self.MabDeck_DeckSizeLimit = null;

        let playerMabDeck = response.content;

        self.MabPlayer_ActiveDeck_DeckId = playerMabDeck.activeMabDeckId;

        self.MabPlayer_ActiveDeck_DeckName = playerMabDeck.activeMabDeckName;

        let playerMabCardCopies = playerMabDeck.mabCardCopies;
        let countNeutralCardCopies = 0;
        let countRangedCardCopies = 0;
        let countCalvaryCardCopies = 0;
        let countInfantryCardCopies = 0;
        let mabDeckBalance = "";
        let mabPlayerDeckSize = playerMabCardCopies.length;
        self.MabDeck_DeckSizeLimit = playerMabDeck.mabDeckSizeLimit;

        self.Inputs.ActiveDeck_DeckName.val(
          self.MabPlayer_ActiveDeck_DeckName
        ).css("color", "var(--main-color)");

        self.Fields.AddMabDeck_DeckSize.html(
          `${mabPlayerDeckSize}/${self.MabDeck_DeckSizeLimit}`
        );

        playerMabCardCopies.forEach((mabCard) => {
          if (mabCard.mabCardType == "Neutral") countNeutralCardCopies++;
          if (mabCard.mabCardType == "Ranged") countRangedCardCopies++;
          if (mabCard.mabCardType == "Cavalry") countCalvaryCardCopies++;
          if (mabCard.mabCardType == "Infantry") countInfantryCardCopies++;
        });

        self.Fields.AddMabDeck_NeutralTypeCount.html(countNeutralCardCopies);
        self.Fields.AddMabDeck_RangedTypeCount.html(countRangedCardCopies);
        self.Fields.AddMabDeck_CavalryTypeCount.html(countCalvaryCardCopies);
        self.Fields.AddMabDeck_InfantryTypeCount.html(countInfantryCardCopies);

        self.buildMabCardCopiesList(
          playerMabCardCopies,
          self.AddMabDeck_CardCopiesList
        );
      },
      error: function (xhr, status, error) {
        sweetAlertError(
          "Failed to fetch active deck details. Try again later."
        );
      },
      complete: function () {},
    });
  };
  self.MabCardCopySelection_DisplayForNewDeck = () => {
    if (
      self.Inputs.ActiveMabDeck_SelectCardCopy.hasClass(
        "select2-hidden-accessible"
      )
    ) {
      self.Inputs.ActiveMabDeck_SelectCardCopy.select2("destroy");
    }

    if (
      self.Inputs.AddMabDeck_SelectCardCopy.hasClass(
        "select2-hidden-accessible"
      )
    ) {
      self.Inputs.AddMabDeck_SelectCardCopy.select2("destroy");
    }

    // Fetch the mab player cards and their count from the backend
    fetch(`https://localhost:7081/users/listmabplayercardcopies`, {
      method: "GET",
      credentials: "include",
    })
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
        self.Inputs.AddMabDeck_SelectCardCopy.empty().append(
          `<option></option>`
        );

        // Builds select2
        self.Inputs.AddMabDeck_SelectCardCopy.select2({
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
        sweetAlertError("Error fetching mab player cards:", err);
      });
  };

  self.addMabDeckForm_Close = () => {
    self.toggleVisibility(self.Containers.AddMabPlayerDeck);
  };
  self.manageMabPlayerDecks_Close = () => {
    self.toggleVisibility(self.Containers.ManageMabPlayerDecks);
  };

  self.ContinueMabCampaign = () => {};

  self.MabCampaignStats_Open = () => {
    self.toggleVisibility(self.Containers.MabCampaignStats);

    $.ajax({
      type: "GET",
      url: `https://localhost:7081/users/showmabcampaignstatistics`,
      xhrFields: { withCredentials: true },
      success: function (response) {
        if (!response.content) {
          sweetAlertError(response.message_text);
          return;
        }

        let mabCampaignDB = response.content;
        self.Inputs.Stats_NewNickname.val(mabCampaignDB.mabPlayerNickName).css(
          "color",
          "var(--main-color)"
        );
        self.Inputs.Stats_Level.html(
          `<span>${mabCampaignDB.playerLevel}</span>`
        );
        self.Inputs.Stats_GoldStash.html(
          `<span>${mabCampaignDB.goldstash}</span>`
        );
        self.Inputs.Stats_BattlesCount.html(
          `<span>${mabCampaignDB.countMatches}</span>`
        );
        self.Inputs.Stats_BattlesWon.html(
          `<span>${mabCampaignDB.countVictories}</span>`
        );
        self.Inputs.Stats_BattlesLost.html(
          `<span>${mabCampaignDB.countDefeats}</span>`
        );
        self.Inputs.Stats_BoostersOpened.html(
          `<span>${mabCampaignDB.countBoosters}</span>`
        );

        console.log(
          "mabCampaignDB.allCardsCollectedTrophy: ",
          mabCampaignDB.allCardsCollectedTrophy
        );
        if (mabCampaignDB.allCardsCollectedTrophy == true) {
          self.Imgs.Trophy_AllCardsCollected.attr(
            "src",
            "/images/icons/trophy_allcardscollected_achieved.svg"
          );
        }

        console.log(
          "mabCampaignDB.allNpcsDefeatedTrophy: ",
          mabCampaignDB.allNpcsDefeatedTrophy
        );
        if (mabCampaignDB.allNpcsDefeatedTrophy == true) {
          self.Imgs.Trophy_AllNpcsDefeated.attr(
            "src",
            "/images/icons/trophy_allnpcsdefeated_achieved.svg"
          );
        }
      },
      error: function (xhr, status, error) {
        sweetAlertError("Could not load life counter");
      },
    });
  };
  self.EditMabPlayerNickName = () => {
    let newMabPlayerNickname = self.Inputs.Stats_NewNickname.val().trim();

    if (!newMabPlayerNickname || newMabPlayerNickname.length < 1) {
      sweetAlertError("Please fill the Nickname field!");

      return;
    }

    $.ajax({
      type: "PUT",
      url: "https://localhost:7081/users/editmabplayernickname",
      data: JSON.stringify({
        NewMabPlayerNickname: newMabPlayerNickname,
      }),
      contentType: "application/json",
      xhrFields: {
        withCredentials: true,
      },
      success: (resp) => {
        if (resp.content === null) {
          sweetAlertError(resp.message);
          return;
        }
      },
      error: (err) => {
        sweetAlertError(err);
      },
      complete: () => {},
    });
  };
  self.mabCampaignStats_Close = () => {
    self.toggleVisibility(self.Containers.MabCampaignStats);
  };

  self.build = () => {
    self.loadReferences();
    self.loadEvents();
  };

  self.build();
}

$(function () {
  new medieval_auto_battler();
});
