const FormHandler_Play = (function () {
  let self = this;

  self.LoadReferences = () => {
    self.DOM = $(".flip-card-inner");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.PlayMedievalAutoBattler =
      self.DOM.find("#button-access-medieval-auto-battler");

    self.Locations = [];
    self.Locations[self.Locations.length] =
      self.Locations.MedievalAutoBattlerPage = `/html/pages_users/medieval_auto_battler.html`;
  };

  self.LoadEvents = () => {
    self.Buttons.PlayMedievalAutoBattler.on("click", (e) => {
      e.preventDefault();

      self.RedirectToMedievalAutoBattlerPage();
    });
  };

  self.RedirectToMedievalAutoBattlerPage = () => {
    window.location.href = self.Locations.MedievalAutoBattlerPage;
  };

  self.Build = () => {
    self.LoadReferences();
    self.LoadEvents();
  };

  // Public API
  return {
    init: function () {
      // Listen for content changes from the Flipper module
      $(document).on("flipper:contentChanged", (event, templateId) => {
        // Initialize specific functionality based on which template was loaded
        if (templateId === "play-template") {
          $("#userOption-playGame")
            .addClass("selectedUserMenuOption")
            .prop("disabled", true);

          self.Build();
        } else {
          $("#userOption-playGame")
            .removeClass("selectedUserMenuOption")
            .prop("disabled", false);
        }

        // Set up all form handlers
        this.setupAllForms();
      });

      // Also set up handlers on document ready to handle the initial load
      if ($("#play-template").length) {
        self.Build();
      }
    },

    // Set up all form handlers
    setupAllForms: function () {
      self.Build();
    },
  };
})();

// Initialize the form handler when the document is ready
$(function () {
  FormHandler_Play.init();
});
