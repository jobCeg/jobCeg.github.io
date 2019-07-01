import Noise from "noise-library";
import debounce from "lodash/debounce";
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Group,
  LineBasicMaterial,
  Geometry,
  Vector3,
  Line
} from "three";

export class Globe {
  constructor(color) {
    var canvas = document.querySelector("canvas");
    var width = canvas.offsetWidth,
      height = canvas.offsetHeight;

    var renderer = new WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    var scene = new Scene();

    var camera = new PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 350);

    var sphere = new Group();
    scene.add(sphere);
    var material = new LineBasicMaterial({
      color: color
    });
    var linesAmount = 30;
    var radius = 80;
    var verticesAmount = 30;
    for (var j = 0; j < linesAmount; j++) {
      var index = j;
      var geometry = new Geometry();
      geometry.y = (index / linesAmount) * radius * 2.5;
      for (var i = 0; i <= verticesAmount; i++) {
        var vector = new Vector3();
        vector.x = Math.cos((i / verticesAmount) * Math.PI * 2);
        vector.z = Math.sin((i / verticesAmount) * Math.PI * 2);
        vector._o = vector.clone();
        geometry.vertices.push(vector);
      }
      var line = new Line(geometry, material);
      sphere.add(line);
    }

    requestAnimationFrame(render);
    var resizeTm;
    window.addEventListener(
      "resize",
      debounce(() => {
        resizeTm = clearTimeout(resizeTm);
        resizeTm = setTimeout(onResize, 200);
      }, 500)
    );

    function updateVertices(a) {
      for (var j = 0; j < sphere.children.length; j++) {
        var line = sphere.children[j];
        line.geometry.y += 0.3;
        if (line.geometry.y > radius * 2) {
          line.geometry.y = 0;
        }
        var radiusHeight = Math.sqrt(
          line.geometry.y * (2 * radius - line.geometry.y)
        );
        for (var i = 0; i <= verticesAmount; i++) {
          var vector = line.geometry.vertices[i];
          var ratio =
            Noise.simplex3(
              vector.x * 0.009,
              vector.z * 0.009 + a * 0.0006,
              line.geometry.y * 0.009
            ) * 15;
          vector.copy(vector._o);
          vector.multiplyScalar(radiusHeight + ratio);
          vector.y = line.geometry.y - radius;
        }
        line.geometry.verticesNeedUpdate = true;
      }
    }

    function render(a) {
      requestAnimationFrame(render);
      updateVertices(a);
      renderer.render(scene, camera);
    }

    function onResize() {
      canvas.style.width = "";
      canvas.style.height = "";
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
  }
}
