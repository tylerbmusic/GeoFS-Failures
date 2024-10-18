// ==UserScript==
// @name         GeoFS Failures
// @version      0.1
// @description  Adds the ability for systems to fail
// @author       GGamerGGuy
// @match        https://www.geo-fs.com/geofs.php?v=*
// @match        https://*.geo-fs.com/geofs.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geo-fs.com
// @grant        none
// ==/UserScript==
class Failure {
        constructor() {
            this.aId = geofs.aircraft.instance.id; //aircraft ID
            this.enabled = false; //Start disabled
            this.failures = []; //Array with all failure intervals
            this.fails = {
                landingGear: {
                    front: false,
                    left: false,
                    right: false
                },
                fuelLeak: false,
                flightCtrl: {
                    ailerons: false,
                    elevators: false,
                    rudder: false,
                },
                electrical: false,
                structural: false,
                hydraulic: {
                    flaps: false,
                    brakes: false,
                    spoilers: false
                },
                pitotStatic: false,
                pressurization: false,
                engines: []
            } //End fails
            for (var i = 0; i < geofs.aircraft.instance.engines.length; i++) {
                this.fails.engines.push({i: false});
            }
            this.chances = { //Chances of a failure happening every minute, from 0 to 1
                landingGear: {
                    front: 0,
                    left: 0,
                    right: 0
                },
                fuelLeak: 0,
                flightCtrl: {
                    ailerons: 0,
                    elevators: 0,
                    rudder: 0
                },
                electrical: 0,
                structural: 0,
                hydraulic: {
                    flaps: 0,
                    brakes: 0,
                    spoilers: 0
                },
                pitotStatic: 0,
                pressurization: 0,
                engines: []
            } //End chances
            for (var v = 0; v < geofs.aircraft.instance.engines.length; v++) {
                this.chances.engines.push({v: 0});
            }
        } //End constructor

