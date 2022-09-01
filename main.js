import './style.css';
import * as THREE from 'three';
import {SVGLoader} from 'three/examples/jsm/loaders/SVGLoader';

const scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight(0xfffff);
scene.add(ambientLight);

const aspectRatio = window.innerWidth / window.innerHeight;
const cameraWidth = 150;
const cameraHeigth = cameraWidth / aspectRatio;
const camera = new THREE.OrthographicCamera(cameraWidth / -2, cameraWidth / 2, cameraHeigth / -2, cameraHeigth / 2, 0, 1000);
camera.position.set(0, 0, 100);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

const tangrams = createTangrams();
const square = drawSquare();

function createTangrams() {

}

function drawSquare(x1, y1, x2, y2) {

	var square = new THREE.Geometry();
    console.log(square);
	square.vertices.push(new THREE.Vector3(x1,y1,0));
    square.vertices.push(new THREE.Vector3(x1,y2,0));
    square.vertices.push(new THREE.Vector3(x2,y1,0));
    square.vertices.push(new THREE.Vector3(x2,y2,0));
  
    square.faces.push(new THREE.Face3(0,1,2));
    square.faces.push(new THREE.Face3(1,2,3));
	return square;
}

function drawPolygon(list_points) {
    var  = new THREE.Geometry();
    //console.log(square);
    for (let p of list_points) {
        
    }
	square.vertices.push(new THREE.Vector3(x1,y1,0));
    square.vertices.push(new THREE.Vector3(x1,y2,0));
    square.vertices.push(new THREE.Vector3(x2,y1,0));
    square.vertices.push(new THREE.Vector3(x2,y2,0));
  
    square.faces.push(new THREE.Face3(0,1,2));
    square.faces.push(new THREE.Face3(1,2,3));
	return square;
}
