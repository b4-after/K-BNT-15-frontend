/*나이 select box*/
const ageSelect = document.getElementById("age-select");

for (let i = 55; i <= 94; i++) {
  const option = {
    value: i,
    text: i + "세"
  };
  ageSelect.add(new Option(option.text, option.value));
}

/*버튼 클릭 시*/
document.getElementById("start-button").addEventListener("click", function(event) {
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
    
    // 서버에 요청하기
    fetch("api_url_here", {
      method: "POST",
      body: JSON.stringify({
        age: selectedAge
      })
    })
    .then(response => response.json())
    .then(data => {
      // members 식별자 localstorage에 저장하기
      localStorage.setItem("members_id", data.members_id);
      
      // 다음 페이지(검사페이지)로 이동하기
      window.location.href = "next_page_url_here";
    })
    .catch(error => console.error(error));
  });
  