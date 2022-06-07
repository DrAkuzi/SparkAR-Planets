/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */

//==============================================================================
// Welcome to scripting in Spark AR Studio! Helpful links:
//
// Scripting Basics - https://fb.me/spark-scripting-basics
// Reactive Programming - https://fb.me/spark-reactive-programming
// Scripting Object Reference - https://fb.me/spark-scripting-reference
// Changelogs - https://fb.me/spark-changelog
//
// Spark AR Studio extension for VS Code - https://fb.me/spark-vscode-plugin
//
// For projects created with v87 onwards, JavaScript is always executed in strict mode.
//==============================================================================

// How to load in modules
const Scene = require('Scene');

// Use export keyword to make a symbol available in scripting debug console
export const Diagnostics = require('Diagnostics');

// To use variables and functions across files, use export/import keyword
// export const animationDuration = 10;

// Use import keyword to import a symbol from another file
// import { animationDuration } from './script.js'

(async function() { // Enables async/await in JS [part 1]

    const camera = await Scene.root.findFirst('Camera');
    const tracker = await Scene.root.findFirst('planeTracker0');
    const plane = await Scene.root.findFirst('canvas0');

    // Get the camera world space position
    const cameraPositionSignal = tracker.worldTransform.inverse().applyToPoint(camera.worldTransform.position);

    // Apply the rotation of the relative transform between plane tracker and camera world position
    plane.transform.rotation = tracker.transform.lookAt(cameraPositionSignal).rotation;

    // Bring object back to the plane tracker origin
    //plane.worldTransform.position = tracker.worldTransform.position;
    //Diagnostics.log("here");

})(); // Enables async/await in JS [part 2]