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

    const v1 = new THREE.Vector3(-10,0,0);
    const v2 = new THREE.Vector3(-2,0,0);
    const v3 = new THREE.Vector3(6,0,0);
    const v4 = new THREE.Vector3(6,8,0);
    const v5 = new THREE.Vector3(6,16,0);
    const v6 = new THREE.Vector3(-10,16,0);
    const v7 = new THREE.Vector3(-6,4,0);
    const v8 = new THREE.Vector3(-2,8,0);
    const v9 = new THREE.Vector3(2,12,0);
    const v10 = new THREE.Vector3(2,4,0);
    
    const v11 = new THREE.Vector3(8, 0, -0.001);
    const v12 = new THREE.Vector3(30.3137, 0, -0.001);
    const v13 = new THREE.Vector3(30.3137, 11.3137, -0.001);
    const v14 = new THREE.Vector3(8, 11.3137, -0.001);

    //silhueta
    const silhueta = create_mesh([v11, v12, v13, v13, v14, v11], 0xdcdcdc);
    scene.add(silhueta);

    //square
    const square = create_mesh([v2, v10, v8, v8, v7, v2], 0xff0000);
    scene.add(square);

    //little triangle 1
    const little_triangle1 = create_mesh([v1, v2, v7], 0xffff00);
    scene.add(little_triangle1);

    //little triangle 2
    const little_triangle2 = create_mesh([v10, v9, v8], 0xffffff);
    scene.add(little_triangle2);

    //medium triangle
    const medium_triangle = create_mesh([v2, v3, v4], 0x0000ff);
    scene.add(medium_triangle);

    //large triangle 1
    const large_triangle1 = create_mesh([v1, v8, v6], 0x0000ff);
    scene.add(large_triangle1);

    //large triangle 2
    const large_triangle2 = create_mesh([v6, v8, v5], 0x00ffff);
    scene.add(large_triangle2);

    //parallelogram
    const parallelogram = create_mesh([v9, v10, v4, v4, v5, v9], 0xffff00);
    scene.add(parallelogram);
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
var drag_object = new THREE.Object3D();


// events
document.addEventListener("pointermove", event => {

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
      
    if (is_dragging) {
        var intersection = raycaster.ray.intersectPlane(plane, planeIntersect);
        drag_object.geometry.computeBoundingBox();
        drag_object.geometry.center();
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
        drag_object.rotateOnAxis(pNormal, event.deltaY * 0.3E-3);
    }
}, {passive: false});

function create_mesh(list_of_vectors, color) {
    const geom = new THREE.BufferGeometry();
    const concat_array = list_of_vectors.map(x => x.toArray()).flat(1);
    const concat_array_typed = Float32Array.from(concat_array);
    geom.setAttribute('position', new THREE.BufferAttribute(concat_array_typed, 3));
    const material = new THREE.MeshBasicMaterial({color: color});
    const mesh = new THREE.Mesh(geom, material);
    mesh.updateMatrixWorld();
    mesh.geometry.computeBoundingBox();
    var center = new THREE.Vector3();
    mesh.geometry.boundingBox.getCenter(center);
    // console.log(center);
    mesh.geometry.center();
    mesh.position.add(center);
    return mesh
}

function point_in_polygon(point, polygon) {
    var n = polygon.lenght;
    var count = 0;
    var x = point[0];
    var y = point[1];
  
    for (var i = 0; i < n - 1; n++) {
      var side = {
        a: {
          x: polygon[i][0],
          y: polygon[i][1]
        },
        b: {
          x: polygon[i + 1][0],
          y: polygon[i + 1][1]
        }
      }
      var x1 = side.a.x,
        x2 = side.b.x,
        y1 = side.a.y,
        y2 = side.b.y;
      
      if (y < y1 != y < y2 && x < (x2 - x1)*(y - y1)/(y2 - y1)+x1){
        count += 1;
      }
    }
    return count % 2 == 0 ? false : true;
  }

  function clip (subjectPolygon, clipPolygon) {
            
    var cp1, cp2, s, e;
    var inside = function (p) {
        return (cp2[0]-cp1[0])(p[1]-cp1[1]) > (cp2[1]-cp1[1])(p[0]-cp1[0]);
    };
    var intersection = function () {
        var dc = [ cp1[0] - cp2[0], cp1[1] - cp2[1] ],
            dp = [ s[0] - e[0], s[1] - e[1] ],
            n1 = cp1[0] * cp2[1] - cp1[1] * cp2[0],
            n2 = s[0] * e[1] - s[1] * e[0], 
            n3 = 1.0 / (dc[0] * dp[1] - dc[1] * dp[0]);
        return [(n1*dp[0] - n2*dc[0]) * n3, (n1*dp[1] - n2*dc[1]) * n3];
    };
    var outputList = subjectPolygon;
    cp1 = clipPolygon[clipPolygon.length-1];
    for (var j in clipPolygon) {
        cp2 = clipPolygon[j];
        var inputList = outputList;
        outputList = [];
        s = inputList[inputList.length - 1]; //last on the input list
        for (var i in inputList) {
            e = inputList[i];
            if (inside(e)) {
                if (!inside(s)) {
                    outputList.push(intersection());
                }
                outputList.push(e);
            }
            else if (inside(s)) {
                outputList.push(intersection());
            }
            s = e;
        }
        cp1 = cp2;
    }
    return outputList
}