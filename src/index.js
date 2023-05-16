/*나이 select box*/

document.addEventListener("DOMContentLoaded", function () {
  const ageSelect = document.getElementById("age-select");

  for (let i = 55; i <= 94; i++) {
    const option = {
      value: i,
      text: i + "세"
    };
    ageSelect.add(new Option(option.text, option.value));
  }

  /*버튼 클릭 시*/
  document.getElementById("start-button").addEventListener("click", function (event) {
    // 기본 이벤트 제거
    event.preventDefault();

    // 선택된 나이 가져오기
    const ageSelect = document.getElementById("age-select");
    const selectedAge = ageSelect.options[ageSelect.selectedIndex].value;

    // 나이 선택 여부 확인
    if (selectedAge === "") {
      alert("만 나이를 선택해주세요.");
      return;
    }

    window.location.href = "test.html";
    // 서버에 요청하기
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
          const locationHeader = response.headers.get("Location");
          console.log(locationHeader);
          if (locationHeader) {
            const membersId = locationHeader.split("/").pop();
            localStorage.setItem("members_id", membersId);
            // test 페이지로 전환
            window.location.href = "https://bnt-15.kr/test";
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