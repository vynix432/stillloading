// ====================
// MOBILE MENU
// ====================

const menuBtn =
document.querySelector(".menu-btn");

const navLinks =
document.querySelector(".nav-links");

if(menuBtn && navLinks){

menuBtn.addEventListener("click",()=>{

navLinks.classList.toggle("active");

});

}

// ====================
// DASHBOARD COUNTS
// ====================

function updateStats(){

const projects =
getProjects();

const journals =
getJournals();

const projectCount =
document.getElementById("projectCount");

const journalCount =
document.getElementById("journalCount");

if(projectCount){

projectCount.textContent =
projects.length;

}

if(journalCount){

journalCount.textContent =
journals.length;

}

}

// ====================
// HOME PROJECTS
// ====================

function loadHomeProjects(){

const container =
document.getElementById(
"homeProjectList"
);

if(!container) return;

const projects =
getProjects();

container.innerHTML = "";

[...projects]
.reverse()
.slice(0,3)
.forEach(project=>{

container.innerHTML += `

<div class="project-card">

<h3>
${project.title}
</h3>

<p>
${project.description}
</p>

<div class="tech-stack">

${project.date || ""}

</div>

</div>

`;

});

}

// ====================
// HOME JOURNALS
// ====================

function loadHomeJournals(){

const container =
document.getElementById(
"homeJournalList"
);

if(!container) return;

const journals =
getJournals();

container.innerHTML = "";

[...journals]
.reverse()
.slice(0,3)
.forEach(journal=>{

container.innerHTML += `

<div class="journal-card">

<h3>
${journal.title}
</h3>

<p>
${journal.content}
</p>

<div class="journal-date">

${journal.date || ""}

</div>

</div>

`;

});

}

// ====================
// SKILLS
// ====================

function loadSkillsFromSupabase(){

const skills =
getSkills();

const map = {

linux:".linux",

python:".python",

cybersecurity:".cyber",

networking:".network",

cloud:".cloud"

};

Object.entries(map)
.forEach(([key,selector])=>{

const bar =
document.querySelector(selector);

if(bar && skills[key] !== undefined){

bar.style.width =
skills[key] + "%";
const percentMap = {

linux:"linuxPercent",
python:"pythonPercent",
cybersecurity:"cyberPercent",
networking:"networkPercent",
cloud:"cloudPercent"

};

const text =
document.getElementById(
percentMap[key]
);

if(text){

text.textContent =
skills[key] + "%";

}
}

});

}

// ====================
// START
// ====================
async function loadSkillsFromSupabase(){

const { data, error } =
await supabase
.from("skills")
.select("*")
.limit(1)
.single();

if(error){

console.error(error);

return;

}

const skills = {

linux: data.linux,
python: data.python,
cybersecurity: data.cybersecurity,
networking: data.networking,
cloud: data.cloud

};

const map = {

linux:".linux",
python:".python",
cybersecurity:".cyber",
networking:".network",
cloud:".cloud"

};

Object.entries(map)
.forEach(([key,selector])=>{

const bar =
document.querySelector(selector);

if(bar){

bar.style.width =
skills[key] + "%";

}

});

const percentMap = {

linux:"linuxPercent",
python:"pythonPercent",
cybersecurity:"cyberPercent",
networking:"networkPercent",
cloud:"cloudPercent"

};

Object.keys(percentMap)
.forEach(key=>{

const el =
document.getElementById(
percentMap[key]
);

if(el){

el.textContent =
skills[key] + "%";

}

});

}

document.addEventListener(
"DOMContentLoaded",
()=>{

updateStats();

loadHomeProjects();

loadHomeJournals();

loadSkills();
loadFailureLog();
}
);
function loadFailureLog(){

const container =
document.getElementById(
"failureContainer"
);

if(!container) return;

const failures =
getFailures();

if(failures.length === 0){

container.innerHTML = `

<div class="mistake-card">

<p>
No failure logs yet.
</p>

</div>

`;

return;

}

const latest =
failures[failures.length - 1];

container.innerHTML = `

<div class="mistake-card">

<h3>Mistake</h3>

<p>
${latest.mistake}
</p>

<h3>Fix</h3>

<p>
${latest.fix}
</p>

<h3>Lesson</h3>

<p>
${latest.lesson}
</p>

</div>

`;

}


