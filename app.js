const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

//array of questions to get employee information
const questions = [
    {
        type: "input",
        message: "Enter team member's name",
        name: "name",
    },
    {
        type: "list",
        message: "Select team member's role",
        choices: ["Intern", "Engineer", "Manager"],
        name: "role"
    },
    {
        type: "input",
        message: "Enter team member's id",
        name: "id",
    },
    {
        type: "input",
        message: "Enter team member's email",
        name: "email",
    },
    {
        type: "input",
        message: "Enter team member's school",
        name: "school",
        //Intern specific question
        when: (response) => response.role === "Intern",
    },
    {
        type: "input",
        message: "Enter team member's GitHub username",
        name: "github",
        when: (response) => response.role === "Engineer",
    },
    {
        type: "input",
        message: "Enter team member's office number",
        name: "office",
        when: (response) => response.role === "Manager",
    },
    {
        type: "confirm",
        message: "Would you like to add another team member?",
        name: "addmember",
    },

];
//array to store employee information
const employeeData = [];
//function to add new members with info provided by user
function addMembers(response){
    let employee
    if (response.role === "Intern") {
        employee = new Intern(
            response.name,
            response.id,
            response.email,
            response.school,
        );
    } else if (response.role === "Engineer") {
        employee = new Engineer(
            response.name,
            response.id,
            response.email,
            response.github,
        );
    } else if (response.role === "Manager") {
        employee = new Manager(
            response.name,
            response.id,
            response.email,
            response.office
        );
    }
//pushing employee information into employeeInfo array
employeeData.push(employee);

//checking if user would like to add another member so addMember function runs again
if (response.addmember) {
    console.log ("Add another member");
    return inquirer.prompt(questions).then(addMembers)
}
//if not, array will be rendered into HTML file
else {
    console.log("Employee information is successfully generated");
}
//appending employeeData to output path or team.html
fs.writeFileSync(outputPath, render(employeeData), "utf-8");
};
inquirer
.prompt(questions)
.then(addMembers)
.catch(function (error){
    console.log(error);
});
// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
