// =============================================
// التهيئة الأولية والتخزين المحلي
// =============================================

// بيانات المدير (يمكن تغييرها)
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

// بيانات التخزين المحلي
let accounts = [];
let tools = [];
let news = [];

// تحميل البيانات من localStorage
function loadData() {
    const savedAccounts = localStorage.getItem('accounts');
    const savedTools = localStorage.getItem('tools');
    const savedNews = localStorage.getItem('news');
    
    accounts = savedAccounts ? JSON.parse(savedAccounts) : [
        {
            id: 1,
            type: 'free',
            title: { ar: 'رزدنت ايفل 9', en: 'resident evil requiem' },
            email: '70xplay_com_re9a',
            password: 'wbsite:70XpLaY.com',
            details: { ar: 'لعبه وحده', en: 'one game' },
            date: formatDate(new Date()),
            imageUrl: 'https://gaming-cdn.com/images/products/20991/orig/resident-evil-requiem-pc-steam-cover.jpg?v=1771856840'
        }
    ];
    
    tools = savedTools ? JSON.parse(savedTools) : [
        {
            id: 101,
            type: 'tool',
            title: { ar: 'اداه تنظيف الجهاز', en: 'Device cleaning tool' },
            downloadUrl: 'https://example.com/tool.zip',
            key: 'NoKey',
            details: { ar: 'ينظف جهازك من التلقيم و الفيروسات', en: 'Cleans your device' },
            date: formatDate(new Date()),
            imageUrl: 'https://via.placeholder.com/300x180?text=Tool'
        }
    ];
    
    news = savedNews ? JSON.parse(savedNews) : [
        {
            id: 201,
            type: 'news',
            title: { ar: 'مرحبا بكم في الموقع', en: 'Welcome to the site' },
            content: { ar: 'تم إطلاق الموقع الجديد', en: 'New site launched' },
            imageUrl: 'https://via.placeholder.com/600x400?text=Welcome',
            date: formatDate(new Date())
        }
    ];
}

