/**   PARTE 1 - PLANIFICADOR
 * 
 * 1.Cáculo de Ancho y Alto 
 * 2.Cálculo de la resolución
 * 
 */
function calculaFotografia(){

    var alturaMilimetros=(parseFloat(document.getElementById('altura').value)*1000);
    var anchoFotografiaMilimetros = (alturaMilimetros * (parseFloat(document.getElementById('anchoSensor').value)))/(document.getElementById('distanciaFocal').value);
    var anchoFotografiaMetros = anchoFotografiaMilimetros/1000;

    document.getElementById('resultadoAnchoFotografiaMetros').value = anchoFotografiaMetros; 

    var altoFotografiaMilimetros = (alturaMilimetros * (parseFloat(document.getElementById('alturaSensor').value)))/(document.getElementById('distanciaFocal').value);
    var altoFotografiaMetros = altoFotografiaMilimetros /1000;
    document.getElementById('resultadoAltoFotografiaMetros').value = altoFotografiaMetros; 
}

function calculaResolucion(){

    var resultadoResolucionAncho =(parseFloat(document.getElementById('resultadoAnchoFotografiaMetros').value))/(parseFloat(document.getElementById('numeroFilasPixeles').value));
    document.getElementById('resultadoResolucionAnchoppp').value = resultadoResolucionAncho;

    var resolucionFotografiaAlto =(parseFloat(document.getElementById('resultadoAltoFotografiaMetros').value))/(parseFloat(document.getElementById('numeroColumnasPixeles').value));
    document.getElementById('resultadoResolucionAltoppp').value = resolucionFotografiaAlto;
}  

/**   PARTE 2 - funciones SVG
 * 
 * 1.Función para cambiar ViewBOX ZOOM
 * 2. Función de estado
 * 3. Función para diferenciar estados
 * 4. Función transalte coordenadas
 * 5. Función obtener coordenadas
 * 6. Función crear Path
 * 7. Cálculo de las distancias de las toma de fotografia
 * 8. Crear misión
 * 
 */


var svgNS = "http://www.w3.org/2000/svg";  
let SVGWidth;
let SVGHeight;
let SVGWidthInit;
let SVGHeightInit;

let photo;
let dronePath;
let photocenter;



// variables globales
let state= ""; 
let strokeColor = "#FFFFFF"
let backColor = "#000000"

// 1. Función para cambiar ViewBOX ZOOM
function changeViewBox(SVGWidthInit, SVGHeightInit, SVGWidth,  SVGHeight){

    SVGWidthInit =(parseFloat(document.getElementById('AnchoViewBoxInit').value));
    SVGHeightInit =(parseFloat(document.getElementById('AltoViewBoxInit').value));

    SVGWidth =(parseFloat(document.getElementById('AnchoViewBox').value));
    SVGHeight =(parseFloat(document.getElementById('AltoViewBox').value));

 
    let vbox = SVGWidthInit + " " + SVGHeightInit + " " + SVGWidth + " " +SVGHeight;
    var svgArea = document.getElementById('svgContainer');
    svgArea.setAttribute("viewBox",vbox);
}

// 2. funcion estado
function fillState(_state,_stroke, _back){
    state=_state // _state es la variable local 
    strokeColor = _stroke;
    backColor = _back;
}
//3. funcion difereciar estados para completar los TexBox correspondientes
function fillinTextBox(xy){ 
    
    if(state==="tof"){
        document.getElementById('tofx').value = xy[0];
        document.getElementById('tofy').value = xy[1];
    }
    if(state==="land"){
        document.getElementById('landx').value = xy[0];
        document.getElementById('landy').value = xy[1];
    }

    if(state==="Min"){
        document.getElementById('xMin').value = xy[0];
        document.getElementById('yMin').value = xy[1];
    }
    if(state==="Max"){
        document.getElementById('xMax').value = xy[0];
        document.getElementById('yMax').value = xy[1];
    
    }
}
// 4. Función para modificar la x e y al hacer click
function translateXY(x,y){

    svgArea= document.getElementById('svgContainer'); //coge el area
    let vbox=svgArea.getAttribute('viewBox'); //coge atributo viewbox

    vbox=vbox.split(" ");// lo pasamos a string vbox=(4) [x y ancho alto]
    vbox= vbox.map(e => parseInt(e)); // le decimos que paseralo a entero

    let newX = (parseFloat(vbox[2])/parseFloat(svgArea.getAttribute('width')))* x;
    let newY = (parseFloat(vbox[3])/parseFloat(svgArea.getAttribute('height')))* y;

    newX= newX + vbox[0];
    newY= newY + vbox[1];

    let xt=[newX,newY];

    return xt;
    
}

