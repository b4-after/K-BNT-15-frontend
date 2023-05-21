// GET 요청을 보내고 서버에서 응답 데이터를 처리하는 함수
function getDataFromServer() {
    // 서버 URL을 설정합니다.
    const serverURL = "http://15.164.169.174:8080/results/{meberID}"; // 실제 서버 URL로 변경해주세요.

    // GET 요청을 보냅니다.
    fetch(serverURL)
        .then(response => response.json())
        .then(data => {
            // 응답 데이터를 처리합니다.
            const averageScore = data.averageScore;
            const totalScore = data.totalScore;
            const results = data.results;


            // 결과를 HTML에 표시합니다.
            document.getElementById("averageScore").textContent = `평균 점수: ${averageScore}`;
            document.getElementById("totalscore").textContent = `${totalScore}`;
            document.getElementById("totalScore").textContent = totalScore;

            // totalScore가 averageScore보다 높은지 낮은지를 표시합니다.
            let comparisonText;
            if (totalScore > averageScore) {
                comparisonText = ' 평균 점수보다 높습니다.';
            } else if (totalScore < averageScore) {
                comparisonText = ' 평균 점수보다 낮습니다.';
            } else {
                comparisonText = ' 평균 점수가 같습니다.';
            }
            document.getElementById('comparison').textContent = comparisonText;

            const tableOneRows = document.querySelectorAll("#resultTableOne tr");
            for (let i = 1; i < tableOneRows.length; i++) {
                const row = tableOneRows[i];
                const isCorrect = results[i - 1].isCorrect; // results 배열이 0부터 시작한다고 가정합니다.
                document.getElementById(i.toString()).textContent = isCorrect;
                const word = results[i - 1].word; // results 배열이 0부터 시작한다고 가정합니다.
                row.querySelector("td:nth-child(2)").textContent = word;
            }

            // resultTableTwo를 업데이트합니다 (한 행의 예시)
            const tableTwoRows = document.querySelectorAll("#resultTableTwo tr");
            for (let i = 1; i < tableTwoRows.length - 1; i++) {
                const row = tableTwoRows[i];
                const isCorrect = results[i + tableOneRows.length - 2].isCorrect; // results 배열이 0부터 시작한다고 가정합니다.
                row.querySelector("td:last-child").textContent = isCorrect;
                const word = results[i + tableOneRows.length - 2].word; // results 배열이 0부터 시작한다고 가정합니다.
                row.querySelector("td:nth-child(2)").textContent = word;

            }
            // 나머지 코드는 동일합니다
        })
        .catch(error => {
            // 오류가 발생한 경우 처리합니다.
            console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
        });
}

// 페이지가 로드될 때 데이터를 가져옵니다.
getDataFromServer();