// =============================================
// دالة تنسيق التاريخ
// =============================================
function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    // تنسيق الوقت
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // الساعة 0 تصبح 12
    
    return `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;
}

// حفظ البيانات في localStorage
function saveData() {
    localStorage.setItem('accounts', JSON.stringify(accounts));
    localStorage.setItem('tools', JSON.stringify(tools));
    localStorage.setItem('news', JSON.stringify(news));
    updateNotificationBadges();
}

// =============================================
// نظام تسجيل الدخول
// =============================================

// التحقق من حالة تسجيل الدخول
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const isAdmin = sessionStorage.getItem('isAdmin');
    const loginContainer = document.getElementById('loginContainer');
    const mainContainer = document.getElementById('mainContainer');
    const adminPanel = document.getElementById('adminPanel');
    
    if (isLoggedIn === 'true') {
        if (loginContainer) loginContainer.style.display = 'none';
        if (mainContainer) mainContainer.style.display = 'block';
        
        // إظهار لوحة التحكم فقط للمدير
        if (adminPanel) {
            adminPanel.style.display = isAdmin === 'true' ? 'block' : 'none';
        }
        
        loadData();
        displayItems();
        updateNotificationBadges();
    } else {
        if (loginContainer) loginContainer.style.display = 'flex';
        if (mainContainer) mainContainer.style.display = 'none';
    }
}

// دالة تسجيل الدخول كمدير
window.login = function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('isAdmin', 'true');
        errorMessage.style.display = 'none';
        checkAuth();
    } else {
        errorMessage.textContent = '❌ اسم المستخدم أو كلمة المرور غير صحيحة';
        errorMessage.style.display = 'block';
    }
};

// دالة تسجيل الدخول كزائر
window.loginAsGuest = function() {
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('isAdmin', 'false');
    document.getElementById('errorMessage').style.display = 'none';
    checkAuth();
};

// دالة تسجيل الخروج
window.logout = function() {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('isAdmin');
    checkAuth();
};

// =============================================
// دوال النسخ
// =============================================

// دالة نسخ النص
window.copyToClipboard = function(text, buttonElement) {
    navigator.clipboard.writeText(text).then(() => {
        // حفظ النص الأصلي للزر
        const originalText = buttonElement.innerHTML;
        
        // تغيير نص الزر
        buttonElement.innerHTML = '✅ تم النسخ';
        
        // إعادة النص الأصلي بعد ثانيتين
        setTimeout(() => {
            buttonElement.innerHTML = originalText;
        }, 2000);
    }).catch(() => {
        alert('❌ فشل النسخ');
    });
};

// =============================================
// إدارة المحتوى (للمدير فقط)
// =============================================

// إضافة حساب جديد
window.addAccount = function() {
    // التحقق من أن المستخدم مدير
    if (sessionStorage.getItem('isAdmin') !== 'true') {
        alert('❌ غير مصرح لك بهذه العملية');
        return;
    }
    
    const titleAr = document.getElementById('accountTitleAr').value;
    const titleEn = document.getElementById('accountTitleEn').value;
    const email = document.getElementById('accountEmail').value;
    const password = document.getElementById('accountPassword').value;
    const detailsAr = document.getElementById('accountDetailsAr').value;
    const detailsEn = document.getElementById('accountDetailsEn').value;
    const type = document.getElementById('accountType').value;
    const imageUrl = document.getElementById('accountImage').value;
    
    if (!titleAr || !email || !password) {
        alert('الرجاء ملء جميع الحقول المطلوبة');
        return;
    }
    
    const newAccount = {
        id: Date.now(),
        type: type,
        title: { ar: titleAr, en: titleEn || titleAr },
        email: email,
        password: password,
        details: { ar: detailsAr, en: detailsEn || detailsAr },
        date: formatDate(new Date()),
        imageUrl: imageUrl || 'https://via.placeholder.com/300x180?text=Account'
    };
    
    accounts.unshift(newAccount);
    saveData();
    
    // مسح الحقول
    document.getElementById('accountTitleAr').value = '';
    document.getElementById('accountTitleEn').value = '';
    document.getElementById('accountEmail').value = '';
    document.getElementById('accountPassword').value = '';
    document.getElementById('accountDetailsAr').value = '';
    document.getElementById('accountDetailsEn').value = '';
    document.getElementById('accountImage').value = '';
    
    displayAdminItems('accounts');
    alert('✅ تم إضافة الحساب بنجاح');
};

// إضافة أداة جديدة
window.addTool = function() {
    // التحقق من أن المستخدم مدير
    if (sessionStorage.getItem('isAdmin') !== 'true') {
        alert('❌ غير مصرح لك بهذه العملية');
        return;
    }
    
    const titleAr = document.getElementById('toolTitleAr').value;
    const titleEn = document.getElementById('toolTitleEn').value;
    const downloadUrl = document.getElementById('toolDownloadUrl').value;
    const key = document.getElementById('toolKey').value;
    const detailsAr = document.getElementById('toolDetailsAr').value;
    const detailsEn = document.getElementById('toolDetailsEn').value;
    const imageUrl = document.getElementById('toolImage').value;
    
    if (!titleAr || !downloadUrl) {
        alert('الرجاء ملء جميع الحقول المطلوبة');
        return;
    }
    
    const newTool = {
        id: Date.now(),
        type: 'tool',
        title: { ar: titleAr, en: titleEn || titleAr },
        downloadUrl: downloadUrl,
        key: key || 'NoKey',
        details: { ar: detailsAr, en: detailsEn || detailsAr },
        date: formatDate(new Date()),
        imageUrl: imageUrl || 'https://via.placeholder.com/300x180?text=Tool'
    };
    
    tools.unshift(newTool);
    saveData();
    
    // مسح الحقول
    document.getElementById('toolTitleAr').value = '';
    document.getElementById('toolTitleEn').value = '';
    document.getElementById('toolDownloadUrl').value = '';
    document.getElementById('toolKey').value = '';
    document.getElementById('toolDetailsAr').value = '';
    document.getElementById('toolDetailsEn').value = '';
    document.getElementById('toolImage').value = '';
    
    displayAdminItems('tools');
    alert('✅ تم إضافة الأداة بنجاح');
};

// إضافة خبر جديد
window.addNews = function() {
    // التحقق من أن المستخدم مدير
    if (sessionStorage.getItem('isAdmin') !== 'true') {
        alert('❌ غير مصرح لك بهذه العملية');
        return;
    }
    
    const titleAr = document.getElementById('newsTitleAr').value;
    const titleEn = document.getElementById('newsTitleEn').value;
    const contentAr = document.getElementById('newsContentAr').value;
    const contentEn = document.getElementById('newsContentEn').value;
    const imageUrl = document.getElementById('newsImage').value;
    
    if (!titleAr || !contentAr) {
        alert('الرجاء ملء جميع الحقول المطلوبة');
        return;
    }
    
    const newNews = {
        id: Date.now(),
        type: 'news',
        title: { ar: titleAr, en: titleEn || titleAr },
        content: { ar: contentAr, en: contentEn || contentAr },
        imageUrl: imageUrl || 'https://via.placeholder.com/600x400?text=News',
        date: formatDate(new Date())
    };
    
    news.unshift(newNews);
    saveData();
    
    // مسح الحقول
    document.getElementById('newsTitleAr').value = '';
    document.getElementById('newsTitleEn').value = '';
    document.getElementById('newsContentAr').value = '';
    document.getElementById('newsContentEn').value = '';
    document.getElementById('newsImage').value = '';
    
    displayAdminItems('news');
    alert('✅ تم إضافة الخبر بنجاح');
};

// حذف عنصر
window.deleteItem = function(type, id) {
    // التحقق من أن المستخدم مدير
    if (sessionStorage.getItem('isAdmin') !== 'true') {
        alert('❌ غير مصرح لك بهذه العملية');
        return;
    }
    
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) return;
    
    if (type === 'accounts') {
        accounts = accounts.filter(item => item.id !== id);
    } else if (type === 'tools') {
        tools = tools.filter(item => item.id !== id);
    } else if (type === 'news') {
        news = news.filter(item => item.id !== id);
    }
    
    saveData();
    displayAdminItems(type);
    
    // تحديث العرض العام إذا كان نفس النوع
    if (currentContent === type) {
        displayItems();
    }
};

// عرض عناصر المدير
function displayAdminItems(type) {
    const container = document.getElementById('adminItemsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    let items = [];
    if (type === 'accounts') items = accounts;
    else if (type === 'tools') items = tools;
    else if (type === 'news') items = news;
    
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'admin-item-card';
        
        const title = item.title[currentLang] || item.title.ar;
        
        card.innerHTML = `
            <button class="delete-btn" onclick="deleteItem('${type}', ${item.id})">✕</button>
            <h4>${title}</h4>
            <p>${item.date}</p>
        `;
        
        container.appendChild(card);
    });
}

// تبديل أقسام المدير
window.switchAdminTab = function(tab) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-form').forEach(f => f.style.display = 'none');
    
    document.querySelector(`[onclick="switchAdminTab('${tab}')"]`).classList.add('active');
    document.getElementById(`${tab}Form`).style.display = 'block';
    
    displayAdminItems(tab);
};

// =============================================
// تحديث شارات الإشعارات
// =============================================

let lastVisit = {
    accounts: 0,
    tools: 0,
    news: 0
};

// تحميل آخر زيارة
function loadLastVisit() {
    const saved = localStorage.getItem('lastVisit');
    if (saved) {
        lastVisit = JSON.parse(saved);
    }
}

// تحديث شارات الإشعارات
function updateNotificationBadges() {
    const now = Date.now();
    
    // عدد العناصر الجديدة في كل قسم
    const newAccounts = accounts.filter(a => new Date(a.date).getTime() > lastVisit.accounts).length;
    const newTools = tools.filter(t => new Date(t.date).getTime() > lastVisit.tools).length;
    const newNews = news.filter(n => new Date(n.date).getTime() > lastVisit.news).length;
    
    // تحديث الشارات
    updateBadge('switch-accounts', newAccounts);
    updateBadge('switch-tools', newTools);
    updateBadge('switch-news', newNews);
}

// تحديث شارة محددة
function updateBadge(elementId, count) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // إزالة الشارة القديمة
    const oldBadge = element.querySelector('.badge');
    if (oldBadge) oldBadge.remove();
    
    // إضافة شارة جديدة إذا كان هناك عناصر جديدة
    if (count > 0) {
        element.classList.add('notification-badge');
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = count;
        element.appendChild(badge);
    } else {
        element.classList.remove('notification-badge');
    }
}

// تحديث وقت الزيارة عند فتح قسم
window.updateLastVisit = function(content) {
    lastVisit[content] = Date.now();
    localStorage.setItem('lastVisit', JSON.stringify(lastVisit));
    updateNotificationBadges();
};

// =============================================
// إدارة المحتوى العام
// =============================================

let currentContent = 'accounts';
let currentLang = 'ar';

// ترجمة النصوص
const translations = {
    ar: {
        headerTitle: "نشر حسابات وأدوات",
        headerSubtitle: "abumisfer - مشاركة وتحميل الحسابات والأدوات المميزة",
        headerLink: "انقر لفتح متصفح ويب هوك سبامر",
        premium: "✨ جديد",
        free: "🆓 مجاني",
        tool: "🛠️ أداة",
        news: "📰 خبر",
        downloadButton: "تحميل الملف",
        copyButton: "نسخ",
        copyright: "© 2026 abumisfer - جميع الحقوق محفوظة",
        version: "الإصدار 1.0.3",
        discord: "تواصل معنا على Discord",
        email: "📧",
        password: "🔑",
        date: "📅",
        link: "🔗",
        downloadLink: "📥 رابط التحميل",
        key: "🔑 المفتاح",
        switchAccounts: "📱 الحسابات",
        switchTools: "🛠️ الأدوات",
        switchNews: "📰 الأخبار"
    },
    en: {
        headerTitle: "Accounts & Tools Sharing",
        headerSubtitle: "abumisfer - Share premium accounts and tools",
        headerLink: "Press To Open New Window RTLS WEBHOOK SPAMER",
        premium: "✨ New",
        free: "🆓 Free",
        tool: "🛠️ Tool",
        news: "📰 News",
        downloadButton: "Download File",
        copyButton: "Copy",
        copyright: "© 2026 abumisfer - All rights reserved",
        version: "Version 1.0.3",
        discord: "Contact us on Discord",
        email: "📧",
        password: "🔑",
        date: "📅",
        link: "🔗",
        downloadLink: "📥 Download Link",
        key: "🔑 Key",
        switchAccounts: "📱 Accounts",
        switchTools: "🛠️ Tools",
        switchNews: "📰 News"
    }
};

// تبديل المحتوى
window.switchContent = function(content) {
    currentContent = content;
    
    document.getElementById('switch-accounts').classList.remove('active');
    document.getElementById('switch-tools').classList.remove('active');
    document.getElementById('switch-news').classList.remove('active');
    
    if (content === 'accounts') {
        document.getElementById('switch-accounts').classList.add('active');
        document.getElementById('itemsGrid').style.display = 'grid';
        document.getElementById('newsGrid').style.display = 'none';
    } else if (content === 'tools') {
        document.getElementById('switch-tools').classList.add('active');
        document.getElementById('itemsGrid').style.display = 'grid';
        document.getElementById('newsGrid').style.display = 'none';
    } else {
        document.getElementById('switch-news').classList.add('active');
        document.getElementById('itemsGrid').style.display = 'none';
        document.getElementById('newsGrid').style.display = 'grid';
    }
    
    updateLastVisit(content);
    displayItems();
};

// تبديل اللغة
window.changeLanguage = function(lang) {
    currentLang = lang;
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    if (lang === 'ar') {
        document.documentElement.dir = 'rtl';
        document.documentElement.lang = 'ar';
    } else {
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = lang;
    }
    
    document.getElementById('header-title').textContent = translations[lang].headerTitle;
    document.getElementById('header-subtitle').textContent = translations[lang].headerSubtitle;
    document.getElementById('header-link').textContent = translations[lang].headerLink;
    document.getElementById('copyright-text').textContent = translations[lang].copyright;
    document.getElementById('version-text').textContent = translations[lang].version;
    document.getElementById('discord-text').innerHTML = `<i>💬</i> ${translations[lang].discord}`;
    
    document.getElementById('switch-accounts').textContent = translations[lang].switchAccounts;
    document.getElementById('switch-tools').textContent = translations[lang].switchTools;
    document.getElementById('switch-news').textContent = translations[lang].switchNews;
    
    displayItems();
};

// عرض الصورة بملء الشاشة
window.openFullscreen = function(imageUrl) {
    document.getElementById('imageModal').style.display = 'block';
    document.getElementById('modalImage').src = imageUrl;
};

window.closeModal = function() {
    document.getElementById('imageModal').style.display = 'none';
};

// تحميل الأداة
window.downloadTool = function(downloadUrl) {
    window.open(downloadUrl, '_blank');
};

// عرض العناصر
function displayItems() {
    if (currentContent === 'news') {
        displayNews();
    } else {
        displayAccountsAndTools();
    }
}

// عرض الحسابات والأدوات
function displayAccountsAndTools() {
    const itemsGrid = document.getElementById('itemsGrid');
    itemsGrid.innerHTML = '';
    
    const items = currentContent === 'accounts' ? accounts : tools;
    
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        
        const title = item.title[currentLang] || item.title.ar;
        const details = item.details[currentLang] || item.details.ar;
        
        let typeText = '';
        if (item.type === 'tool') {
            typeText = translations[currentLang].tool;
        } else {
            typeText = item.type === 'premium' ? translations[currentLang].premium : translations[currentLang].free;
        }
        
        let imageHtml = '';
        if (item.imageUrl) {
            imageHtml = `<img src="${item.imageUrl}" alt="${title}" onerror="this.onerror=null; this.parentElement.classList.add('image-loading'); this.style.display='none';">`;
        } else {
            imageHtml = title.charAt(0);
        }
        
        let infoHtml = '';
        let buttonHtml = '';
        
        if (item.type === 'tool') {
            infoHtml = `<div>${translations[currentLang].downloadLink} <br> <small style="color: #666; word-break: break-all;">${item.downloadUrl}</small></div>`;
            
            if (item.key) {
                infoHtml += `<div>${translations[currentLang].key} ${item.key}</div>`;
            }
            
            buttonHtml = `<button class="btn-download" onclick="downloadTool('${item.downloadUrl}')">
                ${translations[currentLang].downloadButton} ⬇️
            </button>`;
        } else {
            // عرض الإيميل مع زر نسخ
            infoHtml = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                    <span>${translations[currentLang].email} ${item.email}</span>
                    <button class="btn-copy" onclick="copyToClipboard('${item.email}', this)" style="background: #764ba2; color: white; border: none; padding: 3px 10px; border-radius: 5px; cursor: pointer; font-size: 0.8em;">${translations[currentLang].copyButton}</button>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>${translations[currentLang].password} ${item.password}</span>
                    <button class="btn-copy" onclick="copyToClipboard('${item.password}', this)" style="background: #764ba2; color: white; border: none; padding: 3px 10px; border-radius: 5px; cursor: pointer; font-size: 0.8em;">${translations[currentLang].copyButton}</button>
                </div>
            `;
        }
        
        card.innerHTML = `
            <div class="item-type ${item.type}">
                ${typeText}
            </div>
            <div class="item-image" onclick="openFullscreen('${item.imageUrl}')">
                ${imageHtml}
                <div class="fullscreen-icon" onclick="event.stopPropagation(); openFullscreen('${item.imageUrl}')">⛶</div>
            </div>
            <div class="item-content">
                <h3 class="item-title">${title}</h3>
                <div class="item-details">${details}</div>
                <div class="item-info">
                    ${infoHtml}
                </div>
                <div class="item-footer">
                    <span class="item-date">${translations[currentLang].date} ${item.date}</span>
                    ${buttonHtml}
                </div>
            </div>
        `;
        
        itemsGrid.appendChild(card);
    });
}

