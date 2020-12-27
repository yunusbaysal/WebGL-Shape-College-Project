"use strict";

var vertices = [
        vec4( -0.1, -0.1,  0.1, 1.0 ),
        vec4( -0.1,  0.6,  0.1, 1.0 ),
        vec4(  0.1,  0.6,  0.1, 1.0 ),
        vec4(  0.1, -0.1,  0.1, 1.0 ),
        vec4( -0.1, -0.1, -0.1, 1.0 ),
        vec4( -0.1,  0.6, -0.1, 1.0 ),
        vec4(  0.1,  0.6, -0.1, 1.0 ),
        vec4(  0.1, -0.1, -0.1, 1.0 ),
		// diğer parça için 
		// vec4(  0.1, -0.1,  0.1, 1.0 ),
		 // vec4(  0.1, -0.1, -0.1, 1.0 ),
		vec4(	0.1,0.1,0.1,1.0),  //v9
		vec4(  0.1,0.1,-0.1,1.0),   // v10
		// bir sonraki parça
		vec4(0.4,-0.1,0.1,1.0),		// v11
		vec4(0.4,-0.1,-0.1,1.0),	// v12	
		vec4(0.4,0.1,0.1,1.0),		// v13
		vec4(0.4,0.1,-0.1,1.0),		// v14
		// son parçalar
		vec4(0.6,-0.1,0.1,1.0),    // v15
		vec4(0.6,-0.1,-0.1,1.0),	// v16
		vec4(0.4,0.6,0.1,1.0),		//v17
		vec4(0.4,0.6,-0.1,1.0),		//v18
		vec4(0.6,0.6,0.1,1.0),		// v19
		vec4(0.6,0.6,-0.1,1.0)		// v20
		
	
    ];

var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [1.0, 0.2, 1.0, 1.0 ]  // gh
		  
    ];
	 
var canvas;
var gl,program;

var NumVertices  = 300;
var wframe=false;
var normArray = [];
var points = [];
var colors = [];
var redColor=0.0,greenColor=0.0,blueColor=0.0;
var lightposition_state=false;

//var lightingColor=0.0;
var flag_Color=0;
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = xAxis; 
var theta = [0.0,0.0,2.0];  // 3 rotate durumu için güncel açı değerleri

var scale=0.65;
var Transparency=1.0,transpa=1.0;
var translatex=-0.2;
var translatey=0.0;
var translatez=0.0;

var modelViewMatrix;
var projectionMatrix;

var flag = true;
var direction = true;
var change_Projection = true;
var lighting = false;

var eye;
const at = vec3(0.0, 0.0, 0.0);   
const up = vec3(0.0, 1.0, 0.0);	 




// dik projectiion için (ortgonal)
var left = -1.0;
var right = 1.0;
var ytop = 1.0;
var bottom = -1.0;
// COP perpective icin 
  // fovy i sabit bir sayi ile fonk.a attım   aspect canwasin en bölü yükseklik
var radius=1.0;
var thetaeye=0.0;
var phi=0.0;

var ambientColor, diffuseColor, specularColor;

