/*출생연도 select box
만55세(1968년생)~만94세(1929년생) 
만나이이지만 생일 무관 -1살*/

document.addEventListener("DOMContentLoaded", function() {
  const birthYearSelect = document.getElementById("birthYear-select");
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  
  const myL = currentYear - 94;
  const myU = currentYear - 55;

  for (let i = myU; i >= myL; i--) {
    const option = document.createElement('option');
    option.value = i;
    option.text = i;
    birthYearSelect.add(new Option(option.text, option.value));
  }

  /*버튼 클릭 시*/
  document.getElementById("start-button").addEventListener("click", function(event) {
    // 기본 이벤트 제거
    event.preventDefault();
    
    // 선택된 출생연도 가져오기
    const selectedBirthYear = birthYearSelect.options[birthYearSelect.selectedIndex].value;

    // 출생연도 선택 여부 확인
    if (selectedBirthYear === "") {
      return;
    }

    // 출생연도로 만나이 계산  
    const selectedAge = currentYear-selectedBirthYear;
 
    // 서버에 요청하기
    //window.location.href = "testPage_local.html";
    fetch("http://15.164.169.174:8080/members", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        age: selectedAge
      })
    })
    .then(response => {
      if (response.ok) {
        console.log("나이 정보에 대해 fetch 와 POST 가 실행됨.");
        console.log("");
        const locationHeader = response.headers.get("Location");
        console.log(locationHeader);
        if (locationHeader) {
          const membersId = locationHeader.split("/").pop();
          localStorage.setItem("members_id", membersId);
          console.log("memberID 를 받아옴. 이 경우 : ", membersId);
          console.log("");
          // test 페이지로 전환
          window.location.href = "test_local.html";
        } else {
          throw new Error("Location header not found");
        }
      } else {
        throw new Error("HTTP error " + response.status);
      }
    })
    .catch(error => console.error(error));
  });
});