        fail(system) {
            var ngin_l = geofs.aircraft.instance.engines.length; //N-Gin Length
            //Engine (first because the number varies):
            //Left:  geofs.aircraft.instance.definition.parts[79].thrust = 0;
            //Right: geofs.aircraft.instance.definition.parts[82].thrust = 0;
            for (var i = 0; i < ngin_l; i++) {
                if (system == ("engine" + i)) {
                    alert("Engine " + (i+1) + " failed!");
                    geofs.aircraft.instance.engines[i].thrust = 0;
                    var v = new geofs.fx.ParticleEmitter({
                        off: 0,
                        anchor: {worldPosition: geofs.aircraft.instance.engines[0].object3d.worldPosition},
                        duration: 1E10,
                        rate: .05,
                        life: 1E10, //10 seconds
                        easing: "easeOutQuart",
                        startScale: .01,
                        endScale: 1,
                        randomizeStartScale: .01,
                        randomizeEndScale: .15,
                        startOpacity: 1,
                        endOpacity: 1,
                        startRotation: "random",
                        texture: "whitesmoke"
                    });
                    var p = setInterval(() => {geofs.fx.setParticlesColor(new Cesium.Color(0.5,0.25,0,1));},20);
                }
            }
            if (!system.includes("engine")) {
                var z = 0;
                switch(system) {
                    case "fuelLeak":
                        if (!this.fails.fuelLeak) {
                            alert("Fuel leak! 2 minutes of fuel remaining");
                            this.fails.fuelLeak = true;
                            setTimeout(() => {
                                setInterval(() => {
                                    geofs.aircraft.instance.stopEngine();
                                },1000);
                            },120000); //2 minutes = 120000 ms
                        }
                        break;
                        //Landing gear:
                        //Front landing gear failure:
                    case "gearFront":
                        if (!this.fails.landingGear.front) {
                            alert("Nose gear failure");
                            this.fails.landingGear.front = true;
                            var fG = 2;
                            for (z = 0; z < geofs.aircraft.instance.suspensions.length; z++) {
                                if (geofs.aircraft.instance.suspensions[i].name.includes("front") || geofs.aircraft.instance.suspensions[i].name.includes("nose") || geofs.aircraft.instance.suspensions[i].name.includes("tail")) {
                                    fG = i;
                                }
                            }
                            this.failures.push(setInterval(() => {
                                geofs.aircraft.instance.suspensions[fG].collisionPoints[0][2] = 30;
                            }),1000);
                        }
                        break;
                        //Left landing gear failure:
                    case "gearLeft":
                        if (!this.fails.landingGear.left) {
                            alert("Left gear failure");
                            this.fails.landingGear.left = true;
                            var lG = 0;
                            for (z = 0; z < geofs.aircraft.instance.suspensions.length; z++) {
                                if (geofs.aircraft.instance.suspensions[i].name.includes("left") || geofs.aircraft.instance.suspensions[i].name.includes("l")) {
                                    lG = i;
                                }
                            }
                            this.failures.push(setInterval(() => {
                                geofs.aircraft.instance.suspensions[lG].collisionPoints[0][2] = 30;
                            }),1000);
                        }
                        break;
                        //Right landing gear failure:
                    case "gearRight":
                        alert("Right gear failure");
                        if (!this.fails.landingGear.right) {
                            this.fails.landingGear.right = true;
                            var rG = 1;
                            for (z = 0; z < geofs.aircraft.instance.suspensions.length; z++) {
                                if (geofs.aircraft.instance.suspensions[i].name.includes("right") || geofs.aircraft.instance.suspensions[i].name.includes("r_g")) {
                                    rG = i;
                                }
                            }
                            this.failures.push(setInterval(() => {
                                geofs.aircraft.instance.suspensions[rG].collisionPoints[0][2] = 30;
                            }),1000);
                        }
                        break;

                        //Flight control:
                        //Left aileron: geofs.aircraft.instance.definition.parts[6].object3d._scale = [0,0,0];
                        //Right aileron: geofs.aircraft.instance.definition.parts[29].object3d._scale = [0,0,0];
                    case "ailerons":
                        alert("Flight control failure (ailerons)");
                        if (!this.fails.flightCtrl.ailerons) {
                            this.fails.flightCtrl.ailerons = true;
                            this.failures.push(setInterval(() => {
                                for (var t in geofs.aircraft.instance.airfoils) {
                                    if (geofs.aircraft.instance.airfoils[t].name.toLowerCase().includes("aileron")) {
                                        geofs.aircraft.instance.airfoils[t].object3d._scale = [0,0,0];
                                    }
                                }
                            }),1000);
                        }
                        break;
                        //Left elevator: geofs.aircraft.instance.definition.parts[51].object3d._scale = [0,0,0];
                        //Right elevator: geofs.aircraft.instance.definition.parts[52].object3d._scale = [0,0,0];
                    case "elevators":
                        alert("Flight control failure (elevators)");
                        if (!this.fails.flightCtrl.elevators) {
                            this.fails.flightCtrl.elevators = true;
                            this.failures.push(setInterval(() => {
                                for (var t in geofs.aircraft.instance.airfoils) {
                                    if (geofs.aircraft.instance.airfoils[t].name.toLowerCase().includes("elevator")) {
                                        geofs.aircraft.instance.airfoils[t].object3d._scale = [0,0,0];
                                    }
                                }
                            }),1000);
                        }
                        break;
                    case "rudder":
                        alert("Flight control failure (rudder)");
                        if (!this.fails.flightCtrl.rudder) {
                            this.fails.flightCtrl.rudder = true;
                            this.failures.push(setInterval(() => {
                                for (var t in geofs.aircraft.instance.airfoils) {
                                    if (geofs.aircraft.instance.airfoils[t].name.toLowerCase().includes("rudder")) {
                                        geofs.aircraft.instance.airfoils[t].object3d._scale = [0,0,0];
                                    }
                                }
                            }),1000);
                        }
                        break;

                        //Electrical:
                        //for (var i = 1; i <= 5; i++) {
                        //geofs.aircraft.instance.cockpitSetup.parts[i].object3d._scale = [0,0,0];
                        //}
                        //instruments.hide();
                    case "electrical":
                        if (!this.fails.electrical) {
                            alert("Electrical failure");
                            this.fails.electrical = true;
                            this.failures.push(setInterval(() => {
                                for (var i = 1; i <= 5; i++) {
                                    geofs.aircraft.instance.cockpitSetup.parts[i].object3d._scale = [0,0,0];
                                }
                                geofs.autopilot.turnOff();
                                instruments.hide();
                            }),1000);
                        }
                        break;

                    case "structural":
                        if (!this.fails.structural) {
                            alert("Significant structural damage detected");
                            console.log("Boeing, am I right?");
                            this.fails.structural = true;
                            this.failures.push(setInterval(() => {
                                weather.definition.turbulences = 3;
                            }),1000);
                        }
                        break;

                        //Hydraulic:
                        //Flaps: controls.flaps.target = Math.floor(Math.random()*(geofs.animation.values.flapsSteps*2));  controls.flaps.delta = 20;
                    case "flaps":
                        if (!this.fails.hydraulic.flaps) {
                            alert("Hydraulic failure (flaps)");
                            this.fails.hydraulic.flaps = true;
                            this.failures.push(setInterval(() => {
                                controls.flaps.target = Math.floor(0.6822525475345469*(geofs.animation.values.flapsSteps*2)); //0.6822525475345469 is a random number, which keeps things consistent
                                controls.flaps.delta = 20;
                            }),1000);
                        }
                        break;
                        //Brakes: controls.brakes = 0;
                    case "brakes":
                        if (!this.fails.hydraulic.brakes) {
                            alert("Hydraulic failure (brakes)");
                            this.fails.hydraulic.brakes = true;
                            this.failures.push(setInterval(() => {
                                controls.brakes = 0;
                            }),500);
                        }
                        break;
                        //Spoilers: controls.spoilers.target = Math.round(Math.random()*20)/10;  controls.spoilers.delta = 20;
                    case "spoilers":
                        if (!this.fails.hydraulic.spoilers) {
                            alert("Hydraulic failure (spoilers)");
                            this.fails.hydraulic.spoilers = true;
                            this.failures.push(setInterval(() => {
                                controls.spoilers.target = 0.2;
                                controls.spoilers.delta = 20;
                            }),1000);
                        }
                        break;

                    case "pressurization":
                        if (!this.fails.pressurization) {
                            alert("Cabin depressurization! Get at or below 9,000 ft MSL!");
                            this.fails.pressurization = true;
                            this.failures.push(setInterval(() => {
                                if (geofs.animation.values.altitude > 9000) {
                                    weather.definition.turbulences = (geofs.animation.values.altitude - 9000) / 5200; //Dynamically adjust turbulence based on altitude
                                } else {
                                    weather.definition.turbulences = 0;
                                }
                            }),1000);
                        }
                        break;
                } //End system switch
            } //End not system.includes engine if statement
        } //End fail method
    tick() {
        if (this.enabled) {
            console.log("tick");
            for (var i in this.chances.landingGear) {
                if (Math.random() < this.chances.landingGear[i]) {
                    this.fail("gear" + (i[0].toUpperCase() + i.substr(1,i.length)));
                } //End if
            } //End for
            for (var q in this.chances) {
                if (typeof this.chances[q] == "number") {
                    if (Math.random() < this.chances[i]) {
                        this.fail(q);
                    }
                } else if (q !== "landingGear") {
                    for (var j in this.chances[q]) {
                        if (Math.random() < this.chances[q][j]) {
                            this.fail(j);
                        } //End if
                    } //End for
                } //End else if
            } //End for
            setTimeout(() => {this.tick();}, 60000);
        } //End if enabled statement
    } //End tick method
    reset() {
        for (var i in this.failures) {
            clearInterval(this.failures[i]);
        }
        //this.failures = [];
        this.enabled = false;
        //geofs.resetFlight();
    }
} //End failure class
window.openFailuresMenu = function() {
    if (!window.failuresMenu) {
        window.failure = new Failure();
        window.failuresMenu = document.createElement("div");
        window.failuresMenu.style.position = "fixed";
        window.failuresMenu.style.width = "640px";
        window.failuresMenu.style.height = "480px";
        window.failuresMenu.style.background = "white";
        window.failuresMenu.style.display = "block";
        window.failuresMenu.style.overflow = "scroll";
        window.failuresMenu.id = "failMenu";
        window.failuresMenu.className = "geofs-ui-left";
        document.body.appendChild(window.failuresMenu);
        var htmlContent = `
        <div style="position: fixed; width: 640px; height: 10px; background: lightgray; cursor: move;" id="dragPart"></div>
        <p style="cursor: pointer;right: 0px;position: absolute;background: gray;height: fit-content;" onclick="window.failuresMenu.hidden=true;">X</p>
    <p>Note: Some failures may require a manual refresh of the page.</p>
    <button onclick="(function(){window.failure.enabled=true; window.failure.tick();})();">Enable</button>
    <button onclick="window.failure.reset()">RESET ALL</button>
        <h1>Landing Gear</h1>
        <h2>Front</h2>
        <span style="
    font-size: large;
    vertical-align: top;
">Chance per minute: </span>
        <input type="range" value="0" min="0" max="1" step="0.01" id="slide1" onchange="[document.getElementById('input1').value, window.failure.chances.landingGear.gearFront]=[document.getElementById('slide1').value, document.getElementById('slide1').value]" draggable="false" style="
    vertical-align: bottom;
">
        <input disabled="true;" id="input1" style="
    width: 40px;
">
    <button onclick="failure.fail('gearFront')">FAIL</button>
        <br>
        <h2>Left</h2>
        <span style="
    font-size: large;
    vertical-align: top;
">Chance per minute: </span>
        <input type="range" min="0" max="1" step="0.01" id="slideGearL" onchange="[document.getElementById('inputGearL').value, window.failure.chances.landingGear.left]=[document.getElementById('slideGearL').valueAsNumber, document.getElementById('slideGearL').valueAsNumber]" draggable="false" style="
    vertical-align: bottom;
">
        <input disabled="true;" id="inputGearL" style="
    width: 40px;
">

        <button onclick="failure.fail('gearLeft')">FAIL</button>
    <br>
        <h2>Right</h2>
        <span style="
    font-size: large;
    vertical-align: top;
">Chance per minute: </span>
            <input type="range" min="0" max="1" step="0.01" id="slideGearR" onchange="[document.getElementById('inputGearR').value, window.failure.chances.landingGear.right]=[document.getElementById('slideGearR').valueAsNumber, document.getElementById('slideGearR').valueAsNumber]" draggable="false" style="
    vertical-align: bottom;
">
        <input disabled="true;" id="inputGearR" style="
    width: 40px;
">
    <button onclick="failure.fail('gearRight')">FAIL</button>
    <br>
        <h1>Fuel Leak</h1>
        <span style="
    font-size: large;
    vertical-align: top;
">Chance per minute: </span>
        <input type="range" min="0" max="1" step="0.01" id="slideFuelLeak" onchange="[document.getElementById('inputFuelLeak').value, window.failure.chances.fuelLeak]=[document.getElementById('slideFuelLeak').valueAsNumber, document.getElementById('slideFuelLeak').valueAsNumber]" draggable="false" style="
    vertical-align: bottom;
">
        <input disabled="true;" id="inputFuelLeak" style="
    width: 40px;
">



        <button onclick="failure.fail('fuelLeak')">FAIL</button>
    <br>
    <h1>Flight Control</h1>
    <h2>Ailerons</h2>
        <span style="
    font-size: large;
    vertical-align: top;
">Chance per minute: </span>
        <input type="range" min="0" max="1" step="0.01" id="slideFlightCtrl" onchange="[document.getElementById('inputFlightCtrl').value, window.failure.chances.flightCtrl.ailerons]=[document.getElementById('slideFlightCtrl').valueAsNumber, document.getElementById('slideFlightCtrl').valueAsNumber]" draggable="false" style="vertical-align: bottom;">
    <input disabled="true;" id="inputFlightCtrl" style="
    width: 40px;
">
        <button onclick="failure.fail('ailerons')">FAIL</button><br>
            <h2>Elevators</h2>
        <span style="
    font-size: large;
    vertical-align: top;
">Chance per minute: </span>
        <input type="range" min="0" max="1" step="0.01" id="slideElevator" onchange="[document.getElementById('inputElevator').value, window.failure.chances.flightCtrl.elevator]=[document.getElementById('slideElevator').valueAsNumber, document.getElementById('slideElevator').valueAsNumber]" draggable="false" style="vertical-align: bottom;">
    <input disabled="true;" id="inputElevator" style="
    width: 40px;
">
        <button onclick="failure.fail('elevator')">FAIL</button><br>
        <h2>Rudder</h2>
        <span style="
    font-size: large;
    vertical-align: top;
">Chance per minute: </span>
        <input type="range" min="0" max="1" step="0.01" id="slideRudder" onchange="[document.getElementById('inputRudder').value, window.failure.chances.flightCtrl.rudder]=[document.getElementById('slideRudder').valueAsNumber, document.getElementById('slideRudder').valueAsNumber]" draggable="false" style="vertical-align: bottom;">
    <input disabled="true;" id="inputRudder" style="
    width: 40px;
">
        <button onclick="failure.fail('rudder')">FAIL</button><br>
    <h1>Electrical</h1>
        <span style="
    font-size: large;
    vertical-align: top;
">Chance per minute: </span>
        <input type="range" min="0" max="1" step="0.01" id="slideElectrical" onchange="[document.getElementById('inputElectrical').value, window.failure.chances.electrical]=[document.getElementById('slideElectrical').valueAsNumber, document.getElementById('slideElectrical').valueAsNumber]" draggable="false" style="
    vertical-align: bottom;
">

        <input disabled="true;" id="inputElectrical" style="
    width: 40px;
">
        <button onclick="failure.fail('electrical')">FAIL</button>

    <br>

    <h1>Structural</h1>
        <span style="
    font-size: large;
    vertical-align: top;
">Chance per minute: </span>
        <input type="range" min="0" max="1" step="0.01" id="slideStructural" onchange="[document.getElementById('inputStructural').value, window.failure.chances.structural]=[document.getElementById('slideStructural').valueAsNumber, document.getElementById('slideStructural').valueAsNumber]" draggable="false" style="
    vertical-align: bottom;
">

        <input disabled="true;" id="inputStructural" style="
    width: 40px;
">
        <button onclick="failure.fail('structural')">FAIL</button>

    <br>
    <h1>Hydraulic</h1>
<h2>Flaps</h2>
        <span style="
    font-size: large;
    vertical-align: top;
">Chance per minute: </span>
        <input type="range" min="0" max="1" step="0.01" id="slideFlaps" onchange="[document.getElementById('inputFlaps').value, window.failure.chances.hydraulic.flaps]=[document.getElementById('slideFlaps').valueAsNumber, document.getElementById('slideFlaps').valueAsNumber]" draggable="false" style="
    vertical-align: bottom;
">

        <input disabled="true;" id="inputFlaps" style="
    width: 40px;
">
        <button onclick="failure.fail('flaps')">FAIL</button>
<h2>Brakes</h2>
    <span style="
    font-size: large;
    vertical-align: top;
">Chance per minute: </span>
        <input type="range" min="0" max="1" step="0.01" id="slideBrakes" onchange="[document.getElementById('inputBrakes').value, window.failure.chances.hydraulic.brakes]=[document.getElementById('slideBrakes').valueAsNumber, document.getElementById('slideBrakes').valueAsNumber]" draggable="false" style="
    vertical-align: bottom;
">

        <input disabled="true;" id="inputBrakes" style="
    width: 40px;
">
        <button onclick="failure.fail('brakes')">FAIL</button>
<h2>Spoilers</h2>
    <span style="
    font-size: large;
    vertical-align: top;
">Chance per minute: </span>
        <input type="range" min="0" max="1" step="0.01" id="slideSpoilers" onchange="[document.getElementById('inputSpoilers').value, window.failure.chances.hydraulic.spoilers]=[document.getElementById('slideSpoilers').valueAsNumber, document.getElementById('slideSpoilers').valueAsNumber]" draggable="false" style="
    vertical-align: bottom;
">
        <input disabled="true;" id="inputSpoilers" style="
    width: 40px;
">
<button onclick="failure.fail('spoilers')">FAIL</button>
    <h1>Cabin Pressurization</h1>
    <span style="
    font-size: large;
    vertical-align: top;
">Chance per minute: </span>
        <input type="range" min="0" max="1" step="0.01" id="slidePressurization" onchange="[document.getElementById('inputPressurization').value, window.failure.chances.pressurization]=[document.getElementById('slidePressurization').valueAsNumber, document.getElementById('slidePressurization').valueAsNumber]" draggable="false" style="
    vertical-align: bottom;
">
        <input disabled="true;" id="inputPressurization" style="
    width: 40px;
">
        <button onclick="failure.fail('spoilers')">FAIL</button>
        <h1>Engines</h1>
        `;
        for (var i = 0; i < geofs.aircraft.instance.engines.length; i++) {
            htmlContent += `
            <h2>Engine ${i+1}</h2>
    <span style="
    font-size: large;
    vertical-align: top;
">Chance per minute: </span>
        <input type="range" min="0" max="1" step="0.01" id="slideEngine${i}" onchange="document.getElementById('inputEngine${i}').value=document.getElementById('slideEngine${i}').valueAsNumber; window.failure.chances.engines[i] = document.getElementById('slideEngine${i}').valueAsNumber"; draggable="false" style="
    vertical-align: bottom;
">
        <input disabled="true;" id="inputEngine${i}" style="
    width: 40px;
">
        <button onclick="failure.fail('engine${i}')">FAIL</button>
            `;
            window.failuresMenu.innerHTML = htmlContent;
            const draggableDiv = document.getElementById('failMenu');
            const dragPart = document.getElementById('dragPart');

            dragPart.addEventListener('mousedown', function(e) {
                let offsetX = e.clientX - draggableDiv.getBoundingClientRect().left;
                let offsetY = e.clientY - draggableDiv.getBoundingClientRect().top;

                function mouseMoveHandler(e) {
                    draggableDiv.style.left = `${e.clientX - offsetX}px`;
                    draggableDiv.style.top = `${e.clientY - offsetY}px`;
                }

                function mouseUpHandler() {
                    document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
                }

                document.addEventListener('mousemove', mouseMoveHandler);
                document.addEventListener('mouseup', mouseUpHandler);
            });
        }
    } else {
        window.failuresMenu.hidden = !window.failuresMenu.hidden;
        if (geofs.aircraft.instance.id !== window.aId) {
            window.failure.reset();
            window.failure = new Failure();
            htmlContent = `
        <div style="position: fixed; width: 640px; height: 10px; background: lightgray; cursor: move;" id="dragPart"></div>
        <p style="cursor: pointer;right: 0px;position: absolute;background: gray;height: fit-content;" onclick="window.failuresMenu.hidden=true;">X</p>
    <p>Note: Some failures may require a manual refresh of the page.</p>
    <button onclick="(function(){window.failure.enabled=true; window.failure.tick();})();">Enable</button>
    <button onclick="window.failure.reset()">RESET ALL</button>
        <h1>Landing Gear</h1>
        <h2>Front</h2>
        <span style="
    font-size: large;
    vertical-align: top;
">Chance per minute: </span>
        <input type="range" value="0" min="0" max="1" step="0.01" id="slide1" onchange="[document.getElementById('input1').value, window.failure.chances.landingGear.gearFront]=[document.getElementById('slide1').value, document.getElementById('slide1').value]" draggable="false" style="
    vertical-align: bottom;
">
        <input disabled="true;" id="input1" style="
    width: 40px;
">
    <button onclick="failure.fail('gearFront')">FAIL</button>
        <br>
        <h2>Left</h2>
        <span style="
    font-size: large;
    vertical-align: top;
">Chance per minute: </span>
        <input type="range" min="0" max="1" step="0.01" id="slideGearL" onchange="[document.getElementById('inputGearL').value, window.failure.chances.landingGear.left]=[document.getElementById('slideGearL').valueAsNumber, document.getElementById('slideGearL').valueAsNumber]" draggable="false" style="
    vertical-align: bottom;
">
        <input disabled="true;" id="inputGearL" style="
    width: 40px;
">

        <button onclick="failure.fail('gearLeft')">FAIL</button>
    <br>
        <h2>Right</h2>
        <span style="
    font-size: large;
    vertical-align: top;
">Chance per minute: </span>
            <input type="range" min="0" max="1" step="0.01" id="slideGearR" onchange="[document.getElementById('inputGearR').value, window.failure.chances.landingGear.right]=[document.getElementById('slideGearR').valueAsNumber, document.getElementById('slideGearR').valueAsNumber]" draggable="false" style="
    vertical-align: bottom;
">
        <input disabled="true;" id="inputGearR" style="
    width: 40px;
">
    <button onclick="failure.fail('gearRight')">FAIL</button>
    <br>
        <h1>Fuel Leak</h1>
        <span style="
    font-size: large;
    vertical-align: top;
">Chance per minute: </span>
        <input type="range" min="0" max="1" step="0.01" id="slideFuelLeak" onchange="[document.getElementById('inputFuelLeak').value, window.failure.chances.fuelLeak]=[document.getElementById('slideFuelLeak').valueAsNumber, document.getElementById('slideFuelLeak').valueAsNumber]" draggable="false" style="
    vertical-align: bottom;
">
        <input disabled="true;" id="inputFuelLeak" style="
    width: 40px;
">



        <button onclick="failure.fail('fuelLeak')">FAIL</button>
    <br>
    <h1>Flight Control</h1>
    <h2>Ailerons</h2>
        <span style="
    font-size: large;
    vertical-align: top;
">Chance per minute: </span>
        <input type="range" min="0" max="1" step="0.01" id="slideFlightCtrl" onchange="[document.getElementById('inputFlightCtrl').value, window.failure.chances.flightCtrl.ailerons]=[document.getElementById('slideFlightCtrl').valueAsNumber, document.getElementById('slideFlightCtrl').valueAsNumber]" draggable="false" style="vertical-align: bottom;">
    <input disabled="true;" id="inputFlightCtrl" style="
    width: 40px;
">
        <button onclick="failure.fail('ailerons')">FAIL</button><br>
            <h2>Elevators</h2>
        <span style="
    font-size: large;
    vertical-align: top;
">Chance per minute: </span>
        <input type="range" min="0" max="1" step="0.01" id="slideElevator" onchange="[document.getElementById('inputElevator').value, window.failure.chances.flightCtrl.elevator]=[document.getElementById('slideElevator').valueAsNumber, document.getElementById('slideElevator').valueAsNumber]" draggable="false" style="vertical-align: bottom;">
    <input disabled="true;" id="inputElevator" style="
    width: 40px;
">
        <button onclick="failure.fail('elevator')">FAIL</button><br>
        <h2>Rudder</h2>
        <span style="
    font-size: large;
    vertical-align: top;
">Chance per minute: </span>
        <input type="range" min="0" max="1" step="0.01" id="slideRudder" onchange="[document.getElementById('inputRudder').value, window.failure.chances.flightCtrl.rudder]=[document.getElementById('slideRudder').valueAsNumber, document.getElementById('slideRudder').valueAsNumber]" draggable="false" style="vertical-align: bottom;">
    <input disabled="true;" id="inputRudder" style="
    width: 40px;
">
        <button onclick="failure.fail('rudder')">FAIL</button><br>
    <h1>Electrical</h1>
        <span style="
    font-size: large;
    vertical-align: top;
">Chance per minute: </span>
        <input type="range" min="0" max="1" step="0.01" id="slideElectrical" onchange="[document.getElementById('inputElectrical').value, window.failure.chances.electrical]=[document.getElementById('slideElectrical').valueAsNumber, document.getElementById('slideElectrical').valueAsNumber]" draggable="false" style="
    vertical-align: bottom;
">

        <input disabled="true;" id="inputElectrical" style="
    width: 40px;
">
        <button onclick="failure.fail('electrical')">FAIL</button>

    <br>

    <h1>Structural</h1>
        <span style="
    font-size: large;
    vertical-align: top;
">Chance per minute: </span>
        <input type="range" min="0" max="1" step="0.01" id="slideStructural" onchange="[document.getElementById('inputStructural').value, window.failure.chances.structural]=[document.getElementById('slideStructural').valueAsNumber, document.getElementById('slideStructural').valueAsNumber]" draggable="false" style="
    vertical-align: bottom;
">

        <input disabled="true;" id="inputStructural" style="
    width: 40px;
">
        <button onclick="failure.fail('structural')">FAIL</button>

    <br>
    <h1>Hydraulic</h1>
<h2>Flaps</h2>
        <span style="
    font-size: large;
    vertical-align: top;
">Chance per minute: </span>
        <input type="range" min="0" max="1" step="0.01" id="slideFlaps" onchange="[document.getElementById('inputFlaps').value, window.failure.chances.hydraulic.flaps]=[document.getElementById('slideFlaps').valueAsNumber, document.getElementById('slideFlaps').valueAsNumber]" draggable="false" style="
    vertical-align: bottom;
">

        <input disabled="true;" id="inputFlaps" style="
    width: 40px;
">
        <button onclick="failure.fail('flaps')">FAIL</button>
<h2>Brakes</h2>
    <span style="
    font-size: large;
    vertical-align: top;
">Chance per minute: </span>
        <input type="range" min="0" max="1" step="0.01" id="slideBrakes" onchange="[document.getElementById('inputBrakes').value, window.failure.chances.hydraulic.brakes]=[document.getElementById('slideBrakes').valueAsNumber, document.getElementById('slideBrakes').valueAsNumber]" draggable="false" style="
    vertical-align: bottom;
">

        <input disabled="true;" id="inputBrakes" style="
    width: 40px;
">
        <button onclick="failure.fail('brakes')">FAIL</button>
<h2>Spoilers</h2>
    <span style="
    font-size: large;
    vertical-align: top;
">Chance per minute: </span>
        <input type="range" min="0" max="1" step="0.01" id="slideSpoilers" onchange="[document.getElementById('inputSpoilers').value, window.failure.chances.hydraulic.spoilers]=[document.getElementById('slideSpoilers').valueAsNumber, document.getElementById('slideSpoilers').valueAsNumber]" draggable="false" style="
    vertical-align: bottom;
">
        <input disabled="true;" id="inputSpoilers" style="
    width: 40px;
">
<button onclick="failure.fail('spoilers')">FAIL</button>
    <h1>Cabin Pressurization</h1>
    <span style="
    font-size: large;
    vertical-align: top;
">Chance per minute: </span>
        <input type="range" min="0" max="1" step="0.01" id="slidePressurization" onchange="[document.getElementById('inputPressurization').value, window.failure.chances.pressurization]=[document.getElementById('slidePressurization').valueAsNumber, document.getElementById('slidePressurization').valueAsNumber]" draggable="false" style="
    vertical-align: bottom;
">
        <input disabled="true;" id="inputPressurization" style="
    width: 40px;
">
        <button onclick="failure.fail('spoilers')">FAIL</button>
        <h1>Engines</h1>
        `;
            for (i = 0; i < geofs.aircraft.instance.engines.length; i++) {
                htmlContent += `
            <h2>Engine ${i+1}</h2>
    <span style="
    font-size: large;
    vertical-align: top;
">Chance per minute: </span>
        <input type="range" min="0" max="1" step="0.01" id="slideEngine${i}" onchange="document.getElementById('inputEngine${i}').value=document.getElementById('slideEngine${i}').valueAsNumber; window.failure.chances.engines[i] = document.getElementById('slideEngine${i}').valueAsNumber"; draggable="false" style="
    vertical-align: bottom;
">
        <input disabled="true;" id="inputEngine${i}" style="
    width: 40px;
">
        <button onclick="failure.fail('engine${i}')">FAIL</button>
            `;
                window.failuresMenu.innerHTML = htmlContent;
            }
        }
    }
}
window.mainFailureFunction = function() {
    'use strict';
    window.failBtn = document.createElement('div');
    window.failBtn.style.position = 'fixed';
    window.failBtn.style.right = '2%';
    window.failBtn.style.padding = '10px';
    window.failBtn.style.top = '15%';
    window.failBtn.style.border = 'transparent';
    window.failBtn.style.background = 'rgb(0,0,0)';
    window.failBtn.style.color = 'white';
    window.failBtn.style.fontWeight = '600';
    window.failBtn.style.cursor = 'pointer';
    document.body.appendChild(window.failBtn);
    window.failBtn.innerHTML = `<button style="position: inherit; right: inherit; padding: inherit; top: inherit; border: inherit; background: inherit; color: inherit; font-weight: inherit; cursor: inherit;" onclick="window.openFailuresMenu()">FAILURES</button>`;
    /*
    Some failures include:
     - Landing gear (nearly half of all aircraft-related failures) //works
     - Fuel leak (timer, then geofs.aircraft.instance.stopEngine()) //works
     - Flight control //works
     - Electrical //
     - Structural (weather.definition.turbulences = 5) //Y
     - Hydraulic (flaps, brakes, spoilers) //Y
     //- Pitot-Static (airspeed, altitude, vertical speed) (skipping this one for now too)
     - Cabin pressurization (weather.definition.turbulences = 5 when above 9,000 ft) //Y
     - Engine failure (from fire, bird strikes, or bad boeing build quality) //Y
     Discord user Singapore (singapore7216) requests a way to set the likelihood for a system to fail
     */
    console.log("Failures loaded.");
};
function waitForEntities() {
    try {
        if (geofs.cautiousWithTerrain == false) {
            // Entities are already defined, no need to wait
            window.mainFailureFunction();
            return;
        }
    } catch (error) {
        // Handle any errors (e.g., log them)
        console.log('Error in waitForEntities:', error);
    }
    // Retry after 1000 milliseconds
    setTimeout(() => {waitForEntities();}, 1000);
}
waitForEntities();
