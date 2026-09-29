const WA_NUMBER = "91XXXXXXXXXX";
// EDIT: digits only.
// Example: 919876543210

const SITE_URL = "https://YOUR-USERNAME.github.io/maison-hampers/";
// EDIT after publishing.

const CURRENCY = "₹";


const products = [

  {
    name:"Birthday Celebration Hamper",
    price:1299,
    old:1799,
    desc:"A cheerful mix of treats and keepsakes.",
    img:"https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=700&q=82"
  },

  {
    name:"Anniversary Love Hamper",
    price:1599,
    old:2199,
    desc:"A romantic curation for your favourite person.",
    img:"https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=700&q=82"
  },

  {
    name:"Premium Chocolate Hamper",
    price:1499,
    old:1999,
    desc:"Decadent chocolates wrapped for gifting.",
    img:"https://images.unsplash.com/photo-1575377427642-087cf684f04d?auto=format&fit=crop&w=700&q=82"
  },

  {
    name:"Self-Care Hamper",
    price:1399,
    old:1899,
    desc:"A calming collection for slow, happy moments.",
    img:"https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=700&q=82"
  },

  {
    name:"Luxury Couple Hamper",
    price:2299,
    old:2999,
    desc:"Elegant picks made for two.",
    img:"https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=700&q=82"
  },

  {
    name:"Corporate Gift Hamper",
    price:2499,
    old:3299,
    desc:"Polished gifting for clients and teams.",
    img:"https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=700&q=82"
  },

  {
    name:"Wedding Gift Hamper",
    price:1999,
    old:2799,
    desc:"A sophisticated gift for a beautiful new beginning.",
    img:"https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=82"
  },

  {
    name:"Festival Special Hamper",
    price:1699,
    old:2299,
    desc:"Festive favourites in a celebration-ready box.",
    img:"https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=700&q=82"
  }

];


const packaging = [

  {
    name:"Classic Ribbon Wrap",
    price:0,
    desc:"Elegant satin ribbon + signature card"
  },

  {
    name:"Luxury Rose Box",
    price:199,
    desc:"Premium rigid box + silk ribbon"
  },

  {
    name:"Velvet Gift Finish",
    price:299,
    desc:"Velvet-touch box + premium bow"
  },

  {
    name:"Festive Gold Wrap",
    price:149,
    desc:"Gold accents + celebration card"
  }

];


let cart =
  JSON.parse(localStorage.getItem("maisonCart") || "[]");


let selectedProduct = null;

let selectedPackaging = packaging[0];


function money(n){

  return CURRENCY +
    n.toLocaleString("en-IN");

}


function save(){

  localStorage.setItem(
    "maisonCart",
    JSON.stringify(cart)
  );

  renderCart();

  updateCount();

}


function updateCount(){

  document
    .querySelectorAll(".cart-count")
    .forEach(element => {

      element.textContent =
        cart.reduce(
          (sum,item) => sum + item.qty,
          0
        );

    });

}


function toast(message){

  const element =
    document.querySelector("#toast");

  if(!element) return;

  element.textContent = message;

  element.classList.add("show");

  clearTimeout(window.toastTimer);

  window.toastTimer =
    setTimeout(() => {

      element.classList.remove("show");

    },2800);

}


function productByName(name){

  return products.find(
    product => product.name === name
  );

}


function addToCart(
  name,
  quantity = 1,
  pack = "Classic Ribbon Wrap"
){

  const product =
    productByName(name);

  if(!product) return;

  const packData =
    packaging.find(
      item => item.name === pack
    );

  const packPrice =
    packData ? packData.price : 0;

  const key =
    name + "|" + pack;

  const existing =
    cart.find(item => item.key === key);

  if(existing){

    existing.qty += quantity;

  }else{

    cart.push({

      key,

      name,

      price:product.price,

      img:product.img,

      qty:quantity,

      pack,

      packPrice

    });

  }

  save();

  toast("Added to your gift cart ♡");

}


