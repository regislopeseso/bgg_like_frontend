function life_counter_template_edit() {
  let self = this;

  self.IsBuilt = false;

  self.IsUserLoggedIn = false;
  self.CheckAuthenticationStatus = () => {
    $.ajax({
      type: "GET",
      url: "https://localhost:7081/users/validatestatus",
      xhrFields: { withCredentials: true },
      success: function (response) {
        if (response.content == null) {
          sweetAlertError("Error", response.message);
          return;
        }

        self.IsUserLoggedIn = response.content.isUserLoggedIn;

        self.Build();
      },
      error: function (xhr, status, error) {
        sweetAlertError("Failed to fetch user details. Try again later.");
      },
    });
  };

  self.LifeCounterTemplates = [];
  self.GetLifeCounterTemplates = () => {
    return JSON.parse(localStorage.getItem("LifeCounterTemplates"));
  };
  self.SetLifeCounterTemplates = () => {
    localStorage.setItem(
      "LifeCounterTemplates",
      JSON.stringify(self.LifeCounterTemplates)
    );
  };

  self.Current_LifeCounter_Template = {};
  self.LifeCounterTemplateId = null;
  self.GetLifeCounterTemplateId = () => {
    self.LifeCounterTemplateId = new URLSearchParams(
      window.location.search
    ).get("LifeCounterTemplateId");

    if (!self.LifeCounterTemplateId) {
      sweetAlertError("Failed to fetch template id from URL");

      return;
    }

    self.GetLifeCounterTemplateDetails();
  };

  self.LifeCounterManagerId = null;
  self.GetLifeCounterManagerId = () => {
    self.LifeCounterManagerId = new URLSearchParams(window.location.search).get(
      "LifeCounterManagerId"
    );
  };

  self.NewPlayersCount = null;

  self.LoadReferences = () => {
    self.DOM = $("#main-lifeCounterTemplate-edit");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] =
      self.Buttons.LifeCounterTemplate_EditForm_Close = self.DOM.find(
        "#button-close-lifeCounterTemplate-edit"
      );
    self.Buttons[self.Buttons.length] = self.Buttons.Delete = self.DOM.find(
      "#button-delete-lifeCounterTemplate-edit"
    );
    self.Buttons[self.Buttons.length] = self.Buttons.Clear = self.DOM.find(
      "#button-clearEditForm-lifeCounterTemplate-edit"
    );
    self.Buttons[self.Buttons.length] = self.Buttons.ConfirmEdit =
      self.DOM.find("#button-confirmEdit-lifeCounterTemplate-edit");

    self.Inputs = [];
    self.Inputs[self.Inputs.length] = self.Inputs.LifeCounterTemplateName =
      self.DOM.find("#input-name-lifeCounterTemplate-edit");
    self.Inputs[self.Inputs.length] = self.Inputs.PlayersStartingLifePoints =
      self.DOM.find(
        "#input-playersStartingLifePoints-lifeCounterTemplate-edit"
      );
    self.Inputs[self.Inputs.length] = self.Inputs.PlayersCount = self.DOM.find(
      ".template-players-count-options"
    );
    self.Inputs[self.Inputs.length] = self.Inputs.FixedMaxLifePointsMode =
      self.DOM.find("#input-fixedMaxLifePointsMode-lifeCounterTemplate-edit");
    self.Inputs[self.Inputs.length] = self.Inputs.MaxLifePointsInputWrapper =
      self.DOM.find("#wrapper-PlayersMaxLifePoints-lifeCounterTemplate-edit");
    self.Inputs[self.Inputs.length] = self.Inputs.PlayersMaxLifePoints =
      self.DOM.find("#input-playersMaxLifePoints-lifeCounterTemplate-edit");
    self.Inputs[self.Inputs.length] = self.Inputs.AutoDefeatMode =
      self.DOM.find("#input-autoDefeatMode-lifeCounterTemplate-edit");
    self.Inputs[self.Inputs.length] = self.Inputs.AutoEndMode = self.DOM.find(
      "#input-autoEndMode-lifeCounterTemplate-edit"
    );

    self.Locations = [];
    self.Locations[self.Locations.length] = self.Locations.LifeCounterManager =
      "/html/lifecounter/lifecounter_manager.html";
  };

  self.RedirectToLifeCounterManager = () => {
    if (!self.LifeCounterManagerId) {
      window.location.href = `${self.Locations.LifeCounterManager}`;

      return;
    }

    window.location.href = `${
      self.Locations.LifeCounterManager
    }?LifeCounterManagerId=${encodeURIComponent(self.LifeCounterManagerId)}`;
  };

  function sweetAlertSuccess(title_text, message_text) {
    Swal.fire({
      position: "center",
      cancelButtonText: "close",
      icon: "success",
      theme: "bulma",
      title: title_text,
      text: message_text || "",
      showConfirmButton: true,
      didOpen: () => {
        // Attach keydown listener
        document.addEventListener("keydown", closeOnAnyKey);
      },
      willClose: () => {
        // Clean up listener when modal closes
        document.removeEventListener("keydown", closeOnAnyKey);
      },
    });
  }
  function sweetAlertError(title_text, message_text) {
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
        document.addEventListener("keydown", closeOnAnyKey);
      },
      willClose: () => {
        // Clean up listener when modal closes
        document.removeEventListener("keydown", closeOnAnyKey);
      },
    });
  }
  function closeOnAnyKey() {
    Swal.close();
  }

  self.GetLifeCounterTemplateDetails = () => {
    if (self.IsUserLoggedIn === true) {
      $.ajax({
        method: "GET",
        url: `https://localhost:7081/users/getlifecountertemplatedetails?LifeCounterTemplateId=${self.LifeCounterTemplateId}`,
        xhrFields: {
          withCredentials: true,
        },
        success: function (response) {
          if (!response.content) {
            sweetAlertError(response.message);

            return;
          }

          const template = response.content;

          self.Current_LifeCounter_Template = {
            LifeCounterTemplateId: self.LifeCounterTemplateId,
            LifeCounterTemplateName: template.lifeCounterTemplateName,
            PlayersStartingLifePoints: template.playersStartingLifePoints,
            PlayersCount: template.playersCount,
            FixedMaxLifePointsMode: template.fixedMaxLifePointsMode,
            PlayersMaxLifePoints: template.playersMaxLifePoints,
            AutoDefeatMode: template.autoDefeatMode,
            AutoEndMode: template.autoEndMode,
            LifeCounterManagersCount: template.lifeCounterManagersCount,
          };

          self.PreFillEditForm();
        },
        error: function (xhr, status, error) {
          console.error("Error fetching board game details:", error);
        },
      });

      return;
    }

    self.LifeCounterTemplates = self.GetLifeCounterTemplates();

    self.Current_LifeCounter_Template = self.LifeCounterTemplates.find(
      (template) =>
        template.LifeCounterTemplateId === self.LifeCounterTemplateId
    );

    self.PreFillEditForm();
  };

  self.PreFillEditForm = () => {
    const template = self.Current_LifeCounter_Template;

    self.Inputs.LifeCounterTemplateName.val(template.LifeCounterTemplateName)
      .trigger("focus")
      .trigger("select");

    self.Inputs.PlayersStartingLifePoints.val(
      template.PlayersStartingLifePoints
    );

    self.Inputs.PlayersCount.each(function () {
      self.Inputs.PlayersCount.eq(template.PlayersCount - 1).addClass(
        "clickedState"
      );
    });

    self.Inputs.FixedMaxLifePointsMode.attr(
      "checked",
      template.FixedMaxLifePointsMode == true
    );

    if (template.FixedMaxLifePointsMode == true) {
      self.Inputs.MaxLifePointsInputWrapper.removeClass("d-none");
      self.Inputs.PlayersMaxLifePoints.prop("disabled", false);

      self.Inputs.PlayersMaxLifePoints.val(template.PlayersMaxLifePoints);
    }

    self.Inputs.AutoDefeatMode.attr("checked", template.AutoDefeatMode == true);

    self.Inputs.AutoEndMode.attr("checked", template.AutoEndMode == true);
  };

  self.DeleteLifeCounterTemplate = () => {
    if (self.IsUserLoggedIn === true) {
      const formData = new FormData();
      formData.append("LifeCounterTemplateId", self.LifeCounterTemplateId);
      $.ajax({
        type: "DELETE",
        url: `https://localhost:7081/users/deletelifecountertemplate?LifeCounterTemplateId=${self.LifeCounterTemplateId}`,
        xhrFields: { withCredentials: true },
        success: function (resp) {
          if (!resp.content) {
            sweetAlertSuccess(resp.message);
            return;
          }

          self.RedirectToLifeCounterManager();
        },
        error: function (err) {
          sweetAlertError(err);
        },
      });

      return;
    }

    const current_template = self.Current_LifeCounter_Template;

    self.LifeCounterTemplates = self.LifeCounterTemplates.filter(
      (template) => template !== current_template
    );

    self.SetLifeCounterTemplates();

    self.RedirectToLifeCounterManager();
  };

  self.ClearForm = () => {
    $.each(self.Inputs, function (i, input) {
      input.val("");
    });

    self.Inputs.LifeCounterTemplateName.trigger("focus");

    self.Inputs.PlayersStartingLifePoints.val(1);

    self.Inputs.PlayersCount.removeClass("clickedState");
    self.Inputs.PlayersCount.eq(0).addClass("clickedState");

    self.Inputs.FixedMaxLifePointsMode.prop("checked", false);
    self.Inputs.MaxLifePointsInputWrapper.fadeOut().addClass("d-none");

    self.Inputs.AutoDefeatMode.prop("checked", false);

    self.Inputs.AutoEndMode.prop("checked", false).prop("disabled", true);
  };

  self.EditLifeCounterTemplate = () => {
    let newName = self.Inputs.LifeCounterTemplateName.val();

    self.Current_LifeCounter_Template.LifeCounterTemplateName =
      self.Inputs.LifeCounterTemplateName.val();

    self.Current_LifeCounter_Template.PlayersStartingLifePoints =
      self.Inputs.PlayersStartingLifePoints.val();

    if (!self.NewPlayersCount) {
      self.NewPlayersCount = self.Current_LifeCounter_Template.PlayersCount;
    }
    self.Current_LifeCounter_Template.PlayersCount = self.NewPlayersCount;

    self.Current_LifeCounter_Template.FixedMaxLifePointsMode =
      self.Inputs.FixedMaxLifePointsMode.is(":checked");

    if (self.Inputs.FixedMaxLifePointsMode.is(":checked") === true) {
      self.Current_LifeCounter_Template.PlayersMaxLifePoints = parseInt(
        self.Inputs.PlayersMaxLifePoints.val(),
        10
      );
    } else {
      self.Current_LifeCounter_Template.PlayersMaxLifePoints = null;
    }

    self.Current_LifeCounter_Template.AutoDefeatMode =
      self.Inputs.AutoDefeatMode.is(":checked");

    if (self.Inputs.AutoDefeatMode.is(":checked") === true) {
      self.Current_LifeCounter_Template.AutoEndMode =
        self.Inputs.AutoEndMode.is(":checked");
    } else {
      self.Current_LifeCounter_Template.AutoEndMode = false;
    }

    const lifeCounterTemplateId =
      self.Current_LifeCounter_Template.LifeCounterTemplateId;
    const lifeCounterTemplateName =
      self.Current_LifeCounter_Template.LifeCounterTemplateName;

    const playersStartingLifePoints =
      self.Current_LifeCounter_Template.PlayersStartingLifePoints;

    const playersCount = self.Current_LifeCounter_Template.PlayersCount;
    const fixedMaxLifeMode =
      self.Current_LifeCounter_Template.FixedMaxLifePointsMode;
    const playersMaxLifePoints =
      self.Current_LifeCounter_Template.PlayersMaxLifePoints;
    const autoDefeatMode = self.Current_LifeCounter_Template.AutoDefeatMode;
    const autoEndMode = self.Current_LifeCounter_Template.AutoEndMode;

    self.GetLifeCounterManagerId();

    if (self.IsUserLoggedIn === true) {
      $.ajax({
        type: "PUT",
        url: "https://localhost:7081/users/editlifecountertemplate",
        data: JSON.stringify({
          LifeCounterTemplateId: lifeCounterTemplateId,
          NewLifeCounterTemplateName: lifeCounterTemplateName,
          NewPlayersStartingLifePoints: playersStartingLifePoints,
          NewPlayersCount: playersCount,
          FixedMaxLifePointsMode: fixedMaxLifeMode,
          NewPlayersMaxLifePoints: playersMaxLifePoints,
          AutoDefeatMode: autoDefeatMode,
          AutoEndMode: autoEndMode,
        }),
        contentType: "application/json",
        xhrFields: {
          withCredentials: true,
        },
        success: (resp) => {
          if (!resp.content) {
            sweetAlertError(resp.message);
            return;
          }

          self.RedirectToLifeCounterManager();
        },
        error: (err) => {
          sweetAlertError(err);
        },
        complete: () => {
          self.ClearForm();
        },
      });
    }

    let isNameValid = self.EvaluateNewName(newName);

    if (isNameValid === false) {
      sweetAlertError(
        "Requested name is already in use, please choose another one."
      );

      return;
    }

    self.SetLifeCounterTemplates();

    self.RedirectToLifeCounterManager();
  };
  self.EvaluateNewName = (newName) => {
    const newNameAlreadyExists = self.LifeCounterTemplates.some(
      (template) =>
        template.LifeCounterTemplateId !=
          self.Current_LifeCounter_Template.LifeCounterTemplateId &&
        template.LifeCounterTemplateName.trim().toLowerCase() ===
          newName.trim().toLowerCase()
    );

    if (newNameAlreadyExists) {
      return false;
    }

    return true;
  };

  self.LoadEvents = () => {
    self.Buttons.LifeCounterTemplate_EditForm_Close.on("click", function (e) {
      e.preventDefault();

      self.RedirectToLifeCounterManager();
    });

    self.Inputs.PlayersCount.on("click", function (e) {
      e.preventDefault();

      // Remove the class from all
      self.Inputs.PlayersCount.removeClass("clickedState");

      // Add class to selected
      $(this).addClass("clickedState");

      // Update the player count
      self.NewPlayersCount = parseInt($(this).text(), 10);
    });

    self.Inputs.FixedMaxLifePointsMode.on("change", function (e) {
      if ($(this).is(":checked")) {
        // Checkbox is checked
        self.Inputs.MaxLifePointsInputWrapper.removeClass("d-none");
      } else {
        // Checkbox is unchecked
        self.Inputs.MaxLifePointsInputWrapper.addClass("d-none");
      }
    });

    self.Inputs.AutoDefeatMode.on("change", (e) => {
      if (!self.Inputs.AutoDefeatMode.is(":checked")) {
        self.Inputs.AutoEndMode.prop("checked", false) // <-- Correct way to uncheck
          .attr("disabled", true); // <-- Properly disables the checkbox
      } else {
        self.Inputs.AutoEndMode.prop("disabled", false); // Re-enable if needed
      }
    });

    self.Buttons.Clear.on("click", () => {
      self.ClearForm();
    });

    self.Buttons.ConfirmEdit.on("click", (e) => {
      e.preventDefault();

      self.EditLifeCounterTemplate();
    });

    self.Buttons.Delete.on("click", (e) => {
      e.preventDefault();

      self.DeleteLifeCounterTemplate();
    });
  };

  self.Build = () => {
    if (self.IsBuilt == false) {
      self.LoadReferences();
      self.GetLifeCounterTemplateId();
      self.LoadEvents();
      self.IsBuilt = true;
    }
  };

  self.CheckAuthenticationStatus();
}

$(function () {
  new life_counter_template_edit();
});