var lightX=1.0,lightY=1.0,lightZ=1.0;
var lightPosition = vec4(1.0, 4.0, 2.0, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialShininess = 150.0;


var materialSpecular=vec4(0.0, 1.0, 0.0, 1.0 );
var materialAmbient=vec4(0.0, 1.0, 1.0, 1.0);
var materialDiffuse=vec4(0.0, 1.0, 1.0, 1.0);


 
	function quadSides(a, b, c, d,color) 
{

    var indices = [a, b, c, a, c, d];
	var h_one,h_two,norm;
	h_one=subtract(vertices[b], vertices[a]);
	h_two=subtract(vertices[c], vertices[b]);
	
	
	norm=vec3(cross(h_one,h_two));
    for ( var i = 0; i < indices.length; ++i ) {
		
		// noktalar ve indisleri ile birlikte verileri points e push ettim
        points.push( vertices[indices[i]] );
		
		// normal array verimizi tuttum
		normArray.push(norm);	
		
		// renk verileri alındı
        colors.push(vertexColors[color]);
		
        
    }	 
}

   
	function painting_sides(side1,side2)
{	
	// birinci parça
    quadSides( 1, 0, 3, 2,2 );
    quadSides( 2, 3, 7, 6,4 );
    quadSides( 3, 0, 4, 7,3 );
    quadSides( 6, 5, 1, 2,5 );
    quadSides( 4, 5, 6, 7,6 );
    quadSides( 5, 4, 0, 1,1 );
	
	// ikinci parça
	quadSides( 8, 3, 10, 12,2 );
	quadSides( 12, 10,11, 13,4 );
    quadSides( 10,3,7,11,3 );
	quadSides( 13,9,8,12,5 );
	quadSides( 7, 9, 13, 11,6 );
    quadSides( 9,7,3,8,1 );
	
	// üçüncü parça 
    quadSides(16,10,14,18,2);
	quadSides(18,14,15,19,4);
	quadSides(14,10,11,15,3);
	quadSides(19,17,16,18,5);
	quadSides(11,17,19,15,6);
	quadSides(17,11,10,16,1);
	
}
 window.onload = function init()
{
	canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.3, 0.5, 0.4, 1.0 );
	
	
    gl.enable(gl.DEPTH_TEST);
	
	program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram(program);

    painting_sides(true,false);
	
	
	var kBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, kBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normArray), gl.STATIC_DRAW );
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );
	
	var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	var cBuffer = gl.createBuffer();
	 gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );	
	gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );	
	
   
	
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
	
	
	
	
	var ambientcarpim = mult(lightAmbient, materialAmbient);
    var  diffusecarpim = mult(lightDiffuse, materialDiffuse);
    var specularcarpim = mult(lightSpecular, materialSpecular);
		
	gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),flatten(ambientcarpim));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),flatten(diffusecarpim) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularcarpim) );	
	gl.uniform1f(gl.getUniformLocation(program, "shininess"),materialShininess);
	
	window.onkeydown=function(event){ 
	
					var key_press=String.fromCharCode(event.keyCode);
					switch(key_press)
					{
						case 't':
						case 'T':
								flag = !flag;
								break;
						case 'x':
						case 'X':
								axis = xAxis;
								break;
						case 'z':
						case 'Z':
								axis = zAxis;
								break;
						case 'y':
						case 'Y':
								axis = yAxis;
								break;
						case '1':					// pozitif taraf Default olarak rotate yönü  (saatyönünün tersinde)
								direction=true;
								break;
						case '2':
							 direction=false;		// negatif taraf yani saat yönünde
							 break;
						
						
					}
	
	
	};
	

		
	document.getElementById("Lighting").onmousedown = function(){lighting=!lighting;};
	document.getElementById("WireFrame").onclick = function(){wframe=!wframe;};
	document.getElementById("ButtonPers").onclick = function(){change_Projection = true;};
	
	document.getElementById("pers").onclick = function(){change_Projection = false;};
	
	document.getElementById("greenSlider").onchange = function(event){
		
				greenColor=event.target.value;
					
	};


	
	document.getElementById("LightX_Slider").onchange = function(event) { lightX= event.target.value;}
	document.getElementById("LightY_Slider").onchange = function(event) { lightY= event.target.value;}
	document.getElementById("LightZ_Slider").onchange = function(event) { lightZ= event.target.value;}
	
	
	document.getElementById("Transparency_Slider").onchange = function(event) { Transparency= event.target.value;};
	document.getElementById("pure_Color").onchange = function(event) { flag_Color= event.target.value;};
	
	document.getElementById("blueSlider").onchange = function(event) { blueColor= event.target.value;};
	document.getElementById("redSlider").onchange = function(event) { redColor= event.target.value;};
	document.getElementById("scaleSlider").onchange = function(event) {scale = event.target.value;};
	document.getElementById("trans_xSlider").onchange = function(event) {translatex = event.target.value;};
	document.getElementById("trans_ySlider").onchange = function(event) {translatey = event.target.value;};
	document.getElementById("trans_zSlider").onchange = function(event) {translatez = event.target.value;};
	
	
	document.getElementById("thetaeye").onchange = function(event) {thetaeye = event.target.value;};
	document.getElementById("phi").onchange = function(event) {phi = event.target.value;};
	

	render();
}

var render = function(){
	
	setTimeout( function() {
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
		if(flag){
			  if(direction){
				theta[axis] += 2.1;
				
			  }
			  else{
				theta[axis] -= 2.1;
				
			  }
			}
	eye = vec3(radius*Math.sin(phi), radius*Math.sin(thetaeye), 
             radius*Math.cos(phi));
			 
	modelViewMatrix = lookAt(eye, at, up);
	
	modelViewMatrix[0][0] = modelViewMatrix[0][0] * scale; 
	modelViewMatrix[1][1] = modelViewMatrix[1][1] * scale; 
	modelViewMatrix[2][2] = modelViewMatrix[2][2] * scale;	
	
	modelViewMatrix = mult( modelViewMatrix, translate(translatex, translatey, translatez));
	
	modelViewMatrix = mult( modelViewMatrix, rotateX(theta[0]) );
	modelViewMatrix = mult( modelViewMatrix, rotateY(theta[1]) );
	modelViewMatrix = mult( modelViewMatrix, rotateZ(theta[2]) );
	
	
	gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelViewMatrix));
	
	gl.uniform1f(gl.getUniformLocation(program, "redColor"),redColor);
	gl.uniform1f(gl.getUniformLocation(program, "greenColor"),greenColor);
	gl.uniform1f(gl.getUniformLocation(program, "blueColor"),blueColor);
	
	
	
	gl.uniform1i(gl.getUniformLocation(program, "flag_Color"),flag_Color);
	gl.uniform1f(gl.getUniformLocation(program,"lighting"),lighting);
	
	gl.uniform1f(gl.getUniformLocation(program,"Transparency"),Transparency);
	transpa=Transparency;
	gl.uniform1f(gl.getUniformLocation(program,"transpa"),transpa);
	
		lightPosition=vec4(lightX,lightY,lightZ,0.0);
	 gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition) );
	
	
	 
	if (change_Projection){
															//near=0.3,far=3.0
			projectionMatrix = ortho(left, right, bottom, ytop, 0.3, 3.0);   // orthogonal projection için 
	}
	else {
									//fovy degeri,aspect degeri
			projectionMatrix = perspective(90.0, canvas.width/canvas.height, 0.3,3.0);		// perpective projection için 
		}
	
	gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projectionMatrix));
	
	if(!wframe){
	gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
		requestAnimFrame(render);
		
	}
	else{
	for(var i=0; i<NumVertices; i+=3)
		gl.drawArrays( gl.LINE_LOOP,i,3);
	
	  requestAnimFrame(render);
	}
	
	}, 39);
}

