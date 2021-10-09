const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const enterRoomBtn = form.querySelector("button");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You : ${input.value}`);
    input.value = "";
  });
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#name input");
  socket.emit("nickname", input.value);
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const msgForm = room.querySelector("#msg");
  //const nameForm = room.querySelector("#name");
  msgForm.addEventListener("submit", handleMessageSubmit);
  //nameForm.addEventListener("submit", handleNicknameSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const roomnameInput = form.querySelector("#roomname");
  const nicknameInput = form.querySelector("#nickname");
  socket.emit("enter_room", roomnameInput.value, nicknameInput.value, showRoom);
  roomName = roomnameInput.value;
  roomnameInput.value = "";
  nicknameInput.value = "";
}

//form.addEventListener("submit", handleRoomSubmit);

enterRoomBtn.addEventListener("click", handleRoomSubmit);

socket.on("welcome", (user) => {
  addMessage(`${user} arrived!`);
});

socket.on("bye", (left) => {
  addMessage(`${left} left ㅠㅠ`);
});

socket.on("new_message", addMessage);
