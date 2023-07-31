# Poggio-Civitate-3D-remodel
Date: Mon, July 31st 2023 <br>
Author: Felix Manuel Pantoja Tejada

## Reason for project:

Coming into this program, I had no prior experience in the field of classics or archaeology and as a 
result of this I did not comprehend many of lectures we received on the general context of Poggio 
Civitate. Therefore, I started thinking of ways to make this information much more easily digestible 
and engaging because I believe it would serve as a good bridge into the feild of classics for those who
stumble into my same position in the future. 


## Libraries:

Three.JS - https://threejs.org/ | Three.js is a cross-browser JavaScript library and application programming interface used to create and display animated 3D computer graphics in a web browser using WebGL. <br><br>
GLTF Loader - https://threejs.org/docs/#examples/en/loaders/GLTFLoader | glTF (GL Transmission Format) is an open format specification for efficient delivery and loading of 3D content.<br><br>
Octree - https://vorg.github.io/pex/docs/pex-geom/Octree.html | 3D Three data structure for fast spatial point indexing. <br><br>
Capsule - https://threejs.org/docs/#api/en/geometries/CapsuleGeometry | CapsuleGeometry is a geometry class for a capsule with given radii and height. <br><br>

## How this program works: 

The 3D models are created on blender (by me) and loaded into the program using gltf loader. Moving around in the world works via taking user input from keys on their keyboard **{w a s d space}** and applying that as transformations on the 3D vector that is the users position. Looking around works by taking the users trackpad / mouse movements and turning that as a roatation of the the users camera. This program is then all bundled using vite and hosted with gh-pages.

## How to run this program: 

This program is hosted with gh-pages at the following [link](https://fpantoja2001.github.io/Poggio-Civitate-3D-remodel/).

## package.json:
```
{
  "name": "final-project-stuff",
  "version": "1.0.0",
  "description": "",
  "main": "dist/main.js",
  "homepage": "https://fpantoja2001.github.io/Poggio-Civitate-3D-remodel/index/",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "gh-pages -d dist"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "gh-pages": "^5.0.0",
    "sass": "^1.63.6",
    "three": "^0.154.0",
    "vite": "^4.4.4"
  }
}
```

## Known Bugs:

* Embedded document.eventListener on mousedown activates on all mousedown events after its first call, when it should only activate if the desired object is intersected via raycatser. 
* **esc + w a s or d**, sends character infinitely in direction of last button pressed.
* Upon death capsule respawns slighlty lower to the ground. 