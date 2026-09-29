
const WA_NUMBER="91XXXXXXXXXX"; // EDIT: digits only, e.g. 919876543210
const products=[
{name:"Birthday Celebration Hamper",price:1299,old:1799,desc:"A cheerful mix of treats and keepsakes.",img:"https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=700&q=82"},
{name:"Anniversary Love Hamper",price:1599,old:2199,desc:"A romantic curation for your favourite person.",img:"https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=700&q=82"},
{name:"Premium Chocolate Hamper",price:1499,old:1999,desc:"Decadent chocolates wrapped for gifting.",img:"https://images.unsplash.com/photo-1575377427642-087cf684f04d?auto=format&fit=crop&w=700&q=82"},
{name:"Self-Care Hamper",price:1399,old:1899,desc:"A calming collection for slow, happy moments.",img:"https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=700&q=82"},
{name:"Luxury Couple Hamper",price:2299,old:2999,desc:"Elegant picks made for two.",img:"https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=700&q=82"},
{name:"Corporate Gift Hamper",price:2499,old:3299,desc:"Polished gifting for clients and teams.",img:"https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=700&q=82"},
{name:"Wedding Gift Hamper",price:1999,old:2799,desc:"A sophisticated gift for a beautiful new beginning.",img:"https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=82"},
{name:"Festival Special Hamper",price:1699,old:2299,desc:"Festive favourites in a celebration-ready box.",img:"https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=700&q=82"}
];
const packaging=[
{name:"Classic Ribbon Wrap",price:0,desc:"Elegant satin ribbon + signature card"},
{name:"Luxury Rose Box",price:199,desc:"Premium rigid box + silk ribbon"},
{name:"Velvet Gift Finish",price:299,desc:"Velvet-touch box + premium bow"},
{name:"Festive Gold Wrap",price:149,desc:"Gold accents + celebration card"}
];
let cart=JSON.parse(localStorage.getItem("maisonCart")||"[]");
let selectedProduct=null, selectedPackaging=packaging[0];

