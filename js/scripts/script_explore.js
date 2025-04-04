$(document).ready(function () {
  function loadAllGames(data = {}) {
    $.get(
      "https://localhost:7081/explore/listboardgames",
      data,
      function (response) {
        // Verifica se existe a chave "content" na resposta
        if (!response.content || !Array.isArray(response.content)) {
          console.error("Unexpected response format:", response);
          return;
        }

        $(".table-allBoardGames tbody").empty(); // Limpa a tabela

        // trStart and trEnd exist only to create
        // an empty line in the beggining and end
        // of the table, they are not necessary
        let trStart = `
          <tr>
            <td class="text-start"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        `;
        $(".table-allBoardGames tbody").append(trStart);

        $.each(response.content, function (index, item) {
          let tr = `
          <tr>
            <td class="text-start">${item.boardGameName}</td>
            <td>${item.avgRating}</td>
            <td>${item.ratingsCount}</td>
            <td>${item.playersCount}</td>
            <td>${item.avgDuration}</td>
            <td>${item.sessionsLogged}</td>
          </tr>
        `;
          $(".table-allBoardGames tbody").append(tr);
        });
        let trEnd = `
          <tr>
            <td class="text-start"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        `;
        $(".table-allBoardGames tbody").append(trEnd);

        console.log(response.message); // Exibe a mensagem da API no console
      }
    );
  }

  function loadMostPlayedGames(data = {}) {
    $.get(
      "https://localhost:7081/explore/boardgamesrankings",
      data,
      function (response) {
        // Verifica se existe a chave "content" na resposta
        if (
          !response.content ||
          !Array.isArray(response.content.mostPlayedBoardGames)
        ) {
          console.error("Unexpected response format:", response);
          return;
        }

        $(".mostPlayedGames").empty(); // Limpa a lista

        // Acessa a lista de mostPlayedBoardGames
        const mostPlayedBG = response.content.mostPlayedBoardGames;

        // Verifica se a lista existe e tem elementos
        if (mostPlayedBG.length > 0) {
          $.each(mostPlayedBG, function (index, bgname) {
            let firstLetter = bgname[0];
            let allOtherLetters = bgname.slice(1, bgname.length);
            let li = `
            <li><span>${firstLetter}</span>${allOtherLetters}</li>            
          `;
            $(".mostPlayedGames").append(li);
          });
        } else {
          $(".mostPlayedGames").append(`
            <li class="No data available"></li>          
        `);
        }

        console.log(response.message); // Exibe a mensagem da API no console
      }
    );
  }

  function loadBestRatedGames(data = {}) {
    $.get(
      "https://localhost:7081/explore/boardgamesrankings",
      data,
      function (response) {
        // Verifica se existe a chave "content" na resposta
        if (
          !response.content ||
          !Array.isArray(response.content.bestRatedBoardGames)
        ) {
          console.error("Unexpected response format:", response);
          return;
        }

        $(".bestRatedGames").empty(); // Limpa a lista

        // Acessa a lista de mostPlayedBoardGames
        const bestRatedBG = response.content.bestRatedBoardGames;

        // Verifica se a lista existe e tem elementos
        if (bestRatedBG.length > 0) {
          $.each(bestRatedBG, function (index, bgname) {
            let firstLetter = bgname[0];
            let allOtherLetters = bgname.slice(1, bgname.length);
            let li = `
            <li><span>${firstLetter}</span>${allOtherLetters}</li>            
          `;
            $(".bestRatedGames").append(li);
          });
        } else {
          $(".bestRatedGames").append(`
            <li class="No data available"></li>          
        `);
        }

        console.log(response.message); // Exibe a mensagem da API no console
      }
    );
  }

  function loadShortestGames(data = {}) {
    $.get(
      "https://localhost:7081/explore/boardgamesrankings",
      data,
      function (response) {
        // Verifica se existe a chave "content" na resposta
        if (
          !response.content ||
          !Array.isArray(response.content.shortestBoardGames)
        ) {
          console.error("Unexpected response format:", response);
          return;
        }

        $(".shortestGames").empty(); // Limpa a lista

        // Acessa a lista de mostPlayedBoardGames
        const shortestBG = response.content.shortestBoardGames;

        // Verifica se a lista existe e tem elementos
        if (shortestBG.length > 0) {
          $.each(shortestBG, function (index, bgname) {
            let firstLetter = bgname[0];
            let allOtherLetters = bgname.slice(1, bgname.length);
            let li = `
            <li><span>${firstLetter}</span>${allOtherLetters}</li>            
          `;
            $(".shortestGames").append(li);
          });
        } else {
          $(".shortestGames").append(`
            <li class="No data available"></li>          
        `);
        }

        console.log(response.message); // Exibe a mensagem da API no console
      }
    );
  }

  function loadLongestGames(data = {}) {
    $.get(
      "https://localhost:7081/explore/boardgamesrankings",
      data,
      function (response) {
        // Verifica se existe a chave "content" na resposta
        if (
          !response.content ||
          !Array.isArray(response.content.longestBoardGames)
        ) {
          console.error("Unexpected response format:", response);
          return;
        }

        $(".longestGames").empty(); // Limpa a lista

        // Acessa a lista de mostPlayedBoardGames
        const longestBG = response.content.longestBoardGames;

        // Verifica se a lista existe e tem elementos
        if (longestBG.length > 0) {
          $.each(longestBG, function (index, bgname) {
            let firstLetter = bgname[0];
            let allOtherLetters = bgname.slice(1, bgname.length);
            let li = `
            <li><span>${firstLetter}</span>${allOtherLetters}</li>            
          `;
            $(".longestGames").append(li);
          });
        } else {
          $(".longestGames").append(`
            <li class="No data available"></li>          
        `);
        }

        console.log(response.message); // Exibe a mensagem da API no console
      }
    );
  }

  function loadAdultsFavoriteGames(data = {}) {
    $.get(
      "https://localhost:7081/explore/boardgamesrankings",
      data,
      function (response) {
        // Verifica se existe a chave "content" na resposta
        if (
          !response.content ||
          !Array.isArray(response.content.adultsFavoriteBoardGames)
        ) {
          console.error("Unexpected response format:", response);
          return;
        }

        $(".adultsFavoriteGames").empty(); // Limpa a lista

        // Acessa a lista de mostPlayedBoardGames
        const adultsFavoriteBG = response.content.adultsFavoriteBoardGames;

        // Verifica se a lista existe e tem elementos
        if (adultsFavoriteBG.length > 0) {
          $.each(adultsFavoriteBG, function (index, bgname) {
            let firstLetter = bgname[0];
            let allOtherLetters = bgname.slice(1, bgname.length);
            let li = `
            <li><span>${firstLetter}</span>${allOtherLetters}</li>            
          `;
            $(".adultsFavoriteGames").append(li);
          });
        } else {
          $(".adultsFavoriteGames").append(`
            <li class="No data available"></li>          
        `);
        }

        console.log(response.message); // Exibe a mensagem da API no console
      }
    );
  }

  function loadTeensFavoriteGames(data = {}) {
    $.get(
      "https://localhost:7081/explore/boardgamesrankings",
      data,
      function (response) {
        // Verifica se existe a chave "content" na resposta
        if (
          !response.content ||
          !Array.isArray(response.content.teensFavoriteBoardGames)
        ) {
          console.error("Unexpected response format:", response);
          return;
        }

        $(".teensFavoriteGames").empty(); // Limpa a lista

        // Acessa a lista de mostPlayedBoardGames
        const teensFavoriteBG = response.content.teensFavoriteBoardGames;

        // Verifica se a lista existe e tem elementos
        if (teensFavoriteBG.length > 0) {
          $.each(teensFavoriteBG, function (index, bgname) {
            let firstLetter = bgname[0];
            let allOtherLetters = bgname.slice(1, bgname.length);
            let li = `
            <li><span>${firstLetter}</span>${allOtherLetters}</li>            
          `;
            $(".teensFavoriteGames").append(li);
          });
        } else {
          $(".teensFavoriteGames").append(`
            <li class="No data available"></li>          
        `);
        }

        console.log(response.message); // Exibe a mensagem da API no console
      }
    );
  }

  function loadMostPlayedCategories(data = {}) {
    $.get(
      "https://localhost:7081/explore/categoriesranking",
      data,
      function (response) {
        // Verifica se existe a chave "content" na resposta
        if (
          !response.content ||
          !Array.isArray(response.content.mostPlayedCategories)
        ) {
          console.error("Unexpected response format:", response);
          return;
        }

        $("#mostPlayedCategories tbody").empty(); // Limpa a lista

        // Acessa a lista de mostPlayedBoardGames
        const mostPlayedCats = response.content.mostPlayedCategories;

        if (mostPlayedCats.length > 0) {
          $.each(mostPlayedCats, function (index, item) {
            let tr = `
              <tr>              
                <td>${index + 1}</td> 
                <td class="text-start">${item.categoryName}</td>            
                <td class="text-center">${item.sessionsCount}</td>           
              </tr>
            `;
            $("#mostPlayedCategories tbody").append(tr);
          });
        } else {
          $("#mostPlayedCategories tbody").append(`
            <tr>
                <td class="No data available"></td>            
                <td class="No data available"></td>           
                <td class="No data available"></td>           
            </tr>                  
        `);
        }

        console.log(response.message); // Exibe a mensagem da API no console
      }
    );
  }

  function loadMostPopularCategories(data = {}) {
    $.get(
      "https://localhost:7081/explore/categoriesranking",
      data,
      function (response) {
        // Verifica se existe a chave "content" na resposta
        if (
          !response.content ||
          !Array.isArray(response.content.mostPopularCategories)
        ) {
          console.error("Unexpected response format:", response);
          return;
        }

        $("#mostPopularCategories tbody").empty(); // Limpa a lista

        // Acessa a lista de mostPlayedBoardGames
        const mostPopularCats = response.content.mostPopularCategories;

        if (mostPopularCats.length > 0) {
          $.each(mostPopularCats, function (index, item) {
            let tr = `
              <tr>              
                <td>${index + 1}</td> 
                <td class="text-start">${item.categoryName}</td>            
                <td class="text-center">${item.sessionsCount}</td>   
                <td class="text-center">${item.boardGamesCount}</td>         
              </tr>
            `;
            $("#mostPopularCategories tbody").append(tr);
          });
        } else {
          $("#mostPopularCategories tbody").append(`
            <tr>
                <td class="No data available"></td>            
                <td class="No data available"></td>            
                <td class="No data available"></td>            
                <td class="No data available"></td>           
            </tr>                  
        `);
        }

        console.log(response.message); // Exibe a mensagem da API no console
      }
    );
  }

  function loadBestRatedCategories(data = {}) {
    $.get(
      "https://localhost:7081/explore/categoriesranking",
      data,
      function (response) {
        // Verifica se existe a chave "content" na resposta
        if (
          !response.content ||
          !Array.isArray(response.content.bestRatedCategories)
        ) {
          console.error("Unexpected response format:", response);
          return;
        }

        $("#bestRatedCategories tbody").empty(); // Limpa a lista

        // Acessa a lista de mostPlayedBoardGames
        const bestRatedCats = response.content.bestRatedCategories;

        if (bestRatedCats.length > 0) {
          $.each(bestRatedCats, function (index, item) {
            let tr = `
              <tr>              
                <td>${index + 1}</td> 
                <td class="text-start">${item.categoryName}</td>            
                <td class="text-center">${item.avgRating}</td>   
                <td class="text-center">${item.ratingsCount}</td>         
              </tr>
            `;
            $("#bestRatedCategories tbody").append(tr);
          });
        } else {
          $("#bestRatedCategories tbody").append(`
            <tr>
                <td class="No data available"></td>            
                <td class="No data available"></td>            
                <td class="No data available"></td>            
                <td class="No data available"></td>           
            </tr>                  
        `);
        }

        console.log(response.message); // Exibe a mensagem da API no console
      }
    );
  }

  function loadLongestCategories(data = {}) {
    $.get(
      "https://localhost:7081/explore/categoriesranking",
      data,
      function (response) {
        // Verifica se existe a chave "content" na resposta
        if (
          !response.content ||
          !Array.isArray(response.content.longestCategories)
        ) {
          console.error("Unexpected response format:", response);
          return;
        }

        $("#longestCategories tbody").empty(); // Limpa a lista

        // Acessa a lista de mostPlayedBoardGames
        const longestCats = response.content.longestCategories;

        if (longestCats.length > 0) {
          $.each(longestCats, function (index, item) {
            let tr = `
              <tr>              
                <td>${index + 1}</td> 
                <td class="text-start">${item.categoryName}</td>            
                <td class="text-center">${item.duration}</td>   
                <td class="text-center">${item.sessionsCount}</td>         
              </tr>
            `;
            $("#longestCategories tbody").append(tr);
          });
        } else {
          $("#longestCategories tbody").append(`
            <tr>
                <td class="No data available"></td>            
                <td class="No data available"></td>            
                <td class="No data available"></td>            
                <td class="No data available"></td>           
            </tr>                  
        `);
        }

        console.log(response.message); // Exibe a mensagem da API no console
      }
    );
  }

  function loadShortestCategories(data = {}) {
    $.get(
      "https://localhost:7081/explore/categoriesranking",
      data,
      function (response) {
        // Verifica se existe a chave "content" na resposta
        if (
          !response.content ||
          !Array.isArray(response.content.shortestCategories)
        ) {
          console.error("Unexpected response format:", response);
          return;
        }

        $("#shortestCategories tbody").empty(); // Limpa a lista

        // Acessa a lista de mostPlayedBoardGames
        const shortestCats = response.content.shortestCategories;

        if (shortestCats.length > 0) {
          $.each(shortestCats, function (index, item) {
            let tr = `
              <tr>              
                <td>${index + 1}</td> 
                <td class="text-start">${item.categoryName}</td>            
                <td class="text-center">${item.duration}</td>   
                <td class="text-center">${item.sessionsCount}</td>         
              </tr>
            `;
            $("#shortestCategories tbody").append(tr);
          });
        } else {
          $("#shortestCategories tbody").append(`
            <tr>
                <td class="No data available"></td>            
                <td class="No data available"></td>            
                <td class="No data available"></td>            
                <td class="No data available"></td>           
            </tr>                  
        `);
        }

        console.log(response.message); // Exibe a mensagem da API no console
      }
    );
  }

  function loadEvents() {
    $("#displayAllBoardGames").on("click", function (e) {
      e.preventDefault();

      $("#allGamesTable").show();
      $("#searchBGToggler").hide();
      $("#bgRankingListsToggler").hide();
      $("#categoriesRankingsToggler").hide();
    });

    $("#searchBoardGames").on("click", function (e) {
      e.preventDefault();

      $("#allGamesTable").hide();
      $("#searchBGToggler").show();
      $("#bgRankingListsToggler").hide();
      $("#categoriesRankingsToggler").hide();
    });

    $("#displayBoardGamesRankings").on("click", function (e) {
      e.preventDefault();

      $("#allGamesTable").hide();
      $("#searchBGToggler").hide();
      // $("#bgRankingListsToggler").show();
      $("#categoriesRankingsToggler").hide();
    });

    $("#displayCategoriesRankings").on("click", function (e) {
      e.preventDefault();

      $("#allGamesTable").hide();
      $("#searchBGToggler").hide();
      $("#bgRankingListsToggler").hide();
      $("#categoriesRankingsToggler").show();
    });
  }

  function loadRankings() {
    loadAllGames();
    loadMostPlayedGames();
    loadBestRatedGames();
    loadShortestGames();
    loadLongestGames();
    loadAdultsFavoriteGames();
    loadTeensFavoriteGames();
    loadMostPlayedCategories();
    loadMostPopularCategories();
    loadBestRatedCategories();
    loadLongestCategories();
    loadShortestCategories();
  }

  function Build() {
    loadRankings();
    loadEvents();
  }

  Build();

  function filterResults(dataToFilter, paramsToFilter) {
    const searchTerm = paramsToFilter.term || "";
    const regex = new RegExp(searchTerm, "i"); // case-insensitive

    return dataToFilter.filter((item) => {
      return regex.test(item.boarGameName);
    });
  }

  $("#selectGame123").select2({
    ajax: {
      url: "https://localhost:7081/explore/findboardgame",
      data: (params) => {
        return {
          q: params.term,
        };
      },
      processResults: (data, params) => {
        // Filtro manual no frontend
        const filtered = filterResults(data.content, params);

        // Adaptar para o formato que o Select2 entende
        return {
          results: filtered.map((item) => ({
            id: item.boardGameId,
            text: item.boarGameName,
          })),
        };
      },
    },
    templateResult: (data) => data.text,
    templateSelection: (data) => data.text,
    placeholder: "Selecione um jogo",
    minimumInputLength: 1,
  });
});
