import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

// --- CONTENIDO ---
const textos = [
    "Amo el brillo de tus ojos. Amo cuando sonríes genuinamente aunque en ese video estabas un poco ebrio xd",
    "Todas las videollamadas divertidas o enseñándome las valoro mucho. Gracias bb te amoooo :3",
    "Cuando me esperabas en la u con un chocolatito, tal vez no decía gracias seguido pero me hacías feliz inmensamente. Demuestra la dulzura de tu corazón",
    "Sé que ese día teníamos planeado otra cosa que termino siendo otra pero aun asi al estar juntos siento que fue un buen día te amo, espero haberte hecho feliz amor, estoy ansiosa por mas cumpleaños juntos",
    "Nuestro primer emprendimiento juntos, los TURRONES xdd.",
    "Nuestro primer paseíto juntooos. Bonito día riéndonos dándonos besitos y más. Habrán mas días así amor",
    "En el parque de las aguas xd, esperando durante el hueco, tú dándome besitos es algo lindooo te amooo",
    "El ultimo día para ti como estudiante en la u, te esperan grandes cosas amor mío. Éxitos siempre, estaré a tu lado para apoyarte y aplaudirte.",
    "Comimos popeyes, debemos dejar de hacerlo. Próximo año a ganar masa muscular y no grasa amor jajaja :)",
    "Otra vez te agradezco por toda la comida rica que me compraste el 2025 estuvo deliiii",
    "Esperando el ramen xd. Gracias por todas las comidas mi amor, las disfruté mucho a tu lado gracias por hacerme muy feliz",
    "Gracias por estar a mi lado enseñándome o haciendo mi tarea xd. Aunque a veces estaba estresada y solía gritar fuiste paciente comprensivo y me apoyaste. Es algo que agradeceré toda la vida con amor. Te lo retribuiré",
    "Mis primeras flores y las flores de mi cumple, tus cartoitas hechas a mano tan lindas pero mas el contenido. Ese dia recuerdo haber llorado al leerla pero de felicidad me sentí tan amada como nunca mi amor. Te amooo",
    "Acompañándome a todos lados solo demuestra que eres alguien comprometido y por eso te amo. Aunque tengas cosas en que trabajar. La mayor parte en ti es buena no olvides eso.",
    "Haciéndote el skincare, aunque ahí pareces pervertido jajaja te amo",
    "Mi primer Santiago, nunca habría ido a uno sino fuera por ti.. me hiciste sentir cómoda al estar a mi lado todo el tiempo gracias bb"
];

const items = textos.map((t, i) => ({
    src: i === 0 ? 'img/1.mp4' : `img/${i + 1}.jpeg`,
    type: i === 0 ? 'video' : 'img',
    text: t
}));

// --- ESCENA ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimización para móviles
document.getElementById('container').appendChild(renderer.domElement);

const mainGroup = new THREE.Group();
scene.add(mainGroup);
scene.add(new THREE.AmbientLight(0xffffff, 0.8), new THREE.PointLight(0xffffff, 30));

const colores = [0xffb7ce, 0xcaf0f8, 0xe2f0cb, 0xffdac1, 0xe0bbe4, 0xff9aa2];
const palabras = ["AMOR", "GUAPO", "BONDAD", "DULCE", "LEAL", "UNICO", "FUERTE", "BELLO", "MIO", "CIELO", "VALIENTE", "SINCERO", "ALEGRE", "MAGIA", "TESORO", "LUZ"];

const loader = new FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
    palabras.forEach((txt, i) => {
        const geo = new TextGeometry(txt, { font, size: 0.3, height: 0.1 });
        const mat = new THREE.MeshPhongMaterial({ color: colores[i % colores.length] });
        for (let j = 0; j < 3; j++) {
            const mesh = new THREE.Mesh(geo, mat);
            let y = (i * 0.5) - 3.8;
            let rad = 4 - (i * 0.22);
            let ang = (j * Math.PI * 2 / 3) + (i * 0.4);
            mesh.position.set(Math.cos(ang) * rad, y, Math.sin(ang) * rad);
            mesh.lookAt(0, y, 0);
            mainGroup.add(mesh);
        }
    });
    const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.7, 0), new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xffd700, emissiveIntensity: 2 }));
    star.position.y = 4.5; star.name = "star"; mainGroup.add(star);
});

