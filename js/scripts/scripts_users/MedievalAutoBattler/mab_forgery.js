function mab_forgery() {
  let self = this;

  self.IsBuilt = false;

  self.PlayerCardId = null;

  self.loadReferences = () => {
    self.DOM = $("#dom-medieval-auto-battler");

    self.MabContainersContent = self.DOM.find("#mab-containers-content");

    self.Containers = [];
    self.Containers[self.Containers.length] = self.Containers.MainMenu =
      self.DOM.find("#container-mab-main-menu");
    self.Containers[self.Containers.length] = self.Containers.Forgery =
      self.DOM.find("#container-mab-forgery");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.Forgery_ShowContainer =
      self.Containers.MainMenu.find("#button-mab-forgery-show-container");
    self.Buttons[self.Buttons.length] = self.Buttons.Forgery_HideContainer =
      self.Containers.Forgery.find("#button-mab-forgery-hide-container");
    self.Buttons[self.Buttons.length] = self.Buttons.Forgery_Forge =
      self.Containers.Forgery.find("#button-mab-forgery-forge");
    self.Buttons[self.Buttons.length] = self.Buttons.Forgery_Sharpen =
      self.Containers.Forgery.find("#button-mab-forgery-sharpen");
    self.Buttons[self.Buttons.length] = self.Buttons.Forgery_Melt =
      self.Containers.Forgery.find("#button-mab-forgery-melt");

    self.Forgery_ListPlayerCards_Select2 = self.Containers.Forgery.find(
      "#select-mab-forgery-player-cards"
    );

    self.Blocks = [];
    self.Blocks[self.Blocks.length] = self.Blocks.Forgery_CoinsBlock =
      self.Containers.Forgery.find("#block-mab-forgery-coins");
    self.Blocks[self.Blocks.length] = self.Blocks.Forgery_XpBlock =
      self.Containers.Forgery.find("#block-mab-forgery-xp");

    self.Blocks[self.Blocks.length] = self.Blocks.Forgery_BrassBlock =
      self.Containers.Forgery.find("#block-mab-forgery-brass");
    self.Blocks[self.Blocks.length] = self.Blocks.Forgery_CopperBlock =
      self.Containers.Forgery.find("#block-mab-forgery-copper");
    self.Blocks[self.Blocks.length] = self.Blocks.Forgery_Iron =
      self.Containers.Forgery.find("#block-mab-forgery-iron");

    self.Blocks[self.Blocks.length] = self.Blocks.Forgery_SteelBlock =
      self.Containers.Forgery.find("#block-mab-forgery-steel");
    self.Blocks[self.Blocks.length] = self.Blocks.Forgery_TitaniumBlock =
      self.Containers.Forgery.find("#block-mab-forgery-titanium");
    self.Blocks[self.Blocks.length] = self.Blocks.Forgery_SilverBlock =
      self.Containers.Forgery.find("#block-mab-forgery-silver");

    self.Blocks[self.Blocks.length] = self.Blocks.Forgery_GoldBlock =
      self.Containers.Forgery.find("#block-mab-forgery-gold");
    self.Blocks[self.Blocks.length] = self.Blocks.Forgery_DiamondBlock =
      self.Containers.Forgery.find("#block-mab-forgery-diamond");
    self.Blocks[self.Blocks.length] = self.Blocks.Forgery_AdamantiumBlock =
      self.Containers.Forgery.find("#block-mab-forgery-adamantium");

    self.Fields = [];
    self.Fields[self.Fields.length] = self.Fields.Forgery_Coins =
      self.Containers.Forgery.find("#span-mab-forgery-owned-coins");
    self.Fields[self.Fields.length] = self.Fields.Forgery_Xp =
      self.Containers.Forgery.find("#span-mab-forgery-owned-xp");

    self.Fields[self.Fields.length] = self.Fields.Forgery_Brass =
      self.Containers.Forgery.find("#span-mab-forgery-owned-brass");
    self.Fields[self.Fields.length] = self.Fields.Forgery_Copper =
      self.Containers.Forgery.find("#span-mab-forgery-owned-copper");
    self.Fields[self.Fields.length] = self.Fields.Forgery_Iron =
      self.Containers.Forgery.find("#span-mab-forgery-owned-iron");

    self.Fields[self.Fields.length] = self.Fields.Forgery_Steel =
      self.Containers.Forgery.find("#span-mab-forgery-owned-steel");
    self.Fields[self.Fields.length] = self.Fields.Forgery_Titanium =
      self.Containers.Forgery.find("#span-mab-forgery-owned-titanium");
    self.Fields[self.Fields.length] = self.Fields.Forgery_Silver =
      self.Containers.Forgery.find("#span-mab-forgery-owned-silver");

    self.Fields[self.Fields.length] = self.Fields.Forgery_Gold =
      self.Containers.Forgery.find("#span-mab-forgery-owned-gold");
    self.Fields[self.Fields.length] = self.Fields.Forgery_Diamond =
      self.Containers.Forgery.find("#span-mab-forgery-owned-diamond");
    self.Fields[self.Fields.length] = self.Fields.Forgery_Adamantium =
      self.Containers.Forgery.find("#span-mab-forgery-owned-adamantium");

    self.Fields[self.Fields.length] = self.Fields.Forgery_CardName =
      self.Containers.Forgery.find("#span-mab-forgery-card-name");
    self.Fields[self.Fields.length] = self.Fields.Forgery_CardPower =
      self.Containers.Forgery.find("#span-mab-forgery-card-power");
    self.Fields[self.Fields.length] = self.Fields.Forgery_CardUpperHand =
      self.Containers.Forgery.find("#span-mab-forgery-card-upper-hand");
    self.Fields[self.Fields.length] = self.Fields.Forgery_CardType =
      self.Containers.Forgery.find("#img-mab-forgery-card-type");
    self.Fields[self.Fields.length] = self.Fields.Forgery_CardCode =
      self.Containers.Forgery.find("#span-mab-forgery-card-code");

    self.Forgery_Card = self.Containers.Forgery.find("#mab-forgery-card");
    self.Forgery_Tools = self.Containers.Forgery.find("#mab-forgery-tools");

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
    self.Imgs[self.Imgs.length] =
      self.Imgs.QuestionMark = `/images/icons/mab/question_mark_default_img.svg`;
  };

  self.loadEvents = () => {
    self.Buttons.Forgery_ShowContainer.on("click", (e) => {
      e.preventDefault();

      self.mainMenu_HideContainer();

      self.forgery_ShowContainer();

      self.IsBuilt = false;

      self.Forgery_ListResources();
    });

    self.Buttons.Forgery_HideContainer.on("click", (e) => {
      e.preventDefault();

      self.forgery_HideContainer();

      self.IsBuilt = false;

      self.mainMenu_ShowContainer();

      __global.MabMainMenuController.LoadCampaignStatistics();
    });

    self.Forgery_ListPlayerCards_Select2.on("select2:select", (e) => {
      const selectedData = e.params.data;

      self.PlayerCardId = selectedData.id;

      self.Forgery_RenderPlayerCard();
    });

    self.Buttons.Forgery_Forge.on("click", (e) => {
      e.preventDefault();

      self.Buttons.Forgery_Forge.blur();

      self.Forgery_ForgeCard();
    });

    self.Buttons.Forgery_Sharpen.on("click", (e) => {
      e.preventDefault();

      self.Buttons.Forgery_Sharpen.blur();

      self.Forgery_SharpenCard();
    });

    self.Buttons.Forgery_Melt.on("click", (e) => {
      e.preventDefault();

      self.Buttons.Forgery_Melt.blur();

      self.Forgery_MeltCard();
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
  self.forgery_ShowContainer = () => {
    self.toggleContainerVisibility(self.Containers.Forgery);
    self.forgery_clearData();
  };
  self.forgery_HideContainer = () => {
    self.toggleContainerVisibility(self.Containers.Forgery);
  };

  self.Forgery_ListResources = () => {
    $.ajax({
      method: "GET",
      url: "https://localhost:7081/users/mablistresources",
      xhrFields: {
        withCredentials: true,
      },
      success: function (resp) {
        if (!resp.content) {
          self.sweetAlertError(resp.message);

          return;
        }

        let resources = resp.content;

        self.Fields.Forgery_Coins.empty();
        self.Fields.Forgery_Xp.empty();

        self.Fields.Forgery_Brass.empty();
        self.Fields.Forgery_Copper.empty();
        self.Fields.Forgery_Iron.empty();

        self.Fields.Forgery_Steel.empty();
        self.Fields.Forgery_Titanium.empty();
        self.Fields.Forgery_Silver.empty();

        self.Fields.Forgery_Gold.empty();
        self.Fields.Forgery_Diamond.empty();
        self.Fields.Forgery_Adamantium.empty();

        self.Fields.Forgery_Coins.html(resources.mab_Coins);

        self.Fields.Forgery_Xp.html(resources.mab_Xp);

        self.Fields.Forgery_Brass.html(resources.mab_Brass);

        self.Fields.Forgery_Copper.html(resources.mab_Copper);

        self.Fields.Forgery_Iron.html(resources.mab_Iron);

        self.Fields.Forgery_Steel.html(resources.mab_Steel);

        self.Fields.Forgery_Titanium.html(resources.mab_Titanium);

        self.Fields.Forgery_Silver.html(resources.mab_Silver);

        self.Fields.Forgery_Gold.html(resources.mab_Gold);

        self.Fields.Forgery_Diamond.html(resources.mab_Diamond);

        self.Fields.Forgery_Adamantium.html(resources.mab_Adamantium);

        self.Forgery_LoadPlayerCards();
      },
      error: function (xhr, status, error) {
        self.sweetAlertError("Request failed:", error);
      },
    });
  };

  self.Forgery_LoadPlayerCards = () => {
    if (
      self.Forgery_ListPlayerCards_Select2.hasClass("select2-hidden-accessible")
    ) {
      self.Forgery_ListPlayerCards_Select2.select2("destroy");
    }

    fetch(`https://localhost:7081/users/mablistunassignedplayercards`, {
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
          id: item.mab_PlayerCardId,
          text: item.mab_CardDescription,
        }));

        // Clear previous options and add empty one
        self.Forgery_ListPlayerCards_Select2.empty().append(
          `<option></option>`
        );

        // Builds select2
        self.Forgery_ListPlayerCards_Select2.select2({
          data: mabPlayerCards,
          dropdownParent: self.DOM,
          placeholder: "Select a card...",
          allowClear: true,
          theme: "classic",
          width: "100%",
          templateSelection: (data) => {
            if (!data.id) return data.text;
            return $("<strong>").text(data.text);
          },
        });

        if (self.IsBuilt === false) {
          // Opens select2
          self.Forgery_ListPlayerCards_Select2.trigger("change").select2(
            "open"
          );

          self.IsBuilt = true;
        }
      })
      .catch((err) => {
        self.sweetAlertError("Error fetching mab player cards:", err);
      });
  };

  self.Forgery_RenderPlayerCard = () => {
    $.ajax({
      method: "GET",
      url: `https://localhost:7081/users/mabshowplayercarddetails?Mab_PlayerCardId=${self.PlayerCardId}`,
      xhrFields: {
        withCredentials: true,
      },
      success: function (resp) {
        if (!resp.content) {
          self.sweetAlertError(resp.message);
          return;
        }

        self.forgery_clearData();

        let playerCard = resp.content;

        let imgPath = "";

        self.Fields.Forgery_CardName.html(playerCard.mab_CardName);
        self.Fields.Forgery_CardPower.html(playerCard.mab_CardPower);
        self.Fields.Forgery_CardUpperHand.html(playerCard.mab_CardUpperHand);
        self.Fields.Forgery_CardCode.html(playerCard.mab_CardCode);

        switch (playerCard.mab_CardType) {
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
            imgPath = self.Imgs.QuestionMark;
            break;
        }

        if (
          playerCard.mab_CardType === "Neutral" &&
          playerCard.mab_CardPower === 0 &&
          playerCard.mab_CardUpperHand === 0
        ) {
          imgPath = "";
          imgPath = self.Imgs.MabCardTruce;
        }

        self.Fields.Forgery_CardType.attr("src", imgPath);

        self.Forgery_Card.removeClass("hide-div").addClass("show-div");
        self.Forgery_Tools.removeClass("hide-div").addClass("show-div");
      },
      error: function (error) {
        self.sweetAlertError(error);
      },
    });
  };

  self.Forgery_ForgeCard = () => {
    const formData = new FormData();
    formData.append("Mab_PlayerCardId", self.PlayerCardId);

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/mabforgecard",
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

        self.forgery_clearData();

        self.PlayerCardId = resp.content.mab_PlayerCardId;

        self.Forgery_ListResources();

        setTimeout(() => {
          self.Forgery_RenderPlayerCard();
        }, 200);

        self.Forgery_ListPlayerCards_Select2.select2("close");
      },
      error: (err) => {
        sweetAlertError(err);
      },
    });
  };
  self.Forgery_SharpenCard = () => {
    const formData = new FormData();
    formData.append("Mab_PlayerCardId", self.PlayerCardId);

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/mabsharpencard",
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

        self.forgery_clearData();

        self.PlayerCardId = resp.content.mab_PlayerCardId;

        self.Forgery_ListResources();

        setTimeout(() => {
          self.Forgery_RenderPlayerCard();
        }, 200);

        self.Forgery_ListPlayerCards_Select2.select2("close");
      },
      error: (err) => {
        self.sweetAlertError(err);
      },
    });
  };
  self.Forgery_MeltCard = () => {
    const formData = new FormData();
    formData.append("Mab_PlayerCardId", self.PlayerCardId);

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/mabmeltcard",
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

        let material = resp.content.mab_RawMaterialType;
        let extractedRawMaterial = resp.content.mab_ExtractedRawMaterial;
        let gainedXp = resp.content.mab_GainedXp;

        let results = `Extracted ${material}: ${extractedRawMaterial}, gained Xp: ${gainedXp}`;

        self.sweetAlertSuccess("Melting results:", results);

        self.forgery_clearData();

        self.Forgery_ListResources();
      },
      error: (err) => {
        self.sweetAlertError(err);
      },
    });
  };

  self.forgery_clearData = () => {
    self.Fields.Forgery_CardType.attr("src", self.Imgs.QuestionMark);
    self.Forgery_Card.removeClass("show-div").addClass("hide-div");
    self.Forgery_Tools.removeClass("show-div").addClass("hide-div");

    self.Fields.Forgery_CardName.empty();
    self.Fields.Forgery_CardPower.empty();

    self.Fields.Forgery_CardUpperHand.empty();
    self.Fields.Forgery_CardCode.empty();
  };

  self.build = () => {
    self.loadReferences();

    self.loadEvents();
  };

  self.build();
}

$(function () {
  new mab_forgery();
});
