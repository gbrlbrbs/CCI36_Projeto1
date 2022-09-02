import './style.css';
import * as THREE from 'three';

let camera, scene, renderer;
const canvas = document.querySelector('bg');
var is_dragging = false;

init();
animate();

function init() {

  //creating canvas
  renderer = new THREE.WebGLRenderer
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  scene.background = new THREE.Color('#add8e6');

  camera = new THREE.PerspectiveCamera(
    85, 
    window.innerWidth / window.innerHeight, 
    0.01, 
    100);
  camera.position.z = 15;
  camera.position.y = 10;
  camera.position.x = 5;
  
  //const axesHelper = new THREE.AxesHelper(2);
  //scene.add(axesHelper);

  //renderer.render(scene, camera);

  const v1 = ([0,0,0]);
  const v2 = ([8,0,0]);
  const v3 = ([16,0,0]);
  const v4 = ([16,8,0]);
  const v5 = ([16,16,0]);
  const v6 = ([0,16,0]);
  const v7 = ([4,4,0]);
  const v8 = ([8,8,0]);
  const v9 = ([12,12,0]);
  const v10 =([12,4,0]);

  //square
  const square = new THREE.BufferGeometry();
  const vsquare_concat = Float32Array.of(...v2, ...v10, ...v8, ...v8, ...v7, ...v2);
  square.setAttribute('position', new THREE.BufferAttribute(vsquare_concat, 3));
  const material_square = new THREE.MeshBasicMaterial({color: 0xff0000});
  const mesh_square = new THREE.Mesh(square, material_square);
  scene.add(mesh_square);

   //little triangle 1
   const little_triangle1 = new THREE.BufferGeometry();
   const little_triangle1_concat = Float32Array.of(...v1, ...v2, ...v7);
   little_triangle1.setAttribute('position', new THREE.BufferAttribute(little_triangle1_concat, 3));
   const material_little_triangle1 = new THREE.MeshBasicMaterial({color: 0xffff00});
   const mesh_little_triangle1 = new THREE.Mesh(little_triangle1, material_little_triangle1);
   scene.add(mesh_little_triangle1);

  //little triangle 2
   const little_triangle2 = new THREE.BufferGeometry();
   const little_triangle2_concat = Float32Array.of(...v10, ...v9, ...v8);
   little_triangle2.setAttribute('position', new THREE.BufferAttribute(little_triangle2_concat, 3));
   const material_little_triangle2 = new THREE.MeshBasicMaterial({color: 0xffffff});
   const mesh_little_triangle2 = new THREE.Mesh(little_triangle2, material_little_triangle2);
   scene.add(mesh_little_triangle2);

   //medium triangle
   const medium_triangle = new THREE.BufferGeometry();
   const medium_triangle_concat = Float32Array.of(...v2, ...v3, ...v4);
   medium_triangle.setAttribute('position', new THREE.BufferAttribute(medium_triangle_concat, 3));
   const material_medium_triangle = new THREE.MeshBasicMaterial({color: 0x0000ff});
   const mesh_medium_triangle= new THREE.Mesh(medium_triangle, material_medium_triangle);
   scene.add(mesh_medium_triangle);

  //large triangle 1
   const large_triangle1 = new THREE.BufferGeometry();
   const large_triangle1_concat = Float32Array.of(...v1, ...v8, ...v6);
   large_triangle1.setAttribute('position', new THREE.BufferAttribute(large_triangle1_concat, 3));
   const material_large_triangle1 = new THREE.MeshBasicMaterial({color: 0x0000ff});
   const mesh_large_triangle1= new THREE.Mesh(large_triangle1, material_large_triangle1);
   scene.add(mesh_large_triangle1);

  //large triangle 2
   const large_triangle2 = new THREE.BufferGeometry();
   const large_triangle2_concat = Float32Array.of(...v6, ...v8, ...v5);
   large_triangle2.setAttribute('position', new THREE.BufferAttribute(large_triangle2_concat, 3));
   const material_large_triangle2 = new THREE.MeshBasicMaterial({color: 0x00ffff});
   const mesh_large_triangle2= new THREE.Mesh(large_triangle2, material_large_triangle2);
   scene.add(mesh_large_triangle2);

  //paralelogram
   const paralelogram = new THREE.BufferGeometry();
   const paralelogram_concat = Float32Array.of(...v9, ...v10, ...v4, ...v4, ...v5, ...v9);
   paralelogram.setAttribute('position', new THREE.BufferAttribute(paralelogram_concat, 3));
   const material_paralelogram = new THREE.MeshBasicMaterial({color: 0xffff00});
   const mesh_paralelogram= new THREE.Mesh(paralelogram, material_paralelogram);
   scene.add(mesh_paralelogram);
}

function getCanvasRelativePosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
}

function animate() {

  requestAnimationFrame(animate);
  renderer.render(scene, camera);

}

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var plane = new THREE.Plane();
var pNormal = new THREE.Vector3(0, 1, 0); // plane's normal
var planeIntersect = new THREE.Vector3(); // point of intersection with the plane
var pIntersect = new THREE.Vector3(); // point of intersection with an object (plane's point)
var shift = new THREE.Vector3(); // distance between position of an object and points of intersection with the object
var isDragging = false;
var dragObject;


// events
document.addEventListener("pointermove", event => {

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
      
    if (isDragging) {
        raycaster.ray.intersectPlane(plane, planeIntersect);
        dragObject.position.addVectors(planeIntersect, shift);
    }
});

document.addEventListener("pointerdown", () => {
    var intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        pIntersect.copy(intersects[0].point);
        plane.setFromNormalAndCoplanarPoint(pNormal, pIntersect);
        shift.subVectors(intersects[0].object.position, intersects[0].point);
        isDragging = true;
        dragObject = intersects[0].object;
    }
});

document.addEventListener("pointerup", () => {
    isDragging = false;
    dragObject = null;
} );