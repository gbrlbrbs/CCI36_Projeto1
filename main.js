import './style.css';
import * as THREE from 'three';

let camera, scene, renderer;
let silhouette_vertices;
var locked_ids = [];
var tiles_placed = {};

init();
animate();

function init() {

    //creating canvas
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("wrapper").appendChild(renderer.domElement);

    scene = new THREE.Scene();
    scene.background = new THREE.Color('#add8e6');

    camera = new THREE.PerspectiveCamera(
        89,
        window.innerWidth / window.innerHeight,
        0.01,
        200);
    camera.position.z = 28;
    camera.position.y = 0;
    camera.position.x = 5;


    const v1 = new THREE.Vector3(-25, 0, 0.001);
    const v2 = new THREE.Vector3(-17, 0, 0.001);
    const v3 = new THREE.Vector3(-9, 0, 0.001);
    const v4 = new THREE.Vector3(-9, 8, 0.001);
    const v5 = new THREE.Vector3(-9, 16, 0.001);
    const v6 = new THREE.Vector3(-25, 16, 0.001);
    const v7 = new THREE.Vector3(-21, 4, 0.001);
    const v8 = new THREE.Vector3(-17, 8, 0.001);
    const v9 = new THREE.Vector3(-13, 12, 0.001);
    const v10 = new THREE.Vector3(-13, 4, 0.001);


    const v11 = new THREE.Vector3(40, -10, -0.001);
    const v12 = new THREE.Vector3(34.34, -10, -0.001);
    const v13 = new THREE.Vector3(34.34, -4.34, -0.001);
    const v14 = new THREE.Vector3(34.34, 1.32, -0.001);
    const v15 = new THREE.Vector3(28.68, 6.98, -0.001);
    const v16 = new THREE.Vector3(28.68, 1.32, -0.001);
    const v17 = new THREE.Vector3(28.68, -1.02, -0.001);
    const v18 = new THREE.Vector3(20.68, -1.02, -0.001);
    const v19 = new THREE.Vector3(15.02, -1.02, -0.001);
    const v20 = new THREE.Vector3(15.02, -6.68, -0.001);
    const v21 = new THREE.Vector3(39.99, 18.29, -0.001);
    const v22 = new THREE.Vector3(28.68, 18.29, -0.001);
    const v23 = new THREE.Vector3(17.36, 18.29, -0.001);
    const v24 = new THREE.Vector3(24.68, 22.29, -0.001);
    const v25 = new THREE.Vector3(28.68, 26.29, -0.001);
    const v26 = new THREE.Vector3(32.68, 22.29, -0.001);

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

    //silhueta
    //little triangle 1
    const target_little_triangle1 = create_mesh([v12, v11, v13], 0xdcdcdc);
    scene.add(target_little_triangle1);
    locked_ids.push(target_little_triangle1.id);

    //little triangle 2
    const target_little_triangle2 = create_mesh([v20, v18, v19], 0xdcdcdc);
    scene.add(target_little_triangle2);
    locked_ids.push(target_little_triangle2.id);

    //parallelogram
    const target_parallelogram = create_mesh([v16, v13, v14, v14, v15, v16], 0xdcdcdc);
    scene.add(target_parallelogram);
    locked_ids.push(target_parallelogram.id);

    //medium triangle
    const target_medium_triangle = create_mesh([v18, v17, v15], 0xdcdcdc);
    scene.add(target_medium_triangle);
    locked_ids.push(target_medium_triangle.id);

    //large triangle 1
    const target_large_triangle1 = create_mesh([v15, v21, v22], 0xdcdcdc);
    scene.add(target_large_triangle1);
    locked_ids.push(target_large_triangle1.id);

    //large triangle 2
    const target_large_triangle2 = create_mesh([v15, v22, v23], 0xdcdcdc);
    scene.add(target_large_triangle2);
    locked_ids.push(target_large_triangle2.id);

    //square
    const target_square = create_mesh([v22, v26, v25, v25, v24, v22], 0xdcdcdc);
    scene.add(target_square);
    locked_ids.push(target_square.id);

    silhouette_vertices = [v12, v11, v13, v14, v15, v21, v22, v26, v25, v24, v23, v15, v18, v19, v20, v18, v17, v16, v13, v12].map(x => x.toArray());
    console.log(silhouette_vertices);
}

