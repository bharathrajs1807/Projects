document.getElementById("navUser").addEventListener("click", function () {
    window.location.href = "/signin.html"
});

document.getElementById("logoClick").addEventListener("click", function () {
    window.location.href = "/index.html"
});

document.getElementById("joinClick").addEventListener("click", function () {
    window.location.href = "/club.html"
});

document.getElementById("discover").addEventListener("click", function () {
    window.location.href = "/products.html"
});
document.querySelector(".discover1").addEventListener("click", function () {
    window.location.href = "/products.html"
});

document.querySelector(".discover2").addEventListener("click", function () {
    window.location.href = "/products.html"
});

document.getElementById("joinBtn").addEventListener("click", function () {
    window.location.href = "/club.html"
});

document.getElementById("navWishlist").addEventListener("click", function () {
    window.location.href = "/wishlist.html";
});
document.getElementById("navcart-menu").addEventListener("click", function () {
    window.location.href = "/cart.html";
});

// Dynamic Products

let products1 = document.querySelector(".products1");
let products2 = document.querySelector(".products2");
let products3 = document.querySelector(".products3");

let arr = [];
async function allProductsData() {
    let res = await fetch(`https://stride-sport-default-rtdb.firebaseio.com/products.json`);
    let resp = await res.json();
    arr = Object.entries(resp).slice(0, 4);
    displayProducts(arr);
    displayProducts2(Object.entries(resp).slice(35, 39));
    displayProducts3(Object.entries(resp).slice(72, 76));
}
allProductsData();

function displayProducts(arr) {
    arr.forEach(([id, product]) => {
        let card = document.createElement("div");
        card.onclick = function () {
            window.location.href = `productDetails.html?userId=${id}`;
        }
        card.classList = "product1";
        card.innerHTML = `
             <span class="favorite1">♡</span>
            <img id="img" src="${product.image}" alt="${product.title}">
            <p class="price1">£${product.price}</p>
            <h4 class="name1">${product.title}</h4>
            <p class="category2">${product.gender}'s ${product.category}</p>
    `;
        products1.appendChild(card);
        products1.appendChild(card);
    });
}

function displayProducts2(arr) {
    arr.forEach(([id, product]) => {
        let card = document.createElement("div");
        card.onclick = function () {
            window.location.href = `productDetails.html?userId=${id}`;
        }
        card.classList = "product1";
        card.innerHTML = `
             <span class="favorite1">♡</span>
            <img id="img" src="${product.image}" alt="${product.title}">
            <p class="price1">£${product.price}</p>
            <h4 class="name1">${product.title}</h4>
            <p class="category2">${product.gender}'s ${product.category}</p>
    `;
        products2.appendChild(card);
    });
}

function displayProducts3(arr) {
    arr.forEach(([id, product]) => {
        let card = document.createElement("div");
        card.onclick = function () {
            window.location.href = `productDetails.html?userId=${id}`;
        }
        card.classList = "product1";
        card.innerHTML = `
             <span class="favorite1">♡</span>
            <img id="img" src="${product.image}" alt="${product.title}">
            <p class="price1">£${product.price}</p>
            <h4 class="name1">${product.title}</h4>
            <p class="category2">${product.gender}'s ${product.category}</p>
    `;
        products3.appendChild(card);
    });
}

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