//5. función obtener coordenadas
function getCoors(evt){

    console.log(evt);
    let xy=translateXY(evt.layerX,evt.layerY)// transformación

    fillinTextBox(xy); //completar campos

    let x=xy[0];
    let y=xy[1];

    fillinTextBox(xy)// rellenamos el textbox
    if(state!=='')
    {
    let circle = document.getElementById(state)
        if(circle){
            circle.setAttributeNS(null,"cx",x);
            circle.setAttributeNS(null,"cy",y);
        } else {
            let circle = document.createElementNS(svgNS,"circle");
            circle.setAttributeNS(null,"cx",x);
            circle.setAttributeNS(null,"cy",y);
            circle.setAttributeNS(null,"r",5);
            circle.setAttributeNS(null,"fill",backColor);
            circle.setAttributeNS(null,"stroke",strokeColor);
            circle.setAttributeNS(null,"id",state);
            document.getElementById("svgContainer").appendChild(circle);
            }  
        state = ''; 

        createPath();
    }
}

//6. función crear Path
function createPath(){

    let xmin = parseInt(document.getElementById('xMin').value);
    let ymin = parseInt(document.getElementById('yMin').value);
    let xmax = parseInt(document.getElementById('xMax').value);
    let ymax = parseInt(document.getElementById('yMax').value);

    let _xmin = xmin;
    if(_xmin>xmax){
        xmin = xmax;
        xmax = _xmin
    }

    let _ymin = ymin;
    if(_ymin>ymax){
        ymin = ymax;
        ymax = _ymin
    }

    const data = `M${xmin},${ymin} L${xmin},${ymax} L${xmax},${ymax} L${xmax},${ymin} Z`;

    let pathId = 'AreaPath'
    let line2path = document.getElementById(pathId)
// area de misión
    if(line2path){
        line2path.setAttributeNS(null,"d",data);
    } else {
        let line2path = document.createElementNS(svgNS,"path");
        line2path.setAttributeNS(null,"id",pathId);
        line2path.setAttributeNS(null,"d",data);
        line2path.setAttributeNS(null,"fill","rgba(211, 182, 238, 0.658)");
        line2path.setAttributeNS(null,"stroke",strokeColor);
        document.getElementById("svgContainer").appendChild(line2path); 
    }
}

// 7. Cálculo de las distancias de las toma de fotografia
function coor_distancia_longitudinal(){

    overlap=(parseFloat(document.getElementById('overlap').value));
    altoFotografia=(parseFloat(document.getElementById('resultadoAltoFotografiaMetros').value));

    document.getElementById('distanciaoverlap').value = altoFotografia*(1-(overlap/100));

    
}
function  coor_distancia_lateral(){

    sidelap =(parseFloat(document.getElementById('sidelap').value));
    anchoFotografia=(parseFloat(document.getElementById('resultadoAnchoFotografiaMetros').value));


    document.getElementById('distanciasidelap').value = anchoFotografia*(1-(sidelap/100));
 
}

/**   PARTE 3- funciones pintar
 * 
 * 1. Pintar circulo
 * 2. Pintar path
 * 3. Pintar fotos
 * 
 */

// función pintar circulo
function paintCircle(x,y){

    let circle = document.createElementNS(svgNS,"circle");
    circle.setAttributeNS(null,"cx",x);
    circle.setAttributeNS(null,"cy",y);
    circle.setAttributeNS(null,"r",3);
    circle.setAttributeNS(null,"fill","rgb(30, 212, 020)");
    circle.setAttributeNS(null,"stroke", "rgb(8, 133, 40)");
    circle.setAttributeNS(null,"id",state);
    //document.getElementById("svgContainer").appendChild(circle);
    return circle;

}

