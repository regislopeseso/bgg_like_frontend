function mab_deck_booster() {
  let self = this;

  self.IsBuilt = false;

  self.loadReferences = () => {
    self.DOM = $("#dom-medieval-auto-battler");

    self.MabContainersContent = self.DOM.find("#mab-containers-content");

    self.Containers = [];
    self.Containers[self.Containers.length] = self.Containers.MainMenu =
      self.DOM.find("#container-mab-main-menu");
    self.Containers[self.Containers.length] = self.Containers.DeckBooster =
      self.MabContainersContent.find("#container-mab-deck-booster");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] =
      self.Buttons[self.Buttons.length] =
      self.Buttons.ShowContainer_DeckBooster =
        self.Containers.MainMenu.find(
          "#button-mab-deck-booster-show-container"
        );
    self.Buttons[self.Buttons.length] = self.Buttons.HideContainer_DeckBooster =
      self.Containers.DeckBooster.find(
        "#button-mab-deck-booster-hide-container"
      );

    self.Blocks = [];
    self.Blocks[self.Blocks.length] = self.Blocks.PlayerNewCards =
      self.Containers.DeckBooster.find(
        "#block-mab-deck-booster-new-player-cards"
      );

    self.Imgs = [];
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
    self.Buttons.ShowContainer_DeckBooster.on("click", (e) => {
      e.preventDefault();

      self.DeckBooster_GetDeal();
    });

    self.Buttons.HideContainer_DeckBooster.on("click", (e) => {
      e.preventDefault();

      self.deckBooster_HideContainer();

      self.mainMenu_ShowContainer();
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
  self.sweetAlertWarning_BuyDeckBooster = (boosterPrice, boosterContent) => {
    return Swal.fire({
      position: "center",
      confirmButtonText: "Buy",
      icon: "warning",
      toast: "true",
      theme: "bulma",
      title: "Deck Booster Deal is:",
      text: boosterPrice + " for " + boosterContent,
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
  self.deckBooster_ShowContainer = () => {
    self.toggleContainerVisibility(self.Containers.DeckBooster);
  };
  self.deckBooster_HideContainer = () => {
    self.toggleContainerVisibility(self.Containers.DeckBooster);
  };

  self.mainMenu_ShowContainer = () => {
    self.toggleContainerVisibility(self.Containers.MainMenu);
  };
  self.mainMenu_HideContainer = () => {
    self.toggleContainerVisibility(self.Containers.MainMenu);
  };

  self.DeckBooster_GetDeal = () => {
    $.ajax({
      type: "GET",
      url: `https://localhost:7081/users/mabgetdeckboosterdeal`,
      xhrFields: { withCredentials: true },
      success: function (resp) {
        if (!resp.content) {
          self.sweetAlertError(resp.message_text);
          return;
        }

        let deckBoosterPrice = resp.content.mab_DeckBoosterPrice;
        let deckBoosterContent = resp.content.mab_DeckBoosterContent;

        self
          .sweetAlertWarning_BuyDeckBooster(
            deckBoosterPrice,
            deckBoosterContent
          )
          .then((isConfirmed) => {
            if (isConfirmed === true) {
              self.DeckBooster_Buy();
            }
          });
      },
      error: function (xhr, status, error) {
        self.sweetAlertError("Failed to fetch campaign statistics");
      },
    });
  };
  self.DeckBooster_Buy = () => {
    self.Blocks.PlayerNewCards.empty();
    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/mabbuydeckbooster",
      xhrFields: {
        withCredentials: true, // Only if you're using cookies; otherwise can be removed
      },
      success: (resp) => {
        if (!resp.content) {
          self.sweetAlertError(resp.message);
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

          let card_Html = `
              <div class="flip-card" id="player-card-${index}">
                <div class="flip-card-inner">
                  <div class="flip-card-front">
                    <img src="/images/icons/mab_card_types/visored-helm.svg" class="cardtype" />
                  </div>

                  <div class="flip-card-back mab-card active-card">
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
                    </div>

                    <div class="d-flex flex-row justify-content-center align-items-center w-100">
                      <div>
                        <span class="cardCode">${card.mab_CardCode}</span>
                      </div>                    
                    </div>
                  </div>
                </div>
              </div>

                                                                                                                             
            `;

          self.Blocks.PlayerNewCards.append(card_Html);

          setTimeout(() => {
            $(`#player-card-${index} .flip-card-inner`).addClass("flipped");
          }, 1000 * (index + 1)); // stagger effect per card
        });

        self.sweetAlertSuccess("Deck Booster Opened!");

        self.mainMenu_HideContainer();
        self.deckBooster_ShowContainer();
      },
      error: (err) => {
        self.sweetAlertError("Failed to buy deck booster! Try again later!");
      },
      complete: () => {},
    });
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
  new mab_deck_booster();
});
