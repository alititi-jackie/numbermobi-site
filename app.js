let data = [];

fetch("data.json")
  .then(res => res.json())
  .then(res => {
    data = res;
    render(data);
  });

function render(list) {
  const box = document.getElementById("list");
  box.innerHTML = "";

  list.forEach(item => {
    const div = document.createElement("div");
    div.className = "card";

    if(item.sold) div.classList.add("sold");

    div.innerHTML = `
      <h3>${format(item.number)}</h3>
      <p>${item.sold ? "已售出" : (item.price ? "$"+item.price : "咨询")}</p>
    `;

    div.onclick = () => {
      if(item.sold) return alert("该号码已售出");
      openModal(item.number);
    };

    box.appendChild(div);
  });
}

function format(num){
  return num.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
}

/* 搜索 */
document.getElementById("searchInput").oninput = function(){
  const val = this.value;
  render(data.filter(d => d.number.includes(val)));
};

/* 分类 */
function filterType(type){
  if(type === "all") return render(data);

  if(type === "triple"){
    return render(data.filter(d => /(\\d)\\1\\1/.test(d.number)));
  }

  if(type === "quad"){
    return render(data.filter(d => /(\\d)\\1\\1\\1/.test(d.number)));
  }

  if(type === "straight"){
    return render(data.filter(d => "1234567890".includes(d.number)));
  }
}

/* 弹窗 */
function openModal(num){
  document.getElementById("modalNumber").innerText = num;
  document.getElementById("modal").style.display = "block";
}

function closeModal(){
  document.getElementById("modal").style.display = "none";
}

function openContact(){
  openModal("联系客服");
}