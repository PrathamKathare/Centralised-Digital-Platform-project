// Data arrays (initially empty)
let certificatesData = [];
let semestersData = [];
let projects = [];

// DOM Elements - Defined globally for accessibility
const profileElements = {
  name: null,
  year: null,
  college: null,
  dept: null,
  domain: null,
  email: null,
  usn: null,
  linkedin: null,
  github: null,
  leetcode: null,
};

// Utility Functions
function toggleModal(modalId, show) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.toggle('active', show);
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => alert(`Copied to clipboard: ${text}`))
    .catch(err => console.error('Failed to copy text: ', err));
}

function navigate(containerId, step) {
  const container = document.getElementById(containerId);
  const slides = container.querySelectorAll('.carousel-slide');
  if (slides.length <= 1) return;
  const activeSlide = container.querySelector('.carousel-slide.active');
  let currentIndex = [...slides].indexOf(activeSlide);
  let newIndex = (currentIndex + step + slides.length) % slides.length;
  
  if (activeSlide) activeSlide.classList.remove('active');
  slides[newIndex].classList.add('active');
}




function toggleMenu() {
  const navbarLinks = document.getElementById('navbarLinks');
  if (navbarLinks.classList.contains('active')) {
    navbarLinks.classList.remove('active');
  } else {
    navbarLinks.classList.add('active');
  }
}

function deleteItem(type, index) {
  const confirmation = confirm("Are you sure you want to delete this item?");
  if (!confirmation) return;

  if (type === 'certificates') {
    certificatesData.splice(index, 1);
    renderCertificates();
  } else if (type === 'grades') {
    semestersData.splice(index, 1);
    renderGrades();
  } else if (type === 'projects') {
    projects.splice(index, 1);
    renderProjects();
  }
}

function deleteAccountConfirmation() {
  const confirmation = confirm("Are you sure you want to delete your account? This action cannot be undone.");
  if (confirmation) {
    alert("Account deleted.");
    // Add logic here to actually delete the account and redirect the user
  }
}

// Rendering Functions
function renderCertificates(isEditMode) {
  const certContainer = document.getElementById('certContainer');
  const nextBtn = document.getElementById('certNextBtn');
  const prevBtn = document.getElementById('certPrevBtn');
  if (!certContainer) return;

  certContainer.innerHTML = '';
  if (certificatesData.length === 0) {
    const message = isEditMode ? 'No certificates added yet. Click "Add New Certificate" to get started.' : 'No certificates to display.';
    certContainer.innerHTML = `<div class="empty-state">${message}</div>`;
    if (nextBtn) nextBtn.style.display = 'none';
    if (prevBtn) prevBtn.style.display = 'none';
  } else {
    certificatesData.forEach((cert, i) => {
      const slide = document.createElement('div');
      slide.className = 'carousel-slide cert-slide';
      let deleteButtonHtml = isEditMode ? `<button class="delete-btn" onclick="deleteItem('certificates', ${i})">&times;</button>` : '';
      slide.innerHTML = `${deleteButtonHtml}<img src="${cert.img}" alt="Certificate" class="cert-img"><div class="cert-details">${cert.details}</div>`;
      certContainer.appendChild(slide);
    });
    if (certContainer.firstElementChild) certContainer.firstElementChild.classList.add('active');
    if (nextBtn) nextBtn.style.display = 'flex';
    if (prevBtn) prevBtn.style.display = 'flex';
  }
}