function renderProducts(){

  const element =
    document.querySelector("#productGrid");

  if(!element) return;


  element.innerHTML =
    products.map((product,index) => {

      const discount =
        Math.round(
          (1 - product.price / product.old) * 100
        );


      return `

        <article class="product reveal">

          <div class="product-img">

            <img
              src="${product.img}"
              alt="${product.name}"
              loading="${index < 4 ? "eager" : "lazy"}"
              width="700"
              height="710">

            <span class="badge">
              ${discount}% OFF
            </span>

          </div>


          <div class="product-body">

            <h3>
              ${product.name}
            </h3>

            <p class="desc">
              ${product.desc}
            </p>


            <div class="price">

              <strong>
                ${money(product.price)}
              </strong>

              <del>
                ${money(product.old)}
              </del>

              <span class="save">
                SAVE ${discount}%
              </span>

            </div>


            <div class="product-actions">

              <button
                class="btn light details"
                data-name="${product.name}">
                View Details
              </button>

              <button
                class="btn primary add"
                data-name="${product.name}">
                Add to Cart
              </button>

            </div>

          </div>

        </article>

      `;

    })
    .join("");


  observe();

}


function renderCart(){

  const element =
    document.querySelector("#cartItems");

  const subtotal =
    document.querySelector("#cartSubtotal");

  const total =
    document.querySelector("#cartTotal");


  if(!element) return;


  if(!cart.length){

    element.innerHTML = `

      <div class="cart-empty">

        Your gift cart is waiting
        for something beautiful. ♡

        <br><br>

        <a
          class="btn light"
          href="shop.html"
          onclick="closeCart()">
          Explore Hampers
        </a>

      </div>

    `;

  }else{

    element.innerHTML =
      cart.map((item,index) => `

        <div class="cart-item">

          <img
            src="${item.img}"
            alt="${item.name}">

          <div>

            <h3>
              ${item.name}
            </h3>

            <small>
              ${item.pack}
              ${
                item.packPrice
                ? ` · +${money(item.packPrice)}`
                : ""
              }
            </small>


            <div class="qty">

              <button
                data-dec="${index}">
                −
              </button>

              <b>
                ${item.qty}
              </b>

              <button
                data-inc="${index}">
                +
              </button>

            </div>

          </div>


          <b>
            ${money(
              (item.price + item.packPrice) *
              item.qty
            )}
          </b>

        </div>

      `)
      .join("");

  }


  const sum =
    cart.reduce(
      (amount,item) =>
        amount +
        (item.price + item.packPrice) *
        item.qty,
      0
    );


  if(subtotal)
    subtotal.textContent =
      money(sum);


  if(total)
    total.textContent =
      money(sum);

}


function openCart(){

  document
    .querySelector("#cartDrawer")
    ?.classList.add("open");

  document
    .querySelector("#overlay")
    ?.classList.add("show");

  renderCart();

}


function closeCart(){

  document
    .querySelector("#cartDrawer")
    ?.classList.remove("open");

  document
    .querySelector("#overlay")
    ?.classList.remove("show");

}


function openDetails(name){

  selectedProduct =
    productByName(name);

  selectedPackaging =
    packaging[0];


  const modal =
    document.querySelector("#productModal");

  if(!modal || !selectedProduct)
    return;


  modal.querySelector("#modalImg").src =
    selectedProduct.img;

  modal.querySelector("#modalImg").alt =
    selectedProduct.name;

  modal.querySelector("#modalName").textContent =
    selectedProduct.name;

  modal.querySelector("#modalDesc").textContent =
    selectedProduct.desc;

  modal.querySelector("#modalPrice").textContent =
    money(selectedProduct.price);


  modal.querySelector("#packOptions").innerHTML =
    packaging.map((pack,index) => `

      <button
        class="option ${index === 0 ? "selected" : ""}"
        data-pack="${pack.name}">

        ${pack.name}

        ${
          pack.price
          ? ` +${money(pack.price)}`
          : " · Included"
        }

      </button>

    `)
    .join("");


  modal.classList.add("show");

}


function closeModal(){

  document
    .querySelector("#productModal")
    ?.classList.remove("show");

}


function whatsapp(){

  if(
    WA_NUMBER.includes("X")
  ){

    toast(
      "Replace WA_NUMBER in script.js first."
    );

    return;

  }


  if(!cart.length){

    toast(
      "Your cart is empty."
    );

    return;

  }


  const lines =
    cart.map(item =>
      `• ${item.name} × ${item.qty} — ${item.pack}`
    )
    .join("\n");


  const total =
    cart.reduce(
      (amount,item) =>
        amount +
        (item.price + item.packPrice) *
        item.qty,
      0
    );


  const text =

`Hello Maison Hampers!

I'd like to order:

${lines}

Total: ${money(total)}

Please confirm availability and delivery.`;


  window.open(

    `https://wa.me/${WA_NUMBER}?text=${
      encodeURIComponent(text)
    }`,

    "_blank"

  );

}


