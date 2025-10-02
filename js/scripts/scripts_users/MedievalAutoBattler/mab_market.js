function mab_market() {
  let self = this;

  self.IsBuilt = false;

  self.RawMaterialType = null;

  self.loadReferences = () => {
    self.DOM = $("#dom-medieval-auto-battler");

    self.MabContainersContent = self.DOM.find("#mab-containers-content");

    self.Containers = [];
    self.Containers[self.Containers.length] = self.Containers.MainMenu =
      self.DOM.find("#container-mab-main-menu");
    self.Containers[self.Containers.length] = self.Containers.Market =
      self.DOM.find("#container-mab-market");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.Market_ShowContaine =
      self.Containers.MainMenu.find("#button-mab-market-show-container");
    self.Buttons[self.Buttons.length] = self.Buttons.Market_HideContainer =
      self.Containers.Market.find("#button-mab-market-hide-container");

    self.Buttons[self.Buttons.length] = self.Buttons.Market_SellBrass =
      self.Containers.Market.find("#button-mab-market-sell-brass");
    self.Buttons[self.Buttons.length] = self.Buttons.Market_BuyBrass =
      self.Containers.Market.find("#button-mab-market-buy-brass");

    self.Buttons[self.Buttons.length] = self.Buttons.Market_SellCopper =
      self.Containers.Market.find("#button-mab-market-sell-copper");
    self.Buttons[self.Buttons.length] = self.Buttons.Market_BuyCopper =
      self.Containers.Market.find("#button-mab-market-buy-copper");

    self.Buttons[self.Buttons.length] = self.Buttons.Market_SellIron =
      self.Containers.Market.find("#button-mab-market-sell-iron");
    self.Buttons[self.Buttons.length] = self.Buttons.Market_BuyIron =
      self.Containers.Market.find("#button-mab-market-buy-iron");

    self.Buttons[self.Buttons.length] = self.Buttons.Market_SellSteel =
      self.Containers.Market.find("#button-mab-market-sell-steel");
    self.Buttons[self.Buttons.length] = self.Buttons.Market_BuySteel =
      self.Containers.Market.find("#button-mab-market-buy-steel");

    self.Buttons[self.Buttons.length] = self.Buttons.Market_SellTitanium =
      self.Containers.Market.find("#button-mab-market-sell-titanium");
    self.Buttons[self.Buttons.length] = self.Buttons.Market_BuyTitanium =
      self.Containers.Market.find("#button-mab-market-buy-titanium");

    self.Buttons[self.Buttons.length] = self.Buttons.Market_SellSilver =
      self.Containers.Market.find("#button-mab-market-sell-silver");
    self.Buttons[self.Buttons.length] = self.Buttons.Market_BuySilver =
      self.Containers.Market.find("#button-mab-market-buy-silver");

    self.Buttons[self.Buttons.length] = self.Buttons.Market_SellGold =
      self.Containers.Market.find("#button-mab-market-sell-gold");
    self.Buttons[self.Buttons.length] = self.Buttons.Market_BuyGold =
      self.Containers.Market.find("#button-mab-market-buy-gold");

    self.Buttons[self.Buttons.length] = self.Buttons.Market_SellDiamond =
      self.Containers.Market.find("#button-mab-market-sell-diamond");
    self.Buttons[self.Buttons.length] = self.Buttons.Market_BuyDiamond =
      self.Containers.Market.find("#button-mab-market-buy-diamond");

    self.Buttons[self.Buttons.length] = self.Buttons.Market_SellAdamantium =
      self.Containers.Market.find("#button-mab-market-sell-adamantium");
    self.Buttons[self.Buttons.length] = self.Buttons.Market_BuyAdamantium =
      self.Containers.Market.find("#button-mab-market-buy-adamantium");

    self.Blocks = [];
    self.Blocks[self.Blocks.length] = self.Blocks.Market_CoinsBlock =
      self.Containers.Market.find("#block-mab-market-coins");

    self.Blocks[self.Blocks.length] = self.Blocks.Market_BrassBlock =
      self.Containers.Market.find("#block-mab-market-brass");
    self.Blocks[self.Blocks.length] = self.Blocks.Market_CopperBlock =
      self.Containers.Market.find("#block-mab-market-copper");
    self.Blocks[self.Blocks.length] = self.Blocks.Market_Iron =
      self.Containers.Market.find("#block-mab-market-iron");

    self.Blocks[self.Blocks.length] = self.Blocks.Market_SteelBlock =
      self.Containers.Market.find("#block-mab-market-steel");
    self.Blocks[self.Blocks.length] = self.Blocks.Market_TitaniumBlock =
      self.Containers.Market.find("#block-mab-market-titanium");
    self.Blocks[self.Blocks.length] = self.Blocks.Market_SilverBlock =
      self.Containers.Market.find("#block-mab-market-silver");

    self.Blocks[self.Blocks.length] = self.Blocks.Market_GoldBlock =
      self.Containers.Market.find("#block-mab-market-gold");
    self.Blocks[self.Blocks.length] = self.Blocks.Market_DiamondBlock =
      self.Containers.Market.find("#block-mab-market-diamond");
    self.Blocks[self.Blocks.length] = self.Blocks.Market_AdamantiumBlock =
      self.Containers.Market.find("#block-mab-market-adamantium");

    self.Fields = [];
    self.Fields[self.Fields.length] = self.Fields.Market_Coins =
      self.Containers.Market.find("#span-mab-market-owned-coins");

    self.Fields[self.Fields.length] = self.Fields.Market_Brass =
      self.Containers.Market.find("#span-mab-market-owned-brass");
    self.Fields[self.Fields.length] = self.Fields.Market_BrassPrice =
      self.Containers.Market.find("#strong-mab-market-brass-price");

    self.Fields[self.Fields.length] = self.Fields.Market_Copper =
      self.Containers.Market.find("#span-mab-market-owned-copper");
    self.Fields[self.Fields.length] = self.Fields.Market_CopperPrice =
      self.Containers.Market.find("#strong-mab-market-copper-price");

    self.Fields[self.Fields.length] = self.Fields.Market_Iron =
      self.Containers.Market.find("#span-mab-market-owned-iron");
    self.Fields[self.Fields.length] = self.Fields.Market_IronPrice =
      self.Containers.Market.find("#strong-mab-market-iron-price");

    self.Fields[self.Fields.length] = self.Fields.Market_Steel =
      self.Containers.Market.find("#span-mab-market-owned-steel");
    self.Fields[self.Fields.length] = self.Fields.Market_SteelPrice =
      self.Containers.Market.find("#strong-mab-market-steel-price");

    self.Fields[self.Fields.length] = self.Fields.Market_Titanium =
      self.Containers.Market.find("#span-mab-market-owned-titanium");
    self.Fields[self.Fields.length] = self.Fields.Market_TitaniumPrice =
      self.Containers.Market.find("#strong-mab-market-titanium-price");

    self.Fields[self.Fields.length] = self.Fields.Market_Silver =
      self.Containers.Market.find("#span-mab-market-owned-silver");
    self.Fields[self.Fields.length] = self.Fields.Market_SilverPrice =
      self.Containers.Market.find("#strong-mab-market-silver-price");

    self.Fields[self.Fields.length] = self.Fields.Market_Gold =
      self.Containers.Market.find("#span-mab-market-owned-gold");
    self.Fields[self.Fields.length] = self.Fields.Market_GoldPrice =
      self.Containers.Market.find("#strong-mab-market-gold--price");

    self.Fields[self.Fields.length] = self.Fields.Market_Diamond =
      self.Containers.Market.find("#span-mab-market-owned-diamond");
    self.Fields[self.Fields.length] = self.Fields.Market_DiamondPrice =
      self.Containers.Market.find("#strong-mab-market-diamond-price");

    self.Fields[self.Fields.length] = self.Fields.Market_Adamantium =
      self.Containers.Market.find("#span-mab-market-owned-adamantium");
    self.Fields[self.Fields.length] = self.Fields.Market_AdamantiumPrice =
      self.Containers.Market.find("#strong-mab-market-adamantium-price");

    self.Fields[self.Fields.length] = self.Fields.Market_CardName =
      self.Containers.Market.find("#span-mab-market-card-name");
    self.Fields[self.Fields.length] = self.Fields.Market_CardPower =
      self.Containers.Market.find("#span-mab-market-card-power");
    self.Fields[self.Fields.length] = self.Fields.Market_CardUpperHand =
      self.Containers.Market.find("#span-mab-market-card-upper-hand");
    self.Fields[self.Fields.length] = self.Fields.Market_CardType =
      self.Containers.Market.find("#img-mab-market-card-type");
    self.Fields[self.Fields.length] = self.Fields.Market_CardCode =
      self.Containers.Market.find("#span-mab-market-card-code");
  };

  self.loadEvents = () => {
    self.Buttons.Market_ShowContaine.on("click", (e) => {
      e.preventDefault();

      self.mainMenu_HideContainer();

      self.market_ShowContainer();

      self.IsBuilt = false;

      self.Market_ListResources();
    });
    self.Buttons.Market_HideContainer.on("click", (e) => {
      e.preventDefault();

      self.IsBuilt = false;

      self.market_HideContainer();

      self.mainMenu_ShowContainer();

      __global.MabMainMenuController.LoadCampaignStatistics();
    });

    self.Buttons.Market_SellBrass.on("click", (e) => {
      e.preventDefault();

      self.Market_SellRawMaterial("brass");
    });
    self.Buttons.Market_BuyBrass.on("click", (e) => {
      e.preventDefault();

      self.Market_BuyRawMaterial("brass");
    });

    self.Buttons.Market_SellCopper.on("click", (e) => {
      e.preventDefault();

      self.Market_SellRawMaterial("copper");
    });
    self.Buttons.Market_BuyCopper.on("click", (e) => {
      e.preventDefault();

      self.Market_BuyRawMaterial("copper");
    });

    self.Buttons.Market_SellIron.on("click", (e) => {
      e.preventDefault();

      self.Market_SellRawMaterial("iron");
    });
    self.Buttons.Market_BuyIron.on("click", (e) => {
      e.preventDefault();

      self.Market_BuyRawMaterial("iron");
    });

    self.Buttons.Market_SellSteel.on("click", (e) => {
      e.preventDefault();

      self.Market_SellRawMaterial("steel");
    });
    self.Buttons.Market_BuySteel.on("click", (e) => {
      e.preventDefault();

      self.Market_BuyRawMaterial("steel");
    });

    self.Buttons.Market_SellTitanium.on("click", (e) => {
      e.preventDefault();

      self.Market_SellRawMaterial("titanium");
    });
    self.Buttons.Market_BuyTitanium.on("click", (e) => {
      e.preventDefault();

      self.Market_BuyRawMaterial("titanium");
    });

    self.Buttons.Market_SellSilver.on("click", (e) => {
      e.preventDefault();

      self.Market_SellRawMaterial("silver");
    });
    self.Buttons.Market_BuySilver.on("click", (e) => {
      e.preventDefault();

      self.Market_BuyRawMaterial("silver");
    });

    self.Buttons.Market_SellGold.on("click", (e) => {
      e.preventDefault();

      self.Market_SellRawMaterial("gold");
    });
    self.Buttons.Market_BuyGold.on("click", (e) => {
      e.preventDefault();

      self.Market_BuyRawMaterial("gold");
    });

    self.Buttons.Market_SellDiamond.on("click", (e) => {
      e.preventDefault();

      self.Market_SellRawMaterial("diamond");
    });
    self.Buttons.Market_BuyDiamond.on("click", (e) => {
      e.preventDefault();

      self.Market_BuyRawMaterial("diamond");
    });

    self.Buttons.Market_SellAdamantium.on("click", (e) => {
      e.preventDefault();

      self.Market_SellRawMaterial("adamantium");
    });
    self.Buttons.Market_BuyAdamantium.on("click", (e) => {
      e.preventDefault();

      self.Market_BuyRawMaterial("adamantium");
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
  self.market_ShowContainer = () => {
    self.toggleContainerVisibility(self.Containers.Market);
    self.market_clearData();
  };
  self.market_HideContainer = () => {
    self.toggleContainerVisibility(self.Containers.Market);
  };

  self.Market_ListResources = () => {
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
        self.market_clearData();

        let resources = resp.content;

        self.Fields.Market_Coins.html(resources.mab_Coins);

        self.Fields.Market_Brass.html(resources.mab_Brass);
        self.Fields.Market_Copper.html(resources.mab_Copper);
        self.Fields.Market_Iron.html(resources.mab_Iron);

        self.Fields.Market_Steel.html(resources.mab_Steel);
        self.Fields.Market_Titanium.html(resources.mab_Titanium);
        self.Fields.Market_Silver.html(resources.mab_Silver);

        self.Fields.Market_Gold.html(resources.mab_Gold);
        self.Fields.Market_Diamond.html(resources.mab_Diamond);
        self.Fields.Market_Adamantium.html(resources.mab_Adamantium);

        self.Market_ListRawMaterialPrices();
      },
      error: function (xhr, status, error) {
        sweetAlertError("Request failed:", error);
      },
    });
  };
  self.Market_ListRawMaterialPrices = () => {
    $.ajax({
      method: "GET",
      url: "https://localhost:7081/users/mablistrawmaterialsprices",
      xhrFields: {
        withCredentials: true,
      },
      success: function (resp) {
        if (!resp.content) {
          sweetAlertError(resp.message);

          return;
        }

        let prices = resp.content;

        self.Fields.Market_BrassPrice.html(prices.mab_BrassPrice);
        self.Fields.Market_CopperPrice.html(prices.mab_CopperPrice);
        self.Fields.Market_IronPrice.html(prices.mab_IronPrice);

        self.Fields.Market_SteelPrice.html(prices.mab_SteelPrice);
        self.Fields.Market_TitaniumPrice.html(prices.mab_TitaniumPrice);
        self.Fields.Market_SilverPrice.html(prices.mab_SilverPrice);

        self.Fields.Market_GoldPrice.html(prices.mab_GoldPrice);
        self.Fields.Market_DiamondPrice.html(prices.mab_DiamondPrice);
        self.Fields.Market_AdamantiumPrice.html(prices.mab_AdamantiumPrice);

        let resources = resp.content;

        self.Fields.Market_Coins.html(resources.mab_Coins);

        self.Fields.Market_Brass.html(resources.mab_Brass);
        self.Fields.Market_Copper.html(resources.mab_Copper);
        self.Fields.Market_Iron.html(resources.mab_Iron);

        self.Fields.Market_Steel.html(resources.mab_Steel);
        self.Fields.Market_Titanium.html(resources.mab_Titanium);
        self.Fields.Market_Silver.html(resources.mab_Silver);

        self.Fields.Market_Gold.html(resources.mab_Gold);
        self.Fields.Market_Diamond.html(resources.mab_Diamond);
        self.Fields.Market_Adamantium.html(resources.mab_Adamantium);
      },
      error: function (xhr, status, error) {
        sweetAlertError("Request failed:", error);
      },
    });
  };
  self.Market_SellRawMaterial = (rawMaterial) => {
    let rawMaterialEnum = null;

    switch (rawMaterial) {
      case "brass":
        rawMaterialEnum = 1;
        break;
      case "copper":
        rawMaterialEnum = 2;
        break;
      case "iron":
        rawMaterialEnum = 3;
        break;
      case "steel":
        rawMaterialEnum = 4;
        break;
      case "titanium":
        rawMaterialEnum = 5;
        break;
      case "silver":
        rawMaterialEnum = 6;
        break;
      case "gold":
        rawMaterialEnum = 7;
        break;
      case "diamond":
        rawMaterialEnum = 8;
        break;
      case "adamantium":
        rawMaterialEnum = 9;
        break;
    }

    const formData = new FormData();
    formData.append("Mab_RawMaterialType", rawMaterialEnum);

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/mabsellrawmaterial",
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

        self.market_clearData();

        self.Market_ListResources();
      },
      error: (err) => {
        sweetAlertError(err);
      },
    });
  };
  self.Market_BuyRawMaterial = (rawMaterial) => {
    let rawMaterialEnum = null;

    switch (rawMaterial) {
      case "brass":
        rawMaterialEnum = 1;
        break;
      case "copper":
        rawMaterialEnum = 2;
        break;
      case "iron":
        rawMaterialEnum = 3;
        break;
      case "steel":
        rawMaterialEnum = 4;
        break;
      case "titanium":
        rawMaterialEnum = 5;
        break;
      case "silver":
        rawMaterialEnum = 6;
        break;
      case "gold":
        rawMaterialEnum = 7;
        break;
      case "diamond":
        rawMaterialEnum = 8;
        break;
      case "adamantium":
        rawMaterialEnum = 9;
        break;
    }

    const formData = new FormData();
    formData.append("Mab_RawMaterialType", rawMaterialEnum);

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/mabbuyrawmaterial",
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

        self.market_clearData();

        self.Market_ListResources();
      },
      error: (err) => {
        sweetAlertError(err);
      },
    });
  };

  self.market_clearData = () => {
    self.Fields.Market_Coins.empty();

    self.Fields.Market_Brass.empty();
    self.Fields.Market_Copper.empty();
    self.Fields.Market_Iron.empty();

    self.Fields.Market_Steel.empty();
    self.Fields.Market_Titanium.empty();
    self.Fields.Market_Silver.empty();

    self.Fields.Market_Gold.empty();
    self.Fields.Market_Diamond.empty();
    self.Fields.Market_Adamantium.empty();

    self.Fields.Market_BrassPrice.empty();
    self.Fields.Market_CopperPrice.empty();
    self.Fields.Market_IronPrice.empty();

    self.Fields.Market_SteelPrice.empty();
    self.Fields.Market_TitaniumPrice.empty();
    self.Fields.Market_SilverPrice.empty();

    self.Fields.Market_GoldPrice.empty();
    self.Fields.Market_DiamondPrice.empty();
    self.Fields.Market_AdamantiumPrice.empty();
  };

  self.build = () => {
    self.loadReferences();

    self.loadEvents();
  };

  self.build();
}

$(function () {
  new mab_market();
});