function renderGrades(isEditMode) {
  const gradeContainer = document.getElementById('gradeContainer');
  const nextBtn = document.getElementById('gradeNextBtn');
  const prevBtn = document.getElementById('gradePrevBtn');
  if (!gradeContainer) return;

  gradeContainer.innerHTML = '';
  if (semestersData.length === 0) {
    const message = isEditMode ? 'No grades added yet. Click "Add New Grade" to get started.' : 'No grades to display.';
    gradeContainer.innerHTML = `<div class="empty-state">${message}</div>`;
    if (nextBtn) nextBtn.style.display = 'none';
    if (prevBtn) prevBtn.style.display = 'none';
  } else {
    semestersData.forEach((sem, i) => {
      const slide = document.createElement('div');
      slide.className = 'carousel-slide grade-slide';
      let deleteButtonHtml = isEditMode ? `<button class="delete-btn" onclick="deleteItem('grades', ${i})">&times;</button>` : '';
      let subjectsHtml = sem.subjects.map(s => `<div><span>${s.name}:</span> <strong>${s.grade}</strong></div>`).join('');
      slide.innerHTML = `${deleteButtonHtml}<div class="grade-header">${sem.sem} - SGPA: ${sem.sgpa}</div><div class="subject-grades">${subjectsHtml}</div>`;
      gradeContainer.appendChild(slide);
    });
    if (gradeContainer.firstElementChild) gradeContainer.firstElementChild.classList.add('active');
    if (nextBtn) nextBtn.style.display = 'flex';
    if (prevBtn) prevBtn.style.display = 'flex';
  }
}

function renderProjects(isEditMode) {
  const container = document.getElementById('projectCardsContainer');
  if (!container) return;

  container.innerHTML = '';
  if (projects.length === 0) {
    const message = isEditMode ? 'No projects added yet.' : 'No projects to display.';
    container.innerHTML = `<p style="text-align:center; color:var(white); font-style: italic;">${message}</p>`;
  } else {
    projects.forEach((proj, i) => {
      const card = document.createElement('div');
      card.className = 'project-card';
      let deleteButtonHtml = isEditMode ? `<button class="delete-btn" onclick="deleteItem('projects', ${i})">&times;</button>` : '';
      const skillsHtml = proj.skills.split(',').map(s => `<span>${s.trim()}</span>`).join('');
      card.innerHTML = `${deleteButtonHtml}<a href="${proj.github}" target="_blank" class="project-card-title">${proj.title}</a><p class="project-card-desc">${proj.description}</p><div class="project-card-skills"><b>Skills:</b> ${skillsHtml}</div>`;
      container.appendChild(card);
    });
  }
}

