const gamesContainer = document.getElementById("games-container");

const checkAuthenticated = async () => {
    try {
        const response = await fetch("/auth-status");
        const data = await response.json();
        return data.isAuthenticated;
    } catch (err) {
        console.error("Error checking auth status:", err);
        return false;
    }
};

document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("delete-btn") ) 
    {
        const isAuthenticated = await checkAuthenticated();
        if (!isAuthenticated) {
            window.location.href = "/login.html";
            return;
        }

        const gameId = event.target.getAttribute("data-id");
        try 
        {
            const response = await fetch(`/deletegame/${gameId}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete game");

            fetchGames(); // Refresh the game list
        } catch (err) 
        {
            console.error("Error deleting game:", err);
        }
    }
});

document.addEventListener("click", async (event) =>{
    if(event.target.classList.contains("add-button")){
        const isAuthenticated = await checkAuthenticated();
        if (!isAuthenticated) {
            window.location.href = "/login.html";
            return;
        }
    }
});

const fetchgames = async ()=>{
    try{
        //fetch data from server
        const response = await fetch("/games");
        if(!response.ok){
            throw new Error("Failed to get details");
        }

        //Parse json
        const games = await response.json();
        console.log(games);
        //Format the data to html
        gamesContainer.innerHTML = "";

        games.forEach((game) => {
            const gameDiv = document.createElement("div");
            gameDiv.className = "games";
            gameDiv.innerHTML = `${game.Name} ${game.Developer} ${game.Designer}<button class="delete-btn" data-id="${game._id}">Delete</button> <a href="updategame.html?id=${game._id}"><button class="update-btn">Update</button></a>`;
            gamesContainer.appendChild(gameDiv);
        });

        document.addEventListener("click", async (event) => {
            if (event.target.classList.contains("update-btn")) {
                const isAuthenticated = await checkAuthenticated();
                if (!isAuthenticated) {
                    event.preventDefault(); // Prevent navigation
                    window.location.href = "/login.html";
                }
            }
        });

    }catch(error){
        console.error("Error: ", error);
        gamesContainer.innerHTML = "<p style='color:red'>Failed to get Games</p>";
    }
    
    
}

fetchgames();