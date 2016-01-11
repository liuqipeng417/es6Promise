/* [export] */
/*
 * @Author: hollay
 * @Date:   2016-01-07 16:33:56
 * @Last Modified by:   hollay
 * @Last Modified time: 2016-01-08 17:47:47
 */

'use strict';
require('zepto');

// Promise.resolve('abcd')
//  ===
// new Promise(function(resolve, reject) {
//     resolve('abcd');
// });

// loadImage('').then(success, fail);


// Promise.all(
//     ['', '', ''].map(loadImage) // [Promise]
// ).then(function(values) {

// }, function() {

// })


// domready().then(function() {
//     console.log(2);
// });
// console.log(1);

/*****************************  准备函数  ***********************************/
function getJSON(url) {
    return fetch(url)
        .then(function(resp) {
            return resp.json();
        });

    // return Promise.resolve($.getJSON(url)).then(function(res) {
    //     return res;
    // });
    // thenabe
}

// getJSON('/delayJson.php').then(function(js) {
//     console.log(js);
// })

function geo(timeout) {
    return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(function(pos) {
            resolve(pos);
        }, function(e) {
            reject(e);
        });

        if (timeout) {
            setTimeout(function() {
                reject(new Error('User Timeout'));
            }, timeout);
        }
    });
}

function error(e) {
    console.log(e);
}

function tick() {
    console.log(parseInt((Date.now() - start) / 1000));
}

/*****************************  准备函数完成  ***********************************/
/*****************************  任务代码  ***********************************/
function taskA(input) {
    console.log('A', input);
    tick();
    return getJSON('/delayJson.php?fp=1.json&delay=1');
}

function taskB(input) {
    console.log('B', input);
    tick();
    return getJSON('/delayJson.php?fp=2.json&delay=4');
}

function taskC(input) {
    console.log('C', input);
    tick();
    return getJSON('/delayJson.php?fp=3.json&delay=2');
}

/*****************************  任务代码完成  ***********************************/

/*****************************  执行代码  ***********************************/
var start = Date.now();

// Case 1: 顺序执行
// Promise.resolve() // ==> Promise 1
//     .then(taskA) // ==> Promise 2
//     .then(taskB) // ==> Promise 3
//     .then(taskC) // ==> Promise 4
//     .then(tick) // ==> Promise 5
//     .then(undefined, error); // ==> Promise 6

// taskA() // ==> Promise 1
//     .then(taskB) // ==> Promise 2
//     .then(taskC) // ==> Promise 3
//     .then(tick) // ==> Promise 4
//     .catch(error); // ==> Promise 5

// Case 2: 并发执行
// Promise 1, 2, 3
// Promise.all([taskA(), taskB(), taskC()]) // Promise 4
//     .then(function(all) {
//         console.log(all);
//         tick();
//     }) // ==> Promise 5
//     .catch(error); // Promise 6

// Case 3: 竞争执行
// Promise 1, 2, 3
// Promise.race([taskA(), taskB(), taskC()]) // Promise 4
//     .then(function(winner) {
//         console.log(winner);
//         tick();
//     }) // Promise 5
//     .catch(error); // Promise 6

// Case 4: 每次都是一个新的 Promise 对象
var A = taskA(); // Promise 1
A.then(taskB)   // Promise 2
    .then(tick);
A.then(taskC)// Promise 3
    .then(tick);
// VS.  Case 1



/*****************************  执行代码完成  ***********************************/

/*****************************  分割线  ***********************************/
function domready() {
    return new Promise(function(resolve, reject) {
        var state = document.readyState;
        if (state === 'interactive' || state === '') {
            setTimeout(function() {
                resolve();
            });
        } else {
            window.addEventListener('DOMContentLoaded', function() {
                resolve();
            });
        }
    });
}