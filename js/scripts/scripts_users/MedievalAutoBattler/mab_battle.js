function mab_battle() {
  let self = this;

  self.IsBuilt = false;

  self.IsPlayersTurn = true;

  self.BattleRound = null;
  self.BattleRoundsCount = null;

  self.PlayerCardCopies = [];
  self.PlayerChosenCard_CardCopyId = null;
  self.PlayerChosenCard_CardName = null;
  self.PlayerChosenCard_CardLevel = null;
  self.PlayerChosenCard_CardType = null;
  self.PlayerChosenCard_CardPower = null;
  self.PlayerChosenCard_CardUpperHand = null;
  self.PlayerChosenCard_CardTotalPower = null;

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
    self.Buttons[self.Buttons.length] = self.Buttons.ShowBattleContainer =
      self.Containers.ContinueCampaign.find(
        "#button-mab-battle-show-container"
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
    self.Fields[self.Fields.length] = self.Fields.NpcName =
      self.Containers.Arena.find("#span-mab-arena-npc-name");
    self.Fields[self.Fields.length] = self.Fields.PlayerNickname =
      self.Containers.Arena.find("#span-mab-arena-player-nickname");
    self.Fields[self.Fields.length] = self.Fields.ArenaMessages =
      self.Containers.Arena.find("#div-mab-arena-announcements");
    self.Fields[self.Fields.length] = self.Fields.PlayerChosenCardCopy =
      self.Containers.Arena.find("#div-mab-arena-player-duelling-card");

    self.Blocks = [];
    self.Blocks[self.Blocks.length] = self.Blocks.PlayerCardCopies =
      self.Containers.Arena.find("#block-mab-arena-player-cards");
  };

  self.loadEvents = () => {
    self.Buttons.ShowBattleContainer.on("click", (e) => {
      e.preventDefault();

      self.Battle_TriggerStart();
    });

    self.Buttons.HideBattleContainer.on("click", (e) => {
      e.preventDefault();

      self.battle_HideContainer();

      self.mainMenu_ShowContainer();
    });

    // Binding the event after inserting into DOM
    $(document).on("click", ".button-mab-arena-player-cards", function () {
      let cardCopyId = $(this).data("card-copy-id");

      $(".button-mab-arena-player-cards")
        .removeClass("active-card")
        .addClass("frozen-card");

      $(this).removeClass("frozen-card").addClass("chosen-card");

      let card = self.PlayerCardCopies.filter(
        (card) => card.mabCardCopyId === cardCopyId
      )[0];

      self.PlayerChosenCard_CardCopyId = cardCopyId;
      self.PlayerChosenCard_CardName = card.mabCardName;
      self.PlayerChosenCard_CardLevel = card.mabCardLevel;
      self.PlayerChosenCard_CardType = card.mabCardType;
      self.PlayerChosenCard_CardPower = card.mabCardPower;
      self.PlayerChosenCard_CardUpperHand = card.mabCardUpperHand;

      self.arena_PlayerDuellingCard_Add();
    });

    self.Buttons.ConfirmDuellingCardChoice.on("click", (e) => {
      e.preventDefault();

      self.Arena_ResolvePlayerTurn();
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

  self.Battle_TriggerStart = () => {
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

        self.IsPlayersTurn = resp.content.doesPlayerGoFirst;

        self.battle_ShowContainer();

        self.sweetAlertSuccess("Battle started!");

        self.Battle_ListPlayerAvailableAssignedCardCopies();
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
                class="btn d-flex flex-column player-card button-mab-arena-player-cards frozen-card"
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

    if (self.IsPlayersTurn === true) {
      self.Fields.ArenaMessages.html(
        `Round #${(self.BattleRound = null)} Player's Turn: pick a card...`
      );

      $(".button-mab-arena-player-cards")
        .removeClass("frozen-card")
        .addClass("active-card");

      self.Buttons.ConfirmDuellingCardChoice.prop("disabled", false);

      return;
    }

    self.Fields.ArenaMessages.html(
      `Round #${(self.BattleRound = null)} NPC's Turn: picking a card...`
    );
    self.Arena_ResolveNpcTurn();
  };
  self.arena_PlayerDuellingCard_Add = () => {
    self.Fields.PlayerChosenCardCopy.empty();

    let totalPower =
      self.PlayerChosenCard_CardTotalPower === null
        ? "?"
        : self.PlayerChosenCard_CardTotalPower;

    let playerChosenCardCopyHtml = `
        <div class="d-flex flex-column justify-content-center align-items-center w-100 player-card" >
          <div class="d-flex flex-row justify-content-between align-items-center w-100">
            <span>${self.PlayerChosenCard_CardName}</span>
            <span>${self.PlayerChosenCard_CardLevel}</span>
          </div>
          <div class="d-flex flex-row justify-content-center align-items-center">
            <span>${self.PlayerChosenCard_CardType}</span>
          </div>
          <div class="d-flex flex-row justify-content-between align-items-center w-100">
            <div>
              <span>${self.PlayerChosenCard_CardPower}</span>
              |
              <span>${self.PlayerChosenCard_CardUpperHand}</span>
            </div>
            <span>${totalPower}</span>
          </div>
        </div>
      `;

    setTimeout(() => {
      self.Fields.PlayerChosenCardCopy.addClass("duelling-card");

      setTimeout(() => {
        self.arena_buttons_SetUpForChosenCard_On();

        self.Fields.PlayerChosenCardCopy.html(playerChosenCardCopyHtml);
      }, 100);
    }, 50);
  };
  self.arena_PlayerDuellingCard_Remove = () => {
    self.Fields.PlayerChosenCardCopy.empty().removeClass("duelling-card");

    $(".button-mab-arena-player-cards")
      .removeClass("chosen-card frozen-card")
      .addClass("active-card");
  };
  self.clear_PlayerDuelCard = () => {
    self.PlayerChosenCard_CardCopyId = null;
    self.PlayerChosenCard_CardName = null;
    self.PlayerChosenCard_CardLevel = null;
    self.PlayerChosenCard_CardType = null;
    self.PlayerChosenCard_CardPower = null;
    self.PlayerChosenCard_CardUpperHand = null;
    self.PlayerChosenCard_CardTotalPower = null;
  };
  self.Arena_ResolvePlayerTurn = () => {
    const formData = new FormData();
    formData.append("MabCardCopyId", self.PlayerChosenCard_CardCopyId);

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/mabplayerturn",
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

        self.arena_buttons_SetUpForChosenCard_Off();
      },
      error: (err) => {
        self.sweetAlertError(err);
      },
      complete: () => {},
    });
  };
  self.Arena_ResolveNpcTurn = () => {
    // let npcChosenCardCopyHtml = `
    //     <div id="div-mab-arena-player-chosen-card" class="d-flex flex-column player-card" >
    //       <div class="d-flex flex-row justify-content-between align-items-center w-100">
    //         <span>${card.mabCardName}</span>
    //         <span>${card.mabCardLevel}</span>
    //       </div>
    //       <div class="d-flex flex-row justify-content-center align-items-center">
    //         <span>${card.mabCardType}</span>
    //       </div>
    //       <div class="d-flex flex-row justify-content-between align-items-center w-100">
    //         <div>
    //           <span>${card.mabCardPower}</span>
    //           |
    //           <span>${card.mabCardUpperHand}</span>
    //         </div>
    //         <span>${card.mabCardTotalPower}</span>
    //       </div>
    //     </div>
    //   `;
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
