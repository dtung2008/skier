var skier = null, head = null, body = null;
var ndist = 0, nscore = 0, nskier = 2, maintick = 0;
var trees = [], flags = [];
var collid = false;
var ncollid = 0;
var width = 0;
var height = 0;
const grace = 20;
const nticks = [40, 24, 20, 24, 40];
const lsteps = [8, 3, 0, 3, 8];
const vstep = 5;
const margin = 10;
const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;

// create image and append to body
function createImg(src, top, left) {
    var name = document.createElement('img');
    name.src = src;
    name.style.position = 'absolute';
    name.style.top = top+'px';
    name.style.left = left+'px';
    body.appendChild(name);
    return name;
}

// select body and header, acquire window size, setup skier and call disp
function init() {
    body = document.querySelector('body');
    body.addEventListener('keydown', keyhandler);
    width = window.innerWidth;
    height = window.innerHeight;
    skier = createImg("images/skier_down.png", 80, width / 2);
    head = document.querySelector('h1');
    disp();
}

// select skier mode
function setSkier() {
    switch (nskier) {
        case 0:
            skier.src = "images/skier_left2.png";
            break;
        case 1:
            skier.src = "images/skier_left1.png";
            break;
        case 2:
            skier.src = "images/skier_down.png";
            break;
        case 3:
            skier.src = "images/skier_right1.png";
            break;
        case 4:
            skier.src = "images/skier_right2.png";
            break;
        default:
            break;
    }
}

function myrand(start, stop) {
    return Math.floor((Math.random() * (stop-start)) + start);
}

// process, move up and display a flame, and then callback
function disp() {  
    maintick++;  
    // generate trees and flags
    if (maintick%8 == 0) {
        if (myrand(1, 100) <= 64) {
            trees[trees.length] = createImg("images/skier_tree.png", height - 80, myrand(5, width - 40));
        }
        if (myrand(1, 100) <= 32) {
           flags[flags.length] = createImg("images/skier_flag.png", height - 80, myrand(5, width - 40));
        }
    }
    moveUp();
     
    head.textContent = "Score: "+nscore+ "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"+"Distance: "+ndist;

    // setup callback
    if (collid) {
        skier.src = "images/skier_crash.png";
        collid = false;
        setTimeout(function () {
            setSkier();
            disp();
        }, 2000);
    } else {
        setTimeout(function () {disp();}, nticks[nskier]);   
    }

}

function checkOverlap(x, y, m) {
    
    var rect1 = x.getBoundingClientRect();
    var rect2 = y.getBoundingClientRect();
    
    return !(rect1.right < rect2.left+m || 
                rect1.left+m > rect2.right || 
                rect1.bottom < rect2.top+m || 
                rect1.top+m > rect2.bottom);
}


// move up trees and flags
function moveUp() {

    for (var i = trees.length-1; i >= 0 ; i--) {
        var top = parseInt(trees[i].style.top) - vstep;
        trees[i].style.top = top + 'px';
        if (ncollid >= grace && checkOverlap(trees[i], skier, margin)) {
            collid = true;
            ncollid = 0;
            nscore -= 100;
        }
        if (top < -50) {
            body.removeChild(trees[i]); 
            trees.splice(i,1);
        }
    }
    
    for (var i = flags.length-1; i >= 0 ; i--) {
        var top = parseInt(flags[i].style.top) - vstep;
        flags[i].style.top = top + 'px';
        if (checkOverlap(flags[i], skier, 0)) {
            nscore += 2;
        }
        if (top < -50) {
            body.removeChild(flags[i]); 
            flags.splice(i,1);
        }
    }
    
    if (nskier > 2) moveRight(lsteps[nskier]);
    else if (nskier < 2) moveLeft(lsteps[nskier]);

    ndist += vstep;
    if (ncollid < grace) ncollid++;
}

// move skier right
function moveRight(s) {
    var left = parseInt(skier.style.left) + s;
    var w = width - skier.offsetWidth;
    if (left > w) left = w;
    skier.style.left = left + 'px';
}

// move skier left
function moveLeft(s) {
    var left = parseInt(skier.style.left) - s;
    if (left < 0) left = 0;
    skier.style.left = left + 'px';
}

// handle left and right keystroke
function keyhandler(event) {
    if (ncollid < grace) return;
    switch (event.which) {
    case LEFT_ARROW:
        nskier--;
        if (nskier < 0) nskier = 0;
        setSkier();
        break;
    case RIGHT_ARROW:
        nskier++;
        if (nskier > 4) nskier = 4;
        setSkier();
        break;
    }
} 

window.onload = init; // entry point of js
