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
const Patches = require('Patches');
// Use export keyword to make a symbol available in scripting debug console
export const Diagnostics = require('Diagnostics');
var Reactive = require('Reactive');

// To use variables and functions across files, use export/import keyword
// export const animationDuration = 10;

// Use import keyword to import a symbol from another file
// import { animationDuration } from './script.js'

(async function() { // Enables async/await in JS [part 1]

    const camera = await Scene.root.findFirst('Camera'); //'Camera'
    const tracker = await Scene.root.findFirst('pivot0');
    const plane = await Scene.root.findFirst('plane0');
    const toRotateDuplicate = await Scene.root.findFirst('toRotateDuplicate');

    async function axisRotation(axis_x, axis_y, axis_z, angle_degrees) {

        var norm = Reactive.sqrt(axis_x.mul(axis_x.add(axis_y)).mul(axis_y.add(axis_z)).mul(axis_z));
        axis_x = axis_x.div(norm);
        axis_y = axis_y.div(norm);
        axis_z = axis_z.div(norm);
        //var angle_radians = angle_degrees.mul(Math.PI).div(180.0);
        var cos = Reactive.cos(angle_degrees.div(2.0));
        var sin = Reactive.sin(angle_degrees.div(2.0));
        return Reactive.quaternion(cos, axis_x.mul(sin), axis_y.mul(sin), axis_z.mul(sin));

    }

    //method1 - works
    // Get the camera world space position
    //const cameraPositionSignal = tracker.worldTransform.inverse().applyToPoint(camera.worldTransform.position);
    // Apply the rotation of the relative transform between plane tracker and camera world position
    //plane.transform.rotation = toRotateDuplicate.transform.lookAt(cameraPositionSignal).rotation;

    //method 2 - not working
    //const angleAxis = toRotateDuplicate.transform.lookAt(cameraPositionSignal).rotation.angleAxis();
    //plane.transform.rotation = await axisRotation(angleAxis.y, angleAxis.z, angleAxis.w, angleAxis.x);

    //method 3 - not working
    //var theAxis = cameraPositionSignal.cross(Reactive.vector(1, 0, 0)).normalize();
    //var theAngle = Reactive.acos(cameraPositionSignal.normalize().dot(Reactive.vector(1, 0, 0)));

    //var temp = await axisRotation(theAxis.x, theAxis.y, theAxis.z, theAngle);
    //plane.transform.rotation = temp;

    //method 4 - works
    plane.transform.rotation = toRotateDuplicate.worldTransform.lookAt(camera.worldTransform.position).rotation;

    //Diagnostics.watch("y: ", theAngle.mul(Reactive.val(180.0).div(Math.PI)));
})(); // Enables async/await in JS [part 2]