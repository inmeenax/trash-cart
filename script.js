
const WA_NUMBER = "91XXXXXXXXXX"; // EDIT: WhatsApp number, digits only
const SITE_URL = "https://inmeenax.github.io/trash-cart/"; // EDIT if domain changes
const STORAGE_KEY = "maisonHampersCartV1";

const PRODUCTS = [{"id": "birthday", "name": "Birthday Celebration Hamper", "price": 1499, "original": 1999, "desc": "A joyful edit of artisan treats, candles and little celebration details.", "cat": "Birthday", "img": "https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=1000&q=85"}, {"id": "anniversary", "name": "Anniversary Love Hamper", "price": 1899, "original": 2499, "desc": "Romantic indulgence curated for anniversaries, milestones and date nights.", "cat": "Anniversary", "img": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1000&q=85"}, {"id": "chocolate", "name": "Premium Chocolate Hamper", "price": 1299, "original": 1699, "desc": "Velvety cocoa, gourmet bites and an elegant presentation for sweet moments.", "cat": "Celebration", "img": "https://images.unsplash.com/photo-1548907040-4d42c20f11d6?auto=format&fit=crop&w=1000&q=85"}, {"id": "selfcare", "name": "Self-Care Hamper", "price": 1599, "original": 2099, "desc": "A calming ritual of bath, body, fragrance and slow-living favourites.", "cat": "Self Care", "img": "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1000&q=85"}, {"id": "couple", "name": "Luxury Couple Hamper", "price": 2299, "original": 2999, "desc": "An elevated duo of gourmet treats and intimate keepsakes for two.", "cat": "Couples", "img": "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1000&q=85"}, {"id": "corporate", "name": "Corporate Gift Hamper", "price": 1999, "original": 2599, "desc": "Sophisticated gifting designed for clients, teams and festive business moments.", "cat": "Corporate", "img": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=85"}, {"id": "wedding", "name": "Wedding Gift Hamper", "price": 2499, "original": 3299, "desc": "A graceful wedding keepsake filled with celebratory gourmet details.", "cat": "Wedding", "img": "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=85"}, {"id": "festival", "name": "Festival Special Hamper", "price": 1699, "original": 2199, "desc": "Festive favourites wrapped with warmth, sparkle and Indian celebration spirit.", "cat": "Festivals", "img": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=85"}];
const PACKAGING = [
  {id:"classic",name:"Classic Ribbon Wrap",price:0,label:"Included"},
  {id:"rose",name:"Luxury Rose Box",price:199,label:"+₹199"},
  {id:"velvet",name:"Velvet Gift Finish",price:299,label:"+₹299"},
  {id:"festive",name:"Festive Gold Wrap",price:149,label:"+₹149"}
];

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const money=n=>"₹"+Number(n).toLocaleString("en-IN");
const getCart=()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEY))||[]}catch{return[]}};
const saveCart=c=>{localStorage.setItem(STORAGE_KEY,JSON.stringify(c));renderCart()};
const productById=id=>PRODUCTS.find(p=>p.id===id);
const packById=id=>PACKAGING.find(p=>p.id===id)||PACKAGING[0];
const cartCount=()=>getCart().reduce((n,i)=>n+i.qty,0);
const cartTotal=()=>getCart().reduce((n,i)=>n+(i.price+i.packagingPrice)*i.qty,0);
const discount=p=>Math.round((1-p.price/p.original)*100);