function money(n){return "₹"+n.toLocaleString("en-IN")}
function save(){localStorage.setItem("maisonCart",JSON.stringify(cart));renderCart();updateCount()}
function updateCount(){document.querySelectorAll(".cart-count").forEach(x=>x.textContent=cart.reduce((s,i)=>s+i.qty,0))}
function toast(m){let t=document.querySelector("#toast");if(!t)return;t.textContent=m;t.classList.add("show");clearTimeout(window.tt);window.tt=setTimeout(()=>t.classList.remove("show"),2800)}
function productByName(n){return products.find(p=>p.name===n)}
function addToCart(name,qty=1,pack="Classic Ribbon Wrap"){let p=productByName(name);let key=name+"|"+pack;let x=cart.find(i=>i.key===key);if(x)x.qty+=qty;else cart.push({key,name,price:p.price,img:p.img,qty,pack,packPrice:packaging.find(x=>x.name===pack)?.price||0});save();toast("Added to your gift cart ♡")}
function renderProducts(target="#productGrid"){
 const el=document.querySelector(target);if(!el)return;
 el.innerHTML=products.map((p,i)=>{let d=Math.round((1-p.price/p.old)*100);return `<article class="product reveal"><div class="product-img"><img src="${p.img}" alt="${p.name}" loading="${i<4?"eager":"lazy"}" width="700" height="710"><span class="badge">${d}% OFF</span></div><div class="product-body"><h3>${p.name}</h3><p class="desc">${p.desc}</p><div class="price"><strong>${money(p.price)}</strong><del>${money(p.old)}</del><span class="save">SAVE ${d}%</span></div><div class="product-actions"><button class="btn light details" data-name="${p.name}">View Details</button><button class="btn primary add" data-name="${p.name}">Add to Cart</button></div></div></article>`}).join("");
 observe();
}
function renderCart(){
 const el=document.querySelector("#cartItems"), sub=document.querySelector("#cartSubtotal"), total=document.querySelector("#cartTotal");if(!el)return;
 if(!cart.length)el.innerHTML='<div class="cart-empty">Your gift cart is waiting for something beautiful. ♡<br><br><a class="btn light" href="shop.html" onclick="closeCart()">Explore Hampers</a></div>';
 else el.innerHTML=cart.map((i,idx)=>`<div class="cart-item"><img src="${i.img}" alt=""><div><h3>${i.name}</h3><small>${i.pack}${i.packPrice?` · +${money(i.packPrice)}`:""}</small><div class="qty"><button data-dec="${idx}">−</button><b>${i.qty}</b><button data-inc="${idx}">+</button></div></div><b>${money((i.price+i.packPrice)*i.qty)}</b></div>`).join("");
 let s=cart.reduce((a,i)=>a+(i.price+i.packPrice)*i.qty,0);if(sub)sub.textContent=money(s);if(total)total.textContent=money(s);
}
function openCart(){document.querySelector("#cartDrawer")?.classList.add("open");document.querySelector("#overlay")?.classList.add("show");renderCart()}
function closeCart(){document.querySelector("#cartDrawer")?.classList.remove("open");document.querySelector("#overlay")?.classList.remove("show")}
function openDetails(name){
 selectedProduct=productByName(name);selectedPackaging=packaging[0];
 let m=document.querySelector("#productModal");if(!m)return;
 m.querySelector("#modalImg").src=selectedProduct.img;m.querySelector("#modalName").textContent=selectedProduct.name;m.querySelector("#modalDesc").textContent=selectedProduct.desc;
 m.querySelector("#modalPrice").textContent=money(selectedProduct.price);
 m.querySelector("#packOptions").innerHTML=packaging.map((p,i)=>`<button class="option ${i===0?"selected":""}" data-pack="${p.name}">${p.name}${p.price?` +${money(p.price)}`:" · Included"}</button>`).join("");
 m.classList.add("show");
}
function closeModal(){document.querySelector("#productModal")?.classList.remove("show")}
function whatsapp(){
 if(WA_NUMBER.includes("X"))return toast("Replace WA_NUMBER in script.js first.");
 let lines=cart.map(i=>`• ${i.name} × ${i.qty} — ${i.pack}`).join("%0A");
 let total=cart.reduce((a,i)=>a+(i.price+i.packPrice)*i.qty,0);
 let text=`Hello Maison Hampers!%0A%0AI'd like to order:%0A${lines}%0A%0ATotal: ${money(total)}%0A%0APlease confirm availability and delivery.`;
 window.open(`https://wa.me/${WA_NUMBER}?text=${text}`,"_blank");
}
function setup(){
 const menu=document.querySelector("#menuBtn"),nav=document.querySelector("#mobileNav");menu?.addEventListener("click",()=>{let o=nav.classList.toggle("open");menu.setAttribute("aria-expanded",o)});
 document.querySelectorAll("#mobileNav a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
 document.querySelectorAll(".cart-open").forEach(x=>x.addEventListener("click",openCart));document.querySelectorAll(".cart-close").forEach(x=>x.addEventListener("click",closeCart));document.querySelector("#overlay")?.addEventListener("click",closeCart);
 document.addEventListener("click",e=>{
   let add=e.target.closest(".add"),det=e.target.closest(".details"),inc=e.target.closest("[data-inc]"),dec=e.target.closest("[data-dec]"),pack=e.target.closest("[data-pack]");
   if(add)addToCart(add.dataset.name);
   if(det)openDetails(det.dataset.name);
   if(inc){cart[inc.dataset.inc].qty++;save()} if(dec){let i=cart[dec.dataset.dec];i.qty--;if(i.qty<1)cart.splice(dec.dataset.dec,1);save()}
   if(pack){selectedPackaging=packaging.find(p=>p.name===pack.dataset.pack);document.querySelectorAll("[data-pack]").forEach(x=>x.classList.remove("selected"));pack.classList.add("selected")}
 });
 document.querySelector("#modalClose")?.addEventListener("click",closeModal);document.querySelector("#modalAdd")?.addEventListener("click",()=>{if(selectedProduct){addToCart(selectedProduct.name,1,selectedPackaging.name);closeModal()}});
 document.querySelector("#whatsappCart")?.addEventListener("click",whatsapp);document.querySelector("#stickyWA")?.addEventListener("click",whatsapp);
 renderProducts();renderCart();updateCount();observe();
}
function observe(){let io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.08});document.querySelectorAll(".reveal:not(.visible)").forEach(x=>io.observe(x))}
document.addEventListener("DOMContentLoaded",setup);
