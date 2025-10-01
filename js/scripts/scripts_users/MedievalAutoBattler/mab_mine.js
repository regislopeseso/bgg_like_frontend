function mab_mine() {
  let self = this;

  self.IsBuilt = false;

  self.PlayerCardId = null;

  self.loadReferences = () => {
    self.DOM = $("#dom-medieval-auto-battler");

    self.MabContainersContent = self.DOM.find("#mab-containers-content");

    self.Containers = [];
    self.Containers[self.Containers.length] = self.Containers.MainMenu =
      self.DOM.find("#container-mab-main-menu");
    self.Containers[self.Containers.length] = self.Containers.Mine =
      self.DOM.find("#container-mab-mine");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.Mine_ShowContainer =
      self.Containers.MainMenu.find("#button-mab-mine-show-container");
    self.Buttons[self.Buttons.length] = self.Buttons.Mine_HideContainer =
      self.Containers.Mine.find("#button-mab-mine-hide-container");
    self.Buttons[self.Buttons.length] = self.Buttons.Mine_Forge =
      self.Containers.Mine.find("#button-mab-mine-forge");
    self.Buttons[self.Buttons.length] = self.Buttons.Mine_Sharpen =
      self.Containers.Mine.find("#button-mab-mine-sharpen");
    self.Buttons[self.Buttons.length] = self.Buttons.Mine_Melt =
      self.Containers.Mine.find("#button-mab-mine-melt");

    self.Mine_ListPlayerCards_Select2 = self.Containers.Mine.find(
      "#select-mab-mine-player-cards"
    );

    self.Blocks = [];
    self.Blocks[self.Blocks.length] = self.Blocks.Mine_CoinsBlock =
      self.Containers.Mine.find("#block-mab-mine-coins");
    self.Blocks[self.Blocks.length] = self.Blocks.Mine_XpBlock =
      self.Containers.Mine.find("#block-mab-mine-xp");

    self.Blocks[self.Blocks.length] = self.Blocks.Mine_BrassBlock =
      self.Containers.Mine.find("#block-mab-mine-brass");
    self.Blocks[self.Blocks.length] = self.Blocks.Mine_CopperBlock =
      self.Containers.Mine.find("#block-mab-mine-copper");
    self.Blocks[self.Blocks.length] = self.Blocks.Mine_Iron =
      self.Containers.Mine.find("#block-mab-mine-iron");

    self.Blocks[self.Blocks.length] = self.Blocks.Mine_SteelBlock =
      self.Containers.Mine.find("#block-mab-mine-steel");
    self.Blocks[self.Blocks.length] = self.Blocks.Mine_TitaniumBlock =
      self.Containers.Mine.find("#block-mab-mine-titanium");
    self.Blocks[self.Blocks.length] = self.Blocks.Mine_SilverBlock =
      self.Containers.Mine.find("#block-mab-mine-silver");

    self.Blocks[self.Blocks.length] = self.Blocks.Mine_GoldBlock =
      self.Containers.Mine.find("#block-mab-mine-gold");
    self.Blocks[self.Blocks.length] = self.Blocks.Mine_DiamondBlock =
      self.Containers.Mine.find("#block-mab-mine-diamond");
    self.Blocks[self.Blocks.length] = self.Blocks.Mine_AdamantiumBlock =
      self.Containers.Mine.find("#block-mab-mine-adamantium");

    self.Fields = [];
    self.Fields[self.Fields.length] = self.Fields.Mine_Coins =
      self.Containers.Mine.find("#span-mab-mine-owned-coins");
    self.Fields[self.Fields.length] = self.Fields.Mine_Xp =
      self.Containers.Mine.find("#span-mab-mine-owned-xp");

    self.Fields[self.Fields.length] = self.Fields.Mine_Brass =
      self.Containers.Mine.find("#span-mab-mine-owned-brass");
    self.Fields[self.Fields.length] = self.Fields.Mine_Copper =
      self.Containers.Mine.find("#span-mab-mine-owned-copper");
    self.Fields[self.Fields.length] = self.Fields.Mine_Iron =
      self.Containers.Mine.find("#span-mab-mine-owned-iron");

    self.Fields[self.Fields.length] = self.Fields.Mine_Steel =
      self.Containers.Mine.find("#span-mab-mine-owned-steel");
    self.Fields[self.Fields.length] = self.Fields.Mine_Titanium =
      self.Containers.Mine.find("#span-mab-mine-owned-titanium");
    self.Fields[self.Fields.length] = self.Fields.Mine_Silver =
      self.Containers.Mine.find("#span-mab-mine-owned-silver");

    self.Fields[self.Fields.length] = self.Fields.Mine_Gold =
      self.Containers.Mine.find("#span-mab-mine-owned-gold");
    self.Fields[self.Fields.length] = self.Fields.Mine_Diamond =
      self.Containers.Mine.find("#span-mab-mine-owned-diamond");
    self.Fields[self.Fields.length] = self.Fields.Mine_Adamantium =
      self.Containers.Mine.find("#span-mab-mine-owned-adamantium");

    self.Fields[self.Fields.length] = self.Fields.Mine_CardName =
      self.Containers.Mine.find("#span-mab-mine-card-name");
    self.Fields[self.Fields.length] = self.Fields.Mine_CardPower =
      self.Containers.Mine.find("#span-mab-mine-card-power");
    self.Fields[self.Fields.length] = self.Fields.Mine_CardUpperHand =
      self.Containers.Mine.find("#span-mab-mine-card-upper-hand");
    self.Fields[self.Fields.length] = self.Fields.Mine_CardType =
      self.Containers.Mine.find("#img-mab-mine-card-type");
    self.Fields[self.Fields.length] = self.Fields.Mine_CardCode =
      self.Containers.Mine.find("#span-mab-mine-card-code");

    self.Mine_Card = self.Containers.Mine.find("#mab-mine-card");
    self.Mine_Tools = self.Containers.Mine.find("#mab-mine-tools");

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
      self.Imgs.QuestionMark = `/images/icons/mab/question_mark_default_img.svg`;
  };

  self.loadEvents = () => {
    self.Buttons.Mine_ShowContainer.on("click", (e) => {
      e.preventDefault();

      self.mainMenu_HideContainer();

      self.forgery_ShowContainer();

      self.IsBuilt = false;

      self.Mine_ListResources();
    });

    self.Buttons.Mine_HideContainer.on("click", (e) => {
      e.preventDefault();

      self.forgery_HideContainer();

      self.IsBuilt = false;

      self.mainMenu_ShowContainer();
    });

    self.Mine_ListPlayerCards_Select2.on("select2:select", (e) => {
      const selectedData = e.params.data;

      self.PlayerCardId = selectedData.id;

      self.Mine_RenderPlayerCard();
    });

    self.Buttons.Mine_Forge.on("click", (e) => {
      e.preventDefault();

      self.Buttons.Mine_Forge.blur();

      self.Mine_ForgeCard();
    });

    self.Buttons.Mine_Sharpen.on("click", (e) => {
      e.preventDefault();

      self.Buttons.Mine_Sharpen.blur();

      self.Mine_SharpenCard();
    });

    self.Buttons.Mine_Melt.on("click", (e) => {
      e.preventDefault();

      self.Buttons.Mine_Melt.blur();

      self.Mine_MeltCard();
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
    self.toggleContainerVisibility(self.Containers.Mine);
    self.forgery_clearData();
  };
  self.forgery_HideContainer = () => {
    self.toggleContainerVisibility(self.Containers.Mine);
  };

  self.Mine_ListResources = () => {
    $.ajax({
      method: "GET",
      url: "https://localhost:7081/users/mablistresources",
      xhrFields: {
        withCredentials: true,
      },
      success: function (resp) {
        if (!resp.content) {
          sweetAlertError(resp.message);

          return;
        }

        let resources = resp.content;

        self.Fields.Mine_Coins.empty();
        self.Fields.Mine_Xp.empty();

        self.Fields.Mine_Brass.empty();
        self.Fields.Mine_Copper.empty();
        self.Fields.Mine_Iron.empty();

        self.Fields.Mine_Steel.empty();
        self.Fields.Mine_Titanium.empty();
        self.Fields.Mine_Silver.empty();

        self.Fields.Mine_Gold.empty();
        self.Fields.Mine_Diamond.empty();
        self.Fields.Mine_Adamantium.empty();

        self.Fields.Mine_Coins.html(resources.mab_Coins);

        self.Fields.Mine_Xp.html(resources.mab_Xp);

        self.Fields.Mine_Brass.html(resources.mab_Brass);

        self.Fields.Mine_Copper.html(resources.mab_Copper);

        self.Fields.Mine_Iron.html(resources.mab_Iron);

        self.Fields.Mine_Steel.html(resources.mab_Steel);

        self.Fields.Mine_Titanium.html(resources.mab_Titanium);

        self.Fields.Mine_Silver.html(resources.mab_Silver);

        self.Fields.Mine_Gold.html(resources.mab_Gold);

        self.Fields.Mine_Diamond.html(resources.mab_Diamond);

        self.Fields.Mine_Adamantium.html(resources.mab_Adamantium);

        self.Mine_LoadPlayerCards();
      },
      error: function (xhr, status, error) {
        sweetAlertError("Request failed:", error);
      },
    });
  };

  self.Mine_LoadPlayerCards = () => {
    if (
      self.Mine_ListPlayerCards_Select2.hasClass("select2-hidden-accessible")
    ) {
      self.Mine_ListPlayerCards_Select2.select2("destroy");
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
        self.Mine_ListPlayerCards_Select2.empty().append(`<option></option>`);

        // Builds select2
        self.Mine_ListPlayerCards_Select2.select2({
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
          self.Mine_ListPlayerCards_Select2.trigger("change").select2("open");

          self.IsBuilt = true;
        }
      })
      .catch((err) => {
        self.sweetAlertError("Error fetching mab player cards:", err);
      });
  };

  self.Mine_RenderPlayerCard = () => {
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

        self.Fields.Mine_CardName.html(playerCard.mab_CardName);
        self.Fields.Mine_CardPower.html(playerCard.mab_CardPower);
        self.Fields.Mine_CardUpperHand.html(playerCard.mab_CardUpperHand);
        self.Fields.Mine_CardCode.html(playerCard.mab_CardCode);

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
            imgPath = self.Imgs.MabCardTypeInfantry;
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

        self.Fields.Mine_CardType.attr("src", imgPath);

        self.Mine_Card.removeClass("hide-div").addClass("show-div");
        self.Mine_Tools.removeClass("hide-div").addClass("show-div");
      },
      error: function (error) {
        sweetAlertError(error);
      },
    });
  };

  self.Mine_ForgeCard = () => {
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

        self.Mine_ListResources();

        setTimeout(() => {
          self.Mine_RenderPlayerCard();
        }, 200);

        self.Mine_ListPlayerCards_Select2.select2("close");
      },
      error: (err) => {
        sweetAlertError(err);
      },
    });
  };
  self.Mine_SharpenCard = () => {
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
          debugger;
          self.sweetAlertError(resp.message);

          return;
        }

        self.forgery_clearData();

        self.PlayerCardId = resp.content.mab_PlayerCardId;

        self.Mine_ListResources();

        setTimeout(() => {
          self.Mine_RenderPlayerCard();
        }, 200);

        self.Mine_ListPlayerCards_Select2.select2("close");
      },
      error: (err) => {
        sweetAlertError(err);
      },
    });
  };
  self.Mine_MeltCard = () => {
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
          sweetAlertError(resp.message);

          return;
        }

        let material = resp.content.mab_RawMaterialType;
        let extractedRawMaterial = resp.content.mab_ExtractedRawMaterial;
        let gainedXp = resp.content.mab_GainedXp;

        let results = `Extracted ${material}: ${extractedRawMaterial}, gained Xp: ${gainedXp}`;

        self.sweetAlertSuccess("Melting results:", results);

        self.forgery_clearData();

        self.Mine_ListResources();
      },
      error: (err) => {
        sweetAlertError(err);
      },
    });
  };

  self.forgery_clearData = () => {
    self.Fields.Mine_CardType.attr("src", self.Imgs.QuestionMark);
    self.Mine_Card.removeClass("show-div").addClass("hide-div");
    self.Mine_Tools.removeClass("show-div").addClass("hide-div");

    self.Fields.Mine_CardName.empty();
    self.Fields.Mine_CardPower.empty();

    self.Fields.Mine_CardUpperHand.empty();
    self.Fields.Mine_CardCode.empty();
  };

  self.build = () => {
    self.loadReferences();

    self.loadEvents();
  };

  self.build();
}

$(function () {
  new mab_mine();
});
