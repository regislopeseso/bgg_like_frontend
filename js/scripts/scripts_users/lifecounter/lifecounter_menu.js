function life_counter_menu() {
  let self = this;

  self.LifeCounterTemplateId = null;
  self.LifeCounterTemplate = {};
  self.LifeCounterManagerId = null;
  self.PlayersCount = null;

  self.GetLifeCounterManagerId = () => {
    self.LifeCounterManagerId = new URLSearchParams(window.location.search).get(
      "LifeCounterManagerId"
    );
  };

  self.LoadReferences = () => {
    self.DOM = $("#main-lifeCounter-menu");

    self.Options = [];
    self.Options[self.Options.length] = self.Options.CloseMenu = self.DOM.find(
      "#button-close-lifeCounter-menu"
    );
    self.Options[self.Options.length] = self.Options.CreateLifeCounterTemplate =
      self.DOM.find("#button-createTemplate-lifeCounter-menu");
    self.Options[self.Options.length] = self.Options.SelectLifeCounterTemplate =
      self.DOM.find("#button-selectTemplate-lifeCounter-menu");
    self.Options[self.Options.length] = self.Options.ReloadLifeCounter =
      self.DOM.find("#button-reloadLifeCounterManager-lifeCounter-menu");
    self.Options[self.Options.length] = self.Options.ShowLifeCounterStatistics =
      self.DOM.find("#button-showStatistics-lifeCounter-menu");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] =
      self.Buttons.ClearCreateFormLifeCounterTemplate = self.DOM.find(
        "#button-clearCreateForm-lifeCounter-newTemplate"
      );
    self.Buttons[self.Buttons.length] = self.Buttons.CreateLifeCounterTemplate =
      self.DOM.find("#button-create-lifeCounter-newTemplate");
    self.Buttons[self.Buttons.length] =
      self.Buttons.CreateAndStartLifeCounterTemplate = self.DOM.find(
        "#button-createAndStart-lifeCounter-newTemplate"
      );

    self.Buttons[self.Buttons.length] =
      self.Buttons.EditSelectedLifeCounterTemplate = self.DOM.find(
        "#button-edit-selected-lifeCounter-menu"
      );
    self.Buttons[self.Buttons.length] =
      self.Buttons.StartSelectedLifeCounterTemplate = self.DOM.find(
        "#button-start-selected-lifeCounter-menu"
      );
    self.Buttons[self.Buttons.length] =
      self.Buttons.ClearEditFormLifeCounterTemplate = self.DOM.find(
        "#button-clearEditForm-lifeCounter-menu"
      );
    self.Buttons[self.Buttons.length] =
      self.Buttons.SaveModificationsLifeCounterTemplate = self.DOM.find(
        "#button-confirmModifications-lifeCounter-menu"
      );

    self.Togglers = [];
    self.Togglers[self.Togglers.length] =
      self.Togglers.ToggleCreateLifeCounterTemplate = self.DOM.find(
        "#toggle-createTemplate-lifeCounter-menu"
      );
    self.Togglers[self.Togglers.length] =
      self.Togglers.ToggleSelectLifeCounterTemplate = self.DOM.find(
        "#toggle-selectTemplate-lifeCounter-menu"
      );
    self.Togglers[self.Togglers.length] =
      self.Togglers.ToggleReloadLifeCounterManager = self.DOM.find(
        "#toggle-reloadLifeCounterManager-lifeCounter-menu"
      );
    self.Togglers[self.Togglers.length] =
      self.Togglers.ShowLifeCounterStatistics = self.DOM.find(
        "#toggle-showStatistics-lifeCounter-menu"
      );

    self.EditLifeCounterTermplateForm = self.DOM.find("#editForm-wrapper");

    self.Inputs = [];
    self.Inputs[self.Inputs.length] = self.Inputs.CreateTemplate_Name =
      self.DOM.find("#input-templateName-lifeCounter-menu");
    self.Inputs[self.Inputs.length] =
      self.Inputs.CreateTemplate_PlayersStartingLifePoints = self.DOM.find(
        "#input-playersStartingLifePoints-lifeCounter-menu"
      );
    self.Inputs[self.Inputs.length] = self.Inputs.CreateTemplate_PlayersCount =
      self.DOM.find(".players-count-options");
    self.Inputs[self.Inputs.length] =
      self.Inputs.CreateTemplate_FixedMaxLifePointsMode = self.DOM.find(
        "#input-fixedMaxLifePointsMode-lifeCounter-menu"
      );
    self.Inputs[self.Inputs.length] =
      self.Inputs.CreateTemplate_MaxLifePointsInputWrapper = self.DOM.find(
        "#div-PlayersMaxLifePoints-input-wrapper"
      );
    self.Inputs[self.Inputs.length] =
      self.Inputs.CreateTemplate_PlayersMaxLifePoints = self.DOM.find(
        "#input-playersMaxLifePoints-lifeCounter-menu"
      );
    self.Inputs[self.Inputs.length] =
      self.Inputs.CreateTemplate_AutoDefeatMode = self.DOM.find(
        "#input-autoDefeatMode-lifeCounter-menu"
      );
    self.Inputs[self.Inputs.length] = self.Inputs.CreateTemplate_AutoEndMode =
      self.DOM.find("#input-autoEndMode-lifeCounter-menu");

    self.Inputs[self.Inputs.length] = self.Inputs.EditTemplate_Name =
      self.DOM.find("#input-edit-templateName-lifeCounter-menu");
    self.Inputs[self.Inputs.length] =
      self.Inputs.EditTemplate_PlayersStartingLifePoints = self.DOM.find(
        "#input-edit-playersStartingLifePoints-lifeCounter-menu"
      );
    self.Inputs[self.Inputs.length] = self.Inputs.EditTemplate_PlayersCount =
      self.DOM.find(".edit-players-count-options");
    self.Inputs[self.Inputs.length] =
      self.Inputs.EditTemplate_FixedMaxLifePointsMode = self.DOM.find(
        "#input-edit-fixedMaxLifePointsMode-lifeCounter-menu"
      );
    self.Inputs[self.Inputs.length] =
      self.Inputs.EditTemplate_MaxLifePointsInputWrapper = self.DOM.find(
        "#div-edit-PlayersMaxLifePoints-input-wrapper"
      );
    self.Inputs[self.Inputs.length] =
      self.Inputs.EditTemplate_PlayersMaxLifePoints = self.DOM.find(
        "#input-edit-playersMaxLifePoints-lifeCounter-menu"
      );
    self.Inputs[self.Inputs.length] = self.Inputs.EditTemplate_AutoDefeatMode =
      self.DOM.find("#input-edit-autoDefeatMode-lifeCounter-menu");
    self.Inputs[self.Inputs.length] = self.Inputs.EditTemplate_AutoEndMode =
      self.DOM.find("#input-edit-autoEndMode-lifeCounter-menu");

    self.SelectLifeCounterTemplate = self.DOM.find(
      "#select-lifeCounterTemplate-lifeCounter-menu"
    );
    self.ReloadLifeCounterManager = self.DOM.find(
      "#reload-lifeCounterManager-lifeCounter-menu"
    );

    self.Statistics = self.DOM.find("#ul-lifeCounter-menu");
    self.StatisticsItems = [];
    self.StatisticsItems[self.StatisticsItems.length] =
      self.StatisticsItems.First = self.DOM.find(".list-group-item").eq(0);
    self.StatisticsItems[self.StatisticsItems.length] =
      self.StatisticsItems.Second = self.DOM.find(".list-group-item").eq(1);
    self.StatisticsItems[self.StatisticsItems.length] =
      self.StatisticsItems.Third = self.DOM.find(".list-group-item").eq(2);
    self.StatisticsItems[self.StatisticsItems.length] =
      self.StatisticsItems.Fourth = self.DOM.find(".list-group-item").eq(3);
    self.StatisticsItems[self.StatisticsItems.length] =
      self.StatisticsItems.Fifth = self.DOM.find(".list-group-item").eq(4);

    self.Locations = [];
    self.Locations[self.Locations.length] =
      self.Locations.LifeCounterManagerSetUp =
        "/html/pages_users/lifecounter/lifecounter_manager_setup.html";
    self.Locations.LifeCounterManager =
      "/html/pages_users/lifecounter/lifecounter_manager.html";
  };

  self.RedirectToLifeCounterManagerSetUp = (lifeCounterManagerId) => {
    window.location.href = `${
      self.Locations.LifeCounterManagerSetUp
    }?LifeCounterManagerId=${encodeURIComponent(lifeCounterManagerId)}`;
  };
  self.RedirectToLifeCounterManager = (lifeCounterManagerId) => {
    window.location.href = `${
      self.Locations.LifeCounterManager
    }?LifeCounterManagerId=${encodeURIComponent(lifeCounterManagerId)}`;
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
    $.ajax({
      url: `https://localhost:7081/users/getlifecountertemplatedetails?LifeCounterTemplateId=${self.LifeCounterTemplateId}`,
      method: "GET",
      xhrFields: {
        withCredentials: true,
      },
      success: function (response) {
        if (!response.content) {
          sweetAlertError(response.message);

          return;
        }

        self.LifeCounterTemplate = response.content;

        self.PreFillForm();
      },
      error: function (xhr, status, error) {
        console.error("Error fetching board game details:", error);
      },
    });
  };
  self.PreFillForm = () => {
    self.Inputs.EditTemplate_Name.val(
      self.LifeCounterTemplate.lifeCounterTemplateName
    )
      .trigger("focus")
      .trigger("select");

    self.Inputs.EditTemplate_PlayersStartingLifePoints.val(
      self.LifeCounterTemplate.playersStartingLifePoints
    );

    self.Inputs.EditTemplate_PlayersCount.eq(0).removeClass("clickedState");
    self.PlayersCount = self.LifeCounterTemplate.playersCount;
    self.Inputs.EditTemplate_PlayersCount.eq(self.PlayersCount - 1).addClass(
      "clickedState"
    );

    self.Inputs.EditTemplate_FixedMaxLifePointsMode.prop(
      "checked",
      self.LifeCounterTemplate.fixedMaxLifePointsMode
    );

    if (self.LifeCounterTemplate.fixedMaxLifePointsMode == true) {
      self.Inputs.EditTemplate_MaxLifePointsInputWrapper.removeClass("d-none");
      self.Inputs.EditTemplate_PlayersMaxLifePoints.val(
        self.LifeCounterTemplate.playersMaxLifePoints
      );
    }

    self.Inputs.EditTemplate_AutoDefeatMode.prop(
      "checked",
      self.LifeCounterTemplate.autoDefeatMode
    );

    self.Inputs.EditTemplate_AutoEndMode.prop(
      "checked",
      self.LifeCounterTemplate.autoEndMode
    );
  };
  self.RemoveExtraLines = () => {
    const hrElements =
      self.Togglers.ToggleSelectLifeCounterTemplate.find("hr.enclosing-lines");

    // Only remove the last <hr> if there are exactly 3 of them
    if (hrElements.length >= 3) {
      hrElements.last().remove();
    }
  };

  self.CheckFormFilling = (isCreateForm) => {
    if (isCreateForm === true) {
      if (
        self.Inputs.CreateTemplate_Name.val().trim() === "" ||
        self.Inputs.CreateTemplate_PlayersStartingLifePoints.val().trim() === ""
      ) {
        self.Buttons.CreateLifeCounterTemplate.attr("disabled", true);
        self.Buttons.CreateAndStartLifeCounterTemplate.attr("disabled", true);

        return;
      }

      self.Buttons.CreateLifeCounterTemplate.attr("disabled", false);
      self.Buttons.CreateAndStartLifeCounterTemplate.attr("disabled", false);

      return;
    }

    self.Buttons.SaveModificationsLifeCounterTemplate.attr("disabled", false);
  };
  self.ForceClearForm = (isCreateForm) => {
    if (isCreateForm === true) {
      // Block create and start buttons & clear create form
      self.Buttons.CreateAndStartLifeCounterTemplate.prop("disabled", true);
      self.Buttons.CreateLifeCounterTemplate.prop("disabled", true);

      self.Inputs.CreateTemplate_Name.val(null).trigger("focus");
      self.Inputs.CreateTemplate_PlayersStartingLifePoints.val("1");
      self.Inputs.CreateTemplate_PlayersCount.eq(
        self.PlayersCount - 1
      ).removeClass("clickedState");
      self.Inputs.CreateTemplate_PlayersCount.eq(0).addClass("clickedState");
      self.PlayersCount = 1;
      self.Inputs.CreateTemplate_MaxLifePointsInputWrapper.addClass("d-none");
      self.Inputs.CreateTemplate_FixedMaxLifePointsMode.prop("checked", false);
      self.Inputs.CreateTemplate_AutoDefeatMode.prop("checked", false);
      self.Inputs.CreateTemplate_AutoEndMode.prop("checked", false);

      self.LifeCounterTemplateId = null;

      return;
    }

    // Block confirm modifications button & clear edit form

    self.Inputs.EditTemplate_Name.val(null).trigger("focus");
    self.Inputs.EditTemplate_PlayersStartingLifePoints.val("1");
    self.Inputs.EditTemplate_PlayersCount.eq(self.PlayersCount - 1).removeClass(
      "clickedState"
    );
    self.Inputs.EditTemplate_PlayersCount.eq(0).addClass("clickedState");
    self.PlayersCount = 1;
    self.Inputs.EditTemplate_MaxLifePointsInputWrapper.addClass("d-none");
    self.Inputs.EditTemplate_FixedMaxLifePointsMode.prop("checked", false);
    self.Inputs.EditTemplate_AutoDefeatMode.prop("checked", false);
    self.Inputs.EditTemplate_AutoEndMode.prop("checked", false);

    self.LifeCounterTemplateId = null;
  };

  self.ResetMenuOptions = () => {
    self.RemoveExtraLines();

    self.EditLifeCounterTermplateForm.addClass("d-none");
    self.Togglers.forEach((toggler) => {
      toggler.css("display", "none");
    });

    self.Options.forEach((option) => {
      option.removeClass("chosenMenuOption");
    });
  };

  self.CreateLifeCounterTemplate = (startmode) => {
    self.DOM.loadcontent("charge-contentloader");

    //Disable submit button to prevent double submissions
    const createBtn = self.Buttons.CreateLifeCounterTemplate;
    const createAndStartBtn = self.Buttons.CreateAndStartLifeCounterTemplate;
    const originalBtnText_create = createBtn.text();
    const originalBtnText_createAndStart = createAndStartBtn.text();
    createBtn.attr("disabled", true).text("Submitting...");
    createAndStartBtn.attr("disabled", true).text("Submitting...");

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/createlifecountertemplate",
      data: {
        LifeCounterTemplateName: self.Inputs.CreateTemplate_Name.val(),
        PlayersStartingLifePoints:
          self.Inputs.CreateTemplate_PlayersStartingLifePoints.val(),
        PlayersCount: self.PlayersCount,
        FixedMaxLifePointsMode:
          self.Inputs.CreateTemplate_FixedMaxLifePointsMode.is(":checked"),
        PlayersMaxLifePoints:
          self.Inputs.CreateTemplate_PlayersMaxLifePoints.val(),
        AutoDefeatMode:
          self.Inputs.CreateTemplate_AutoDefeatMode.is(":checked"),
        AutoEndMode: self.Inputs.CreateTemplate_AutoEndMode.is(":checked"),
      },
      xhrFields: {
        withCredentials: true,
      },
      success: (resp) => {
        if (resp.content == null) {
          sweetAlertError(resp.message);
          return;
        }

        self.LifeCounterTemplateId = resp.content.lifeCounterTemplateId;

        sweetAlertSuccess(resp.message);

        if (startmode == true) {
          self.StartLifeCounterManager();
          return;
        }

        self.ForceClearForm(true);
      },
      error: (err) => {
        sweetAlertError(err);
      },
      complete: () => {
        createBtn.attr("disabled", true).text(originalBtnText_create);
        createAndStartBtn
          .attr("disabled", true)
          .text(originalBtnText_createAndStart);

        self.DOM.loadcontent("demolish-contentloader");
      },
    });
  };

  self.LoadLifeCounterTemplates = () => {
    // First destroy any existing select2 instance to prevent duplicates
    if (self.SelectLifeCounterTemplate.hasClass("select2-hidden-accessible")) {
      self.SelectLifeCounterTemplate.select2("destroy");
    }

    let lifeCounterTemplates = [];

    $.ajax({
      url: `https://localhost:7081/users/listlifecountertemplates`,
      type: "GET",
      xhrFields: { withCredentials: true },
      success: function (response) {
        // Clear current options
        self.SelectLifeCounterTemplate.empty();

        // Check if any board games are returned
        if (response.content != null) {
          lifeCounterTemplates = response.content;

          // Add options dynamically
          let counter = 1;
          lifeCounterTemplates.forEach((template) => {
            counter++;

            // Create option with formatted date (if available) or fall back to session ID
            const optionText = template.lifeCounterTemplateName;
            const optionValue = template.lifeCounterTemplateId;

            self.SelectLifeCounterTemplate.append(
              new Option(optionText, optionValue)
            );
          });

          // Add an empty default option with the placeholder text
          self.SelectLifeCounterTemplate.append(new Option("", "", true, true));

          // Refresh select2 without triggering change event to avoid auto-selection
          if (
            self.SelectLifeCounterTemplate.hasClass("select2-hidden-accessible")
          ) {
            self.SelectLifeCounterTemplate.select2("destroy");
          }
          self.SelectLifeCounterTemplate.select2({
            theme: "classic",
            width: "100%",
            placeholder: "Pick a Life Counter Template",
            templateSelection: (data) => {
              if (!data.id) return data.text;
              return $("<strong>").text(data.text);
            },
          });

          self.SelectLifeCounterTemplate.select2("open");
        } else {
          self.SelectLifeCounterTemplate.append(
            `<p><span style="color: var(--yellowish)">No Life Counter Templates found</span></p>`
          );
          // Add empty option with "No sessions found" text
          self.SelectLifeCounterTemplate.empty().addClass("current-data");

          // Refresh select2
          if (
            self.SelectLifeCounterTemplate.hasClass("select2-hidden-accessible")
          ) {
            self.SelectLifeCounterTemplate.select2("destroy");
          }
        }
      },
      error: function (xhr, status, error) {
        console.error("Error fetching life counter templates:", error);
        console.log("Status:", status);
        console.log("Response:", xhr.responseText);
        sweetAlertError("Failed to fetch life counter templates.");
      },
    });
  };
  self.GetSelectedLifeCounterTemplateId = () => {
    // Set up board game selection change handler
    self.DOM.find(self.SelectLifeCounterTemplate)
      .off("select2:select", self.SelectLifeCounterTemplate)
      .on("select2:select", self.SelectLifeCounterTemplate, function () {
        self.ForceClearForm(false);
        self.EditLifeCounterTermplateForm.addClass("d-none");
        self.RemoveExtraLines();
        // Get selected boardGameId
        self.LifeCounterTemplateId = $(this).val();

        if (self.LifeCounterManagerId != null) {
          self.Buttons.EditSelectedLifeCounterTemplate.attr("disabled", false);
          self.Buttons.StartSelectedLifeCounterTemplate.attr("disabled", false);
        }
      });
  };
  self.StartLifeCounterManager = () => {
    self.DOM.loadcontent("charge-contentloader");
    $.ajax({
      type: "POST",
      url: `https://localhost:7081/users/startlifecountermanager?LifeCounterTemplateId=${self.LifeCounterTemplateID}`,
      data: {
        LifeCounterTemplateId: self.LifeCounterTemplateId,
      },
      xhrFields: { withCredentials: true },
      success: function (response) {
        if (response.content != null) {
          self.LifeCounterManagerId = response.content.lifeCounterManagerId;

          sweetAlertSuccess(
            response.message,
            "Life Counter Manager Id: " + self.LifeCounterManagerId
          );

          if (self.LifeCounterManagerId != null) {
            self.RedirectToLifeCounterManager(self.LifeCounterManagerId);
            self.DOM.loadcontent("demolish-contentloader");
          }
        } else {
          sweetAlertError(response.message);
        }
      },
      error: function (xhr, status, error) {
        sweetAlertError(
          "Failed to fetch requested LIFE COUNTER MANAGER DETAILS."
        );
      },
    });
  };
  self.SaveLifeCounterTemplateModifications = (editedLifeCounterTemplate) => {
    // Disable submit button to prevent double submissions
    const saveModificationsBtn =
      self.Buttons.SaveModificationsLifeCounterTemplate;
    const originalBtnText = saveModificationsBtn.text();
    saveModificationsBtn.attr("disabled", true).text("Submitting...");

    $.ajax({
      url: "https://localhost:7081/users/editlifecountertemplate",
      type: "PUT",
      data: JSON.stringify({
        LifeCounterTemplateId: editedLifeCounterTemplate.lifeCounterTemplateId,
        LifeCounterTemplateName:
          editedLifeCounterTemplate.lifeCounterTemplateName,
        PlayersStartingLifePoints:
          editedLifeCounterTemplate.playersStartingLifePoints,
        PlayersCount: editedLifeCounterTemplate.playersCount,
        FixedMaxLifePointsMode:
          editedLifeCounterTemplate.fixedMaxLifePointsMode,
        PlayersMaxLifePoints: editedLifeCounterTemplate.playersMaxLifePoints,
        AutoDefeatMode: editedLifeCounterTemplate.autoDefeatMode,
        AutoEndMode: editedLifeCounterTemplate.autoEndMode,
      }),
      contentType: "application/json",
      xhrFields: { withCredentials: true },
      success: function (resp) {
        if (resp.content == null) {
          sweetAlertError(resp.message);
          return;
        }

        sweetAlertSuccess(resp.message);

        self.EditLifeCounterTermplateForm.addClass("d-none");

        self.RemoveExtraLines();

        self.LoadLifeCounterTemplates();
      },
      error: function (resp) {
        sweetAlertError(resp.message);
      },
      complete: () => {
        saveModificationsBtn.attr("disabled", false).text(originalBtnText);
      },
    });
  };

  self.LoadUnfinishedLifeCounterManagers = () => {
    // First destroy any existing select2 instance to prevent duplicates
    if (self.ReloadLifeCounterManager.hasClass("select2-hidden-accessible")) {
      self.ReloadLifeCounterManager.select2("destroy");
    }

    let unfinishedLifeCounterManagers = [];

    $.ajax({
      type: "GET",
      url: `https://localhost:7081/users/listunfinishedlifecountermanagers`,
      xhrFields: { withCredentials: true },
      success: function (response) {
        // Clear current options
        self.ReloadLifeCounterManager.empty();

        // Check if any board games are returned
        if (response.content != null) {
          unfinishedLifeCounterManagers = response.content;

          // Add options dynamically
          let counter = 1;
          unfinishedLifeCounterManagers.forEach((manager) => {
            const text = `${manager.startingDate} - ${manager.lifeCounterManagerName}`;
            const option = new Option(
              text,
              manager.lifeCounterManagerId,
              false,
              false
            );
            self.ReloadLifeCounterManager.append(option);
          });

          // Destroy and reinitialize Select2 with custom templates
          if (
            self.ReloadLifeCounterManager.hasClass("select2-hidden-accessible")
          ) {
            self.ReloadLifeCounterManager.select2("destroy");
          }

          self.ReloadLifeCounterManager.select2({
            theme: "classic",
            width: "100%",
            placeholder: "Pick a Life Counter Manager",
            templateResult: function (data) {
              if (!data.id) return data.text;
              const [date, ...rest] = data.text.split(" - ");
              return $(`
            <div class="d-flex justify-content-start align-items-center">
              <strong>${date}</strong>
              <img src="/images/icons/io_arrow_right.svg" class="bi bi-arrow white-icon" />
              <strong>${rest.join(" - ")}</strong>
            </div>
          `);
            },
            templateSelection: function (data) {
              return data.text || "Pick a Life Counter Manager";
            },
          });

          self.ReloadLifeCounterManager.select2("open");
        } else {
          self.ReloadLifeCounterManager.append(
            `<p><span style="color: var(--yellowish)">No unfinished Life Counter Managers found</span></p>`
          );
          // Add empty option with "No sessions found" text
          self.ReloadLifeCounterManager.empty().addClass("current-data");

          // Refresh select2
          if (
            self.ReloadLifeCounterManager.hasClass("select2-hidden-accessible")
          ) {
            self.ReloadLifeCounterManager.select2("destroy");
          }
        }
      },
      error: function (xhr, status, error) {
        console.error(
          "Error fetching unfinished life counter managers:",
          error
        );
        console.log("Status:", status);
        console.log("Response:", xhr.responseText);
        sweetAlertError("Failed to fetch life counter templates.");
      },
    });
  };
  self.ReloadSelectedUnfinishedLifeCounterManager = () => {
    //self.DOM.loadcontent("charge-contentloader");
    // Set up board game selection change handler
    self.DOM.find(self.ReloadLifeCounterManager)
      .off("select2:select", self.ReloadLifeCounterManager)
      .on("select2:select", self.ReloadLifeCounterManager, function () {
        // Get selected Life Counter Manager Id
        self.LifeCounterManagerId = $(this).val();

        if (self.LifeCounterManagerId === null) {
          sweetAlertError("Error: missing life counter manager id");

          return;
        }

        self.RedirectToLifeCounterManager(self.LifeCounterManagerId);
        //self.DOM.loadcontent("demolish-contentloader");
      });
  };

  self.GetLifeCounterStatistics = () => {
    $.ajax({
      type: "GET",
      url: `https://localhost:7081/users/getlifecounterstatistics`,
      xhrFields: { withCredentials: true },
      success: function (response) {
        // Clear current statistics items
        self.StatisticsItems.forEach((item) => {
          item.find("span").text("loading...");
        });

        // Check if any data are returned
        if (response.content == null) {
          sweetAlertError(response.message);
          return;
        }

        let statsData = response.content;

        self.StatisticsItems.First.find("span").text(
          statsData.MostUsedLifeCounter
        );
        self.StatisticsItems.Second.find("span").text(
          statsData.LifeCountersCreated
        );
        self.StatisticsItems.Third.find("span").text(
          statsData.LifeCountersStarted
        );
        self.StatisticsItems.Fourth.find("span").text(
          statsData.UnfinishedLifeCounters
        );
        self.StatisticsItems.Fifth.find("span").text(
          statsData.FavoritePlayersCount
        );
      },
      error: function (xhr, status, error) {
        sweetAlertError("Failed to fetch life counter statistics.");
      },
    });
  };

  self.LoadEvents = () => {
    self.Options.CloseMenu.on("click", function (e) {
      e.preventDefault();

      self.RedirectToLifeCounterManagerSetUp(self.LifeCounterManagerId);
    });

    self.Options.CreateLifeCounterTemplate.on("click", function (e) {
      if ($(this).hasClass("chosenMenuOption")) {
        $(this).removeClass("chosenMenuOption");
        self.Togglers.ToggleCreateLifeCounterTemplate.slideToggle();
        return;
      }
      self.Inputs.CreateTemplate_Name.trigger("focus");

      self.ResetMenuOptions();

      self.Options.CreateLifeCounterTemplate.addClass("chosenMenuOption");

      self.Togglers.ToggleCreateLifeCounterTemplate.slideToggle(() => {
        self.Inputs.CreateTemplate_Name.trigger("focus");
      });

      self.PlayersCount = 1;
    });
    self.Inputs.CreateTemplate_Name.on("input", self.CheckFormFilling(true));
    self.Inputs.CreateTemplate_PlayersStartingLifePoints.on(
      "input",
      self.CheckFormFilling(true)
    );
    self.Inputs.CreateTemplate_PlayersCount.on("click", function (e) {
      e.preventDefault();

      // Remove the class from all
      self.Inputs.CreateTemplate_PlayersCount.removeClass("clickedState");

      // Add class to selected
      $(this).addClass("clickedState");

      // Update the player count
      self.PlayersCount = parseInt($(this).text(), 10);

      self.CheckFormFilling(true);
    });
    self.Inputs.CreateTemplate_FixedMaxLifePointsMode.on(
      "change",
      function (e) {
        if ($(this).is(":checked")) {
          // Checkbox is checked
          self.Inputs.CreateTemplate_MaxLifePointsInputWrapper.removeClass(
            "d-none"
          );
        } else {
          // Checkbox is unchecked
          self.Inputs.CreateTemplate_MaxLifePointsInputWrapper.addClass(
            "d-none"
          );
        }
      }
    );
    self.Inputs.CreateTemplate_AutoDefeatMode.on("change", (e) => {
      if (!self.Inputs.CreateTemplate_AutoDefeatMode.is(":checked")) {
        self.Inputs.CreateTemplate_AutoEndMode.prop("checked", false) // <-- Correct way to uncheck
          .prop("disabled", true); // <-- Properly disables the checkbox
      } else {
        self.Inputs.CreateTemplate_AutoEndMode.prop("disabled", false); // Re-enable if needed
      }
    });
    self.Buttons.ClearCreateFormLifeCounterTemplate.on("click", function (e) {
      e.preventDefault();

      self.ForceClearForm(true);
    });
    self.Buttons.CreateLifeCounterTemplate.on("click", function (e) {
      e.preventDefault();

      if (
        !self.Inputs.CreateTemplate_Name.val().trim() ||
        !self.Inputs.CreateTemplate_PlayersStartingLifePoints.val().trim()
      ) {
        sweetAlertError(
          "Please give a name to the Life Counter Template and set the Players Starting Life Points."
        );
        return;
      }

      self.CreateLifeCounterTemplate();
    });
    self.Buttons.CreateAndStartLifeCounterTemplate.on("click", function (e) {
      e.preventDefault();

      self.CreateLifeCounterTemplate(true);
    });

    self.Options.SelectLifeCounterTemplate.on("click", function (e) {
      if ($(this).hasClass("chosenMenuOption")) {
        $(this).removeClass("chosenMenuOption");
        self.Togglers.ToggleSelectLifeCounterTemplate.slideToggle();

        if (
          self.SelectLifeCounterTemplate.hasClass("select2-hidden-accessible")
        ) {
          self.SelectLifeCounterTemplate.select2("destroy");
        }

        self.SelectLifeCounterTemplate.css("display", "none");

        return;
      }

      self.ResetMenuOptions();

      self.Options.SelectLifeCounterTemplate.addClass("chosenMenuOption");

      self.Togglers.ToggleSelectLifeCounterTemplate.slideToggle(() => {
        self.SelectLifeCounterTemplate.fadeIn(800, () => {
          self.LoadLifeCounterTemplates();
        });
      });
    });
    self.GetSelectedLifeCounterTemplateId();

    self.Buttons.EditSelectedLifeCounterTemplate.on("click", function (e) {
      e.preventDefault();

      self.Buttons.EditSelectedLifeCounterTemplate.attr("disabled", true);

      self.EditLifeCounterTermplateForm.removeClass("d-none");

      self.RemoveExtraLines();

      self.Togglers.ToggleSelectLifeCounterTemplate.append(
        `<hr class="enclosing-lines" />`
      );

      self.GetLifeCounterTemplateDetails();
    });

    self.Inputs.EditTemplate_PlayersCount.on("click", function (e) {
      e.preventDefault();

      // Remove the class from all
      self.Inputs.EditTemplate_PlayersCount.removeClass("clickedState");

      // Add class to selected
      $(this).addClass("clickedState");

      // Update the player count
      self.PlayersCount = parseInt($(this).text(), 10);
    });
    self.Inputs.EditTemplate_FixedMaxLifePointsMode.on("change", function (e) {
      if ($(this).is(":checked")) {
        // Checkbox is checked
        self.Inputs.EditTemplate_MaxLifePointsInputWrapper.removeClass(
          "d-none"
        );
      } else {
        // Checkbox is unchecked
        self.Inputs.EditTemplate_MaxLifePointsInputWrapper.addClass("d-none");
      }
    });
    self.Buttons.StartSelectedLifeCounterTemplate.on("click", function (e) {
      e.preventDefault();

      self.StartLifeCounterManager();
    });
    self.Inputs.EditTemplate_AutoDefeatMode.on("change", (e) => {
      if (!self.Inputs.EditTemplate_AutoDefeatMode.is(":checked")) {
        self.Inputs.EditTemplate_AutoEndMode.prop("checked", false) // <-- Correct way to uncheck
          .prop("disabled", true); // <-- Properly disables the checkbox
      } else {
        self.Inputs.EditTemplate_AutoEndMode.prop("disabled", false); // Re-enable if needed
      }
    });
    self.Buttons.ClearEditFormLifeCounterTemplate.on("click", function (e) {
      e.preventDefault();

      self.ForceClearForm(false);
    });
    self.Buttons.SaveModificationsLifeCounterTemplate.on("click", function (e) {
      e.preventDefault();

      let templateName_input = self.Inputs.EditTemplate_Name.val().trim();
      let isNameChanged =
        templateName_input == self.LifeCounterTemplate.lifeCounterTemplateName;

      let playersStaringLifePoints_input =
        self.Inputs.EditTemplate_PlayersStartingLifePoints.val().trim();
      let isPlayersStartingLifePointsChanged =
        playersStaringLifePoints_input ==
        self.LifeCounterTemplate.playersStaringLifePoints;

      let playersCount_input = self.Inputs.EditTemplate_PlayersCount.filter(
        ".clickedState"
      )
        .text()
        .trim();
      let isPlayersCountChanged =
        playersCount_input == self.LifeCounterTemplate.playersCount;

      let fixedMaxLifePointsMode_input =
        self.Inputs.EditTemplate_FixedMaxLifePointsMode.is(":checked");
      let isFixedMaxLifePointsModeChanged =
        fixedMaxLifePointsMode_input ==
        self.LifeCounterTemplate.fixedMaxLifePointsMode;

      let playersMaxLifePoints_input =
        self.Inputs.EditTemplate_PlayersMaxLifePoints.val().trim();
      let isPlayersMaxLifePointsChanged =
        playersMaxLifePoints_input ==
        self.LifeCounterTemplate.playersMaxLifePoints;

      let autoDefeatMode_input =
        self.Inputs.EditTemplate_AutoDefeatMode.is(":checked");
      let isAutoDefeatModeChanged =
        autoDefeatMode_input == self.LifeCounterTemplate.autoDefeatMode;

      let autoEndMode_input =
        self.Inputs.EditTemplate_AutoEndMode.is(":checked");
      let isAutoEndModeChanged =
        autoEndMode_input == self.LifeCounterTemplate.autoEndMode;

      if (fixedMaxLifePointsMode_input == true) {
        isPlayersMaxLifePointsChanged =
          playersMaxLifePoints_input ==
          self.LifeCounterTemplate.playersMaxLifePoints;
      } else {
        isPlayersMaxLifePointsChanged = false;
      }

      var isAnyThingChanged =
        isNameChanged == false ||
        isPlayersStartingLifePointsChanged == false ||
        isPlayersCountChanged == false ||
        isFixedMaxLifePointsModeChanged == false ||
        isPlayersMaxLifePointsChanged == false ||
        isAutoDefeatModeChanged == false ||
        isAutoEndModeChanged == false;

      if (
        templateName_input === "" ||
        playersStaringLifePoints_input === "" ||
        isAnyThingChanged == false
      ) {
        return;
      }

      console.log("isAnyThingChanged: ", isAnyThingChanged);
      console.log("isNameChanged: ", isNameChanged);
      console.log(
        "isPlayersStartingLifePointsChanged: ",
        isPlayersStartingLifePointsChanged
      );
      console.log("isPlayersCountChanged: ", isPlayersCountChanged);
      console.log(
        "isFixedMaxLifePointsModeChanged: ",
        isFixedMaxLifePointsModeChanged
      );
      console.log(
        "isPlayersMaxLifePointsChanged: ",
        isPlayersMaxLifePointsChanged
      );
      console.log("isAutoDefeatModeChanged: ", isAutoDefeatModeChanged);
      console.log("isAutoEndModeChanged: ", isAutoEndModeChanged);

      let editedLifeCounterTemplate = {};

      editedLifeCounterTemplate.lifeCounterTemplateId =
        self.LifeCounterTemplateId;
      editedLifeCounterTemplate.lifeCounterTemplateName = templateName_input;
      editedLifeCounterTemplate.playersStartingLifePoints =
        playersStaringLifePoints_input;
      editedLifeCounterTemplate.playersCount = playersCount_input;
      editedLifeCounterTemplate.fixedMaxLifePointsMode =
        fixedMaxLifePointsMode_input;
      if (fixedMaxLifePointsMode_input == true) {
        editedLifeCounterTemplate.playersMaxLifePoints =
          playersMaxLifePoints_input;
      } else {
        editedLifeCounterTemplate.playersMaxLifePoints = null;
      }
      editedLifeCounterTemplate.autoDefeatMode = autoDefeatMode_input;
      editedLifeCounterTemplate.autoEndMode = autoEndMode_input;

      self.SaveLifeCounterTemplateModifications(editedLifeCounterTemplate);
    });

    self.Options.ReloadLifeCounter.on("click", function (e) {
      if ($(this).hasClass("chosenMenuOption")) {
        $(this).removeClass("chosenMenuOption");
        self.Togglers.ToggleReloadLifeCounterManager.slideToggle();
        return;
      }

      self.ResetMenuOptions();

      self.Options.ReloadLifeCounter.addClass("chosenMenuOption");

      self.Togglers.ToggleReloadLifeCounterManager.slideToggle(() => {
        self.ReloadLifeCounterManager.fadeIn(800, () => {
          self.LoadUnfinishedLifeCounterManagers();
        });
      });
    });
    self.ReloadSelectedUnfinishedLifeCounterManager();

    self.Options.ShowLifeCounterStatistics.on("click", function (e) {
      if ($(this).hasClass("chosenMenuOption")) {
        $(this).removeClass("chosenMenuOption");
        self.Togglers.ShowLifeCounterStatistics.slideToggle();
        return;
      }

      self.ResetMenuOptions();

      self.Options.ShowLifeCounterStatistics.addClass("chosenMenuOption");

      self.Togglers.ShowLifeCounterStatistics.slideToggle();
    });
  };

  self.Build = () => {
    self.LoadReferences();
    self.GetLifeCounterManagerId();
    self.LoadEvents();
  };

  self.Build();
}

$(function () {
  new life_counter_menu();
});
