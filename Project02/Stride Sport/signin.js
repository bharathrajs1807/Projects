document.getElementById("logoClick").addEventListener("click", function(){
    window.location.href = "/index.html"
});

document.getElementById("navWishlist").addEventListener("click", function(){
    window.location.href = "/wishlist.html";
});

document.getElementById("navcart-menu").addEventListener("click", function(){
    window.location.href = "/cart.html";
});

let container = document.getElementById("container");
let signin = document.getElementById("signin");
let email1 = document.getElementById("email1");
let password1 = document.getElementById("password1");
let signinbtn = document.getElementById("signinbtn");
let email = document.getElementById("email");
let newpasswordlink = document.getElementById("newpasswordlink");
let changepassword = document.getElementById("changepassword");
let newpassword = document.getElementById("newpassword");
let changepasswordbtn = document.getElementById("changepasswordbtn");
let register = document.getElementById("register");
let fname = document.getElementById("fname");
let lname = document.getElementById("lname")
let email2 = document.getElementById("email2");
let password2 = document.getElementById("password2");
let notification = document.getElementById("notification");
let registerbtn = document.getElementById("registerbtn");
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
signinbtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    let exists = false;
    users.forEach((user) => {
        if(user.email===email1.value){
            exists = true;
        }
    });
    if(!exists){
        alert("User Not Found.\nPlease Register.");
        email1.value = "";
        password1.value = "";
        email.value = "";
        newpassword.value = "";
        fname.value = "";
        lname.value = "";
        email2.value = "";
        password2.value = "";
        return;
    }
    else{
        let match = false;
        users.forEach((user) => {
            if(user.email===email1.value && user.password===password1.value){
                match = true;
                localStorage.setItem("user", JSON.stringify(user));
            }
        });
        if(!match){
            alert("Incorrect Password.\nPlease Try Again.");
            email1.value = "";
            password1.value = "";
            email.value = "";
            newpassword.value = "";
            fname.value = "";
            lname.value = "";
            email2.value = "";
            password2.value = "";
            return;
        }
        else{
            email1.value = "";
            password1.value = "";
            newpassword.value = "";
            fname.value = "";
            lname.value = "";
            email2.value = "";
            password2.value = "";
            window.location.href = "/index.html";
        }
    }
});
registerbtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    let exists = false;
    users.forEach((user) => {
        if(user.email===email2.value){
            exists = true;
        }
    });
    if(exists){
        alert("User Already Exists.\nPlease Sign In.");
        email1.value = "";
        password1.value = "";
        email.value = "";
        newpassword.value = "";
        fname.value = "";
        lname.value = "";
        email2.value = "";
        password2.value = "";
        return;
    }
    else{
        let payload = {
            fname: fname.value,
            lname: lname.value,
            email: email2.value,
            password: password2.value,
            wishlist: [],
            cart: [],
            club: false,
            notification: notification.checked
        };
        let index = users.length;
        fetch(`https://stride-sport-default-rtdb.firebaseio.com/users/${index}.json`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload),
            redirect: "follow"
        })
        .then((response) => response.json())
        .then((result) => {
            alert("User Successfully Registered");
            let user = {...result};
            fetchUsers();
            localStorage.setItem("user", JSON.stringify(user));
            email1.value = "";
            password1.value = "";
            email.value = "";
            newpassword.value = "";
            fname.value = "";
            lname.value = "";
            email2.value = "";
            password2.value = "";
            window.location.href = "/index.html";
        })
        .catch((error) => console.error(error));
    }
});
newpasswordlink.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    changepassword.setAttribute("class", "visible");
});
changepasswordbtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    let exists = false, index;
    users.forEach((user, i) => {
        if(user.email===email.value){
            exists = true;
            index = i;
        }
    });
    if(!exists){
        alert("User Not Found.\nPlease Register.");
        email1.value = "";
        password1.value = "";
        email.value = "";
        newpassword.value = "";
        fname.value = "";
        lname.value = "";
        email2.value = "";
        password2.value = "";
        return;
    }
    else{
        let payload = {
            password: newpassword.value
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
            alert("Password Successfully Changed");
            fetchUsers();
            let user = users[index];
            user.password = newpassword.value;
            localStorage.setItem("user", JSON.stringify(user));
            email1.value = "";
            password1.value = "";
            email.value = "";
            newpassword.value = "";
            fname.value = "";
            lname.value = "";
            email2.value = "";
            password2.value = "";
            changepassword.setAttribute("class", "hidden");
            window.location.href = "/index.html";
        })
        .catch((error) => console.error(error));
    }
});
fetchUsers();

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
