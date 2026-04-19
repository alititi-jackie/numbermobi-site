let data = [];
let current = [];

fetch("./data/numbers.json")
  .then(r => r.json())
  .then(res => {
    data = res;
    current = res;
    render(res);
  });

function render(list){
  const box = document.getElementById("list");
  box.innerHTML = "";

  list.forEach(item => {

    const div = document.createElement("div");
    div.className = "card";

    if(item.sold) div.classList.add("sold");
    if(item.hot) div.classList.add("hot");

    div.innerHTML = `
      <h3>${format(item.number)}</h3>
      <div class="price">
        ${item.sold ? "已售出" : (item.price ? "$"+item.price : "咨询")}
      </div>
    `;

    div.onclick = () => {
      if(item.sold){
        alert("该号码已售出");
        return;
      }
      openModal(item.number);
    };

    box.appendChild(div);
  });
}

/* 格式化号码 */
function format(num){
  return num.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
}

/* 搜索 */
document.getElementById("searchInput").oninput = function(){
  const v = this.value;
  const res = data.filter(d => d.number.includes(v));
  render(res);
};

/* 分类 */
function filter(type){

  if(type === "all"){
    return render(data);
  }

  if(type === "hot"){
    return render(data.filter(d => d.hot));
  }

  if(type === "triple"){
    return render(data.filter(d => /(\\d)\\1\\1/.test(d.number)));
  }

  if(type === "quad"){
    return render(data.filter(d => /(\\d)\\1\\1\\1/.test(d.number)));
  }
}

/* 弹窗 */
function openModal(num){
  document.getElementById("m-number").innerText = num;
  document.getElementById("modal").style.display = "block";
}

function closeModal(){
  document.getElementById("modal").style.display = "none";
}

function openContact(){
  openModal("联系客服");
}