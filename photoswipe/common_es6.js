"use strict";

const showLargePics = (small_pics) => {

	//define
	let large_pics_element = document.createElement("div");
	let small_pics_element = $(small_pics);
	large_pics_element.className = "pics-show-wrapper";
	large_pics_element.innerHTML = `<div class='pics-list'></div><div class='num-show'><i class='current-num'></i>/<i class='total-num'></i><a href='javascript:;' class='close-icon'>x</a><a href='javascript:;' class='garbage'></a></div>`;
	
	let total_width = 0;
	let temp = 0;
	let len = $(`${small_pics} li`).length;
	let currentindex = 0;
	
	//small_pics tap
	let s_hammer = new Hammer(small_pics_element);
	s_hammer.on("tap",function(e){

		if( !document.querySelectorAll(".pics-show-wrapper")[0] ) {

			document.body.appendChild(large_pics_element);
			large_pics_element.firstElementChild.appendChild($(`${small_pics} ul`).cloneNode(true));

		}else{
			// if( large_pics_element.style.display === "none" ) {
			// 	large_pics_element.style.display = "block";
			// }
		}

		[...$(`${small_pics} li`)].map((value,index) => { 

			if( value === e.target.parentNode ) {
				currentindex = index;
			}
		});

		//init
		initPic(large_pics_element,len,currentindex);
		slidePics(large_pics_element.firstElementChild,-currentindex*(100/len)+"%");
	});

	//large_pics carousel
	const l_hammer = new Hammer(large_pics_element.firstElementChild);
	l_hammer.on("panend",function(e){
		
		//add animation
		large_pics_element.firstElementChild.style.transitionDuration = ".35s";
		large_pics_element.firstElementChild.style.webkitTransitionDuration = ".35s";

		if( e.deltaX > 0 ) {
			currentindex--;
			if( currentindex < 0 ) {
				currentindex = 0;
			}
		}

		if( e.deltaX < 0 ) {
			currentindex++;
			if( currentindex > len-1 ) {
				currentindex = len-1;
			}
		}

		//console.log(currentindex);
		temp = -currentindex * (100/len) + "%";
		slidePics(large_pics_element.firstElementChild,temp);
		large_pics_element.querySelectorAll(".current-num")[0].innerHTML = currentindex + 1;

		return false;
	});
	

	//status bar hide or show
	large_pics_element.addEventListener("click",function(){

		let ele = this.querySelectorAll(".num-show")[0];
		let className = "slideToTop";

		if( ele.classList.contains(className) === true ) {
			ele.classList.remove(className);
		}else {
			ele.classList.add(className);
		}

		//stopPropagation
		this.querySelectorAll(".num-show")[0].addEventListener("click",function(e){
			e.stopPropagation();
		});
	});

	//close
	large_pics_element.querySelectorAll(".close-icon")[0].addEventListener("click",function(){

		document.body.removeChild(large_pics_element);
		//large_pics_element.style.display = "none";
	});

	//delete
	large_pics_element.querySelectorAll(".garbage")[0].addEventListener("click",function(){

		//cancel animation
		large_pics_element.firstElementChild.style.transitionDuration = "0s";
		large_pics_element.firstElementChild.style.webkitTransitionDuration = "0s";

		//delete
		large_pics_element.querySelectorAll("ul")[0].removeChild(large_pics_element.querySelectorAll("li")[currentindex]);
		small_pics_element.querySelectorAll("ul")[0].removeChild(small_pics_element.querySelectorAll("li")[currentindex]);

		if( currentindex === len-1 ) {
			currentindex--;
		}
		len--;
		slidePics(large_pics_element.firstElementChild,(-currentindex*(100/len)+"%"));

		if( len === 0 ) {
			document.body.removeChild(large_pics_element);
		}

		initPic(large_pics_element,len,currentindex);
	});
}

const $ = (str)  => { return document.querySelectorAll(str).length > 1 ? document.querySelectorAll(str) : document.querySelectorAll(str)[0] }

const slidePics = (ele,num) => {
	ele.style.transform = `perspective(800px) translate(${num},-50%)`;
	ele.style.webkitTransform = `perspective(800px) translate(${num},-50%)`;
}

const initPic = (ele,len,currentindex) => {
	ele.firstElementChild.style.width = 100*len + "%";
	[...ele.firstElementChild.querySelectorAll("li")].map((value,index) => {
		value.style.width = 100/len + "%";
		value.style.left = index*(100/len) + "%";
	} );
	ele.querySelectorAll(".total-num")[0].innerHTML = len;
	ele.querySelectorAll(".current-num")[0].innerHTML = currentindex+1;
}





