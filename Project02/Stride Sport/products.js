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

async function addToCart(id) {
    try {
        // Fetch product details from Firebase
        let res = await fetch(`https://stride-sport-default-rtdb.firebaseio.com/products/${id}.json`);
        let product = await res.json();

        if (!product) {
            console.error("Product not found!");
            return;
        }

        product.quantity = 1; // Set default quantity

        // Fetch existing cart
        let cartRes = await fetch(`https://stride-sport-default-rtdb.firebaseio.com/users/${id}cart.json`);
        let cartData = await cartRes.json();
        let cart = cartData ? Object.values(cartData) : []; // Convert to array if not empty

        // Check if product already exists in cart
        let exists = cart.some((item) => item.id === id);

        if (exists) {
            alert("Item Already Added To Cart.");
        } else {
            cart.push(product); // Add new product to cart

            // Update Firebase with the updated cart
            await fetch(`https://stride-sport-default-rtdb.firebaseio.com/users/${id}cart.json`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cart),
            });

            alert("Item Added To Cart.");
        }

        fetchCartData(); // Refresh the cart display
    } catch (error) {
        console.error("Error adding to cart:", error);
    }
}

let container = document.getElementById("container");
let mainContainer = document.getElementById("mainContainer");

let arr = [];
async function allProductsData() {
    let res = await fetch(`https://stride-sport-default-rtdb.firebaseio.com/products.json`);
    let resp = await res.json();
    arr = Object.entries(resp)
    displayProducts(arr);
}
allProductsData();

let currentPage = 1;
let itemsPerPage = 20;
function displayProducts(arr) {

    let PaginatedUsers = document.getElementById("paginatedUser");
    container.innerHTML = "";
    PaginatedUsers.innerHTML = "";
    mainContainer.innerHTML = "";

    let heading = document.createElement("div")
    heading.classList = "heading";
    heading.innerHTML = `
        <h1>STRIDE SPECIAL</h1>
        <p>[${arr.length}]</p>
    `;
    mainContainer.appendChild(heading);

    let start = (currentPage - 1) * itemsPerPage;
    let end = start + itemsPerPage;

    let paginatedArr = arr.slice(start, end);

    let totalPages = Math.ceil(arr.length / itemsPerPage);

    let prevBtn = document.createElement("button");
    prevBtn.classList = "fa-solid fa-arrow-left prevbtn";
    prevBtn.onclick = function () {
        if (currentPage > 1) currentPage--;
        else alert("You Are On 1st Page")
        displayProducts(arr);
    }
    PaginatedUsers.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        let pageNum = document.createElement("button");
        pageNum.classList = "pagebtn";
        pageNum.innerText = i;
        pageNum.onclick = function () {
            currentPage = i;
            displayProducts(arr);
        }
        if (currentPage == i) {
            pageNum.classList = "currentPage"
        }
        PaginatedUsers.appendChild(pageNum);
    }

    let nextBtn = document.createElement("button");
    nextBtn.classList = "fa-solid fa-arrow-right nextbtn";
    nextBtn.onclick = function () {
        if (currentPage < totalPages) currentPage++;
        else alert("You Are On Last Page")
        displayProducts(arr);
    }
    PaginatedUsers.appendChild(nextBtn);

    paginatedArr.forEach(([id, product]) => {
        let card = document.createElement("div");
        card.onclick = function () {
            window.location.href = `productDetails.html?userId=${id}`;
        }
        card.classList = "card";
        card.innerHTML = `
             <span class="favorite">♡</span>
            <img id="img" src="${product.image}" alt="${product.title}">
            <p class="price">£${product.price}</p>
            <h4 class="name">${product.title}</h4>
            <p class="category">${product.gender}'s ${product.category}</p>
    `;
        container.appendChild(card);
    });
}


inpSearch.addEventListener("input", searchUser);
function searchUser() {
    let inp = inpSearch.value;
    let filteredSearch = arr.filter(([id, user]) => user.title.toLowerCase().includes(inp.toLowerCase()));
    container.innerHTML = "";
    displayProducts(filteredSearch);
}
searchUser();

let categorySelect = document.getElementById("categorySelect");
categorySelect.addEventListener("change", filterfun);
function filterfun() {
    let inp = categorySelect.value;
    switch (inp) {
        case "men":
            let filteredArr1 = arr.filter(([id, user]) => user.gender == "MEN" || user.gender == "men");
            container.innerHTML = "";
            categorySelect.value = "";
            displayProducts(filteredArr1);
            break;
        case "women":
            let filteredArr2 = arr.filter(([id, user]) => user.gender == "WOMEN" || user.gender == "women");
            container.innerHTML = "";
            categorySelect.value = "";

            displayProducts(filteredArr2);
            break;
        case "kids":
            let filteredArr3 = arr.filter(([id, user]) => user.gender == "KIDS" || user.gender == "kids");
            container.innerHTML = "";
            categorySelect.value = "";
            displayProducts(filteredArr3);
            break;
        default:
            break;
    }
}

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


