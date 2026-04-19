// 数据加载
let data = [];
let filtered = [];
let currentCat = '';

async function loadData() {
    const res = await fetch('./data/numbers.json');
    data = await res.json();
    filtered = data;
    renderCards();
}

// 号码类型判断
function getCategory(num) {
    // 纽约号定义：区号以 917/347/718/646
    if (/^(917|347|718|646)/.test(num)) return 'ny';
    // 三连号
    if (/(\d)\1\1/.test(num)) return 'triple';
    // 四连号
    if (/(\d)\1\1\1/.test(num)) return 'quad';
    // 顺子号
    if (/1234|2345|3456|4567|5678|6789|0123/.test(num)) return 'seq';
    return '';
}

// 渲染
function renderCards() {
    const grid = document.getElementById('cardsGrid');
    grid.innerHTML = "";
    let htmlArr = [];

    filtered.forEach(item => {
        let cat = getCategory(item.number);
        if (currentCat && cat !== currentCat) return;

        let displayNum = item.number.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
        let cardClass = 'phone-card';
        let badge = '';
        let priceDom = '';

        if (item.sold) {
            cardClass += ' sold';
            badge = '<span class="badge sold">已出售</span>';
            priceDom = '';
        } else if (item.price) {
            priceDom = `<span class="phone-price">$${item.price.toLocaleString()}</span>`;
        } else {
            badge = '<span class="badge consult">咨询</span>';
        }

        htmlArr.push(
        `<div class="${cardClass}" tabindex="0" ${item.sold ? '' : `onclick="openModal('${item.number}', ${!!item.price}, ${item.price||0}, ${!!item.sold})"`}>
            <span class="phone-number">${displayNum}</span>
            ${priceDom}
            ${badge}
        </div>`);
    });

    if (htmlArr.length === 0) {
        grid.innerHTML = '<div style="padding:36px;text-align:center;color:#aaa;">暂无符合筛选条件的号码</div>';
    } else {
        grid.innerHTML = htmlArr.join('');
    }
}

// 搜索与筛选
function filterData() {
    const val = document.getElementById('searchInput').value.trim();
    filtered = data.filter(it => !val || it.number.includes(val));
    renderCards();
}

// 分类按钮
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.category-btn').forEach(x=>x.classList.remove('selected'));
        this.classList.add('selected');
        currentCat = this.getAttribute('data-cat');
        filterData();
    });
});

// 搜索
document.getElementById('searchInput').addEventListener('input', filterData);

// 卡片弹窗
window.openModal = function(number, hasPrice, price, sold) {
    if (sold) return;
    const modal = document.getElementById('modal');
    const displayNum = number.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
    document.getElementById('modalContent').innerHTML = `
        <button class="close-btn" onclick="closeModal()">×</button>
        <div style="font-weight:bold;margin-bottom:8px">📞 购买此号码</div>
        <div class="contact-row"><b>号码：</b>${displayNum}</div>
        ${hasPrice ? `<div class="contact-row"><b>价格：</b>$${price.toLocaleString()}</div>` : ''}
        <div class="contact-row"><b>电话：</b><a href="tel:+19178426666">+1 (917) 842-6666</a>
            <button class="btn-dial" onclick="window.location.href='tel:+19178426666'">拨打</button>
        </div>
        <div class="contact-row"><b>微信：</b>hola24
            <button class="btn-copy" onclick="copyText('hola24')">复制微信</button>
        </div>
        <div class="contact-row"><b>邮箱：</b><a href="mailto:323748@gmail.com">323748@gmail.com</a></div>
        <hr style="margin:10px 0;">
        <div style="color:#ad700a;font-size:.97em;">
            ⚠️ 温馨提示<br>请联系客服确认该号码是否仍在售。<br>
            <br>💰 支付方式支持：<br>
            • Zelle<br>�� 微信支付（WeChat Pay）<br>• 支付宝（Alipay）<br>
            <br>⏱ 号码库存变化较快，请尽快联系确认
        </div>
    `;
    modal.classList.add('active');
}

window.closeModal = function() {
    document.getElementById('modal').classList.remove('active');
}

// 复制
window.copyText = function(val) {
    navigator.clipboard.writeText(val);
    alert('微信号已复制');
}

// 点击弹窗遮罩关闭
document.getElementById('modal').addEventListener('click', function(e) {
    if(e.target === this) closeModal();
});

// 首次加载
loadData();