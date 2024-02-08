// script.js

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const resumeContainer = document.getElementById("resumeContainer");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const jobFilterInput = document.getElementById("jobFilter");
  const searchBtn = document.getElementById("searchBtn");
  const searchResult = document.getElementById("searchResult");

  let currentUser = null;
  let currentApplicantIndex = 0;
  let filteredApplicants = [];

  // Load JSON data
  const fetchData = async () => {
    const response = await fetch("data.json");
    const data = await response.json();
    return data;
  };

  // Display login or resume page based on authentication
  const displayPage = () => {
    if (currentUser) {
      displayResumePage();
    } else {
      displayLoginPage();
    }
  };

  // Display login page
  const displayLoginPage = () => {
    document.body.innerHTML = "";
    document.body.innerHTML = `<h1>Login Page</h1>
            <form id="loginForm">
                <label for="username">Username:</label>
                <input type="text" id="username" required>
                <br>
                <label for="password">Password:</label>
                <input type="password" id="password" required>
                <br>
                <button type="submit">Login</button>
            </form>`;
    loginForm.addEventListener("submit", handleLogin);
  };

  // Display resume page
  const displayResumePage = () => {
    document.body.innerHTML = "";
    document.body.innerHTML = `<h1>Resume Page</h1>
            <div id="resumeContainer"></div>
            <button id="prevBtn">Previous</button>
            <button id="nextBtn">Next</button>
            <br>
            <label for="jobFilter">Search Job:</label>
            <input type="text" id="jobFilter">
            <button id="searchBtn">Search</button>
            <p id="searchResult"></p>`;
    prevBtn.addEventListener("click", showPreviousApplicant);
    nextBtn.addEventListener("click", showNextApplicant);
    searchBtn.addEventListener("click", handleSearch);
    fetchData().then((data) => {
      filteredApplicants = data.applicants;
      displayApplicant();
    });
  };

 const redirectToPage = (page) => {
   window.location.href = `${page}.html`;
 };

 const handleLogin = (e) => {
   e.preventDefault();
   const username = document.getElementById("username").value;
   const password = document.getElementById("password").value;

   // For simplicity, using basic authentication
   if (username === "user" && password === "password") {
     currentUser = username;
     redirectToPage("resume");
   } else {
     alert("Invalid username/password");
   }
 };


  // Display details of the current applicant
  const displayApplicant = () => {
    const currentApplicant = filteredApplicants[currentApplicantIndex];
    resumeContainer.innerHTML = `<h2>${currentApplicant.name}</h2>
            <p>Job: ${currentApplicant.job}</p>
            <p>Experience: ${currentApplicant.experience}</p>
            <p>Education: ${currentApplicant.education}</p>
            <p>Skills: ${currentApplicant.skills.join(", ")}</p>`;
  };

  // Show the previous applicant
  const showPreviousApplicant = () => {
    if (currentApplicantIndex > 0) {
      currentApplicantIndex--;
      displayApplicant();
    }
  };

  // Show the next applicant
  const showNextApplicant = () => {
    if (currentApplicantIndex < filteredApplicants.length - 1) {
      currentApplicantIndex++;
      displayApplicant();
    }
  };

  // Handle job search
  const handleSearch = () => {
    const searchValue = jobFilterInput.value.toLowerCase();
    filteredApplicants = fetchData().applicants.filter((applicant) =>
      applicant.job.toLowerCase().includes(searchValue)
    );
    if (filteredApplicants.length === 0) {
      searchResult.innerText =
        "Invalid search or No applications for this job.";
    } else {
      searchResult.innerText = "";
    }
    currentApplicantIndex = 0;
    displayApplicant();
  };

  displayPage();
});
