const QuestionContainer = document.querySelector('.question-container');
const AnwserContainer = document.querySelector('.answer-container');
const ResultContainer = document.querySelector('.result-container');

const NumberChampion = document.querySelector('.number-champion');


const nb_question = 10;


const VERSION = "13.6.1";

var questions;
var index_question = -1;
var nb_answer_question;

let user_tags = {
    "lane":[],
    "range":[],
    "damage":[],
    "difficulty":[],
    "role":[],
    "attack_type":[],
    "mobility":[],
    "dash":[],
    "time":[],
    "damage_type":[]
};

let index_question_hashmap = {
    0:"lane",
    1:"range",
    2:"damage",
    3:"difficulty",
    4:"role",
    5:"attack_type",
    6:"mobility",
    7:"dash",
    8:"time",
    9:"damage_type"
}

let user_result = [];


function Contains(list, x) {
    for (let i = 0; i < list.length; i++) {
        if (list[i]["name"] === x["name"]) {
            return true;
        }
    }
    return false;
}

// function RemoveDouble(list) {
//     seen = []
//     for (let i = 0; i < list.length; i++) {
//         if (Contains(seen,list[i]) == false) {
//             seen.push(list[i]);
//         }
//     }
//     return seen;
// }


function QuickResult() {
    user_result = []
    fetch('../data/champions.json')
    .then((response) => response.json())
    .then(champions => {
        var champions_array = champions;
        for (let i_tag_question = 0; i_tag_question < nb_question ; i_tag_question++) {

            var tag_question = index_question_hashmap[i_tag_question];
            var tags_question_array = user_tags[tag_question];

            for (let i_tag = 0; i_tag < tags_question_array.length;i_tag++) {

                for (let i_champion = 0 ; i_champion < champions_array.length ; i_champion++) {

                    for (let i_champion_tag = 0; i_champion_tag < champions_array[i_champion][tag_question].length; i_champion_tag++) {


                        if (champions_array[i_champion][tag_question][i_champion_tag] == tags_question_array[i_tag] && 
                            Contains(user_result,champions_array[i_champion]) == false) {
                            user_result.push(champions_array[i_champion]);
                            break;
                        }
                    }
                }
                champions_array = [...user_result];
                user_result = [];
            }
        }
        user_result = [...new Set(champions_array)];

        NumberChampion.innerText = `${user_result.length} Champions`;
        
        if (user_result.length <= 5) {
            document.querySelector('.result-button').classList.remove("hide");
        } else {
            document.querySelector('.result-button').classList.add("hide");
        }
    })
}

function ResultQuiz() {
    user_result = []
    fetch('../data/champions.json')
    .then((response) => response.json())
    .then(champions => {
        var champions_array = champions;
        for (let i_tag_question = 0; i_tag_question < nb_question ; i_tag_question++) {

            var tag_question = index_question_hashmap[i_tag_question];
            var tags_question_array = user_tags[tag_question];

            // console.log("tag question "+tag_question);
            // console.log(champions_array)

            for (let i_tag = 0; i_tag < tags_question_array.length;i_tag++) {

                for (let i_champion = 0 ; i_champion < champions_array.length ; i_champion++) {

                    for (let i_champion_tag = 0; i_champion_tag < champions_array[i_champion][tag_question].length; i_champion_tag++) {


                        if (champions_array[i_champion][tag_question][i_champion_tag] == tags_question_array[i_tag] && 
                            Contains(user_result,champions_array[i_champion]) == false) {
                            user_result.push(champions_array[i_champion]);
                            break;
                        }
                    }
                }
                champions_array = [...user_result];
                user_result = [];
            }
        }
        user_result = [...new Set(champions_array)];
        fetch('../data/champions_id.json')
        .then((response) => response.json())
        .then(ids => {
            
            let html = "";
            if (user_result.length == 0) {
                ResultContainer.classList.add("one");
                html = `<p class="champion-name">There is no champions for you...</p>`;
            } else {
                if (user_result.length == 1) {
                    ResultContainer.classList.add("one");
                } else if (user_result.length == 2) {
                    ResultContainer.classList.add("two");
                }
                for (let i = 0; i < user_result.length; i++) {
                    if (user_result.length == 1) {
                        document.querySelector('.soul-champion').classList.remove("hide");
                    }

                    if (i > 15) {
                        break;
                    }
                    html_segment = `
                    <div class="result">
                        <div class="top-result">
                            <img class="champion-img" src="http://ddragon.leagueoflegends.com/cdn/13.6.1/img/champion/${ids[user_result[i]["id"]]}.png">
                            <div class="right-result">
                                <a class="champion-name">${user_result[i]["name"]}</a>
                    `;
                    let lanes = user_result[i]["lane"][0];
                    for (let j = 1; j < user_result[i]["lane"].length; j++) {
                        lanes+= ", "+user_result[i]["lane"][j];
                    }
                    html_segment+=`
                                <p class="lane-result">${lanes}</p>
                            </div>
                        </div>
                        <div class="bottom-result">
                    `;
                    let roles = user_result[i]["role"][0];
                    for (let j = 1; j < user_result[i]["role"].length; j++) {
                        roles+= ", "+user_result[i]["role"][j];
                    }

                    let damage = user_result[i]["damage"][0];
                    for (let j = 1; j < user_result[i]["damage"].length; j++) {
                        damage+= ", "+user_result[i]["damage"][j];
                    }

                    let attack_type = user_result[i]["damage_type"][0];
                    for (let j = 1; j < user_result[i]["damage_type"].length; j++) {
                        attack_type+= ", "+user_result[i]["damage_type"][j];
                    }

                    let dash = (user_result[i]["dash"].includes("yes"))?"yes":"no";

                    html_segment+= `
                            <p><span>Role:</span> ${roles}</p>
                            <p><span>Damage:</span> ${damage}</p>
                            <p><span>Attack type:</span> ${attack_type}</p>
                            <p><span>Dash:</span> ${dash}</p>
                            <p><span>Cc:</span> Yes</p>
                        </div>
                        <img class="background-result" src="http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${ids[user_result[i]["id"]]}_0.jpg" alt="Aatrox">
                    </div>
                    `;

                    html+=html_segment;
                };
            }

            AnwserContainer.innerHTML = "";
            QuestionContainer.innerText = "";



            document.querySelector('.back-button').classList.add("hide");
            document.querySelector('.next-button').classList.add("hide");
            document.querySelector('.skip-button').classList.add("hide");
            document.querySelector('.result-button').classList.add("hide");

            document.querySelector('.quiz-page').classList.add("result-page");

            NumberChampion.classList.add("hide");
            ResultContainer.innerHTML = html;
        });
    });
}


