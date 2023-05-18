fetch('http://15.164.169.174:8080/results')
    .then(response => response.json())
    .then(data => {
        document.getElementById("1").innerHTML =
            data.isCorrect;
    });
fetch('http://15.164.169.174:8080/results')
    .then(response => response.json())
    .then(data => {
        document.getElementById("total").innerHTML =
            data.totalScore;
    });
fetch('http://15.164.169.174:8080/results')
    .then(response => response.json())
    .then(data => {
        document.getElementById("totalScore").innerHTML =
            data.totalScore;
    });
fetch('http://15.164.169.174:8080/results')
    .then(response => response.json())
    .then(data => {
        document.getElementById("average").innerHTML =
            data.averageScore;
    });