function animate() {

    var request_id = requestAnimationFrame(animate);

    var vertices_selected = [];
    if (drag_object != null) {

        const position_attribute = drag_object.geometry.getAttribute('position');
        for (var i = 0; i < drag_object.geometry.attributes.position.array.length / 3; ++i) {
            const vertex = new THREE.Vector3();
            vertex.fromBufferAttribute(position_attribute, i);
            drag_object.localToWorld(vertex);
            vertices_selected.push(vertex.toArray());
        }
        console.log(vertices_selected);
        const area_selected = calculate_area(vertices_selected);
        var clipped_polygon = clip(vertices_selected, silhouette_vertices);
        const area_clipped = calculate_area(clipped_polygon);
        if (area_clipped / area_selected > 0.9999) {
            tiles_placed[drag_object.id] = 1;
        } else if (area_clipped / area_selected <= 0.9999 && (drag_object.id in tiles_placed)) {
            tiles_placed[drag_object.id] = 0;
        }
        console.log(tiles_placed);
    }

    if (Object.keys(tiles_placed).length > 0) {
        // end game if tiles_placed.keys().length == 7 and every value is 1 (that is, sum == 7)
        var sum_tiles_placed = Object.values(tiles_placed).reduce((a, b) => a + b, 0);
        if (Object.keys(tiles_placed).length == 7 && sum_tiles_placed == 7) {
            cancelAnimationFrame(request_id);
            var win_screen = document.getElementById("overlay");
            win_screen.style.display = "block";
        }

    }

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
document.addEventListener("pointermove", (event) => {

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
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
    if (intersects.length > 0 && !locked_ids.includes(intersects[0].object.id)) {
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
});

document.addEventListener("wheel", (event) => {
    if (is_rotating) {
        event.preventDefault();
        event.stopPropagation();
        drag_object.rotateOnAxis(pNormal, event.deltaY * 0.3E-3);
    }
}, { passive: false });

function create_mesh(list_of_vectors, color) {
    const geom = new THREE.BufferGeometry();
    const concat_array = list_of_vectors.map(x => x.toArray()).flat(1);
    const concat_array_typed = Float32Array.from(concat_array);
    geom.setAttribute('position', new THREE.BufferAttribute(concat_array_typed, 3));
    const material = new THREE.MeshBasicMaterial({ color: color });
    const mesh = new THREE.Mesh(geom, material);
    mesh.updateMatrixWorld();
    mesh.geometry.computeBoundingBox();
    var center = new THREE.Vector3();
    mesh.geometry.boundingBox.getCenter(center);
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

        if (y < y1 != y < y2 && x < (x2 - x1) * (y - y1) / (y2 - y1) + x1) {
            count += 1;
        }
    }
    return count % 2 == 0 ? false : true;
}

function calculate_area(points) {
    var area = 0.0;
    const n = points.length;
    var j = n - 1;
    for (var i = 0; i < n; i++) {
        area += (points[j][0] + points[i][0]) * (points[j][1] - points[i][1]);
        j = i;
    }
    return Math.abs(area / 2.0);
}

// clip the tangram polygon based on the silhouette to get a list of vertices of a new polygon
// we will calculate the area of this new polygon and check against the area of the tangram polygon
// inputs are array of arrays
// subject is the tangram polygon, clip is the silhouette
function clip(subjectPolygon, clipPolygon) {

    var cp1, cp2, s, e;
    var inside = function (p) {
        return (cp2[0] - cp1[0]) * (p[1] - cp1[1]) > (cp2[1] - cp1[1]) * (p[0] - cp1[0]);
    };
    var intersection = function () {
        var dc = [cp1[0] - cp2[0], cp1[1] - cp2[1]],
            dp = [s[0] - e[0], s[1] - e[1]],
            n1 = cp1[0] * cp2[1] - cp1[1] * cp2[0],
            n2 = s[0] * e[1] - s[1] * e[0],
            n3 = 1.0 / (dc[0] * dp[1] - dc[1] * dp[0]);
        return [(n1 * dp[0] - n2 * dc[0]) * n3, (n1 * dp[1] - n2 * dc[1]) * n3];
    };
    var outputList = subjectPolygon;
    cp1 = clipPolygon[clipPolygon.length - 1];
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
