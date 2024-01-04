import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

/**
 * Base
 */
let guiValues = { text: "Hello Three.js" };
let font;
let camera, scene, controls, renderer;

let group, textGeometry, textMesh, material, matcapTexture;

// Debug
const gui = new GUI();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

init();
animate();

function init() {
  // Canvas
  const canvas = document.querySelector("canvas.webgl");

  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.x = 1;
  camera.position.y = 1;
  camera.position.z = 2;
  scene.add(camera);

  // Controls
  controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  // Render
  renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  //Group
  gui
    .add(guiValues, "text")
    .name("Text")
    .onChange((newText) => {
      guiValues.text = newText;
      refreshText();
    });

  loadTextures();
  loadFont();

  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 40);
  material = new THREE.MeshMatcapMaterial();
  material.matcap = matcapTexture;

  for (let i = 0; i < 300; i++) {
    const donut = new THREE.Mesh(donutGeometry, material);
    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();
    donut.scale.set(scale, scale, scale);
    scene.add(donut);
  }
}

function animate() {
  window.requestAnimationFrame(animate);

  render();
}

function render() {
  // Update controls
  controls.update();
  // Render
  renderer.render(scene, camera);
}

function loadTextures() {
  const textureLoader = new THREE.TextureLoader();
  matcapTexture = textureLoader.load("/textures/matcaps/custom.png");
  matcapTexture.colorSpace = THREE.SRGBColorSpace;
}

function loadFont() {
  const loader = new FontLoader();
  loader.load("/fonts/optimer_regular.typeface.json", function (response) {
    font = response;
    refreshText();
  });
}

function refreshText() {
  scene.remove(textMesh);

  if (!guiValues.text) return;

  createText();
}

function createText() {
  textGeometry = new TextGeometry(guiValues.text, {
    font,
    size: 0.5,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });
  textGeometry.center();

  material = new THREE.MeshMatcapMaterial();
  material.matcap = matcapTexture;
  textMesh = new THREE.Mesh(textGeometry, material);
  scene.add(textMesh);
}

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
