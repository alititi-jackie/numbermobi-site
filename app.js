let jsonUrl = "./data/numbers.json";
let allNumbers = [];
let searchVal = "";

async function loadNumbers() {
  const res = await fetch(jsonUrl);
  allNumbers = await res.json();
  render();
}
function formatNumDisplay(number) {
  if (number.length === 10) {
    return `(${number.slice(0,3)})<br>${number.slice(3,6)}-${number.slice(6)}`;
  }
  return number;
}
function render() {
  const grid = document.getElementById('phoneGrid');
  let showNumbers = !searchVal
    ? allNumbers
    : allNumbers.filter(n =>
        n.number.includes(searchVal.replace(/\D/g, ''))
      );
  grid.innerHTML = showNumbers.length === 0
    ? '<div style="padding:38px 0;grid-column:1/3;color:#b5bfd2;text-align:center;font-size:1.13rem">暂无相关号码</div>'
    : showNumbers.map(item => {
        let html = `<div class="phone-card${item.sold ? ' sold' : ''}">`;
        if (item.hot) html += `<span class="hot-badge">热卖</span>`;
        if (item.sold) html += `<span class="sold-badge">已售</span>`;
        html += `<div class="number">${formatNumDisplay(item.number)}</div>`;
        if (item.sold) {
          html += `<div class="sold-text">已售出</div>`;
        } else if (typeof item.price === "number") {
          html += `<div class="price">$${item.price}</div>`;
        } else {
          html += `<div class="consult">咨询</div>`;
        }
        html += `</div>`;
        return html;
      }).join("");
}
const si = document.getElementById('searchInput');
si.addEventListener('input', e => {
  searchVal = e.target.value.replace(/[^\d]/g, '');
  render();
});
document.getElementById('searchBtn').addEventListener('click', ()=>{
  searchVal = si.value.replace(/[^\d]/g, '');
  render();
});
loadNumbers();