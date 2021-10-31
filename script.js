"use strict";

const API_KEY = "617e784263fbb2763ab024ab";
const BASE_URL = "https://myfirstdb-f049.restdb.io"
const REST_URL = "/rest/students";
const MEDIA_URL = "/media/"

const Student = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  house: "",
  photo: ""
}

const listOfStudents = [];

start();

function start() {
  console.log("Started!");
  loadListOfStudents();
}

function loadListOfStudents() {
  console.log("fetching ...");
  // get list from RestDB
  fetch(BASE_URL+REST_URL, {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": API_KEY,
      "cache-control": "no-cache"
    }
  })
    .then(resp => resp.json())
    .then(json => {
      json.forEach(createStudentObject);
      displayStudents();
    });
}

function createStudentObject(jsondata) {
  const student = Object.create(Student);
  console.log(jsondata);

  const names = jsondata.fullname.split(" ");
  student.firstName = names[0];
  student.lastName = names[names.length - 1];
  student.middleName = names.length > 2 ? names[1] : null;

  student.email = jsondata.email;
  student.photo = jsondata.photo[0];

  listOfStudents.push(student);
}

function displayStudents() {
  console.table(listOfStudents);
  listOfStudents.forEach(student => {
    const template = getTemplate();
    fillTemplateWithData(template, student);
    document.querySelector("#student_table").append(template);
  })

}

function fillTemplateWithData(template, student) {
  for (const prop in student) {
    const elm = template.querySelector(`[data-field="${prop}"]`);
    if (elm.tagName === "TD") {
      // default, just set textcontent to property-value
      elm.textContent = student[prop];
    } else if (elm.tagName === "IMG") {
      // <img> - do something fancy, and use the media-library
      elm.src = BASE_URL + MEDIA_URL + student.photo + "?s=t";
    }
  }

}

function getTemplate() {
  const clone = document.querySelector("template#student_row").content.cloneNode(true);
  return clone;
}