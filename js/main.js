'use strict';

const SONG_LIST = [
	{
		author: "LED ZEPPELIN",
		song:"STAIRWAY TO HEAVEN"
	},
	{
		author: "QUEEN",
		song:"BOHEMIAN RHAPSODY"
	},
	{
		author: "LYNYRD SKYNYRD",
		song:"FREE BIRD"
	},
	{
		author: "DEEP PURPLE",
		song:"SMOKE ON THE WATER"
	},
	{
		author: "JIMI HENDRIX",
		song:"ALL ALONG THE WATCHTOWER"
	},
	{
		author: "AC/DC",
		song:"BACK IN BLACK"
	},
	{
		author: "QUEEN",
		song:"WE WILL ROCK YOU"
	},
	{
		author: "METALLICA",
		song:"ENTER SANDMAN"
	}
];

let FORM = document.forms['updateForm'];
let audioInProgress = false;
let CURRENT_AUDIO;

(function(){
	// Add New Song
	let addBtn = document.querySelector('.add');
	addBtn.addEventListener('click', () => {
		updateSong();
	});

	// Close Window
	let closeBtn = document.querySelector('.close');
	closeBtn.addEventListener('click', toggleWindow);

	// Save Info
	let saveBtn = document.querySelector('.save');
	saveBtn.addEventListener('click', saveSong);

	// Draw list
	drawList();
})();

// Draw list
function drawList() {
	let container = document.querySelector('.music-container'),
		PARSED_LIST = JSON.parse(localStorage.getItem('songList'));

	container.innerHTML = '';

	if (PARSED_LIST === null || !PARSED_LIST.length) {
		SONG_LIST.forEach((item, i) => {
			item.id = i;
		});

		localStorage.setItem('songList', JSON.stringify(SONG_LIST));
		PARSED_LIST = SONG_LIST;
	}

	PARSED_LIST.forEach((item) => {
		container.append(renderItem(item.song, item.author, item.id));
	});
}

// Draw element
function renderItem(title, author, id) {
	let item = document.createElement('li'),
		info = document.createElement('div'),
		titleElem = document.createElement('span'),
		authorElem = document.createElement('p'),
		btns = document.querySelector('.btns').cloneNode(true);

	info.className = 'info';
	titleElem.innerText = title;
	authorElem.innerText = author;

	info.append(titleElem, authorElem);
	item.append(info, btns);

	// Buttons
	let playBtn = btns.querySelector('.play'),
		stopBtn = btns.querySelector('.stop'),
		editBtn = btns.querySelector('.edit'),
		deleteBtn = btns.querySelector('.delete');

	let song = {
		author: author,
		song: title,
		id: id
	}

	editBtn.addEventListener('click', () => {
		updateSong(song);
	});

	deleteBtn.addEventListener('click', () => {
		deleteSong(song);
	});

	playBtn.addEventListener('click', function() {
		playSong(song, this);
	});

	stopBtn.addEventListener('click', function() {
		stopSong(this);
	});

	return item;
}

// Toggle Window
function toggleWindow() {
	let window = document.querySelector('.window');

	if (window.classList.contains('show')) {
		window.classList.remove('show');
		
		FORM.title.value = '';
		FORM.author.value = '';
		FORM.dataset.id = '';
	} else {
		window.classList.add('show');
	}
}

// Update song
function updateSong(item) {
	if (item) {
		FORM.title.value = item.song;
		FORM.author.value = item.author;
		FORM.dataset.id = item.id;
	}
	toggleWindow();
}

// Save song
function saveSong() {
	if (FORM.title.value === '' || FORM.author.value === '') {
		alert('Please fill all fields');
		return;
	}

	let calculatedId = setId();

	let item = {
		song: FORM.title.value,
		author: FORM.author.value,
		id: calculatedId
	},
	listStored = JSON.parse(localStorage.getItem('songList')),
	i = listStored.findIndex(elem => elem.id === item.id);

	if (i !== -1) {
		listStored[i].song = item.song;
		listStored[i].author = item.author;
		listStored[i].id = item.id;
	} else {
		listStored.push(item);
	}

	localStorage.setItem('songList', JSON.stringify(listStored));
	drawList();

	toggleWindow();
}

// Calculate id
function setId() {
	let listStored = JSON.parse(localStorage.getItem('songList')),
		randomNum = parseInt((Math.random() * (1000 - listStored.length) + listStored.length).toFixed()),
		idList = [];

	if (FORM.dataset.id) {
		return parseInt(FORM.dataset.id);
	} else {
		listStored.forEach(item => {
			idList.push(item.id);
		});
	
		return idList.includes(randomNum) ? setId() : randomNum;
	}
}

// Delete Song
function deleteSong(item) {
	let listStored = JSON.parse(localStorage.getItem('songList')),
		userAnswer = confirm(`Are you sure you want to delete ${item.song}?`);

	if (userAnswer) {
		if (listStored.length) {
			let i = listStored.findIndex(elem => elem.author === item.author && elem.song === item.song);
	
			listStored.splice(i, 1);
		}
	
		localStorage.setItem('songList', JSON.stringify(listStored));

		drawList();
	}
}

// Play Song 
function playSong(item, btn) {
	if (!audioInProgress) {
		let url = item.song.toLowerCase().split(' ').join('-');
		
		CURRENT_AUDIO = new Audio(`media/${url}.mp3`);
		CURRENT_AUDIO.load();
		CURRENT_AUDIO.volume = .5;
		CURRENT_AUDIO.play();
		
		audioInProgress = true;
		btn.classList.add('running');
	}
}

// Stop Song
function stopSong(btn) {
	CURRENT_AUDIO.pause()
	CURRENT_AUDIO.currentTime = 0.0;

	btn.parentElement.querySelector('.play').classList.remove('running');
	audioInProgress = false;
}