function startOfferCountdown(){

  const nodes =
    document.querySelectorAll(
      "[data-countdown]"
    );

  if(!nodes.length)
    return;


  let end =
    localStorage.getItem(
      "maisonOfferEnd"
    );


  if(
    !end ||
    Number(end) <= Date.now()
  ){

    end =
      Date.now() +
      72 * 60 * 60 * 1000;

    localStorage.setItem(
      "maisonOfferEnd",
      String(end)
    );

  }


  const tick = () => {

    let milliseconds =
      Math.max(
        0,
        Number(end) - Date.now()
      );


    let total =
      Math.floor(
        milliseconds / 1000
      );


    const days =
      Math.floor(total / 86400);

    total %= 86400;


    const hours =
      Math.floor(total / 3600);

    total %= 3600;


    const minutes =
      Math.floor(total / 60);


    const seconds =
      total % 60;


    nodes.forEach(node => {

      const values =
        node.querySelectorAll(
          "[data-unit]"
        );


      const map = {

        days,

        hours,

        minutes,

        seconds

      };


      values.forEach(value => {

        value.textContent =
          String(
            map[value.dataset.unit] ?? 0
          ).padStart(2,"0");

      });

    });

  };


  tick();

  setInterval(
    tick,
    1000
  );

}


function setupSearchAndFilters(){

  const input =
    document.querySelector(
      "#productSearch"
    );

  const sort =
    document.querySelector(
      "#productSort"
    );

  const grid =
    document.querySelector(
      "#productGrid"
    );


  if(
    !grid ||
    (!input && !sort)
  )
    return;


  const draw = () => {

    let list =
      [...products];


    const query =
      (
        input?.value || ""
      )
      .trim()
      .toLowerCase();


    if(query){

      list =
        list.filter(product =>
          (
            product.name +
            " " +
            product.desc
          )
          .toLowerCase()
          .includes(query)
        );

    }


    if(
      sort?.value === "low"
    ){

      list.sort(
        (a,b) =>
          a.price - b.price
      );

    }


    if(
      sort?.value === "high"
    ){

      list.sort(
        (a,b) =>
          b.price - a.price
      );

    }


    if(!list.length){

      grid.innerHTML = `

        <div class="empty-results">

          <h3>
            No hampers found
          </h3>

          <p>
            Try another search.
          </p>

        </div>

      `;

      return;

    }


    grid.innerHTML =
      list.map((product,index) => {

        const discount =
          Math.round(
            (1 - product.price / product.old) *
            100
          );


        return `

          <article class="product reveal">

            <div class="product-img">

              <img
                src="${product.img}"
                alt="${product.name}"
                loading="lazy"
                width="700"
                height="710">

              <span class="badge">
                ${discount}% OFF
              </span>

            </div>


            <div class="product-body">

              <h3>
                ${product.name}
              </h3>

              <p class="desc">
                ${product.desc}
              </p>


              <div class="price">

                <strong>
                  ${money(product.price)}
                </strong>

                <del>
                  ${money(product.old)}
                </del>

                <span class="save">
                  SAVE ${discount}%
                </span>

              </div>


              <div class="product-actions">

                <button
                  class="btn light details"
                  data-name="${product.name}">
                  View Details
                </button>

                <button
                  class="btn primary add"
                  data-name="${product.name}">
                  Add to Cart
                </button>

              </div>

            </div>

          </article>

        `;

      })
      .join("");


    observe();

  };


  input?.addEventListener(
    "input",
    draw
  );


  sort?.addEventListener(
    "change",
    draw
  );

}


