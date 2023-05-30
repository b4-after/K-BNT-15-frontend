function updateTableTwo(results) {
    const tableOneRows = document.querySelectorAll("#resultTableOne tr");
    const tableTwoRows = document.querySelectorAll("#resultTableTwo tr");
  
    if (tableOneRows && tableOneRows.length > 0 && results && results.length > 0) {
      for (let i = 1; i < tableTwoRows.length - 1; i++) {
        const row = tableTwoRows[i];
  
        const resultIndex = i + tableOneRows.length - 2;
  
        if (resultIndex < results.length) {
          const isCorrect = results[resultIndex].isCorrect;
          row.querySelector("td:last-child").textContent = isCorrect;
          const word = results[resultIndex].word;
          row.querySelector("td:nth-child(2)").textContent = word;
        }
      }
    } else {
      console.error('Invalid tableOneRows or results data:', tableOneRows, results);
    }
  }
  
  // 페이지가 로드될 때 데이터를 가져옵니다.
  window.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('loading-overlay');
    overlay.style.display = 'flex';
      

    // 데이터 로딩이 완료되면 오버레이를 숨김
    // 5초 후에 데이터 로딩 완료, 오버레이 숨김
    setTimeout(function() {
      overlay.style.display = 'none';
      
     // 로컬 스토리지에 저장된 데이터가 있는지 확인합니다.
     const storedData = localStorage.getItem('resultData');
  
     // 저장된 데이터가 있으면 해당 데이터를 사용하여 표시합니다.
     if (storedData) {
       const data = JSON.parse(storedData);
       handleResponseData(data);
     } else {
       // 저장된 데이터가 없으면 서버에서 데이터를 가져옵니다.
       getDataFromServer();
     }
    },5000);   
  });
  
  // GET 요청을 보내고 서버에서 응답 데이터를 처리하는 함수
  function getDataFromServer() {
    //const memberID = 233;
    const memberID = localStorage.getItem('members_id');
    const serverURL = `https://api.bnt-15.kr/results/${memberID}`;
  
    // GET 요청을 보냅니다.
    return fetch(serverURL)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not OK');
        }
        return response.json();
      })
      .then(data => {
        handleResponseData(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        // Handle the error gracefully (e.g., display an error message)
      });
  }
  
  
  function handleResponseData(data) {
    const averageScore = data.averageScore;
    const totalScore = data.totalScore;
    const results = data.results;
  
    displayScores(averageScore, totalScore);
    displayComparisonText(averageScore, totalScore);
    updateTableOne(results);
    updateTableTwo(results);
  }

window.addEventListener('beforeunload', function(event) {
  // 이벤트가 발생한 이유가 페이지 새로고침일 때
  if (event.currentTarget.performance.navigation.type === 1) {
    // 로컬 스토리지 유지
  } else {
    // 페이지를 나가면 로컬 스토리지 클리어
    localStorage.clear();
  }
});
  
  function displayScores(averageScore, totalScore) {
    document.getElementById("averageScore").textContent = averageScore;
    document.getElementById("totalscore").textContent = totalScore;
    document.getElementById("totalScore").textContent = totalScore;
  }
  
  function displayComparisonText(averageScore, totalScore) {
    let comparisonText;
    if (totalScore > averageScore) {
      comparisonText = ' 높습니다.';
    } else if (totalScore < averageScore) {
      comparisonText = ' 낮습니다.';
    } else {
      comparisonText = ' 평균 점수입니다.';
    }
    document.getElementById('comparison').textContent = comparisonText;
  }


  
  function updateTableOne(results) {
    const tableOneRows = document.querySelectorAll("#resultTableOne tr");
  
    // Check if results is defined and has the expected structure
    if (results && Array.isArray(results)) {
      for (let i = 1; i < tableOneRows.length; i++) {
        const row = tableOneRows[i];
  
        // Check if the index is within the bounds of the results array
        if (i - 1 < results.length) {
          const isCorrect = results[i - 1].isCorrect;
          document.getElementById(i.toString()).textContent = isCorrect;
          const word = results[i - 1].word;
          row.querySelector("td:nth-child(2)").textContent = word;
        }
      }
    } else {
      console.error('Invalid results data:', results);
    }
  }
  
