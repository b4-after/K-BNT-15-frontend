const blocks = document.querySelectorAll('.time_blck'); // 타이머 쪽 변수
const countdown = document.getElementById('countdown'); // 카운트다운 변수
let index = 0; // 타이머 쪽 변수
let intervalId; // 타이머 쪽 변수
let remainingTime = 15; // 카운트다운 변수
const image = document.getElementById('button-image'); //버튼의 이미지를 바꿔서 보여줍니다.
//const image = document.getElementById('image'); // 이미지 dom
const prgrs_num_ui = document.getElementById('prgrs_num_ui'); // 진행도 숫자 dom 
let question_ID = 1;
let local_mem_Id = JSON.parse(localStorage.getItem("members_id"));

let mediaStream;
let mediaRecorder;
let chunks = [];

//오디오 재생
const playButton = document.getElementById('start');
const audioPlayer = document.getElementById('audioPlayer');

playButton.addEventListener('mouseenter', function() {
  audioPlayer.play();
});

playButton.addEventListener('mouseleave', function() {
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
});
//여기까지 오디오

function startRecording() {
    startMediaRecorder();
}

function startMediaRecorder() { // 이 안에 버튼 활성&비활성 있음 !!!!!!!!

    mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorder.start();
    console.log("question_ID : ", question_ID, "번째. 스트림이 초기화 및 재선언.");
    console.log("question_ID : ", question_ID, "번째. MediaRecorder.start() 활성화.");

    turn_off('start');
    turn_on('next');

    mediaRecorder.ondataavailable = function (e) {
        chunks.push(e.data);
        console.log("question_ID : ", question_ID, "번째. MediaRecorder.ondataavailable 에 의해 chunks 가 e.data 를 push");
    };

}

function stopRecording() { // 이 안에 버튼 활성&비활성 있음 !!!!!!!!
    mediaRecorder.stop();
    console.log("question_ID : ", question_ID, "번째. MediaRecorder.stop() 발생");

    turn_on('start');
    turn_off('next');

    mediaRecorder.onstop = function () {
        let blob = new Blob(chunks, { type: 'audio/wav' });
        chunks = [];

        let formData = new FormData();
        console.log("question_ID : ", question_ID, "번째. localstorage 에서 getItem 으로 memberID 가져옴");
        formData.append("memberId", local_mem_Id);
        formData.append("questionId", question_ID);
        formData.append("audio", blob, "audio.wav");
        console.log("question_ID : ", question_ID, "번째. fetch 할 formdata 와 blob 이 생성된다.");
        console.log("question_ID : ", question_ID, "번째. memberID: ", local_mem_Id);


        fetch('https://api.bnt-15.kr/answers', {
            method: "POST",
            body: formData
        })
        console.log("question_ID : ", question_ID, "번째. 도메인으로 POST 가 진행된다.");

    };
}

// Ask for microphone permission when the page loads
document.addEventListener('DOMContentLoaded', function () {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function (stream) {
            mediaStream = stream;
        })
        .catch(function (err) {
            console.error('Error accessing microphone', err);
        });
});
// 시간 막대, id=bar 의 class=time_blck 들의 transition 시작. 페이지 로드 시 자동 시작.
function startTransition() {
    console.log("question_ID : ", question_ID, "번째. 타이머와 진행도 intervalId 변동에 따라 변화 시작.");
    intervalId = setInterval(() => {
        if (index < blocks.length) {
            blocks[index].style.backgroundColor = 'white';
            index++;
        }
        if (remainingTime > 0) {
            remainingTime--;
            countdown.innerHTML = remainingTime.toString();
        }
        if (remainingTime == 0) {
            countdown.innerHTML = '0';
            setTimeout(() => { // 얘도 특성 상 위 코드보다 먼저 실행되서 강제 연장
                document.getElementById("next").click();
            }, 500);
        }
    }, 1000);
}

// 다음 문제, id=next 누르면 시간 막대, id=bar 의  transition 초기화
function resetTransition() {
    index = 0;
    clearInterval(intervalId);
    for (let i = 0; i < blocks.length; i++) {
        blocks[i].style.backgroundColor = 'orange';
    }
    remainingTime = 15;
    countdown.innerHTML = remainingTime.toString();
    console.log("question_ID : ", question_ID, "번째. 타이머, 진행도, 등 초기화 및 IntervalID clear.");
}

function img_update() {
    console.log("question_ID : ", question_ID, "번째. 도메인 API 에서 사진을 받아와 img src 를 변경.");

    fetch(`https://api.bnt-15.kr/questions/${question_ID}`, {
        method: "GET"
    })
        .then(response => response.json())
        .then(data => {
            image.src = data.imageUrl;
        })
}

function img_hide() {
    console.log("question_ID : ", question_ID, "번째. 사진을 다시 물음표로 변환해 숨긴다.");
    image.src = "https://drive.google.com/uc?export=view&id=1KuXVhv_HH9vqAinJ69C4lxEkXv6H8X9p"; //클릭하고 말하기 이미지
}

function turn_off(id) {
    console.log("question_ID : ", question_ID, "번째. ", id, " 버튼을 disabled 시키고 배경색을 바꾼다.");
    document.getElementById(id).disabled = true;

}

function turn_on(id) {
    console.log("question_ID : ", question_ID, "번째. ", id, " 버튼을 활성화시키고 배경색을 원래 가져야 할 색으로.");
    document.getElementById(id).disabled = false;

}

document.getElementById("start").addEventListener('click', () => {
    console.log("");
    console.log("===시작 new===", "question_ID : ", question_ID,);
    console.log("");
    console.log("question_ID : ", question_ID, "번째. start 버튼 클릭, 검사 시작.");

    audioPlayer.pause(); //버튼 클릭하면 오디오 중단
    audioPlayer.currentTime = 0;

    startRecording();
    startTransition();
    img_update();

    console.log("");
    console.log("==시작 end==, ", "question_ID : ", question_ID,);
    console.log("");
});

document.getElementById("next").addEventListener('click', () => {
    console.log("");
    console.log("==종료 new==", "question_ID : ", question_ID);
    console.log("");
    console.log("question_ID : ", question_ID, "번째. next 버튼이 눌렸다.");

    stopRecording();

    if (question_ID < 15) {
        question_ID = question_ID + 1;
        resetTransition();
        img_hide();
        prgrs_num_ui.innerHTML = question_ID;
    } else {
        window.location.href = "https://www.bnt-15.kr/result.html";
    }

    console.log("");
    console.log("==종료 end==", "question_ID : ", question_ID);
    console.log("");
});
