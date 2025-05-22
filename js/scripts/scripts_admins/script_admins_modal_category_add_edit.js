function modal_Category_Add_Edit() {
  let self = this;
  self.IsBuilt = false;
  self.IsBuilt = false;
  self.isEditMode = false;
  self.currentCategoryId = null;
  self.onSuccessCallback = null;

  self.LoadReferences = () => {
    self.DOM = $("#category-add-edit-modal");

    self.ModalTitle = self.DOM.find("#edit-modal-title");
    self.Form = $("#category-add-edit-form");

    // Add a hidden input for the board game ID when in edit mode
    self.Form.append(
      '<input type="hidden" id="category-id" name="CategoryId" value="">'
    );

    self.Inputs = [];
    self.Inputs[self.Inputs.length] = self.Inputs.Required =
      self.DOM.find(".required");
    self.Inputs[self.Inputs.length] = self.Inputs.CategortyId =
      self.DOM.find("#category-id");
    self.Inputs[self.Inputs.length] = self.Inputs.CategoryName =
      self.DOM.find("#new-category-name");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.Submit = self.DOM.find(
      "#category-submit-button"
    );
    self.Buttons[self.Buttons.length] = self.Buttons.Reset = self.DOM.find(
      "#reset-add-edit-category-form"
    );
  };

  self.LoadEvents = () => {
    self.Buttons.Submit.on("click", function (e) {
      e.preventDefault();

      if (self.isEditMode === true) {
        self.SetUpEditCategoryForm();
      } else {
        self.SetUpAddCategoryForm();
      }
    });

    self.Buttons.Reset.on("click", function (e) {
      self.forceClearForm();
    });

    self.CheckForm();
  };

  // New method to fetch CATEGORY details for editing
  self.FetchCategoryDetails = (categoryId) => {
    self.AddContentLoader();
    self.currentCategoryId = categoryId;

    $.ajax({
      url: `https://localhost:7081/admins/showcategorydetails?CategoryId=${categoryId}`,
      method: "GET",
      xhrFields: {
        withCredentials: true,
      },
      success: function (response) {
        if (!response.content) {
          console.error("Failed to fetch category details:", response.message);
          return;
        }

        // Open the edit modal with the board game data
        __global.CategoryEditModalController.PopulateFormForEditing(
          response.content
        );
        self.RemoveContentLoader();
      },
      error: function (xhr, status, error) {
        console.error("Error fetching category details:", error);
      },
    });
  };

  self.checkFormFilling = () => {
    let areFieldsFilled = true;

    self.Inputs.Required.each(function () {
      const value = $(this).val();

      // Skip check if value is null or empty string
      if (
        value === null ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0)
      ) {
        areFieldsFilled = false;
      }
    });

    self.Buttons.Submit.prop("disabled", !areFieldsFilled);
  };

  self.CheckForm = () => {
    // React to typing in any input
    self.Inputs.Required.on("input", self.checkFormFilling);
    // React to clicking on the clear button:
    self.Buttons.Reset.on("click", () => {
      self.forceClearForm();
    });
  };

  self.forceClearForm = () => {
    // Block form submission button
    self.Buttons.Submit.prop("disabled", true);

    //Clear form
    self.Inputs.forEach((input) => {
      input.val(null);
    });
  };

  self.SetUpAddCategoryForm = () => {
    //Disable submit button to prevent double submissions
    const submitBtn = self.Buttons.Submit;
    const originalBtnText = submitBtn.text();
    submitBtn.attr("disabled", true).text("Submitting...");

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/admins/addcategory",
      data: self.Form.serialize(),
      xhrFields: {
        withCredentials: true,
      },
      success: (resp) => {
        alert(resp.message);

        self.forceClearForm();

        self.CloseModal();

        // Refresh the CATEGORY list
        if (self.onSuccessCallback) {
          self.onSuccessCallback();
        }
      },
      error: (err) => {
        alert(err);
      },
      complete: () => {
        // Re-enable button
        submitBtn.attr("disabled", true).text(originalBtnText);
      },
    });
  };

  self.SetUpEditCategoryForm = () => {
    //Disable submit button to prevent double submissions
    const submitBtn = self.Buttons.Submit;
    const originalBtnText = submitBtn.text();
    submitBtn.attr("disabled", true).text("Submitting...");

    // Get form values
    const categoryId = self.currentCategoryId;
    const categoryName = $("#new-category-name").val();

    $.ajax({
      url: "https://localhost:7081/admins/editcategory",
      type: "PUT",
      data: JSON.stringify({
        CategoryId: categoryId,
        CategoryName: categoryName,
      }),
      contentType: "application/json",
      xhrFields: {
        withCredentials: true,
      },
      success: (resp) => {
        alert(resp.message);

        // Reset form and exit edit mode
        self.forceClearForm();
        self.ResetToAddMode();

        // Close the modal
        self.CloseModal();

        // Refresh the board games list
        if (__global.CategoryDatabBaseModalController) {
          __global.CategoryDatabBaseModalController.LoadAllCategories();
        }

        self.forceClearForm();
      },
      error: (err) => {
        alert(err);
      },
      complete: () => {
        // Re-enable button
        submitBtn.attr("disabled", true).text(originalBtnText);
      },
    });
  };

  // Method to fill the form with CATEGORY data for editing
  self.PopulateFormForEditing = (category) => {
    // Set the form to edit mode
    self.isEditMode = true;
    self.Inputs.CategoryId = category.categoryId;

    // Update the modal title and button text
    self.ModalTitle.html("<span>E</span>dit <span>C</span>ategory");
    self.Buttons.Submit.text("Update");

    // Fill in the form fields
    self.Inputs.CategoryName.val(category.categoryName);

    // Recheck form to enable submit button if needed
    self.checkFormFilling();
  };

  // Reset the form to "Add" mode
  self.ResetToAddMode = () => {
    self.isEditMode = false;
    self.currentCategoryId = null;
    self.ModalTitle.html(
      "<span>A</span>dd a <span>N</span>ew <span>C</span>ategory"
    );
    self.Buttons.Submit.text("Confirm");
  };

  self.Show = () => {
    if (!self.DOM || self.DOM.length === 0) {
      console.error("Modal DOM element not found.");
      return;
    }

    const modalInstance = new bootstrap.Modal(self.DOM[0], {
      backdrop: "static", // optional
      keyboard: false, // optional
    });

    modalInstance.show();
  };

  self.BuildModal = () => {
    if (self.IsBuilt == true) {
      return;
    }

    self.LoadReferences();
    self.LoadEvents();
    self.IsBuilt = true;
  };

  self.AddContentLoader = () => {
    self.DOM.loadcontent("charge-contentloader");
  };
  self.RemoveContentLoader = () => {
    self.DOM.loadcontent("demolish-contentloader");
  };

  self.OpenAddModal = (onSuccessCallback) => {
    self.onSuccessCallback = onSuccessCallback;
    self.ResetToAddMode();
    self.forceClearForm();
    self.Show();
  };

  // New method to open the modal in edit mode
  self.OpenEditModal = (categoryId, onSuccessCallback) => {
    self.onSuccessCallback = onSuccessCallback;
    self.Show();
    self.FetchCategoryDetails(categoryId);
  };

  self.CloseModal = () => {
    const modalInstance = bootstrap.Modal.getInstance(self.DOM[0]);
    if (modalInstance) {
      self.forceClearForm();
      modalInstance.hide();
    }
  };

  self.BuildModal();
}
