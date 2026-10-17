const cl = console.log;
const spinner = document.getElementById("spinner");
const todoContainer = document.getElementById("todoContainer");
const form = document.getElementById("form");
const todoControl = document.getElementById("todo");
const submitBtn = document.getElementById("submitBtn");
const  updateBtn= document.getElementById("updateBtn");

//url
let BASE_URL = "https://fetch-api-crud-e52ad-default-rtdb.asia-southeast1.firebasedatabase.app"
let todo_URL = `${BASE_URL}/todo4.json`
//spinner
function togglespinner(){
spinner.classList.toggle("d-none");
}
//swalfire
function snackBar(msg, icon){
    Swal.fire({
        text:msg,
        icon:icon,
        timer:2500
    })
}
//state
const state ={
    todoArr :[],
    edit_id : null
}
//nested obj to array of obj
function objToArr(obj){
     todoArr :[];
     let todo = Object.entries(obj);
     todo.map((ele)=>{
        ele[1].id = ele[0];
        state.todoArr.push(ele[1])
     }
    )
}
//read
function showOnUi(){
 togglespinner();
 fetch(todo_URL,{
    method:"GET",
    body:null,
    headers:{
        "content-type":"application/json",
        "authorization":"JWT token"
    }
 })
 .then((res)=>{
   return res.json()
 })
  .then((data)=>{
    cl(data);
    objToArr(data)
  templeting(state.todoArr)
   snackBar("data fetched successfully","success")
 })
  .catch((err)=>{
     snackBar("something went wrong");
 })
  .finally(()=>{
    togglespinner();
 })
}
//templeting
function templeting(arr){
  let result =``;
  arr.forEach(ele => {
    result +=  `<div class="col-md-4 mb-3" id="${ele.id}">
                <ul class="list-group">
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <strong>${ele.todoItem}</strong>
                        <div>
                            <i onclick="onEdit(this)" class="fa-solid fa-pen-to-square fa-lg text-primary mr-3"></i>
                            <i onclick="onRemove(this)" class="fa-solid fa-trash fa-lg text-danger"></i>
                        </div>
                    </li>
                </ul>
            </div>`
  });
  todoContainer.innerHTML = result;
}
showOnUi()

//create 
function onAddTodo(eve){
    eve.preventDefault();
    let newObj = {
     todoItem :todoControl.value
    }
    togglespinner();
    fetch(todo_URL,{
    method:"POST",
    body:JSON.stringify(newObj),
    headers:{
        "content-type":"application/json",
        "authorization":"JWT token"
    }
 })
 .then((res)=>{
   return res.json()
 })
  .then((data)=>{
    cl(data);
   newObj.id = data.name;
 state.todoArr.push(newObj);
 let div = document.createElement("div");
 div.id = data.name;
 div.className = "col-md-4 mb-3";
 div.innerHTML =    ` <ul class="list-group">
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <strong>${newObj.todoItem}</strong>
                        <div>
                            <i onclick="onEdit(this)" class="fa-solid fa-pen-to-square fa-lg text-primary mr-3"></i>
                            <i onclick="onRemove(this)" class="fa-solid fa-trash fa-lg text-danger"></i>
                        </div>
                    </li>
                </ul>`
 todoContainer.append(div);
 form.reset();
 snackBar("your todo is added successfully","success")
 })
  .catch((err)=>{
     snackBar("something went wrong");
 })
  .finally(()=>{
    togglespinner();
 })
}
//edit
function onEdit(ele){
    let Edit_id = ele.closest(".col-md-4").id;
    cl(Edit_id)
    state.edit_id = Edit_id;
    let edit_obj = state.todoArr.find(obj=> obj.id === Edit_id);
    cl(edit_obj);
    todoControl.value = edit_obj.todoItem;
    submitBtn.classList.add("d-none");
    updateBtn.classList.remove("d-none");
}
//update
function onUpdate(eve){
 let update_Id = state.edit_id;
 let update_url = `${BASE_URL}/todo4/${update_Id}.json`
 let update_Obj ={
     todoItem :todoControl.value,
     id: update_Id
 }
 togglespinner();
 fetch(update_url,{
    method:"PATCH",
    body:JSON.stringify(update_Obj),
    headers:{
        "content-type":"application/json",
        "authontication":"JWT token"
    }
 })
 .then((res)=>{
   return res.json()
 })
  .then((data)=>{
    cl(data);
   let getIndex = state.todoArr.findIndex(obj=> obj.id === update_Id);
   state.todoArr[getIndex] = update_Obj;
   let li = document.getElementById(update_Id);
   li.querySelector("strong").innerHTML = update_Obj.todoItem;
   form.reset();
     submitBtn.classList.remove("d-none");
    updateBtn.classList.add("d-none");
     snackBar("your todo is updated successfully","success")
 })
  .catch((err)=>{
     snackBar("something went wrong");
 })
  .finally(()=>{
    togglespinner();
 })
}
//delete
function onRemove(ele){
   Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed){
 let remove_id = ele.closest(".col-md-4").id;
 let remove_url = `${BASE_URL}/todo4/${remove_id}.json`
 togglespinner();
 fetch(remove_url,{
    method:"DELETE",
    body:null,
    headers:{
        "content-type":"application/json",
        "authontication":"JWT token"
    }
 })
 .then((res)=>{
   return res.json()
 })
  .then((data)=>{
    cl(data);
   let getIndex = state.todoArr.findIndex(obj=> obj.id === remove_id);
   state.todoArr.splice(getIndex, 1);
   ele.closest(".col-md-4").remove();
    snackBar("your todo is deleted successfully","success")
 })
  .catch((err)=>{
     snackBar(err.message,"error");
 })
  .finally(()=>{
    togglespinner();
 })
  }
}); 
}

updateBtn.addEventListener("click",onUpdate);
form.addEventListener("submit",onAddTodo);
