function mab_market() {
  let self = this;

  self.IsBuilt = false;

  self.loadReferences = () => {
    self.DOM = $("#dom-medieval-auto-battler");

    self.MabContent = self.DOM.find("#mab-containers-content");

    self.Containers = [];
    self.Containers[self.Containers.length] = self.Containers.MainMenu =
      self.DOM.find("#container-mab-main-menu");
    self.Containers[self.Containers.length] = self.Containers.Market =
      self.DOM.find("#container-mab-market");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.ShowMarketContainer =
      self.DOM.find("#button-mab-market-show-container");
    self.Buttons[self.Buttons.length] = self.Buttons.HideMarketContainer =
      self.DOM.find("#button-mab-market-hide-container");

    self.Fields = [];
    self.Fields[self.Fields.length] = self.Fields.Market_CurrentGoldValue =
      self.DOM.find("#span-field-mab-market-current-gold-value");
    self.Fields[self.Fields.length] = self.Fields.Market_GoldStash =
      self.DOM.find("#span-field-mab-market-gold-stash");
    self.Fields[self.Fields.length] =
      self.Fields.Market_ExpandableCardCopiesCount = self.DOM.find(
        "#span-field-mab-market-expendable-card-copies-count"
      );
    self.Fields[self.Fields.length] =
      self.Fields.Market_ExpandableCardCopiesValue = self.DOM.find(
        "#span-field-mab-market-expendable-card-copies-value"
      );
  };

  self.loadEvents = () => {
    self.Buttons.ShowMarketContainer.on("click", (e) => {
      e.preventDefault();

      self.mainMenu_HideContainer();

      self.market_ShowContainer();
    });
    self.Buttons.HideMarketContainer.on("click", (e) => {
      e.preventDefault();

      self.market_HideContainer();

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
      timer: 1500,
    });
  };
  self.sweetAlertWaning = (title_text, message_text) => {
    return Swal.fire({
      position: "center",
      confirmButtonText: "Confirm delete deck!",
      icon: "warning",
      toast: "true",
      theme: "bulma",
      title: title_text,
      text: message_text || "",
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
  self.market_ShowContainer = () => {
    self.toggleContainerVisibility(self.Containers.Market);
  };
  self.market_HideContainer = () => {
    self.toggleContainerVisibility(self.Containers.Market);
  };
  self.mainMenu_ShowContainer = () => {
    self.toggleContainerVisibility(self.Containers.MainMenu);
  };
  self.mainMenu_HideContainer = () => {
    self.toggleContainerVisibility(self.Containers.MainMenu);
  };

  self.build = () => {
    if (!self.IsBuilt) {
      self.IsBuilt = true;
    }
    self.loadReferences();
    self.loadEvents();
  };

  self.build();
}

$(function () {
  new mab_market();
});
