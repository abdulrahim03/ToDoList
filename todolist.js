let inputTag = document.getElementById("todo");
let addBtn = document.getElementById("addbtn");
let markBtn = document.getElementById("markbtn");
let ulTag = document.getElementById("ul");
let editID;
function onSubmit() {
  let data = JSON.parse(localStorage.getItem("Tasks")) || [];
  if (data?.length > 0) {
    let isFound = data.some(
      (item) => item?.task?.toLowerCase() == inputTag.value.toLowerCase()
    );
    if (isFound) {
      alert("Task already exists");
      return;
    }
  }
  let id = Math.round(Math.random() * 10000);
  this.createElements(inputTag.value, id, false);
  let obj = {
    id: id,
    mark: false,
    complete: false,
    task: inputTag.value,
  };
  data.push(obj);
  localStorage.setItem("Tasks", JSON.stringify(data));
  inputTag.value = "";
}

function createElements(value, id, mark) {
  let lblTag = document.createElement("label");
  let lblspanTag = document.createElement("span");

  let hrTag = document.createElement("hr");
  let liTag = document.createElement("li");

  let listDiv = document.createElement("div");
  let checkTag = document.createElement("input");
  let idSpanTag = document.createElement("span");
  let spanTag = document.createElement("span");

  let btnDiv = document.createElement("div");
  let btnEdit = document.createElement("button");
  let btnDel = document.createElement("button");

  checkTag.type = "checkbox";
  spanTag.textContent = value;
  idSpanTag.textContent = id;

  checkTag.classList.add("check");
  lblspanTag.classList.add("lblspantick");
  lblTag.classList.add("lbluncheck");
  idSpanTag.classList.add("listidspan");
  spanTag.classList.add("listspan");
  btnEdit.classList.add("listbtnEdit");
  btnDel.classList.add("listbtnDel");
  liTag.classList.add("listclass");
  listDiv.classList.add("listDiv");
  btnDiv.classList.add("btndiv");
  if (mark) spanTag.classList.add("marktask");

  checkTag.id = `check_${id}`;
  lblTag.setAttribute("for", checkTag.id);

  lblTag.appendChild(lblspanTag);
  listDiv.appendChild(lblTag);
  listDiv.appendChild(checkTag);

  listDiv.appendChild(idSpanTag);
  listDiv.appendChild(spanTag);
  btnDiv.appendChild(btnEdit);
  btnDiv.appendChild(btnDel);

  liTag.appendChild(listDiv);
  liTag.appendChild(btnDiv);

  ulTag.appendChild(liTag);
  ulTag.appendChild(hrTag);

  checkTag.addEventListener("change", function () {
    let litag = this.closest("li");
    let lblTag = litag.querySelector("label");
    let spanTag = litag.querySelectorAll("span");
    if (checkTag.checked) {
      lblTag.classList.add("lblchecked");
      lblTag.classList.remove("lbluncheck");
    } else {
      lblTag.classList.remove("lblchecked");
      lblTag.classList.add("lbluncheck");
    }
    let data = JSON.parse(localStorage.getItem("Tasks")) || [];
    if (data?.length > 0) {
      data.forEach((item) => {
        if (item.id == spanTag[1].textContent) {
          item.mark = checkTag.checked;
        }
      });
    }
    localStorage.setItem("Tasks", JSON.stringify(data));
  });

  btnEdit.addEventListener("click", function () {
    let litag = this.closest("li");
    let spanTag = litag.querySelectorAll("span");
    editID = spanTag[1].textContent;
    inputTag.value = spanTag[2].textContent;
    addBtn.innerHTML = "Edit";
  });

  btnDel.addEventListener("click", function () {
    let confirmPopup = confirm("Are you sure to delete?");
    if (confirmPopup) {
      let itemMarked = false;
      let newData = [];
      let data = JSON.parse(localStorage.getItem("Tasks")) || [];
      if (data?.length > 0) {
        data.forEach((item) => {
          if (!item.mark) {
            newData.push(item);
          } else {
            itemMarked = true;
          }
        });
      }
      if (!itemMarked) {
        alert("Please select any item!");
      }
      localStorage.setItem("Tasks", JSON.stringify(newData));
      ulTag.replaceChildren();
      newData.forEach((item) => {
        createElements(item.task, item.id, item.complete);
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  let data = JSON.parse(localStorage.getItem("Tasks")) || [];
  if (data?.length > 0) {
    data.forEach((item) => {
      createElements(item.task, item.id, item.complete);
    });
  }

  addBtn.addEventListener("click", function () {
    if (inputTag.value == "") {
      alert("Please enter the task!");
      return;
    }
    if (this.innerHTML == "Edit") {
      let data = JSON.parse(localStorage.getItem("Tasks")) || [];
      if (data?.length > 0) {
        data.forEach((item) => {
          if (item.id == editID) {
            item.task = inputTag.value;
          }
        });
      }
      localStorage.setItem("Tasks", JSON.stringify(data));
      ulTag.replaceChildren();
      data.forEach((item) => {
        createElements(item.task, item.id, item.complete);
      });
      inputTag.value = "";
      addBtn.innerHTML = "Add";
    } else {
      onSubmit();
    }
  });

  markBtn.addEventListener("click", function () {
    let confirmPopup = confirm("Are you sure to mark the items?");
    if (confirmPopup) {
      let itemMarked = false;
      let data = JSON.parse(localStorage.getItem("Tasks")) || [];
      if (data?.length > 0) {
        data.forEach((item) => {
          if (item.mark) {
            item.complete = item.mark;
            itemMarked = true;
            item.mark = false;
          }
        });
      }
      if (!itemMarked) {
        alert("Please select any item!");
      }
      localStorage.setItem("Tasks", JSON.stringify(data));
      ulTag.replaceChildren();
      data.forEach((item) => {
        createElements(item.task, item.id, item.complete);
      });
    }
  });
});