// عرض الأخبار
function displayNews() {
    const newsGrid = document.getElementById('newsGrid');
    newsGrid.innerHTML = '';
    
    news.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        
        const title = item.title[currentLang] || item.title.ar;
        const content = item.content[currentLang] || item.content.ar;
        
        card.innerHTML = `
            <div class="item-type news">
                ${translations[currentLang].news}
            </div>
            <div class="item-image" onclick="openFullscreen('${item.imageUrl}')">
                <img src="${item.imageUrl}" alt="${title}" onerror="this.onerror=null; this.parentElement.classList.add('image-loading'); this.style.display='none';">
                <div class="fullscreen-icon" onclick="event.stopPropagation(); openFullscreen('${item.imageUrl}')">⛶</div>
            </div>
            <div class="item-content">
                <h3 class="item-title">${title}</h3>
                <div class="item-details">${content}</div>
                <div class="item-footer">
                    <span class="item-date">${translations[currentLang].date} ${item.date}</span>
                </div>
            </div>
        `;
        
        newsGrid.appendChild(card);
    });
}

// =============================================
// التهيئة عند تحميل الصفحة
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    loadData();
    loadLastVisit();
    checkAuth();
    
    // أحداث لوحة المفاتيح
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
    
    // معالجة أخطاء الصور
    window.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            e.target.style.display = 'none';
            e.target.parentElement.classList.add('image-loading');
        }
    }, true);
    
    // إضافة مستمع لأزرار اللغة
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // منع الحدث الافتراضي
            e.preventDefault();
        });
    });
});
