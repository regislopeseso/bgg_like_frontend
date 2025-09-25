function mab_forgery() {
  let self = this;

  self.IsBuilt = false;

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
  };

  self.loadEvents = () => {
    self.Buttons.Forgery_ShowContainer.on("click", (e) => {
      e.preventDefault();

      self.mainMenu_HideContainer();

      self.forgery_ShowContainer();
    });

    self.Buttons.Forgery_HideContainer.on("click", (e) => {
      e.preventDefault();

      self.forgery_HideContainer();

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
  self.mainMenu_ShowContainer = () => {
    self.toggleContainerVisibility(self.Containers.MainMenu);
  };
  self.mainMenu_HideContainer = () => {
    self.toggleContainerVisibility(self.Containers.MainMenu);
  };
  self.forgery_ShowContainer = () => {
    self.toggleContainerVisibility(self.Containers.Forgery);
  };
  self.forgery_HideContainer = () => {
    self.toggleContainerVisibility(self.Containers.Forgery);
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
  new mab_forgery();
});
