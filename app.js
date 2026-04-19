let data = [];
let filtered = [];
let searchVal = "";

async function loadData() {
  const res = await fetch('./data/numbers.json');
  data = await res.json();
  renderGrid();
}

// 用于格式化手机号显示 (917) 516-9111
function formatNumber(num) {
  if(num.length === 10) {
    return `(${num.slice(0,3)})<br>${num.slice(3,6)}-${num.slice(6)}`;
  }
  return num;
}

function renderGrid() {
  const grid = document.getElementById('phoneGrid');
  let html = "";
  let showData = !searchVal
    ? data
    : data.filter(item => item.number.includes(searchVal.replace(/\D/g, '')));

  if (showData.length === 0) {
    grid.innerHTML = '<div style="padding:32px 0;grid-column:1/3;color:#b5bfd2;text-align:center;">未搜到相关靓号</div>';
    return;
  }

  showData.forEach(item => {
    html += `
      <div class="phone-card" tabindex="0">
        ${item.hot ? `<div class="hot-badge">热卖</div>` : ''}
        <div class="number">${formatNumber(item.number)}</div>
        <div class="price">$${item.price ? item.price : '咨询'}</div>
      </div>
    `;
  });

  grid.innerHTML = html;
}

// 搜索逻辑
document.getElementById('searchInput').addEventListener('input', e => {
  searchVal = e.target.value.replace(/[^\d]/g, '');
  renderGrid();
});

document.getElementById('searchBtn').addEventListener('click', ()=>{
  searchVal = document.getElementById('searchInput').value.replace(/[^\d]/g, '');
  renderGrid();
});

// 初次加载
loadData();