function LoadNextQuestion() {
    fetch('../data/questions.json')
    .then((response) => response.json())    
    .then(questions => {
        index_question++;
        if (index_question < questions.length) {
            NbQuestionActions();
            nb_answer_question = questions[index_question]["nb_answer"];
            QuestionContainer.innerText = questions[index_question]["question"];

            let html = '';
            questions[index_question]["answer"].forEach(answer => {
                var html_segment = `
            <button class="answer" onclick="CheckAnswer(this)">${answer}</button>
            `;
            html+=html_segment;
            });
            AnwserContainer.innerHTML = html;
        }
        else {
            ResultQuiz();
        }
    })
}

function LoadPreviousQuestion() {
    fetch('../data/questions.json')
    .then((response) => response.json())    
    .then(questions => {
        if (index_question > 0) {
            index_question--;
            nb_answer_question = questions[index_question]["nb_answer"];    
            NbQuestionActions();
            QuestionContainer.innerText = questions[index_question]["question"];

            let html = '';
            questions[index_question]["answer"].forEach(answer => {
                var html_segment = `
            <button class="answer" onclick="CheckAnswer(this)">${answer}</button>
                `;
                html+=html_segment;
            });
            AnwserContainer.innerHTML = html;
            user_tags[index_question_hashmap[index_question]] = [];
        }
    })
}



function NextQuestion() {
    const AnswerDiv = document.getElementById('answer-container').children;
    let answer_array = [];
    let question_tag = index_question_hashmap[index_question];


    // if (nb_answer_question == "single") {
    //     let nb_checked = 0;
    //     for (let i = 0; i < AnswerDiv.length; i++) {
    //         if (AnswerDiv[i].classList.contains("is-checked")) {
    //             i++;
    //             console.log(AnswerDiv[i].innerText)
    //         }
    //     }
    //     if (nb_checked != 1) {
    //         alert("You need to select 1 answer for this question !")
    //         return false;
    //     }
    // }
    for (let i = 0; i < AnswerDiv.length; i++) {
        if (AnswerDiv[i].classList.contains("is-checked")) {
            user_tags[question_tag].push(AnswerDiv[i].innerHTML);
        }
    }
    LoadNextQuestion();
    QuickResult();
}

function SkipQuestion() {
    LoadNextQuestion();
    QuickResult;
}

function PreviousQuestion() {
    LoadPreviousQuestion();
    QuickResult();
}

function CheckAnswer(element) {
    if (!element.classList.contains("is-checked")) {
        if (nb_answer_question == "single") {
            AnswerDiv = document.getElementById("answer-container").children;
            for (let i = 0; i < AnswerDiv.length; i++) {
                if (AnswerDiv[i].classList.contains("is-checked")) {
                    AnswerDiv[i].classList.remove("is-checked");
                }
            }
        }
    }
    element.classList.toggle("is-checked");
}


function NbQuestionActions() {
    if (index_question == 0) {
        document.querySelector('.back-button').classList.add("dark");
    } else {
        document.querySelector('.back-button').classList.remove("dark");
    }
    if (index_question == nb_question-1) {
        document.querySelector('.next-button').classList.add("hide");
        document.querySelector('.result-button').classList.remove("hide");
    } else {
        document.querySelector('.next-button').classList.remove("hide");
    }
}

LoadNextQuestion();
QuickResult();