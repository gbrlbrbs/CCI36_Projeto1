import './style.css';
import * as THREE from 'three';

let camera, scene, renderer;
let silhouette_id;

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

    const v1 = ([-10,0,0]);
    const v2 = ([-2,0,0]);
    const v3 = ([6,0,0]);
    const v4 = ([6,8,0]);
    const v5 = ([6,16,0]);
    const v6 = ([-10,16,0]);
    const v7 = ([-6,4,0]);
    const v8 = ([-2,8,0]);
    const v9 = ([2,12,0]);
    const v10 =([2,4,0]);
    
    const v11 = ([8, 0, -0.001]);
    const v12 = ([30.3137, 0, -0.001]);
    const v13 = ([30.3137, 11.3137, -0.001]);
    const v14 = ([8, 11.3137, -0.001]);

    //silhueta
    const silhueta = new THREE.BufferGeometry();
    const silhueta_concat = Float32Array.of(...v11,...v12, ...v13, ...v13, ...v14,...v11);
    silhueta.setAttribute('position', new THREE.BufferAttribute(silhueta_concat, 3));
    const material_silhueta = new THREE.MeshBasicMaterial({ color: 0xdcdcdc});
    const mesh_silhueta = new THREE.Mesh(silhueta, material_silhueta);
    silhouette_id = mesh_silhueta.id;
    scene.add(mesh_silhueta);

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

function animate() {

  requestAnimationFrame(animate);
  renderer.render(scene, camera);

}

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var plane = new THREE.Plane();
var pNormal = new THREE.Vector3(0, 0, 1); // plane's normal
var planeIntersect = new THREE.Vector3(); // point of intersection with the plane
var pIntersect = new THREE.Vector3(); // point of intersection with an object (plane's point)
var shift = new THREE.Vector3(); // distance between position of an object and points of intersection with the object
var is_dragging = false;
var is_rotating = false;
var drag_object;


// events
document.addEventListener("pointermove", event => {

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
      
    if (is_dragging) {
        raycaster.ray.intersectPlane(plane, planeIntersect);
        drag_object.position.addVectors(planeIntersect, shift);
    }
});

document.addEventListener("pointerdown", () => {
    var intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0 && intersects[0].object.id != silhouette_id) {
        drag_object = intersects[0].object;
        pIntersect.copy(intersects[0].point);
        plane.setFromNormalAndCoplanarPoint(pNormal, pIntersect);
        shift.subVectors(intersects[0].object.position, intersects[0].point);
        is_dragging = true;
        is_rotating = true;
    }
});

document.addEventListener("pointerup", () => {
    is_dragging = false;
    is_rotating = false;
    drag_object = null;
} );

document.addEventListener("wheel", (event) => {
    if (is_rotating) {
        event.preventDefault();
        event.stopPropagation();
        drag_object.rotation.z += event.deltaY * 0.3E-3;
    }
}, {passive: false});