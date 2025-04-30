function loadHeader(userData, roleData) {
  const isLoggedIn = userData?.content?.isUserLoggedIn === true;
  const rule = roleData?.content?.role || "";

  const header = document.createElement("header");
  header.className = "header";

  header.innerHTML = `
    <header class="header">
      <a href="index.html" class="logo">BBG <span>LIKE</span></a>
      <nav class="navbar">
        <div class="navOptions d-flex flex-row">
          <a href="index.html">HOME</a>
          <a href="explore.html">EXPLORE</a>
          <a href="users_authentication.html" class="anonymous-clearance d-none">SIGN UP/IN</a>
          <a href="users_page.html" class="loggedIn-clearance d-none">USER</a>
          <a href="admins.html" class="admins-clearence d-none">ADMIN</a>
          <a href="devs.html" class="devs-clearence d-none">DEV</a>

          <div class="dropdown">
            <a class="nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="bi bi-person-gear"></i>
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item m-0 " href="#">Edit Profile</a></li>
              <li><a class="dropdown-item m-0" href="#">Delete Profile</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item m-0" href="#">Sign Out</a></li>
            </ul>
          </div>
          
          <a style="text-decoration: none;" href="#" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
            <i class="bi bi-gear" ></i>
          </a>
        </div>

        <div class="navHamburger">
          <nav class="navbar navbar-expand-lg">
            <div class="d-flex flex-column align-items-end">
              <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                  <i class="bi bi-list"></i>                
              </button>

              <div class="collapse navbar-collapse text-end" id="navbarTogglerDemo01">                 
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                  <li class="nav-item">
                    <a class="nav-link" href="index.html">HOME</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="explore.html">EXPLORE</a>
                  </li>
                  <li class="nav-item">
                    <a href="users_authentication.html" class="anonymous-clearance nav-link d-none">SIGN UP/IN</a>
                  </li>
                  <li class="nav-item">
                    <a href="users_page.html" class="loggedIn-clearence nav-link d-none">USER</a>
                  </li>
                  <li class="nav-item">
                    <a href="admins.html" class="admins-clearence nav-link d-none">ADMIN</a>
                  </li>
                  <li class="nav-item">
                    <a href="devs.html" class="devs-clearence nav-link d-none">DEV</a>
                  </li>

                  <div class="dropdown">
                      <a class="nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-person-gear"></i>
                      </a>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item m-0 " href="#">Edit Profile</a></li>
                        <li><a class="dropdown-item m-0" href="#">Delete Profile</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item m-0" href="#">Sign Out</a></li>
                      </ul>
                    </div>                 

                  <li class="nav-item">
                    <a style="text-decoration: none;" href="#" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                      <i class="bi bi-gear" ></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </nav>

      <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="offcanvasRightLabel">General Configurations</h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
          <a>Change Language</a>
          <a>Change Theme</a>
        </div>
      </div>
    </header>
  `;
  document.body.appendChild(header);

  if (isLoggedIn === true) {
    $(".anonymous-clearance").addClass("d-none");
    $(".loggedIn-clearance").removeClass("d-none");

    if (roleData.content.role === "Developer") {
      $(".admins-clearance").removeClass("d-none");
      $(".devs-clearance").removeClass("d-none");
    } else if (roleData.content.role === "Administrator") {
      $(".admins-clearance").removeClass("d-none");
    } else if (roleData.content.role === "User") {
      $(".loggedIn-clearance").removeClass("d-none");
    }

    // Attach logout event after role is handled
    $(".logOut").on("click", async function (e) {
      const response = await fetch("https://localhost:7081/users/signout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());

      if (response.content?.isUserSignOut) {
        // Successfully logged out
        window.location.href = "index.html";
      } else {
        alert("Failed to log out. Please try again.");
      }
    });
  } else {
    $(".anonymous-clearance").removeClass("d-none");
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  let userData = null;
  let roleData = null;

  try {
    const statusResponse = await fetch(
      "https://localhost:7081/users/validatestatus",
      {
        method: "GET",
        credentials: "include",
      }
    );

    userData = await statusResponse.json();

    if (userData.content.isUserLoggedIn === true) {
      const roleResponse = await fetch("https://localhost:7081/users/getrole", {
        method: "GET",
        credentials: "include",
      });

      roleData = await roleResponse.json();
    }
  } catch (err) {
    console.error("Failed to fetch authentication status or role", err);
  }

  loadHeader(userData, roleData);

  $(".logOut").on("click", async function (e) {
    const response = await fetch("https://localhost:7081/users/signout", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

    if (response.content?.isUserSignOut) {
      window.location.href = "index.html";
    } else {
      alert("Failed to log out. Please try again.");
    }
  });
});