function setupOrderForm(){

  const form =
    document.querySelector(
      "#orderForm"
    );


  if(!form)
    return;


  form.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      if(!form.checkValidity()){

        form.reportValidity();

        return;

      }


      const formData =
        new FormData(form);


      const items =
        cart.length
        ? cart
            .map(
              item =>
                `${item.name} × ${item.qty} (${item.pack})`
            )
            .join(", ")
        : "No cart items selected";


      const message = [

        "Hello Maison Hampers!",

        "",

        "I want to place an order.",

        `Name: ${formData.get("name")}`,

        `Mobile: ${formData.get("phone")}`,

        `Email: ${
          formData.get("email") ||
          "Not provided"
        }`,

        `Hamper: ${formData.get("hamper")}`,

        `Quantity: ${formData.get("quantity")}`,

        `City: ${formData.get("city")}`,

        `Address: ${formData.get("address")}`,

        `Gift Message: ${
          formData.get("message") ||
          "None"
        }`,

        `Cart: ${items}`

      ].join("\n");


      if(
        WA_NUMBER.includes("X")
      ){

        toast(
          "Replace WA_NUMBER in script.js first."
        );

        return;

      }


      window.open(

        `https://wa.me/${WA_NUMBER}?text=${
          encodeURIComponent(message)
        }`,

        "_blank"

      );

    }

  );

}


function observe(){

  const observer =
    new IntersectionObserver(

      entries => {

        entries.forEach(entry => {

          if(
            entry.isIntersecting
          ){

            entry.target.classList.add(
              "visible"
            );

          }

        });

      },

      {
        threshold:.08
      }

    );


  document
    .querySelectorAll(
      ".reveal:not(.visible)"
    )
    .forEach(element =>
      observer.observe(element)
    );

}


function setup(){

  const menu =
    document.querySelector(
      "#menuBtn"
    );

  const nav =
    document.querySelector(
      "#mobileNav"
    );


  menu?.addEventListener(
    "click",
    () => {

      const open =
        nav.classList.toggle(
          "open"
        );

      menu.setAttribute(
        "aria-expanded",
        open
      );

    }
  );


  document
    .querySelectorAll(
      "#mobileNav a"
    )
    .forEach(link => {

      link.addEventListener(
        "click",
        () =>
          nav.classList.remove(
            "open"
          )
      );

    });


  document
    .querySelectorAll(
      ".cart-open"
    )
    .forEach(button =>
      button.addEventListener(
        "click",
        openCart
      )
    );


  document
    .querySelectorAll(
      ".cart-close"
    )
    .forEach(button =>
      button.addEventListener(
        "click",
        closeCart
      )
    );


  document
    .querySelector("#overlay")
    ?.addEventListener(
      "click",
      closeCart
    );


  document.addEventListener(
    "click",
    event => {

      const add =
        event.target.closest(
          ".add"
        );

      const details =
        event.target.closest(
          ".details"
        );

      const increase =
        event.target.closest(
          "[data-inc]"
        );

      const decrease =
        event.target.closest(
          "[data-dec]"
        );

      const pack =
        event.target.closest(
          "[data-pack]"
        );


      if(add){

        addToCart(
          add.dataset.name
        );

      }


      if(details){

        openDetails(
          details.dataset.name
        );

      }


      if(increase){

        cart[
          increase.dataset.inc
        ].qty++;

        save();

      }


      if(decrease){

        const item =
          cart[
            decrease.dataset.dec
          ];


        item.qty--;


        if(item.qty < 1){

          cart.splice(
            decrease.dataset.dec,
            1
          );

        }


        save();

      }


      if(pack){

        selectedPackaging =
          packaging.find(
            item =>
              item.name ===
              pack.dataset.pack
          );


        document
          .querySelectorAll(
            "[data-pack]"
          )
          .forEach(element =>
            element.classList.remove(
              "selected"
            )
          );


        pack.classList.add(
          "selected"
        );

      }

    }
  );


  document
    .querySelector(
      "#modalClose"
    )
    ?.addEventListener(
      "click",
      closeModal
    );


  document
    .querySelector(
      "#modalAdd"
    )
    ?.addEventListener(
      "click",
      () => {

        if(selectedProduct){

          addToCart(
            selectedProduct.name,
            1,
            selectedPackaging.name
          );

          closeModal();

        }

      }
    );


  document
    .querySelector(
      "#whatsappCart"
    )
    ?.addEventListener(
      "click",
      whatsapp
    );


  document
    .querySelector(
      "#stickyWA"
    )
    ?.addEventListener(
      "click",
      whatsapp
    );


  renderProducts();

  renderCart();

  updateCount();

  observe();

  startOfferCountdown();

  setupSearchAndFilters();

  setupOrderForm();

}


document.addEventListener(
  "DOMContentLoaded",
  setup
);