function paintrect(x,y){
    let xrec=x-parseFloat((document.getElementById('resultadoAnchoFotografiaMetros').value)/2);
    let yrec=y-parseFloat((document.getElementById('resultadoAltoFotografiaMetros').value)/2);
    let width=parseFloat(document.getElementById('resultadoAnchoFotografiaMetros').value);
    let height=parseFloat(document.getElementById('resultadoAltoFotografiaMetros').value);
    let rect = document.createElementNS(svgNS,"rect");
    rect.setAttributeNS(null,"x",xrec);
    rect.setAttributeNS(null,"y",yrec);
    rect.setAttributeNS(null,"width",width);
    rect.setAttributeNS(null,"height",height);
    rect.setAttributeNS(null,"fill","rgba(240, 188, 17, 0.127)");
    rect.setAttributeNS(null,"stroke","rgb(245, 191, 12)");
    rect.setAttributeNS(null,"id",state);
    return rect;
    //document.getElementById("svgContainer").appendChild(rect);

}

function paintpath(puntos){

    let landx=parseInt(document.getElementById("landx").value);
    let landy=parseInt(document.getElementById("landy").value);

    dronePath = document.createElementNS(svgNS,"path");
    let data = `M ${puntos[0][0]},${puntos[0][1]} `; 
    
    for(let i=1; i<puntos.length; i++){
        data +=  `L ${puntos[i][0]},${puntos[i][1]}`
    }
    data +=  `L ${landx},${landy}`
    //   {xmin},${ymin} L${xmin},${ymax} L${xmax},${ymax} L${xmax},${ymin} Z`;
    
    dronePath.setAttributeNS(null,"id","mycircle");
    dronePath.setAttributeNS(null,"d",data);
    dronePath.setAttributeNS(null,"fill","none");
    dronePath.setAttributeNS(null,"stroke","green");
    document.getElementById("svgContainer").appendChild(dronePath);
    
}

