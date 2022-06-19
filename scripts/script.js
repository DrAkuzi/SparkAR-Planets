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

    async function axisRotation(axis_x, axis_y, axis_z, angle) {

        var norm = Reactive.sqrt(axis_x.mul(axis_x.add(axis_y)).mul(axis_y.add(axis_z)).mul(axis_z));
        axis_x = axis_x.div(norm);
        axis_y = axis_y.div(norm);
        axis_z = axis_z.div(norm);
        //var angle_radians = angle_degrees.mul(Math.PI).div(180.0);
        var cos = Reactive.cos(angle.div(2.0));
        var sin = Reactive.sin(angle.div(2.0));
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

    //method 5
    //var angles = toRotateDuplicate.worldTransform.lookAt(camera.worldTransform.position).rotation.eulerAngles;
    //var angleZ = Reactive.val(0);
    //var angleX = angles.z.lt(0).ifThenElse(angles.x.lt(0).ifThenElse(angles.x.abs(), Reactive.val(Math.PI).sub(angles.x).add(Math.PI)), angles.x);
    //var angleY = angles.y.lt(0).ifThenElse(angles.x.gt(0).ifThenElse(Reactive.val(Math.PI).sub(angles.y), Reactive.val(Math.PI).mul(2.0).sub(angles.y)), angles.x.lt(0).ifThenElse(Reactive.val(Math.PI).mul(0.5).sub(angles.y).add(Reactive.val(Math.PI).mul(0.5)), angles.y));
    //var angleY = angles.y.lt(0).ifThenElse(angleX.lt(0).ifThenElse(Reactive.val(Math.PI).sub(angles.y), Reactive.val(Math.PI).mul(2.0).sub(angles.y)), angleX.ge(Math.PI).ifThenElse(Reactive.val(Math.PI).mul(0.5).sub(angles.y).add(Reactive.val(Math.PI).mul(0.5)), angles.y));
    //0 -y 0 = 360 - (-y)
//-180 -y 0 = 180 -(-y)
//180 y 0 = 90 - y + 90
    /*
    if(angleZ < 0){
        angleZ = 0;
        if(angleX < 0)
            angleX = abs(angles.x);
        else
            angleX = Math.PI - angles.x + Math.PI;
    }
    0 -y 0 = 360 + (-y)
180 -y -180 = 180 + abs(y)
-180 y -180 = 90 - y + 90
    */

    //plane.transform.rotation = Reactive.quaternionFromEuler(angleX, angles.y, angleZ);
    //plane.transform.rotation = Reactive.quaternionFromEuler(angles.x, angles.y, angles.z);

    //Diagnostics.watch("x0: ", angles.x.mul(Reactive.val(180.0).div(Math.PI)));
    //Diagnostics.watch("y0: ", angles.y.mul(Reactive.val(180.0).div(Math.PI)));
    //Diagnostics.watch("z0: ", angles.z.mul(Reactive.val(180.0).div(Math.PI)));
    //Diagnostics.watch("x1: ", angleX.mul(Reactive.val(180.0).div(Math.PI)));
    //Diagnostics.watch("y1: ", angleY.mul(Reactive.val(180.0).div(Math.PI)));
    //Diagnostics.watch("z1: ", angleZ.mul(Reactive.val(180.0).div(Math.PI)));
})(); // Enables async/await in JS [part 2]