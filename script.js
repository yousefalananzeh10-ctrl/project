const products = [
    { id: 1, cat: 'hardware', name: 'Synology NAS DS223', price: 320, descriptive: 'أنشئ سحابتك الخاصة لتخزين ملفاتك وصورك والوصول إليها من أي مكان.', img: 'https://tse1.mm.bing.net/th/id/OIP.CPpO4aljdoOUr8RMHoHN0gHaFj?rs=1&pid=ImgDetMain&o=7&rm=3' },
    { id: 2, cat: 'accessories', name: 'SanDisk 1TB Flash Drive', price: 85, descriptive: 'ذاكرة فلاش مزدوجة تعمل مع الهواتف والكمبيوتر بمنفذ USB-C.', img: 'https://tse1.mm.bing.net/th/id/OIP.0pXmRCdsn32U37zRQL11swHaHa?rs=1&pid=ImgDetMain&o=7&rm=3' }
];
let cart = [];
let lastOrderID = "";

// التبديل بين الصفحات
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    window.scrollTo(0,0);
}

// عرض المنتجات حسب الفئة
function loadCategory(cat) {
    showPage('products-page');
    const grid = document.getElementById('productsGrid');
    const filtered = (cat === 'all') ? products : products.filter(p => p.cat === cat);
    
    grid.innerHTML = filtered.map(p => `
        <div class="prod-card" onclick="viewProduct(${p.id})">
            <img src="${p.img}">
            <h4>${p.name}</h4>
            <p style="color:var(--accent); font-weight:bold">${p.price} JOD</p>
        </div>
    `).join('');
}

// صفحة تفاصيل السلعة
function viewProduct(id) {
    const p = products.find(item => item.id === id);
    const detailBox = document.getElementById('productDetails');
    detailBox.innerHTML = `
        <img src="${p.img}">
        <div class="info-box">
            <h1>${p.name}</h1>
                 <p>${p.descriptive}</p>
            <h2 style="color:var(--accent)">${p.price} JOD</h2>
            <button class="btn-success" onclick="addToCart(${p.id})">إضافة إلى العربة 🛒</button>
        </div>
    `;
    showPage('item-detail');
}

// السلة
function addToCart(id) {
    const p = products.find(item => item.id === id);
    cart.push(p);
    updateCart();
   // بدل alert("تمت الإضافة");
Swal.fire({
  title: 'تمت الإضافة!',
  text: 'المنتج الآن في عربة التسوق الخاصة بك',
  icon: 'success',
  confirmButtonText: 'حسناً',
  confirmButtonColor: '#4ecca3' // لون Web Net
});
}

function updateCart() {
    document.getElementById('cartCount').innerText = cart.length;
    const cartBox = document.getElementById('cartContent');
    if(cart.length === 0) {
        cartBox.innerHTML = "<p>العربة فارغة</p>";
    } else {
        cartBox.innerHTML = cart.map((item, index) => `
            <div style="display:flex; justify-content:space-between; background:white; padding:10px; margin-bottom:10px; border-radius:8px">
                <span>${item.name}</span>
                <b>${item.price} JOD</b>
            </div>
        `).join('');
    }
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('cartTotal').innerText = total;
}

// تأكيد الطلب
function handleOrder(e) {
    e.preventDefault();
    lastOrderID = "WN-" + Math.floor(1000 + Math.random() * 9000);
  Swal.fire({
    title: 'تهانينا! تم استلام طلبك',
    html: `
        <div style="text-align: center;">
            <p>شكراً لثقتك بـ <b>Web Net</b></p>
            <div style="background: #f4f4f9; padding: 15px; border-radius: 10px; margin: 15px 0; border: 1px dashed #4ecca3;">
                <span style="display: block; font-size: 14px; color: #666;">رقم تتبع الشحنة</span>
                <strong style="font-size: 24px; color: #1a1a2e;">${lastOrderID}</strong>
            </div>
            <p style="font-size: 14px; color: #888;">يرجى الاحتفاظ بالرقم لمتابعة حالة الطلب</p>
        </div>
    `,
    icon: 'success',
    confirmButtonText: 'تتبع طلبي الآن',
    confirmButtonColor: '#4ecca3',
    showClass: {
        popup: 'animate__animated animate__zoomIn' // إذا كنت تستخدم مكتبة Animate.css
    }
}).then((result) => {
    if (result.isConfirmed) {
        // الأوامر التي تنفذ بعد الضغط على الزر
        cart = []; // تفريغ السلة
        updateCart();
        document.getElementById('displayOrderID').innerText = lastOrderID;
        document.getElementById('trackInfo').style.display = "none";
        document.getElementById('trackStatus').style.display = "block";
        showPage('track'); // توجيه المستخدم لصفحة التتبع
    }
});
}

// تتبع الطلب
function trackOrder() {
    const id = document.getElementById('trackInput').value;
    if(id === lastOrderID && id !== "") {
        document.getElementById('trackInfo').style.display = "none";
        document.getElementById('trackStatus').style.display = "block";
        document.getElementById('displayOrderID').innerText = id;
    } else {
     Swal.fire({
    title: 'خطأ في الرقم!',
    text: 'عذراً، رقم الطلب الذي أدخلته غير موجود في سجلات Web Net.',
    icon: 'error',
    confirmButtonText: 'إغلاق',
    confirmButtonColor: '#e74c3c', // لون أحمر متناسق مع رسالة الخطأ
    background: '#ffffff',
    customClass: {
        title: 'font-cairo',
        popup: 'border-radius-15'
    }
});
    }
}

// البحث الحي
function liveSearch() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const result = products.filter(p => p.name.toLowerCase().includes(term));
    loadCategory('search'); // وظيفة وهمية فقط لتشغيل العرض
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = result.map(p => `
        <div class="prod-card" onclick="viewProduct(${p.id})">
            <img src="${p.img}">
            <h4>${p.name}</h4>
            <p style="color:var(--accent); font-weight:bold">${p.price} JOD</p>
        </div>
    `).join('');
    showPage('products-page');
}
function updateCart() {
    document.getElementById('cartCount').innerText = cart.length;
    const cartBox = document.getElementById('cartContent');
    
    if(cart.length === 0) {
        cartBox.innerHTML = "<div style='text-align:center; padding:20px;'>🛒 العربة فارغة حالياً</div>";
    } else {
        cartBox.innerHTML = cart.map((item, index) => `
            <div class="cart-item-row" style="display:flex; justify-content:space-between; align-items:center; background:white; padding:12px; margin-bottom:10px; border-radius:8px; border:1px solid #ddd">
                <div style="display:flex; align-items:center; gap:10px;">
                    <img src="${item.img}" style="width:40px; height:40px; object-fit:contain;">
                    <span>${item.name}</span>
                </div>
                <div style="display:flex; align-items:center; gap:15px;">
                    <b style="color:var(--secondary)">${item.price} JOD</b>
                    <button onclick="removeFromCart(${index})" style="background:none; border:none; color:#e74c3c; cursor:pointer; font-size:18px;" title="حذف">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('cartTotal').innerText = total;
}
function removeFromCart(index) {
    // حذف العنصر من المصفوفة باستخدام splice
    const itemName = cart[index].name;
    cart.splice(index, 1);
    
    // تحديث واجهة السلة فوراً
    updateCart();
    
    // إشعار صغير (Toast) يظهر ويختفي بسرعة بدل الـ Alert الكبير
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
    });

    Toast.fire({
        icon: 'info',
        title: `تم حذف ${itemName} من السلة`
    });
}

window.onload = () => showPage('home');