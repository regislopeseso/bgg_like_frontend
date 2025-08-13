function medieval_auto_battler() {
  let self = this;
  self.IsBuilt = false;

  self.DeckSizeLimit = null;
  self.CurrentDeckSize = 0;
  self.SelectedCardId = null;
  self.Deck_CardIds = [];

  self.LoadReferences = () => {
    self.DOM = $("#dom-medieval-auto-battler");

    self.MabContent = self.DOM.find("#mab-content");

    self.MabMenu = self.DOM.find("#mab-menu");

    self.StartNewMabCampaign_Form = self.DOM.find(
      "#form-mab-start-new-campaign"
    );
    self.ActiveDeck_CardsList = self.DOM.find("#ol-mab-player-cardsList");

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
    self.Containers.CreateMabDeck = self.DOM.find("#container-add-mab-deck");
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

    self.Inputs[self.Inputs.length] =
      self.Inputs.ManageDecks_ActiveDeck_DeckName = self.DOM.find(
        "#mab-active-deck-name"
      );
    self.Inputs.ManageDecks_SelectNewMabCard = self.DOM.find(
      "#input-select-manage-mab-deck-selectedcard"
    );

    self.Inputs[self.Inputs.length] = self.Inputs.AddMabDeck_DeckName =
      self.DOM.find("#input-add-mab-deck-deckname");

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

  self.LoadEvents = () => {
    self.Buttons.OpenStartNewCampaign_Form.on("click", (e) => {
      e.preventDefault();

      self.MabMainMenu_Close();

      self.StartNewMabCampaign_OpenForm();
    });
    self.Inputs.MabCampaignDifficulty_Easy.on("click", (e) => {
      self.PaintLabel("easy");
    });
    self.Inputs.MabCampaignDifficulty_Medium.on("click", (e) => {
      self.PaintLabel("medium");
    });
    self.Inputs.MabCampaignDifficulty_Hard.on("click", (e) => {
      self.PaintLabel("hard");
    });
    self.Buttons.StartNewMabCampaign.on("click", (e) => {
      e.preventDefault();

      self.StartMabCampaign();
    });
    self.Buttons.CloseStartNewCampaign_Form.on("click", (e) => {
      e.preventDefault();

      self.StartNewMabCampaign_CloseForm();

      self.MabMainMenu_Open();
    });

    self.Buttons.ContinueMabCampaign.on("click", (e) => {
      e.preventDefault();

      self.ContinueMabCampaign();
    });

    self.Buttons.OpenManageMabPlayerDecks.on("click", (e) => {
      e.preventDefault();

      self.MabMainMenu_Close();

      self.ManageMabPlayerDecks_Open();
    });
    self.Buttons.OpenAddMabDeck.on("click", (e) => {
      e.preventDefault();

      self.ManageMabPlayerDecks_Close();

      self.AddMabDeckForm_Open();
    });
    self.Buttons.CloseAddMabDeck.on("click", (e) => {
      e.preventDefault();

      self.AddMabDeckForm_Close();

      self.ManageMabPlayerDecks_Open();
    });
    self.Buttons.CloseManageMabPlayerDecks.on("click", (e) => {
      e.preventDefault();

      self.ManageMabPlayerDecks_Close();

      self.MabMainMenu_Open();
    });

    self.Buttons.OpenCampaignStats.on("click", (e) => {
      e.preventDefault();

      self.MabMainMenu_Close();

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

      self.MabCampaignStats_Close();

      self.MabMainMenu_Open();
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

  self.ToggleVisibility = (div) => {
    self.Containers.forEach((container) => {
      container.addClass("hide-div");
    });

    div.hasClass("show-div")
      ? div.removeClass("show-div").addClass("hide-div")
      : div.removeClass("hide-div").addClass("show-div");
  };

  self.MabMainMenu_Open = () => {
    self.ToggleVisibility(self.MabMenu);
  };
  self.MabMainMenu_Close = () => {
    self.ToggleVisibility(self.MabMenu);
  };

  self.StartNewMabCampaign_OpenForm = () => {
    self.ToggleVisibility(self.Containers.StartNewMabCampaign);
    self.Inputs.MabPlayer_Nickname.trigger("focus");
  };
  self.PaintLabel = (difficulty) => {
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
  self.StartNewMabCampaign_CloseForm = () => {
    self.Inputs.MabPlayer_Nickname.val("");

    self.ToggleVisibility(self.Containers.StartNewMabCampaign);
  };

  self.ManageMabPlayerDecks_Open = () => {
    self.ToggleVisibility(self.Containers.ManageMabPlayerDecks);

    self.FetchMabPlayerActiveDeck();
  };
  self.FetchMabPlayerActiveDeck = () => {
    $.ajax({
      type: "GET",
      url: "https://localhost:7081/users/showactivemabdeckdetails",
      xhrFields: { withCredentials: true },
      success: function (response) {
        if (response.content == null) {
          sweetAlertError("Error", response.message);
          return;
        }

        let activeMabDeck = response.content;
        let activeMabDeckId = response.content.activeMabDeckId;
        let activeMabDeckName = activeMabDeck.activeMabDeckName;
        let activeMabCards = activeMabDeck.activeMabPlayerCards;

        self.Inputs.ManageDecks_ActiveDeck_DeckName.html();
        self.ActiveDeck_CardsList.empty();
        self.Deck_CardIds = [];
        self.CurrentDeckSize = 0;
        self.DeckSizeLimit = null;
        self.NewMabCardSelection_Hide();

        self.DeckSizeLimit = response.content.deckSizeLimit;
        self.CurrentDeckSize = activeMabCards.length;

        self.Inputs.ManageDecks_ActiveDeck_DeckName.html(
          `<h4 class="m-0 p-0">${activeMabDeckName}</h4>`
        );

        activeMabCards.forEach((card, Index) => {
          self.Deck_CardIds.push(card.mabCardId);

          let cardId = card.mabCardId;
          let cardName = card.mabCardName;
          let cardLvl = card.mabCardLevel;
          let cardType = card.mabCardType;
          let cardPower = card.mabCardPower;
          let cardUpperHand = card.mabCardUpperHand;

          let listItem = `
          <li id="li-mab-${Index}" data-card-id="${cardId}">
            <div class="d-flex flex-row align-items-center gap-2">
              <button
                class="button-mab-current-deck-removecard btn btn-outline-danger p-0 m-0"
                type="button"
                data-card-id="${cardId}"
                data-index="${Index}"
              >
                <i class="fa-solid fa-xmark p-1 m-0"></i>
              </button>

              <strong class="mab-card-name p-0 m-0">${cardName}</strong>

              <img
                src="/images/icons/io_arrow_right.svg"
                class="bi bi-arrow p-0 m-0"
              />

              <div class="mab-card-data">
                <span>L</span>evel: <strong>${cardLvl}</strong>,
                <span>T</span>ype: <strong>${cardType}</strong>,
                <span>P</span>ower: <strong>${cardPower}</strong>,
                <span>U</span>pper <span>H</span>and:
                <strong>${cardUpperHand}</strong>
              </div>
            </div>
          </li>
          `;

          self.ActiveDeck_CardsList.append(listItem);
        });
        // Binding the event after inserting into DOM
        $(document).on(
          "click",
          ".button-mab-current-deck-removecard",
          function () {
            let index = $(this).data("index");
            let cardId = $(this).data("card-id");
            self.RemoveCurrentMabCard(index, cardId);
            self.NewMabCardSelection_Display();
          }
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
  self.RemoveCurrentMabCard = (index, cardId) => {
    console.log("self.Deck_CardIds: ", self.Deck_CardIds);
    self.Deck_CardIds.splice(index, 1);
    self.ActiveDeck_CardsList.find(`#li-mab-${index}`).remove();
  };
  self.NewMabCardSelection_Display = () => {
    if (
      self.Inputs.ManageDecks_SelectNewMabCard.hasClass(
        "select2-hidden-accessible"
      )
    ) {
      self.Inputs.ManageDecks_SelectNewMabCard.select2("destroy");
    }

    // Fetch the mab player cards and their count from the backend
    fetch("https://localhost:7081/users/listinactivemabcardcopies", {
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
          id: item.mabCardId,
          text: item.mabCardDescription,
        }));

        // Clear previous options and add empty one
        self.Inputs.ManageDecks_SelectNewMabCard.empty().append(
          `<option></option>`
        );

        self.Inputs.ManageDecks_SelectNewMabCard.select2({
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

    self.Containers.ManageDecks_SelectNewMabCard.removeClass(
      "hide-div"
    ).addClass("show-div");
  };
  self.NewMabCardSelection_Hide = () => {
    self.Containers.ManageDecks_SelectNewMabCard.removeClass(
      "show-div"
    ).addClass("hide-div");
  };

  self.AddMabDeckForm_Open = () => {
    self.ToggleVisibility(self.Containers.CreateMabDeck);

    self.Inputs.AddMabDeck_DeckName.trigger("focus");
  };
  self.CreateMabDeck = () => {
    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/addmabdeck",
      data: self.Form.serialize(),
      xhrFields: {
        withCredentials: true,
      },
      contentType: "application/json",
      data: JSON.stringify({
        MabDeckName: self.Inputs.MabNpcName.val(),
        MabCardIds: self.Deck_CardIds,
      }),
      success: (resp) => {
        if (!resp.content) {
          sweetAlertError(resp.message);

          return;
        }
        sweetAlertSuccess(resp.message);
      },
      error: (err) => {
        sweetAlertError(err);
      },
      complete: () => {},
    });
  };
  self.AddMabDeckForm_Close = () => {
    self.ToggleVisibility(self.Containers.CreateMabDeck);
  };
  self.ManageMabPlayerDecks_Close = () => {
    self.ToggleVisibility(self.Containers.ManageMabPlayerDecks);
  };

  self.ContinueMabCampaign = () => {};

  self.MabCampaignStats_Open = () => {
    self.ToggleVisibility(self.Containers.MabCampaignStats);

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
  self.MabCampaignStats_Close = () => {
    self.ToggleVisibility(self.Containers.MabCampaignStats);
  };

  self.Build = () => {
    self.LoadReferences();
    self.LoadEvents();
  };

  self.Build();
}

$(function () {
  new medieval_auto_battler();
});
