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
      self.Containers.Market.find("#button-mab-market-sell-brass");

    self.Buttons[self.Buttons.length] = self.Buttons.Market_SellCopper =
      self.Containers.Market.find("#button-mab-market-sell-copper");
    self.Buttons[self.Buttons.length] = self.Buttons.Market_BuyCopper =
      self.Containers.Market.find("#button-mab-market-sell-copper");

    self.Buttons[self.Buttons.length] = self.Buttons.Market_SellIron =
      self.Containers.Market.find("#button-mab-market-sell-iron");
    self.Buttons[self.Buttons.length] = self.Buttons.Market_BuyIron =
      self.Containers.Market.find("#button-mab-market-sell-iron");

    self.Buttons[self.Buttons.length] = self.Buttons.Market_SellSteel =
      self.Containers.Market.find("#button-mab-market-sell-steel");
    self.Buttons[self.Buttons.length] = self.Buttons.Market_BuySteel =
      self.Containers.Market.find("#button-mab-market-sell-steel");

    self.Buttons[self.Buttons.length] = self.Buttons.Market_SellTitanium =
      self.Containers.Market.find("#button-mab-market-sell-titanium");
    self.Buttons[self.Buttons.length] = self.Buttons.Market_BuyTitanium =
      self.Containers.Market.find("#button-mab-market-sell-titanium");

    self.Buttons[self.Buttons.length] = self.Buttons.Market_SellSilver =
      self.Containers.Market.find("#button-mab-market-sell-silver");
    self.Buttons[self.Buttons.length] = self.Buttons.Market_BuySilver =
      self.Containers.Market.find("#button-mab-market-sell-silver");

    self.Buttons[self.Buttons.length] = self.Buttons.Market_SellGold =
      self.Containers.Market.find("#button-mab-market-sell-gold");
    self.Buttons[self.Buttons.length] = self.Buttons.Market_BuyGold =
      self.Containers.Market.find("#button-mab-market-sell-gold");

    self.Buttons[self.Buttons.length] = self.Buttons.Market_SellDiamond =
      self.Containers.Market.find("#button-mab-market-sell-diamond");
    self.Buttons[self.Buttons.length] = self.Buttons.Market_BuyDiamond =
      self.Containers.Market.find("#button-mab-market-sell-diamond");

    self.Buttons[self.Buttons.length] = self.Buttons.Market_SellAdamantium =
      self.Containers.Market.find("#button-mab-market-sell-adamantium");
    self.Buttons[self.Buttons.length] = self.Buttons.Market_BuyAdamantium =
      self.Containers.Market.find("#button-mab-market-sell-adamantium");

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
    self.Fields[self.Fields.length] = self.Fields.Market_Xp =
      self.Containers.Market.find("#span-mab-market-owned-xp");

    self.Fields[self.Fields.length] = self.Fields.Market_Brass =
      self.Containers.Market.find("#span-mab-market-owned-brass");
    self.Fields[self.Fields.length] = self.Fields.Market_BrassSellingPrice =
      self.Containers.Market.find("#strong-mab-market-brass-selling-price");
    self.Fields[self.Fields.length] = self.Fields.Market_BrassBuyingPrice =
      self.Containers.Market.find("#strong-mab-market-brass-buying-price");

    self.Fields[self.Fields.length] = self.Fields.Market_Copper =
      self.Containers.Market.find("#span-mab-market-owned-copper");
    self.Fields[self.Fields.length] = self.Fields.Market_CopperSellingPrice =
      self.Containers.Market.find("#strong-mab-market-copper-selling-price");
    self.Fields[self.Fields.length] = self.Fields.Market_CopperBuyingPrice =
      self.Containers.Market.find("#strong-mab-market-copper-buying-price");

    self.Fields[self.Fields.length] = self.Fields.Market_Iron =
      self.Containers.Market.find("#span-mab-market-owned-iron");
    self.Fields[self.Fields.length] = self.Fields.Market_IronSellingPrice =
      self.Containers.Market.find("#strong-mab-market-iron-selling-price");
    self.Fields[self.Fields.length] = self.Fields.Market_IronBuyingPrice =
      self.Containers.Market.find("#strong-mab-market-iron-buying-price");

    self.Fields[self.Fields.length] = self.Fields.Market_Steel =
      self.Containers.Market.find("#span-mab-market-owned-steel");
    self.Fields[self.Fields.length] = self.Fields.Market_SteelSellingPrice =
      self.Containers.Market.find("#strong-mab-market-steel-selling-price");
    self.Fields[self.Fields.length] = self.Fields.Market_SteelBuyingPrice =
      self.Containers.Market.find("#strong-mab-market-steel-buying-price");

    self.Fields[self.Fields.length] = self.Fields.Market_Titanium =
      self.Containers.Market.find("#span-mab-market-owned-titanium");
    self.Fields[self.Fields.length] = self.Fields.Market_TitaniumSellingPrice =
      self.Containers.Market.find("#strong-mab-market-titanium-selling-price");
    self.Fields[self.Fields.length] = self.Fields.Market_TitaniumBuyingPrice =
      self.Containers.Market.find("#strong-mab-market-titanium-buying-price");

    self.Fields[self.Fields.length] = self.Fields.Market_Silver =
      self.Containers.Market.find("#span-mab-market-owned-silver");
    self.Fields[self.Fields.length] = self.Fields.Market_SilverSellingPrice =
      self.Containers.Market.find("#strong-mab-market-silver-selling-price");
    self.Fields[self.Fields.length] = self.Fields.Market_SilverBuyingPrice =
      self.Containers.Market.find("#strong-mab-market-silver-buying-price");

    self.Fields[self.Fields.length] = self.Fields.Market_Gold =
      self.Containers.Market.find("#span-mab-market-owned-gold");
    self.Fields[self.Fields.length] = self.Fields.Market_GoldSellingPrice =
      self.Containers.Market.find("#strong-mab-market-gold-selling-price");
    self.Fields[self.Fields.length] = self.Fields.Market_GoldBuyingPrice =
      self.Containers.Market.find("#strong-mab-market-gold-buying-price");

    self.Fields[self.Fields.length] = self.Fields.Market_Diamond =
      self.Containers.Market.find("#span-mab-market-owned-diamond");
    self.Fields[self.Fields.length] = self.Fields.Market_DiamondSellingPrice =
      self.Containers.Market.find("#strong-mab-market-diamond-selling-price");
    self.Fields[self.Fields.length] = self.Fields.Market_DiamondBuyingPrice =
      self.Containers.Market.find("#strong-mab-market-diamond-buying-price");

    self.Fields[self.Fields.length] = self.Fields.Market_Adamantium =
      self.Containers.Market.find("#span-mab-market-owned-adamantium");
    self.Fields[self.Fields.length] =
      self.Fields.Market_AdamantiumSellingPrice = self.Containers.Market.find(
        "#strong-mab-market-adamantium-selling-price"
      );
    self.Fields[self.Fields.length] = self.Fields.Market_AdamantiumBuyingPrice =
      self.Containers.Market.find("#strong-mab-market-adamantium-buying-price");

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

      self.market_HideContainer();

      self.IsBuilt = false;

      self.mainMenu_ShowContainer();
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
        self.market_clearData();

        let prices = resp.content;

        self.Fields.Market_BrassSellingPrice.html(prices.mab_SellingPriceBrass);
        self.Fields.Market_BrassBuyingPrice.html(prices.mab_BuyingPriceBrass);

        self.Fields.Market_CopperSellingPrice.html(
          prices.mab_SellingPriceCopper
        );
        self.Fields.Market_CopperBuyingPrice.html(prices.mab_BuyingPriceCopper);

        self.Fields.Market_IronSellingPrice.html(prices.mab_SellingPriceIron);
        self.Fields.Market_IronBuyingPrice.html(prices.mab_BuyingPriceIron);

        self.Fields.Market_SteelSellingPrice.html(prices.mab_SellingPriceSteel);
        self.Fields.Market_SteelBuyingPrice.html(prices.mab_BuyingPriceSteel);

        self.Fields.Market_TitaniumSellingPrice.html(
          prices.mab_SellingPriceTitanium
        );
        self.Fields.Market_TitaniumBuyingPrice.html(
          prices.mab_BuyingPriceTitanium
        );

        self.Fields.Market_SilverSellingPrice.html(
          prices.mab_SellingPriceSilver
        );
        self.Fields.Market_SilverBuyingPrice.html(prices.mab_BuyingPriceSilver);

        self.Fields.Market_GoldSellingPrice.html(prices.mab_SellingPriceGold);
        self.Fields.Market_GoldBuyingPrice.html(prices.mab_BuyingPriceGold);

        self.Fields.Market_DiamondSellingPrice.html(
          prices.mab_SellingPriceDiamond
        );
        self.Fields.Market_DiamondBuyingPrice.html(
          prices.mab_BuyingPriceDiamond
        );

        self.Fields.Market_AdamantiumSellingPrice.html(
          prices.mab_SellingPriceAdamantium
        );
        self.Fields.Market_AdamantiumBuyingPrice.html(
          prices.mab_BuyingPriceAdamantium
        );

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
      url: "https://localhost:7081/users/mabsellrawmaterial",
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

    self.Fields.Market_BrassSellingPrice.empty();
    self.Fields.Market_BrassBuyingPrice.empty();

    self.Fields.Market_CopperSellingPrice.empty();
    self.Fields.Market_CopperBuyingPrice.empty();

    self.Fields.Market_IronSellingPrice.empty();
    self.Fields.Market_IronBuyingPrice.empty();

    self.Fields.Market_SteelSellingPrice.v();
    self.Fields.Market_SteelBuyingPrice.empty();

    self.Fields.Market_TitaniumSellingPrice.empty();
    self.Fields.Market_TitaniumBuyingPrice.empty();

    self.Fields.Market_SilverSellingPrice.empty();
    self.Fields.Market_SilverBuyingPrice.empty();

    self.Fields.Market_GoldSellingPrice.empty();
    self.Fields.Market_GoldBuyingPrice.empty();

    self.Fields.Market_DiamondSellingPrice.empty();
    self.Fields.Market_DiamondBuyingPrice.empty();

    self.Fields.Market_AdamantiumSellingPrice.empty();
    self.Fields.Market_AdamantiumBuyingPrice.empty();
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
