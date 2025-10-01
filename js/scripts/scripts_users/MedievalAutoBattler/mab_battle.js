function mab_battle() {
  let self = this;

  self.IsBuilt = false;

  self.DuelsCount = null;
  self.IsPlayerTurn = null;
  self.IsPlayerDefending = null;
  self.AreTurnsFinished = null;
  self.IsDuelResolved = null;
  self.PlayerState = null;
  self.IsBattleFinished = false;
  self.DeckSize = null;

  self.NewDuelBegins = null;

  self.HasPlayerRetreated = false;

  self.QuestId = null;

  self.BattleId = null;
  self.Battle_Points = 0;
  self.Battle_EarnedXp = 0;
  self.Battle_BonusXp = 0;
  self.Battle_DoesPlayerGoFirst = null;

  self.Duel_EarnedPoints = null;
  self.Duel_EarnedXp = null;
  self.Duel_BonusXp = null;
  self.Duel_HasPlayerWon = null;

  self.Duel_AnimationsTime = 1600;

  self.NpcId = null;
  self.PlayerCards = [];
  self.PlayerDuellingCard_PlayerCardId = null;
  self.PlayerDuellingCard_CardName = null;
  self.PlayerDuellingCard_CardLevel = null;
  self.PlayerDuellingCard_CardType = null;
  self.PlayerDuellingCard_CardPower = null;
  self.PlayerDuellingCard_CardUpperHand = null;
  self.PlayerDuellingCard_CardFullPower = null;

  self.NpcCards = [];
  self.NpcCardFullPowerSequence = [];
  self.NpcWinningStreak = [];
  self.NpcDuellingCard_NpcCardId = null;
  self.NpcDuellingCard_CardName = null;
  self.NpcDuellingCard_CardLevel = null;
  self.NpcDuellingCard_CardType = null;
  self.NpcDuellingCard_CardPower = null;
  self.NpcDuellingCard_CardUpperHand = null;
  self.NpcDuellingCard_CardFullPower = null;
  self.NpcPotentialFullCardPower = null;

  self.loadReferences = () => {
    self.DOM = $("#dom-medieval-auto-battler");

    self.MabContainersContent = self.DOM.find("#mab-containers-content");

    self.Containers = [];

    self.Containers[self.Containers.length] = self.Containers.ContinueCampaign =
      self.MabContainersContent.find("#container-mab-continue-campaign");
    self.Containers[self.Containers.length] = self.Containers.Quest =
      self.MabContainersContent.find("#container-mab-quest");
    self.Containers[self.Containers.length] = self.Containers.Arena =
      self.MabContainersContent.find("#container-mab-arena");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.NewSkirmishBattle_Manual =
      self.Containers.ContinueCampaign.find(
        "#button-mab-new-manual-skirmish-battle"
      );
    self.Buttons[self.Buttons.length] = self.Buttons.NewSkirmishBattle_Auto =
      self.Containers.ContinueCampaign.find(
        "#button-mab-new-auto-skirmish-battle"
      );

    self.Buttons[self.Buttons.length] = self.Buttons.Quest_HideContainer =
      self.Containers.Quest.find("#button-mab-quest-hide-container");
    self.Buttons[self.Buttons.length] = self.Buttons.Arena_HideContainer =
      self.Containers.Arena.find("#button-mab-arena-hide-container");
    self.Buttons[self.Buttons.length] = self.Buttons.Arena_Retreat =
      self.Containers.Arena.find("#button-mab-arena-retreat");
    self.Buttons[self.Buttons.length] = self.Buttons.Arena_ShowDuelsResults =
      self.Containers.Arena.find("#button-mab-arena-show-duel-results");

    self.Fields = [];
    self.Fields[self.Fields.length] = self.Fields.BattlePoints =
      self.Containers.Arena.find("#span-mab-battle-points");
    self.Fields[self.Fields.length] = self.Fields.BattleEarnedXp =
      self.Containers.Arena.find("#span-mab-battle-earned-xp");
    self.Fields[self.Fields.length] = self.Fields.BattleBonusXp =
      self.Containers.Arena.find("#span-mab-battle-bonus-xp");

    self.Fields[self.Fields.length] = self.Fields.NpcFirstToGoImg =
      self.Containers.Arena.find("#span-mab-arena-npc-first-to-go-img");
    self.Fields[self.Fields.length] = self.Fields.NpcName =
      self.Containers.Arena.find(".span-mab-arena-npc-name");
    self.Fields[self.Fields.length] = self.Fields.NpcLevel =
      self.Containers.Arena.find(".span-mab-arena-npc-level");

    self.Fields[self.Fields.length] = self.Fields.PlayerFirstToGoImg =
      self.Containers.Arena.find("#span-mab-arena-player-first-to-go-img");

    self.Fields[self.Fields.length] = self.Fields.PlayerNickName =
      self.Containers.Arena.find(".span-mab-arena-player-nickname");
    self.Fields[self.Fields.length] = self.Fields.PlayerLevel =
      self.Containers.Arena.find(".span-mab-arena-player-level");
    self.Fields[self.Fields.length] = self.Fields.PlayerState =
      self.Containers.Arena.find("#span-mab-arena-player-state");

    self.Fields[self.Fields.length] = self.Fields.DuelNumber =
      self.Containers.Arena.find("#span-mab-arena-round-counter");
    self.Fields[self.Fields.length] = self.Fields.ArenaMessages =
      self.Containers.Arena.find("#div-mab-arena-announcements");

    self.Blocks = [];
    self.Blocks[self.Blocks.length] = self.Blocks.PlayerCards =
      self.Containers.Arena.find("#block-mab-arena-player-cards");
    self.Blocks[self.Blocks.length] = self.Blocks.NpcCards =
      self.Containers.Arena.find("#block-mab-arena-npc-cards");

    self.Blocks[self.Blocks.length] = self.Blocks.WrapperPlayerDuelResults =
      self.Containers.Arena.find("#wrapper-mab-arena-player-duel-results");
    self.Blocks[self.Blocks.length] = self.Blocks.PlayerDuelResults =
      self.Containers.Arena.find("#block-mab-arena-player-duel-results");

    self.Imgs = [];
    self.Imgs[self.Imgs.length] =
      self.Imgs.MabCardTruce = `/images/icons/mab_card_types/neutral/truce.svg`;
    self.Imgs[self.Imgs.length] =
      self.Imgs.MabCardTypeNeutral = `/images/icons/mab_card_types/cardtype_neutral.svg`;
    self.Imgs[self.Imgs.length] =
      self.Imgs.MabCardTypeRanged = `/images/icons/mab_card_types/cardtype_ranged.svg`;
    self.Imgs[self.Imgs.length] =
      self.Imgs.MabCardTypeCavalry = `/images/icons/mab_card_types/cardtype_cavalry.svg`;
    self.Imgs[self.Imgs.length] =
      self.Imgs.MabCardTypeInfantry = `/images/icons/mab_card_types/cardtype_infantry.svg`;
    self.Imgs[self.Imgs.length] =
      self.Imgs.MabCardPickeAxe = `/images/icons/mab/card_types/pickeaxe_infantry.svg`;
  };

  self.loadEvents = () => {
    self.Buttons.NewSkirmishBattle_Manual.on("click", (e) => {
      e.preventDefault();

      self.quest_HideContainer();

      self.continueCampaign_HideContainer();

      self.Battle_Start();
    });

    self.Buttons.Arena_HideContainer.on("click", (e) => {
      e.preventDefault();

      self.arena_HideContainer();

      self.continueCampaign_ShowContainer();
    });

    self.Buttons.NewSkirmishBattle_Auto.on("click", (e) => {
      e.preventDefault();

      self.quest_HideContainer();
      self.continueCampaign_HideContainer();

      self.Battle_Auto();
    });

    // Binding the event after inserting into DOM
    $(document).on(
      "click",
      ".button-mab-arena-assigned-player-cards",
      function () {
        self.clear_PlayerDuellingCard();

        $(`.confirm-duelling-card`)
          .removeClass("show-div")
          .addClass("hide-div");

        self.battle_ListNpcCards();

        let playerCardId = $(this).data("player-card-id");

        $(".mab-card-front").removeClass("chosen-card").addClass("frozen-card");

        $(this).addClass("chosen-card");

        let card = self.PlayerCards.filter(
          (card) => card.mab_PlayerCardId === playerCardId
        )[0];

        self.PlayerDuellingCard_PlayerCardId = card.mab_PlayerCardId;
        self.PlayerDuellingCard_CardName = card.mab_CardName;
        self.PlayerDuellingCard_CardLevel = card.mab_CardLevel;
        self.PlayerDuellingCard_CardType = card.mab_CardType;
        self.PlayerDuellingCard_CardPower = card.mab_CardPower;
        self.PlayerDuellingCard_CardUpperHand = card.mab_CardUpperHand;

        if (self.IsPlayerDefending === true) {
          self.Duel_GetNpcPotentialFullCardPower();
        }

        $(`.mab-player-confirm-card-choice-${playerCardId}`)
          .removeClass("hide-div")
          .addClass("show-div");
      }
    );

    self.Buttons.Arena_Retreat.on("click", (e) => {
      self.Duel_PlayerRetreats();
    });

    // Binding the event after inserting into DOM
    $(document).on("click", `.confirm-duelling-card`, function () {
      $(".mab-player-confirm-card-choice")
        .removeClass("show-div")
        .addClass("hide-div");

      self.Duel_PlayerAttacks();
    });

    self.Buttons.Arena_ShowDuelsResults.on("click", (e) => {
      e.preventDefault();

      self.Blocks.WrapperPlayerDuelResults.slideToggle();
    });

    // Binding the event after inserting into DOM
    $(document).on("click", `.mab-opponent`, function () {
      self.QuestId = $(this).data("mab-quest-id");

      self.NpcId = $(this).data("mab-npc-id");

      self.Battle_Start();
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
      timer: 1000,
    });
  };
  self.sweetAlertNewRound = () => {
    Swal.fire({
      position: "center",
      width: "15rem",
      icon: "info",
      theme: "bulma",
      title: `#${self.DuelsCount + 1} Duel`,
      showConfirmButton: false,
      timer: 1600,
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
  self.quest_ShowContainer = () => {
    self.toggleContainerVisibility(self.Containers.Quest);
  };
  self.quest_HideContainer = () => {
    self.toggleContainerVisibility(self.Containers.Quest);
  };

  self.continueCampaign_ShowContainer = () => {
    self.toggleContainerVisibility(self.Containers.ContinueCampaign);
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

  self.Battle_Start = () => {
    const formData = new FormData();

    if (self.QuestId) {
      formData.append("Mab_QuestId", self.QuestId);
    }

    if (self.NpcId) {
      formData.append("Mab_NpcId", self.NpcId);
    }

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/mabstartbattle",
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

        self.reset_Arena();

        self.BattleId = resp.content.mab_BattleId;

        self.Fields.NpcName.html(resp.content.mab_NpcName);
        self.Fields.NpcLevel.html(resp.content.mab_NpcLevel);

        self.Fields.PlayerNickName.html(resp.content.mab_PlayerNickName);
        self.Fields.PlayerLevel.html(resp.content.mab_PlayerLevel);

        self.Battle_DoesPlayerGoFirst = resp.content.mab_DoesPlayerGoFirst;

        if (self.Battle_DoesPlayerGoFirst === true) {
          self.Fields.PlayerFirstToGoImg.html(
            `<img class="first-player-img" src="/images/first_player.png"></img>`
          );
        } else {
          self.Fields.NpcFirstToGoImg.html(
            `<img class="first-player-img" src="/images/first_player.png"></img>`
          );
        }

        self.DeckSize = resp.content.mab_DeckSize;

        self.quest_HideContainer();
        self.arena_ShowContainer();

        self.Duel_Start();

        self.Battle_ListPlayerDuellingCards();
        self.battle_ListNpcCards();

        self.duel_RenderPlayerState();

        self.sweetAlertSuccess("Battle started!");
      },
      error: (err) => {
        self.sweetAlertError("Failed to start mab battle!");
      },
      complete: () => {},
    });
  };
  self.Battle_Auto = () => {
    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/mabautobattle",
      xhrFields: {
        withCredentials: true, // Only if you're using cookies; otherwise can be removed
      },
      success: (resp) => {
        if (!resp.content) {
          self.sweetAlertError(resp.message);
          return;
        }
        self.reset_Arena();

        let content = resp.content;

        self.BattleId = content.mab_BattleId;

        self.Fields.PlayerNickName.html(content.mab_PlayerNickname);

        self.Fields.PlayerLevel.html(content.mab_PlayerLevel);

        self.PlayerState = content.mab_FinalPlayerState;

        self.duel_RenderPlayerState();

        self.PlayerCards = content.mab_PlayerCards;

        self.Battle_DoesPlayerGoFirst = content.mab_DoesPlayerGoFirst;

        self.Fields.NpcName.html(content.mab_NpcName);
        self.Fields.NpcLevel.html(content.mab_NpcLevel);
        self.NpcCards = content.mab_NpcCards;

        if (self.Battle_DoesPlayerGoFirst === true) {
          self.Fields.PlayerFirstToGoImg.html(
            `<img class="first-player-img" src="/images/first_player.png"></img>`
          );
        } else {
          self.Fields.NpcFirstToGoImg.html(
            `<img class="first-player-img" src="/images/first_player.png"></img>`
          );
        }

        self.PlayerCards.forEach((card, index) => {
          self.NpcWinningStreak.push(card.mab_DuelPoints < 0);

          let imgPath = ``;

          switch (card.mab_CardType) {
            case "Neutral":
              imgPath = self.Imgs.MabCardTypeNeutral;
              break;
            case "Ranged":
              imgPath = self.Imgs.MabCardTypeRanged;
              break;
            case "Cavalry":
              imgPath = self.Imgs.MabCardTypeCavalry;
              break;
            case "Infantry":
              imgPath =
                playerCard.mab_CardPower === playerCard.mab_CardUpperHand
                  ? self.Imgs.MabCardPickeAxe
                  : self.Imgs.MabCardTypeInfantry;
              break;
            default:
              self.sweetAlertError("Failed to fetch mab card type");
              break;
          }

          if (
            card.mab_CardType === "Neutral" &&
            (card.mab_CardPower === 0) & (card.mab_CardUpperHand === 0)
          ) {
            imgPath = "";
            imgPath = self.Imgs.MabCardTruce;
          }

          let usedCardClass = "";

          let disabledAttr = "";

          if (card.mab_DuelId) {
            if (card.mab_DuelPoints > 0) {
              usedCardClass = "mab-used-card-won";
            } else {
              usedCardClass = "mab-used-card-lost";
            }
            disabledAttr = "disabled"; // native disabling
          }

          let cardFullPowerDisplayOption = "d-none";

          if (
            (card.mab_CardFullPower || card.mab_CardFullPower === 0) &&
            ((self.Battle_DoesPlayerGoFirst === true && (index + 1) % 2 != 0) ||
              (self.Battle_DoesPlayerGoFirst === false && (index + 1) % 2 == 0))
          ) {
            cardFullPowerDisplayOption = "";
          }

          let card_Html = `
              <div class="d-flex flex-column justify-content-center align-items-center w-100 gap-3">
                
                <button
                  class="btn button-mab-arena-assigned-player-cards mab-card mab-card-front ${usedCardClass}" 
                  ${disabledAttr}
                  type="button"              
                  data-player-card-id="${card.mab_PlayerCardId}"
                  >

                  <div class="d-flex flex-row justify-content-between align-items-center w-100">
                    <span>${card.mab_CardName}</span>                                   

                    <div>
                      <span>${card.mab_CardPower}</span>

                      <span>|</span>

                      <span>${card.mab_CardUpperHand}</span>
                    </div>
                  </div>

                  <div class="d-flex flex-row justify-content-center align-items-center gap-3">                  

                    <img src="${imgPath}" class="cardtype"/>

                    <span class="mab-full-card-power ${cardFullPowerDisplayOption}">${card.mab_CardFullPower}</span>

                  </div>

                  <div class="d-flex flex-row justify-content-center align-items-center w-100">
                    <div>
                      <span class="cardCode">${card.mab_CardCode}</span>
                    </div>                    
                  </div>
                </button>   

                <button class="btn btn-outline-info btn-sm confirm-duelling-card mab-player-confirm-card-choice-${card.mab_PlayerCardId} hide-div">
                  confirm
                </button>
              </div>                                                             
                                              
               
            `;

          let duelPoints = card.mab_DuelPoints ? card.mab_DuelPoints : "-";
          let duelEarnedXp = card.mab_DuelEarnedXp
            ? card.mab_DuelEarnedXp
            : "-";
          let duelBonusXp = card.mab_DuelBonusXp ? card.mab_DuelBonusXp : "-";

          let duel_resultsHtml = `
              <div class="mab-duel-results">
                  <div class="d-flex text-start w-100 ps-3">
                      Results Duel #${
                        index + 1
                      }:                                              
                  </div>  

                  <div class="d-flex text-start w-100 ps-3">
                    Points:<span>${duelPoints}</span>                                                  
                  </div>  

                  <div class="d-flex text-start w-100 ps-3">  
                    Xp:<span>${duelEarnedXp}</span>   
                  </div> 
                  
                  <div class="d-flex text-start w-100 ps-3">
                    Bonus Xp:<span>${duelBonusXp}</span>  
                  </div> 
                   
                </div>                 
              </div> 
            `;

          self.Blocks.PlayerCards.append(card_Html);

          self.Blocks.PlayerDuelResults.append(duel_resultsHtml);
        });

        self.NpcCards.forEach((card) => {
          self.NpcCardFullPowerSequence.push(card.mab_CardFullPower);
        });

        self.quest_HideContainer();
        self.arena_ShowContainer();

        self.Duel_CheckStatus();

        self.sweetAlertSuccess("Battle Auto Battle!");
      },
      error: (err) => {
        self.sweetAlertError("Failed to start mab auto battle!");
      },
      complete: () => {},
    });
  };
  self.Battle_Finish = () => {
    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/mabfinishbattle",
      xhrFields: {
        withCredentials: true, // Only if you're using cookies; otherwise can be removed
      },
      success: (resp) => {
        if (!resp.content) {
          self.sweetAlertError(resp.message);
          return;
        }

        self.Fields.BattlePoints.html(resp.content.mab_BattlePoints);
        self.Fields.BattleEarnedXp.html(resp.content.mab_BattleEarnedXp);
        self.Fields.BattleBonusXp.html(resp.content.mab_BattleBonusXp);

        self.sweetAlertSuccess(resp.message);
      },
      error: (err) => {
        self.sweetAlertError("Failed to start mab battle!");
      },
      complete: () => {},
    });
  };

  self.Duel_Start = () => {
    self.AreTurnsFinished = null;
    self.IsDuelResolved = null;
    self.IsPlayerDefending = null;
    self.PlayerState = null;

    self.clear_PlayerDuellingCard();

    self.clear_PlayerDuellingCard();

    self.clear_NpcDuellingCard();

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/mabstartduel",
      xhrFields: {
        withCredentials: true, // Only if you're using cookies; otherwise can be removed
      },
      success: (resp) => {
        if (!resp.content) {
          self.sweetAlertError(resp.message);
          return;
        }

        self.IsPlayerTurn = resp.content.mab_IsPlayerAttacking;

        self.IsPlayerDefending = !self.IsPlayerTurn;

        $(".button-mab-arena-assigned-player-cards")
          .removeClass("active-card")
          .addClass("frozen-card");

        self.sweetAlertNewRound();

        setTimeout(() => {
          self.Duel_CheckStatus();
        }, self.Duel_AnimationsTime);
      },
      error: (err) => {
        self.sweetAlertError("Failed to start mab battle!");
      },
      complete: () => {},
    });
  };
  self.Duel_CheckStatus = () => {
    $.ajax({
      type: "GET",
      url: "https://localhost:7081/users/mabcheckduelstatus",
      xhrFields: { withCredentials: true },
      success: function (resp) {
        if (!resp.content) {
          sweetAlertError("Error", response.message);
          return;
        }

        self.DuelsCount = resp.content.mab_DuelsCount;
        self.IsPlayerTurn = resp.content.mab_IsPlayerTurn;
        self.AreTurnsFinished = resp.content.mab_AreTurnsFinished;
        self.IsDuelResolved = resp.content.mab_IsDuelResolved;
        self.IsBattleFinished = resp.content.mab_IsBattleFinished;

        self.Fields.DuelNumber.html(`${self.DuelsCount}#`);

        self.battle_RenderDuel();
      },
      error: function (xhr, status, error) {
        sweetAlertError(
          "Failed to fetch user available and assigned card copies. Try again later."
        );
      },
      complete: () => {},
    });
  };
  self.Duel_Resolve = () => {
    self.Fields.ArenaMessages.html(
      `Both turns are finished! Resolving this duel...`
    );

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/mabresolveduel",
      xhrFields: {
        withCredentials: true,
      },
      success: (resp) => {
        if (!resp.content) {
          sweetAlertError(resp.message);

          return;
        }

        self.Fields.ArenaMessages.empty();

        self.PlayerDuellingCard_CardFullPower =
          resp.content.mab_PlayerCardFullPower;

        self.NpcDuellingCard_CardFullPower = resp.content.mab_NpcCardFullPower;

        self.Duel_EarnedPoints = resp.content.mab_DuelPoints;

        self.Duel_EarnedXp = resp.content.mab_EarnedXp;

        self.Duel_BonusXp = resp.content.mab_BonusXp;

        self.Duel_HasPlayerWon = resp.content.mab_HasPlayerWon;

        self.Battle_Points = self.Battle_Points + self.Duel_EarnedPoints;

        self.Battle_EarnedXp = self.Battle_EarnedXp + self.Duel_EarnedXp;

        self.Battle_BonusXp = self.Battle_BonusXp + self.Duel_BonusXp;

        self.PlayerState = resp.content.mab_PlayerState;

        self.duel_RenderPlayerState();

        self.Fields.BattlePoints.html(self.Battle_Points);

        self.Fields.BattleEarnedXp.html(self.Battle_EarnedXp);

        self.Fields.BattleBonusXp.html(self.Battle_BonusXp);

        self.NpcWinningStreak[self.DuelsCount - 1] = self.Duel_EarnedPoints < 0;

        self.NpcCardFullPowerSequence.push(self.NpcDuellingCard_CardFullPower);

        self.NewDuelBegins = true;

        self.Duel_CheckStatus();
      },
      error: (err) => {
        sweetAlertError(err);
      },
      complete: () => {},
    });
  };

  self.Battle_ListPlayerDuellingCards = () => {
    self.Blocks.PlayerCards.empty();
    self.Blocks.PlayerDuelResults.empty();

    $.ajax({
      type: "GET",
      url: `https://localhost:7081/users/mablistplayerduellingcards?Mab_BattleId=${self.BattleId}`,
      xhrFields: { withCredentials: true },
      success: function (resp) {
        if (!resp.content) {
          sweetAlertError("Error", resp.message);
          return;
        }

        self.PlayerCards = resp.content;

        self.PlayerCards.forEach((card, index) => {
          let imgPath = ``;

          switch (card.mab_CardType) {
            case "Neutral":
              imgPath = self.Imgs.MabCardTypeNeutral;
              break;
            case "Ranged":
              imgPath = self.Imgs.MabCardTypeRanged;
              break;
            case "Cavalry":
              imgPath = self.Imgs.MabCardTypeCavalry;
              break;
            case "Infantry":
              imgPath =
                playerCard.mab_CardPower === playerCard.mab_CardUpperHand
                  ? self.Imgs.MabCardPickeAxe
                  : self.Imgs.MabCardTypeInfantry;
              break;
            default:
              self.sweetAlertError("Failed to fetch mab card type");
              break;
          }

          if (
            card.mab_CardType === "Neutral" &&
            (card.mab_CardPower === 0) & (card.mab_CardUpperHand === 0)
          ) {
            imgPath = "";
            imgPath = self.Imgs.MabCardTruce;
          }

          let usedCardClass = "";

          let disabledAttr = "";

          if (card.mab_DuelId) {
            if (card.mab_DuelPoints > 0) {
              usedCardClass = "mab-used-card-won";
            } else {
              usedCardClass = "mab-used-card-lost";
            }
            disabledAttr = "disabled"; // native disabling
          }

          let cardFullPowerDisplayOption = "d-none";

          if (
            (card.mab_CardFullPower || card.mab_CardFullPower === 0) &&
            ((self.Battle_DoesPlayerGoFirst === true && (index + 1) % 2 != 0) ||
              (self.Battle_DoesPlayerGoFirst === false && (index + 1) % 2 == 0))
          ) {
            cardFullPowerDisplayOption = "";
          }

          let card_Html = `
              <div class="d-flex flex-column justify-content-center align-items-center w-100 gap-3">             
                <button
                  class="btn button-mab-arena-assigned-player-cards mab-card mab-card-front ${usedCardClass}" 
                  ${disabledAttr}
                  type="button"              
                  data-player-card-id="${card.mab_PlayerCardId}"
                  >

                  <div class="d-flex flex-row justify-content-between align-items-center w-100">
                    <span>${card.mab_CardName}</span>                                   

                    <div>
                      <span>${card.mab_CardPower}</span>

                      <span>|</span>

                      <span>${card.mab_CardUpperHand}</span>
                    </div>
                  </div>

                  <div class="d-flex flex-row justify-content-center align-items-center gap-3">                  

                    <img src="${imgPath}" class="cardtype"/>

                    <span class="mab-full-card-power ${cardFullPowerDisplayOption}">${card.mab_CardFullPower}</span>

                  </div>

                  <div class="d-flex flex-row justify-content-center align-items-center w-100">
                    <div>
                      <span class="cardCode">${card.mab_CardCode}</span>
                    </div>                    
                  </div>
                </button>   

                <button class="btn btn-outline-info btn-sm confirm-duelling-card mab-player-confirm-card-choice-${card.mab_PlayerCardId} hide-div">
                  confirm
                </button>
              </div>                                                             
                                              
               
            `;

          let duelPoints = "-";
          let pointsResultClass = "";
          let result = "";
          if (card.mab_DuelPoints || card.mab_DuelPoints === 0) {
            duelPoints = card.mab_DuelPoints;

            if (duelPoints > 0) {
              pointsResultClass = "paint-green";
              result = "VICTORY!";
            } else {
              pointsResultClass = "paint-red";
              result = "DEFEAT!";
            }
          }

          let duelEarnedXp = "-";
          let xpResultClass = "";
          if (card.mab_DuelEarnedXp || card.mab_DuelEarnedXp === 0) {
            duelEarnedXp = card.mab_DuelEarnedXp;
            xpResultClass =
              card.mab_DuelEarnedXp > 0 ? "paint-green" : "paint-red";
          }

          let duelBonusXp = "-";
          let bonusXpResultClass = "";
          if (card.mab_DuelBonusXp || card.mab_DuelBonusXp === 0) {
            duelBonusXp = card.mab_DuelBonusXp;
            bonusXpResultClass =
              card.mab_DuelEarnedXp > 0 ? "paint-green" : "paint-red";
          }

          let duel_resultsHtml = `
              <div class="mab-duel-results">
                  <div class="d-flex flex-row text-start w-100 ps-3">
                      <span>R</span>esults&nbsp; 
                      <span>D</span>uel&nbsp; 
                      <span>#${
                        index + 1
                      }</span>:                                                       
                  </div>  

                  <div class="d-flex text-start w-100 ps-3">
                    Points:&nbsp;<span class="${pointsResultClass}">${duelPoints}</span>                                                  
                  </div>  

                  <div class="d-flex text-start w-100 ps-3">  
                    Xp:&nbsp;<span class="${xpResultClass}">${duelEarnedXp}</span>   
                  </div> 
                  
                  <div class="d-flex text-start w-100 ps-3">
                    Bonus Xp:&nbsp;<span class="${bonusXpResultClass}">${duelBonusXp}</span>  
                  </div> 

                  <div class="d-flex justify-content-center align-items-center w-100 ${pointsResultClass}">
                    ${result}
                  </div>
                   
                </div>                 
              </div> 
            `;

          self.Blocks.PlayerCards.append(card_Html);

          self.Blocks.PlayerDuelResults.append(duel_resultsHtml);
        });

        if (self.IsPlayerTurn === true) {
          $(".button-mab-arena-assigned-player-cards")
            .removeClass("frozen-card")
            .addClass("active-card");
        } else {
          $(".button-mab-arena-assigned-player-cards")
            .removeClass("active-card")
            .addClass("frozen-card");
        }
      },
      error: function (xhr, status, error) {
        sweetAlertError(
          "Failed to fetch user available and assigned cards. Try again later."
        );
      },
    });
  };
  self.Duel_PlayerAttacks = () => {
    const formData = new FormData();
    formData.append("Mab_PlayerCardId", self.PlayerDuellingCard_PlayerCardId);

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/mabplayerattacks",
      data: formData,
      processData: false,
      contentType: false,
      xhrFields: {
        withCredentials: true, // Only if you're using cookies; otherwise can be removed
      },
      success: (resp) => {
        if (!resp.content) {
          sweetAlertError(resp.message);

          return;
        }

        $(".button-mab-arena-assigned-player-cards")
          .removeClass("active-card")
          .addClass("frozen-card");

        self.Duel_ManageTurn();
      },
      error: (err) => {
        sweetAlertError(err);
      },
      complete: () => {},
    });
  };
  self.Duel_PlayerRetreats = () => {
    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/mabplayerretreats",
      xhrFields: {
        withCredentials: true, // Only if you're using cookies; otherwise can be removed
      },
      success: (resp) => {
        if (!resp.content) {
          sweetAlertError(resp.message);

          return;
        }

        self.HasPlayerRetreated = true;

        self.Duel_ManageTurn();
      },
      error: (err) => {
        sweetAlertError(err);
      },
      complete: () => {},
    });
  };
  self.duel_RenderPlayerState = () => {
    self.Fields.PlayerState.empty();

    let img_state_one_normal = `/images/icons/mab_player_states/state_one_normal.svg`;
    let img_state_two_flawless = `/images/icons/mab_player_states/state_two_flawless.svg`;
    let img_state_three_matchless = `/images/icons/mab_player_states/state_three_matchless.svg`;
    let img_state_four_impredictable = `/images/icons/mab_player_states/state_four_impredictable.svg`;
    let img_state_five_unstopable = `/images/icons/mab_player_states/state_five_unstopable.svg`;
    let img_state_six_triumphant = `/images/icons/mab_player_states/state_six_triumphant.svg`;
    let img_state_seven_glorious = `/images/icons/mab_player_states/state_seven_glorious.svg`;
    let img_state_eight_panicking = `/images/icons/mab_player_states/state_eight_panicking.svg`;

    let imgPath = ``;

    switch (self.PlayerState) {
      case "Normal":
        imgPath = img_state_one_normal;
        break;
      case "Flawless":
        imgPath = img_state_two_flawless;
        break;
      case "Matchless":
        imgPath = img_state_three_matchless;
        break;
      case "Impredictable":
        imgPath = img_state_four_impredictable;
        break;
      case "Unstopable":
        imgPath = img_state_five_unstopable;
        break;
      case "Triumphant":
        imgPath = img_state_six_triumphant;
        break;
      case "Glorious":
        imgPath = img_state_seven_glorious;
        break;
      case "Panicking":
        imgPath = img_state_eight_panicking;
        break;
      default:
        imgPath = img_state_one_normal;
        break;
    }

    self.Fields.PlayerState.html(
      `<img src="${imgPath}" class="playerState-img"/>`
    );
    const tooltipEl = document.getElementById("mab-player-state-tooltip");

    // check if tooltip already exists
    let tooltip = bootstrap.Tooltip.getInstance(tooltipEl);

    if (tooltip) {
      // update tooltip text dynamically
      tooltip.setContent({
        ".tooltip-inner": `Player State: ${self.PlayerState}`,
      });
    } else {
      // initialize tooltip if not yet created
      tooltip = new bootstrap.Tooltip(tooltipEl, {
        title: `Player State: ${self.PlayerState}`,
      });
    }
  };

  self.Duel_NpcAttacks = () => {
    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/mabnpcattacks",
      xhrFields: {
        withCredentials: true,
      },
      success: (resp) => {
        if (!resp.content) {
          sweetAlertError(resp.message);
        }

        self.NpcDuellingCard_CardName = resp.content.mab_CardName;
        self.NpcDuellingCard_CardLevel = resp.content.mab_CardLevel;
        self.NpcDuellingCard_CardPower = resp.content.mab_CardPower;
        self.NpcDuellingCard_CardUpperHand = resp.content.mab_CardUpperHand;
        self.NpcDuellingCard_CardType = resp.content.mab_CardType;

        self.NpcCards.push(resp.content);

        self.battle_ListNpcCards();

        setTimeout(() => {
          self.Duel_ManageTurn();
        }, 300);
      },
      error: (err) => {
        sweetAlertError(err);
      },
      complete: () => {},
    });
  };
  self.Duel_GetNpcPotentialFullCardPower = () => {
    $.ajax({
      type: "GET",
      url: `https://localhost:7081/users/mabgetnpccardfullpower?Mab_PlayerCardId=${self.PlayerDuellingCard_PlayerCardId}`,
      xhrFields: { withCredentials: true },
      success: function (resp) {
        if (!resp.content) {
          sweetAlertError("Error", response.message);
          return;
        }

        self.NpcPotentialFullCardPower = resp.content.mab_NpcCardFullPower;

        self.battle_ListNpcCards();
      },
      error: function () {
        sweetAlertError(
          "Failed to fetch user available and assigned card copies. Try again later."
        );
      },
    });
  };
  self.battle_ListNpcCards = () => {
    self.Blocks.NpcCards.empty();

    self.NpcCards.forEach((card, index) => {
      let usedCardClass = "";

      if (
        !self.NpcWinningStreak[index] &&
        self.NpcWinningStreak[index] !== false
      ) {
        usedCardClass = "chosen-card";
      } else if (self.NpcWinningStreak[index] === true) {
        usedCardClass = "mab-used-card-won";
      } else {
        usedCardClass = "mab-used-card-lost";
      }

      let imgPath = ``;

      switch (card.mab_CardType) {
        case "Neutral":
          imgPath = self.Imgs.MabCardTypeNeutral;
          break;
        case "Ranged":
          imgPath = self.Imgs.MabCardTypeRanged;
          break;
        case "Cavalry":
          imgPath = self.Imgs.MabCardTypeCavalry;
          break;
        case "Infantry":
          imgPath =
            playerCard.mab_CardPower === playerCard.mab_CardUpperHand
              ? self.Imgs.MabCardPickeAxe
              : self.Imgs.MabCardTypeInfantry;
          break;
        default:
          self.sweetAlertError("Failed to fetch mab card type");
          break;
      }

      if (
        card.mab_CardType === "Neutral" &&
        (card.mab_CardPower === 0) & (card.mab_CardUpperHand === 0)
      ) {
        imgPath = "";
        imgPath = self.Imgs.MabCardTruce;
      }

      let cardFullPower = null;

      if (
        !self.NpcCardFullPowerSequence[index] &&
        self.NpcCardFullPowerSequence[index] != 0
      ) {
        if (!self.NpcPotentialFullCardPower) {
          cardFullPower = "-";
        } else {
          cardFullPower = self.NpcPotentialFullCardPower;
        }
      } else {
        cardFullPower = self.NpcCardFullPowerSequence[index];
      }

      let cardFullPowerDisplayOption = "d-none";

      if (
        ((cardFullPower || cardFullPower === 0) &&
          self.Battle_DoesPlayerGoFirst === false &&
          (index + 1) % 2 != 0) ||
        (self.Battle_DoesPlayerGoFirst === true && (index + 1) % 2 == 0)
      ) {
        cardFullPowerDisplayOption = "";
      }

      let usedNpcCard_Html = `
        <div class="d-flex flex-column">
          <div
            class="mab-card mab-card-front ${usedCardClass} frozen-card"               
            
            >

            <div class="d-flex flex-row justify-content-between align-items-center w-100">
              <span>${card.mab_CardName}</span>

              <div>
                <span>${card.mab_CardPower}</span>

                <span>|</span>

                <span>${card.mab_CardUpperHand}</span>
              </div>
            </div>

            <div class="d-flex flex-row justify-content-center align-items-center gap-3">                  

              <img src="${imgPath}" class="cardtype"/>

              <span class="mab-full-card-power ${cardFullPowerDisplayOption}">${cardFullPower}</span>

            </div>

            <div class="d-flex flex-row justify-content-center align-items-center w-100">                  
              <div>
                <span class="cardCode">${card.mab_CardCode}</span>
              </div>                      
            </div>
          </div> 
        </div>  
      `;

      self.Blocks.NpcCards.append(usedNpcCard_Html);
    });

    if (self.NpcCards.length < self.DeckSize) {
      for (let i = 0; i < self.DeckSize - self.NpcCards.length; i++) {
        let available_cardHtml = `
            <div class="mab-card mab-card-back">
              <img src="/images/icons/mab_card_types/visored-helm.svg" class="cardtype" />
            </div>             
            `;

        self.Blocks.NpcCards.append(available_cardHtml);
      }
    }
  };

  self.Duel_ManageTurn = () => {
    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/mabmanageturn",
      xhrFields: {
        withCredentials: true, // Only if you're using cookies; otherwise can be removed
      },
      success: (resp) => {
        if (!resp.content) {
          self.sweetAlertError(resp.message);
          return;
        }

        self.Duel_CheckStatus();
      },
      error: (err) => {
        self.sweetAlertError("MAB MANAGE TURN Failed!");
      },
      complete: () => {},
    });
  };

  self.arena_EnableButtons = () => {
    self.Buttons.ConfirmDuellingCardChoice.removeClass(
      "mab-arena-button-hidden"
    ).addClass("mab-arena-button-display");
  };

  self.battle_RenderDuel = () => {
    self.Fields.ArenaMessages.empty();

    if (self.HasPlayerRetreated === true) {
      self.Fields.ArenaMessages.html(`Player is retreating...`);

      return;
    }

    if (
      self.AreTurnsFinished === true &&
      self.IsDuelResolved === true &&
      self.IsBattleFinished === false
    ) {
      self.Fields.ArenaMessages.html(`Starting new duel ...`);

      setTimeout(() => {
        self.Duel_Start();
      }, self.Duel_AnimationsTime);

      self.NewDuelBegins = null;

      return;
    }

    if (self.AreTurnsFinished === true && self.IsDuelResolved === false) {
      self.Duel_Resolve();

      return;
    }

    if (self.IsPlayerTurn === true && self.AreTurnsFinished == false) {
      self.Fields.ArenaMessages.html(
        `Players's Turn: a card must be chosen...`
      );

      self.Battle_ListPlayerDuellingCards();
      setTimeout(() => {}, self.Duel_AnimationsTime);

      return;
    }

    if (self.IsPlayerTurn === false && self.AreTurnsFinished == false) {
      self.Fields.ArenaMessages.html(`NPC's Turn: a card is being chosen...`);

      setTimeout(() => {}, self.Duel_AnimationsTime);
      self.Duel_NpcAttacks();

      return;
    }

    if (self.IsBattleFinished === true) {
      self.battle_ListNpcCards();
      self.Battle_ListPlayerDuellingCards();

      self.Buttons.Arena_Retreat.prop("disabled", true);

      let msg = self.Battle_Points > 0 ? "Victory!" : "Defeat!";

      self.Fields.ArenaMessages.html(`BATTLE FINISHED: ${msg}`);

      self.Battle_Finish();
    }
  };

  self.reset_Arena = () => {
    self.DuelsCount = null;
    self.IsPlayerTurn = null;
    self.IsPlayerDefending = null;
    self.AreTurnsFinished = null;
    self.IsDuelResolved = null;
    self.PlayerState = null;
    self.IsBattleFinished = false;
    self.DeckSize = null;

    self.NewDuelBegins = null;

    self.HasPlayerRetreated = false;

    self.BattleId = null;
    self.Battle_Points = 0;
    self.Battle_EarnedXp = 0;
    self.Battle_BonusXp = 0;
    self.Battle_DoesPlayerGoFirst = null;

    self.Duel_EarnedPoints = null;
    self.Duel_EarnedXp = null;
    self.Duel_BonusXp = null;
    self.Duel_HasPlayerWon = null;

    self.Duel_AnimationsTime = 1600;

    self.PlayerCards = [];
    self.PlayerDuellingCard_PlayerCardId = null;
    self.PlayerDuellingCard_CardName = null;
    self.PlayerDuellingCard_CardLevel = null;
    self.PlayerDuellingCard_CardType = null;
    self.PlayerDuellingCard_CardPower = null;
    self.PlayerDuellingCard_CardUpperHand = null;
    self.PlayerDuellingCard_CardFullPower = null;

    self.NpcCards = [];
    self.NpcCardFullPowerSequence = [];
    self.NpcWinningStreak = [];
    self.NpcDuellingCard_NpcCardId = null;
    self.NpcDuellingCard_CardName = null;
    self.NpcDuellingCard_CardLevel = null;
    self.NpcDuellingCard_CardType = null;
    self.NpcDuellingCard_CardPower = null;
    self.NpcDuellingCard_CardUpperHand = null;
    self.NpcDuellingCard_CardFullPower = null;
    self.NpcPotentialFullCardPower = null;

    self.Fields.BattlePoints.empty();
    self.Fields.BattlePoints.html("...&nbsp;");
    self.Fields.BattleEarnedXp.empty();
    self.Fields.BattleEarnedXp.html("...&nbsp;");
    self.Fields.BattleBonusXp.empty();
    self.Fields.BattleBonusXp.html("...&nbsp;");

    self.Fields.DuelNumber.empty();
    self.Fields.ArenaMessages.empty();

    self.Fields.NpcFirstToGoImg.empty();
    self.Fields.NpcName.empty();
    self.Fields.NpcLevel.empty();

    self.Fields.PlayerFirstToGoImg.empty();
    self.Fields.PlayerNickName.empty();
    self.Fields.PlayerLevel.empty();
    self.Fields.PlayerState.empty();

    self.Blocks.NpcCards.empty();

    self.Blocks.PlayerCards.empty();

    self.Buttons.Arena_Retreat.prop("disabled", false);
  };

  self.clear_PlayerDuellingCard = () => {
    self.PlayerDuellingCard_PlayerCardId = null;
    self.PlayerDuellingCard_CardName = null;
    self.PlayerDuellingCard_CardLevel = null;
    self.PlayerDuellingCard_CardType = null;
    self.PlayerDuellingCard_CardPower = null;
    self.PlayerDuellingCard_CardUpperHand = null;
    self.PlayerDuellingCard_CardFullPower = null;
  };
  self.clear_NpcDuellingCard = () => {
    self.NpcDuellingCard_NpcCardId = null;
    self.NpcDuellingCard_CardName = null;
    self.NpcDuellingCard_CardLevel = null;
    self.NpcDuellingCard_CardType = null;
    self.NpcDuellingCard_CardPower = null;
    self.NpcDuellingCard_CardUpperHand = null;
    self.NpcDuellingCard_CardFullPower = null;
  };
  self.clear_DuelResults = () => {
    self.Duel_EarnedPoints = null;
    self.Duel_EarnedXp = null;
    self.Duel_BonusXp = null;
    self.Duel_HasPlayerWon = null;
    self.NpcPotentialFullCardPower = null;
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
