function mab_battle() {
  let self = this;

  self.IsBuilt = false;

  self.IsPlayerTurn = true;

  self.BattleRound = null;
  self.BattleRoundsCount = null;

  self.PlayerCardCopies = [];
  self.PlayerDuellingCard_CardCopyId = null;
  self.PlayerDuellingCard_CardName = null;
  self.PlayerDuellingCard_CardLevel = null;
  self.PlayerDuellingCard_CardType = null;
  self.PlayerDuellingCard_CardPower = null;
  self.PlayerDuellingCard_CardUpperHand = null;
  self.PlayerDuellingCard_CardTotalPower = null;

  self.NpcDuellingCard_NpcCardId = null;
  self.NpcDuellingCard_CardName = null;
  self.NpcDuellingCard_CardLevel = null;
  self.NpcDuellingCard_CardType = null;
  self.NpcDuellingCard_CardPower = null;
  self.NpcDuellingCard_CardUpperHand = null;
  self.NpcDuellingCard_CardTotalPower = null;

  self.loadReferences = () => {
    self.DOM = $("#dom-medieval-auto-battler");

    self.MabContainersContent = self.DOM.find("#mab-containers-content");

    self.Containers = [];

    self.Containers[self.Containers.length] = self.Containers.ContinueCampaign =
      self.MabContainersContent.find("#container-mab-continue-campaign");
    self.Containers[self.Containers.length] = self.Containers.Battle =
      self.MabContainersContent.find("#container-mab-battle");
    self.Containers[self.Containers.length] = self.Containers.Arena =
      self.MabContainersContent.find("#container-mab-arena");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] =
      self.Buttons.ShowBattleContainer_NewBattle =
        self.Containers.ContinueCampaign.find(
          "#button-mab-battle-show-container-new"
        );
    self.Buttons[self.Buttons.length] =
      self.Buttons.ShowBattleContainer_ContinueBattle =
        self.Containers.ContinueCampaign.find(
          "#button-mab-battle-show-container-continue"
        );
    self.Buttons[self.Buttons.length] = self.Buttons.HideBattleContainer =
      self.Containers.Battle.find("#button-mab-battle-hide-container");
    self.Buttons[self.Buttons.length] = self.Buttons.HideArenaContainer =
      self.Containers.Arena.find("#button-mab-arena-hide-container");
    self.Buttons[self.Buttons.length] = self.Buttons.RetreatFromBattle =
      self.Containers.Arena.find("#button-mab-arena-retreat");
    self.Buttons[self.Buttons.length] = self.Buttons.TurnOnAutoMode =
      self.Containers.Arena.find("#button-mab-arena-auto-mode");
    self.Buttons[self.Buttons.length] = self.Buttons.ConfirmDuellingCardChoice =
      self.Containers.Arena.find("#button-mab-arena-confirm-card-choice");
    self.Buttons[self.Buttons.length] = self.Buttons.CancelDuellingCardChoice =
      self.Containers.Arena.find("#button-mab-arena-cancel-card-choice");

    self.Fields = [];
    self.Fields[self.Fields.length] = self.Fields.BattlePoints =
      self.Containers.Arena.find("#span-mab-arena-battle-points");
    self.Fields[self.Fields.length] = self.Fields.NpcName =
      self.Containers.Arena.find("#span-mab-arena-npc-name");
    self.Fields[self.Fields.length] = self.Fields.PlayerNickname =
      self.Containers.Arena.find("#span-mab-arena-player-nickname");
    self.Fields[self.Fields.length] = self.Fields.NpcDuellingCard =
      self.Containers.Arena.find("#div-mab-arena-npc-duelling-card");
    self.Fields[self.Fields.length] = self.Fields.ArenaRoundCounter =
      self.Containers.Arena.find("#span-mab-arena-round-counter");
    self.Fields[self.Fields.length] = self.Fields.ArenaMessages =
      self.Containers.Arena.find("#div-mab-arena-announcements");
    self.Fields[self.Fields.length] = self.Fields.PlayerDuellingCard =
      self.Containers.Arena.find("#div-mab-arena-player-duelling-card");

    self.Blocks = [];
    self.Blocks[self.Blocks.length] = self.Blocks.PlayerCardCopies =
      self.Containers.Arena.find("#block-mab-arena-player-cards");
  };

  self.loadEvents = () => {
    self.Buttons.ShowBattleContainer_NewBattle.on("click", (e) => {
      e.preventDefault();

      self.Arena_StartBattle();
    });
    self.Buttons.ShowBattleContainer_ContinueBattle.on("click", (e) => {
      e.preventDefault();

      self.Arena_ContinueBattle();
    });

    self.Buttons.HideBattleContainer.on("click", (e) => {
      e.preventDefault();

      self.battle_HideContainer();

      self.mainMenu_ShowContainer();
    });

    // Binding the event after inserting into DOM
    $(document).on("click", ".button-mab-arena-player-cards", function () {
      let cardCopyId = $(this).data("card-copy-id");

      $(".button-mab-arena-mab-card-fronts")
        .removeClass("active-card")
        .addClass("frozen-card");

      $(this).removeClass("frozen-card").addClass("chosen-card");

      let card = self.PlayerCardCopies.filter(
        (card) => card.mabCardCopyId === cardCopyId
      )[0];

      self.PlayerDuellingCard_CardCopyId = cardCopyId;
      self.PlayerDuellingCard_CardName = card.mabCardName;
      self.PlayerDuellingCard_CardLevel = card.mabCardLevel;
      self.PlayerDuellingCard_CardType = card.mabCardType;
      self.PlayerDuellingCard_CardPower = card.mabCardPower;
      self.PlayerDuellingCard_CardUpperHand = card.mabCardUpperHand;

      self.arena_PlayerDuellingCard_Add();
    });

    self.Buttons.ConfirmDuellingCardChoice.on("click", (e) => {
      e.preventDefault();

      self.Battle_TriggerBattleTurnManager();
    });

    self.Buttons.CancelDuellingCardChoice.on("click", (e) => {
      e.preventDefault();

      self.arena_buttons_SetUpForChosenCard_Off();

      self.arena_PlayerDuellingCard_Remove();

      self.clear_PlayerDuelCard();
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
      timer: 300,
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
  self.battle_ShowContainer = () => {
    self.toggleContainerVisibility(self.Containers.Battle);
  };
  self.battle_HideContainer = () => {
    self.toggleContainerVisibility(self.Containers.Battle);
  };
  self.continueCampaign_HideContainer = () => {
    self.toggleContainerVisibility(self.Containers.ContinueCampaign);
  };

  self.arena_ShowContainer = () => {
    self.toggleContainerVisibility(self.Containers.Arena);
  };
  self.arena_HideContainer = () => {
    self.toggleContainerVisibility(self.Containers.Arena);
  };

  self.Arena_StartBattle = () => {
    const formData = new FormData();
    formData.append("MabQuestId", 1);

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/startmabbattle",
      data: formData,
      processData: false,
      contentType: false,
      xhrFields: {
        withCredentials: true, // Only if you're using cookies; otherwise can be removed
      },
      success: (resp) => {
        if (!resp.content) {
          self.sweetAlertError(resp.message);
          return;
        }

        self.Fields.PlayerNickname.html(resp.content.mabPlayerNickName);
        self.Fields.NpcName.html(resp.content.mabNpcName);
        self.Fields.ArenaRoundCounter.html(resp.content.mabBattleRoundNumber);

        self.IsPlayerTurn = resp.content.doesPlayerGoFirst;

        self.battle_ShowContainer();

        self.sweetAlertSuccess("Battle started!");

        self.Battle_ListPlayerAvailableAssignedCardCopies();

        if (self.IsPlayerTurn === false) {
          if (resp.content.mabNpcCard) {
            let npcDuellingCard = resp.content.mabNpcCard;

            self.NpcDuellingCard_NpcCardId = npcDuellingCard.MabNpcCardId;
            self.NpcDuellingCard_CardName = npcDuellingCard.MabCardName;
            self.NpcDuellingCard_CardLevel = npcDuellingCard.MabCardLevel;
            self.NpcDuellingCard_CardType = npcDuellingCard.MabNpcCardId;
            self.NpcDuellingCard_CardPower = npcDuellingCard.MabCardPower;
            self.NpcDuellingCard_CardUpperHand =
              npcDuellingCard.MabCardUpperHand;

            self.arena_NpcDuellingCard_Add();
          }
          self.Battle_TriggerBattleTurnManager();
        }
      },
      error: (err) => {
        self.sweetAlertError(err);
      },
      complete: () => {},
    });
  };
  self.Arena_ContinueBattle = () => {
    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/continuemabbattle",
      xhrFields: {
        withCredentials: true, // Only if you're using cookies; otherwise can be removed
      },
      success: (resp) => {
        if (!resp.content) {
          self.sweetAlertError(resp.message);
          return;
        }

        let battle = resp.content;

        self.BattleRound = battle.mabBattleRoundNumber;
        self.IsPlayerTurn = battle.isPlayerTurn;

        self.Fields.BattlePoints.html(battle.mabBattlePoints);
        self.Fields.PlayerNickname.html(battle.mabPlayerNickName);
        self.Fields.NpcName.html(battle.mabNpcName);
        self.Fields.ArenaRoundCounter.html(resp.content.mabBattleRoundNumber);

        if (self.IsPlayerTurn === false && battle.mabNpcCard) {
          self.IsPlayerTurn = true;

          let npcDuellingCard = battle.mabNpcCard;

          self.NpcDuellingCard_NpcCardId = npcDuellingCard.mabNpcCardId;
          self.NpcDuellingCard_CardName = npcDuellingCard.mabCardName;
          self.NpcDuellingCard_CardLevel = npcDuellingCard.mabCardLevel;
          self.NpcDuellingCard_CardType = npcDuellingCard.mabCardType;
          self.NpcDuellingCard_CardPower = npcDuellingCard.mabCardPower;
          self.NpcDuellingCard_CardUpperHand = npcDuellingCard.mabCardUpperHand;

          self.arena_NpcDuellingCard_Add();

          self.Battle_ListPlayerAvailableAssignedCardCopies();

          return;
        }

        self.Battle_TriggerBattleTurnManager();
      },
      error: (err) => {
        self.sweetAlertError(err);
      },
      complete: () => {},
    });
  };

  self.Battle_ListPlayerAvailableAssignedCardCopies = () => {
    self.Blocks.PlayerCardCopies.empty();

    $.ajax({
      type: "GET",
      url: "https://localhost:7081/users/listmabavailableroundcardcopies",
      xhrFields: { withCredentials: true },
      success: function (response) {
        if (!response.content) {
          sweetAlertError("Error", response.message);
          return;
        }

        self.battle_HideContainer();

        self.arena_ShowContainer();

        self.PlayerCardCopies = response.content;

        self.PlayerCardCopies.forEach((card, index) => {
          let cardHtml = `
              <button 
                class="btn d-flex flex-column mab-card-front button-mab-arena-player-cards frozen-card"
                type="button"
                data-card-copy-id="${card.mabCardCopyId}"
                > 
                
                <div class="d-flex flex-row justify-content-between align-items-center w-100">
                  <span>${card.mabCardName}</span>
                  <span>${card.mabCardLevel}</span>
                </div>

                <div class="d-flex flex-row justify-content-center align-items-center">
                  <span>${card.mabCardType}</span>
                  
                </div>

                <div class="d-flex flex-row justify-content-between align-items-center w-100">
                  <div>
                    <span>${card.mabCardPower}</span>

                    |

                    <span>${card.mabCardUpperHand}</span>
                  </div>

                  <span id="span-mab-arena-player-${index}-card-total-power">?</span>
                </div>
              </button>   
            `;

          self.Blocks.PlayerCardCopies.append(cardHtml);
        });

        self.arena_ResolveTurn();
      },
      error: function (xhr, status, error) {
        sweetAlertError(
          "Failed to fetch user available and assigned card copies. Try again later."
        );
      },
    });
  };

  self.Battle_TriggerBattleTurnManager = () => {
    const formData = new FormData();
    formData.append("MabPlayerCardId", self.PlayerDuellingCard_CardCopyId);

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/mabbattleturnmanager",
      data: formData,
      processData: false,
      contentType: false,
      xhrFields: {
        withCredentials: true, // Only if you're using cookies; otherwise can be removed
      },
      success: (resp) => {
        if (!resp.content) {
          sweetAlertError(resp.message);
        }

        console.log("resp.content: ", resp.content);

        if (self.IsPlayerTurn === false) {
          let npcDuellingCard = resp.content.mabNpcCard;
          self.NpcDuellingCard_NpcCardId = npcDuellingCard.MabNpcCardId;
          self.NpcDuellingCard_CardName = npcDuellingCard.mabCardName;
          self.NpcDuellingCard_CardLevel = npcDuellingCard.mabCardLevel;
          self.NpcDuellingCard_CardType = npcDuellingCard.mabCardType;
          self.NpcDuellingCard_CardPower = npcDuellingCard.mabCardPower;
          self.NpcDuellingCard_CardUpperHand = npcDuellingCard.mabCardUpperHand;

          self.arena_NpcDuellingCard_Add();
        }

        self.arena_buttons_SetUpForChosenCard_Off();
      },
      error: (err) => {
        sweetAlertError(err);
      },
    });
  };

  self.arena_buttons_SetUpForChosenCard_On = () => {
    self.Buttons.ConfirmDuellingCardChoice.css("opacity", "0");

    setTimeout(() => {
      self.Buttons.ConfirmDuellingCardChoice.css("opacity", "1")
        .text("Confirm")
        .prop("disabled", false);
    }, 300);

    self.Buttons.CancelDuellingCardChoice.prop("disabled", false);
  };
  self.arena_buttons_SetUpForChosenCard_Off = () => {
    self.Buttons.ConfirmDuellingCardChoice.css("opacity", "0");

    setTimeout(() => {
      self.Buttons.ConfirmDuellingCardChoice.css("opacity", "1")
        .text("Pass")
        .prop("disabled", false);
    }, 300);

    self.Buttons.CancelDuellingCardChoice.prop("disabled", true);
  };
  self.arena_ResolveTurn = () => {
    self.Fields.ArenaMessages.empty();

    if (self.IsPlayerTurn === true) {
      self.Fields.ArenaMessages.html(`Player's Turn: please choose a card...`);

      let playerCardsClass = $(".button-mab-arena-player-cards");
      console.log("playerCardsClass: ", playerCardsClass);

      $(".button-mab-arena-player-cards")
        .removeClass("frozen-card")
        .addClass("active-card");

      self.Buttons.ConfirmDuellingCardChoice.prop("disabled", false);

      return;
    }

    self.Fields.ArenaMessages.html(`NPC's Turn: a card is being chosen...`);
  };
  self.arena_PlayerDuellingCard_Add = () => {
    self.Fields.PlayerDuellingCard.empty();

    let playerChosenCardCopyHtml = `
        <div class="d-flex flex-column justify-content-center align-items-center w-100 mab-card-front" >
          <div class="d-flex flex-row justify-content-between align-items-center w-100">
            <span>${self.PlayerDuellingCard_CardName}</span>
            <span>${self.PlayerDuellingCard_CardLevel}</span>
          </div>
          <div class="d-flex flex-row justify-content-center align-items-center">
            <span>${self.PlayerDuellingCard_CardType}</span>
          </div>
          <div class="d-flex flex-row justify-content-between align-items-center w-100">
            <div>
              <span>${self.PlayerDuellingCard_CardPower}</span>
              |
              <span>${self.PlayerDuellingCard_CardUpperHand}</span>
            </div>
            <span>?</span>
          </div>
        </div>
      `;

    setTimeout(() => {
      self.Fields.PlayerDuellingCard.addClass("duelling-card");

      setTimeout(() => {
        self.arena_buttons_SetUpForChosenCard_On();

        self.Fields.PlayerDuellingCard.html(playerChosenCardCopyHtml);
      }, 100);
    }, 50);
  };
  self.arena_PlayerDuellingCard_Remove = () => {
    self.Fields.PlayerDuellingCard.empty().removeClass("duelling-card");

    $(".button-mab-arena-player-cards")
      .removeClass("chosen-card frozen-card")
      .addClass("active-card");
  };
  self.arena_NpcDuellingCard_Add = () => {
    self.Fields.NpcDuellingCard.empty();

    let npcDuellingCardHtml = `
        <div class="d-flex flex-column justify-content-center align-items-center w-100 mab-card-front" >
          <div class="d-flex flex-row justify-content-between align-items-center w-100">
            <span>${self.NpcDuellingCard_CardName}</span>
            <span>${self.NpcDuellingCard_CardLevel}</span>
          </div>
          <div class="d-flex flex-row justify-content-center align-items-center">
            <span>${self.NpcDuellingCard_CardType}</span>
          </div>
          <div class="d-flex flex-row justify-content-between align-items-center w-100">
            <div>
              <span>${self.NpcDuellingCard_CardPower}</span>
              |
              <span>${self.NpcDuellingCard_CardUpperHand}</span>
            </div>
            <span>?</span>
          </div>
        </div>
      `;

    setTimeout(() => {
      self.Fields.NpcDuellingCard.addClass("duelling-card");

      setTimeout(() => {
        self.Fields.NpcDuellingCard.html(npcDuellingCardHtml);
      }, 100);
    }, 50);
  };

  self.clear_PlayerDuelCard = () => {
    self.PlayerDuellingCard_CardCopyId = null;
    self.PlayerDuellingCard_CardName = null;
    self.PlayerDuellingCard_CardLevel = null;
    self.PlayerDuellingCard_CardType = null;
    self.PlayerDuellingCard_CardPower = null;
    self.PlayerDuellingCard_CardUpperHand = null;
    self.PlayerDuellingCard_CardTotalPower = null;
  };

  self.build = () => {
    if (self.IsBuilt === false) {
      self.IsBuilt = true;
    }
    self.loadReferences();
    self.loadEvents();
  };

  self.build();
}

$(function () {
  new mab_battle();
});