const esferas = [];
for (let i = 0; i < 16; i++) {
    const mat = new THREE.MeshPhysicalMaterial({ color: colores[i % colores.length], transmission: 1, thickness: 1.2, roughness: 0.05, transparent: true, opacity: 0.8 });
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.38, 32, 32), mat);
    let ang = i * (Math.PI * 4 / 16); let y = (i * 0.52) - 3.8; let rad = 4.7 - (i * 0.2);
    sphere.position.set(Math.cos(ang) * rad, y, Math.sin(ang) * rad);
    sphere.userData = items[i];
    mainGroup.add(sphere); esferas.push(sphere);
}

// Función para ajustar cámara según el tamaño de pantalla
function updateCamera() {
    camera.aspect = window.innerWidth / window.innerHeight;
    // Si la pantalla es vertical (móvil), alejamos la cámara
    camera.position.z = window.innerWidth < 600 ? 16 : 12;
    camera.position.y = window.innerWidth < 600 ? 1 : 1;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', updateCamera);
updateCamera();

// --- INTERACCIÓN ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onPointerDown(e) {
    const x = e.clientX || (e.touches && e.touches[0].clientX);
    const y = e.clientY || (e.touches && e.touches[0].clientY);
    mouse.x = (x / window.innerWidth) * 2 - 1;
    mouse.y = -(y / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(esferas);
    if (intersects.length > 0) {
        const data = intersects[0].object.userData;
        const container = document.getElementById('mediaContainer');
        container.innerHTML = data.type === 'video' ? `<video src="${data.src}" autoplay loop muted playsinline></video>` : `<img src="${data.src}">`;
        document.getElementById('modalText').innerText = data.text;
        document.getElementById('modal').classList.remove('hidden');
    }
}
window.addEventListener('mousedown', onPointerDown);
window.addEventListener('touchstart', onPointerDown);

// Playlist y botones
document.getElementById('playlist-icon').onclick = (e) => { e.stopPropagation(); document.getElementById('playlist-menu').classList.toggle('hidden'); };
document.querySelectorAll('#audio-list li').forEach(li => {
    li.onclick = (e) => {
        e.stopPropagation();
        const audio = document.getElementById('mainAudio');
        audio.src = li.getAttribute('data-src');
        audio.play();
        document.getElementById('playlist-menu').classList.add('hidden');
    };
});
document.getElementById('btnLeeme').onclick = () => document.getElementById('cardContainer').classList.add('flipped');
document.getElementById('btnCerrar').onclick = () => { document.getElementById('modal').classList.add('hidden'); document.getElementById('cardContainer').classList.remove('flipped'); };

// --- CORAZONES ---
const heartCanvas = document.getElementById('heartCanvas');
const ctx = heartCanvas.getContext('2d');
function resizeHeartCanvas() { heartCanvas.width = window.innerWidth; heartCanvas.height = window.innerHeight; }
window.addEventListener('resize', resizeHeartCanvas);
resizeHeartCanvas();

let hearts = [];
class Heart {
    constructor() { this.reset(); }
    reset() { this.x = Math.random() * heartCanvas.width; this.y = -20; this.size = Math.random() * 8 + 5; this.speed = Math.random() * 1 + 0.5; this.opacity = Math.random() * 0.5 + 0.2; }
    update() { this.y += this.speed; if (this.y > heartCanvas.height) this.reset(); }
    draw() { ctx.fillStyle = `rgba(255, 182, 193, ${this.opacity})`; ctx.beginPath(); ctx.moveTo(this.x, this.y); ctx.bezierCurveTo(this.x - this.size, this.y - this.size, this.x - this.size*1.5, this.y + this.size, this.x, this.y + this.size*1.5); ctx.bezierCurveTo(this.x + this.size*1.5, this.y + this.size, this.x + this.size, this.y - this.size, this.x, this.y); ctx.fill(); }
}
for(let i=0; i<30; i++) hearts.push(new Heart());

function animate() {
    requestAnimationFrame(animate);
    mainGroup.rotation.y += 0.004;
    esferas.forEach((s, i) => { s.material.opacity = 0.4 + Math.sin(Date.now() * 0.004 + i) * 0.4; });
    const star = scene.getObjectByName("star");
    if(star) { star.rotation.y += 0.02; star.material.emissiveIntensity = 1.5 + Math.sin(Date.now() * 0.005) * 1; }
    ctx.clearRect(0, 0, heartCanvas.width, heartCanvas.height);
    hearts.forEach(h => { h.update(); h.draw(); });
    renderer.render(scene, camera);
}
animate();