function productCard(p){
 return `<article class="product-card reveal"><div class="product-image"><img src="${p.img}" alt="${p.name}" width="800" height="1000" loading="lazy"><span class="badge">${discount(p)}% OFF</span></div><div class="product-info"><div class="product-cat">${p.cat}</div><h3>${p.name}</h3><p>${p.desc}</p><div class="price-row"><span class="price">${money(p.price)}</span><span class="old-price">${money(p.original)}</span><span class="discount">${discount(p)}% off</span></div><div class="card-actions"><button class="btn btn-light" onclick="openProduct('${p.id}')">View Details</button><button class="btn btn-dark" onclick="openProduct('${p.id}')">Add to Cart</button></div></div></article>`;
}
function renderProducts(target="#productGrid",list=PRODUCTS){const el=$(target);if(!el)return;el.innerHTML=list.map(productCard).join("");observeReveal()}
function openProduct(id){
 const p=productById(id);if(!p)return;
 $("#modalContent").innerHTML=`<div class="modal-inner"><div class="modal-photo"><img src="${p.img}" alt="${p.name}" width="900" height="1100"></div><div class="modal-copy"><div class="product-cat">${p.cat}</div><h2>${p.name}</h2><p style="color:var(--muted)">${p.desc}</p><div class="price-row"><span class="price">${money(p.price)}</span><span class="old-price">${money(p.original)}</span></div><h3 style="font-size:17px;margin-top:22px">Gift packaging</h3><div class="packaging">${PACKAGING.map((x,i)=>`<label class="pack-option ${i===0?"selected":""}"><span><input type="radio" name="packaging" value="${x.id}" ${i===0?"checked":""} onchange="selectPack(this)"> ${x.name}</span><strong>${x.label}</strong></label>`).join("")}</div><div class="field"><label>Quantity</label><input id="modalQty" type="number" min="1" value="1"></div><button class="btn btn-dark" style="width:100%;margin-top:14px" onclick="addModalToCart('${p.id}')">Add to Cart</button></div></div>`;
 $("#productModal").classList.add("open");$("#modalBackdrop").classList.add("open");document.body.classList.add("no-scroll");
}
function selectPack(input){$$(".pack-option").forEach(x=>x.classList.remove("selected"));input.closest(".pack-option").classList.add("selected")}
function closeModal(){$("#productModal").classList.remove("open");$("#modalBackdrop").classList.remove("open");document.body.classList.remove("no-scroll")}
function addModalToCart(id){const qty=Math.max(1,Number($("#modalQty").value)||1);const pack=packById($('input[name="packaging"]:checked')?.value||"classic");addToCart(id,qty,pack.id);closeModal()}
function addToCart(id,qty=1,packagingId="classic"){const p=productById(id),pack=packById(packagingId);if(!p)return;const cart=getCart(),key=id+"_"+pack.id,found=cart.find(i=>i.key===key);if(found)found.qty+=qty;else cart.push({key,id,qty,price:p.price,packagingId:pack.id,packagingName:pack.name,packagingPrice:pack.price});saveCart(cart);toast("Added to your hamper bag")}
function removeCart(key){saveCart(getCart().filter(i=>i.key!==key))}
function changeQty(key,d){const c=getCart(),i=c.find(x=>x.key===key);if(!i)return;i.qty+=d;if(i.qty<=0){removeCart(key);return}saveCart(c)}
function renderCart(){
 const cart=getCart(),wrap=$("#cartItems");if(!wrap)return;$("#cartCount").textContent=cartCount();
 if(!cart.length)wrap.innerHTML='<div class="empty">Your hamper bag is waiting for something beautiful.</div>';
 else wrap.innerHTML=cart.map(i=>{const p=productById(i.id);return `<div class="cart-item"><img src="${p.img}" alt="${p.name}" width="100" height="110"><div><h4>${p.name}</h4><small>${i.packagingName} · ${money(i.packagingPrice)}<br>${money(i.price+i.packagingPrice)} each</small><div class="qty"><button onclick="changeQty('${i.key}',-1)">−</button><span>${i.qty}</span><button onclick="changeQty('${i.key}',1)">+</button></div></div><button class="remove" onclick="removeCart('${i.key}')">Remove</button></div>`}).join("");
 $("#cartTotal").textContent=money(cartTotal());
}
function openCart(){$("#cartDrawer").classList.add("open");$("#drawerBackdrop").classList.add("open");document.body.classList.add("no-scroll")}
function closeCart(){$("#cartDrawer").classList.remove("open");$("#drawerBackdrop").classList.remove("open");document.body.classList.remove("no-scroll")}
function orderWhatsApp(){
 const cart=getCart();if(!cart.length){toast("Your cart is empty");return}
 const lines=cart.map(i=>`${productById(i.id).name} × ${i.qty} | ${i.packagingName} (${money(i.packagingPrice)})`).join("\n");
 const text=`Hello Maison Hampers, I would like to place an order.\n\n${lines}\n\nTotal: ${money(cartTotal())}\n\nPlease confirm availability and delivery details.`;
 if(WA_NUMBER.includes("X")){toast("Add your WhatsApp number in script.js");return}
 window.open("https://wa.me/"+WA_NUMBER+"?text="+encodeURIComponent(text),"_blank");
}
async function gatewayPay(){
 const total=Math.round(cartTotal());if(!total){toast("Your cart is empty");return}
 const btn=$("#gatewayBtn");if(btn){btn.disabled=true;btn.textContent="Preparing…"}
 try{
  const r=await fetch("https://watchpays-api.moxoga3282.workers.dev/create-payment",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({amount:total,source:"maison-hampers",items:getCart()})});
  const d=await r.json();if(d.success&&d.payment_url)window.location.href=d.payment_url;else throw new Error(d.error||d.message||"Payment creation failed");
 }catch(e){console.error(e);toast(e.message||"Payment service unavailable");if(btn){btn.disabled=false;btn.textContent="Pay securely via Gateway"}}
}
function toast(msg){const t=$("#toast");if(!t)return;t.textContent=msg;t.classList.add("show");clearTimeout(window._toast);window._toast=setTimeout(()=>t.classList.remove("show"),2200)}
function toggleMenu(){$("#navLinks")?.classList.toggle("open")}
function setupCountdown(){
 const el=$("#countdown");if(!el)return;let end=Date.now()+86400000;
 setInterval(()=>{let s=Math.max(0,Math.floor((end-Date.now())/1000));let h=Math.floor(s/3600),m=Math.floor(s%3600/60),sec=s%60;el.textContent=`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`},1000)
}
function observeReveal(){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}}),{threshold:.08});$$(".reveal").forEach(e=>io.observe(e))}
document.addEventListener("DOMContentLoaded",()=>{
 renderProducts("#productGrid");renderCart();observeReveal();setupCountdown();
 $("#menuBtn")?.addEventListener("click",toggleMenu);$("#cartBtn")?.addEventListener("click",openCart);$("#closeCart")?.addEventListener("click",closeCart);$("#drawerBackdrop")?.addEventListener("click",closeCart);$("#modalBackdrop")?.addEventListener("click",closeModal);$("#closeModal")?.addEventListener("click",closeModal);$("#waBtn")?.addEventListener("click",orderWhatsApp);$("#gatewayBtn")?.addEventListener("click",gatewayPay);
 $$(".nav-links a").forEach(a=>a.addEventListener("click",()=>$("#navLinks")?.classList.remove("open")));
 $$(".filter").forEach(b=>b.addEventListener("click",()=>{$$(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");const f=b.dataset.filter;renderProducts("#productGrid",f==="All"?PRODUCTS:PRODUCTS.filter(p=>p.cat===f))}));
});