// Main logic triggered after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const isEditMode = document.getElementById('editProfileBtn') !== null;
  
  Object.assign(profileElements, {
    name: document.getElementById('profileName'),
    year: document.getElementById('profileYear'),
    college: document.getElementById('profileCollege'),
    dept: document.getElementById('profileDept'),
    domain: document.getElementById('profileDomain'),
    email: document.getElementById('profileEmail'),
    usn: document.getElementById('profileUSN'),
    linkedin: document.querySelector('.social-icons img[alt="LinkedIn"]').parentElement,
    github: document.querySelector('.social-icons img[alt="GitHub"]').parentElement,
    leetcode: document.querySelector('.social-icons img[alt="LeetCode"]').parentElement,
  });

  // TODO: Add your API call here to fetch the initial data.
  // Example: fetch('/api/student/profile').then(response => response.json()).then(data => {
  //   certificatesData = data.certificates;
  //   semestersData = data.semesters;
  //   projects = data.projects;
  //   // Call the render functions after data is loaded
  //   renderCertificates(isEditMode);
  //   renderGrades(isEditMode);
  //   renderProjects(isEditMode);
  // });

  if (isEditMode) {
    // --- Edit Mode Logic ---
    
    // Event Listeners for Modals and Forms
    document.getElementById('editProfileBtn').addEventListener('click', () => {
      document.getElementById('editName').value = profileElements.name.textContent;
      document.getElementById('editYear').value = profileElements.year.textContent;
      document.getElementById('editCollege').value = profileElements.college.textContent;
      document.getElementById('editDept').value = profileElements.dept.textContent;
      document.getElementById('editDomain').value = profileElements.domain.textContent;
      document.getElementById('editEmail').value = profileElements.email.textContent;
      
      toggleModal('editProfileModal', true);
    });
    document.getElementById('addCertBtn').addEventListener('click', () => toggleModal('addCertModal', true));
    document.getElementById('addGradeBtn').addEventListener('click', () => toggleModal('addGradeModal', true));
    document.getElementById('addProjectBtn').addEventListener('click', () => toggleModal('addProjectModal', true));

    document.getElementById('editProfileForm').addEventListener('submit', (e) => {
      e.preventDefault();
      profileElements.name.textContent = document.getElementById('editName').value;
      profileElements.year.textContent = document.getElementById('editYear').value;
      profileElements.college.textContent = document.getElementById('editCollege').value;
      profileElements.dept.textContent = document.getElementById('editDept').value;
      profileElements.domain.textContent = document.getElementById('editDomain').value;
      profileElements.email.textContent = document.getElementById('editEmail').value;
      profileElements.email.href = `mailto:${document.getElementById('editEmail').value}`;
      profileElements.linkedin.href = document.getElementById('editLinkedin').value;
      profileElements.github.href = document.getElementById('editGithub').value;
      profileElements.leetcode.href = document.getElementById('editLeetcode').value;
      toggleModal('editProfileModal', false);
    });

    document.getElementById('addCertForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const newCert = {
        img: document.getElementById('certUrl').value,
        details: document.getElementById('certDetails').value
      };
      certificatesData.push(newCert);
      renderCertificates(true);
      toggleModal('addCertModal', false);
    });

    document.getElementById('addGradeForm').addEventListener('submit', (e) => {
      e.preventDefault();
      try {
        const subjectsInput = document.getElementById('gradeSubjects').value;
        let subjectsParsed;
        if (subjectsInput.trim().startsWith('[') && subjectsInput.trim().endsWith(']')) {
            subjectsParsed = JSON.parse(subjectsInput);
        } else {
            subjectsParsed = subjectsInput.split(',').map(s => {
                const parts = s.split(':').map(p => p.trim());
                return { name: parts[0], grade: parts[1] || 'N/A' };
            });
        }

        const newGrade = {
          sem: document.getElementById('gradeSem').value,
          sgpa: parseFloat(document.getElementById('gradeSGPA').value),
          subjects: subjectsParsed
        };
        semestersData.push(newGrade);
        renderGrades(true);
        toggleModal('addGradeModal', false);
      } catch (error) {
        alert("Invalid format for subjects. Please use JSON array format or comma-separated subject:grade pairs.");
        console.error(error);
      }
    });

    document.getElementById('addProjectForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const newProject = {
        title: document.getElementById('projectTitle').value,
        description: document.getElementById('projectDesc').value,
        skills: document.getElementById('projectSkills').value,
        github: document.getElementById('projectGitHub').value
      };
      projects.push(newProject);
      renderProjects(true);
      toggleModal('addProjectModal', false);
    });

    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
          toggleModal(modal.id, false);
        }
      });
    });

    // You can remove these lines if you prefer to start with a truly blank slate
    renderCertificates(true);
    renderGrades(true);
    renderProjects(true);

  } else {
    // --- View Mode Logic ---
    
    // You can remove these lines if you prefer to start with a truly blank slate
    renderCertificates(false);
    renderGrades(false);
    renderProjects(false);
  }

  // Auto-carousel (Shared by both pages)
  setInterval(() => {
    if (certificatesData.length > 1) {
      navigate('certContainer', 1);
    }
  }, 4000);
  setInterval(() => {
    if (semestersData.length > 1) {
      navigate('gradeContainer', 1);
    }
  }, 4000);

});
//nav bar
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
    menuToggle.classList.toggle("active");
  });
});


// password
function togglePasswordVisibility(fieldId) {
            const passwordInput = document.getElementById(fieldId);
            const toggleIcon = passwordInput.parentElement.querySelector('.toggle-password i');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleIcon.classList.remove('fa-eye');
                toggleIcon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                toggleIcon.classList.remove('fa-eye-slash');
                toggleIcon.classList.add('fa-eye');
            }
        }

// chat bot
(function(){
  if(!window.chatbase || window.chatbase("getState") !== "initialized"){
    window.chatbase = function() {
      if(!window.chatbase.q){window.chatbase.q=[]}
      window.chatbase.q.push(arguments);
    };
    window.chatbase = new Proxy(window.chatbase, {
      get(target, prop) {
        if(prop === "q"){return target.q}
        return (...args) => target(prop, ...args);
      }
    });
  }
  const onLoad = function() {
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.id = "W7i5f3PSYd_BliHoXJthj";
    script.domain = "www.chatbase.co";
    document.body.appendChild(script);
  };
  if(document.readyState === "complete"){
    onLoad();
  } else {
    window.addEventListener("load", onLoad);
  }
})();
