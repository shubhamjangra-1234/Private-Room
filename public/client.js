const socket = io()
let name;
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message__area')
let bar = document.querySelector(".bar")
let head = document.querySelector(".head")
do{
    name = prompt("enter your name");
   }
  while(!name)
function light(){
    // messageArea.style.backgroundColor = "#111827";
    messageArea.style.background = `url("https://i.pinimg.com/originals/85/ec/df/85ecdf1c3611ecc9b7fa85282d9526e0.jpg")`;
    

}
function dark(){
    // messageArea.style.backgroundColor = "lightblue";
    messageArea.style.background = `url("https://img.freepik.com/premium-vector/dialogue-balloon-chat-bubble-icons-seamless-pattern-textile-pattern-wrapping-paper-linear-vector-print-fabric-seamless-background-wallpaper-backdrop-with-speak-bubbles-chat-message-frame_8071-58894.jpg")`;


}
// Toggle dropdown menu
function toggleDropdown() {
    document.getElementById("dropdown").classList.toggle("hidden");
}

textarea.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
        sendMessage(e.target.value)
    }
})

function sendMessage(message) {
    let msg = {
        user: name,
        message: message.trim()
    }
    // Append 
    appendMessage(msg, 'outgoing')
    textarea.value = ''
    scrollToBottom()

    // Send to server 
    socket.emit('message', msg)

}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, 'message')

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
}

// Receive messages 
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming')
    scrollToBottom()
})

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}

// clock
setInterval(() => {
    a = new Date();
    time = a.getHours() + ":" + a.getMinutes() + ":" + a.getSeconds();
    document.getElementById("time").innerHTML = time ;
  }, 1000);
 

