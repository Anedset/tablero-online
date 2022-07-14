import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
import { getDatabase, ref, onValue , child, push, update ,remove} from "https://www.gstatic.com/firebasejs/9.8.4/firebase-database.js" ;
window.addEventListener('load',()=>{
  // Eventos raton
  miCanvas.addEventListener('mousedown', empezarDibujo);
  miCanvas.addEventListener('mousemove', dibujarLinea);
  miCanvas.addEventListener('mouseup', pararDibujar);
  // Eventos pantallas táctiles
  miCanvas.addEventListener('touchstart', empezarDibujo);
  miCanvas.addEventListener('touchmove', dibujarLinea);

  retorno() ;

  setInterval(()=>{
    if(ctrl) update_a() ;
    //retorno() ; solo en mysql y php text
    ctrl = false ;
  } , 1000) ;
}) ;

const firebaseConfig = {
  apiKey: "AIzaSyArXW75UjAyXqzkJOiLxEjrHeDcWHOmYo8",
  authDomain: "practicadb-e5743.firebaseapp.com",
  projectId: "practicadb-e5743",
  storageBucket: "practicadb-e5743.appspot.com",
  messagingSenderId: "825258189107",
  appId: "1:825258189107:web:3bbc428afde43b8e189e46"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase();

let [miCanvas ,lineas] = [document.querySelector('#pizarra') ,[]];
let [correccionX ,correccionY ,pintarLinea ,ctrl] = [0 ,0 ,false ,false] ;
// Marca el nuevo punto
let [nuevaPosicionX ,nuevaPosicionY ,posicion] = [0 ,0 ,miCanvas.getBoundingClientRect()];
correccionX = posicion.x;
correccionY = posicion.y;

miCanvas.width = 1200 ;
miCanvas.height = 580 ;

function gC() {
  return parseInt(Math.random() * (256 - 100) + 100) ;
}

function empezarDibujo () {
  pintarLinea = true;
  lineas.push([]);
};

function pararDibujar () {
  pintarLinea = false;
  guardarLinea();
}

function guardarLinea() {
  lineas[lineas.length - 1].push({
    x: nuevaPosicionX,
    y: nuevaPosicionY
  });
}

function dibujarLinea (event) {
  event.preventDefault();
  if (pintarLinea) {
    if (event.changedTouches == undefined) {
      // Versión ratón
      nuevaPosicionX = event.layerX;
      nuevaPosicionY = event.layerY;
    } else {
      // Versión touch, pantalla tactil
      nuevaPosicionX = event.changedTouches[0].pageX - correccionX;
      nuevaPosicionY = event.changedTouches[0].pageY - correccionY;
    }

    // Guarda la linea
    guardarLinea();

    // Redibuja todas las lineas guardadas
    rederizar() ;

    ctrl = true ;
  }
}

function rederizar() {
  const ctx = miCanvas.getContext('2d') ;
  ctx.lineCap = 'round';
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#fff' ;
  lineas.forEach( segmento => {
    ctx.moveTo(segmento[0].x, segmento[0].y);
    segmento.forEach( (punto )=> {
      ctx.beginPath();
      ctx.lineTo(punto.x, punto.y);
      ctx.stroke();
    })
  });
}

function update_a() {
  const vector = JSON.stringify(lineas) ;
  const updates = {};
  updates['/vector/'] = vector;
  update(ref(db), updates);
}

function retorno() {
  const starCountRef = ref(db, `/vector/`);
  onValue(starCountRef, (snapshot) => {
    lineas = JSON.parse(snapshot.val());
    rederizar() ;
  });
}

/*
async function update_a() {
  const formData = new FormData() ;
  formData.append('val',JSON.stringify(lineas)) ;
  const response = await fetch('update_a.php', { method : 'POST' , body: formData}) ;
  const ress = await response.text() ;
  lineas = JSON.parse(ress) ;
}

async function retorno() {
  const response = await fetch('return_a.php') ;
  const data = await response.text() ;
  lineas = JSON.parse(data) ;
  rederizar() ;
}
*/
