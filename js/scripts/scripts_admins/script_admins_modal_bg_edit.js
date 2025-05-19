function modal_BG_Edit() {
  let self = this;
  self.IsBuilt = false;

  self.LoadReferences = () => {
    self.DOM = $("#bg-add-edit-modal");
  };

  self.LoadEvents = () => {};

  self.loadCategories = () => {
    // First destroy any existing select2 instance to prevent duplicates
    if ($("#new-bg-category-select").hasClass("select2-hidden-accessible")) {
      $("#new-bg-category-select").select2("destroy");
    }

    // Fetch the category list once from the backend
    fetch("https://localhost:7081/admins/showcategories", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.content) {
          console.error("Failed to load categories:", data.message);
          return;
        }

        const categories = data.content.map((item) => ({
          id: item.categoryId,
          text: item.categoryName,
        }));

        $("#new-bg-category-select").select2({
          data: categories,
          dropdownParent: self.DOM,
          placeholder: "Select a category",
          allowClear: true,
          theme: "classic",
          width: "100%",
        });
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });
  };

  self.loadMechanics = () => {
    // First destroy any existing select2 instance to prevent duplicates
    if ($("#new-bg-mechanics-select").hasClass("select2-hidden-accessible")) {
      $("#new-bg-mechanics-select").select2("destroy");
    }

    // First, fetch the category list once from the backend
    fetch("https://localhost:7081/admins/showmechanics", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.content) {
          console.error("Failed to load mechanics:", data.message);
          return;
        }

        const mechanics = data.content.map((item) => ({
          id: item.mechanicId,
          text: item.mechanicName,
        }));

        $("#new-bg-mechanics-select").select2({
          data: mechanics,
          dropdownParent: self.DOM,
          placeholder: "Select mechanics",
          allowClear: true,
          theme: "classic",
          width: "100%",
        });
      })
      .catch((err) => {
        console.error("Error fetching mechanics:", err);
      });
  };

  self.SetUpAddBgForm = () => {
    // Disable submit button to prevent double submissions
    const submitBtn = $(this).find("button[type='submit']");
    const originalBtnText = submitBtn.text();
    submitBtn.attr("disabled", true).text("Submitting...");

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/admins/addboardgame",
      data: $(this).serialize(),
      xhrFields: {
        withCredentials: true,
      },
      success: (resp) => {
        alert(resp.message);

        //forceClearForm();
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
    self.loadCategories();
    self.loadMechanics();
    self.LoadEvents();
    self.IsBuilt = true;
  };

  self.OpenModal = () => {
    self.Show();
  };

  self.CloseModal = () => {};

  self.BuildModal();
}