function paintfullypath(){
    d3.select(photo).remove();
    d3.select(dronePath).remove();
    d3.select(photocenter).remove();
    // variables necesarias
    //photo = dronePath = document.createElementNS(svgNS,"g"); // creamos un atributo g (group, agrupa argumentos dentro de el) 
    photo = document.createElementNS(svgNS,"g");
    photocenter = document.createElementNS(svgNS,"g");
    const g = document.createElement("g");

    let tofx=parseInt(document.getElementById("tofx").value);
    let tofy=parseInt(document.getElementById("tofy").value);

    let landx=parseInt(document.getElementById("landx").value);
    let landy=parseInt(document.getElementById("landy").value);

    let xmin = parseInt(document.getElementById('xMin').value);
    let ymin = parseInt(document.getElementById('yMin').value);
    let xmax = parseInt(document.getElementById('xMax').value);
    let ymax = parseInt(document.getElementById('yMax').value);
    
    let _xmin = xmin;
    if(_xmin>xmax){
        xmin = xmax;
        xmax = _xmin
    }

    let _ymin = ymin;
    if(_ymin>ymax){
        ymin = ymax;
        ymax = _ymin
    }

    let altoArea= ymin-ymax;
    let anchoArea = xmax-xmin;

    let puntos = [];

    let x = xmin;
	let y = ymin;

    let distanciaSidelap = parseFloat(document.getElementById('distanciasidelap').value);
    let distanciaOverlap = parseFloat(document.getElementById('distanciaoverlap').value);

    let ascendente;

    // inicio de la mission:
    puntos.push([tofx, tofy]);

    //evaluamos el take off en x e y dividiendo el terreno en cuatro partes
    if(tofx>(xmin+(anchoArea/2))){ //xmax 
        
        if(tofy>(ymax+(altoArea/2))){// a xmax ymax

            puntos.push([xmax, ymax]);
            ascendente = true;

            for (let i=xmax ;i>xmin; i-= distanciaSidelap){

                if (ascendente){
                    for (let j=ymax;j>ymin; j-= distanciaOverlap){
                        x = i;
                        y = j;
                        
                        puntos.push([x, y]);
                        photo.appendChild(paintrect(x,y));
                        photocenter.appendChild(paintCircle(x,y));
                         
                    } 
                }else{
                    for (let j=ymin;j<ymax; j+= distanciaOverlap){
                        x = i;
                        y = j;
                        
                        puntos.push([x, y]);
                        photo.appendChild(paintrect(x,y));
                        photocenter.appendChild(paintCircle(x,y));
                    }
                }
                ascendente = !ascendente;
                document.getElementById("svgContainer").appendChild(photo);
                document.getElementById("svgContainer").appendChild(photocenter);
            } 
        
        }else{// xmax ymin
            puntos.push([xmax, ymin]);
            ascendente = false;
            for (let i=xmax ;i>xmin; i-= distanciaSidelap){

                if (ascendente){
                    for (let j=ymax;j>ymin; j-= distanciaOverlap){
                        x = i;
                        y = j;
                        
                        puntos.push([x, y]);
                        photo.appendChild(paintrect(x,y));
                        photocenter.appendChild(paintCircle(x,y));
                    } 
                }else{
                    for (let j=ymin;j<ymax; j+= distanciaOverlap){
                        x = i;
                        y = j;
                        
                        puntos.push([x, y]);
                        photo.appendChild(paintrect(x,y));
                        photocenter.appendChild(paintCircle(x,y));

                    }
                }
                ascendente = !ascendente;
                document.getElementById("svgContainer").appendChild(photo);
                document.getElementById("svgContainer").appendChild(photocenter);
            } 
          
        }
       
    }else{//xmin
        if(tofy>(ymax+(altoArea/2))){// a xmin ymax
            puntos.push([xmin, ymax]);

            ascendente = true;
            for (let i=xmin ;i<xmax; i+= distanciaSidelap){

                if (ascendente){
                    for (let j=ymax;j>ymin; j-= distanciaOverlap){
                        x = i;
                        y = j;
                        
                        puntos.push([x, y]);
                        photo.appendChild(paintrect(x,y));
                        photocenter.appendChild(paintCircle(x,y));

                    } 
                }else{
                    for (let j=ymin;j<ymax; j+= distanciaOverlap){
                        x = i;
                        y = j;
                        
                        puntos.push([x, y]);
                        photo.appendChild(paintrect(x,y));
                        photocenter.appendChild(paintCircle(x,y));
                        
                    }
                
                }
                ascendente = !ascendente;
                document.getElementById("svgContainer").appendChild(photo);
                document.getElementById("svgContainer").appendChild(photocenter);
            } 
            
        }else{// xmin ymin

            puntos.push([xmin, ymin]);
            ascendente = false;

            for (let i=xmin ;i<xmax; i+= distanciaSidelap){

                if (ascendente){
                    for (let j=ymax;j>ymin; j-= distanciaOverlap){
                        x = i;
                        y = j;
                        
                        puntos.push([x, y]);
                        photo.appendChild(paintrect(x,y));
                        photocenter.appendChild(paintCircle(x,y));

                    } 
                }else{
                    for (let j=ymin;j<ymax; j+= distanciaOverlap){
                        x = i;
                        y = j;
                        
                        puntos.push([x, y]);
                        photo.appendChild(paintrect(x,y));
                        photocenter.appendChild(paintCircle(x,y));
                        
                    }
                
                }
                ascendente = !ascendente;
                document.getElementById("svgContainer").appendChild(photo);
                document.getElementById("svgContainer").appendChild(photocenter);
            
            } 
          
        }
        
    }
    

   // Últimos waypoints de la misión:
   puntos.push([landx, landy]);
   // pintamos el path
   paintpath(puntos);
    
}
// hacer capas para no ver las Photos ya que molestan a la hora de ver la misión
function switchVisiblePhoto(){
    if (photo.style.display === "none"){
        photo.style.display = "block";
    } else {
        photo.style.display = "none"
    }
}
 
function switchVisiblePhotoCenter(){
    if (photocenter.style.display === "none"){
        photocenter.style.display = "block";
    } else {
        photocenter.style.display = "none"
    }
}

