document.getElementById("logoClick").addEventListener("click", function () {
    window.location.href = "/index.html"
});

document.getElementById("navUser").addEventListener("click", function () {
    window.location.href = "/signin.html"
});

document.getElementById("navWishlist").addEventListener("click", function () {
    window.location.href = "/wishlist.html";
});

document.getElementById("navcart-menu").addEventListener("click", function () {
    window.location.href = "/cart.html";
});

let container = document.getElementById("container");
let bg_image = document.getElementById("bg-image");
let club = document.getElementById("club");
let email = document.getElementById("email");
let womenswear = document.getElementById("womenswear");
let menswear = document.getElementById("menswear");
let notification = document.getElementById("notification");
let clubbtn = document.getElementById("clubbtn");
let users;
async function fetchUsers() {
    try {
        let response = await fetch(`https://stride-sport-default-rtdb.firebaseio.com/users.json`);
        let result = await response.json();
        users = [...result];
    } catch (error) {
        console.error(error.message);
    }
}
clubbtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    let exists = false, index, joined;
    users.forEach((user, i) => {
        if (user.email === email.value) {
            index = i;
            exists = true;
            joined = user.club;
        }
    });
    if (!exists) {
        alert("User Not Found.\nPlease Register.");
        email.value = "";
        return;
    }
    else if (!joined && JSON.parse(localStorage.getItem("user")).email === email.value) {
        let payload = {
            club: true,
            notification: notification.checked
        };
        fetch(`https://stride-sport-default-rtdb.firebaseio.com/users/${index}.json`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload),
            redirect: "follow"
        })
            .then((response) => response.json())
            .then((result) => {
                alert("Successfully Joined The Club");
                let user = users[index];
                user.club = true;
                user.notification = notification.checked;
                localStorage.setItem("user", JSON.stringify(user));
                fetchUsers();
                email.value = "";
                window.location.href = "/index.html"
            })
            .catch((error) => console.error(error));
    }
    else if (JSON.parse(localStorage.getItem("user")).email === email.value) {
        let payload = {
            notification: notification.checked
        };
        fetch(`https://stride-sport-default-rtdb.firebaseio.com/users/${index}.json`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload),
            redirect: "follow"
        })
            .then((response) => response.json())
            .then((result) => {
                alert("User Already Joined The Club");
                let user = users[index];
                user.notification = notification.checked;
                localStorage.setItem("user", JSON.stringify(user));
                fetchUsers();
                email.value = "";
                window.location.href = "/index.html"
            })
            .catch((error) => console.error(error));
    }
    else {
        alert("Please Enter The Given Email Address");
        email.value = "";
        return;
    }
});
fetchUsers();
setInterval(() => {
    fetchUsers();
}, 5000);

//hoverlist
document.addEventListener("DOMContentLoaded", function () {
    const womenMenu = document.getElementById("women-menu");
    const womenDropdown = document.getElementById("women");
    //men
    const menMenu = document.getElementById("men-menu");
    const menDropdown = document.getElementById("men");
    //kids
    const kidsMenu = document.getElementById("kids-menu");
    const kidsDropdown = document.getElementById("kids");
    // classics
    const classicsMenu = document.getElementById("classics-menu");
    const classicsDropdown = document.getElementById("classics");
    // sport
    const sportMenu = document.getElementById("sport-menu");
    const sportDropdown = document.getElementById("sports");
    // navCart
    const navCartMenu = document.getElementById("navcart-menu");
    const navCartDropdown = document.getElementById("navcart");

    let timeout;

    womenMenu.addEventListener("mouseover", function () {
        clearTimeout(timeout);
        womenDropdown.style.display = "flex";
    });

    womenMenu.addEventListener("mouseleave", function () {
        timeout = setTimeout(() => {
            womenDropdown.style.display = "none";
        }, 50);
    });

    womenDropdown.addEventListener("mouseover", function () {
        clearTimeout(timeout);
        womenDropdown.style.display = "flex";
    });

    womenDropdown.addEventListener("mouseleave", function () {
        timeout = setTimeout(() => {
            womenDropdown.style.display = "none";
        }, 50);
    });

    // men
    menMenu.addEventListener("mouseover", function () {
        clearTimeout(timeout);
        menDropdown.style.display = "flex";
    });

    menMenu.addEventListener("mouseleave", function () {
        timeout = setTimeout(() => {
            menDropdown.style.display = "none";
        }, 50);
    });

    menDropdown.addEventListener("mouseover", function () {
        clearTimeout(timeout);
        menDropdown.style.display = "flex";
    });

    menDropdown.addEventListener("mouseleave", function () {
        timeout = setTimeout(() => {
            menDropdown.style.display = "none";
        }, 50);
    });

    // kids
    kidsMenu.addEventListener("mouseover", function () {
        clearTimeout(timeout);
        kidsDropdown.style.display = "flex";
    });

    kidsMenu.addEventListener("mouseleave", function () {
        timeout = setTimeout(() => {
            kidsDropdown.style.display = "none";
        }, 50);
    });

    kidsDropdown.addEventListener("mouseover", function () {
        clearTimeout(timeout);
        kidsDropdown.style.display = "flex";
    });

    kidsDropdown.addEventListener("mouseleave", function () {
        timeout = setTimeout(() => {
            kidsDropdown.style.display = "none";
        }, 50);
    });

    // classics
    classicsMenu.addEventListener("mouseover", function () {
        clearTimeout(timeout);
        classicsDropdown.style.display = "grid";
    });

    classicsMenu.addEventListener("mouseleave", function () {
        timeout = setTimeout(() => {
            classicsDropdown.style.display = "none";
        }, 50);
    });

    classicsDropdown.addEventListener("mouseover", function () {
        clearTimeout(timeout);
        classicsDropdown.style.display = "grid";
    });

    classicsDropdown.addEventListener("mouseleave", function () {
        timeout = setTimeout(() => {
            classicsDropdown.style.display = "none";
        }, 50);
    });

    // sport
    sportMenu.addEventListener("mouseover", function () {
        clearTimeout(timeout);
        sportDropdown.style.display = "flex";
    });

    sportMenu.addEventListener("mouseleave", function () {
        timeout = setTimeout(() => {
            sportDropdown.style.display = "none";
        }, 50);
    });

    sportDropdown.addEventListener("mouseover", function () {
        clearTimeout(timeout);
        sportDropdown.style.display = "flex";
    });

    sportDropdown.addEventListener("mouseleave", function () {
        timeout = setTimeout(() => {
            sportDropdown.style.display = "none";
        }, 50);
    });

    // navCart
    navCartMenu.addEventListener("mouseover", function () {
        clearTimeout(timeout);
        navCartDropdown.style.display = "block";
    });

    navCartMenu.addEventListener("mouseleave", function () {
        timeout = setTimeout(() => {
            navCartDropdown.style.display = "none";
        }, 50);
    });

    navCartDropdown.addEventListener("mouseover", function () {
        clearTimeout(timeout);
    });

    navCartDropdown.addEventListener("mouseleave", function () {
        timeout = setTimeout(() => {
            navCartDropdown.style.display = "none";
        }, 50);
    });
});


